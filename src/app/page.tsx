import Link from 'next/link';
import localData from '../../public/data/local-info.json';

export default function Home() {
  const { events, benefits } = localData;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-rose-200">
      {/* 은은하게 깔리는 모던한 그라데이션 배경 */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/40 via-rose-50/40 to-slate-50/80 pointer-events-none" />

      {/* 헤더 */}
      <header className="relative z-10 sticky top-0 backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              성남시 생활정보
            </span>
          </h1>
          <button className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white/80 px-4 py-2 rounded-full shadow-sm border border-slate-100">
            소식 받기
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-12 space-y-20">
        
        {/* 인트로 메세지 */}
        <section className="text-center space-y-5 max-w-2xl mx-auto pt-4 pb-2">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            우리 동네 소식, <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-400">
              한눈에 쏙
            </span>
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            가족 나들이부터 꼭 챙겨야 할 혜택까지, <br className="hidden md:block" />
            놓칠 수 없는 주요 정보를 가장 빠르게 정리해 드려요.
          </p>
        </section>

        {/* 행사/축제 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <span className="text-2xl">🎪</span> 다가오는 행사 & 축제
            </h3>
            <span className="text-sm font-bold text-orange-600 bg-orange-50/80 px-3.5 py-1.5 rounded-full border border-orange-100 shadow-sm backdrop-blur-sm">
              {events.length}개의 일정
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((item) => (
              <Link 
                href={`/details/${item.id}`}
                key={item.id} 
                className="group block bg-white/70 backdrop-blur-md rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-extrabold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.startDate}
                  </span>
                </div>
                
                <h4 className="font-extrabold text-xl text-slate-800 mb-3 leading-snug group-hover:text-orange-500 transition-colors">
                  {item.name}
                </h4>
                
                <div className="text-sm font-medium text-slate-500 space-y-2.5 mb-5">
                  <p className="flex items-center gap-2">
                    <span className="text-lg">📍</span> {item.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-lg">👥</span> {item.target}
                  </p>
                </div>
                
                <p className="text-sm text-slate-500 bg-slate-50/50 p-4 rounded-2xl mb-6 leading-relaxed flex-grow border border-slate-100/50 line-clamp-3">
                  {item.summary}
                </p>
                
                <div className="mt-auto flex items-center justify-center gap-2 w-full bg-white group-hover:bg-orange-500 text-slate-700 group-hover:text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-sm border border-slate-200 group-hover:border-transparent">
                  상세 내용 보기
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 지원금/혜택 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-8 border-t border-slate-200/60 pt-16">
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <span className="text-2xl">🎁</span> 알아두면 든든한 혜택
            </h3>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50/80 px-3.5 py-1.5 rounded-full border border-emerald-100 shadow-sm backdrop-blur-sm">
              {benefits.length}개의 혜택
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((item) => (
              <Link 
                href={`/details/${item.id}`}
                key={item.id} 
                className="group block relative overflow-hidden bg-white/70 backdrop-blur-md p-8 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                {/* 우측 상단의 은은한 빛(Glow) 효과 */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:scale-150 transition-transform duration-700" />

                <div className="relative z-10 flex justify-between items-center mb-6">
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm">
                    신청기한: {item.endDate}
                  </span>
                </div>
                
                <h4 className="relative z-10 font-extrabold text-2xl text-slate-800 mb-4 leading-tight group-hover:text-emerald-500 transition-colors">
                  {item.name}
                </h4>
                
                <p className="relative z-10 text-slate-500 font-medium mb-8 text-[15px] leading-relaxed flex-grow">
                  {item.summary}
                </p>
                
                <div className="relative z-10 bg-slate-50/80 rounded-2xl p-5 mb-8 space-y-4 border border-slate-100/50">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mt-0.5">
                      <span className="text-lg leading-none block">🎯</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1">지원 대상</p>
                      <p className="text-sm font-bold text-slate-700">{item.target}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pt-4 border-t border-slate-200/60">
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mt-0.5">
                      <span className="text-lg leading-none block">🏢</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1">신청 방법</p>
                      <p className="text-sm font-bold text-slate-700">{item.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mt-auto block text-center w-full bg-slate-800 group-hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:-translate-y-0.5 text-[15px]">
                  상세 안내 및 알아보기
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="relative z-10 bg-white/40 border-t border-slate-200/60 py-12 mt-16 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl bg-white p-2 rounded-xl shadow-sm border border-slate-100">📊</span>
            <div>
              <p className="font-extrabold text-slate-700 text-sm">데이터 출처: 공공데이터포털</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">현재 화면은 샘플 안내용 자료입니다.</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm font-bold text-slate-400">마지막 업데이트: 2026.04.10</p>
            <p className="text-xs text-slate-400 font-medium mt-1">© 2026 성남시 생활 정보. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
