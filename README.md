# Boucherie Ulysse et Sandrine

Site vitrine statique (HTML/CSS/JS, sans dépendance de build) pour la **Boucherie Ulysse et Sandrine**, boucherie-charcuterie artisanale à Massat (Ariège).

- 188 Rue de la Montagne, 09320 Massat
- 09 56 08 85 86
- 4,6/5 (22 avis Google)

## Structure

- `index.html` — toutes les sections du site (accueil, notre histoire, savoir-faire, produits, galerie, avis, infos pratiques, contact)
- `css/style.css` — design (thème rustique artisanal : rouge boucher profond, bois chaud, kraft)
- `js/main.js` — menu mobile, onglets produits, carrousel d'avis, horaires dynamiques (créneaux matin/après-midi, lundi fermé), formulaire de commande/devis (démo front-end)
- `assets/favicon.svg` — icône du site (couperet)
- `assets/photos/` — photos réelles de la boucherie (vitrine, viandes, plats préparés, charcuterie, fromages, épicerie fine), extraites et retouchées à partir d'une vidéo fournie par la boucherie

## Personnalisation avant mise en ligne

- Remplacer l'adresse email `contact@boucherie-ulysse-sandrine.fr` par la vraie adresse
- Renseigner les vrais liens Instagram / Facebook (actuellement `#` dans `.social-links`)
- Ajouter une photo de façade pour remplacer le bloc placeholder de la galerie ("Façade de la boucherie — photo à venir")
- Vérifier/mettre à jour les horaires dans `HOURS` au début de `js/main.js` si la boucherie change ses créneaux
- Remplacer les avis d'exemple de la section Avis par de vrais avis Google
- Vérifier les prix mentionnés ("au kg", "sur devis") et les remplacer par des tarifs réels si souhaité
- Connecter le formulaire de commande/devis à un service réel (email, Formspree, etc.)

## Aperçu local

Ouvrir `index.html` dans un navigateur, ou servir le dossier avec un serveur statique, par exemple :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.
