(function () {
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let dragging = false;
  let startX = 0;
  let startY = 0;

  function getData() {
    if (Array.isArray(window.galleryData)) return window.galleryData;
    if (Array.isArray(window.GALLERY_DATA)) return window.GALLERY_DATA;
    return [];
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[c]);
  }

  function renderGallery() {
    const container = document.getElementById("gallery") || document.querySelector("[data-iam-gallery]");
    if (!container) return;

    const data = getData();

    if (!data.length) {
      container.innerHTML = '<p class="gallery-empty">Aucune image configurée dans <code>gallery-data.js</code>.</p>';
      return;
    }

    container.innerHTML = data.map(function (item) {
      const src = item.image || item.src || "";
      const title = item.title || item.alt || "Création IA'm";
      const level = item.level || "";
      const note = item.note || "";
      return `
        <article class="gallery-card">
          <button class="gallery-zoom-trigger" type="button" aria-label="Agrandir ${escapeHtml(title)}">
            <img src="${src}" alt="${escapeHtml(title)}" loading="lazy" data-original-src="${src}">
          </button>
          <div class="gallery-card-caption">
            <strong>${escapeHtml(title)}</strong>
            ${level ? `<span>${escapeHtml(level)}</span>` : ""}
            ${note ? `<p>${escapeHtml(note)}</p>` : ""}
          </div>
        </article>
      `;
    }).join("");

    attachImageHandlers();
  }

  function createLightbox() {
    let lightbox = document.getElementById("iam-lightbox");
    if (lightbox) return lightbox;

    lightbox = document.createElement("div");
    lightbox.id = "iam-lightbox";
    lightbox.innerHTML = `
      <div class="iam-lightbox-ui">
        <button class="iam-lightbox-btn" type="button" data-action="zoom-out">−</button>
        <button class="iam-lightbox-btn" type="button" data-action="reset">100%</button>
        <button class="iam-lightbox-btn" type="button" data-action="zoom-in">+</button>
        <button class="iam-lightbox-close" type="button" aria-label="Fermer">×</button>
      </div>
      <div class="iam-lightbox-stage">
        <img class="iam-lightbox-img" alt="">
      </div>
    `;
    document.body.appendChild(lightbox);

    lightbox.addEventListener("click", function (event) {
      if (event.target.id === "iam-lightbox") closeLightbox();
    });

    lightbox.querySelector(".iam-lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelector('[data-action="zoom-in"]').addEventListener("click", function () {
      setZoom(zoom + 0.25);
    });
    lightbox.querySelector('[data-action="zoom-out"]').addEventListener("click", function () {
      setZoom(zoom - 0.25);
    });
    lightbox.querySelector('[data-action="reset"]').addEventListener("click", function () {
      zoom = 1;
      panX = 0;
      panY = 0;
      applyTransform();
    });

    const stage = lightbox.querySelector(".iam-lightbox-stage");
    const img = lightbox.querySelector(".iam-lightbox-img");

    stage.addEventListener("wheel", function (event) {
      event.preventDefault();
      setZoom(zoom + (event.deltaY < 0 ? 0.18 : -0.18));
    }, { passive: false });

    img.addEventListener("mousedown", function (event) {
      if (zoom <= 1) return;
      dragging = true;
      startX = event.clientX - panX;
      startY = event.clientY - panY;
      img.classList.add("is-dragging");
      event.preventDefault();
    });

    window.addEventListener("mousemove", function (event) {
      if (!dragging) return;
      panX = event.clientX - startX;
      panY = event.clientY - startY;
      applyTransform();
    });

    window.addEventListener("mouseup", function () {
      dragging = false;
      const current = document.querySelector(".iam-lightbox-img");
      if (current) current.classList.remove("is-dragging");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "+" || event.key === "=") setZoom(zoom + 0.25);
      if (event.key === "-") setZoom(zoom - 0.25);
      if (event.key === "0") {
        zoom = 1;
        panX = 0;
        panY = 0;
        applyTransform();
      }
    });

    return lightbox;
  }

  function setZoom(value) {
    zoom = Math.max(1, Math.min(4, value));
    if (zoom === 1) {
      panX = 0;
      panY = 0;
    }
    applyTransform();
  }

  function applyTransform() {
    const img = document.querySelector(".iam-lightbox-img");
    if (!img) return;
    img.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    img.style.cursor = zoom > 1 ? "grab" : "zoom-in";
  }

  function openLightbox(src, alt) {
    const lightbox = createLightbox();
    const img = lightbox.querySelector(".iam-lightbox-img");

    zoom = 1;
    panX = 0;
    panY = 0;

    img.src = src;
    img.alt = alt || "Image de la galerie IA'm";
    img.style.transform = "translate(0, 0) scale(1)";

    lightbox.classList.add("is-open");
    document.body.classList.add("iam-lightbox-open");
  }

  function closeLightbox() {
    const lightbox = document.getElementById("iam-lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("iam-lightbox-open");
  }

  function attachImageHandlers() {
    document.querySelectorAll(".gallery-zoom-trigger img, #gallery img, [data-iam-gallery] img").forEach(function (img) {
      if (img.dataset.iamReady === "true") return;
      img.dataset.iamReady = "true";

      const trigger = img.closest(".gallery-zoom-trigger") || img;

      trigger.addEventListener("click", function () {
        openLightbox(img.currentSrc || img.src, img.alt);
      });

      img.addEventListener("error", function () {
        const card = img.closest(".gallery-card");
        if (!card || card.querySelector(".gallery-error")) return;

        const rawSrc = img.dataset.originalSrc || img.getAttribute("src");
        const error = document.createElement("div");
        error.className = "gallery-error";
        error.innerHTML = `<strong>Image introuvable</strong><br><code>${escapeHtml(rawSrc)}</code>`;
        card.appendChild(error);
        img.style.display = "none";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderGallery);
  } else {
    renderGallery();
  }

  window.addEventListener("load", renderGallery);
})();
