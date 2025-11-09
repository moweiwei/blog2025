import { createContentLoader } from "vitepress";
import { formatDate } from "./formatDate.js";
import { normalizeTaxonomyField } from "./taxonomy.js";
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
        const tags = normalizeTaxonomyField(frontmatter.tags);
        const rawCategories = normalizeTaxonomyField(frontmatter.categories);
        const categoriesFallback = rawCategories.length ? rawCategories : tags.slice(0, 1);
        return {
          url,
          frontmatter,
          date: formatDate(rawDate),
          tags,
          categories:
            categoriesFallback.length > 0 ? categoriesFallback : ["未分类"],
        };
      })
      .filter((post) => /.html/.test(post.url) && !post.frontmatter.hidden)
      .sort((a, b) => b.date.time - a.date.time);
  },
});
