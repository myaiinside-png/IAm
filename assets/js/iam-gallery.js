(function () {
  function getData() {
    if (Array.isArray(window.galleryData)) return window.galleryData;
    if (Array.isArray(window.GALLERY_DATA)) return window.GALLERY_DATA;
    try {
      if (typeof galleryData !== "undefined" && Array.isArray(galleryData)) return galleryData;
    } catch (e) {}
    return [];
  }

  function createLightbox() {
    let lightbox = document.getElementById("iam-lightbox");
    if (lightbox) return lightbox;

    lightbox = document.createElement("div");
    lightbox.id = "iam-lightbox";
    lightbox.innerHTML = `
      <button class="iam-lightbox-close" type="button" aria-label="Fermer">×</button>
      <img class="iam-lightbox-img" alt="">
    `;
    document.body.appendChild(lightbox);

    lightbox.addEventListener("click", function (event) {
      if (
        event.target.id === "iam-lightbox" ||
        event.target.classList.contains("iam-lightbox-close")
      ) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeLightbox();
    });

    return lightbox;
  }

  function openLightbox(src, alt) {
    const lightbox = createLightbox();
    const img = lightbox.querySelector(".iam-lightbox-img");
    img.src = src;
    img.alt = alt || "Image de la galerie IA'm";
    lightbox.classList.add("is-open");
    document.body.classList.add("iam-lightbox-open");
  }

  function closeLightbox() {
    const lightbox = document.getElementById("iam-lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("iam-lightbox-open");
  }

  function renderGallery() {
    const container = document.getElementById("gallery") || document.querySelector("[data-iam-gallery]");
    if (!container) return;

    const data = getData();

    if (!data.length) {
      container.innerHTML = `<p style="color:rgba(244,239,228,.65);">Aucune image de galerie n’est encore configurée.</p>`;
      return;
    }

    container.innerHTML = data.map(function (item) {
      const src = item.image || item.src || "";
      const title = item.title || item.alt || "Création IA'm";
      const level = item.level || "";
      return `
        <article class="gallery-card">
          <img src="${src}" alt="${title}" loading="lazy">
          <div class="gallery-card-caption">
            <strong>${title}</strong>
            ${level ? `<span>${level}</span>` : ""}
          </div>
        </article>
      `;
    }).join("");

    attachLightbox();
  }

  function attachLightbox() {
    const images = Array.from(document.querySelectorAll("#gallery img, [data-iam-gallery] img, .gallery-grid img, .gallery-card img"));

    images.forEach(function (img) {
      if (img.dataset.iamLightboxReady === "true") return;
      img.dataset.iamLightboxReady = "true";
      img.style.cursor = "zoom-in";

      img.addEventListener("click", function () {
        openLightbox(img.currentSrc || img.src, img.alt);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderGallery);
  } else {
    renderGallery();
  }

  window.addEventListener("load", function () {
    renderGallery();
    attachLightbox();
  });
})();
