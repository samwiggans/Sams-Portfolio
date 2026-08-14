/* ===========================================================
   Sam's Top 5s — app logic
   Renders the lists, runs the editor, handles images.
   Anything you save in the editor is stored in this browser
   (localStorage). Use "Export data" to keep a backup file.
   =========================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "samsTop5s.v1";
  const SLOTS = 5;

  /* ---------- state ---------- */
  let data = load();
  let activeCatId = null;

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(normaliseCat);
      }
    } catch (err) {
      console.warn("Couldn't read saved lists, falling back to defaults.", err);
    }
    return clone(DEFAULT_DATA).map(normaliseCat);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (err) {
      alert("Couldn't save — browser storage is full. Try smaller images, or use Export data for a backup.");
      console.error(err);
      return false;
    }
  }

  function normaliseCat(cat) {
    const items = (cat.items || []).slice(0, SLOTS).map(it => ({
      title: it.title || "", meta: it.meta || "", tag: it.tag || "",
      note: it.note || "",   image: it.image || ""
    }));
    while (items.length < SLOTS) items.push({ title: "", meta: "", tag: "", note: "", image: "" });
    return {
      id: cat.id || slug(cat.name || "category"),
      name: cat.name || "Untitled",
      emoji: cat.emoji || "⭐",
      items
    };
  }

  function slug(str) {
    return String(str).toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "list";
  }

  function uniqueId(base, ignoreIndex) {
    let id = slug(base), n = 2;
    const taken = i => data.some((c, idx) => idx !== ignoreIndex && c.id === i);
    while (taken(id)) id = slug(base) + "-" + n++;
    return id;
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, ch =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  /* Filled items only — blank slots aren't rendered. */
  function filled(cat) { return cat.items.filter(it => it.title.trim()); }

  /* ---------- procedural poster for items without an image ---------- */
  const PALETTES = [
    ["#2b1055", "#7597de"], ["#42275a", "#734b6d"], ["#0f2027", "#2c5364"],
    ["#3a1c71", "#d76d77"], ["#134e5e", "#71b280"], ["#232526", "#f7971e"],
    ["#41295a", "#2f0743"], ["#870000", "#190a05"], ["#1f4037", "#99f2c8"],
    ["#16222a", "#3a6073"]
  ];
  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function initials(title) {
    return title.split(/\s+/).filter(Boolean).slice(0, 2)
      .map(w => w[0]).join("").toUpperCase();
  }
  function posterHTML(item) {
    const [a, b] = PALETTES[hash(item.title) % PALETTES.length];
    return `<div class="card-noimg" style="background:linear-gradient(150deg, ${a}, ${b})">
              ${esc(initials(item.title))}
            </div>`;
  }

  /* ---------- render ---------- */
  function render() {
    const root = $("#listRoot");
    const scroll = $("#catScroll");
    root.innerHTML = "";
    scroll.innerHTML = "";

    const live = data.filter(cat => filled(cat).length > 0);
    $("#emptyHint").hidden = live.length > 0;

    live.forEach(cat => {
      /* nav pill */
      const pill = document.createElement("a");
      pill.className = "cat-pill";
      pill.href = "#" + cat.id;
      pill.dataset.cat = cat.id;
      pill.innerHTML = `<span>${esc(cat.emoji)}</span> ${esc(cat.name)}`;
      scroll.appendChild(pill);

      /* section */
      const section = document.createElement("section");
      section.className = "cat-section";
      section.id = cat.id;
      section.innerHTML = `
        <div class="cat-head">
          <h2 class="cat-title"><span class="ico">${esc(cat.emoji)}</span> ${esc(cat.name)}</h2>
          <div class="cat-rule"></div>
        </div>
        <div class="top5">
          ${filled(cat).map((item, i) => cardHTML(item, i + 1)).join("")}
        </div>`;
      root.appendChild(section);
    });

    renderStats(live);
    observeReveal();
    observeSections();
    if (!activeCatId && live.length) setActive(live[0].id);
  }

  function cardHTML(item, rank) {
    const media = item.image
      ? `<div class="card-media"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy"></div>`
      : posterHTML(item);

    return `
      <article class="card card-${rank} reveal" data-img="${esc(item.image)}" data-title="${esc(item.title)}">
        ${media}
        <span class="rank rank-${rank}">${rank}</span>
        ${item.image ? `<span class="zoom-hint">⤢</span>` : ""}
        <div class="card-body">
          <h3 class="card-title">${esc(item.title)}</h3>
          ${(item.meta || item.tag) ? `<p class="card-meta">
              ${item.tag ? `<span class="tag">${esc(item.tag)}</span>` : ""}
              ${item.meta ? esc(item.meta) : ""}
            </p>` : ""}
          ${item.note ? `<p class="card-note">${esc(item.note)}</p>` : ""}
        </div>
      </article>`;
  }

  function renderStats(live) {
    const totalItems = live.reduce((n, c) => n + filled(c).length, 0);
    $("#heroStats").innerHTML = `
      <div class="stat"><b>${live.length}</b><span>Categories</span></div>
      <div class="stat"><b>${totalItems}</b><span>Ranked picks</span></div>`;
  }

  /* A dead image path (typo, moved file, hotlink that stopped working)
     falls back to the generated poster rather than an empty card. */
  $("#listRoot").addEventListener("error", e => {
    const img = e.target;
    if (img.tagName !== "IMG") return;
    const card = img.closest(".card");
    if (!card) return;
    card.dataset.img = "";
    $(".zoom-hint", card)?.remove();
    img.closest(".card-media").outerHTML = posterHTML({ title: card.dataset.title });
  }, true);

  /* ---------- scroll behaviour ---------- */
  let revealObserver, sectionObserver;

  function observeReveal() {
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    $$(".reveal").forEach((el, i) => {
      el.style.transitionDelay = (i % 5) * 60 + "ms";
      revealObserver.observe(el);
    });
  }

  function observeSections() {
    if (sectionObserver) sectionObserver.disconnect();
    sectionObserver = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .slice(0, 1)
        .forEach(e => setActive(e.target.id));
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$(".cat-section").forEach(s => sectionObserver.observe(s));
  }

  function setActive(id) {
    activeCatId = id;
    $$(".cat-pill").forEach(p => {
      const on = p.dataset.cat === id;
      p.classList.toggle("active", on);
      if (on) p.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    });
  }

  /* ---------- lightbox ---------- */
  function openLightbox(src, caption) {
    $("#lbImg").src = src;
    $("#lbImg").alt = caption;
    $("#lbCap").textContent = caption;
    $("#lightbox").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    $("#lightbox").hidden = true;
    $("#lbImg").src = "";
    document.body.style.overflow = "";
  }

  document.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (card && card.dataset.img) openLightbox(card.dataset.img, card.dataset.title);
  });
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (!$("#lightbox").hidden) closeLightbox();
    else if (!$("#drawer").hidden) closeDrawer();
  });

  /* ---------- editor ---------- */
  let editingIndex = 0;

  function openDrawer() {
    $("#drawer").hidden = false;
    $("#scrim").hidden = false;
    document.body.style.overflow = "hidden";
    buildCatSelect();
    const current = data.findIndex(c => c.id === activeCatId);
    editingIndex = current > -1 ? current : 0;
    if (!data.length) addCategory(); else fillForm(editingIndex);
  }

  function closeDrawer() {
    $("#drawer").hidden = true;
    $("#scrim").hidden = true;
    document.body.style.overflow = "";
    $("#saveNote").textContent = "";
  }

  function buildCatSelect() {
    const sel = $("#catSelect");
    sel.innerHTML = data.map((c, i) =>
      `<option value="${i}">${esc(c.emoji)} ${esc(c.name)}</option>`).join("");
    sel.value = String(editingIndex);
  }

  function fillForm(index) {
    editingIndex = index;
    const cat = data[index];
    if (!cat) return;
    $("#catSelect").value = String(index);
    $("#catName").value  = cat.name;
    $("#catEmoji").value = cat.emoji;

    $("#slots").innerHTML = cat.items.map((item, i) => `
      <div class="slot" data-slot="${i}">
        <div class="slot-head"><span class="slot-num">${i + 1}</span><b>Number ${i + 1}</b></div>
        <div class="field"><input type="text" data-f="title" placeholder="Title" value="${esc(item.title)}"></div>
        <div class="field row">
          <input type="text" data-f="meta" placeholder="Year / platform / director" value="${esc(item.meta)}">
          <input type="text" data-f="tag"  placeholder="Tag" value="${esc(item.tag)}" style="flex:0 0 110px">
        </div>
        <div class="field"><textarea data-f="note" placeholder="Why it made the list (optional)">${esc(item.note)}</textarea></div>
        <div class="field img-row">
          ${item.image
            ? `<img class="thumb" src="${esc(item.image)}" alt="">`
            : `<div class="thumb empty">no<br>image</div>`}
          <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
            <input type="text" data-f="image" placeholder="images/file.jpg or https://…" value="${esc(item.image)}">
            <div class="row">
              <button class="btn btn-small file-btn" type="button">Upload image<input type="file" accept="image/*" data-upload="${i}"></button>
              <button class="btn btn-small" type="button" data-clear="${i}">Clear</button>
            </div>
          </div>
        </div>
      </div>`).join("");
  }

  /* Read the form back into the data array. */
  function readForm() {
    const cat = data[editingIndex];
    if (!cat) return;
    cat.name  = $("#catName").value.trim() || "Untitled";
    cat.emoji = $("#catEmoji").value.trim() || "⭐";
    cat.id    = uniqueId(cat.name, editingIndex);

    $$(".slot").forEach(slotEl => {
      const i = Number(slotEl.dataset.slot);
      const item = cat.items[i];
      $$("[data-f]", slotEl).forEach(input => { item[input.dataset.f] = input.value.trim(); });
    });
  }

  function addCategory() {
    data.push(normaliseCat({ name: "New category", emoji: "⭐", id: uniqueId("new-category") }));
    editingIndex = data.length - 1;
    buildCatSelect();
    fillForm(editingIndex);
    $("#catName").focus();
    $("#catName").select();
  }

  /* Shrink uploads so localStorage doesn't fill up. */
  function shrinkImage(file, maxSide = 900) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
          const canvas = Object.assign(document.createElement("canvas"), { width: w, height: h });
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------- editor events ---------- */
  $("#editToggle").addEventListener("click", () => {
    $("#drawer").hidden ? openDrawer() : closeDrawer();
  });
  $("#drawerClose").addEventListener("click", closeDrawer);
  $("#scrim").addEventListener("click", closeDrawer);

  $("#catSelect").addEventListener("change", e => {
    readForm();
    fillForm(Number(e.target.value));
  });

  $("#addCatBtn").addEventListener("click", () => { readForm(); addCategory(); });

  $("#deleteCatBtn").addEventListener("click", () => {
    const cat = data[editingIndex];
    if (!cat) return;
    if (!confirm(`Delete "${cat.name}" and all 5 picks? This can't be undone.`)) return;
    data.splice(editingIndex, 1);
    editingIndex = Math.max(0, editingIndex - 1);
    save();
    buildCatSelect();
    if (data.length) fillForm(editingIndex); else addCategory();
    render();
  });

  $("#saveBtn").addEventListener("click", () => {
    readForm();
    if (save()) {
      $("#saveNote").textContent = "Saved ✓";
      setTimeout(() => { $("#saveNote").textContent = ""; }, 2200);
    }
    buildCatSelect();
    render();
  });

  /* upload / clear / live thumbnail, delegated inside the drawer */
  $("#slots").addEventListener("change", async e => {
    const fileInput = e.target.closest("[data-upload]");
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
    const slotEl = fileInput.closest(".slot");
    try {
      const dataUrl = await shrinkImage(fileInput.files[0]);
      $("[data-f='image']", slotEl).value = dataUrl;
      updateThumb(slotEl, dataUrl);
    } catch (err) {
      alert("Couldn't read that image file.");
      console.error(err);
    }
    fileInput.value = "";
  });

  $("#slots").addEventListener("click", e => {
    const clearBtn = e.target.closest("[data-clear]");
    if (!clearBtn) return;
    const slotEl = clearBtn.closest(".slot");
    $("[data-f='image']", slotEl).value = "";
    updateThumb(slotEl, "");
  });

  $("#slots").addEventListener("input", e => {
    if (e.target.dataset.f === "image") updateThumb(e.target.closest(".slot"), e.target.value.trim());
  });

  function updateThumb(slotEl, src) {
    const old = $(".thumb", slotEl);
    const next = document.createElement(src ? "img" : "div");
    next.className = src ? "thumb" : "thumb empty";
    if (src) { next.src = src; next.alt = ""; } else { next.innerHTML = "no<br>image"; }
    old.replaceWith(next);
  }

  /* ---------- header / footer actions ---------- */
  $("#shuffleBtn").addEventListener("click", () => {
    const live = data.filter(c => filled(c).length);
    if (!live.length) return;
    const pick = live[Math.floor(Math.random() * live.length)];
    document.getElementById(pick.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: "sams-top-5s.json"
    });
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $("#importBtn").addEventListener("click", () => $("#importFile").click());
  $("#importFile").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) throw new Error("Not a list file");
        data = parsed.map(normaliseCat);
        save();
        activeCatId = null;
        render();
        alert("Lists imported.");
      } catch (err) {
        alert("That file didn't look like a Sam's Top 5s export.");
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  });

  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("Throw away your saved lists and go back to the starter ones?")) return;
    localStorage.removeItem(STORAGE_KEY);
    data = clone(DEFAULT_DATA).map(normaliseCat);
    activeCatId = null;
    render();
  });

  /* ---------- go ---------- */
  render();
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) setTimeout(() => target.scrollIntoView(), 60);
  }
})();
