(function () {
  function getGalleryItems() {
    return Array.from(document.querySelectorAll(
      "#gallery img, .gallery-grid img, .gallery-item img, .gallery-card img"
    ));
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

  function attachLightbox() {
    const images = getGalleryItems();

    images.forEach(function (img) {
      if (img.dataset.iamLightboxReady === "true") return;

      img.dataset.iamLightboxReady = "true";
      img.style.cursor = "zoom-in";

      img.addEventListener("click", function () {
        openLightbox(img.currentSrc || img.src, img.alt);
      });
    });
  }

  function renderGalleryIfNeeded() {
    const container = document.getElementById("gallery");
    if (!container) return;

    const hasImages = container.querySelector("img");
    const data = window.galleryData || window.GALLERY_DATA || [];

    if (!hasImages && Array.isArray(data) && data.length) {
      container.innerHTML = data.map(function (item) {
        const src = item.image || item.src || "";
        const title = item.title || item.alt || "Création IA'm";
        const level = item.level || "";
        return `
          <article class="gallery-card">
            <img src="${src}" alt="${title}">
            <div class="gallery-card-caption">
              <strong>${title}</strong>
              ${level ? `<span>${level}</span>` : ""}
            </div>
          </article>
        `;
      }).join("");
    }
  }

  function initGallery() {
    renderGalleryIfNeeded();
    attachLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGallery);
  } else {
    initGallery();
  }

  window.addEventListener("load", initGallery);

  const observer = new MutationObserver(function () {
    attachLightbox();
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();