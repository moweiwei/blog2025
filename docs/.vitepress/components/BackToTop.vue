<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const radius = 16;
const circumference = 2 * Math.PI * radius;

const percentage = ref(0);
const visible = ref(false);
let ticking = false;

const updateProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress =
    docHeight <= 0 ? 0 : Math.min(100, Math.round((scrollTop / docHeight) * 100));

  percentage.value = progress;
  visible.value = scrollTop > 120;
};

const handleScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateProgress();
    ticking = false;
  });
};

const handleResize = () => updateProgress();

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const dashOffset = computed(
  () => circumference - (percentage.value / 100) * circumference
);
const paddedPercentage = computed(() => `${percentage.value}%`);

onMounted(() => {
  updateProgress();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <button
    v-show="visible"
    class="group fixed right-5 bottom-5 z-40 h-[52px] w-[52px] cursor-pointer overflow-hidden rounded-full border-none bg-[#99a2ff1f] p-0 text-[#0e142f] shadow-[0_10px_25px_rgba(0,0,0,0.18)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#99a2ff73] md:right-8 md:bottom-8 md:h-[60px] md:w-[60px]"
    type="button"
    aria-label="返回顶部"
    @click="scrollToTop"
  >
    <div
      class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 transition-opacity duration-150 group-hover:opacity-0"
      aria-hidden="true"
    >
      <div class="relative grid h-[42px] w-[42px] place-items-center md:h-[48px] md:w-[48px]">
        <svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="rgba(153,162,255,0.35)"
            stroke-width="4"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            stroke="#99a2ff"
            stroke-width="4"
            stroke-linecap="round"
            fill="none"
            :style="{ transition: 'stroke-dashoffset 0.15s ease' }"
          />
        </svg>
        <span class="text-[0.82rem] font-semibold text-[#222a54] md:text-[0.9rem]">
          {{ paddedPercentage }}
        </span>
      </div>
    </div>
    <div
      class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-[#99a2ff] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
    >
      <span class="text-[1.4rem] leading-none md:text-[1.5rem]">↑</span>
      <span class="text-[0.68rem] tracking-wide md:text-[0.74rem]">返回顶部</span>
    </div>
  </button>
</template>
