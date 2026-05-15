# Mode d'emploi — Ajouter du contenu au site IA'm

Ce guide t'explique comment ajouter des cas d'usages, des réalisations, des textes ou des planches de BD **sans avoir à toucher au CSS** ni à demander de l'aide pour les opérations courantes.

Principe général : tu modifies un fichier HTML, tu uploades sur GitHub via l'interface web, Vercel redéploie automatiquement en moins de deux minutes, et c'est en ligne.

---

## Comment modifier un fichier HTML sur GitHub

1. Va sur ton repo `IAm`
2. Clique sur le fichier à modifier (ex. `index.html`)
3. Clique sur l'**icône crayon** en haut à droite (« Edit this file »)
4. Modifie le code
5. Descends en bas de la page, écris un message de commit (ex. « Ajout réalisation X »)
6. Clique sur **« Commit changes »**
7. Attends environ deux minutes que Vercel redéploie
8. Vérifie en navigation privée (`Ctrl+Maj+N`)

---

## 1. Ajouter une nouvelle réalisation

**Fichier à modifier** : `index.html`

**Étape 1 — Préparer l'image**

Uploade l'image PNG de la réalisation dans `assets/img/realisations/` sur GitHub. Choisis un nom simple sans espaces, en minuscules, avec des tirets : par exemple `mon-oeuvre-nom.png`.

**Étape 2 — Ajouter le bloc dans index.html**

Cherche dans le fichier la section qui commence par `<section class="section" id="realisations">`. Tu y verras les deux réalisations existantes sous forme de blocs `<a class="realisation">…</a>`. Duplique l'un de ces blocs et modifie les quatre éléments :

```html
<a class="realisation" href="LIEN_VERS_L_OEUVRE" target="_blank" rel="noopener">
  <div class="realisation-img">
    <img src="assets/img/realisations/NOM_DU_FICHIER.png" alt="TITRE DE L'OEUVRE">
  </div>
  <div class="realisation-body">
    <span class="realisation-level">IA'm · NIVEAU</span>
    <h3>TITRE DE L'OEUVRE</h3>
    <span class="realisation-author">NOM DE L'AUTEUR</span>
    <span class="realisation-link">Voir l'œuvre</span>
  </div>
</a>
```

Remplace `NIVEAU` par `Assisté`, `Initié` ou `Généré` selon le cas.

**Important** : la mise en page utilise une grille de 3 colonnes. Si tu as 1 ou 2 réalisations, le placeholder « Votre œuvre ici ? » remplit la troisième case. Quand tu auras 3, 6, 9 réalisations, supprime le placeholder. Quand tu en auras 4, 5, 7, 8… garde-le pour combler.

---

## 2. Ajouter un nouveau cas d'usage

**Fichier à modifier** : `index.html`

**Étape 1 — Préparer l'image**

Uploade l'image dans `assets/img/galerie/` avec un nom simple (ex. `developpeur.png`).

**Étape 2 — Ajouter le bloc dans index.html**

Cherche la section `<section class="section" id="cases">`. Duplique un bloc `<article class="case">…</article>` et modifie :

```html
<article class="case" data-img="assets/img/galerie/NOM_FICHIER.png" data-caption="LIBELLÉ">
  <div class="case-img-wrap"><img src="assets/img/galerie/NOM_FICHIER.png" alt="Cas d'usage LIBELLÉ"></div>
  <div class="cap">LIBELLÉ</div>
</article>
```

**Attention** : remplace `NOM_FICHIER.png` aux deux endroits, et `LIBELLÉ` aux trois endroits.

**À noter** : la grille est par défaut sur 4 colonnes. Si tu mets 5 cas, tu auras 4 + 1 sur la ligne du dessous. Si tu en veux plus, c'est joli en 8 (deux lignes pleines) ou en 4.

---

## 3. Ajouter un texte (article)

**Fichiers concernés** : tu crées un nouveau fichier HTML + tu modifies `textes.html`

**Étape 1 — Créer le fichier de l'article**

1. Sur ton ordinateur, ouvre `_gabarit-article.html` (que je t'avais fourni)
2. Sauvegarde-le sous un nouveau nom, par exemple `transparence-et-attribution.html`
3. Modifie dans ce fichier :
   - Le `<title>` dans le `<head>`
   - La `<meta name="description">` pour le partage social
   - L'eyebrow (« Texte · 15 mai 2026 ») avec la bonne date
   - Le `<h1>` avec le titre
   - Le `<p>` du chapô
   - Tout le contenu de `<article class="article">` avec ton texte

**Balises disponibles dans le corps de l'article** :
- `<p>` pour les paragraphes
- `<h2>` pour les sous-titres principaux
- `<h3>` pour les sous-titres secondaires
- `<blockquote>` pour les citations en exergue
- `<a href="...">` pour les liens, ils seront automatiquement en or
- `<em>` pour l'italique, `<strong>` pour le gras

**Étape 2 — Uploader le fichier sur GitHub**

À la racine du repo, **« Add file → Upload files »**, glisse ton fichier. Commit.

**Étape 3 — L'ajouter à la liste dans textes.html**

Ouvre `textes.html` sur GitHub, clique sur le crayon. Si c'est ton premier article, tu dois passer du mode placeholder au mode liste :

1. **Supprime** tout le bloc `<div class="placeholder">…</div>` (du début à la fin)
2. **Décommente** la section `<div class="article-list">` — tu trouveras les instructions dans le fichier

Si tu as déjà la liste d'articles active, duplique simplement un bloc `<a class="article-card">` :

```html
<a class="article-card" href="NOM_DU_FICHIER_ARTICLE.html">
  <div class="date">15 mai 2026</div>
  <h3>TITRE DE L'ARTICLE</h3>
  <p>Court résumé qui donne envie de lire la suite.</p>
</a>
```

Commit, attends, vérifie.

---

## 4. Ajouter une planche de BD

**Fichier à modifier** : `bd.html`

Pour l'instant `bd.html` est en mode « placeholder ». Quand tu auras tes premières planches, dis-le moi et on transformera cette page en galerie de BD (un peu comme la galerie de cas d'usages mais en plus grand format). Le code n'existe pas encore — c'est un petit chantier à part.

En attendant, si tu veux juste publier une première planche de manière simple, tu peux :

1. Uploader l'image dans `assets/img/bd/` (créer ce dossier au passage)
2. Remplacer le `<div class="placeholder">` de `bd.html` par :

```html
<div style="text-align: center; padding: 2rem 0;">
  <img src="assets/img/bd/ma-planche.png" alt="Titre de la planche" style="max-width: 100%; border-radius: 12px;">
  <p style="margin-top: 1rem; color: var(--muted); font-style: italic; font-family: 'Cormorant Garamond', serif;">Titre de la planche</p>
</div>
```

---

## 5. Modifier des textes existants (titres, descriptions, etc.)

**N'importe quel texte sur le site** est modifiable en éditant directement le HTML du fichier concerné :

- Textes de l'accueil → `index.html`
- Questions et réponses de la FAQ → `faq.html`
- Description des pages Textes ou BD → `textes.html` / `bd.html`

Tu cherches le texte que tu veux changer (utilise `Ctrl+F` dans GitHub pour le trouver), tu le remplaces, tu commit. C'est tout.

---

## 6. Modifier les couleurs ou la typographie globalement

**Fichier à modifier** : `assets/styles.css`

Tout en haut du fichier, tu trouveras le bloc `:root` avec toutes les couleurs et mesures du site :

```css
:root {
  --bg: #f6f1e7;          /* couleur de fond */
  --panel: #fdfaf3;       /* fond des cartes */
  --text: #1a1d2e;        /* couleur du texte */
  --gold: #a67821;        /* couleur d'accent (or) */
  ...
}
```

Modifie une valeur, commit, et le changement s'applique à **toutes les pages**. C'est la magie du CSS partagé.

---

## 7. Ajouter ou retirer une entrée dans la FAQ

**Fichier à modifier** : `faq.html`

Duplique un bloc `<details class="faq-item">` et modifie le texte. C'est de l'accordéon natif, tu n'as rien à coder.

---

## Bonnes pratiques

**Toujours tester en navigation privée** après chaque modification : `Ctrl+Maj+N` pour ouvrir une fenêtre privée, va sur `iam-inside.eu`, et tu verras la dernière version sans cache.

**Si quelque chose casse**, GitHub garde l'historique. Tu peux toujours revenir à une version antérieure :
1. Sur le fichier concerné, clique sur **« History »** en haut à droite
2. Trouve la version qui marchait
3. Clique dessus, puis sur les trois points → **« Revert »** ou copie le code et remplace

**Pour les images** : essaie d'uploader des fichiers en bonne résolution (au moins 1200×1200 pour les cas d'usages et réalisations) pour qu'ils restent nets dans la lightbox.

**Pour les noms de fichiers** : pas d'espaces, pas d'accents, pas de majuscules, juste des minuscules et des tirets. Exemple bon : `mon-article.html`. Exemple à éviter : `Mon Article.html`.

---

## Si vraiment quelque chose te dépasse

Tu peux toujours me revenir avec une question précise. Mais pour 90% des cas courants (ajouter un article, une réalisation, un cas d'usage, modifier un texte, changer une couleur), tu n'as plus besoin de moi. Le système est désormais construit pour ça.

Bonne route avec IA'm.
