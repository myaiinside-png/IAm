/* ============================================================
   IA'm — galerie.js
   Galerie auto-alimentée pour cas-usages.html / realisations.html
   Usage dans la page :
     <div id="iam-galerie" data-source="cas-usages"></div>
     <script src="/assets/galerie.js" defer></script>
   data-source = nom du fichier dans /data/ (sans .json)
   ============================================================ */
(function () {
  "use strict";

  // ---- Styles (injectés une seule fois, préfixe iamg- pour ne rien casser) ----
  var CSS = `
  .iamg-grid{
    --iamg-ivory:#f6f1e7; --iamg-ink:#1a1d2e; --iamg-gold:#a67821;
    display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
    gap:1.75rem; margin:2rem 0; padding:0; list-style:none;
  }
  .iamg-card{
    background:#fff; border:1px solid rgba(26,29,46,.08);
    border-radius:4px; overflow:hidden; display:flex; flex-direction:column;
    transition:transform .35s ease, box-shadow .35s ease; cursor:pointer;
    opacity:0; transform:translateY(14px); animation:iamg-in .6s ease forwards;
  }
  @keyframes iamg-in{to{opacity:1;transform:none}}
  .iamg-card:hover{ transform:translateY(-4px); box-shadow:0 18px 40px -22px rgba(26,29,46,.45); }
  .iamg-thumb{ position:relative; aspect-ratio:4/3; overflow:hidden; background:var(--iamg-ivory); }
  .iamg-thumb img{ width:100%; height:100%; object-fit:cover; display:block; transition:transform .6s ease; }
  .iamg-card:hover .iamg-thumb img{ transform:scale(1.04); }
  .iamg-badge{
    position:absolute; top:.7rem; left:.7rem; z-index:2;
    font-family:'DM Mono',ui-monospace,monospace; font-size:.62rem; letter-spacing:.12em;
    text-transform:uppercase; padding:.3rem .55rem; border-radius:2px;
    background:rgba(26,29,46,.92); color:var(--iamg-ivory);
    border:1px solid var(--iamg-gold);
  }
  .iamg-body{ padding:1.1rem 1.2rem 1.3rem; }
  .iamg-title{
    font-family:'Cormorant Garamond',Georgia,serif; font-size:1.45rem; line-height:1.15;
    color:var(--iamg-ink); margin:0 0 .35rem;
  }
  .iamg-meta{
    font-family:'DM Mono',ui-monospace,monospace; font-size:.68rem; letter-spacing:.08em;
    color:var(--iamg-gold); margin:0 0 .55rem; text-transform:uppercase;
  }
  .iamg-desc{
    font-family:'DM Sans',system-ui,sans-serif; font-size:.92rem; line-height:1.5;
    color:rgba(26,29,46,.78); margin:0;
  }
  .iamg-empty, .iamg-error{
    font-family:'DM Sans',system-ui,sans-serif; color:rgba(26,29,46,.6);
    padding:2.5rem 1rem; text-align:center; border:1px dashed rgba(26,29,46,.2); border-radius:4px;
  }
  /* Lightbox */
  .iamg-lb{
    position:fixed; inset:0; z-index:9999; display:none; align-items:center; justify-content:center;
    background:rgba(16,18,28,.92); padding:2rem; opacity:0; transition:opacity .25s ease;
  }
  .iamg-lb.open{ display:flex; opacity:1; }
  .iamg-lb figure{ margin:0; max-width:min(1100px,92vw); max-height:90vh; text-align:center; }
  .iamg-lb img{ max-width:100%; max-height:78vh; border-radius:3px; box-shadow:0 30px 80px -30px #000; }
  .iamg-lb figcaption{
    font-family:'DM Sans',system-ui,sans-serif; color:#f6f1e7; margin-top:1rem; font-size:.95rem;
  }
  .iamg-lb figcaption strong{ font-family:'Cormorant Garamond',Georgia,serif; font-size:1.4rem; display:block; }
  .iamg-close{
    position:fixed; top:1.2rem; right:1.4rem; background:none; border:none; cursor:pointer;
    color:#f6f1e7; font-size:2.2rem; line-height:1; padding:.2rem .5rem;
  }
  @media (max-width:520px){ .iamg-grid{ gap:1.1rem; } }
  `;

  function injectStyles() {
    if (document.getElementById("iamg-styles")) return;
    var s = document.createElement("style");
    s.id = "iamg-styles";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ---- Lightbox (créée une fois) ----
  var lb;
  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement("div");
    lb.className = "iamg-lb";
    lb.innerHTML =
      '<button class="iamg-close" aria-label="Fermer">&times;</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(lb);
    function close() { lb.classList.remove("open"); }
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("iamg-close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    return lb;
  }
  function openLightbox(src, title, caption) {
    var box = ensureLightbox();
    box.querySelector("img").src = src;
    box.querySelector("img").alt = title || "";
    box.querySelector("figcaption").innerHTML =
      (title ? "<strong>" + esc(title) + "</strong>" : "") + (caption ? esc(caption) : "");
    box.classList.add("open");
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---- Rendu d'une carte ----
  function card(item) {
    var el = document.createElement("article");
    el.className = "iamg-card";

    var metaParts = [];
    if (item.auteur) metaParts.push(item.auteur);
    if (item.annee) metaParts.push(item.annee);
    var metaLine = metaParts.join(" · ");

    el.innerHTML =
      '<div class="iamg-thumb">' +
        (item.niveau ? '<span class="iamg-badge">' + esc(item.niveau) + "</span>" : "") +
        '<img loading="lazy" src="' + esc(item.image) + '" alt="' + esc(item.titre || "") + '">' +
      "</div>" +
      '<div class="iamg-body">' +
        (item.titre ? '<h3 class="iamg-title">' + esc(item.titre) + "</h3>" : "") +
        (metaLine ? '<p class="iamg-meta">' + esc(metaLine) + "</p>" : "") +
        (item.description ? '<p class="iamg-desc">' + esc(item.description) + "</p>" : "") +
      "</div>";

    el.addEventListener("click", function () {
      openLightbox(item.image, item.titre, item.description);
    });
    return el;
  }

  // ---- Init ----
  function init() {
    var mount = document.getElementById("iam-galerie");
    if (!mount) return;
    injectStyles();

    var source = mount.getAttribute("data-source") || "cas-usages";
    var path = mount.getAttribute("data-path") || "/data/" + source + ".json";

    fetch(path, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (items) {
        mount.innerHTML = "";
        if (!Array.isArray(items) || items.length === 0) {
          var em = document.createElement("p");
          em.className = "iamg-empty";
          em.textContent = "Aucun visuel pour le moment.";
          mount.appendChild(em);
          return;
        }
        var grid = document.createElement("div");
        grid.className = "iamg-grid";
        items.forEach(function (it, i) {
          var c = card(it);
          c.style.animationDelay = Math.min(i * 60, 600) + "ms";
          grid.appendChild(c);
        });
        mount.appendChild(grid);
      })
      .catch(function () {
        mount.innerHTML =
          '<p class="iamg-error">Galerie momentanément indisponible. Vérifie que le fichier ' +
          esc(path) + " existe.</p>";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
