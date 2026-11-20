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

  /* ---------- global nav: page -> section submenus (audit contract 2.3) ----------
     Single coherent state: .is-open class <=> aria-expanded, driven by JS for
     hover (fine pointers), keyboard focus and click-pin. CSS never opens a
     submenu on its own, so visual state and ARIA state cannot diverge. */
  const navGroups = $$(".nav-entry");
  if (navGroups.length) {
    const finePointer = window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const setOpen = (g, open) => {
      const btn = $(".nav-sub-toggle", g);
      g.classList.toggle("is-open", open);
      if (btn) btn.setAttribute("aria-expanded", String(open));
    };
    const closeSubs = (except) => navGroups.forEach((g) => { if (g !== except) setOpen(g, false); });
    navGroups.forEach((g) => {
      const btn = $(".nav-sub-toggle", g);
      if (!btn) return;
      /* transient open: hover on fine pointers, focus within */
      if (finePointer) {
        g.addEventListener("mouseenter", () => setOpen(g, true));
        g.addEventListener("mouseleave", () => {
          if (!g.hasAttribute("data-pinned")) setOpen(g, false);
        });
      }
      g.addEventListener("focusin", () => setOpen(g, true));
      g.addEventListener("focusout", (e) => {
        if (!g.hasAttribute("data-pinned") && !g.contains(e.relatedTarget)) setOpen(g, false);
      });
      /* click toggles a pinned state that survives hover/blur. The pin flag —
         not the current open state — is the toggle source, because focusin
         may already have opened the submenu before the click lands. */
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeSubs(g);
        if (g.hasAttribute("data-pinned")) {
          g.removeAttribute("data-pinned");
          setOpen(g, false);
        } else {
          g.setAttribute("data-pinned", "");
          setOpen(g, true);
        }
      });
      g.querySelectorAll(".nav-sub a").forEach((a) =>
        a.addEventListener("click", () => {
          navGroups.forEach((x) => x.removeAttribute("data-pinned"));
          closeSubs(null);
        })
      );
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest || !e.target.closest(".nav-entry")) {
        navGroups.forEach((g) => g.removeAttribute("data-pinned"));
        closeSubs(null);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (nav && nav.classList.contains("open")) return; /* mobile menu handler owns Escape */
      const openGroup = navGroups.find((g) =>
        g.classList.contains("is-open") || g.contains(document.activeElement));
      if (!openGroup) return;
      navGroups.forEach((g) => g.removeAttribute("data-pinned"));
      closeSubs(null);
      const b = $(".nav-sub-toggle", openGroup);
      if (b) b.focus();
    });

    /* scrollspy: mark the section currently in view inside its submenu.
       Scoped to the current page's group so shared ids (#intro, #continue)
       on other pages are never marked. */
    const currentEntry = navGroups.find((g) => {
      const t = $(".nav-top", g);
      return t && t.getAttribute("aria-current") === "page";
    });
    const subLinks = currentEntry ? $$(".nav-sub a[href*='#']", currentEntry) : [];
    const sections = $$("main > section[id]");
    if (subLinks.length && sections.length && "IntersectionObserver" in window) {
      const byHash = {};
      subLinks.forEach((a) => {
        const h = a.getAttribute("href").split("#")[1];
        if (h) (byHash[h] = byHash[h] || []).push(a);
      });
      let current = null;
      const mark = (id) => {
        if (id === current) return;
        current = id;
        subLinks.forEach((a) => a.removeAttribute("aria-current"));
        (byHash[id] || []).forEach((a) => a.setAttribute("aria-current", "location"));
      };
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) mark(en.target.id);
          });
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );
      sections.forEach((s) => spy.observe(s));
      const onHash = () => {
        const id = decodeURIComponent(location.hash.slice(1));
        if (byHash[id]) mark(id);
      };
      window.addEventListener("hashchange", onHash);
      onHash();
    }
  }

  /* ---------- problem section: only the reference motif moves, text never hides ---------- */
  const failureSection = $("#failures");
  if (failureSection && "IntersectionObserver" in window && !REDUCED) {
    const failureObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      failureSection.classList.add("is-live");
      failureObserver.disconnect();
    }, { threshold: 0.15, rootMargin: "0px 0px -25% 0px" });
    failureObserver.observe(failureSection);
  }

  /* ---------- problem scene: one-shot continuity break (no loops) ---------- */
  const lossScene = $(".loss-scene");
  if (lossScene && "IntersectionObserver" in window && !REDUCED) {
    const lossObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      lossScene.classList.add("is-live");
      lossObserver.disconnect();
    }, { threshold: 0.15, rootMargin: "0px 0px -25% 0px" });
    lossObserver.observe(lossScene);
  }

  /* ---------- the cost scene: try-resume machine (initial → blocked → manual-restored) ---------- */
  if (lossScene) {
    const $l = (s) => lossScene.querySelector(s);
    const act = $l(".loss-act"), give = $l(".loss-give"), again = $l(".loss-again"),
      gotoRef = $l(".loss-goto"), question = $l(".loss-question"), brief = $l(".loss-brief"),
      ref = $l(".loss-session--next .loss-ref"), miss = $l(".loss-ref-miss"), restored = $l(".loss-restored"),
      reused = $l(".loss-reused"), link = $l(".loss-link"), manual = $l(".loss-link-manual"),
      mtag = $l(".loss-link-tag"), stakeNow = $l(".loss-stakes-now"), stakeDone = $l(".loss-stakes-done"),
      announce = $l(".loss-announce");
    if (act && give && again && ref) {
      let state = "initial", fx = 0;
      const linkLabel = link.getAttribute("aria-label");
      const say = (b) => { if (announce) announce.textContent = b.dataset.msg || ""; };
      const show = (e, on) => { if (e) e.hidden = !on; };
      const render = (next) => {
        state = next;
        const blocked = next === "blocked", done = next === "manual-restored";
        show(act, next === "initial"); show(question, blocked); show(brief, blocked);
        show(gotoRef, blocked); show(give, blocked); show(miss, !done); show(restored, done);
        show(reused, done); show(manual, done); show(mtag, done); show(again, done);
        show(stakeNow, !done); show(stakeDone, done);
        ref.classList.toggle("loss-ref--restored", done);
        ref.classList.toggle("loss-ref--empty", !done);
        link.setAttribute("aria-label", done ? link.dataset.altS2 : linkLabel);
      };
      const focusIn = (el) => { if (el) { el.tabIndex = -1; el.focus(); } };
      render("initial");
      act.addEventListener("click", () => {
        if (state !== "initial") return;
        render("blocked"); say(act);
        question.tabIndex = -1; question.focus();
        if (!REDUCED) {
          lossScene.classList.add("is-blocking");
          clearTimeout(fx); fx = setTimeout(() => lossScene.classList.remove("is-blocking"), 1000);
        }
      });
      give.addEventListener("click", () => {
        if (state !== "blocked") return;
        render("manual-restored"); say(give);
        clearTimeout(fx); lossScene.classList.remove("is-blocking");
        if (!REDUCED) link.classList.add("is-restoring");
        focusIn(restored);
      });
      again.addEventListener("click", () => {
        if (state !== "manual-restored") return;
        say(again); link.classList.remove("is-restoring"); render("initial");
        act.focus({ preventScroll: true });
      });
      if (gotoRef) gotoRef.addEventListener("click", (e) => {
        e.preventDefault();
        if (give) { give.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "nearest" }); give.focus({ preventScroll: true }); }
      });
    }
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

  /* ---------- I-11: language switch with a short fade-out; preserves section anchor ---------- */
  $$(".lang-link").forEach((a) =>
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      let target = href;
      const h = window.location.hash;
      if (/^#[A-Za-z][\w-]*$/.test(h) && document.getElementById(h.slice(1))) target = href + h;
      if (REDUCED) { window.location.href = target; return; }
      e.preventDefault();
      document.body.classList.add("lang-out");
      setTimeout(() => { window.location.href = target; }, 180);
    })
  );

  /* ---------- case detail modal: click anywhere on the item ---------- */
  const caseDialog = $("#case-dialog");
  if (caseDialog && typeof caseDialog.showModal === "function") {
    let lastTrigger = null;
    const setText = (sel, v) => { const el = $(sel, caseDialog); if (el) el.textContent = v || ""; };
    $$(".failure-case").forEach((item, idx) => {
      const btn = $(".case-open", item);
      if (!btn) return;
      const title = $(".case-title b", item);
      const mech = $(".case-mech", item);
      const desc = $(".case-desc", item);
      btn.setAttribute("aria-label", (item.dataset.more || "Details") + ": " + (title ? title.textContent : ""));
      btn.addEventListener("click", () => {
        if (caseDialog.open) return;
        lastTrigger = btn;
        setText("#case-dialog-kicker", String(idx + 1).padStart(2, "0") + " · " + (mech ? mech.textContent.trim() : (item.dataset.ask || "")));
        setText("#case-dialog-title", title ? title.textContent : "");
        setText("#case-dialog-desc", desc ? desc.textContent : "");
        setText("#case-dialog-ask", item.dataset.ask || "");
        setText("#case-dialog-extra", item.dataset.extra || "");
        caseDialog.showModal();
      });
    });
    caseDialog.addEventListener("click", (e) => { if (e.target === caseDialog) caseDialog.close(); });
    caseDialog.addEventListener("close", () => { if (lastTrigger) lastTrigger.focus(); });
  }

  /* ---------- section navigation: floating arrows, passive scroll, no hijack ---------- */
  const sectionNav = $(".section-nav");
  if (sectionNav) {
    const navSections = $$("main > section[id]");
    /* section labels: data-section-name wins (home), else current page's
       submenu label, else first heading, else the id itself */
    const subNames = {};
    $$(".nav-entry").forEach((entry) => {
      const top = $(".nav-top", entry);
      if (!top || top.getAttribute("aria-current") !== "page") return;
      entry.querySelectorAll(".nav-sub a[href*='#']").forEach((a) => {
        const h = a.getAttribute("href").split("#")[1];
        if (h) subNames[h] = a.textContent.trim();
      });
    });
    const secName = (s) =>
      s.dataset.sectionName || subNames[s.id] ||
      ((s.querySelector("h1,h2") || {}).textContent || "").trim() || s.id;
    if (navSections.length > 1) {
      sectionNav.hidden = false;
      const prevBtn = $('[data-nav-dir="prev"]', sectionNav);
      const nextBtn = $('[data-nav-dir="next"]', sectionNav);
      const counter = $(".section-nav-count", sectionNav);
      const es = document.documentElement.lang === "es";
      const labels = es
        ? { prev: "Ir a la sección anterior: ", next: "Ir a la sección siguiente: " }
        : { prev: "Go to previous section: ", next: "Go to next section: " };
      let current = 0;
      let lockUntil = 0;
      const render = () => {
        const name = (i) => secName(navSections[i]);
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === navSections.length - 1;
        const pt = current > 0 ? labels.prev + name(current - 1) : labels.prev + name(0);
        const nt = current < navSections.length - 1 ? labels.next + name(current + 1) : labels.next + name(current);
        prevBtn.setAttribute("aria-label", pt);
        nextBtn.setAttribute("aria-label", nt);
        prevBtn.title = name(Math.max(0, current - 1));
        nextBtn.title = name(Math.min(navSections.length - 1, current + 1));
        prevBtn.dataset.tip = current > 0 ? name(current - 1) : "";
        nextBtn.dataset.tip = current < navSections.length - 1 ? name(current + 1) : "";
        counter.textContent = String(current + 1).padStart(2, "0") + " / " + String(navSections.length).padStart(2, "0");
      };
      const sync = () => {
        if (performance.now() < lockUntil) return;
        let idx = 0;
        navSections.forEach((s, i) => {
          if (s.getBoundingClientRect().top <= 120) idx = i;
        });
        if (idx !== current) { current = idx; render(); }
      };
      const go = (i) => {
        if (i < 0 || i >= navSections.length) return;
        navSections[i].scrollIntoView({ block: "start", behavior: REDUCED ? "auto" : "smooth" });
        current = i;
        render();
        lockUntil = performance.now() + (REDUCED ? 150 : 1100);
        window.setTimeout(() => { lockUntil = 0; sync(); }, REDUCED ? 180 : 1200);
      };
      prevBtn.addEventListener("click", () => go(current - 1));
      nextBtn.addEventListener("click", () => go(current + 1));
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { sync(); ticking = false; });
      }, { passive: true });
      window.addEventListener("resize", sync, { passive: true });
      if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const near = (x, type) => {
          if (type === "touch") return;
          sectionNav.classList.toggle("is-near", window.innerWidth - x <= 110);
        };
        document.addEventListener("pointermove", (e) => near(e.clientX, e.pointerType), { passive: true });
        $$("object").forEach((o) => {
          const attach = () => {
            try {
              const d = o.contentDocument;
              if (d) d.addEventListener("pointermove", (e) => near(e.clientX + o.getBoundingClientRect().left, e.pointerType), { passive: true });
            } catch (err) { /* cross-origin object: ignore */ }
          };
          attach();
          o.addEventListener("load", attach);
        });
        document.addEventListener("pointerleave", () => sectionNav.classList.remove("is-near"));
      }
      sync();
      render();
    }
  }

})();
