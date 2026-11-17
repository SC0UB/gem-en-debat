# Ajouter un événement sur le site GEM en Débat

Les membres de l'asso remplissent un **Google Form**. Chaque réponse arrive dans un **Google Sheet**, et le site lit ce Sheet : l'événement apparaît tout seul, rangé par date. Les événements passés disparaissent de l'accueil automatiquement.

---

## Installation (une seule fois, ~10 minutes)

À faire avec le **compte Google de l'asso**.

### 1. Créer le formulaire et le Sheet

1. Aller sur https://script.google.com → **Nouveau projet**.
2. Effacer le contenu et coller tout le fichier `gem-evenements-script.gs`.
3. En haut, choisir la fonction **creerFormulaire**, puis cliquer **▶ Exécuter**.
4. Google demande des autorisations (formulaires, Sheets, Drive) : les accepter. C'est le script qui crée le formulaire et rend les affiches visibles.
5. En bas, le **journal d'exécution** affiche 3 liens : le formulaire à remplir, le formulaire à modifier et le Google Sheet. Les garder.

### 2. Ajouter la question « Affiche »

Google ne permet pas de créer cette question par script, il faut l'ajouter à la main :

1. Ouvrir le lien **« Formulaire à modifier »**.
2. Ajouter une question de type **Importer un fichier**, intitulée exactement **Affiche**.
3. Autoriser seulement les **images**, 1 fichier, taille max 10 Mo.

Remarque : pour importer un fichier, Google demande d'être connecté à un compte Google.

### 3. Publier le Sheet pour le site

1. Ouvrir le **Google Sheet des réponses**.
2. **Fichier → Partager → Publier sur le Web**.
3. Choisir l'onglet des réponses (« Réponses au formulaire 1 ») et le format **Valeurs séparées par des virgules (.csv)**.
4. Cliquer **Publier** et copier le lien.

### 4. Brancher le site

Dans `assets/events.js` (tout en haut), chercher la ligne :

```js
const SHEET_CSV = "";
```

et coller le lien entre les guillemets :

```js
const SHEET_CSV = "https://docs.google.com/spreadsheets/d/e/…/pub?gid=…&single=true&output=csv";
```

C'est terminé : l'accueil et les pages Conférences, Éloquence et TEDx lisent tous ce même Sheet. Chaque page affiche les événements de son type.

---

## Au quotidien

**Ajouter un événement :** remplir le formulaire. Il faut renseigner le type (Conférence, TEDx, Éloquence, Podcast, Café-débat, Autre), le titre, la date, l'heure, le lieu, les intervenants, le lien HelloAsso et l'affiche.

**Corriger ou supprimer un événement :** modifier ou supprimer sa ligne directement dans le Google Sheet.

**Le lien HelloAsso n'est pas encore prêt ?** Laisser la case vide : le site affiche « Inscriptions bientôt ». Ajouter le lien dans le Sheet dès qu'il existe.

**Délai :** Google met à jour le Sheet publié en général en moins de 5 minutes.

**Si le Sheet ne répond pas :** le site affiche les événements de secours écrits dans le fichier, pour ne jamais montrer une page vide.

## Partager l'accès

- Pour que d'autres membres ajoutent des événements : leur envoyer le lien **« Formulaire à remplir »**.
- Pour qu'ils puissent corriger : leur partager le **Google Sheet** en tant qu'éditeurs.
