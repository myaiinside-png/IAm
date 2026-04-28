(function () {
  function getData() {
    if (Array.isArray(window.galleryData)) return window.galleryData;
    if (Array.isArray(window.GALLERY_DATA)) return window.GALLERY_DATA;
    return [];
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" })[c]);
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
          <img src="${src}" alt="${escapeHtml(title)}" loading="lazy" data-original-src="${src}">
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

  function openLightbox(src, alt) {
    let lightbox = document.getElementById("iam-lightbox");
    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.id = "iam-lightbox";
      lightbox.innerHTML = '<button class="iam-lightbox-close" type="button">×</button><div class="iam-lightbox-stage"><img class="iam-lightbox-img" alt=""></div>';
      document.body.appendChild(lightbox);
      lightbox.addEventListener("click", e => { if (e.target.id === "iam-lightbox" || e.target.className === "iam-lightbox-close") closeLightbox(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
    }
    const img = lightbox.querySelector(".iam-lightbox-img");
    img.src = src;
    img.alt = alt || "Image IA'm";
    lightbox.classList.add("is-open");
    document.body.classList.add("iam-lightbox-open");
  }

  function closeLightbox() {
    const lightbox = document.getElementById("iam-lightbox");
    if (lightbox) lightbox.classList.remove("is-open");
    document.body.classList.remove("iam-lightbox-open");
  }

  function attachImageHandlers() {
    document.querySelectorAll("#gallery img, [data-iam-gallery] img, .gallery-grid img").forEach(img => {
      if (img.dataset.iamReady === "true") return;
      img.dataset.iamReady = "true";
      img.addEventListener("click", () => openLightbox(img.currentSrc || img.src, img.alt));
      img.addEventListener("error", () => {
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

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderGallery);
  else renderGallery();
  window.addEventListener("load", renderGallery);
})();
