
# Lofibirds

Jardin sonore en français, construit avec Vue 3, TypeScript strict et Vite.

<img width="1800" height="1013" alt="screen" src="https://github.com/user-attachments/assets/793d1552-855b-44f7-86e9-12ba6d970631" />

La [direction artistique](.ai/direction-artistique.md) propose une interface
Scandinavian Modern chaleureuse encadrant le jardin en pixel art. La palette,
les espacements, les cadres et les interrupteurs sont appliqués. La police
Karla est servie localement.

Le jardin en pixel art affiche les cinq espèces ; chaque interrupteur contrôle
la présence de l’oiseau et son chant. Les volumes sont indépendants, avec un
canal séparé « Brise et feuillage ». Un volume nul conserve l’oiseau visible.
L’écoute démarre uniquement avec « Écouter le jardin » et s’arrête avec « Pause ».
Les crédits des illustrations et des sons sont accessibles en bas de page.

Les chants partagent un planificateur avec 180 secondes d’anticipation sur
l’horloge audio. Deux espèces au maximum chantent ensemble, avec au moins
deux secondes entre départs. Chaque espèce se repose 8 à 25 secondes après
un extrait, puis attend son tour si la densité du jardin l’exige. Les phases
calmes, normales et animées durent chacune 2 à 4 minutes ; elles espacent les
départs respectivement de 12–20, 6–12 et 2–6 secondes lorsque les oiseaux sont
disponibles. Chaque changement choisit aléatoirement une autre phase.

La sélection favorise les espèces ayant attendu le plus longtemps et les
extraits les moins récents, sans répétition immédiate lorsqu’une espèce dispose
de plusieurs chants. Le catalogue actuel conserve un seul extrait par espèce ;
les suivants pourront être ajoutés à sa liste `audio`. Les chants ont des
fondus et de légères variations de niveau et de panoramique liées à la position
des oiseaux, sans changement de hauteur ou de vitesse. Après une pause, la
reprise réinitialise la mémoire et commence une nouvelle phase normale, en
réutilisant les sons déjà décodés. Voir [le moteur audio](src/audio/README.md).

`GardenScene` superpose trois calques animés sur un ciel fixe : nuages en
12 secondes, arrière-plan en 4 secondes et premier plan en 3 secondes. Chaque
spritesheet contient 16 frames en grille 4 × 4, parcourues sans interpolation.
Les frames sont pixelisées avec une taille de pixel de 3, selon la méthode Canvas
de Pixel Art Village, puis agrandies sans lissage aux dimensions d’origine.
Les atlas intégrés mesurent 6688 × 3764 pixels, avec des cases de 1672 × 941.
Le décor original reste affiché jusqu’au décodage de toutes les images, ou si
leur chargement échoue. Les oiseaux conservent leurs positions devant le décor.
L’animation est indépendante du son, se suspend dans un onglet masqué et se
fige si la réduction des animations est demandée. Lorsque cette préférence est
active au démarrage, les spritesheets ne sont pas chargées. Les sources, frames
et instructions de reconstruction sont dans
[output-pixel-art](output-pixel-art/README.md), avec les réglages et instructions
de reconstruction ; les frames originales restent dans `output/garden-animation/`.

Les cinq oiseaux utilisent chacun un spritesheet de 12 poses : chaque séquence
est jouée à 4 images/s pendant 3 secondes, avec un repos aléatoire de 8 à 25
secondes avant chaque séquence. Leurs vignettes affichent uniquement la pose de repos.
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
Les smoke tests généraux sont reportés à une prochaine étape.
La commande `assets:check` est déclarée dans le manifeste, mais son script
`scripts/check-assets.mjs` reste à ajouter avant de pouvoir l’utiliser.

## Essai du spritesheet du rouge-gorge

Avec `npm run dev`, ouvrir `/spritesheet-test.html` (par exemple
`http://localhost:5173/spritesheet-test.html`). Cette page indépendante permet
de lire/mettre en pause les 12 poses en boucle continue, régler la vitesse de 1 à 16 images/s,
agrandir l’oiseau et sélectionner une pose fixe. Elle est également incluse
dans le build et accessible avec `npm run preview`.

Le fichier original `src/assets/images/rouge-gorge-spritesheet.png` mesure 404 × 270 pixels :
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

## Spritesheets générées pour les quatre autres oiseaux

Les spritesheets du merle, de la mésange, du moineau et du pinson sont des
grilles 4 × 3 de 768 × 384 pixels, avec des cases de 192 × 128 pixels. La première case
vient de l’asset original, conservé ; les 11 suivantes sont des variations
générées séparément avec l’outil intégré OpenAI imagegen, toutes référencées
sur l’original pour limiter la dérive. La séquence suit une respiration, un
clignement, une légère inclinaison de tête et une ouverture du bec, puis le repos.

Les 12 frames sources et les prompts de chaque espèce sont conservés dans
son dossier `output/imagegen/<identifiant>/`. Le cadrage est commun à toutes les
frames ; l’assemblage conserve l’alpha et réduit les images au plus proche
voisin, sans lissage. Pour reconstruire la grille :

```sh
node scripts/assemble-bird-spritesheet.mjs output/imagegen/mesange-charbonniere/frames src/assets/images/mesange-charbonniere-spritesheet.png
node scripts/assemble-bird-spritesheet.mjs output/imagegen/pinson-des-arbres/frames src/assets/images/pinson-des-arbres-spritesheet.png
node scripts/assemble-bird-spritesheet.mjs output/imagegen/merle-noir/frames src/assets/images/merle-noir-spritesheet.png
node scripts/assemble-bird-spritesheet.mjs output/imagegen/moineau-domestique/frames src/assets/images/moineau-domestique-spritesheet.png
```

Avec `npm run dev`, ouvrir l’un des aperçus suivants pour lire la boucle,
régler sa vitesse et inspecter chaque pose :

| Espèce | Aperçu | Prompts et provenance |
| --- | --- | --- |
| Mésange charbonnière | [Aperçu](output/imagegen/mesange-charbonniere/preview.html) | [Génération](output/imagegen/mesange-charbonniere/generation.json) |
| Pinson des arbres | [Aperçu](output/imagegen/pinson-des-arbres/preview.html) | [Génération](output/imagegen/pinson-des-arbres/generation.json) |
| Merle noir | [Aperçu](output/imagegen/merle-noir/preview.html) | [Génération](output/imagegen/merle-noir/generation.json) |
| Moineau domestique | [Aperçu](output/imagegen/moineau-domestique/preview.html) | [Génération](output/imagegen/moineau-domestique/generation.json) |

Ces pages de travail sont également ouvrables directement depuis le disque ;
elles ne font pas partie du build de production. Le merle et le moineau restent
orientés vers la gauche dans le jardin. Les cinq oiseaux suivent les mêmes règles de repos,
de réduction des animations et de visibilité que le rouge-gorge.

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
