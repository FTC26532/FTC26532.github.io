// HapLink — Motion animations (Motion by Framer, vanilla JS)
// https://motion.dev

import { animate, inView, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.5.4/dist/motion.js";

/* ── NAV scroll effect ── */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav?.classList.toggle("scrolled", window.scrollY > 50);
}, { passive: true });

/* ── Mobile menu ── */
const ham = document.getElementById("ham");
const mobileNav = document.getElementById("nav-mobile");
ham?.addEventListener("click", () => mobileNav?.classList.toggle("open"));
mobileNav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobileNav.classList.remove("open")));

/* ── Hero entrance (only on pages that have .hero) ── */
if (document.querySelector(".hero-badge")) {
  animate(".hero-badge",   { opacity: [0, 1], y: [16, 0] }, { delay: 0.15, duration: 0.75, easing: [0.25, 1, 0.5, 1] });
  animate(".hero-title",   { opacity: [0, 1], y: [40, 0] }, { delay: 0.3,  duration: 0.85, easing: [0.25, 1, 0.5, 1] });
  animate(".hero-sub",     { opacity: [0, 1], y: [28, 0] }, { delay: 0.5,  duration: 0.75, easing: [0.25, 1, 0.5, 1] });
  animate(".hero-btns",    { opacity: [0, 1], y: [20, 0] }, { delay: 0.65, duration: 0.7,  easing: [0.25, 1, 0.5, 1] });
  animate(".hero-scroll",  { opacity: [0, 1] },             { delay: 1.2,  duration: 0.6 });
}

/* ── Page hero entrance ── */
if (document.querySelector(".page-hero-title")) {
  animate(".page-hero-title", { opacity: [0, 1], y: [30, 0] }, { delay: 0.2, duration: 0.8, easing: [0.25, 1, 0.5, 1] });
  animate(".page-hero-desc",  { opacity: [0, 1], y: [20, 0] }, { delay: 0.4, duration: 0.7, easing: [0.25, 1, 0.5, 1] });
}

/* ── Scroll-reveal for .reveal elements ── */
inView(".reveal", ({ target }) => {
  const delay = parseFloat(target.dataset.delay || "0");
  animate(target, { opacity: [0, 1], y: [28, 0] }, { delay, duration: 0.7, easing: [0.25, 1, 0.5, 1] });
}, { margin: "-80px" });

/* ── Staggered children reveal ── */
inView(".reveal-stagger", ({ target }) => {
  const children = Array.from(target.children);
  animate(children, { opacity: [0, 1], y: [28, 0] }, {
    delay: stagger(0.09, { start: parseFloat(target.dataset.delay || "0") }),
    duration: 0.65, easing: [0.25, 1, 0.5, 1]
  });
}, { margin: "-60px" });

/* ── Parallax orbs ── */
const orb1 = document.querySelector(".orb-1");
const orb2 = document.querySelector(".orb-2");
if (orb1 || orb2) {
  scroll(({ y }) => {
    const p = y.progress;
    if (orb1) orb1.style.transform = `translateY(${p * -80}px)`;
    if (orb2) orb2.style.transform = `translateY(${p * 60}px)`;
  });
}

/* ── Stat counter animation ── */
inView(".stat-val", ({ target }) => {
  const end = parseInt(target.dataset.count || "0", 10);
  if (!end) return;
  animate(0, end, {
    duration: 1.5,
    easing: [0.25, 1, 0.5, 1],
    onUpdate(v) { target.textContent = Math.round(v) + (target.dataset.suffix || ""); }
  });
}, { margin: "-40px" });
