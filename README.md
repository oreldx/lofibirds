# Lofibirds

Jardin sonore en français, construit avec Vue 3, TypeScript strict et Vite.

La [direction artistique](.ai/direction-artistique.md) propose une interface
Scandinavian Modern chaleureuse encadrant le jardin en pixel art. La palette,
les espacements, les cadres et les interrupteurs sont appliqués. La police
Karla est servie localement.

Le jardin en pixel art affiche les cinq espèces ; chaque interrupteur contrôle
la présence de l’oiseau et son chant. Les volumes sont indépendants, avec un
canal séparé « Brise et feuillage ». Un volume nul conserve l’oiseau visible.
L’écoute démarre uniquement avec « Écouter le jardin » et s’arrête avec « Pause ».
Les crédits des illustrations et des sons sont accessibles en bas de page.

Le rouge-gorge utilise désormais le spritesheet de 12 poses : chaque séquence
est jouée à 4 images/s pendant 3 secondes, avec un repos aléatoire de 8 à 25
secondes avant chaque séquence. Sa vignette affiche uniquement la pose de repos.
Désactiver l’espèce annule sa minuterie ; masquer l’onglet ou demander une
réduction des animations arrête le mouvement. Le chant reste indépendant.

Les activations et volumes sont sauvegardés automatiquement dans `localStorage`
et restaurés à la visite suivante, sans démarrer le son. À la première visite,
les cinq espèces sont activées à 40 % et l’ambiance à 25 %. Si les données sont
invalides, les champs concernés reprennent leurs valeurs par défaut ; si le
stockage est indisponible, le jardin reste utilisable avec ses réglages en mémoire.

L’interface conserve les commandes HTML natives et leurs focus visibles ; le
panneau se replie sans masquer l’action d’écoute. La préférence de réduction
des animations désactive les mouvements des oiseaux et les transitions.
Le favicon est reporté. La validation navigateur approfondie et la publication
restent à l’[étape 5 de la roadmap](.ai/plans/roadmap.md).

## Installation et commandes

Node.js `^22.18.0 || >=24.12.0` et npm sont requis. Le verrou
`package-lock.json` est présent et conservé dans le dépôt.

```sh
npm ci
npm run dev
```

| Commande | Usage |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run type-check` | Contrôle TypeScript strict |
| `npm run build` | Contrôle des types et build statique dans dist/ |
| `npm run preview` | Prévisualisation du build |
| `npm test` | Exécution de la suite Vitest, encore à ajouter |
| `npm run test:watch` | Surveillance des futurs tests |

Vitest cherche `src/**/*.test.ts` dans l’environnement Node. Aucun test métier
n’est présent pour le moment ; `npm test` signale l’absence de fichiers de test.
La commande `assets:check` est déclarée dans le manifeste, mais son script
`scripts/check-assets.mjs` reste à ajouter avant de pouvoir l’utiliser.

## Essai du spritesheet du rouge-gorge

Avec `npm run dev`, ouvrir `/spritesheet-test.html` (par exemple
`http://localhost:5173/spritesheet-test.html`). Cette page indépendante permet
de lire/mettre en pause les 12 poses en boucle continue, régler la vitesse de 1 à 16 images/s,
agrandir l’oiseau et sélectionner une pose fixe. Elle est également incluse
dans le build et accessible avec `npm run preview`.

Le fichier original `src/assets/images/spritesheet.png` mesure 404 × 270 pixels :
une grille de 4 × 3 cases de 101 × 90 pixels, parcourue ligne par ligne.
L’animation native CSS utilise `background-position` et `steps(1, end)` pour
changer de case sans interpolation, avec `image-rendering: pixelated`.
La réduction des animations empêche la lecture automatique ; l’utilisateur
peut la lancer explicitement. La boucle se répète sans limite et le changement
d’onglet ne déclenche pas de pause applicative ; le navigateur peut toutefois
ralentir les animations en arrière-plan.
Le test n’utilise aucun son et ne persiste aucun réglage.

Cette ressource a été fournie dans le dépôt ; son auteur et sa licence
ne sont pas renseignés. Elle est utilisée telle quelle dans le jardin et cet
essai, avec des crédits distincts des anciens sprites. L’ordre retenu suit
les cases de gauche à droite, puis de haut en bas.

## Architecture

- `src/components/` : interface Vue et présentation des crédits.
- `src/audio/` : moteur indépendant de Vue, programmation des chants et boucle d’ambiance.
- `src/composables/` : état partagé, commandes et liaison avec le moteur audio.
- `src/storage/` : validation et accès protégés aux préférences locales.
- `src/data/` : espèces, ressources du jardin, crédits et réglages initiaux.
- `src/assets/` : images et sons locaux importés via Vite.
- `src/types.ts` : identifiants, réglages, états et crédits.

Les liens externes servent uniquement à consulter sources et licences.
Les imports renvoient des URL locales ; ils ne téléchargent pas les sons.
L’inlining est désactivé afin que même les petits assets obtiennent un fichier
avec empreinte de contenu. La restauration des préférences précède la création
du moteur ; elle ne crée aucun AudioContext et ne charge aucun son. Le contexte
audio est créé à la première action d’écoute. Les canaux actifs sont alors
chargés et décodés à la demande, puis les buffers sont réutilisés durant la session.
