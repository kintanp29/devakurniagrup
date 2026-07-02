/* ============================================================
   DEVA KURNIA GROUP — script.js
   Loads data.json, renders armada cards, wires WhatsApp links.
   ============================================================ */

(function () {
  "use strict";

  var STATE = {
    whatsapp: "6285867626822", // fallback, overwritten by data.json
    armada: []
  };

  /* ---------- ICONS (inline SVG, one per equipment type) ---------- */
  var ICONS = {
    excavator:
      '<svg viewBox="0 0 64 64"><path d="M4 50h40" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="8" y="42" width="16" height="8" rx="1.5" fill="currentColor"/><circle cx="12" cy="52" r="3.4" fill="currentColor"/><circle cx="20" cy="52" r="3.4" fill="currentColor"/><path d="M16 42V28" stroke="currentColor" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M16 28l16-6" stroke="currentColor" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M32 22l10 12" stroke="currentColor" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M42 34l6 8-10 3-3-7z" fill="currentColor"/></svg>',
    bulldozer:
      '<svg viewBox="0 0 64 64"><rect x="6" y="46" width="34" height="4" rx="2" fill="currentColor"/><circle cx="14" cy="48" r="7" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="32" cy="48" r="7" fill="none" stroke="currentColor" stroke-width="3"/><rect x="16" y="26" width="20" height="14" rx="2" fill="currentColor"/><rect x="20" y="16" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M40 30l10-2v18l-10-3z" fill="currentColor"/><rect x="48" y="24" width="4" height="20" fill="currentColor"/></svg>',
    forklift:
      '<svg viewBox="0 0 64 64"><rect x="6" y="10" width="4" height="40" fill="currentColor"/><rect x="10" y="20" width="18" height="4" fill="currentColor"/><rect x="10" y="30" width="18" height="4" fill="currentColor"/><rect x="26" y="16" width="16" height="18" rx="2" fill="currentColor"/><path d="M42 20h8v18h-8z" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="18" cy="50" r="5" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="44" cy="50" r="5" fill="none" stroke="currentColor" stroke-width="3"/><rect x="26" y="34" width="24" height="4" fill="currentColor"/></svg>',
    roller:
      '<svg viewBox="0 0 64 64"><circle cx="16" cy="42" r="12" fill="currentColor"/><rect x="24" y="30" width="10" height="10" fill="currentColor"/><rect x="30" y="18" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="48" cy="46" r="7" fill="none" stroke="currentColor" stroke-width="3"/><path d="M34 34h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    vibro:
      '<svg viewBox="0 0 64 64"><circle cx="18" cy="42" r="13" fill="currentColor"/><path d="M18 32v20M11 42h14" stroke="#0b0f19" stroke-width="2"/><rect x="30" y="20" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="46" cy="46" r="7" fill="none" stroke="currentColor" stroke-width="3"/><path d="M31 30h17" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    trailer:
      '<svg viewBox="0 0 64 64"><rect x="6" y="26" width="34" height="12" rx="1.5" fill="currentColor"/><path d="M40 30h10l6 8v6H40z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="16" cy="42" r="5" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="30" cy="42" r="5" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="52" cy="42" r="5" fill="none" stroke="currentColor" stroke-width="3"/><path d="M2 30h4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>'
  };

  /* ---------- WhatsApp helpers ---------- */
  function waUrl(message) {
    var text = encodeURIComponent(message || "Halo Deva Kurnia Group, saya ingin bertanya tentang sewa alat berat.");
    return "https://wa.me/" + STATE.whatsapp + "?text=" + text;
  }

  function wireWaLinks(root) {
    var links = (root || document).querySelectorAll(".js-wa-link");
    links.forEach(function (el) {
      el.setAttribute("href", waUrl(el.getAttribute("data-wa-message")));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ---------- Render armada cards from JSON ---------- */
  function renderArmada() {
    var grid = document.getElementById("armadaGrid");
    if (!grid) return;
    grid.innerHTML = "";

    STATE.armada.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "armada-card";

      var msg = "Halo Deva Kurnia Group, saya ingin tanya sewa " + item.nama + " (" + item.kelas + ").";

      var imgFile = {
        excavator: 'excavator.png',
        bulldozer: 'bulldozer .png',
        forklift: 'forklift.png',
        roller: 'wales.png',
        vibro: 'vibro.png',
        trailer: 'selfloader.png'
      }[item.icon];

      card.innerHTML =
        '<div class="armada-thumb">' +
          (imgFile ? '<img src="IMG/' + imgFile + '" alt="' + escapeHtml(item.nama) + '" />' : (ICONS[item.icon] || ICONS.excavator)) +
          '<span class="kelas-tag">' + escapeHtml(item.kelas) + '</span>' +
        '</div>' +
        '<div class="armada-body">' +
          '<h3>' + escapeHtml(item.nama) + '</h3>' +
          '<p>' + escapeHtml(item.deskripsi) + '</p>' +
          '<a href="#" class="armada-link js-wa-link" data-wa-message="' + escapeHtml(msg) + '">' +
            'Tanya Ketersediaan' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg>' +
          '</a>' +
        '</div>';

      grid.appendChild(card);
    });

    wireWaLinks(grid);
  }

  /* ---------- Hero decorative photo-grid tiles ---------- */
  function renderHeroGrid() {
    var wrap = document.getElementById("heroGrid");
    if (!wrap) return;
    var tileIcons = ["excavator", "roller", "bulldozer", "trailer", "forklift", "vibro"];
    var html = "";
    for (var i = 0; i < 24; i++) {
      var icon = tileIcons[i % tileIcons.length];
      html += '<div class="tile">' + (ICONS[icon] || "") + '</div>';
    }
    wrap.innerHTML = html;
  }

  /* ---------- Contact form -> WhatsApp ---------- */
  function wireForm() {
    var form = document.getElementById("waForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = form.nama.value.trim();
      var hp = form.hp.value.trim();
      var kebutuhan = form.kebutuhan.value.trim();

      var message =
        "Halo Deva Kurnia Group, saya ingin bertanya tentang sewa alat berat.\n\n" +
        "Nama/Perusahaan: " + nama + "\n" +
        "No. HP/WA: " + hp + "\n" +
        "Kebutuhan: " + kebutuhan;

      window.open(waUrl(message), "_blank", "noopener,noreferrer");
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  function wireNavToggle() {
    var btn = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  function wireHeaderScroll() {
    var header = document.getElementById("header");
    if (!header) return;
    window.addEventListener("scroll", function () {
      header.style.boxShadow = window.scrollY > 8 ? "0 6px 20px rgba(0,0,0,.35)" : "none";
    });
  }

  /* ---------- Footer year ---------- */
  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Reveal-on-scroll for cards/sections ---------- */
  function wireReveal() {
    var targets = document.querySelectorAll(".armada-card, .section-title, .info-item");
    if (!("IntersectionObserver" in window)) return;
    targets.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- Boot ---------- */
  function init(data) {
    if (data && data.company && data.company.whatsapp) {
      STATE.whatsapp = data.company.whatsapp;
    }
    STATE.armada = (data && data.armada) || [];

    renderHeroGrid();
    renderArmada();
    wireWaLinks(document);
    wireForm();
    wireNavToggle();
    wireHeaderScroll();
    setYear();
    wireReveal();
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("data.json")
      .then(function (res) { return res.json(); })
      .then(init)
      .catch(function () {
        // Fallback if data.json can't be fetched (e.g. opened via file://)
        init({
          company: { whatsapp: "6285867626822" },
          armada: [
            { id: "excavator", nama: "Excavator", kelas: "Kelas 5 & 7 Ton", deskripsi: "Excavator mini dan menengah untuk galian dan perataan tanah.", icon: "excavator" },
            { id: "bulldozer", nama: "Bulldozer", kelas: "D21 & D31", deskripsi: "Bulldozer bertenaga tinggi untuk pembukaan lahan.", icon: "bulldozer" },
            { id: "forklift", nama: "Forklift", kelas: "3 Ton", deskripsi: "Forklift untuk bongkar muat material proyek.", icon: "forklift" },
            { id: "wales", nama: "Wales / Road Roller", kelas: "6-8 Ton", deskripsi: "Wales pemadat untuk pekerjaan jalan.", icon: "roller" },
            { id: "vibro", nama: "Vibro Roller", kelas: "Single Drum", deskripsi: "Vibro roller untuk pemadatan tanah dan aspal.", icon: "vibro" },
            { id: "selfloader", nama: "Self Loader", kelas: "Layanan Pengiriman", deskripsi: "Layanan pengiriman alat berat ke lokasi proyek.", icon: "trailer" }
          ]
        });
      });
  });
})();