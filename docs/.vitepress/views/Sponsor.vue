<script setup lang="ts">
const email = "moweiwei6@gmail.com";

const QR_IMAGE_SIZE = 320;

const sponsorImages = [
  { id: "wechat", label: "微信", src: "/wechatpay.jpg", size: QR_IMAGE_SIZE },
  { id: "alipay", label: "支付宝", src: "/alipay.jpg", size: QR_IMAGE_SIZE },
];

const supporters = ["Katon", "Tom**", "临时邮箱"];
</script>

<template>
  <div class="sponsor-page">
    <section class="sponsor-hero">
      <span class="hero-tag">Support Me</span>
      <h1>赞助我</h1>
      <!-- <ul class="hero-points"> -->
        <!-- <li>☕️ 为下一篇文章续杯灵感咖啡</li>
        <li>📮 获得优先回复通道与路线交流</li>
        <li>📚 赞助名单会展示在此页面</li>
      </ul> -->
      <div class="hero-actions">
        <a class="btn primary" href="#support-qr">给我买一杯咖啡</a>
        <a
          class="btn ghost"
          :href="`mailto:${email}?subject=Feedback%20for%20Moweiwei&body=Hi%20Moweiwei%2C%0A%0A`"
        >
          任何正向的反馈
        </a>
      </div>

      <div class="hero-media" id="support-qr">
        <figure
          v-for="image in sponsorImages"
          :key="image.id"
          :style="{ '--qr-size': `${image.size}px` }"
        >
          <div class="qr-frame">
            <img
              :src="image.src"
              :alt="`${image.label}二维码`"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption>{{ image.label }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="supporters" v-if="supporters.length">
      <div class="panel-header">
        <h2>赞助者</h2>
        <p>感谢每一位愿意投入时间与能量的人。</p>
      </div>
      <ul class="supporter-names">
        <li v-for="supporter in supporters" :key="supporter">{{ supporter }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.sponsor-page {
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 0 0 80px;
}

.sponsor-hero {
  position: relative;
  padding: 48px;
  /* border-radius: 32px; */
  background: radial-gradient(
      circle at top right,
      color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent),
      transparent 55%
    ),
    var(--vp-c-bg-soft);
  overflow: hidden;
}

.sponsor-hero::after {
  content: "Support Me";
  position: absolute;
  inset: 12px;
  font-size: clamp(4rem, 16vw, 12rem);
  font-weight: 700;
  color: var(--vp-c-text-3);
  opacity: 0.12;
  letter-spacing: 0.08em;
  pointer-events: none;
  z-index: 0;
}

.sponsor-hero > * {
  position: relative;
  z-index: 1;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dark .hero-tag {
  background: rgba(15, 23, 42, 0.7);
  color: #f8fafc;
}

.sponsor-hero h1 {
  margin: 20px 0 12px;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  line-height: 1.1;
}

.sponsor-hero p {
  margin-bottom: 16px;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.hero-points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin: 24px 0;
  padding: 0;
  list-style: none;
  font-weight: 500;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid transparent;
}

.btn.primary {
  background: var(--vp-c-brand-1);
  color: #fff;
  box-shadow: 0 15px 30px rgba(56, 189, 248, 0.35);
}

.btn.ghost {
  border-color: var(--vp-c-border);
  color: var(--vp-c-text-1);
}

.btn:hover {
  transform: translateY(-1px);
}

.hero-media {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 40px;
  justify-content: center;
}

.hero-media figure {
  margin: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.qr-frame {
  width: min(var(--qr-size, 280px), 75vw);
  height: min(var(--qr-size, 280px), 75vw);
  padding: 14px;
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 20px 35px rgba(15, 23, 42, 0.1);
  background: var(--vp-c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 16px;
}

.hero-media figcaption {
  margin-top: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.panel-header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.panel-header p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
}

.supporters {
  padding: 32px;
  border-radius: 28px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.supporter-names {
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .sponsor-hero {
    padding: 32px 24px;
  }

  .sponsor-hero::after {
    font-size: clamp(3rem, 22vw, 6rem);
    inset: 6px;
  }

  .supporters {
    padding: 24px;
  }
}
</style>
