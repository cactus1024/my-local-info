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
    // [1단계] 공공데이터포털 API에서 최신 데이터 검색 (최대 5페이지까지)
    let items = [];
    let targetPage = 1;
    let foundLocal = false;

    while (targetPage <= 5 && !foundLocal) {
      console.log(`${targetPage}페이지 검색 중...`);
      const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=${targetPage}&perPage=100&returnType=JSON&serviceKey=${encodeURIComponent(API_KEY)}`;
      const res = await fetch(url);
      if (!res.ok) break;
      const data = await res.json();
      const pageItems = data.data || [];
      
      const checkKeyword = (item, keyword) => {
        const str = `${item.서비스명 || ''} ${item.서비스목적요약 || ''} ${item.지원대상 || ''} ${item.소관기관명 || ''}`;
        return str.includes(keyword);
      };

      // 성남/경기 데이터가 있는지 확인
      const localItems = pageItems.filter(item => checkKeyword(item, '성남') || checkKeyword(item, '경기'));
      if (localItems.length > 0) {
        items = localItems;
        foundLocal = true;
      } else if (targetPage === 1) {
        // 첫 페이지에서 없으면 일단 보관 (나중에 최신순으로 쓰기 위함)
        items = pageItems;
      }
      targetPage++;
    }

    // [최신순 정렬 및 필터링] 수정일시 기준 정렬
    items.sort((a, b) => (b.수정일시 || '0') - (a.수정일시 || '0'));

    // 날짜 필터링: 최근 3개월 이내 데이터만 (토큰 절약)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const thresholdDateStr = threeMonthsAgo.toISOString().replace(/-/g, '').slice(0, 8);

    let filteredItems = items.filter(item => {
      const isRecent = (item.수정일시 || '0').slice(0, 8) >= thresholdDateStr;
      return isRecent;
    });

    if (filteredItems.length === 0) {
      console.log('최근 3개월 이내의 신규 데이터가 없습니다.');
      process.exit(0);
    }

    // [2단계] 기존 데이터와 비교 (ID 및 이름 중복 체크)
    let localData = { events: [], benefits: [] };
    if (fs.existsSync(JSON_FILE_PATH)) {
      const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
      localData = JSON.parse(fileContent);
    }

    localData.events = localData.events || [];
    localData.benefits = localData.benefits || [];

    const existingNames = new Set([
      ...localData.events.map(e => e.name),
      ...localData.benefits.map(b => b.name)
    ]);
    
    const existingLinks = new Set([
        ...localData.events.map(e => e.link),
        ...localData.benefits.map(b => b.link)
    ]);

    // 진짜 새로운 항목만 선별
    const newItems = filteredItems.filter(item => 
        !existingNames.has(item.서비스명) && 
        !existingLinks.has(item.상세조회URL)
    );

    if (newItems.length === 0) {
      console.log('이미 수집된 데이터들입니다.');
      process.exit(0);
    }

    // 가장 최신이며 지역 색이 강한 항목 1건 선택
    const rawTargetItem = newItems[0];

    // [3단계] Gemini AI로 새 항목 가공 (팩트 중심 지침 강화)
    const prompt = `당신은 공공기관 정보를 시민에게 전달하는 팩트 체크 전문 기자입니다. 
제공된 원본 데이터의 내용을 바탕으로만 JSON을 생성하세요. 

지시사항:
1. 'name' 필드에는 원본의 '서비스명'을 그대로 넣으세요.
2. 'category'는 '행사'(공연,전시,축제) 또는 '혜택'(지원금,서비스) 중 하나로 분류하세요.
3. 'startDate', 'endDate'는 내용에서 날짜를 찾아 YYYY-MM-DD 형식으로 적으세요. (모르면 '상시')
4. 'summary'는 '지원내용'을 바탕으로 60자 이내로 요약하세요.
5. 오직 JSON 형식으로만 답변하세요. 다른 설명은 생략하세요.

형식 예시:
{
  "name": "실제 서비스명",
  "category": "혜택",
  "startDate": "2026-01-01",
  "endDate": "상시",
  "location": "기관명",
  "target": "대상 요약",
  "summary": "내용 요약",
  "link": "URL"
}

원본 데이터:
${JSON.stringify(rawTargetItem, null, 2)}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_KEY}`;
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiRes.ok) throw new Error(`Gemini API Error: ${geminiRes.status}`);
    
    const geminiData = await geminiRes.json();
    let aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    aiText = aiText.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();

    const processedItem = JSON.parse(aiText);

    // [4단계] 교차 검증 (Data Integrity Check)
    console.log(`[검증] 원본: ${rawTargetItem.서비스명} vs AI: ${processedItem.name}`);
    
    // 팩트 체크: AI가 엉뚱한 예시 문구(실제 서비스명 등)를 그대로 썼는지 확인
    const isPlaceholderUsed = processedItem.name.includes('실제 서비스명');
    const isNameValid = !isPlaceholderUsed && (processedItem.name.length > 2 && rawTargetItem.서비스명.includes(processedItem.name.slice(0, 3)));
    const isLinkValid = processedItem.link === rawTargetItem.상세조회URL;

    if (!isNameValid || !isLinkValid) {
      console.warn('팩트 검증 실패. 원본과 데이터가 일치하지 않거나 예시 문구가 포함되어 수집을 중단합니다.');
      process.exit(1);
    }

    // [5단계] 기존 데이터에 추가
    const allIds = [
      ...localData.events.map(e => e.id || 0),
      ...localData.benefits.map(b => b.id || 0)
    ].map(id => {
        if (typeof id === 'string') return parseInt(id.replace(/[^0-9]/g, ''));
        return id;
    });
    
    const maxId = allIds.length > 0 ? Math.max(...allIds.filter(n => !isNaN(n))) : 0;
    processedItem.id = (processedItem.category === '행사' ? 'e' : 'b') + (maxId + 1);

    if (processedItem.category === '행사') {
      localData.events.push(processedItem);
    } else {
      localData.benefits.push(processedItem);
    }

    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(localData, null, 2), 'utf-8');
    console.log('팩트 검증 완료 및 저장 성공:', processedItem.name);

  } catch (error) {
    console.error('오류 발생:', error.message);
    process.exit(1);
  }
}

main();
