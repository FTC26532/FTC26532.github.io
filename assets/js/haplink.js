// HapLink v2 — Animations
// Progressive enhancement: content is visible by default.
// JS adds 'js-ready' to <html>, enabling CSS transitions.
// Then IntersectionObserver fires them. No CDN dependency for core reveals.

(function () {
  // 1. Signal JS is running — enables CSS-driven reveal animations
  document.documentElement.classList.add("js-ready");

  // 2. Nav scroll effect
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 3. Mobile menu
  const ham = document.getElementById("ham");
  const mob = document.getElementById("nav-mobile");
  if (ham && mob) {
    ham.addEventListener("click", () => mob.classList.toggle("open"));
    mob.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => mob.classList.remove("open"))
    );
  }

  // 4. Scroll-reveal with IntersectionObserver (no CDN needed, bulletproof)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          observer.unobserve(e.target); // fire once
        }
      });
    },
    { rootMargin: "-50px 0px", threshold: 0.05 }
  );

  // Observe .reveal elements
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // Observe stagger children — each child gets its own reveal
  document.querySelectorAll(".stagger").forEach((parent) => {
    parent.querySelectorAll(":scope > *").forEach((child) => {
      child.classList.add("reveal-child");
      observer.observe(child);
    });
  });

  // 5. Orbs — fade in gently after load (not instant, no jank)
  window.addEventListener("load", () => {
    document.querySelectorAll(".orb").forEach((orb) => orb.classList.add("loaded"));
  });
})();

// 6. Hero entrance — using Motion (Framer) for the badge/title/subtitle
//    Loaded separately so a CDN failure doesn't break the rest of the page.
import("https://esm.sh/motion@11?bundle")
  .then(({ animate, stagger }) => {
    const badge = document.querySelector(".hero-badge");
    const title = document.querySelector(".hero-title");
    const sub   = document.querySelector(".hero-sub");
    const btns  = document.querySelector(".hero-btns");
    const hint  = document.querySelector(".scroll-hint");

    if (!badge && !title) return; // not on hero page

    // Set initial states before animating (avoids flash)
    const heroEls = [badge, title, sub, btns, hint].filter(Boolean);
    heroEls.forEach((el) => {
      if (el) { el.style.opacity = "0"; el.style.transform = "translateY(24px)"; }
    });

    const seq = [
      [badge, { opacity: [0,1], y: [20,0] }, { duration: 0.7, easing: [0.25,1,0.5,1] }],
      [title, { opacity: [0,1], y: [36,0] }, { duration: 0.8, easing: [0.25,1,0.5,1], at: "-0.5" }],
      [sub,   { opacity: [0,1], y: [24,0] }, { duration: 0.7, easing: [0.25,1,0.5,1], at: "-0.4" }],
      [btns,  { opacity: [0,1], y: [18,0] }, { duration: 0.65, easing: [0.25,1,0.5,1], at: "-0.35" }],
    ].filter(([el]) => el);

    // Use animate individually since timeline isn't imported
    let delay = 0.1;
    seq.forEach(([el, kf, opts]) => {
      animate(el, kf, { ...opts, delay });
      delay += 0.15;
    });

    if (hint) animate(hint, { opacity: [0,1] }, { delay: delay + 0.3, duration: 0.6 });

    // Page hero (inner pages) entrance
    const pTitle = document.querySelector(".page-hero-title");
    const pDesc  = document.querySelector(".page-hero-desc");
    if (pTitle) {
      pTitle.style.opacity = "0"; pTitle.style.transform = "translateY(28px)";
      animate(pTitle, { opacity: [0,1], y: [28,0] }, { delay: 0.2, duration: 0.75, easing: [0.25,1,0.5,1] });
    }
    if (pDesc) {
      pDesc.style.opacity = "0"; pDesc.style.transform = "translateY(20px)";
      animate(pDesc, { opacity: [0,1], y: [20,0] }, { delay: 0.38, duration: 0.7, easing: [0.25,1,0.5,1] });
    }
  })
  .catch(() => {
    // CDN failed — make everything visible immediately, no broken site
    [".hero-badge",".hero-title",".hero-sub",".hero-btns",".scroll-hint",
     ".page-hero-title",".page-hero-desc"].forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) { el.style.opacity = "1"; el.style.transform = "none"; }
    });
  });
