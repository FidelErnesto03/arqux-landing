/* ArqUX portal v6 — TOP-20 build · zero dependencies (manual §5.2: state-change motion, one-shot, reduced-motion safe) */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* localized content lives in each page as JSON */
  let data = { steps: [], dims: [], artifactLabel: "Example artifact · " };
  const dataEl = $("#app-data");
  if (dataEl) { try { data = Object.assign(data, JSON.parse(dataEl.textContent)); } catch (e) { /* keep defaults */ } }

  /* progressive enhancement: controls that need the script become visible */
  $$(".segmented[hidden], .copy-btn[hidden], .progress-rail[hidden], .palette-btn[hidden], .route-choice[hidden], .route-note[hidden], .wf-switch[hidden]").forEach((el) => { el.hidden = false; });

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
    const closeMenu = () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", menu.dataset.labelOpen);
    };
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) { closeMenu(); menu.focus(); }
    });
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !menu.contains(e.target)) closeMenu();
    });
  }

  /* ---------- local task: one-shot reveal (no loops) ---------- */
  const localStory = $("#task");
  if (localStory && "IntersectionObserver" in window && !REDUCED) {
    const revealItems = [
      ...$$(".flow li", localStory),
      $(".source-panel", localStory)
    ].filter(Boolean);
    revealItems.forEach((el) => el.classList.add("reveal"));
    const storyObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      revealItems.forEach((el, i) => {
        window.setTimeout(() => el.classList.add("in"), 120 + i * 200);
      });
      storyObserver.disconnect();
    }, { threshold: 0.1, rootMargin: "0px 0px -35% 0px" });
    storyObserver.observe(localStory);
  }

  /* ---------- problem section: five fractures, one-shot reveal (no loops) ---------- */
  const failureSection = $("#failures");
  if (failureSection && "IntersectionObserver" in window && !REDUCED) {
    const parts = [
      ...$$(".failure-rail i", failureSection),
      ...$$(".failure-grid li", failureSection),
      $(".failure-close", failureSection)
    ].filter(Boolean);
    parts.forEach((el) => el.classList.add("reveal"));
    const failureObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      parts.forEach((el, i) => window.setTimeout(() => el.classList.add("in"), 90 + i * 110));
      failureObserver.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -30% 0px" });
    failureObserver.observe(failureSection);
  }


  /* ---------- project reference: which steps read or write a component ---------- */
  const refBar = $(".source-panel");
  if (refBar) {
    const refChips = $$(".source-chips button", refBar);
    const refSteps = $$(".flow li");
    const clearLinks = () => refSteps.forEach((li) => li.classList.remove("is-linked"));
    const linkRef = (ref) => {
      clearLinks();
      refSteps.forEach((li) => {
        if ((li.dataset.refs || "").split(" ").includes(ref)) li.classList.add("is-linked");
      });
    };
    const restorePressed = () => {
      clearLinks();
      const pressed = refChips.find((c) => c.getAttribute("aria-pressed") === "true");
      if (pressed) linkRef(pressed.dataset.ref);
    };
    refChips.forEach((chip) => {
      chip.addEventListener("mouseenter", () => linkRef(chip.dataset.ref));
      chip.addEventListener("focus", () => linkRef(chip.dataset.ref));
      chip.addEventListener("mouseleave", restorePressed);
      chip.addEventListener("blur", restorePressed);
      chip.addEventListener("click", () => {
        const active = chip.getAttribute("aria-pressed") === "true";
        refChips.forEach((c) => c.setAttribute("aria-pressed", "false"));
        if (active) return;
        chip.setAttribute("aria-pressed", "true");
        linkRef(chip.dataset.ref);
      });
    });
  }

  /* ---------- anchor jumps: render off-screen sections for the flight, then glide (exact target, native smooth) ---------- */
  function scrollToSection(target) {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    const root = document.documentElement;
    root.classList.add("resolve-cv");
    void document.body.offsetHeight; // resolve placeholders before measuring the flight
    el.scrollIntoView({ block: "start" });
    const settle = () => {
      root.classList.remove("resolve-cv");
      window.removeEventListener("scrollend", settle);
    };
    window.addEventListener("scrollend", settle, { once: true });
    setTimeout(settle, 1400);
  }

  window.addEventListener("hashchange", () => { if (location.hash.length > 1) scrollToSection(location.hash); });
  if (window.location.hash.length > 1) {
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(window.location.hash)));
  }

  document.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target && e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains("lang-link")) return;
    const id = a.getAttribute("href");
    if (!id || id.length < 2) return;
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    if (history.replaceState) history.replaceState(null, "", id);
    scrollToSection(el);
  });

  /* ---------- T-018: artifact explorer (conceptual, never reads the workspace) ---------- */
  const artDataEl = $("#artifacts-data");
  if (artDataEl) {
    let artList = [];
    try { artList = (JSON.parse(artDataEl.textContent).artifacts) || []; } catch (e) { artList = []; }
    const nodes = $$(".artifact-node[data-artifact]");
    if (artList.length && nodes.length) {
      const put = (sel, v) => { const el = $(sel); if (el && v != null) el.textContent = v; };
      const selectArtifact = (i) => {
        const a = artList[i];
        if (!a) return;
        nodes.forEach((n) => n.setAttribute("aria-pressed", String(Number(n.dataset.artifact) === i)));
        put("#art-kind", a.kind);
        put("#art-title", a.title);
        put("#art-path", a.path);
        put("#art-desc", a.desc);
        put("#art-scope", a.scope);
        put("#art-verified", a.verified);
        const src = $("#art-src");
        if (src && a.src) { src.href = a.src; src.textContent = (a.srcLabel || "Source") + " ↗"; }
      };
      nodes.forEach((n) => n.addEventListener("click", () => selectArtifact(Number(n.dataset.artifact))));
      selectArtifact(0);
    }
  }

  /* ---------- T-021: workflow mechanism map (stages ↔ map, honest nodes) ---------- */
  const wfViewBtns = $$("[data-wf-view]");
  if (wfViewBtns.length) {
    const stagesBox = $(".wf-stages");
    const mapBox = $(".wf-map");
    const setWfView = (view) => {
      wfViewBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.wfView === view)));
      if (stagesBox) stagesBox.hidden = view !== "stages";
      if (mapBox) {
        mapBox.hidden = view !== "map";
        if (view === "map" && !mapBox.classList.contains("is-drawn")) {
          requestAnimationFrame(() => mapBox.classList.add("is-drawn"));
        }
      }
    };
    wfViewBtns.forEach((b) => b.addEventListener("click", () => setWfView(b.dataset.wfView)));
    setWfView("stages");

    const mapDataEl = $("#map-data");
    let mapNodesData = [];
    try { mapNodesData = mapDataEl ? (JSON.parse(mapDataEl.textContent).nodes || []) : []; } catch (e) { mapNodesData = []; }
    const mapNodes = $$(".map-node[data-map-node]");
    if (mapNodesData.length && mapNodes.length) {
      const put = (sel, v) => { const el = $(sel); if (el && v != null) el.textContent = v; };
      const selectMapNode = (i) => {
        const n = mapNodesData[i];
        if (!n) return;
        mapNodes.forEach((g) => g.setAttribute("aria-pressed", String(Number(g.dataset.mapNode) === i)));
        put("#map-kind", n.kind);
        put("#map-title", n.title);
        put("#map-desc", n.fn);
        put("#map-via", n.via);
        put("#map-note", n.lim);
        const a = $("#map-src");
        if (a && n.src) { a.href = n.src; a.textContent = (n.srcLabel || "Source") + " ↗"; }
      };
      mapNodes.forEach((g) => {
        g.addEventListener("click", () => selectMapNode(Number(g.dataset.mapNode)));
        g.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectMapNode(Number(g.dataset.mapNode)); }
        });
      });
      selectMapNode(1);
    }
  }

  /* ---------- workflow stages ---------- */
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

  /* ---------- hexagon dimensions (+ I-07: the path travels to the selected node) ---------- */
  const dims = data.dims || [];
  const hexPath = $(".hex-path");
  function selectDimension(i) {
    const d = dims[i] || {};
    const arr = Array.isArray(d);
    const name = arr ? d[0] || "" : d.name || "";
    $$("[data-dimension]").forEach((el) =>
      el.setAttribute("aria-pressed", String(Number(el.dataset.dimension) === i))
    );
    if (hexPath) hexPath.style.strokeDashoffset = String(Math.max(0, 1 - (i + 1) / 6));
    setText("#artifact-name", (data.artifactLabel || "") + name.toLowerCase());
    setText("#artifact-code", arr ? d[2] : d.code);
    if (!arr) {
      setText("#ficha-fn", d.fn);
      setText("#ficha-via", d.via);
      setText("#ficha-lim", d.lim);
      setText("#artifact-status", d.tag);
      const a = $("#ficha-src");
      if (a && d.src) { a.href = d.src; a.textContent = (d.srcLabel || d.src) + " ↗"; }
    }
  }
  const dimNodes = $$("[data-dimension]");
  dimNodes.forEach((el, idx) => {
    el.addEventListener("click", () => selectDimension(Number(el.dataset.dimension)));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectDimension(Number(el.dataset.dimension));
        return;
      }
      if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        const dir = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : -1;
        const next = dimNodes[(idx + dir + dimNodes.length) % dimNodes.length];
        next.focus();
        selectDimension(Number(next.dataset.dimension));
      }
    });
  });

  /* ---------- codec representation selector (+ I-08: one-shot panel transition) ---------- */
  const views = $$("[data-code-view]");
  views.forEach((btn) =>
    btn.addEventListener("click", () => {
      const view = btn.dataset.codeView;
      views.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      $$("[data-code-panel]").forEach((p) => {
        const show = view === "both" || p.dataset.codePanel === view;
        p.hidden = !show;
        if (show && !REDUCED) {
          p.classList.remove("panel-in");
          void p.offsetWidth;
          p.classList.add("panel-in");
          p.addEventListener("animationend", () => p.classList.remove("panel-in"), { once: true });
        }
      });
    })
  );

  /* ---------- I-04: evidence numbers live (one-shot count-up; static text is the no-JS state) ---------- */
  const nums = $$(".bar-top b");
  if (nums.length && "IntersectionObserver" in window && !REDUCED) {
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      nums.forEach((el) => {
        const m = (el.textContent || "").match(/^(\d+)(.*)$/);
        if (!m) return;
        const target = parseInt(m[1], 10), suffix = m[2] || "", t0 = performance.now(), D = 900;
        (function step(now) {
          const k = Math.min(1, (now - t0) / D);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.5 });
    nums.forEach((el) => io.observe(el));
  }

  /* ---------- copy buttons: clipboard with an accessible status message ---------- */
  $$(".copy-btn").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const status = $(".copy-status", btn.parentElement);
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        status.textContent = btn.dataset.done;
      } catch (e) {
        status.textContent = btn.dataset.fail;
      }
    })
  );

  /* ---------- I-09: pointer tilt on cards (fine pointers only, ≤2°) ---------- */
  if (window.matchMedia && window.matchMedia("(pointer: fine)").matches && !REDUCED) {
    $$(".architecture-card, .trust-card, .hypothesis").forEach((card) => {
      card.classList.add("tilt-host");
      card.style.transition = "transform .16s ease, border-color .16s ease, background .16s ease";
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "translateY(-2px) perspective(700px) rotateX(" + (-dy * 3).toFixed(2) + "deg) rotateY(" + (dx * 3).toFixed(2) + "deg)";
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- I-11: language switch with a short fade-out ---------- */
  $$(".lang-link").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (REDUCED) return;
      e.preventDefault();
      const href = a.getAttribute("href");
      document.body.classList.add("lang-out");
      setTimeout(() => { window.location.href = href; }, 180);
    })
  );

  /* ---------- I-12: dev easter egg removed with the old demo (the workspace board has no timeline) ---------- */

})();
