/* ArqUX portal v5 — interactions from the adopted prototype · zero dependencies */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* localized content lives in each page as JSON */
  let data = { steps: [], dims: [], artifactLabel: "Example artifact · " };
  const dataEl = $("#app-data");
  if (dataEl) { try { data = Object.assign(data, JSON.parse(dataEl.textContent)); } catch (e) { /* keep defaults */ } }

  /* mobile menu */
  const menu = $(".menu-toggle");
  const nav = $(".nav-links");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? menu.dataset.labelClose : menu.dataset.labelOpen);
      nav.classList.toggle("open", open);
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-label", menu.dataset.labelOpen);
      })
    );
  }

  /* workflow stages */
  const steps = $$(".step");
  const setText = (sel, v) => { const el = $(sel); if (el && v) el.textContent = v; };
  steps.forEach((btn) =>
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.step);
      const s = (data.steps || [])[i];
      if (!s) return;
      steps.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      setText("#step-kicker", s.kicker);
      setText("#step-heading", s.title);
      setText("#step-who", s.who);
      setText("#step-input", s.input);
      setText("#step-change", s.change);
      setText("#step-evidence", s.evidence);
    })
  );

  /* hexagon dimensions */
  const dims = data.dims || [];
  function selectDimension(i) {
    const d = dims[i] || ["", "", ""];
    $$("[data-dimension]").forEach((el) =>
      el.setAttribute("aria-pressed", String(Number(el.dataset.dimension) === i))
    );
    setText("#artifact-name", (data.artifactLabel || "") + (d[0] || "").toLowerCase());
    setText("#artifact-code", d[2]);
  }
  $$("[data-dimension]").forEach((el) => {
    el.addEventListener("click", () => selectDimension(Number(el.dataset.dimension)));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectDimension(Number(el.dataset.dimension));
      }
    });
  });

  /* codec representation selector */
  const views = $$("[data-code-view]");
  views.forEach((btn) =>
    btn.addEventListener("click", () => {
      const view = btn.dataset.codeView;
      views.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      $$("[data-code-panel]").forEach((p) => {
        p.hidden = view !== "both" && p.dataset.codePanel !== view;
      });
    })
  );

  /* workspace compare toggle */
  const cyc = $("#cycle-environments");
  if (cyc) {
    cyc.addEventListener("click", () => {
      const cards = $$(".local-card");
      cards.reverse().forEach((c) => c.classList.toggle("active"));
      const firstActive = cards[0];
      cyc.textContent = firstActive && firstActive.classList.contains("active")
        ? cyc.dataset.labelA
        : cyc.dataset.labelB;
    });
  }
})();
