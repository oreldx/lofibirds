# Règles techniques — Lofibirs

Ces règles encadrent l'implémentation de la [roadmap](plans/roadmap.md). La roadmap définit le comportement produit ; ce document définit les conventions techniques.

## Stack et architecture

- Utiliser Vue 3, TypeScript en mode strict et Vite. La production est constituée de fichiers statiques ; aucun backend, API, base de données ou serveur Node n'est nécessaire à l'exécution.
- Écrire les composants avec Composition API et `<script setup lang="ts">`.
- Utiliser un état réactif partagé pour le jardin. Ne pas ajouter de routeur ni Pinia pour le périmètre initial.
- Organiser `src/` par responsabilité : `components/` pour l'interface, `audio/` pour le moteur, `composables/` pour la liaison réactive, `data/` pour le catalogue et les crédits, `storage/` pour les préférences.
- Définir des types partagés pour les identifiants d'espèces, les réglages et les états de chargement. Éviter `any` et les abstractions sans besoin concret.
- Garder le moteur audio indépendant de Vue et du DOM. Les composants passent par la liaison applicative pour transmettre les commandes ; ils ne créent pas leurs propres moteurs audio.

## Interface et scène

- Séparer le jardin, le panneau de réglages, les contrôles d'espèces et les crédits en composants aux responsabilités claires.
- Utiliser HTML sémantique et CSS pour le décor et les sprites, en préservant la netteté du pixel art.
- Donner la priorité à l'expérience ordinateur tout en conservant une interface mobile responsive.
- Assurer navigation clavier, libellés explicites, focus visible et états de chargement ou d'erreur compréhensibles.
- Respecter `prefers-reduced-motion`. Le masquage de la page peut réduire les animations visuelles, sans mettre automatiquement l'audio en pause sur ordinateur.

## Moteur audio

- Utiliser Web Audio API avec une seule instance du moteur et un seul `AudioContext` pour la session, un gain par espèce, un gain d'ambiance et une sortie commune.
- Démarrer ou reprendre l'audio uniquement après une action explicite ; la restauration des préférences ne déclenche jamais la lecture.
- Programmer les sources sur l'horloge audio avec une anticipation adaptée aux intervalles de 8 à 25 secondes. Ne pas compter uniquement sur `setTimeout`, `setInterval` ou `requestAnimationFrame` pour l'écoute en arrière-plan.
- Valider la continuité dans un onglet masqué sur les navigateurs desktop ciblés : la programmation anticipée ne garantit pas à elle seule la continuité face aux suspensions du navigateur ou du système.
- À la pause, arrêter les sources actives et futures et annuler la programmation ; à la reprise, recréer une seule programmation. Lors d'une suspension, éviter tout rattrapage en rafale.
- Empêcher une espèce de se superposer à elle-même. Désactiver un canal annule ses sons programmés ; un volume nul conserve l'oiseau visible.
- Appliquer des transitions douces aux gains et un fondu aux raccords de l'ambiance ; préserver vitesse et hauteur des enregistrements.
- Charger et décoder seulement les canaux utiles à l'écoute. Mutualiser les requêtes en cours et réutiliser les buffers décodés pendant la session, y compris après pause/reprise.
- Si un chargement se termine après une pause ou une désactivation, ne pas démarrer le canal devenu inactif.
- Isoler les erreurs par canal, laisser les autres fonctionner et permettre une nouvelle tentative sans boucle de requêtes automatique.
- Libérer sources, programmations et contexte lors de la destruction du moteur. Un nouveau rendu de composant ne doit pas détruire la session.
- La continuité sur téléphone verrouillé et pendant la veille de l'ordinateur n'est pas garantie dans cette version.

## Assets, cache et hébergement

- Servir les ressources avec l'application, sur le même domaine ; ne pas dépendre des catalogues externes pendant l'écoute.
- Importer les images et les sons via Vite pour obtenir des noms avec empreinte de contenu. Réserver `public/` aux fichiers devant garder un nom fixe, sans supposer qu'ils sont automatiquement versionnés.
- Viser `Cache-Control: public, max-age=31536000, immutable` pour les assets avec empreinte et `Cache-Control: no-cache` pour la revalidation du HTML. Ne jamais remplacer le contenu d'un fichier déclaré immutable à URL constante.
- Vérifier les capacités de configuration de Sites, ses quotas et les en-têtes réellement servis avant publication ; ces directives sont des objectifs, pas des capacités déjà confirmées.
- S'appuyer sur le cache HTTP du navigateur et le CDN de l'hébergement. Ne pas ajouter de service worker ou de stockage explicite des fichiers audio dans cette version.
- Mesurer séparément poids transféré, mémoire audio décodée et coût des animations. Favoriser des extraits courts et une ambiance de durée maîtrisée ; fixer les budgets après sélection des ressources.
- Ne pas supposer que le CDN supprime le coût du trafic vers les visiteurs ni que le cache navigateur garantit un fonctionnement hors connexion.
- Documenter auteur, source, licence et modifications de chaque ressource avant intégration, avec des crédits accessibles dans l'application.

## Préférences

- Encapsuler les accès à `localStorage` dans `storage/` ; persister uniquement les espèces actives, leurs volumes et les réglages de l'ambiance.
- Valider les données lues et revenir aux valeurs par défaut pour les valeurs absentes ou invalides : cinq espèces activées à 40 %, ambiance à 25 %, lecture arrêtée.
- Gérer les erreurs de lecture et d'écriture du stockage sans empêcher l'utilisation de l'application.
- Garder les buffers, les sources et l'état de lecture hors des préférences persistées.

## Validation

- Exécuter le contrôle TypeScript et le build de production avant livraison d'une implémentation.
- Écrire des tests ciblés sur les comportements : programmation sans doublons, pause/reprise, désactivation, chargement tardif ou en échec, et restauration de préférences invalides ou indisponibles.
- Vérifier dans les navigateurs réels les raccords, les transitions de gain, la saturation, l'autoplay et la continuité dans un onglet masqué ; les tests unitaires ne remplacent pas l'écoute et les essais navigateur.
- Tester Chrome, Firefox et Safari desktop, puis le démarrage explicite et l'interface sur mobile, le clavier et les animations réduites.
- Contrôler les requêtes réseau pendant une écoute prolongée et les pauses/reprises ; vérifier cache, mise à jour après déploiement, mémoire et fluidité avec tous les canaux actifs.
