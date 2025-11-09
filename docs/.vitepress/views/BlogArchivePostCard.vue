<template>
  <div
    @click="openLink(post.url)"
    class="group relative mt-8 overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/60 shadow-[0_20px_45px_-28px_rgba(15,23,42,1)] ring-1 ring-slate-100/70 dark:ring-white/10 transition-all duration-300 cursor-pointer break-inside-avoid-column hover:-translate-y-1 hover:shadow-[0_25px_55px_-25px_rgba(14,165,233,0.6)]"
  >
    <span
      class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b"
      aria-hidden="true"
    ></span>
    <span
      class="absolute inset-0 opacity-0 transition-opacity duration-300 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900 group-hover:opacity-100"
      aria-hidden="true"
    ></span>
    <div class="relative z-10 flex flex-col gap-3 px-5 py-4 sm:px-6">
      <div class="flex items-center justify-between gap-4 text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500">
        <span>{{ post.date.string }}</span>
        <span class="hidden sm:flex items-center gap-1 text-sky-500 dark:text-sky-300">
          <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
          {{ post.frontmatter.category || "Latest" }}
        </span>
      </div>
      <div>
        <h1
          :class="flow ? '' : 'lg:text-2xl'"
          class="text-2xl font-semibold leading-tight text-slate-900 dark:text-white"
        >
          {{ getTitle(post) }}
        </h1>
        <p
          class="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors"
        >
          {{ post.frontmatter.desc }}
        </p>
      </div>
      <div class="flex flex-col gap-3 pt-4 border-t border-slate-100/70 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(tag, tagIndex) in getTags(post)"
            :key="tagIndex"
            class="px-3 py-1 text-sm font-medium rounded-full bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-200 border border-sky-100/70 dark:border-sky-500/30"
          >
            {{ tag }}
          </span>
        </div>
        <span
          class="inline-flex items-center text-sm font-semibold text-sky-500 dark:text-sky-300 gap-2 transition-transform group-hover:translate-x-1"
        >
          阅读更多
          <svg
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Post } from "../utils/types.js";
import { fileName2Title } from "../userConfig/translations.js";
import { useRouter } from "vitepress";

const router = useRouter();
const { post, flow } = defineProps(["post", "flow"]);

// 获取文章标题信息，使用用户自定义的标题或是 md 文件名称
const getTitle = (post: Post): string => {
  const userTitle = post.frontmatter?.title;
  if (userTitle) return userTitle;

  const { url } = post;
  const matches = url.match(/.*\/(.*.html)/);
  let fileName = matches && matches[1].replace(".html", "");
  // 如果匹配成功，返回匹配的部分作为标题，否则返回一个默认标题
  if (fileName) return fileName2Title[fileName] || fileName;
  return "Error Title";
};

// 获取文章的前两个tag
const getTags = (post: Post) => {
  return post.tags?.slice(0, 2) ?? [];
};

// 打开文章链接
const openLink = (link: string) => router.go(link);
</script>
