/**
 * Chenkai Zhang — ECE Portfolio
 * Interactive effects:
 *  - Animated particle / grid canvas background
 *  - Custom cursor with hover enlargement
 *  - Scroll progress bar
 *  - Smooth scroll with fixed-header offset
 *  - Scroll-triggered reveal animations
 *  - Active section tracking in nav
 *  - Number counter animations for stats
 *  - Terminal typing on first view
 *  - Mobile nav toggle with escape/outside-click close
 *  - Header blur/shadow on scroll
 */

(function () {
  "use strict";

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -----------------------------------------------------------------------
  // Footer year
  // -----------------------------------------------------------------------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // -----------------------------------------------------------------------
  // Mobile nav toggle
  // -----------------------------------------------------------------------
  const header = $(".site-header");
  const nav = $("#site-nav");
  const toggle = $("#nav-toggle");
  const navLinks = $$('.site-nav a[href^="#"]');

  function headerOffset() {
    return header ? header.getBoundingClientRect().height : 64;
  }
  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      if (nav.classList.contains("is-open")) closeNav();
      else openNav();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // Close mobile nav when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav || !toggle) return;
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    closeNav();
  });

  // -----------------------------------------------------------------------
  // Smooth scroll with offset + update hash
  // -----------------------------------------------------------------------
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeNav();
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset() - 12;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  // Also catch hero scroll indicator
  const scrollIndicator = $(".scroll-indicator");
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", (e) => {
      const id = scrollIndicator.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset() - 12;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  // -----------------------------------------------------------------------
  // Scroll progress bar + header state + active section
  // -----------------------------------------------------------------------
  const scrollBar = $("#scroll-bar");
  const sections = $$("main section[id]");

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollBar) scrollBar.style.width = pct + "%";

    if (header) {
      if (scrollTop > 20) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }

    // Active section
    const y = scrollTop + headerOffset() + 80;
    let currentId = null;
    for (const sec of sections) {
      if (sec.offsetTop <= y) currentId = sec.id;
    }
    navLinks.forEach((a) => {
      const hash = a.getAttribute("href");
      if (hash === "#" + currentId) a.classList.add("is-active");
      else a.classList.remove("is-active");
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // -----------------------------------------------------------------------
  // Custom cursor
  // -----------------------------------------------------------------------
  const cursorDot = $(".cursor-dot");
  const cursorRing = $(".cursor-ring");
  const canUseCursor = cursorDot && cursorRing && window.matchMedia("(hover: hover)").matches;

  if (canUseCursor) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    function tick() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    tick();

    // Hover targets
    const hoverables = "a, button, .focus-tile, .stat-card, .project-item, .node-content, .terminal-card";
    $$(hoverables).forEach((el) => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("is-hover"));
    });

    document.addEventListener("mouseleave", () => {
      cursorDot.style.opacity = "0";
      cursorRing.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      cursorDot.style.opacity = "1";
      cursorRing.style.opacity = "1";
    });
  }

  // -----------------------------------------------------------------------
  // Reveal on scroll (adds .is-in)
  // -----------------------------------------------------------------------
  const revealEls = $$(
    ".section-head, .about-main, .about-aside, .focus-tile, .stack-row, .project-item, .timeline-node, .fancy-card, .contact-grid"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  // -----------------------------------------------------------------------
  // Stat counter animation
  // -----------------------------------------------------------------------
  const statNums = $$(".stat-num");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target || "0", 10);
        const duration = 1400;
        const start = performance.now();
        const startVal = 0;

        function step(now) {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = Math.floor(startVal + (target - startVal) * eased);
          el.textContent = String(val);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = String(target);
        }
        requestAnimationFrame(step);
        countIO.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNums.forEach((el) => countIO.observe(el));
  } else {
    statNums.forEach((el) => {
      el.textContent = el.dataset.target || "0";
    });
  }

  // -----------------------------------------------------------------------
  // Canvas background: flowing grid + slow particles
  // -----------------------------------------------------------------------
  const canvas = $("#bg-canvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let mouse = { x: -9999, y: -9999 };

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function initParticles() {
      const area = w * h;
      const count = Math.min(80, Math.max(30, Math.floor(area / 28000)));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.4 + 0.4,
          hue: Math.random() > 0.5 ? "accent" : "cyan",
        });
      }
    }

    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    document.addEventListener("mouseleave", () => {
      mouse.x = -9999; mouse.y = -9999;
    });

    function drawGrid() {
      const step = 60;
      ctx.strokeStyle = "rgba(245, 166, 35, 0.035)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawGrid();

      // Update + draw particles
      for (const p of particles) {
        // Mouse attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 140 * 140) {
          const f = 0.0006;
          p.vx += dx * f;
          p.vy += dy * f;
        }

        p.x += p.vx;
        p.y += p.vy;
        // Gentle friction
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = p.hue === "accent"
          ? "rgba(245, 166, 35, 0.8)"
          : "rgba(77, 224, 199, 0.6)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connect nearby
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * 0.18;
            ctx.strokeStyle = `rgba(245, 166, 35, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();
  }

  // -----------------------------------------------------------------------
  // Subtle tilt on focus tiles (pointer-based)
  // -----------------------------------------------------------------------
  if (!prefersReduced && window.matchMedia("(hover: hover)").matches) {
    $$(".focus-tile, .stat-card").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = (-y * 4).toFixed(2);
        const ry = (x * 4).toFixed(2);
        el.style.transform = `perspective(800px) translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

})();
