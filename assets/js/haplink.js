/* HapLink — interactions
   Progressive enhancement: every element is visible without JS.
   Adding .js-ready enables the CSS transitions; IntersectionObserver fires them.
   No external dependencies — nothing to fail to load. */

(function () {
  var doc = document.documentElement;

  // Enable CSS-driven reveals only once we know JS is running
  doc.classList.add("js-ready");

  // Sticky nav border
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  var ham = document.getElementById("ham");
  var mob = document.getElementById("nav-mobile");
  if (ham && mob) {
    ham.addEventListener("click", function () {
      mob.classList.toggle("open");
    });
    Array.prototype.forEach.call(mob.querySelectorAll("a"), function (a) {
      a.addEventListener("click", function () { mob.classList.remove("open"); });
    });
  }

  // Scroll reveal
  if (!("IntersectionObserver" in window)) {
    doc.classList.remove("js-ready"); // fall back to fully visible
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -40px 0px", threshold: 0.04 });

  Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) {
    io.observe(el);
  });

  Array.prototype.forEach.call(document.querySelectorAll(".stagger"), function (parent) {
    Array.prototype.forEach.call(parent.children, function (child) {
      child.classList.add("reveal-child");
      io.observe(child);
    });
  });
})();
