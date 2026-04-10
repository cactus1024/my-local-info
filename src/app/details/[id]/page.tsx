import Link from 'next/link';
import localData from '../../../../public/data/local-info.json';

// Next.js App Router Static Export를 위한 파라미터 생성
export async function generateStaticParams() {
  const events = localData.events.map((e) => ({ id: e.id }));
  const benefits = localData.benefits.map((b) => ({ id: b.id }));
  return [...events, ...benefits];
}

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 데이터 찾기
  const item = [...localData.events, ...localData.benefits].find((i) => i.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">페이지를 찾을 수 없습니다 😢</h1>
        <Link href="/" className="text-orange-500 hover:text-orange-600 font-bold bg-orange-50 px-6 py-3 rounded-xl transition-colors">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const isEvent = item.category === "행사";
  
  // 테마 색상 동적 바인딩 방지 (Tailwind는 전체 문자열 필요)
  const theme = isEvent ? {
    bgGradient: "from-orange-100/40 via-rose-50/40",
    textBold: "text-orange-600",
    bgMuted: "bg-orange-50",
    borderSubtle: "border-orange-100",
    btnSolid: "bg-orange-500 hover:bg-orange-600",
    emoji: "🎪",
  } : {
    bgGradient: "from-emerald-100/40 via-teal-50/40",
    textBold: "text-emerald-600",
    bgMuted: "bg-emerald-50",
    borderSubtle: "border-emerald-100",
    btnSolid: "bg-emerald-500 hover:bg-emerald-600",
    emoji: "🎁",
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-slate-200`}>
      {/* 백그라운드 그라데이션 */}
      <div className={`fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme.bgGradient} to-slate-50/80 pointer-events-none`} />

      {/* 헤더 */}
      <header className="relative z-10 sticky top-0 backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center">
          <Link href="/" className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2 font-bold text-[15px] bg-white/70 px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            홈으로 돌아가기
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto w-full px-6 py-8 md:py-16">
        <article className="bg-white/80 backdrop-blur-md rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 relative overflow-hidden">
          
          {/* 장식용 빛 */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-slate-100 rounded-full blur-[80px] opacity-60 pointer-events-none" />

          {/* 뱃지와 카테고리 */}
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <span className={`text-sm font-extrabold ${theme.textBold} ${theme.bgMuted} px-4 py-2 rounded-xl border ${theme.borderSubtle}`}>
              {theme.emoji} {item.category}
            </span>
          </div>

          {/* 메인 타이틀 */}
          <h1 className="relative z-10 font-extrabold text-3xl md:text-5xl text-slate-900 mb-10 leading-tight">
            {item.name}
          </h1>

          {/* 인포메이션 그리드 */}
          <div className="relative z-10 flex flex-col gap-0 bg-slate-50/80 border border-slate-200/60 rounded-[24px] mb-12 overflow-hidden shadow-sm">
            {item.startDate && item.endDate && (
              <div className="flex items-start gap-4 p-5 md:p-6 bg-white/50">
                <span className="text-2xl mt-0.5 opacity-80">🗓️</span>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1.5 tracking-wide">기간 및 기한</p>
                  <p className="text-slate-800 font-bold text-lg">{item.startDate} ~ {item.endDate}</p>
                </div>
              </div>
            )}
            <div className="border-t border-slate-200/50" />
            <div className="flex items-start gap-4 p-5 md:p-6 bg-white/50">
              <span className="text-2xl mt-0.5 opacity-80">📍</span>
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1.5 tracking-wide">장소 및 방법</p>
                <p className="text-slate-800 font-bold text-lg">{item.location}</p>
              </div>
            </div>
            <div className="border-t border-slate-200/50" />
            <div className="flex items-start gap-4 p-5 md:p-6 bg-white/50">
              <span className="text-2xl mt-0.5 opacity-80">🎯</span>
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1.5 tracking-wide">지원 대상</p>
                <p className="text-slate-800 font-bold text-lg">{item.target}</p>
              </div>
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="relative z-10 mb-14">
            <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
              📝 상세 안내
            </h3>
            <div className="text-slate-600 font-medium leading-[1.8] whitespace-pre-line text-lg bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              {item.summary}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex-1 text-center ${theme.btnSolid} text-white font-extrabold py-4 px-6 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 text-lg flex justify-center items-center gap-2`}
            >
              원본 사이트에서 자세히 보기
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
            
            <Link 
              href="/"
              className="sm:w-1/3 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-2xl transition-all duration-300 text-lg hover:-translate-y-1"
            >
              목록으로
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
