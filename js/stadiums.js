/* ===========================================================
   Stadium Checklist
   Two independent lists — grounds visited in general, and grounds
   visited watching Blackpool. Each keeps its own ticks, stored in
   this browser. Ticking one never touches the other.
   =========================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "samsStadiums.v1";
  const LISTS = ["general", "blackpool"];

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const TOTAL = LEAGUES.reduce((n, l) => n + l.clubs.length, 0);

  let activeList = "general";
  let ticks = load();

  /* ---------- storage ---------- */
  function load() {
    const empty = { general: [], blackpool: [] };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return empty;
      const parsed = JSON.parse(raw);
      LISTS.forEach(k => { if (!Array.isArray(parsed[k])) parsed[k] = []; });
      return parsed;
    } catch (err) {
      console.warn("Couldn't read saved ticks, starting fresh.", err);
      return empty;
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ticks));
    } catch (err) {
      console.error("Couldn't save ticks.", err);
    }
  }

  const isTicked = (list, id) => ticks[list].includes(id);

  function toggle(list, id) {
    const at = ticks[list].indexOf(id);
    if (at === -1) ticks[list].push(id);
    else ticks[list].splice(at, 1);
    save();
  }

  /* ---------- render ---------- */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, ch =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function buildLists() {
    $("#leagues").innerHTML = LEAGUES.map(league => `
      <section class="league" data-league="${esc(league.name)}">
        <header class="league-head">
          <div class="league-title">
            <h2>${esc(league.name)}</h2>
            <span class="tier">${esc(league.tier)}</span>
          </div>
          <div class="league-count"><b class="done">0</b> / ${league.clubs.length}</div>
        </header>
        <div class="league-bar"><span></span></div>
        <ul class="ground-list">
          ${league.clubs.map(c => `
            <li class="ground${c.home ? " is-home" : ""}" data-id="${esc(c.id)}"
                data-search="${esc((c.club + " " + c.stadium).toLowerCase())}">
              <button class="tick" type="button" aria-pressed="false"
                      aria-label="${esc(c.stadium)}, ${esc(c.club)}">
                <span class="tick-box" aria-hidden="true"></span>
                <span class="ground-text">
                  <span class="club">${esc(c.club)}${c.home ? ' <span class="home-flag">Home</span>' : ""}</span>
                  <span class="stadium">${esc(c.stadium)}</span>
                </span>
              </button>
            </li>`).join("")}
        </ul>
      </section>`).join("");
  }

  /* Paint every row and counter for whichever list is on screen. */
  function paint() {
    $$(".ground").forEach(li => {
      const on = isTicked(activeList, li.dataset.id);
      li.classList.toggle("ticked", on);
      $(".tick", li).setAttribute("aria-pressed", String(on));
    });

    $$(".league").forEach(section => {
      const rows = $$(".ground", section);
      const done = rows.filter(r => r.classList.contains("ticked")).length;
      $(".done", section).textContent = done;
      $(".league-bar span", section).style.width = (done / rows.length * 100) + "%";
      section.classList.toggle("complete", done === rows.length);
    });

    updateStats();
    applyFilter();
  }

  /* Stats.js animates the figure; if it somehow isn't loaded, still show it. */
  function setStat(el, value) {
    if (window.Stats) window.Stats.set(el, value);
    else if (el) { el.dataset.target = value; el.textContent = value; }
  }

  function updateStats() {
    const g = ticks.general.length;
    const b = ticks.blackpool.length;

    setStat($("#statGeneral"), g);
    setStat($("#statBlackpool"), b);

    $("#subGeneral").textContent = "of " + TOTAL;
    $("#subBlackpool").textContent = "of " + TOTAL;
    $("#barGeneral").style.setProperty("--fill", (g / TOTAL * 100) + "%");
    $("#barBlackpool").style.setProperty("--fill", (b / TOTAL * 100) + "%");

    $("#listHint").textContent = activeList === "general"
      ? `Ticking here counts every ground you've been to, whoever was playing. ${g} of ${TOTAL} so far.`
      : `Ticking here counts grounds you've been to watching Blackpool. ${b} of ${TOTAL} so far.`;
  }

  /* ---------- search / filter ---------- */
  function applyFilter() {
    const term = $("#search").value.trim().toLowerCase();
    const tickedOnly = $("#onlyTicked").checked;
    let visible = 0;

    $$(".ground").forEach(li => {
      const matches = (!term || li.dataset.search.includes(term)) &&
                      (!tickedOnly || li.classList.contains("ticked"));
      li.hidden = !matches;
      if (matches) visible++;
    });

    $$(".league").forEach(section => {
      section.hidden = $$(".ground", section).every(li => li.hidden);
    });

    $("#emptyMsg").hidden = visible > 0;
  }

  /* ---------- events ---------- */
  $("#leagues").addEventListener("click", e => {
    const btn = e.target.closest(".tick");
    if (!btn) return;
    const li = btn.closest(".ground");
    toggle(activeList, li.dataset.id);
    li.classList.add("just-ticked");
    setTimeout(() => li.classList.remove("just-ticked"), 420);
    paint();
  });

  $$(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      activeList = tab.dataset.list;
      $$(".tab").forEach(t => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
      });
      document.body.dataset.list = activeList;
      paint();
    });
  });

  $("#search").addEventListener("input", applyFilter);
  $("#onlyTicked").addEventListener("change", applyFilter);

  $("#resetBtn").addEventListener("click", () => {
    const label = activeList === "general" ? "grounds visited" : "grounds watching Blackpool";
    if (!confirm(`Clear every tick on the "${label}" list? The other list is left alone.`)) return;
    ticks[activeList] = [];
    save();
    paint();
  });

  /* ---------- go ---------- */
  document.body.dataset.list = activeList;
  buildLists();
  paint();
})();
