<template>
  <div
    @click="openLink(post.url)"
    class="group relative mt-8 overflow-hidden rounded-2xl border shadow-[0_20px_45px_-28px_rgba(15,23,42,1)] transition-all duration-300 cursor-pointer break-inside-avoid-column hover:-translate-y-1 vp-themed-card"
  >
    <span
      class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b"
      aria-hidden="true"
    ></span>
    <div class="relative z-10 flex flex-col gap-3 px-5 py-4 sm:px-6">
      <div class="flex items-center justify-between gap-4 text-xs font-semibold tracking-[0.2em] uppercase vp-text-muted">
        <span>{{ post.date.string }}</span>
        <span class="hidden sm:flex items-center gap-1 vp-text-muted">
          <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
          {{ post.frontmatter.category || "Latest" }}
        </span>
      </div>
      <div>
        <h1
          :class="flow ? '' : 'lg:text-2xl'"
          class="text-2xl font-semibold leading-tight"
        >
          {{ getTitle(post) }}
        </h1>
        <p
          class="mt-3 text-base leading-relaxed transition-opacity duration-200 vp-text-muted group-hover:opacity-100"
        >
          {{ post.frontmatter.desc }}
        </p>
      </div>
      <div class="flex flex-col gap-3 pt-4 border-t sm:flex-row sm:items-center sm:justify-between vp-themed-border">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(tag, tagIndex) in getTags(post)"
            :key="tagIndex"
            class="px-3 py-1 text-sm font-medium rounded-full border opacity-80"
          >
            {{ tag }}
          </span>
        </div>
        <span
          class="inline-flex items-center text-sm font-semibold gap-2 transition-transform group-hover:translate-x-1 vp-text-muted"
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
import { type Post } from "../../utils/types.js";
import { fileName2Title } from "../../userConfig/translations.js";
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
