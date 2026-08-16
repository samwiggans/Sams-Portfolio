/* ===========================================================
   TikTok section — count-up animation
   Numbers roll from zero the first time a card scrolls into
   view. Anyone who has asked for reduced motion just gets the
   final figure.
   =========================================================== */

(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DURATION = 1700;

  function format(el, value) {
    const decimals = Number(el.dataset.decimals || 0);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    return prefix + value.toFixed(decimals) + suffix;
  }

  /* Quartic ease-out: quick off the mark but the digits keep ticking most of
     the way. Expo looked better on paper and then sat on the final number for
     the last 40% of the run. */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function countUp(el) {
    const target = Number(el.dataset.target);
    if (Number.isNaN(target)) return;

    if (reduced) {
      el.textContent = format(el, target);
      return;
    }

    const start = performance.now();
    (function step(now) {
      const progress = Math.min((now - start) / DURATION, 1);
      el.textContent = format(el, target * easeOutQuart(progress));
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = format(el, target);
    })(start);
  }

  const cards = document.querySelectorAll(".stat-card");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      const value = entry.target.querySelector(".stat-value");
      if (value) countUp(value);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  cards.forEach((card, i) => {
    card.style.transitionDelay = i * 120 + "ms";
    observer.observe(card);
  });

  /* Everything else that fades in (the CTA row) */
  const fade = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal:not(.stat-card)").forEach(el => fade.observe(el));
})();
