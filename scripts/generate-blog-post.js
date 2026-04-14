const fs = require('fs');
const path = require('path');

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const JSON_FILE_PATH = path.join(__dirname, '../public/data/local-info.json');
const POSTS_DIR = path.join(__dirname, '../src/content/posts');

async function main() {
  if (!GEMINI_KEY) {
    console.error('GEMINI_API_KEY is missing in environment variables.');
    process.exit(1);
  }

  try {
    // [1단계] 최신 데이터 확인
    if (!fs.existsSync(JSON_FILE_PATH)) {
      console.log('데이터 파일이 없습니다.');
      process.exit(0);
    }

    const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    const localData = JSON.parse(fileContent);

    const allItems = [
      ...(localData.events || []),
      ...(localData.benefits || [])
    ];

    if (allItems.length === 0) {
      console.log('가져올 데이터가 없습니다.');
      process.exit(0);
    }

    // 배열의 마지막 항목을 최신 항목으로 사용
    const latestItem = allItems[allItems.length - 1];

    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
    }

    // 중복 체크 (파일 컨텐츠 내에 name 포함 여부로 확인)
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
    let alreadyExists = false;
    for (const file of files) {
      const mdContent = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      if (mdContent.includes(latestItem.name)) {
        alreadyExists = true;
        break;
      }
    }

    if (alreadyExists) {
      console.log('이미 작성된 글입니다');
      process.exit(0);
    }

    // [2단계] Gemini AI로 블로그 글 생성 (팩트 중심 지침 강화)
    const prompt = `당신은 공공기관 정보를 시민들에게 친절하고 정확하게 전달하는 전문 블로거입니다. 
제공된 공공데이터 정보를 바탕으로 포스팅을 작성해 주세요.

**주의사항 (필수 지침):**
1. 반드시 제공된 데이터의 **팩트(Fact)**에 기반하여 작성하세요. 
2. 지원 대상, 신청 방법, 혜택 내용 등 핵심 정보를 절대 지어내거나 왜곡하지 마세요.
3. 정보가 부족한 경우 추측하지 말고 '관할 기관에 문의'하거나 '공고문 확인'이 필요하다고 명시하세요.

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: (오늘 날짜 YYYY-MM-DD)
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
link: ${latestItem.link || '#'}
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 상세 지원 내용 및 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`;
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(`Gemini API Error: ${geminiRes.status} ${errText}`);
    }

    const geminiData = await geminiRes.json();
    let aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // 마크다운 블록 제거 (혹시나 추가될 경우 대비)
    aiText = aiText.replace(/^```[a-zA-Z]*\n?/gm, '').replace(/```$/gm, '').trim();

    // FILENAME 추출
    const filenameMatch = aiText.match(/FILENAME:\s*([^\s]+)/);
    if (!filenameMatch) {
      throw new Error('응답에서 FILENAME을 찾을 수 없습니다.');
    }

    let filename = filenameMatch[1];
    if (!filename.endsWith('.md')) {
      filename += '.md';
    }

    // 파일 본문에서 FILENAME 줄 제거
    const finalContent = aiText.replace(/FILENAME:\s*[^\s]+/, '').trim();

    // [3단계] 파일 저장
    const filePath = path.join(POSTS_DIR, filename);
    fs.writeFileSync(filePath, finalContent, 'utf-8');

    console.log('블로그 글 생성 완료:', filename);

  } catch (error) {
    console.error('실행 중 에러가 발생했습니다. 기존 파일을 유지합니다.', error);
    process.exit(1);
  }
}

main();
