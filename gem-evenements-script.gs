/**
 * GEM en Débat — formulaire « Ajouter un événement »
 *
 * À coller dans https://script.google.com (Nouveau projet), avec le compte Google de l'asso.
 * 1. Lancer la fonction « creerFormulaire » une seule fois (bouton ▶ Exécuter).
 * 2. Le journal d'exécution affiche le lien du formulaire et du Google Sheet.
 * Le détail est dans GUIDE-evenements.md.
 */

const TYPES = ["Conférence", "TEDx", "Éloquence", "Podcast", "Café-débat", "Autre"];

function creerFormulaire() {
  const form = FormApp.create("GEM en Débat — Ajouter un événement")
    .setDescription("Chaque réponse ajoute l'événement sur le site, rangé automatiquement par date.\n" +
                    "Pour corriger un événement, modifiez directement sa ligne dans le Google Sheet des réponses.")
    .setCollectEmail(false)
    .setProgressBar(false);

  form.addMultipleChoiceItem().setTitle("Type d'événement").setChoiceValues(TYPES).setRequired(true);
  form.addTextItem().setTitle("Titre").setHelpText("Ex. : Entreprendre, échouer et se relever").setRequired(true);
  form.addDateItem().setTitle("Date").setRequired(true);
  form.addTimeItem().setTitle("Heure").setHelpText("Heure de début").setRequired(true);
  form.addTextItem().setTitle("Lieu").setHelpText("Ex. : Auditorium GEM, Grenoble").setRequired(true);
  form.addParagraphTextItem().setTitle("Intervenants").setHelpText("Ex. : Joël Manly (Banque de France Isère) et Patrice Canac (60 000 rebonds)");
  form.addTextItem().setTitle("Lien d'inscription HelloAsso")
    .setHelpText("Le lien de l'événement sur HelloAsso. Laisser vide si les inscriptions ne sont pas encore ouvertes.");

  // Les réponses vont dans un Google Sheet, en format de date français (JJ/MM/AAAA)
  const ss = SpreadsheetApp.create("GEM en Débat — Événements (réponses)");
  ss.setSpreadsheetLocale("fr_FR");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // Rend les affiches envoyées visibles sur le site
  ScriptApp.newTrigger("rendreAffichePublique").forForm(form).onFormSubmit().create();

  Logger.log("Formulaire à remplir : " + form.getPublishedUrl());
  Logger.log("Formulaire à modifier : " + form.getEditUrl());
  Logger.log("Google Sheet des réponses : " + ss.getUrl());
  Logger.log("Étape suivante : ajouter la question « Affiche » (Importer un fichier), voir le guide.");
}

/** À chaque réponse : l'affiche importée devient lisible par tous ceux qui ont le lien, pour que le site puisse l'afficher. */
function rendreAffichePublique(e) {
  e.response.getItemResponses().forEach(function (r) {
    if (r.getItem().getType() !== FormApp.ItemType.FILE_UPLOAD) return;
    [].concat(r.getResponse()).forEach(function (id) {
      try {
        DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (err) {
        console.warn("Affiche non partagée : " + id + " — " + err);
      }
    });
  });
}
