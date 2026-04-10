import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags?: string[];
  link?: string;
}

export interface Post extends PostMeta {
  content: string;
}

function formatDate(date: any): string {
  if (date instanceof Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return String(date);
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);
      const { title, date, summary, category, tags, link } = matterResult.data;

      return {
        slug,
        title: title || slug,
        date: formatDate(date || new Date()),
        summary: summary || "",
        category: category || "Uncategorized",
        tags: tags || [],
        link: link || "",
      };
    });

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);
  
  const { title, date, summary, category, tags, link } = matterResult.data;

  return {
    slug,
    title: title || slug,
    date: formatDate(date || new Date()),
    summary: summary || "",
    category: category || "Uncategorized",
    tags: tags || [],
    link: link || "",
    content: matterResult.content,
  };
}
