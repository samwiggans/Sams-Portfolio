/* ===========================================================
   Shared stat-card counter
   Numbers roll up from zero the first time a card scrolls into
   view. Pages with figures that change while you're on them
   (the Stadium Checklist) call Stats.set() to re-count.
   Anyone who has asked for reduced motion just gets the figure.
   =========================================================== */

(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shown = new WeakMap();   // element -> value currently displayed

  function format(el, value) {
    const decimals = Number(el.dataset.decimals || 0);
    return (el.dataset.prefix || "") + value.toFixed(decimals) + (el.dataset.suffix || "");
  }

  /* Quick off the mark, digits still ticking most of the way. */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animate(el, from, to, duration) {
    if (reduced || duration === 0) {
      el.textContent = format(el, to);
      shown.set(el, to);
      return;
    }
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const value = from + (to - from) * easeOutQuart(p);
      el.textContent = format(el, value);
      if (p < 1) requestAnimationFrame(step);
      else { el.textContent = format(el, to); shown.set(el, to); }
    })(start);
  }

  const Stats = {
    /* Count every card up as it appears. */
    init(root) {
      const cards = (root || document).querySelectorAll(".stat-card");
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          const value = entry.target.querySelector(".stat-value");
          if (value) animate(value, 0, Number(value.dataset.target) || 0, 1700);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.35 });

      cards.forEach((card, i) => {
        card.style.transitionDelay = i * 120 + "ms";
        io.observe(card);
      });
    },

    /* Change a figure after the fact — short count from wherever it is now. */
    set(el, value) {
      if (!el) return;
      el.dataset.target = value;
      const card = el.closest(".stat-card");
      // Not counted in yet? Leave it — the observer will run it from zero.
      if (card && !card.classList.contains("in")) return;
      animate(el, shown.get(el) || 0, value, 550);
    }
  };

  window.Stats = Stats;
  Stats.init();

  /* Anything else marked .reveal fades in on arrival. Stat cards get their
     .in from the counter above, so they're excluded here. */
  const fade = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal:not(.stat-card)").forEach(el => fade.observe(el));
})();
