<template>
  <section class="max-w-5xl px-6 py-16 my-10 mx-auto sm:px-8 lg:px-0 vp-themed-text">
    <div class="text-center">
      <p class="text-xs font-semibold tracking-[0.35em] uppercase opacity-70 vp-themed-text">
         {{kind}}
      </p>
      <h1 class="mt-4 text-4xl font-semibold tracking-tight">
        {{title}}
      </h1>
    </div>

    <div
      v-if="isCloudVariant"
      class="mt-12 flex flex-wrap justify-center gap-4"
    >
      <span
        v-for="group in taxonomyGroups"
        :key="group.id"
        class="inline-flex items-center rounded-full border border-transparent px-4 py-2 font-semibold transition hover:-translate-y-1 hover:shadow-lg"
        :style="getTagStyle(group)"
      >
        {{ group.label }}
        <small class="ml-2 text-xs opacity-80">×{{ group.count }}</small>
      </span>
    </div>

    <div v-else class="mt-14 max-w-3xl mx-auto space-y-10">
      <article
        v-for="group in taxonomyGroups"
        :key="group.id"
        :id="group.id"
        class="p-6 transition border rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-lg vp-themed-card"
      >
        <header
          class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b vp-themed-border"
          :class="enableGroupCollapse ? 'cursor-pointer select-none' : ''"
          :tabindex="enableGroupCollapse ? 0 : undefined"
          :role="enableGroupCollapse ? 'button' : undefined"
          :aria-expanded="enableGroupCollapse ? isGroupOpen(group.id) : undefined"
          @click="handleGroupHeaderClick(group.id)"
          @keydown.enter.prevent="handleGroupHeaderClick(group.id)"
          @keydown.space.prevent="handleGroupHeaderClick(group.id)"
        >
          <div>
            <p class="text-xs uppercase tracking-[0.3em] vp-text-subtle">
              {{ groupLabel }}
            </p>
            <h2 class="text-2xl font-semibold">
              {{ group.label }}
            </h2>
          </div>
          <span
            class="flex items-center gap-1 px-3 py-1 text-sm font-mono rounded-full border vp-themed-border vp-text-subtle"
          >
            {{ group.count }} 篇
            <svg
              v-if="enableGroupCollapse"
              class="h-3 w-3 transition-transform"
              :class="isGroupOpen(group.id) ? '' : '-rotate-90'"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </header>

        <ul class="mt-4 space-y-4" v-show="isGroupOpen(group.id)">
          <li
            v-for="post in group.posts"
            :key="post.url"
            class="flex flex-col gap-2 p-3 transition border rounded-xl hover:-translate-y-0.5 vp-themed-card"
          >
            <button
              type="button"
              class="text-left text-lg font-medium transition-colors duration-200 hover:opacity-80"
              @click="openPost(post.url)"
            >
              {{ getTitle(post) }}
            </button>

            <div class="flex flex-wrap items-center gap-3 text-sm vp-text-subtle">
              <time class="font-mono text-xs uppercase tracking-wide">{{
                post.date.string
              }}</time>
              <div
                class="flex flex-wrap items-center gap-2"
                v-if="getCompanions(post).length"
              >
                <span
                  v-for="(item, idx) in getCompanions(post)"
                  :key="`${post.url}-${item}-${idx}`"
                  class="px-2 py-0.5 text-xs rounded-full border opacity-70"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </article>

      <p
        v-if="!taxonomyGroups.length"
        class="py-10 text-center vp-text-muted"
      >
        暂无可展示的数据。
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vitepress";
import { data as posts } from "../utils/article.data.js";
import { buildTaxonomy } from "../utils/taxonomy.js";
import type { TaxonomyGroup } from "../utils/taxonomy.js";
import { fileName2Title } from "../userConfig/translations.js";
import type { Post } from "../utils/types.js";

const props = withDefaults(
  defineProps<{
    kind: "categories" | "tags";
    title?: string;
    subtitle?: string;
    heroLabel?: string;
    variant?: "list" | "cloud";
  }>(),
  {
    title: "",
    subtitle: "",
    heroLabel: "",
    variant: "list",
  }
);

const router = useRouter();
const taxonomyGroups = computed(() => buildTaxonomy(posts, props.kind));
const isCloudVariant = computed(() => props.variant === "cloud");
const enableGroupCollapse = computed(() => props.kind === "categories");

const expandedGroups = ref<Record<string, boolean>>({});

watch(
  [taxonomyGroups, enableGroupCollapse],
  ([groups]) => {
    const typedGroups = groups as TaxonomyGroup[];
    const defaultState = !enableGroupCollapse.value;
    const map: Record<string, boolean> = {};
    typedGroups.forEach((group) => {
      const existing = expandedGroups.value[group.id];
      map[group.id] = typeof existing === "boolean" ? existing : defaultState;
    });
    expandedGroups.value = map;
  },
  { immediate: true }
);

const getDefaultGroupState = () => !enableGroupCollapse.value;
const isGroupOpen = (id: string) => {
  const stored = expandedGroups.value[id];
  return typeof stored === "boolean" ? stored : getDefaultGroupState();
};
const toggleGroup = (id: string) => {
  expandedGroups.value[id] = !isGroupOpen(id);
};
const handleGroupHeaderClick = (id: string) => {
  if (!enableGroupCollapse.value) return;
  toggleGroup(id);
};

const groupLabel = computed(() => (props.kind === "categories" ? "Category" : "Tag"));

const tagStats = computed(() => {
  const counts = taxonomyGroups.value.map((group) => group.count);
  if (!counts.length) return { min: 0, max: 0 };
  return {
    min: Math.min(...counts),
    max: Math.max(...counts),
  };
});

const palette = [
  { text: "#0ea5e9", bg: "rgba(14,165,233,0.15)", border: "rgba(14,165,233,0.5)" },
  { text: "#8b5cf6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.45)" },
  { text: "#f97316", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.4)" },
  { text: "#10b981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.45)" },
  { text: "#ec4899", bg: "rgba(236,72,153,0.15)", border: "rgba(236,72,153,0.45)" },
  { text: "#14b8a6", bg: "rgba(20,184,166,0.15)", border: "rgba(20,184,166,0.45)" },
];

const getPalette = (label: string) => {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash << 5) - hash + label.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % palette.length;
  return palette[index];
};

const resolveFontSize = (count: number) => {
  const { min, max } = tagStats.value;
  const minSize = 0.95;
  const maxSize = 1.8;
  if (min === max) return (minSize + maxSize) / 2;
  const ratio = (count - min) / (max - min);
  return minSize + ratio * (maxSize - minSize);
};

const getTagStyle = (group: TaxonomyGroup) => {
  const paletteEntry = getPalette(group.label);
  return {
    fontSize: `${resolveFontSize(group.count)}rem`,
    color: paletteEntry.text,
    backgroundColor: paletteEntry.bg,
    borderColor: paletteEntry.border,
  };
};

const getTitle = (post: Post): string => {
  if (post.frontmatter?.title) return post.frontmatter.title;
  const matches = post.url.match(/.*\/(.*).html$/);
  const fileName = matches && matches[1];
  return (fileName && fileName2Title[fileName]) || fileName || "未命名文章";
};

const getCompanions = (post: Post): string[] => {
  const related = props.kind === "categories" ? post.tags : post.categories;
  return related?.slice(0, 3) ?? [];
};

const openPost = (url: string) => router.go(url);
</script>
