const fs = require('fs');
const path = require('path');

const GEMINI_KEY = process.env.GEMINI_API_KEY;
// 💡 변경점 1: 앞으로 가져올 주식/금융 데이터를 담을 파일명으로 변경했습니다.
const JSON_FILE_PATH = path.join(__dirname, '../public/data/market-data.json');
const POSTS_DIR = path.join(__dirname, '../src/content/posts');

async function main() {
  if (!GEMINI_KEY) {
    console.error('GEMINI_API_KEY is missing in environment variables.');
    process.exit(1);
  }

  try {
    // [1단계] 최신 데이터 확인
    if (!fs.existsSync(JSON_FILE_PATH)) {
      console.log('시장 데이터 파일이 없습니다. fetch 스크립트를 먼저 실행해주세요.');
      process.exit(0);
    }

    const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    const marketData = JSON.parse(fileContent);

    if (!marketData || Object.keys(marketData).length === 0) {
      console.log('가져올 금융 데이터가 없습니다.');
      process.exit(0);
    }

    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
    }

    // 💡 변경점 2: 오늘 날짜(YYYY-MM-DD)로 시작하는 파일이 있으면 중복으로 판단하도록 훨씬 깔끔하게 개선했습니다.
    const today = new Date().toISOString().split('T')[0];
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
    const alreadyExists = files.some(file => file.startsWith(today));

    if (alreadyExists) {
      console.log(`오늘(${today})자 시황 브리핑 글이 이미 작성되어 있습니다.`);
      process.exit(0);
    }

    // [2단계] Gemini AI로 블로그 글 생성 (런베스트랩 슈퍼 메가 프롬프트)
    const prompt = `[시스템 역할 부여]
너는 여의도 탑티어 퀀트 트레이더이자, 개인의 노후 자금 운용을 설계하는 연금/ETF 최고 권위자야.
너의 목표는 내가 제공하는 [Raw Data]를 바탕으로, 직장인 투자자들이 출퇴근길에 읽고 바로 실전에 적용할 수 있는 수준의 치밀하고 전략적인 블로그 포스팅을 작성하는 거야.

[절대 원칙: Anti-Hallucination & Fact-Checking]
1. 팩트 기반 한정: 반드시 제공된 [Raw Data]와 네가 자체 구글 검색(Search Grounding)을 통해 교차 검증한 정보만 사용할 것. 
2. 소설 작성 엄격 금지: 불확실한 수치, 확인되지 않은 찌라시 호재는 절대 지어내지 마. 데이터가 부족하면 억지로 쓰지 말고 "현재 확인된 명확한 팩트가 없다"고 당당하게 명시할 것.
3. 명확한 출처 강제: 주가 급등 사유, 경제 지표, ETF 보수율 등 핵심 데이터 뒤에는 반드시 '(출처: 000 매체명 또는 공공기관명, 0000년 00월 00일)' 형식으로 팩트의 근거를 달아줄 것.
4. 숫자 및 범위 표기 규칙: 가격이나 날짜의 구간을 설명할 때는 기호(물결표)를 절대 사용하지 말고, "24,500원에서 25,800원 사이"처럼 구어체 "에서"로 명확하게 풀어서 작성할 것.

[Raw Data]
${JSON.stringify(marketData, null, 2)}

위 데이터를 바탕으로 아래 마크다운 형식으로 포스팅을 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이 작성해:

---
---
title: "(검색 유입이 잘 되는 매력적인 주식/연금 관련 제목. 반드시 양끝을 큰따옴표로 감싸서 출력할 것)"
date: ${today}
summary: "(오늘 증시 및 연금 전략에 대한 핵심 한 줄 요약. 콜론이나 쉼표가 있을 수 있으니 여기도 큰따옴표로 감쌀 것)"
category: 투자전략
tags: [주식, 미국증시, ETF, 퇴직연금, 종가베팅]
link: #
---

# 오늘의 런베스트랩: 글로벌 매크로와 실전 타점, 그리고 연금 전략

## 1. 🇺🇸 월가 마감 브리핑 & 🇰🇷 국장 시초가 전략
* 간밤의 미 증시 핵심 지표(달러 인덱스, 국채 금리, 주요 지수)를 팩트 베이스로 3줄 요약할 것.
* 필라델피아 반도체 지수 등 미 증시를 주도한 섹터가 오늘 한국 증시의 외국인 수급에 미칠 영향을 논리적으로 연결할 것.
* 장 초반 킬존(Killzone, 9시에서 10시 구간)에 거래 대금이 쏠릴 것으로 예상되는 주도 테마를 제시할 것.

## 2. 🎯 오늘의 특징주 & 실전 매매 타점 분석
* 당일 [Raw Data]에 포함된 특징주 중 가장 의미 있는 1에서 2종목을 선정하여 상세한 상승 이유(공시, 수급 등)를 분석할 것.
* 단순 뉴스 요약을 넘어 트레이더 관점에서 분석할 것. 차트상 의미 있는 페어 밸류 갭(FVG) 발생 여부나, 양음양 패턴 및 트랩(Trap) 하락 후 반등 가능성을 논리적으로 짚어줄 것.
* "무조건 사라"는 식의 표현은 배제하고, "32,000원에서 33,500원 구간에서 지지가 나올 경우 종가 베팅 관점 유효" 같은 식으로 철저히 시나리오 기반의 전략을 제시할 것.

## 3. 🏦 롱테일 자산 증식: ETF & 퇴직연금 실전 가이드
* 현재 글로벌 매크로 트렌드에 맞는 ETF(국내 상장 해외 ETF 등) 1종목을 선정해 구성 종목과 총보수를 정확한 수치로 분석할 것.
* 해당 ETF를 IRP(개인형 퇴직연금)나 DC형 계좌에서 모아갈 때 얻을 수 있는 세액공제 혜택과 과세이연 효과를 직장인 눈높이에서 구체적으로 설명할 것.

마지막 줄에 FILENAME: ${today}-market-briefing 형식으로 파일명도 출력해줘.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_KEY}`;
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

    // 마크다운 블록 제거
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

    console.log('투자 브리핑 블로그 글 생성 완료:', filename);

  } catch (error) {
    console.error('실행 중 에러가 발생했습니다. 기존 파일을 유지합니다.', error);
    process.exit(1);
  }
}

main();
