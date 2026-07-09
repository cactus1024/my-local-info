import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-C63HYT60GB";

// 💡 중복 선언 오류를 해결하고 깔끔하게 메타데이터를 정돈했습니다.
export const metadata: Metadata = {
  title: 'Runvestlab | 퀀트 트레이딩 & 연금 전략 OS',
  description: '직장인을 위한 실전 주식 타점과 글로벌 매크로 분석 브리핑',
  openGraph: {
    title: 'Runvestlab | 퀀트 트레이딩 & 연금 전략 OS',
    description: '직장인을 위한 실전 주식 타점과 글로벌 매크로 분석 브리핑',
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {ADSENSE_ID && ADSENSE_ID !== "나중에_입력" && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {GA_ID && GA_ID !== "나중에_입력" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* 💡 SEO 최적화를 위해 주소를 공식 도메인(runvestlab.com)으로 전면 교체했습니다. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Runvestlab",
              "url": "https://runvestlab.com",
              "description": "직장인을 위한 실전 주식 타점과 글로벌 매크로 분석 브리핑"
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "홈",
                  "item": "https://runvestlab.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "블로그",
                  "item": "https://runvestlab.com/blog"
                }
              ]
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
