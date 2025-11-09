import { createContentLoader } from "vitepress";
import { formatDate } from "./formatDate.js";
import { Post } from "./types.js";

declare const data: Post[];
export { data };

/**
 * 返回 src/posts/ 目录下所有 md 文档信息
 */
export default createContentLoader("posts/**/*.md", {
  transform(rawData): Post[] {
    return rawData
      .map(({ url, frontmatter }) => {
        const rawDate = frontmatter.date ?? frontmatter.updateTime;
        return {
          url,
          frontmatter,
          date: formatDate(rawDate),
        };
      })
      .filter((post) => /.html/.test(post.url) && !post.frontmatter.hidden)
      .sort((a, b) => b.date.time - a.date.time);
  },
});
