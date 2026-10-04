# Lofibirs

Application de jardin sonore en français, construite avec Vue 3, TypeScript strict
et Vite. Le socle affiche une page d’accueil et le catalogue des cinq espèces.
La scène, les ressources audio et les commandes d’écoute restent à réaliser.

## Installation

Node.js `^22.18.0 || >=24.12.0` et npm sont requis.

```sh
npm install
npm run dev
```

La première installation doit générer `package-lock.json` ; conserver ce fichier
dans le projet, puis utiliser `npm ci` pour les installations reproductibles.
Le verrou n’a pas pu être généré dans la session initiale, car le registre npm
était inaccessible (`ENOTFOUND registry.npmjs.org`).

## Commandes

| Commande | Usage |
| --- | --- |
| `npm run dev` | Serveur de développement Vite |
| `npm run type-check` | Contrôle strict des composants Vue, des modules et des configurations |
| `npm run build` | Contrôle des types, puis génération des fichiers statiques dans `dist/` |
| `npm run preview` | Prévisualisation locale du build de production |
| `npm test` | Exécution ponctuelle des tests Vitest |
| `npm run test:watch` | Tests Vitest en mode surveillance |

Vitest utilise l’environnement Node et cherche `src/**/*.test.ts`. L’absence de
tests est acceptée pour ce socle ; retirer `passWithNoTests` à l’ajout des premiers
tests métier. Les tests audio et de persistance seront ajoutés avec ces fonctionnalités.

## Architecture

- `src/components/` : interface Vue avec Composition API et `<script setup lang="ts">`.
- `src/audio/` : emplacement du futur moteur audio indépendant de Vue et du DOM.
- `src/composables/` : emplacement de l’état réactif partagé et de la liaison audio.
- `src/data/` : catalogue et fabrique de réglages initiaux.
- `src/storage/` : emplacement de la future persistance validée et protégée.
- `src/types.ts` : identifiants, réglages, états de chargement et crédits.

Les volumes sont normalisés entre 0 et 1. Chaque appel à
`createDefaultPreferences()` crée des réglages indépendants : cinq espèces actives
à 40 % et ambiance active à 25 %. L’état initial de lecture est `stopped`, défini
séparément des préférences persistables. Aucun AudioContext ni accès au stockage
n’est créé dans ce lot.

Les ressources sont explicitement absentes du catalogue (audio vide, sprite à
`null`). Avant intégration, vérifier les droits et renseigner les crédits, puis
importer les fichiers locaux via Vite. `garden.png` reste hors du build en attente
de vérification de sa provenance. Aucun fichier ne nécessite actuellement `public/`.

## État et validation

Le socle est écrit, mais sa validation complète reste bloquée par l’installation
des dépendances. Les modules de types, catalogue et réglages ont passé un contrôle
strict avec TypeScript 5.9.3 disponible en cache. Une vérification directe sous Node
a confirmé les cinq identifiants uniques, les ressources absentes, les valeurs par
défaut et l’indépendance des objets retournés par la fabrique. Cela ne remplace pas
le contrôle complet avec les versions déclarées et les composants Vue.

Les commandes de contrôle des types, tests, build et prévisualisation ont été
tentées, mais leurs exécutables sont absents tant que l’installation n’a pas réussi.
Le rendu navigateur n’a donc pas été vérifié. Le squelette a été écrit manuellement
en suivant les modèles officiels, car `create-vue` était également inaccessible.
Après rétablissement de l’accès npm, exécuter :

```sh
npm install
npm run type-check
npm test
npm run build
npm run preview
```

Vérifier ensuite la page sur ordinateur et mobile : texte lisible, aucune coupure
à 320 px de largeur, agrandissement du texte et absence de chargement audio.
La page actuelle ne contient ni commandes interactives ni animations.

La suite suit la [roadmap](.ai/plans/roadmap.md) et les [règles techniques](.ai/rules.md).
Il reste à intégrer des ressources aux droits vérifiés, construire la scène,
implémenter l’audio et les préférences, puis valider et publier.

Références du socle : [création d’un projet Vue](https://vuejs.org/guide/quick-start.html),
[TypeScript avec Vue](https://vuejs.org/guide/typescript/overview.html),
[Vite](https://vite.dev/guide/) et
[Vitest sans tests](https://vitest.dev/config/passwithnotests).
