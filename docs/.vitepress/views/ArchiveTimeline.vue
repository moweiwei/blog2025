<template>
  <section
    class="max-w-5xl px-5 py-12 mx-auto my-10 sm:px-8 lg:px-0 rounded-3xl bg-white/70 dark:bg-slate-900/60 ring-1 ring-slate-100/60 dark:ring-slate-800/60 backdrop-blur"
  >
    <div class="text-center">
      <p class="text-xs font-semibold tracking-[0.35em] uppercase text-sky-500/70">
        Archive
      </p>
      <h1 class="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
        归档
      </h1>
    </div>

    <div class="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_180px] lg:gap-16 dark:text-slate-100">
      <div v-if="archiveGroups.length" class="space-y-12">
        <article
          v-for="group in archiveGroups"
          :key="group.year"
          :id="`year-${group.year}`"
          class="relative"
        >
          <span
            class="absolute text-6xl font-semibold tracking-[0.15em] text-slate-200 dark:text-slate-800 select-none -top-6 left-1 opacity-80 pointer-events-none"
          >
            {{ group.year }}
          </span>
          <header
            class="flex items-end justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3"
          >
            <h2 class="text-2xl font-semibold text-slate-900 dark:text-white z-10">
              {{ group.yearLabel }}
            </h2>
            <p class="text-xs text-slate-400">{{ group.posts.length }} 篇</p>
          </header>

          <ul class="mt-4 space-y-3">
            <li
              v-for="post in group.posts"
              :key="post.url"
              class="group flex flex-col gap-2 rounded-2xl border border-slate-100/80 px-4 py-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md dark:border-slate-800/80 dark:hover:border-slate-700/80 dark:bg-slate-900/70 dark:hover:bg-slate-900/90 bg-white/70"
            >
              <div class="flex w-full items-start justify-between gap-4">
                <a
                  :href="post.url"
                  class="flex-1 text-base font-medium text-slate-800 transition-colors duration-200 group-hover:text-VPLight dark:text-black/80 dark:hover:text-VPDark dark:group-hover:text-VPDark"
                >
                  {{ post.title }}
                </a>
                <time
                  class="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 rounded-full border border-slate-200/70 px-2 py-0.5 dark:border-slate-700/70"
                >
                  {{ post.displayDate }}
                </time>
              </div>
              <div
                class="h-px w-full bg-gradient-to-r from-transparent via-slate-200/70 to-transparent dark:via-slate-700/60"
                aria-hidden="true"
              ></div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                收录于 {{ group.yearLabel }} · 点击查看详情
              </p>
            </li>
          </ul>
        </article>
      </div>
      <p v-else class="text-center text-slate-500 dark:text-slate-400">
        暂无可展示的文章。
      </p>

      <aside class="hidden lg:block">
        <p
          class="text-xs font-semibold text-slate-500 pb-3 border-b border-slate-200 dark:border-slate-700 uppercase tracking-[0.3em]"
        >
          当前页面
        </p>
        <nav class="mt-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-2">
          <a
            v-for="group in archiveGroups"
            :key="group.year"
            :href="`#year-${group.year}`"
            class="block text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
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
