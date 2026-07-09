import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
// 💡 지워진 옛날 파일 대신, 우리가 새로 만든 금융 데이터 파일을 불러옵니다.
import marketData from '../../public/data/market-data.json';

export default function Home() {
  // 새 JSON 구조에 맞게 데이터를 구조 분해 할당합니다.
  const { date, macro, korean_market_news, focus_sector, memo } = marketData;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="text-center space-y-4 pt-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Runvestlab 트레이딩 OS
          </h1>
          <p className="text-gray-500 font-medium">
            {date} 기준 마켓 브리핑 및 실전 타점
          </p>
        </header>

        {/* 구글 애드센스 등 광고 배너 컴포넌트 유지 */}
        <AdBanner />

        <div className="grid md:grid-cols-2 gap-6">
          {/* 섹션 1: 글로벌 매크로 */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-5 text-blue-600">🌎 글로벌 매크로</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-500">원/달러 환율</span> 
                <span className="font-bold text-gray-900">{macro.원달러_환율}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-500">나스닥 지수</span> 
                <span className="font-bold text-gray-900">{macro.나스닥_지수}</span>
              </li>
              <li className="pt-2">
                <span className="block font-semibold text-gray-500 mb-1">핵심 이슈</span> 
                <span className="text-sm bg-blue-50 text-blue-800 px-3 py-2 rounded-lg block">
                  {macro.핵심_매크로_이슈}
                </span>
              </li>
            </ul>
          </section>

          {/* 섹션 2: 국내 증시 포커스 */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-5 text-red-600">🇰🇷 국장 수급 포커스</h2>
            
            <div className="mb-6">
              <span className="block font-semibold text-gray-500 mb-2">오늘의 특징 테마</span>
              <p className="font-bold text-gray-900 text-lg">{focus_sector}</p>
            </div>

            <div className="mb-4">
              <span className="block font-semibold text-gray-500 mb-2">실시간 핵심 뉴스</span>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                {korean_market_news.map((news: string, idx: number) => (
                  <li key={idx}>{news}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="block font-semibold text-gray-500 mb-1">트레이더 메모</span>
              <p className="text-sm font-medium text-red-500">{memo}</p>
            </div>
          </section>
        </div>

        <div className="text-center pt-10 pb-20">
          <Link 
            href="/blog" 
            className="inline-block bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 transition-all hover:-translate-y-1"
          >
            🎯 AI 퀀트 전략 브리핑 전체 보기
          </Link>
        </div>

      </div>
    </main>
  );
}
