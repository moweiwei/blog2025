<template>
  <section
    class="max-w-5xl px-5 py-12 mx-auto my-10 sm:px-8 lg:px-0 rounded-3xl border backdrop-blur vp-themed-card"
  >
    <div class="text-center">
      <p class="text-xs font-semibold tracking-[0.35em] uppercase opacity-70 vp-themed-text">
        Archive
      </p>
      <h1 class="mt-4 text-4xl font-semibold tracking-tight">
        归档
      </h1>
    </div>

    <div class="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_180px] lg:gap-16">
      <div v-if="archiveGroups.length" class="space-y-12">
        <article
          v-for="group in archiveGroups"
          :key="group.year"
          :id="`year-${group.year}`"
          class="relative"
        >
          <span
            class="absolute text-6xl font-semibold tracking-[0.15em] select-none -top-6 left-1 opacity-10 pointer-events-none vp-themed-text"
          >
            {{ group.year }}
          </span>
          <header
            class="flex items-end justify-between border-b pb-3 mb-3 vp-themed-border"
          >
            <h2 class="text-2xl font-semibold z-10">
              {{ group.yearLabel }}
            </h2>
            <p class="text-xs vp-text-subtle">{{ group.posts.length }} 篇</p>
          </header>

          <ul class="mt-4 space-y-3">
            <li
              v-for="post in group.posts"
              :key="post.url"
              class="group flex flex-col gap-2 rounded-2xl border px-4 py-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md vp-themed-card"
            >
              <div class="flex w-full items-start justify-between gap-4">
                <a
                  :href="post.url"
                  class="flex-1 text-base font-medium transition-colors duration-200 group-hover:opacity-100 opacity-90"
                >
                  {{ post.title }}
                </a>
                <time
                  class="text-xs font-semibold tracking-wide rounded-full border px-2 py-0.5 vp-themed-border vp-text-subtle"
                >
                  {{ post.displayDate }}
                </time>
              </div>
              <div
                class="h-px w-full opacity-60"
                :style="{ backgroundColor: 'var(--vp-c-bg-soft)' }"
                aria-hidden="true"
              ></div>
              <p class="text-xs vp-text-subtle">
                收录于 {{ group.yearLabel }}
              </p>
            </li>
          </ul>
        </article>
      </div>
      <p v-else class="text-center vp-text-muted">
        暂无可展示的文章。
      </p>

      <aside class="hidden lg:block">
        <p
          class="text-xs font-semibold pb-3 border-b uppercase tracking-[0.3em] vp-text-muted vp-themed-border"
        >
          当前页面
        </p>
        <nav class="mt-4 pl-4 border-l-2 vp-themed-border space-y-2">
          <a
            v-for="group in archiveGroups"
            :key="group.year"
            :href="`#year-${group.year}`"
            class="block text-sm transition hover:opacity-100 opacity-70 vp-themed-text"
          >
            {{ group.yearLabel }}
          </a>
        </nav>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { data as posts } from "../utils/article.data.ts";
import { fileName2Title } from "../userConfig/translations.ts";

const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
});

const archiveGroups = computed(() => {
  const enriched = posts
    .map((post) => {
      const parsedDate = getPostDate(post);
      if (!parsedDate) return null;
      return {
        post,
        parsedDate,
      };
    })
    .filter((item) => Boolean(item))
    .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());

  const map = new Map();
  enriched.forEach(({ post, parsedDate }) => {
    const year = parsedDate.getFullYear();
    if (!map.has(year)) {
      map.set(year, {
        year,
        yearLabel: `${year}年`,
        posts: [],
      });
    }
    const group = map.get(year);
    if (!group) return;
    group.posts.push({
      url: post.url,
      title: getTitle(post),
      displayDate: monthDayFormatter.format(parsedDate),
      sortTime: parsedDate.getTime(),
    });
  });

  return Array.from(map.values())
    .map((group) => ({
      ...group,
      posts: group.posts.sort((a, b) => b.sortTime - a.sortTime),
    }))
    .sort((a, b) => b.year - a.year);
});

const getPostDate = (post) => {
  const rawDate = post.frontmatter.date ?? post.frontmatter.updateTime;
  if (!rawDate) return null;
  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getTitle = (post) => {
  if (post.frontmatter?.title) return post.frontmatter.title;

  const matches = post.url.match(/.*\/(.*.html)/);
  const fileName = matches && matches[1].replace(".html", "");
  return (fileName && fileName2Title[fileName]) || fileName || "未命名文章";
};
</script>
