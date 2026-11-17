/**
 * GEM en Débat — création du Google Sheet « Contenu du site »
 *
 * À faire une seule fois, avec le compte Google qui gardera le Sheet :
 * 1. Aller sur https://script.google.com → « Nouveau projet ».
 * 2. Tout effacer, coller ce fichier, enregistrer (icône disquette).
 * 3. Choisir la fonction « creerSite » en haut, cliquer sur ▶ Exécuter, puis autoriser.
 * 4. Le journal d'exécution affiche l'identifiant du Sheet : le coller dans assets/contenu.js (SHEET_ID).
 *
 * Le Sheet est rempli avec le contenu actuel du site. Ensuite, tout se modifie directement dans le Sheet.
 */

const TYPES = ["Conférence", "TEDx", "Éloquence", "Podcast", "Café-débat", "Autre"];

// le contenu actuel du site, onglet par onglet (copie du dossier contenu/)
const DONNEES = {
 "Événements": [
  [
   "Masquer",
   "À la une",
   "Type",
   "Titre",
   "Description",
   "Date",
   "Heure",
   "Lieu",
   "Intervenants",
   "Lien HelloAsso",
   "Affiche",
   "Replay ou photos"
  ],
  [
   "FALSE",
   "FALSE",
   "Conférence",
   "Sport et handicap",
   "",
   "07/10/2026",
   "17:00",
   "Auditorium Jean-François Fiorina, GEM",
   "nos invités",
   "https://www.helloasso.com/associations/gem-en-debat/evenements/conference-sport-et-handicap",
   "",
   ""
  ],
  [
   "FALSE",
   "FALSE",
   "Conférence",
   "Entreprendre, échouer et se relever",
   "",
   "29/10/2026",
   "17:00",
   "Auditorium GEM, Grenoble",
   "Joël Manly (Banque de France Isère) et Patrice Canac (60 000 rebonds)",
   "",
   "",
   ""
  ],
  [
   "FALSE",
   "FALSE",
   "Conférence",
   "La fabrique des nouveaux masculinistes",
   "",
   "12/11/2026",
   "18:00",
   "GEM, Grenoble",
   "intervenants à annoncer",
   "",
   "",
   ""
  ],
  [
   "FALSE",
   "FALSE",
   "Conférence",
   "Rencontre avec François Hollande",
   "",
   "16/11/2026",
   "18:00",
   "GEM, Grenoble",
   "François Hollande",
   "",
   "",
   ""
  ],
  [
   "FALSE",
   "FALSE",
   "Conférence",
   "L'art, une entreprise comme les autres ?",
   "",
   "17/11/2026",
   "18:00",
   "GEM, Grenoble",
   "intervenants à annoncer",
   "",
   "",
   ""
  ],
  [
   "FALSE",
   "FALSE",
   "Conférence",
   "Pour en finir avec la méritocratie",
   "",
   "23/11/2026",
   "18:00",
   "GEM, Grenoble",
   "intervenants à annoncer",
   "",
   "",
   ""
  ],
  [
   "FALSE",
   "FALSE",
   "Conférence",
   "CIC et immobilier",
   "",
   "24/11/2026",
   "18:00",
   "GEM, Grenoble",
   "le CIC",
   "",
   "",
   ""
  ],
  [
   "FALSE",
   "FALSE",
   "Conférence",
   "Et si on bifurquait ?",
   "",
   "02/12/2026",
   "18:00",
   "GEM, Grenoble",
   "intervenants à annoncer",
   "",
   "",
   ""
  ],
  [
   "FALSE",
   "FALSE",
   "Conférence",
   "Rencontre politique (7-8 décembre)",
   "",
   "07/12/2026",
   "18:00",
   "GEM, Grenoble",
   "intervenants à annoncer",
   "",
   "",
   ""
  ]
 ],
 "Annonce": [
  [
   "Masquer",
   "Texte",
   "Lien",
   "Texte du bouton"
  ],
  [
   "TRUE",
   "Inscriptions ouvertes pour la prochaine conférence !",
   "conferences.html",
   "Je m'inscris"
  ]
 ],
 "Équipe": [
  [
   "Masquer",
   "Nom",
   "Rôle",
   "Photo"
  ],
  [
   "FALSE",
   "Charlotte Bena",
   "Présidente",
   ""
  ],
  [
   "FALSE",
   "Carla Bourne",
   "Responsable partenariats",
   ""
  ],
  [
   "FALSE",
   "Valentin Wysocki",
   "Responsable conférences",
   ""
  ],
  [
   "FALSE",
   "Rémi Sourisseau",
   "Responsable rédaction",
   ""
  ]
 ],
 "Partenaires": [
  [
   "Masquer",
   "Nom",
   "Description",
   "Logo",
   "Site web"
  ],
  [
   "FALSE",
   "CIC Lyonnaise de Banque",
   "Banque régionale du groupe CIC, ancrée dans le territoire, qui accompagne particuliers, professionnels et entreprises.",
   "",
   "https://www.cic.fr"
  ],
  [
   "FALSE",
   "Oresys",
   "Cabinet de conseil indépendant en transformation, organisation et systèmes d'information, en France et en Suisse.",
   "",
   "https://www.oresys.eu"
  ],
  [
   "FALSE",
   "Grenoble École de Management",
   "Notre école, qui soutient la vie associative et nous accueille à Grenoble et à Pantin.",
   "",
   "https://www.grenoble-em.com"
  ]
 ],
 "Quinzaine": [
  [
   "Masquer",
   "Numéro",
   "Titre",
   "Date",
   "Lien du PDF",
   "Couverture"
  ],
  [
   "TRUE",
   "1",
   "Titre du numéro",
   "Octobre 2026",
   "",
   ""
  ]
 ],
 "Textes": [
  [
   "Page",
   "Clé (ne pas modifier)",
   "Texte"
  ],
  [
   "Accueil",
   "accueil-titre",
   "Les prochains rendez-vous de GEM en Débat."
  ],
  [
   "Accueil",
   "accueil-tuile-tedx",
   "Le grand rendez-vous de fin d'année, organisé par l'asso."
  ],
  [
   "Accueil",
   "accueil-tuile-quinzaine",
   "Le journal étudiant de GEM, chaque mois."
  ],
  [
   "Conférences",
   "conferences-intro",
   "Des invités politiques, sportifs, entrepreneurs, personnalités publiques. Un sujet qui fait débat, et une large place aux questions de la salle. Gratuit et ouvert à tous."
  ],
  [
   "Conférences",
   "conferences-adn",
   "La conférence est un espace d'échange et de réflexion : on y stimule le débat public à travers des conférences et des tables rondes, en donnant la parole à des experts, des professionnels et des personnalités inspirantes.\n\nÉconomie, développement durable, politique, entrepreneuriat, sport : nos invités sont chercheurs, chefs d'entreprise, journalistes, figures publiques ou acteurs du changement. Chaque conférence est pensée pour faire réfléchir et pour laisser la salle échanger avec eux.\n\nChaque année, environ 14 conférences et plusieurs tables rondes, gratuites et ouvertes à tous : étudiants de GEM, Grenoblois et Pantinois."
  ],
  [
   "Éloquence",
   "eloquence-intro",
   "Plus qu'un exercice de style : un art, une discipline et un défi permanent. Convaincre, émouvoir, captiver une salle, ça se travaille avec nous."
  ],
  [
   "Éloquence",
   "eloquence-chez-nous",
   "Nos membres développent leur aisance à l'oral, leur argumentation et leur répartie grâce à des entraînements réguliers, des simulations de joutes oratoires et des formats variés, du plaidoyer au discours libre.\n\nPour nous, la prise de parole est une compétence essentielle, à l'école comme dans la vie professionnelle."
  ],
  [
   "TEDx",
   "tedx-intro",
   "Le grand rendez-vous de fin d'année organisé par GEM en Débat : des speakers, des idées, une scène."
  ],
  [
   "TEDx",
   "tedx-presentation",
   "TED, ce sont des conférences courtes autour d'« idées qui valent la peine d'être partagées ». Les événements TEDx sont organisés localement et de façon indépendante, sous licence TED.\n\nChez GEM en Débat, le TEDx clôture l'année : plusieurs speakers se succèdent sur scène, chacun avec une idée à défendre."
  ],
  [
   "La Quinzaine",
   "quinzaine-intro",
   "Le journal de GEM en Débat. Chaque mois, 300 à 500 exemplaires, devenus une vraie institution à l'école."
  ],
  [
   "La Quinzaine",
   "quinzaine-redaction",
   "La Quinzaine est écrite par le pôle Rédaction, en toute liberté éditoriale. Chaque mois, des sujets variés et surprenants : la montagne, les gangsters, la ville de Grenoble… sans perdre de vue l'actualité et la vie étudiante.\n\nRecherche d'idées, écriture, relecture, mise en page : le journal vise un résultat professionnel et prépare ses rédacteurs au monde du journalisme.\n\nPour ses lecteurs, c'est une pause stimulante pour découvrir de nouveaux sujets, tout en restant connecté à la vie de GEM. La Quinzaine est réservée aux étudiants de GEM."
  ],
  [
   "Podcasts",
   "podcasts-intro",
   "Des parcours inspirants et des invités qui font débat, en version longue, à écouter partout."
  ],
  [
   "GED Paris",
   "paris-intro",
   "Depuis septembre 2025, GEM en Débat a son antenne sur le nouveau campus de GEM à Pantin."
  ],
  [
   "GED Paris",
   "paris-accroche",
   "Une douzaine de membres, et déjà un acteur majeur de la vie associative du campus de Pantin."
  ],
  [
   "GED Paris",
   "paris-texte",
   "L'antenne parisienne organise des conférences et des tables rondes sur l'actualité, comme à Grenoble. Mais elle invente aussi ses propres formats, plus interactifs et plus immersifs, pour favoriser l'échange direct entre étudiants et intervenants."
  ],
  [
   "Qui sommes-nous",
   "qui-intro",
   "La tribune étudiante de Grenoble École de Management, depuis 2006. À Grenoble et à Pantin."
  ],
  [
   "Qui sommes-nous",
   "qui-accroche",
   "On invite des personnalités qui font l'actualité. Et on laisse la salle leur répondre."
  ],
  [
   "Qui sommes-nous",
   "qui-mission",
   "GEM en Débat fait vivre le débat à Grenoble École de Management. On encourage les étudiants à élargir leurs horizons intellectuels, politiques et artistiques, à confronter leurs idées à celles des intervenants et des autres élèves, et à partager leurs lectures, leurs convictions et leurs réflexions, dans la bienveillance et le respect.\n\nNos conférences sont gratuites et ouvertes à tous, à Grenoble comme à Pantin."
  ],
  [
   "Qui sommes-nous",
   "partenaire-accroche",
   "Soutenez l'art du débat."
  ],
  [
   "Qui sommes-nous",
   "partenaire-texte",
   "En devenant partenaire, vous faites vivre des conférences de qualité, vous aidez à former les orateurs de demain et vous encouragez l'engagement intellectuel des étudiants. Entreprise, institution ou acteur engagé : votre soutien nous permet d'organiser des conférences, des débats et des concours d'éloquence toujours plus ambitieux."
  ],
  [
   "Qui sommes-nous",
   "contact-texte",
   "Une idée d'invité, une question, envie de monter sur scène au TEDx ? Écrivez-nous ou suivez-nous."
  ]
 ]
};

// aide affichée au survol des titres de colonnes
const AIDE = {
  "Masquer": "Cocher pour cacher cette ligne du site sans l'effacer.",
  "À la une": "Cocher pour afficher cet événement en premier sur la page d'accueil, avant le scroll.",
  "Type": "Choisit la couleur et la page où l'événement apparaît (Conférence, TEDx, Éloquence…).",
  "Description": "Facultatif. Une ligne vide crée un nouveau paragraphe.",
  "Date": "Double-cliquer pour choisir la date dans le calendrier.",
  "Heure": "Heure de début, par ex. 18:00.",
  "Lieu": "Mettre « Pantin » dans le lieu pour que l'événement apparaisse aussi sur la page GED Paris.",
  "Lien HelloAsso": "Le lien de l'événement sur HelloAsso. Vide = « Inscriptions bientôt ».",
  "Affiche": "Lien de l'image dans le dossier Drive « GEM en Débat — Images du site » (clic droit → Partager → Copier le lien).",
  "Replay ou photos": "Après l'événement : lien du replay YouTube ou de l'album photos.",
  "Texte": "Le texte affiché sur le site.",
  "Lien": "Facultatif : la page ouverte quand on clique sur l'annonce.",
  "Photo": "Lien de la photo dans le dossier Drive « Images du site ». Vide = initiales.",
  "Logo": "Lien du logo dans le dossier Drive « Images du site ».",
  "Couverture": "Lien de l'image de la une dans le dossier Drive « Images du site ».",
  "Lien du PDF": "Lien du PDF du numéro (dans le Drive, partagé à tous ceux qui ont le lien).",
  "Clé (ne pas modifier)": "Repère utilisé par le site. Ne pas modifier.",
};

const LARGEURS = {
  "Masquer": 80, "À la une": 80, "Type": 120, "Titre": 280, "Description": 320, "Date": 110, "Heure": 70,
  "Lieu": 220, "Intervenants": 260, "Lien HelloAsso": 260, "Affiche": 200, "Replay ou photos": 200,
  "Texte": 520, "Lien": 220, "Texte du bouton": 160, "Nom": 220, "Rôle": 220, "Photo": 220, "Logo": 220,
  "Site web": 220, "Numéro": 80, "Lien du PDF": 240, "Couverture": 220, "Page": 140, "Clé (ne pas modifier)": 190,
};

function creerSite() {
  const ss = SpreadsheetApp.create("GEM en Débat — Contenu du site");
  ss.setSpreadsheetLocale("fr_FR");
  ss.setSpreadsheetTimeZone("Europe/Paris");

  Object.keys(DONNEES).forEach((nom, i) => {
    const rows = DONNEES[nom];
    const head = rows[0];
    const sh = i === 0 ? ss.getSheets()[0].setName(nom) : ss.insertSheet(nom);
    const n = Math.max(rows.length, 300);   // de la place pour les nouvelles lignes
    const col = h => head.indexOf(h) + 1;

    // les colonnes en texte, sauf les dates : ce qu'on tape s'affiche tel quel sur le site
    const texte = h => !["Masquer", "À la une"].includes(h) && !(h === "Date" && nom === "Événements");
    head.forEach((h, c) => { if (texte(h)) sh.getRange(2, c + 1, n).setNumberFormat("@"); });
    if (col("Date") && nom === "Événements") sh.getRange(2, col("Date"), n).setNumberFormat("dd/mm/yyyy")
      .setDataValidation(SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false)
        .setHelpText("Une date, par ex. 12/11/2026 (double-clic pour le calendrier).").build());

    // les valeurs
    const values = rows.slice(1).map(r => r.map((v, c) => {
      if (head[c] === "Masquer" || head[c] === "À la une") return v === "TRUE";
      if (head[c] === "Date" && nom === "Événements") { const [j, m, a] = v.split("/"); return new Date(+a, m - 1, +j); }
      return v;
    }));
    sh.getRange(1, 1, 1, head.length).setValues([head]);
    if (values.length) sh.getRange(2, 1, values.length, head.length).setValues(values);

    // cases à cocher et liste des types
    ["Masquer", "À la une"].forEach(h => { if (col(h)) sh.getRange(2, col(h), n).insertCheckboxes(); });
    if (col("Type")) sh.getRange(2, col("Type"), n).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(TYPES, true).setAllowInvalid(false).build());

    // mise en forme
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, head.length).setFontWeight("bold").setBackground("#16151d").setFontColor("#ffffff").setVerticalAlignment("middle");
    sh.setRowHeight(1, 32);
    sh.getRange(2, 1, n, head.length).setVerticalAlignment("top").setWrap(true);
    head.forEach((h, c) => {
      sh.setColumnWidth(c + 1, LARGEURS[h] || 160);
      if (AIDE[h]) sh.getRange(1, c + 1).setNote(AIDE[h]);
    });
    if (nom === "Textes") {
      sh.getRange(2, 1, n, 2).setBackground("#f1f1f4").setFontColor("#6b6b78");
      sh.getRange(1, 1, n + 1, 2).protect().setDescription("Repères du site").setWarningOnly(true);
    }
  });

  // le site doit pouvoir lire le Sheet
  const file = DriveApp.getFileById(ss.getId());
  // le dossier des images, visible par tous ceux qui ont le lien (les images qu'on y met le sont aussi)
  const folder = DriveApp.createFolder("GEM en Débat — Images du site");
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {
    Logger.log("⚠️ Partage public refusé par ce compte Google. Partager le Sheet et le dossier à la main : Partager → Accès général → Tous les utilisateurs disposant du lien.");
  }

  Logger.log("✅ Sheet créé : " + ss.getUrl());
  Logger.log("👉 SHEET_ID à coller dans assets/contenu.js : " + ss.getId());
  Logger.log("🖼️ Dossier des images : " + folder.getUrl());
}

// À lancer si une image ajoutée au dossier ne s'affiche pas sur le site : rend publiques toutes les images du dossier
function rendreImagesPubliques() {
  const folders = DriveApp.getFoldersByName("GEM en Débat — Images du site");
  while (folders.hasNext()) {
    const files = folders.next().getFiles();
    while (files.hasNext()) files.next().setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }
  Logger.log("✅ Images partagées.");
}
