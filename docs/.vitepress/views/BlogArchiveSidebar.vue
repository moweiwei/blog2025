<template>
  <div class="lg:sticky lg:top-20">

    <div class="px-2 mt-5 space-y-3">
      <h2 class="text-lg font-semibold text-slate-600 dark:text-slate-200">更多内容</h2>
      <button
        class="w-full px-3 py-2 text-sm font-medium text-left transition rounded-lg border border-slate-200 hover:border-sky-500 hover:text-sky-600 dark:border-slate-700 dark:hover:border-sky-400"
        @click="openLink('/Categories')"
      >
        📚 查看全部分类
      </button>
      <button
        class="w-full px-3 py-2 text-sm font-medium text-left transition rounded-lg border border-slate-200 hover:border-sky-500 hover:text-sky-600 dark:border-slate-700 dark:hover:border-sky-400"
        @click="openLink('/Tags')"
      >
        🏷️ 浏览全部标签
      </button>
    </div>

    <!-- 随机一言 -->
    <div
      class="flex gap-2 py-2 mt-4 rounded-lg shadow-md bg-amber-100/80 dark:bg-amber-950/80"
      v-if="quoteInfo.string"
    >
      <span class="self-start text-2xl">“</span>
      <div class="flex-1 my-4 indent-4">
        <h1>{{ quoteInfo.string }}</h1>
        <p v-if="quoteInfo.from" class="text-right">—— 《{{ quoteInfo.from }}》</p>
      </div>
      <span class="self-end text-2xl">”</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { type Category } from "../utils/types.js";
import { useRouter } from "vitepress";

const router = useRouter();
const { types, features } = defineProps(["types", "features"]);
const categories: Category[] = [...(types ?? [])];

// 打开文章链接
const openLink = (link: string | undefined) => link && router.go(link);

// 随机一言
const quoteInfo = reactive({
  string: "",
  from: "",
});

</script>
