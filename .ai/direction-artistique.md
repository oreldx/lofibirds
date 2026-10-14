# Direction artistique — Lofibirds

## Intention

**Une fenêtre sur un jardin de printemps.** Une interface claire, chaleureuse
et discrète encadre un paysage vivant en pixel art. La sensation recherchée est
celle d'un moment près d'une fenêtre ouverte : lumière douce, présence des
oiseaux, liberté de composer son écoute.

Cette direction décline la référence
[Scandinavian Modern de daisyUI](https://trends.daisyui.com/trend/scandinavian-modern/) :
neutres lumineux, accents naturels, simplicité fonctionnelle, marges généreuses,
typographie humaniste et angles légèrement adoucis. La référence guide le style ;
elle n'impose pas de bibliothèque de composants.

## Signature visuelle

- Le jardin est le point focal, visible dès l'ouverture.
- L'interface évoque le papier crème et la céramique mate par ses aplats.
- Le vert forêt identifie les actions et les réglages actifs.
- Le pixel art reste réservé au paysage et aux oiseaux. Les textes et commandes
  conservent des formes contemporaines, lisibles et précises.
- Les couleurs du décor peuvent être plus riches que celles de l'interface,
  avec une lumière matinale et des verts tempérés.

Éviter les textures de bois appliquées aux boutons, le grain sur les textes,
les ombres épaisses, les effets de verre, les grandes capsules et les ornements
répétés. La chaleur vient des couleurs, de la lumière et du paysage.

## Palette proposée

| Rôle | Couleur | Usage |
| --- | --- | --- |
| Fond — lin | `#F5F3EC` | Fond général |
| Surface — craie | `#FFFEFA` | Panneau de réglages |
| Surface secondaire — avoine | `#EAE6DC` | Zones secondaires et pistes de volume |
| Texte — encre végétale | `#283C32` | Titres et contenu principal |
| Texte secondaire — pierre | `#59655D` | Aide et informations complémentaires |
| Accent — forêt | `#365C49` | Lecture, interrupteurs actifs, focus, liens |
| Accent doux — sauge | `#DCE5D8` | Fonds de sélection |
| Accent ponctuel — argile | `#A65F46` | Petit détail de marque ou illustration |
| Séparateur — sable | `#D6D3C8` | Filets décoratifs |
| Erreur — terre rouge | `#963F35` | Message d'échec accompagné d'un libellé |

Les accents argile restent rares ; ne pas donner une couleur d'interface distincte
à chaque espèce. Préserver les couleurs caractéristiques des oiseaux dans les
sprites. Les filets décoratifs ne suffisent pas à identifier une commande : les
contours utiles, curseurs et indicateurs doivent être contrastés.

Avant intégration, vérifier les contrastes sur les combinaisons réellement
utilisées : au moins 4,5:1 pour le texte courant et 3:1 pour les éléments de
commande nécessaires à leur identification. Un état ne repose jamais uniquement
sur sa couleur.

## Typographie

**Karla** est la police des textes et commandes, servie localement, avec
`system-ui, sans-serif` en repli. Utiliser les graisses 400 et 600 et documenter
la licence de tout nouveau fichier de police.

Pour une touche éditoriale, conserver **Georgia** sur le titre d'accueil et,
éventuellement, le nom du projet. Ne pas multiplier les titres en serif.

- Titre principal : 32–44 px sur ordinateur, 28–32 px sur mobile.
- Titres du panneau : 20–24 px.
- Texte et noms d'espèces : 16 px ; interligne de 1,5 environ.
- Informations secondaires : 14 px minimum.
- Libellés en casse naturelle, sans majuscules espacées ni police pixel.

## Composition

Le jardin occupe la zone principale ; un panneau de réglages peut être ouvert
à droite sur ordinateur et dans une fenêtre modale sur mobile. Garder ce panneau
compact et les commandes lisibles, avec des espacements généreux lorsque
l'espace le permet.

Le paysage garde son ratio d'origine, proche de 16:9. Ne pas recadrer au point
de masquer un oiseau ou son emplacement. Le cadre utilise un rayon de 8 px et
un filet discret ; le panneau partage ce rayon. Pas de commandes superposées
sur les oiseaux.

Sur mobile, placer le jardin avant les réglages, avec des marges de 16 px. Le
panneau peut être replié, tout en gardant la commande globale d'écoute accessible.
À fort zoom ou quand les textes ne tiennent plus, passer à une seule colonne.

Les crédits sont accessibles dans la fenêtre « À propos », avec une présentation simple.
L'écran principal sert à observer et écouter, avec une introduction courte.

## Commandes et états

- Une seule action principale : « Écouter le jardin », puis « Pause » pendant
  la lecture. Bouton vert forêt, texte clair, icône simple accompagnée du texte.
- Panneau « Les sons du jardin » : onglet « Espèces » pour les cinq oiseaux,
  avec photo, nom, interrupteur et volume.
- Onglet « Environnement » : « Vent léger », « Pluie douce », « Ruisseau »,
  « Rivière » et « Brise et feuillage », avec les mêmes conventions de commande.
- Curseurs fins, poignée clairement visible, valeur accessible. Une cible
  interactive d'au moins 44 × 44 px peut entourer un élément visuel plus petit.
- Espèce désactivée : interrupteur explicite et volume indisponible ; son nom
  reste lisible. Un volume nul conserve l'oiseau dans la scène.
- Chargement : texte discret « Chargement du chant… », sans masquer la scène.
- Échec : « Le chant du merle n'a pas pu être chargé. » et « Réessayer » près
  du canal concerné.
- Focus : contour forêt de 3 px, décalé de 3–4 px, visible sur chaque commande.

Les sons démarrent uniquement après une action explicite. Les réglages restaurés
ne modifient pas cette règle.

## Pixel art et mouvement

Le jardin montre un matin de printemps européen : feuillage, fleurs, muret,
barrière et lumière douce. Conserver une échelle de pixel cohérente entre le
décor et les sprites, des silhouettes identifiables et une perspective commune.
Préserver les pixels nets, sans flou ni lissage des sprites.

Les animations évoquent des événements naturels espacés : un frémissement de
feuillage, un petit mouvement de tête. Éviter un saut régulier de tous les oiseaux
ou une synchronisation artificielle avec chaque chant.

Les transitions d'interface durent environ 150–200 ms, avec variation légère de
couleur ou d'opacité. Respecter la réduction des animations en supprimant les
animations ambiantes et les mouvements de transition.

## Ton rédactionnel

Français simple, accueillant et concret. Utiliser « Les sons du jardin », « Espèces »,
« Environnement », « Écouter le jardin », « Pause » et « À propos ». Conserver l'accroche
actuelle : « Un jardin, un instant pour soi. »

Éviter les promesses thérapeutiques, les indicateurs de productivité et le
vocabulaire technique dans les commandes.

## Évolution et validation visuelle

La typographie locale, les couleurs, les cadres et les commandes audio sont
déjà intégrés. Cette charte guide les évolutions visuelles ; les valeurs
effectivement utilisées restent dans les styles et les composants.

Lors d'une modification visuelle, vérifier la composition avec les assets
existants sur ordinateur et mobile, les contrastes, le clavier, le zoom à 200 %
et la réduction des animations. La charte ne constitue pas une validation
du rendu final.
