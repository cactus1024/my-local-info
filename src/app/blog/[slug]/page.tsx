import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-rose-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.summary,
            "datePublished": post.date,
            "author": {
              "@type": "Organization",
              "name": "생활속 알짜 정보"
            },
            "publisher": {
              "@type": "Organization",
              "name": "생활속 알짜 정보"
            }
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
                "item": "https://my-local-info-9r3.pages.dev"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "블로그",
                "item": "https://my-local-info-9r3.pages.dev/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://my-local-info-9r3.pages.dev/blog/${slug}`
              }
            ]
          })
        }}
      />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/40 via-rose-50/40 to-slate-50/80 pointer-events-none" />

      <header className="relative z-10 sticky top-0 backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              성남시 생활정보
            </span>
          </Link>
          <div className="flex gap-3">
            <Link href="/blog" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white/80 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              목록으로
            </Link>
            <Link href="/about" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white/80 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              소개
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto w-full px-6 py-16">
        <article className="bg-white/70 backdrop-blur-md rounded-[32px] p-8 sm:p-12 shadow-sm border border-white/60">
          <div className="mb-10 text-center border-b border-slate-200/60 pb-10">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex justify-center items-center gap-3">
                <span className="text-xs font-extrabold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                  {post.category}
                </span>
                <time className="text-sm font-semibold text-slate-400">{post.date}</time>
              </div>
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Last Updated: {post.date}</p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-[17px] text-slate-500 font-medium leading-relaxed">{post.summary}</p>
          </div>

          <div className="prose prose-slate prose-orange max-w-none prose-headings:font-extrabold prose-a:text-orange-500 font-medium leading-loose mb-12">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {post.link && post.link !== '#' && (
            <div className="pt-10 border-t border-slate-100 space-y-4">
              <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <span className="text-base">🔗</span> 원문 출처 및 상세 정보
              </p>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-black text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-md hover:shadow-xl active:scale-95"
              >
                공식 홈페이지에서 확인하기
                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          )}

          {/* 광고 영역 */}
          <AdBanner />
          <CoupangBanner />

          <div className="mt-16 bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              💡 **안내:** 이 글은 공공데이터포털(data.go.kr)의 공식 정보를 바탕으로 AI가 핵심 내용을 요약 및 재구성하여 작성하였습니다.
              내용의 정확성을 기하고자 노력했으나, 변동 사항이 있을 수 있으므로 반드시 **원문 링크**를 통해 최종 확인을 부탁드립니다.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
