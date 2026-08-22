/* ===========================================================
   Stadium Checklist — the map
   Draws England and Wales with a pin per ground. Pins follow the
   list you're on: lit for ticked, faint for not. Hovering or
   focusing a pin names the club and its ground.
   =========================================================== */

(function () {
  "use strict";

  const svg = document.getElementById("groundMap");
  if (!svg || typeof MAP === "undefined") return;

  const NS = "http://www.w3.org/2000/svg";
  const RAD = Math.PI / 180;
  const merc = lat => Math.log(Math.tan(Math.PI / 4 + lat * RAD / 2));

  /* Same projection the outline was built with, so pins land in the right place */
  const px = lon => (lon * RAD - MAP.x0) / (MAP.x1 - MAP.x0) * MAP.width;
  const py = lat => MAP.height - (merc(lat) - MAP.y0) / (MAP.y1 - MAP.y0) * MAP.height;

  const el = (name, attrs) => {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  };

  svg.setAttribute("viewBox", `0 0 ${MAP.width} ${MAP.height}`);

  const land = el("path", { d: MAP.outline, class: "map-land" });
  svg.appendChild(land);

  const pinLayer = el("g", { class: "map-pins" });
  svg.appendChild(pinLayer);

  const pins = new Map();
  LEAGUES.forEach(league => {
    league.clubs.forEach(club => {
      const ll = GROUND_COORDS[club.id];
      if (!ll) return;                       // no coordinates, no pin
      const g = el("g", { class: "map-pin" + (club.home ? " is-home" : ""), tabindex: "0", role: "img" });
      g.setAttribute("transform", `translate(${px(ll[1]).toFixed(1)} ${py(ll[0]).toFixed(1)})`);
      g.appendChild(el("circle", { class: "pin-halo", r: 13 }));
      g.appendChild(el("circle", { class: "pin-dot",  r: 6 }));
      const label = el("title");
      label.textContent = `${club.club} — ${club.stadium} (${league.name})`;
      g.appendChild(label);
      g.dataset.id = club.id;
      pinLayer.appendChild(g);
      pins.set(club.id, g);
    });
  });

  /* Ticked pins are drawn last so they sit above the faint ones */
  function paintMap(tickedIds) {
    const set = new Set(tickedIds);
    const lit = [];
    pins.forEach((g, id) => {
      const on = set.has(id);
      g.classList.toggle("is-ticked", on);
      g.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) lit.push(g);
    });
    lit.forEach(g => pinLayer.appendChild(g));
    const count = document.getElementById("mapCount");
    if (count) count.textContent = lit.length;
  }

  window.StadiumMap = { paint: paintMap };
})();
