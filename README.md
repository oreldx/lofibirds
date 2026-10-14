# Lofibirds

Un jardin sonore en français, en pixel art, construit avec Vue 3, TypeScript et Vite.

<img width="1800" height="1013" alt="screen" src="https://github.com/user-attachments/assets/793d1552-855b-44f7-86e9-12ba6d970631" />

Composez votre jardin avec cinq espèces d’oiseaux et cinq ambiances aux volumes
indépendants. Vos réglages sont sauvegardés ; l’écoute démarre uniquement avec
« Écouter le jardin » et s’arrête avec « Pause ».

## Démarrage

Node.js `^22.18.0 || >=24.12.0` et npm sont requis.

```sh
npm ci
npm run dev
```

## Commandes

| Commande | Usage |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run type-check` | Vérification TypeScript |
| `npm run build` | Vérification des types et build statique dans `dist/` |
| `npm run preview` | Prévisualisation du build |
| `npm test` | Tests Vitest¹ |

¹ Aucun fichier de test n’est présent actuellement.

## Crédits

Les sources sont accessibles dans « À propos ». Les auteurs, licences et
modifications des ressources sont documentés dans [les crédits complets](src/data/credits.ts).
