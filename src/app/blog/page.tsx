import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function BlogList() {
  const posts = getAllPosts();

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
          <div className="flex gap-3">
            <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white/80 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              홈으로
            </Link>
            <Link href="/about" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white/80 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              소개
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto w-full px-6 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">블로그 소식</h1>
          <p className="text-lg text-slate-500 font-medium">동네의 다양한 소식과 정보를 확인해보세요.</p>
        </div>

        <div className="grid gap-6">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-white/50 rounded-2xl border border-white/60 font-medium">
              아직 작성된 블로그 글이 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.slug}
                className="group block bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-extrabold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                    {post.category}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">{post.date}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-3 group-hover:text-orange-500 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 line-clamp-2 leading-relaxed font-medium">
                  {post.summary}
                </p>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
