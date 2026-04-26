(function () {
  const root = document.querySelector('[data-iam-gallery]');
  if (!root) return;

  const items = Array.isArray(window.IAM_GALLERY_ITEMS) ? window.IAM_GALLERY_ITEMS : [];

  if (!items.length) {
    root.innerHTML = '<p class="iam-gallery-empty">Aucune réalisation pour le moment.</p>';
    return;
  }

  root.innerHTML = items.map((item) => {
    const image = escapeHtml(item.image || '');
    const title = escapeHtml(item.title || 'Sans titre');
    const level = escapeHtml(item.level || 'IA’m');
    const description = escapeHtml(item.description || '');
    const link = escapeHtml(item.link || '');

    const card = `
      <article class="iam-gallery-card">
        <div class="iam-gallery-image-wrap">
          <img src="${image}" alt="${title}" loading="lazy">
          <span class="iam-gallery-level">IA’m · ${level}</span>
        </div>
        <div class="iam-gallery-content">
          <h3>${title}</h3>
          ${description ? `<p>${description}</p>` : ''}
        </div>
      </article>
    `;

    return link ? `<a class="iam-gallery-link" href="${link}">${card}</a>` : card;
  }).join('');

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();
