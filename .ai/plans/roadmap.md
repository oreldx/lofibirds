# Roadmap générale — Lofibirds

## Vision

Créer une application web responsive, en français, proposant une expérience contemplative dans un jardin européen vivant. Une scène en pixel art animée en boucle accompagne uniquement des sons naturels. L’utilisateur compose son jardin sonore avec cinq espèces et une ambiance de fond indépendante.

Sans musique, sans compte utilisateur et sans fonctionnalités sociales.

## Décisions retenues

- Architecture : application entièrement frontend avec Vue 3, TypeScript strict et Vite, produisant des fichiers statiques sans backend, API ni base de données.
- Conventions d'implémentation : suivre les [règles techniques](../rules.md).
- Plateforme prioritaire : ordinateur, avec écoute continue lorsque l'onglet est masqué ; interface mobile responsive, sans garantie d'écoute sur téléphone verrouillé ni pendant la veille de l'appareil.
- Première version en ligne uniquement ; le cache améliore les visites suivantes sans garantir un fonctionnement hors connexion.
- Scène : jardin européen au matin de printemps, avec arbres, fleurs et brise légère.
- Espèces : merle noir, rouge-gorge, mésange charbonnière, moineau domestique et pinson des arbres.
- Chaque espèce possède un interrupteur et un volume indépendant.
- Désactiver une espèce coupe son chant et retire son oiseau de la scène ; un volume à zéro conserve l’oiseau visible.
- Les chants sont espacés par des intervalles légèrement aléatoires ; le fond naturel joue en continu.
- Les préférences sont conservées localement sur le même appareil, sans compte.
- Le son démarre uniquement après une action explicite de l’utilisateur.
- Sources envisagées : https://xeno-canto.org/ et https://www.chant-oiseaux.fr/, sous réserve de droits de réutilisation vérifiés pour chaque enregistrement.

## Étape 1 — Fondations et ressources

- Initialiser Vue 3 avec Composition API, TypeScript strict et Vite ; produire une application statique sans serveur applicatif ni API publique.
- Séparer composants d'interface, moteur audio indépendant de Vue, liaison réactive, catalogue et persistance selon les règles techniques.
- Structurer le catalogue des espèces : identifiant, nom, fichiers audio, sprite et crédits.
- Produire un décor raster en pixel art et des sprites séparés pour les cinq espèces.
- Sélectionner des chants propres, sans voix, musique ni autres espèces dominantes.
- Trouver un fond de brise et de feuillage sans chants identifiables pour préserver le contrôle individuel.
- Vérifier et documenter auteur, source, licence et éventuelles modifications de chaque ressource avant intégration.
- Servir les ressources avec l’application plutôt que dépendre des catalogues pendant l’écoute.
- Importer les assets via Vite pour produire des noms avec empreinte de contenu ; mesurer leur poids avant de fixer un budget de transfert et de mémoire.

**Livrable :** socle du projet et ressources utilisables, avec leurs crédits.

## Étape 2 — Première scène immersive

- Afficher le jardin dès l’ouverture.
- Intégrer le décor, les cinq oiseaux et des animations douces de feuillage et d’oiseaux.
- Préserver la netteté du pixel art lors du redimensionnement.
- Installer un panneau compact à côté de la scène sur ordinateur et sous la scène sur mobile, avec possibilité de le replier.
- Respecter la préférence de réduction des animations.

**Livrable :** première version visuelle responsive, reconnaissable et navigable.

## Étape 3 — Jardin sonore fonctionnel

- Mettre en place Web Audio API avec un canal de volume par espèce, un canal d’ambiance et une sortie commune.
- Conserver une seule instance du moteur audio pour la session, indépendante du cycle de rendu des composants.
- Charger et décoder les sons des canaux actifs au démarrage de l'écoute, puis les autres à leur activation ; réutiliser les buffers et mutualiser les chargements pendant la session.
- Ajouter les commandes globales « Écouter le jardin » et « Pause ».
- Programmer les chants avec des pauses aléatoires de 8 à 25 secondes après chaque extrait et des premiers départs décalés.
- Utiliser l'horloge audio et une programmation anticipée ; ne pas dépendre uniquement des minuteries JavaScript pour la continuité en arrière-plan sur ordinateur.
- Ne pas mettre automatiquement l'audio en pause lorsque l'onglet est masqué ; gérer une éventuelle suspension du navigateur sans créer de doublons ni de rafale de chants à la reprise.
- Empêcher une espèce de se superposer à elle-même ; conserver vitesse et hauteur originales.
- Boucler l’ambiance avec un fondu aux raccords.
- Appliquer des transitions douces aux volumes, activations et désactivations.
- Relier les interrupteurs audio à la présence des oiseaux dans la scène.
- À la pause, arrêter les sources et les programmations ; à la reprise, recréer la programmation sans doublons.
- En cas d’échec de chargement, signaler le canal concerné et laisser les autres fonctionner.

**Livrable :** cinq espèces et un fond naturel composables indépendamment, avec lecture et pause fiables.

## Étape 4 — Préférences et finition

- Sauvegarder dans `localStorage` les espèces actives, leurs volumes et les réglages du fond naturel.
- Restaurer les préférences sans lancer automatiquement la lecture.
- Première visite : cinq espèces activées à 40 %, ambiance à 25 %, lecture arrêtée.
- Prévoir un fonctionnement normal si le stockage local est indisponible.
- Rendre interrupteurs, curseurs et commandes accessibles au clavier, avec libellés explicites et focus visible.
- Ajouter les crédits discrets, le favicon et les métadonnées de Lofibirds.

**Livrable :** expérience complète, accessible et personnalisable entre les visites.

## Étape 5 — Validation et publication

- Tester chaque interrupteur, chaque volume, le fond seul et le silence complet.
- Vérifier plusieurs cycles de pause/reprise et l’absence de chants après désactivation.
- Écouter les raccords et le mélange complet pour détecter clics, saturation et bruits parasites.
- Vérifier que seules les espèces activées restent visibles.
- Contrôler la restauration des préférences et les erreurs de chargement audio.
- Tester ordinateur et mobile, clavier, animations réduites et agrandissement du texte.
- Vérifier la lecture dans Chrome, Firefox et Safari, notamment le démarrage après interaction sur mobile.
- Vérifier une écoute prolongée dans un onglet masqué sur ordinateur, sans chants manquants liés à la programmation ni téléchargements répétés.
- Exécuter le contrôle TypeScript, le build et les tests ciblés de programmation audio, pause/reprise et persistance.
- Mesurer chargement initial, mémoire audio décodée et fluidité avec tous les canaux actifs.
- Vérifier les possibilités et quotas de l'hébergement Sites, puis les en-têtes réellement servis : cache long pour les assets versionnés et revalidation du HTML.
- Vérifier la réutilisation des ressources en cache et leur actualisation après un nouveau déploiement.
- Confirmer les crédits et droits de toutes les ressources, puis publier via Sites.

**Livrable :** première version publiée et vérifiée.

## Critères de réussite de la première version

- Le jardin est immédiatement visible et utilisable sur ordinateur et mobile.
- Les cinq espèces et le fond naturel sont contrôlables séparément.
- Le paysage sonore reste naturel et apaisant pendant une écoute prolongée.
- Sur ordinateur, l'écoute continue lorsque l'onglet est masqué, tant que le navigateur et le système permettent la lecture.
- Les espèces désactivées ne sont ni audibles ni visibles.
- Aucun son ne démarre sans action de l’utilisateur.
- Les préférences sont retrouvées sur le même appareil quand le stockage est disponible.
- Toutes les ressources diffusées disposent de droits vérifiés et de crédits appropriés.

## Hors périmètre de la première version

Comptes, fonctionnalités sociales, musique, scènes supplémentaires, météo dynamique, changement jour/nuit, installation native, synchronisation entre appareils, fonctionnement hors connexion garanti et service worker. Ces éléments ne font pas partie de la roadmap engagée.

## État actuel

Le socle Vue 3 / TypeScript strict / Vite / Vitest et le verrou npm sont en place.
Le catalogue local comprend le décor, les cinq sprites, les cinq chants et
l’ambiance, avec leurs crédits dans l’application. La scène responsive et le
moteur audio des étapes 2 et 3 sont implémentés.

Les préférences de l’étape 4 sont sauvegardées automatiquement et restaurées
sans démarrer l’écoute. Les commandes natives disposent de libellés explicites
et de focus visibles ; les animations des oiseaux sont supprimées lorsque la
réduction des animations est demandée. Les crédits repliables et les métadonnées
sont en place. Le favicon est reporté.

Les tests de comportement restent à ajouter. Les vérifications navigateur,
l’écoute prolongée, les mesures, la vérification finale des droits et la
publication constituent le travail restant de l’étape 5.
