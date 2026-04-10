import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-rose-200">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/40 via-rose-50/40 to-slate-50/80 pointer-events-none" />
      
      <header className="relative z-10 sticky top-0 backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              성남시 생활정보
            </span>
          </Link>
          <div className="flex gap-4">
            <Link href="/blog" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white/80 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              블로그
            </Link>
            <Link href="/about" className="text-sm font-extrabold text-orange-500 bg-orange-50 px-4 py-2 rounded-full border border-orange-100 shadow-sm">
              소개
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto w-full px-6 py-16 space-y-12">
        <section className="bg-white/70 backdrop-blur-md rounded-[32px] p-8 sm:p-12 shadow-sm border border-white/60 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 line-height-tight">
              성남시 생활정보 사이트 소개
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              우리 동네의 유용한 정보를 가장 빠르고 정확하게 전달하기 위해 노력합니다.
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-200/60">
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                🎯 운영 목적
              </h2>
              <p className="text-slate-600 leading-loose font-medium">
                복잡하고 흩어져 있는 성남시의 축제, 행사, 그리고 시민들을 위한 다양한 복지/지원금 혜택을 
                한곳에 모아 알기 쉽게 정리하여 제공하는 것이 본 사이트의 목적입니다. 
                주민들의 삶의 질을 높이는 유용한 가교 역할을 지향합니다.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                📊 데이터 출처
              </h2>
              <p className="text-slate-600 leading-loose font-medium">
                본 사이트에서 제공하는 정보는 **대한민국 공공데이터포털(data.go.kr)**의 
                공식 API 데이터를 바탕으로 수집됩니다. 신뢰할 수 있는 기관의 데이터를 사용하여 
                사실에 기반한 정보를 제공하고자 최선을 다하고 있습니다.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                🤖 콘텐츠 생성 방식
              </h2>
              <p className="text-slate-600 leading-loose font-medium">
                매일 수집되는 수많은 공공서비스 정보 중 성남 시민에게 꼭 필요한 소식을 선별하기 위해 
                **최신 AI 기술(Google Gemini)**을 활용하고 있습니다. 수집된 방대한 데이터를 
                독자가 읽기 편한 친근한 어투로 가공하여 매일 자동으로 업데이트합니다.
              </p>
            </div>
          </div>

          <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 mt-10">
            <p className="text-sm text-orange-700 font-semibold leading-relaxed">
              ※ 본 사이트는 공공데이터를 활용한 개인 프로젝트이며, 성남시청 공식 홈페이지가 아닙니다. 
              정확한 신청 절차 및 상세 사항은 반드시 각 정보 하단에 제공되는 '원문 확인' 링크를 통해 한 번 더 확인해 주시기 바랍니다.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
