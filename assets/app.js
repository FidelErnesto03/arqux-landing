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
  $$(".segmented[hidden], .copy-btn[hidden], .ev-filterbar[hidden]").forEach((el) => { el.hidden = false; });

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
      /* transient open: hover on fine pointers, focus within. Closing is
         delayed (~240ms) so diagonal cursor travel across the gap between
         the top link and the submenu does not dismiss it mid-flight. */
      let closeTimer = null;
      if (finePointer) {
        g.addEventListener("mouseenter", () => {
          clearTimeout(closeTimer);
          closeSubs(g);
          setOpen(g, true);
        });
        g.addEventListener("mouseleave", () => {
          clearTimeout(closeTimer);
          closeTimer = setTimeout(() => {
            if (!g.hasAttribute("data-pinned") && !g.matches(":hover")) setOpen(g, false);
          }, 240);
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

  /* ---------- cost cube: the left rail turns the right face ---------- */
  const costCards = $$(".cost-card[data-cost]");
  const costCube = $(".cost-cube");
  if (costCards.length && costCube) {
    const faces = $$(".cost-face", costCube);
    const cubeInner = $(".cost-cube-inner", costCube);
    let activeCost = null;
    const setFace = (n) => {
      costCube.dataset.costCube = String(n);
      faces.forEach((f) => {
        const on = f.dataset.costFace === String(n);
        f.classList.toggle("is-active", on);
        f.setAttribute("aria-hidden", on ? "false" : "true");
      });
    };
    const renderCost = (id) => {
      activeCost = id;
      costCards.forEach((card) => {
        const on = card.dataset.cost === id;
        card.classList.toggle("is-active", on);
        card.setAttribute("aria-expanded", on ? "true" : "false");
      });
      setFace(id === null ? 0 : id);
      if (costCube.dataset.scroll !== "off" && id !== null) {
        const top = costCube.getBoundingClientRect().top;
        if (top < 60 || top > window.innerHeight * 0.6) {
          costCube.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "nearest" });
        }
      }
    };
    costCards.forEach((card) => {
      card.setAttribute("aria-expanded", "false");
      card.setAttribute("aria-controls", "cost-cube-inner");
      card.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        renderCost(activeCost === card.dataset.cost ? null : card.dataset.cost);
      });
    });
    setFace(0);
    const hashCost = (location.hash.match(/^#cost-detail-([1-4])$/) || [])[1];
    if (hashCost) renderCost(hashCost);
  }

  /* ---------- anchor jumps: render off-screen sections for the flight, then glide (exact target, native smooth) ---------- */
  function scrollToSection(target) {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    let focusEl = el;
    if (el.classList && el.classList.contains("section-alias")) {
      const sec = el.closest("section");
      const heading = sec && sec.querySelector("h1, h2");
      if (heading) focusEl = heading;
    }
    if (!focusEl.hasAttribute("tabindex")) focusEl.setAttribute("tabindex", "-1");
    const det = el.tagName === "DETAILS" ? el : el.closest("details");
    if (det) det.open = true;
    focusEl.focus({ preventScroll: true });
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

  /* ---------- workflow stages: detail opens as modal (home case-dialog pattern) ---------- */
  const steps = $$(".step");
  const stepDialog = $("#step-dialog");
  const setText = (sel, v) => { const el = $(sel); if (el && v) el.textContent = v; };
  let stepTrigger = null;
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
      setText("#step-case", s.case);
      if (stepDialog && typeof stepDialog.showModal === "function" && !stepDialog.open) {
        stepTrigger = btn;
        stepDialog.showModal();
      }
    })
  );
  if (stepDialog && typeof stepDialog.showModal === "function") {
    stepDialog.addEventListener("click", (e) => { if (e.target === stepDialog) stepDialog.close(); });
    stepDialog.addEventListener("close", () => { if (stepTrigger) stepTrigger.focus(); });
  }

  /* ---------- dimensions selector (hexagon menu sinks, detail card replaces it) ---------- */
  const dims = data.dims || [];
  const hexPath = $(".hex-path");
  const dimLogo = $(".dim-logo image") || $(".dim-logo");
  const dimVisual = $("#dimensions .hex-visual");
  const dimPreview = $("#dimensions .artifact-preview");
  let dimTrigger = null;
  let dimFocusTimer = null;
  if (dimVisual) {
    if ("IntersectionObserver" in window && !REDUCED) {
      const hexIO = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        hexIO.disconnect();
        dimVisual.classList.add("entered");
      }, { threshold: 0.25 });
      hexIO.observe(dimVisual);
    } else {
      dimVisual.classList.add("entered");
    }
  }
  function openDimDetail() {
    if (!dimVisual) return;
    dimVisual.classList.remove("replay");
    dimVisual.classList.add("is-detail");
  }
  function closeDimDetail() {
    if (!dimVisual || !dimVisual.classList.contains("is-detail")) return;
    if (dimFocusTimer) { clearTimeout(dimFocusTimer); dimFocusTimer = null; }
    dimVisual.classList.add("replay");
    dimVisual.classList.remove("is-detail");
    if (dimLogo) dimLogo.classList.remove("pulse");
    setTimeout(() => dimVisual.classList.remove("replay"), 1500);
    if (dimTrigger) { const t = dimTrigger; dimTrigger = null; setTimeout(() => t.focus({ preventScroll: true }), 120); }
  }
  function selectDimension(i, trigger) {
    if (trigger) dimTrigger = trigger;
    if (dimFocusTimer) { clearTimeout(dimFocusTimer); dimFocusTimer = null; }
    const d = dims[i] || {};
    const arr = Array.isArray(d);
    const name = arr ? d[0] || "" : d.name || "";
    $$("[data-dimension]").forEach((el) =>
      el.setAttribute("aria-pressed", String(Number(el.dataset.dimension) === i))
    );
    if (hexPath) hexPath.style.strokeDashoffset = String(Math.max(0, 1 - (i + 1) / 6));
    if (dimLogo) { dimLogo.classList.remove("pulse"); void dimLogo.getBoundingClientRect(); dimLogo.classList.add("pulse"); }
    openDimDetail();
    setText("#artifact-name", (data.artifactLabel || "") + name.toLowerCase());
    setText("#dim-benefit", arr ? "" : (d.sum || ""));
    setText("#artifact-code", arr ? d[2] : d.code);
    if (!arr) {
      setText("#ficha-fn", d.fn);
      setText("#ficha-via", d.via);
      setText("#ficha-lim", d.lim);
      setText("#artifact-status", d.tag);
      const a = $("#ficha-src");
      if (a && d.src) { a.href = d.src; a.textContent = (d.srcLabel || d.src) + " ↗"; }
    }
    hexLabels.forEach((t) => t.classList.toggle("is-active", Number(t.dataset.dim) === i));
    if (dimPreview) dimFocusTimer = setTimeout(() => { if (dimVisual && dimVisual.classList.contains("is-detail")) { dimPreview.focus(); dimPreview.scrollIntoView({ block: "nearest" }); } }, 60);
  }
  const dimNodes = $$("#dimensions .hex-node");
  const dimChips = $$("#dimensions .dim-chip");
  const hexLabels = $$("#dimensions .hex-labels text");
  if (dimPreview) {
    const closeBtn = $(".dim-preview-close", dimPreview);
    if (closeBtn) closeBtn.addEventListener("click", closeDimDetail);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dimVisual && dimVisual.classList.contains("is-detail") && !(stepDialog && stepDialog.open))
        closeDimDetail();
    });
  }
  dimNodes.forEach((el, idx) => {
    const dim = Number(el.dataset.dimension);
    el.addEventListener("click", () => selectDimension(dim, el));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectDimension(dim, el);
        return;
      }
      if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        const dir = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : -1;
        const next = dimNodes[(idx + dir + dimNodes.length) % dimNodes.length];
        next.focus();
        selectDimension(Number(next.dataset.dimension), next);
      }
    });
  });
  dimChips.forEach((chip, idx) => {
    chip.addEventListener("click", () => selectDimension(Number(chip.dataset.dimension), chip));
    chip.addEventListener("keydown", (e) => {
      if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) return;
      e.preventDefault();
      const dir = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : -1;
      dimChips[(idx + dir + dimChips.length) % dimChips.length].focus();
    });
  });

  /* ---------- codec representation selector (+ I-08: one-shot panel transition) ---------- */
  const views = $$("[data-code-view]");
  const codePanels = $$("[data-code-panel]");
  const codeMq = window.matchMedia("(max-width:760px)");
  let codeManual = false;
  const applyCodeView = (view, animate) => {
    views.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.codeView === view)));
    codePanels.forEach((p) => {
      const show = view === "both" || p.dataset.codePanel === view;
      p.hidden = !show;
      if (show && animate && !REDUCED) {
        p.classList.remove("panel-in");
        void p.offsetWidth;
        p.classList.add("panel-in");
        p.addEventListener("animationend", () => p.classList.remove("panel-in"), { once: true });
      }
    });
  };
  applyCodeView(codeMq.matches ? "human" : "both", false);
  if (codeMq.addEventListener) codeMq.addEventListener("change", () => { if (!codeManual) applyCodeView(codeMq.matches ? "human" : "both", false); });
  views.forEach((btn) =>
    btn.addEventListener("click", () => {
      codeManual = true;
      applyCodeView(btn.dataset.codeView, true);
    })
  );

  /* ---------- evidence group filter (trust #evidence; all groups visible without JS) ---------- */
  const evBar = $(".ev-filterbar");
  if (evBar) {
    const scope = evBar.closest("section") || document;
    const groups = $$(".ev-group", scope);
    $$(".ev-filter", evBar).forEach((btn) =>
      btn.addEventListener("click", () => {
        const f = btn.dataset.evFilter || "all";
        $$(".ev-filter", evBar).forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        groups.forEach((g) => { g.hidden = f !== "all" && g.dataset.evGroup !== f; });
      })
    );
  }

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

  /* ---------- case deck: the list flips to the detail of the chosen item ---------- */
  const caseDeck = $(".failure-deck");
  if (caseDeck) {
    const inner = $(".failure-deck-inner", caseDeck);
    const front = $(".failure-face--front", caseDeck);
    const back = $(".failure-face--back", caseDeck);
    const backInner = $(".case-back-inner", caseDeck);
    const backClose = $(".case-back-close", caseDeck);
    let lastTrigger = null;

    const fill = (item, idx) => {
      const title = $(".case-title b", item);
      const mech = $(".case-mech", item);
      const desc = $(".case-desc", item);
      const set = (sel, v) => { const el = $(sel, caseDeck); if (el) el.textContent = v || ""; };
      set(".case-back-num", String(idx + 1).padStart(2, "0") + " / " + String($$(".failure-case").length).padStart(2, "0"));
      set(".case-back-mech", mech ? mech.textContent.trim() : "");
      set(".case-back-title", title ? title.textContent : "");
      set(".case-back-desc", desc ? desc.textContent : "");
      set(".case-back-ask", item.dataset.ask || "");
      set(".case-back-extra", item.dataset.extra || "");
      if (backClose) backClose.setAttribute("aria-label", (item.dataset.back || "Back to the list"));
    };

    const openCase = (item, idx) => {
      fill(item, idx);
      caseDeck.classList.add("is-flipped");
      caseDeck.setAttribute("data-open", "1");
      caseDeck.setAttribute("data-fig", String(idx));
      front.setAttribute("aria-hidden", "true");
      front.setAttribute("inert", "");
      back.removeAttribute("aria-hidden");
      back.removeAttribute("inert");
      $$(".failure-case").forEach((li) => {
        const b = $(".case-open", li);
        if (b) b.setAttribute("aria-expanded", li === item ? "true" : "false");
      });
      if (caseDeck.dataset.scroll !== "off") {
        const top = caseDeck.getBoundingClientRect().top;
        if (top < 0) caseDeck.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      if (backClose) backClose.focus();
    };

    const closeCase = () => {
      caseDeck.classList.remove("is-flipped");
      caseDeck.removeAttribute("data-open");
      back.setAttribute("aria-hidden", "true");
      back.setAttribute("inert", "");
      front.removeAttribute("aria-hidden");
      front.removeAttribute("inert");
      $$(".failure-case").forEach((li) => {
        const b = $(".case-open", li);
        if (b) b.setAttribute("aria-expanded", "false");
      });
      if (lastTrigger) lastTrigger.focus();
    };

    back.setAttribute("aria-hidden", "true");
    back.setAttribute("inert", "");

    const items = $$(".failure-case", caseDeck);
    items.forEach((item, idx) => {
      const btn = $(".case-open", item);
      if (!btn) return;
      const title = $(".case-title b", item);
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "case-deck-inner");
      btn.setAttribute("aria-label", (item.dataset.more || "Details") + ": " + (title ? title.textContent : ""));
      btn.addEventListener("click", () => {
        if (caseDeck.classList.contains("is-flipped")) return;
        lastTrigger = btn;
        openCase(item, idx);
      });
    });

    if (backClose) backClose.addEventListener("click", closeCase);
    if (backInner) backInner.addEventListener("click", (e) => {
      if (e.target.closest(".case-back-close")) return;
      closeCase();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && caseDeck.classList.contains("is-flipped")) closeCase();
    });
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
      /* the counter doubles as the section index: on collapsed nav widths it
         opens the mobile menu and expands the current page's group; on desktop
         it pins open the current page's submenu. Gives every section a
         persistent granular entry point on long pages (audit N5). */
      if (counter && navGroups.length) {
        counter.setAttribute("aria-label", es ? "Índice de secciones" : "Section index");
        counter.addEventListener("click", (e) => {
          e.stopPropagation(); /* keep the doc-level outside-click closers from undoing this */
          const entry = navGroups.find((g) => {
            const t = $(".nav-top", g);
            return t && t.getAttribute("aria-current") === "page";
          });
          const toggle = entry && $(".nav-sub-toggle", entry);
          if (!entry || !toggle) return;
          if (window.matchMedia && window.matchMedia("(max-width: 960px)").matches) {
            if (menu && nav && !nav.classList.contains("open")) menu.click();
          }
          if (!entry.classList.contains("is-open")) toggle.click();
        });
      }
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { sync(); ticking = false; });
      }, { passive: true });
      /* mobile: the bottom bar retracts while reading down and returns on
         scroll-up / keyboard focus — it never covers content permanently */
      const mobileNav = window.matchMedia && window.matchMedia("(max-width: 760px)");
      if (mobileNav && mobileNav.matches) {
        let lastY = window.scrollY, showNav = window.scrollY < 40, navTick = false;
        const applyNav = () => sectionNav.classList.toggle("is-nav-show", showNav);
        applyNav();
        window.addEventListener("scroll", () => {
          if (navTick) return;
          navTick = true;
          requestAnimationFrame(() => {
            navTick = false;
            const y = window.scrollY;
            if (y < 40 || y < lastY - 6) showNav = true;
            else if (y > lastY + 6) showNav = false;
            lastY = y;
            applyNav();
          });
        }, { passive: true });
      }
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
