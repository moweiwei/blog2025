import type { Post } from "./types.js";

export interface TaxonomyGroup {
  label: string;
  id: string;
  count: number;
  posts: Post[];
}

const slugify = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const base = trimmed
    .toLowerCase()
    .replace(/[\s/|]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || encodeURIComponent(trimmed);
};

/**
 * 将 frontmatter 中的分类/标签字段归一化
 */
export const normalizeTaxonomyField = (
  value?: string | string[]
): string[] => {
  if (!value) return [];
  const list = Array.isArray(value)
    ? value
    : String(value)
        .split(/[\/,|]/)
        .map((item) => item.trim());

  const seen = new Set<string>();
  const normalized: string[] = [];
  list.forEach((item) => {
    const name = item.trim();
    if (!name || seen.has(name)) return;
    seen.add(name);
    normalized.push(name);
  });
  return normalized;
};

export function buildTaxonomy(
  posts: Post[],
  field: "categories" | "tags"
): TaxonomyGroup[] {
  const map = new Map<string, TaxonomyGroup>();

  posts.forEach((post) => {
    const values = post[field] ?? [];
    values.forEach((raw) => {
      const label = raw.trim();
      if (!label) return;
      const group = map.get(label);
      if (group) {
        group.count += 1;
        group.posts.push(post);
        return;
      }
      map.set(label, {
        label,
        id: slugify(label),
        count: 1,
        posts: [post],
      });
    });
  });

  return Array.from(map.values())
    .map((group) => ({
      ...group,
      posts: group.posts
        .slice()
        .sort((a, b) => b.date.time - a.date.time),
    }))
    .sort(
      (a, b) =>
        b.count - a.count ||
        a.label.localeCompare(b.label, undefined, {
          sensitivity: "base",
          numeric: true,
        })
    );
}
