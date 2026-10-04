# Lofibirds

Jardin sonore en français, construit avec Vue 3, TypeScript strict et Vite.

La [direction artistique](.ai/direction-artistique.md) propose une interface
Scandinavian Modern chaleureuse encadrant le jardin en pixel art. La palette,
les espacements, les cadres et les interrupteurs sont appliqués. Pour installer
Karla localement, suivre [les instructions de la police](src/assets/fonts/README.md).

Le socle et le catalogue des ressources sont intégrés : un décor, cinq sprites,
cinq chants et une ambiance. La page actuelle permet de consulter les habitants
et les crédits ; la scène immersive, le moteur audio et la persistance restent
aux étapes suivantes.

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
| `npm test` | Tests Vitest ; aucun test métier à ce stade |
| `npm run test:watch` | Surveillance des futurs tests |
| `npm run assets:check` | Empreintes, poids et budgets des ressources |

Vitest cherche `src/**/*.test.ts` dans l’environnement Node. L’absence de tests
reste acceptée pour les fondations ; retirer `passWithNoTests` à l’ajout des
premiers tests du moteur audio et de la persistance.

## Architecture

- `src/components/` : interface Vue et présentation des crédits.
- `src/audio/`, `src/composables/`, `src/storage/` : emplacements des prochaines étapes.
- `src/data/` : espèces, ressources du jardin, crédits et réglages initiaux.
- `src/assets/` : images et sons locaux importés via Vite.
- `src/types.ts` : identifiants, réglages, états et crédits.

Les liens externes servent uniquement à consulter sources et licences.
Les imports renvoient des URL locales ; ils ne téléchargent pas les sons.
L’inlining est désactivé afin que même les petits assets obtiennent un fichier
avec empreinte de contenu. Aucun AudioContext ni accès au stockage n’est créé
par l’application actuelle ; les fichiers audio ne sont ni préchargés ni lus.
