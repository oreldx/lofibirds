# Moteur audio

`GardenAudioEngine` gère une session et un seul `AudioContext`, créé à la première
action d’écoute. Il reste indépendant de Vue et du DOM. `useGarden` transmet les
URL locales et les positions normalisées du catalogue, puis les commandes et
les réglages ; les coordonnées servent également au placement visuel.

## Planification commune

`BirdScheduler` reçoit l’heure audio, les espèces disponibles, leurs positions
et les durées décodées. Il ne crée aucun nœud audio. Il produit les nouveaux
événements pour un horizon de 180 secondes, renouvelé toutes les secondes par
le moteur. Les sources sont programmées sur l’horloge audio, ce qui permet de
poursuivre les événements déjà préparés lorsque le thread JavaScript ralentit.

- Deux espèces au maximum jouent simultanément, sans superposition d’une
  espèce avec elle-même. Les départs sont espacés d’au moins deux secondes.
- Chaque chant tire un repos de 8 à 25 secondes après sa fin. Ce repos rend
  l’espèce éligible ; les contraintes globales peuvent retarder son départ.
- Parmi les espèces éligibles, celle dont le dernier départ est le plus ancien
  est choisie ; les égalités sont départagées aléatoirement. Une espèce activée
  à volume nul participe aussi à la programmation.
- La mémoire est propre à chaque espèce. Son dernier extrait est exclu si
  plusieurs sont disponibles. Le poids des autres vaut le nombre de chants
  écoulés depuis leur dernière utilisation, plus un ; un extrait jamais joué
  reçoit le poids le plus élevé. Un seul extrait peut être répété.

La première phase est normale. Les phases durent aléatoirement 120 à 240
secondes sur l’horloge audio ; la suivante est choisie parmi les deux autres.
Les départs ont un espacement minimal aléatoire de 12–20 secondes en phase
calme, 6–12 secondes en phase normale et 2–6 secondes en phase animée.

## Sources et transitions

Chaque chant suit le graphe source → enveloppe → panoramique stéréo → gain
d’espèce → sortie commune. Les cinq ambiances ont chacune leur canal et leur
boucle avec raccord fondu, sans participer à la limite des deux oiseaux. La
sortie commune applique un gain de 1/8 pour garder une marge lorsque les cinq
fonds et deux oiseaux jouent ensemble.

Le panoramique vaut `0,6 × (2x − 1)`, avec variation de ±0,05. Le niveau vaut
`0,85 + 0,15y`, varie de ±5 %, reste plafonné à 1, puis est multiplié par le
volume utilisateur. Chaque extrait possède des fondus d’entrée et de sortie
de 100 ms, raccourcis à la moitié de sa durée si nécessaire. La vitesse et la
hauteur restent celles du fichier. Les changements de volume ne reconstruisent
pas la programmation.

Le planificateur distingue la mémoire validée des événements futurs. L’heure
de départ suffit à valider un événement, même si son callback `ended` arrive
tardivement. Une activation, une désactivation ou un chargement tardif annule
les futurs chants et reconstruit l’horizon ; les chants en cours des autres
espèces et leurs repos sont préservés. Les événements annulés avant leur départ
ne restent pas dans la mémoire. Désactiver une espèce coupe son chant avec un
fondu, puis conserve son repos après cette fin anticipée.

Une pause annule les programmations et arrête toutes les sources. La reprise
réinitialise la mémoire et les phases, en gardant les buffers décodés. Une
interruption du contexte arrête aussi les sources ; lorsque le contexte repart,
la mémoire reste conservée. Après un gel prolongé du thread, aucun départ passé
n’est rejoué : la programmation repart depuis l’heure actuelle et saute les
phases expirées sans les dérouler en rafale.

## Chargement et limites

Seuls les canaux activés sont chargés et décodés lors de l’écoute. Les requêtes
en cours sont mutualisées et les buffers sont réutilisés pendant la session.
Une réponse tardive ne démarre pas un canal désactivé ou une session en pause.
Un échec reste limité au canal concerné ; une nouvelle tentative est explicite.
La destruction libère les sources, les nœuds, la minuterie et le contexte.
Les chants et les ambiances sont des fichiers MP3 locaux ; leur décodage doit être
vérifié dans Chrome, Firefox et Safari.

## Préparation des enregistrements

`tools/prepare-bird-audio.py` prépare les quatre MP3 fournis à la racine sans
modifier les originaux. Il nécessite Python 3 et FFmpeg avec `libmp3lame` :

```sh
python3 tools/prepare-bird-audio.py --ffmpeg /chemin/vers/ffmpeg
```

Les recettes du script définissent les coupes, dont l’extrait du pinson
de 3,85 à 7,50 secondes dans l’original. Le traitement conserve la
dynamique, la vitesse et la hauteur : gain statique calculé sur chaque extrait,
fondus courts, puis MP3 mono. Les enveloppes de lecture du moteur s’appliquent
ensuite. Aucun débruitage ni compression n’est appliqué. Le script contrôle les
crêtes après réencodage et imprime les mesures et empreintes des sources en JSON.
Les crédits et les réserves de provenance sont dans `src/data/credits.ts`,
également consultables dans « À propos » pour ces enregistrements.

Mesures après traitement (FFmpeg 7.1, avant gains du moteur) :

| Extrait | Durée | Gain appliqué | Crête décodée | RMS décodé | Poids |
| --- | ---: | ---: | ---: | ---: | ---: |
| Merle 3486 | 4,30 s | −6,98 dB | −7,31 dBFS | −23,45 dBFS | 69 842 octets |
| Rouge-gorge 1670 | 3,00 s | −6,02 dB | −6,54 dBFS | −23,45 dBFS | 48 944 octets |
| Rouge-gorge 1671 | 2,13 s | −7,52 dB | −7,97 dBFS | −23,44 dBFS | 35 151 octets |
| Pinson LaSonothèque | 3,65 s | −6,72 dB | −10,20 dBFS | −23,45 dBFS | 59 393 octets |

Ces mesures vérifient le décodage et la marge numérique ; elles ne remplacent
pas une écoute du mélange dans les navigateurs ciblés.

## Limites de continuité

Au-delà des 180 secondes préparées, un gel du thread peut créer un silence
jusqu’au prochain renouvellement. L’anticipation ne garantit pas la lecture
pendant une suspension du navigateur ou du système. Les vérifications dans les
navigateurs réels sont décrites dans les [règles techniques](../../.ai/rules.md#validation).
