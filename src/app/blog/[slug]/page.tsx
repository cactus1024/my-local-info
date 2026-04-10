import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
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
              목록으로
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto w-full px-6 py-16">
        <article className="bg-white/70 backdrop-blur-md rounded-[32px] p-8 sm:p-12 shadow-sm border border-white/60">
          <div className="mb-10 text-center border-b border-slate-200/60 pb-10">
            <div className="flex justify-center items-center gap-3 mb-5">
              <span className="text-xs font-extrabold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                {post.category}
              </span>
              <time className="text-sm font-semibold text-slate-400">{post.date}</time>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-[17px] text-slate-500 font-medium leading-relaxed">{post.summary}</p>
          </div>
          
          <div className="prose prose-slate prose-orange max-w-none prose-headings:font-extrabold prose-a:text-orange-500 font-medium leading-loose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}
