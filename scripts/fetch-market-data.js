const fs = require('fs');
const path = require('path');
const https = require('https');

// 저장할 경로 설정 (방금 생성 스크립트에서 읽어갈 위치)
const DATA_DIR = path.join(__dirname, '../public/data');
const JSON_FILE_PATH = path.join(DATA_DIR, 'market-data.json');

// HTTP GET 요청을 Promise로 감싼 유틸리티 함수
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          // JSON 파싱 에러 또는 텍스트 데이터(RSS 등)일 경우 텍스트 그대로 반환
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('시장 데이터 수집을 시작합니다...');

  try {
    // 1. 글로벌 매크로 데이터 수집 (야후 파이낸스 API 활용 - 환율, 나스닥, S&P500)
    const krwUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?interval=1d&range=1d';
    const ndxUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/^IXIC?interval=1d&range=1d';
    
    const [krwRes, ndxRes] = await Promise.all([
      fetchJson(krwUrl),
      fetchJson(ndxUrl)
    ]);

    const exchangeRate = krwRes.chart?.result?.[0]?.meta?.regularMarketPrice || '데이터 없음';
    const nasdaq = ndxRes.chart?.result?.[0]?.meta?.regularMarketPrice || '데이터 없음';

    // 2. 국내 증시 뉴스 및 특징주 헤드라인 (네이버 금융 주요 뉴스 RSS 활용)
    // 참고: 실제 자동화 시에는 cheerio 모듈을 활용한 크롤링 코드로 확장하면 훨씬 정교해집니다.
    const newsUrl = 'https://api.hankyung.com/finance/news/main'; 
    // 위 URL은 예시용 더미 엔드포인트 구조입니다. 실제로는 네이버 금융 크롤링이나 오픈 API를 연동합니다.
    const todayNews = [
      "외국인 거래소 5000억 순매수... 반도체 투톱 주도",
      "금투세 폐지 기대감에 개인 투자자 증시 대거 복귀",
      "장 마감 후 시간외 단일가에서 전력설비 테마 급등, 수주 공시 영향"
    ];

    // 3. AI에게 던져줄 Raw Data 조립
    const marketData = {
      date: new Date().toISOString().split('T')[0],
      macro: {
        "원달러_환율": exchangeRate,
        "나스닥_지수": nasdaq,
        "핵심_매크로_이슈": "미 국채 금리 안정화 및 달러 강세 진정 국면"
      },
      korean_market_news: todayNews,
      focus_sector: "AI 전력 인프라, 바이오, 주주환원 밸류업 테마",
      memo: "장 초반 9시에서 10시 킬존 수급 쏠림 확인 요망"
    };

    // 4. JSON 파일로 저장
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(marketData, null, 2), 'utf-8');
    console.log(`성공적으로 시장 데이터를 수집하여 저장했습니다: ${JSON_FILE_PATH}`);

  } catch (error) {
    console.error('시장 데이터 수집 중 치명적인 에러가 발생했습니다:', error);
    process.exit(1);
  }
}

main();
