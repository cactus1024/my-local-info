"use client";

const COUPANG_ID = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;

export default function CoupangBanner() {
  // 쿠팡 파트너스 ID가 없거나 기본값인 경우 표시하지 않음
  if (!COUPANG_ID || COUPANG_ID === "나중에_입력") {
    return null;
  }

  return (
    <div className="w-full my-8 text-center bg-white/50 border border-slate-100 rounded-2xl p-4 shadow-sm">
      <div className="mb-2">
        <span className="text-[10px] text-slate-400 font-medium">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </span>
      </div>
      {/* 실제 쿠팡 파트너스 배너 코드가 들어갈 자리입니다. */}
      {/* 제공받은 iframe이나 스크립트 코드를 이곳에 삽입하세요. */}
      <div className="flex items-center justify-center min-h-[100px] bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p className="text-sm font-bold text-slate-400">
          쿠팡 파트너스 광고 영역 (ID: {COUPANG_ID})
        </p>
      </div>
    </div>
  );
}
