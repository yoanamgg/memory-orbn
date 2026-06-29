# Chez Saïd — Restaurant Marocain Kebab

Site vitrine statique (HTML/CSS/JS, sans dépendance de build) pour le restaurant **Chez Saïd**.

## Structure

- `index.html` — toutes les sections du site (accueil, à propos, services, menu, galerie, avis, infos pratiques, contact)
- `css/style.css` — design (thème marocain : terracotta, doré, vert zellige)
- `js/main.js` — menu mobile, onglets de la carte, carrousel d'avis, horaires dynamiques, formulaire de réservation (démo front-end)
- `assets/favicon.svg` — icône du site

## Personnalisation avant mise en ligne

- Remplacer les placeholders entre crochets : adresse, téléphone, email, réseaux sociaux
- Mettre à jour les horaires dans `HOURS` au début de `js/main.js`
- Remplacer les avis d'exemple de la section Avis par de vrais avis Google
- Intégrer une vraie carte Google Maps dans `.map-placeholder` (section Contact)
- Remplacer les vignettes de la galerie et les blocs photo par de vraies photos (prompts de génération d'image fournis en commentaire HTML au-dessus de chaque emplacement)
- Connecter le formulaire de réservation à un service réel (email, Formspree, etc.)

## Aperçu local

Ouvrir `index.html` dans un navigateur, ou servir le dossier avec un serveur statique, par exemple :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.