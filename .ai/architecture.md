# Architecture — Lofibirds

Ce document décrit le fonctionnement actuel. Les [règles techniques](rules.md)
définissent les contraintes à préserver ; les valeurs et formats précis restent
dans le code.

## Organisation

- `src/components/` : scène, réglages, lecture et fenêtre « À propos ».
- `src/audio/` : moteur indépendant de Vue et du DOM, planificateur des chants et boucles d’ambiance.
- `src/composables/` : état réactif partagé et commandes du jardin.
- `src/storage/` : validation et accès protégés aux préférences locales.
- `src/data/` : catalogues, positions, ressources, crédits et réglages initiaux.
- `src/types.ts` : identifiants, réglages, états et types des crédits.
- `src/assets/` : images, sons et police importés via Vite, avec noms versionnés ; l’inlining est désactivé.
- `public/` : favicon, icônes et manifeste aux noms fixes.

## Session et commandes

`useGarden` restaure les préférences puis crée une seule instance de
`GardenAudioEngine` au niveau du module. Les composants partagent cet état et
ses commandes ; ils ne créent pas leur propre moteur. Le remplacement du module
en développement détruit l’ancienne session.

La création du moteur ne crée pas d’`AudioContext` et ne charge aucun son.
L’action explicite d’écoute crée le contexte et charge les canaux actifs depuis
les URL locales des catalogues. Les buffers décodés sont réutilisés pendant la
session, y compris après une pause. Voir la [documentation audio](../src/audio/README.md)
pour la programmation, les transitions et les limites de continuité.

## Préférences et catalogue

Les commandes d’activation et de volume mettent à jour les réglages, les
transmettent au moteur et sauvegardent les préférences. Seuls les canaux connus,
leurs activations et leurs volumes sont persistés, jamais l’état de lecture.
La validation et la clé de stockage sont définies dans `src/storage/preferences.ts`.
Les champs invalides reprennent leurs valeurs par défaut ; les erreurs de
stockage laissent les réglages en mémoire utilisables. Aucune restauration ne
démarre l’écoute.

Les identifiants d’ambiance sont distincts des libellés affichés :
`brise-feuillage` correspond à « Vent léger » et `vent-leger` à « Brise et feuillage ».
Préserver ces identifiants pour conserver l’association des préférences aux sons.
Les catalogues font foi pour les libellés et les assets ; `src/data/defaults.ts`
définit les réglages initiaux. La provenance, les licences et les modifications
sont centralisées dans [les crédits](../src/data/credits.ts).

## Scène et animations

`GardenScene` affiche un ciel fixe et trois calques animés. Le décor original
reste visible jusqu’au décodage de toutes les images, ou si leur chargement
échoue. Les calques ne sont pas chargés tant que la page est masquée ou que
la réduction des animations est demandée ; ils peuvent être chargés ensuite
lorsque ces conditions changent.

`BirdSpritesheet` anime les oiseaux présents dans la scène ; les vignettes
restent au repos. Désactiver une espèce retire son sprite et libère sa minuterie.
Un volume nul conserve l’oiseau visible. Les animations respectent
`prefers-reduced-motion` et s’arrêtent dans un onglet masqué, sans déclencher
de pause audio. Les chants et les mouvements sont indépendants.

Les dimensions, poses et durées sont définies dans les composants, les styles
et `src/data/resources.ts`. Préserver la netteté du pixel art sans interpolation.
