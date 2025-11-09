<template>
  <section class="max-w-5xl px-6 py-16 mx-auto my-10 sm:px-8 lg:px-0">
    <div class="text-center">
      <p class="text-sm font-semibold tracking-[0.3em] uppercase text-sky-500/80">
        Archive
      </p>
      <h1 class="mt-3 text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
        归档
      </h1>
    </div>

    <div
      class="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_180px] lg:gap-20 dark:text-slate-100"
    >
      <div v-if="archiveGroups.length" class="space-y-16">
        <article
          v-for="group in archiveGroups"
          :key="group.year"
          :id="`year-${group.year}`"
          class="relative"
        >
          <span
            class="absolute text-7xl font-bold tracking-[0.2em] text-slate-200 dark:text-slate-700 select-none -top-6 left-0 opacity-80 pointer-events-none"
          >
            {{ group.year }}
          </span>
          <header class="flex items-end justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 class="text-3xl font-semibold text-slate-900 dark:text-white">
              {{ group.yearLabel }}
            </h2>
            <p class="text-sm text-slate-400">{{ group.posts.length }} 篇</p>
          </header>

          <ul class="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            <li
              v-for="post in group.posts"
              :key="post.url"
              class="flex items-center justify-between gap-6 py-4 transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-1 rounded"
            >
              <a
                :href="post.url"
                class="flex-1 text-lg font-medium text-slate-800 transition-colors duration-200 hover:text-[#3451b2] dark:text-white dark:hover:text-[#3451b2]"
              >
                {{ post.title }}
              </a>
              <time class="text-sm font-mono text-slate-400 dark:text-slate-500">
                {{ post.displayDate }}
              </time>
            </li>
          </ul>
        </article>
      </div>
      <p v-else class="text-center text-slate-500 dark:text-slate-400">
        暂无可展示的文章。
      </p>

      <aside class="hidden lg:block">
        <p class="text-sm font-semibold text-slate-500 pb-3 border-b border-slate-200 dark:border-slate-700">
          当前页面
        </p>
        <nav class="mt-4 pl-4 border-l border-slate-200 dark:border-slate-700 space-y-3">
          <a
            v-for="group in archiveGroups"
            :key="group.year"
            :href="`#year-${group.year}`"
            class="block text-base text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
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
import { data as posts } from "../utils/article.data.js";
import { fileName2Title } from "../userConfig/translations.js";

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
