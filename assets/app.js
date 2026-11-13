/* ArqUX portal v4 — progressive enhancement only (R-01) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  if (!("IntersectionObserver" in window)) {
    $$(".reveal").forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
})();
