const fs = require('fs');
const path = require('path');

const API_KEY = process.env.PUBLIC_DATA_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const JSON_FILE_PATH = path.join(__dirname, '../public/data/local-info.json');

async function main() {
  if (!API_KEY || !GEMINI_KEY) {
    console.error('API keys are missing in environment variables.');
    process.exit(1);
  }

  try {
    // [1단계] 공공데이터포털 API에서 데이터 가져오기
    const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(API_KEY)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Public Data API Error: ${res.statusText}`);
    const data = await res.json();
    
    let items = data.data || [];
    
    const checkKeyword = (item, keyword) => {
      const str = `${item.서비스명 || ''} ${item.서비스목적요약 || ''} ${item.지원대상 || ''} ${item.소관기관명 || ''}`;
      return str.includes(keyword);
    };

    // 필터링: "성남", "경기", 전체
    let filteredItems = items.filter(item => checkKeyword(item, '성남'));
    if (filteredItems.length === 0) {
      filteredItems = items.filter(item => checkKeyword(item, '경기'));
    }
    if (filteredItems.length === 0) {
      filteredItems = items;
    }

    // [2단계] 기존 데이터와 비교
    let localData = { events: [], benefits: [] };
    if (fs.existsSync(JSON_FILE_PATH)) {
      const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
      localData = JSON.parse(fileContent);
    }
    
    localData.events = localData.events || [];
    localData.benefits = localData.benefits || [];

    // 기존 이름 수집
    const existingNames = new Set([
      ...localData.events.map(e => e.name),
      ...localData.benefits.map(b => b.name)
    ]);

    // 새로운 항목 찾기
    const newItems = filteredItems.filter(item => !existingNames.has(item.서비스명));
    if (newItems.length === 0) {
      console.log('새로운 데이터가 없습니다');
      process.exit(0);
    }

    // 1건만 선택
    const rawTargetItem = newItems[0];

    // [3단계] Gemini AI로 새 항목 가공
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터:
${JSON.stringify(rawTargetItem, null, 2)}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(`Gemini API Error: ${geminiRes.status} ${geminiRes.statusText} - ${errText}`);
    }
    const geminiData = await geminiRes.json();
    
    let aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // 마크다운 코드블록 제거
    aiText = aiText.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();
    
    const processedItem = JSON.parse(aiText);

    // [4단계] 기존 데이터에 추가
    // 고유 ID 채번
    const allIds = [
      ...localData.events.map(e => e.id || 0),
      ...localData.benefits.map(b => b.id || 0)
    ];
    const maxId = allIds.length > 0 ? Math.max(...allIds) : 0;
    processedItem.id = maxId + 1; // 1씩 증가

    if (processedItem.category === '행사') {
      localData.events.push(processedItem);
    } else {
      localData.benefits.push(processedItem);
    }

    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(localData, null, 2), 'utf-8');
    console.log('새 항목 추가 완료:', processedItem.name);

  } catch (error) {
    console.error('실행 중 에러가 발생했습니다. 기존 데이터를 유지합니다.', error);
    process.exit(1);
  }
}

main();
