<template>
  <div
    class="max-w-3xl px-4 pb-8 mx-auto my-20 sm:px-6 xl:max-w-5xl xl:px-0 dark:divide-slate-200/20"
  >
    <!-- 标题 -->
    <div class="relative flex justify-center mt-2">
      <h1 class="text-5xl font-bold">{{ hero.title || "Blogs" }}</h1>
      <span
        class="absolute text-6xl tracking-wider text-transparent -translate-x-1/2 opacity-60 bottom-1/3 left-1/2 bg-gradient-to-b from-black/20 to-black/10 bg-clip-text dark:from-white/20 dark:to-white/10"
        >{{ hero.title || "Blogs" }}</span
      >
    </div>

    <p class="mt-2 text-center text-black/50 dark:text-slate-500">{{ hero.subTitle }}</p>

    <!-- 主体 -->
    <section class="flex justify-center w-full pt-6 mt-6">
      <div class="w-full max-w-4xl pt-6 lg:pt-0">
        <h1
          class="pb-2 mx-auto text-3xl font-bold transition-all duration-300 border-b-4 border-sky-500 dark:border-sky-700 w-fit hover:pr-6"
        >
          ✨ 近期更新
        </h1>
        <div class="mt-4" :class="flow ? 'columns-1 lg:columns-2 gap-8' : 'space-y-6'">
          <PostCard
            v-for="(post, index) of posts"
            :key="post.date.time"
            :post="post"
            :flow="flow"
          ></PostCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import { data as posts } from "../utils/article.data.js";
import PostCard from "./BlogArchivePostCard.vue";

// 获取标题与布局配置
const { frontmatter: pageData } = useData();
const { hero, flow } = pageData.value;
</script>
