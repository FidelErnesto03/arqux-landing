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

  /* ---------- hero: channel board (apps outside · MCP requests · one governance) ---------- */
  const wsboard = $("#wsboard");
  if (wsboard) {
    const wsBtns = $$("[data-ws-harness]", wsboard);
    const wsAxis = $("#ws-axis");
    const wsReqs = $$(".ws-req", wsboard);
    const wsGovChips = $$(".ws-gov-chips span", wsboard);
    const wsProject = $("#ws-project");
    const wsMind = $("#ws-mind");
    const wsChannelHead = $(".ws-channel-head", wsboard);
    const wsTechBtn = $("#ws-tech-btn");
    const wsSayText = $("#ws-say-text");
    const wsSayHint = $("#ws-say-hint");
    const wsSayCount = $("#ws-say-count");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let flowToken = 0;
    let initialTimer;
    let currentKey = "codex";
    const govFor = (key) => wsGovChips.find((c) => c.dataset.wsGov === key);
    const buildSteps = () => {
      const active = wsBtns.find((b) => b.dataset.wsHarness === currentKey) || wsBtns[0];
      const steps = [{ node: active, extras: [] }, { node: wsAxis, extras: [] }];
      wsReqs.forEach((req) => {
        const chip = govFor(req.dataset.wsReq);
        const extras = chip ? [chip] : [];
        if (req.dataset.wsReq === "context" && wsMind) extras.push(wsMind);
        steps.push({ node: req, extras });
      });
      const evidence = govFor("evidence");
      steps.push({ node: wsProject, extras: evidence ? [evidence] : [] });
      return steps.filter((step) => step.node);
    };
    const setPressed = (key) => {
      currentKey = key;
      wsBtns.forEach((b) => {
        const on = b.dataset.wsHarness === key;
        b.setAttribute("aria-pressed", String(on));
        b.classList.toggle("is-on", on);
        b.disabled = false;
      });
    };
    const narrate = (node, index, total) => {
      if (wsSayText && node.dataset.say) {
        wsSayText.textContent = node.dataset.say;
        if (!reduceMotion) {
          wsSayText.classList.remove("is-swap");
          void wsSayText.offsetWidth;
          wsSayText.classList.add("is-swap");
        }
      }
      if (wsSayHint && node.dataset.hint) wsSayHint.textContent = node.dataset.hint;
      if (wsSayCount) wsSayCount.textContent = index + 1 + "/" + total;
    };
    const resetLights = () => {
      wsAxis.classList.remove("is-live");
      wsReqs.forEach((req) => req.classList.remove("is-live"));
      wsGovChips.forEach((chip) => chip.classList.remove("is-live"));
      if (wsMind) wsMind.classList.remove("is-live");
      wsProject.classList.remove("is-live");
    };
    const light = (step) => {
      step.node.classList.add("is-live");
      step.extras.forEach((el) => el.classList.add("is-live"));
    };
    const runSequence = (key) => {
      const token = ++flowToken;
      setPressed(key);
      const steps = buildSteps();
      resetLights();
      if (reduceMotion) {
        steps.forEach((step) => light(step));
        narrate(steps[steps.length - 1].node, steps.length - 1, steps.length);
        return;
      }
      steps.forEach((step, i) => {
        window.setTimeout(() => {
          if (token !== flowToken) return;
          light(step);
          narrate(step.node, i, steps.length);
        }, 160 + i * 900);
      });
    };
    const jumpTo = (node) => {
      flowToken += 1;
      window.clearTimeout(initialTimer);
      const steps = buildSteps();
      const index = steps.findIndex((step) => step.node === node);
      if (index < 0) return;
      resetLights();
      steps.forEach((step, i) => { if (i <= index) light(step); });
      narrate(node, index, steps.length);
    };
    wsBtns.forEach((b) => b.addEventListener("click", () => {
      window.clearTimeout(initialTimer);
      runSequence(b.dataset.wsHarness);
    }));
    if (wsTechBtn) {
      wsTechBtn.hidden = false;
      wsTechBtn.addEventListener("click", () => {
        const open = wsboard.classList.toggle("ws-board--tech");
        wsTechBtn.setAttribute("aria-expanded", String(open));
        wsTechBtn.textContent = open ? wsTechBtn.dataset.hide : wsTechBtn.dataset.show;
      });
    }
    if (wsChannelHead) {
      wsChannelHead.addEventListener("click", () => jumpTo(wsAxis));
      wsChannelHead.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        jumpTo(wsAxis);
      });
    }
    wsProject.addEventListener("click", () => jumpTo(wsProject));
    wsProject.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      jumpTo(wsProject);
    });
    wsReqs.forEach((req) => {
      req.addEventListener("click", () => jumpTo(req));
      req.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        jumpTo(req);
      });
    });
    const initial = wsBtns.find((b) => b.getAttribute("aria-pressed") === "true") || wsBtns[0];
    if (initial) {
      setPressed(initial.dataset.wsHarness);
      narrate(initial, 0, 7);
      initialTimer = window.setTimeout(() => runSequence(initial.dataset.wsHarness), 420);
    }
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

  /* ---------- I-02: progress rail + scrollspy (1/6 … 6/6) ---------- */
  const rail = $(".progress-rail");
  if (rail) {
    const links = $$("a[href^='#']", rail);
    const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
    const count = $(".rail-count", rail);
    let ticking = false;
    function spy() {
      ticking = false;
      const line = window.innerHeight * 0.45;
      let idx = 0;
      sections.forEach((sec, i) => { if (sec.getBoundingClientRect().top <= line) idx = i; });
      links.forEach((a, i) => { a.classList.toggle("is-active", i === idx); if (i === idx) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
      if (count) count.textContent = (idx + 1) + "/" + sections.length;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(spy); }
    }, { passive: true });
    window.addEventListener("resize", spy);
    spy();
  }

  /* ---------- T-016: command palette — real actions only ---------- */
  const palette = $("#palette");
  if (palette) {
    const pInput = $("#palette-input");
    const pList = $("#palette-list");
    const pOpeners = $$("[data-palette-open]");
    const pTags = {
      go: palette.dataset.tagGo,
      action: palette.dataset.tagAction,
      lang: palette.dataset.tagLang,
    };
    let pItems = [];
    let pView = [];
    let pActive = 0;
    let pLastFocus = null;

    const buildPaletteItems = () => {
      const out = [];
      $$(".progress-rail a").forEach((a) => {
        const label = ($(".rail-label", a) || a).textContent.trim();
        out.push({ label, tag: pTags.go, run: () => scrollToSection(a.getAttribute("href")) });
      });
      const langLink = $(".lang-link");
      if (langLink) out.push({ label: palette.dataset.labelLang, tag: pTags.lang, run: () => { window.location.href = langLink.getAttribute("href"); } });
      return out;
    };

    const renderPalette = (query) => {
      const q = (query || "").trim().toLowerCase();
      pView = q ? pItems.filter((i) => (i.label + " " + i.tag).toLowerCase().includes(q)) : pItems.slice();
      if (pActive >= pView.length) pActive = Math.max(0, pView.length - 1);
      pList.textContent = "";
      if (!pView.length) {
        const li = document.createElement("li");
        li.className = "palette-empty";
        li.textContent = palette.dataset.empty;
        pList.appendChild(li);
        pInput.setAttribute("aria-activedescendant", "");
        return;
      }
      pView.forEach((item, idx) => {
        const li = document.createElement("li");
        li.id = "p-opt-" + idx;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", String(idx === pActive));
        li.className = "palette-item" + (idx === pActive ? " is-active" : "");
        const label = document.createElement("span");
        label.textContent = item.label;
        const tag = document.createElement("span");
        tag.className = "p-tag";
        tag.textContent = item.tag;
        li.appendChild(label);
        li.appendChild(tag);
        li.addEventListener("click", () => runPaletteItem(item));
        pList.appendChild(li);
      });
      pInput.setAttribute("aria-activedescendant", "p-opt-" + pActive);
      const activeEl = pList.children[pActive];
      if (activeEl && activeEl.scrollIntoView) activeEl.scrollIntoView({ block: "nearest" });
    };

    const runPaletteItem = (item) => { closePalette(); item.run(); };

    function openPalette() {
      pLastFocus = document.activeElement;
      pItems = buildPaletteItems();
      pActive = 0;
      pInput.value = "";
      palette.hidden = false;
      renderPalette("");
      pInput.focus();
    }
    function closePalette() {
      if (palette.hidden) return;
      palette.hidden = true;
      if (pLastFocus && pLastFocus.focus) pLastFocus.focus();
    }

    pInput.addEventListener("input", () => { pActive = 0; renderPalette(pInput.value); });
    pInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); if (pView.length) { pActive = (pActive + 1) % pView.length; renderPalette(pInput.value); } }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (pView.length) { pActive = (pActive - 1 + pView.length) % pView.length; renderPalette(pInput.value); } }
      else if (e.key === "Enter") { e.preventDefault(); if (pView[pActive]) runPaletteItem(pView[pActive]); }
      else if (e.key === "Escape") { e.preventDefault(); closePalette(); }
      else if (e.key === "Tab") { e.preventDefault(); }
    });
    pOpeners.forEach((b) => b.addEventListener("click", openPalette));
    $$("[data-palette-close]", palette).forEach((b) => b.addEventListener("click", closePalette));
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (palette.hidden) openPalette(); else closePalette();
      }
    });
  }

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

  /* ---------- T-018: quickstart route choice (both commands verified in v1.0.0) ---------- */
  const routeBtns = $$("[data-route]");
  if (routeBtns.length) {
    const preInit = $("#route-init");
    const preQuick = $("#route-quickstart");
    const qCopy = $("#quickstart .copy-btn");
    const ROUTES = {
      init: { cmd: "arqux init", pre: preInit },
      quickstart: { cmd: "arqux quickstart", pre: preQuick },
    };
    const setRoute = (key) => {
      if (!ROUTES[key]) return;
      routeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.route === key)));
      Object.keys(ROUTES).forEach((k) => { if (ROUTES[k].pre) ROUTES[k].pre.hidden = k !== key; });
      if (qCopy) qCopy.dataset.copy = "pip install arqux\n" + ROUTES[key].cmd + "\narqux sync-harnesses";
    };
    routeBtns.forEach((b) => b.addEventListener("click", () => setRoute(b.dataset.route)));
    setRoute("init");
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

  /* ---------- T-016: spotlight on the demo card (fine pointers only) ---------- */
  if (window.matchMedia && window.matchMedia("(pointer: fine)").matches && !REDUCED) {
    const spot = $("#demo");
    if (spot) {
      spot.addEventListener("pointerenter", () => spot.classList.add("is-spot"));
      spot.addEventListener("pointerleave", () => spot.classList.remove("is-spot"));
      spot.addEventListener("pointermove", (e) => {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", (e.clientX - r.left) + "px");
        spot.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
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
  $$("[data-dimension]").forEach((el) => {
    el.addEventListener("click", () => selectDimension(Number(el.dataset.dimension)));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectDimension(Number(el.dataset.dimension));
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

  /* ---------- I-05: codec round-trip playground (local transform, no backend) ---------- */
  const idea = $("#idea-input");
  if (idea) {
    const outCortex = $("#play-cortex");
    const outHuman = $("#play-human");
    const clean = (v) => v.replace(/["\\]/g, "").replace(/\s+/g, " ").trim();
    const update = () => {
      const v = clean(idea.value).slice(0, 64) || "…";
      if (outCortex) outCortex.textContent = 'KNW:idea{content:"' + v + '",status:current}';
      if (outHuman) outHuman.textContent = v;
    };
    idea.addEventListener("input", update);
    update();
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

  /* ---------- architecture: select a component and reveal its role ---------- */
  const archDataEl = $("#arch-data");
  if (archDataEl) {
    let archItems = [];
    try { archItems = JSON.parse(archDataEl.textContent) || []; } catch (e) { archItems = []; }
    const archNodes = $$("[data-arch]");
    const archLines = $$(".arch-lines line");
    const archLink = $("#arch-link");
    const putArch = (sel, value) => { const el = $(sel); if (el && value != null) el.textContent = value; };
    const selectArch = (id) => {
      const item = archItems.find((x) => x.id === id);
      if (!item) return;
      archNodes.forEach((node) => {
        const on = node.dataset.arch === id;
        node.classList.toggle("is-on", on);
        node.setAttribute("aria-pressed", String(on));
      });
      archLines.forEach((line) => line.classList.toggle("is-on", line.dataset.line === id));
      putArch("#arch-title", item.name);
      putArch("#arch-desc", item.desc);
      putArch("#arch-q", item.q);
      putArch("#arch-rel", item.rel);
      putArch("#arch-limit", item.limit);
      if (archLink && item.href) archLink.setAttribute("href", item.href);
    };
    archNodes.forEach((node) => node.addEventListener("click", () => selectArch(node.dataset.arch)));
    selectArch("project");
  }

})();
