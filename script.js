/**
 * Portfolio site — minimal JS for:
 * - Mobile navigation open/close
 * - Smooth scroll with fixed header offset (click nav links)
 * - Footer year
 */

(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var nav = document.getElementById("site-nav");
  var toggle = document.getElementById("nav-toggle");
  var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

  /** Approximate fixed header height for scroll margin */
  function headerOffset() {
    return header ? header.getBoundingClientRect().height : 56;
  }

  /** Close mobile menu */
  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  /** Open mobile menu */
  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /** Smooth scroll to hash targets, accounting for fixed header */
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeNav();
      var top = target.getBoundingClientRect().top + window.scrollY - headerOffset() - 8;
      window.scrollTo({ top: top, behavior: "smooth" });
      if (history.replaceState) {
        history.replaceState(null, "", id);
      }
    });
  });

  /** Close menu on escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /** Footer copyright year */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
