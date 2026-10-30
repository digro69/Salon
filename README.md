# Salon des Vignerons Indépendants – Lyon 2026

Application web (PWA) : liste des 419 exposants, avec recherche, filtres (région, Bio, HVE, 1er salon), tri, et favoris ★.
Elle s'installe sur l'écran d'accueil du téléphone et fonctionne **hors ligne** après la première ouverture.

Aucune compilation : ce sont des fichiers statiques.

## Publier sur GitHub Pages

1. Créer un dépôt GitHub (ex. `salon-lyon-2026`) et y pousser le contenu de ce dossier (`index.html` à la racine).
2. Sur GitHub : **Settings → Pages → Build and deployment → Source : Deploy from a branch**, branche `main`, dossier `/ (root)` → **Save**.
3. Après ~1 minute, l'application est disponible sur `https://<votre-compte>.github.io/<nom-du-depot>/`.

## Installer sur le téléphone

- **Android (Chrome)** : ouvrir l'adresse → menu ⋮ → **Installer l'application** (ou « Ajouter à l'écran d'accueil »).
- **iPhone (Safari)** : ouvrir l'adresse → bouton Partager → **Sur l'écran d'accueil**.

Ouvrir l'application une fois avec du réseau avant le salon, pour qu'elle se mette en cache.

## Mettre à jour la liste

Les données sont dans `data.js`. Après modification, changer `VERSION` dans `sw.js` (`v1` → `v2`) puis pousser :
les téléphones récupèrent la nouvelle version à l'ouverture suivante avec du réseau.

## Notes

- Les favoris sont enregistrés sur l'appareil (stockage local du navigateur), pas synchronisés entre appareils.
- Le lien « Site Internet » ouvre le premier résultat DuckDuckGo pour le domaine (préfixe `\`) : non vérifié.
