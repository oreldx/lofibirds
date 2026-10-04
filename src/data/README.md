# Catalogue et ressources

`species.ts` associe à chaque espèce un sprite PNG transparent et un chant MP3.
`resources.ts` contient le décor et la brise ; `credits.ts` conserve leur
provenance, droits et adaptations sous forme synthétique.

Tous les fichiers sont importés depuis `src/assets/` via Vite. Aucun catalogue
externe n’est contacté pendant l’écoute. Importer une URL audio ne charge ni
ne décode le son ; le chargement à la demande sera ajouté avec le moteur.

Les créations locales ont une source descriptive, sans URL fictive.
Un auteur inconnu est représenté par `null` ; le titulaire déclaré du décor
n’est pas présenté comme son auteur.
