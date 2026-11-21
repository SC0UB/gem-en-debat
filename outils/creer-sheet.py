"""Construit le fichier Excel du Sheet « GEM en Débat — Contenu du site » à partir du dossier contenu/.
Le fichier s'importe dans Google Drive, qui le convertit en Google Sheet.

    uv run --no-project --with openpyxl python outils/creer-sheet.py contenu-site.xlsx
"""
import csv, sys, datetime
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.comments import Comment
from openpyxl.worksheet.datavalidation import DataValidation

ROOT = Path(__file__).resolve().parent.parent
TABS = [("Événements", "evenements"), ("Annonce", "annonce"), ("Équipe", "equipe"), ("Partenaires", "partenaires"),
        ("Quinzaine", "quinzaine"), ("Photos d'équipe", "photos-equipe"), ("Photos", "photos"), ("Textes", "textes")]
TYPES = ["Conférence", "TEDx", "Éloquence", "Podcast", "Café-débat", "Autre"]
PAGES = ["Conférences", "Éloquence", "TEDx", "La Quinzaine", "Actu & Débats", "GED Paris"]
IMAGES = "dans le dossier Drive « GEM en Débat — Images du site » (clic droit → Partager → Copier le lien)."

# aide affichée au survol des titres de colonnes : (onglet, colonne) puis colonne seule
AIDE = {
    "Masquer": "Choisir « oui » pour cacher cette ligne du site sans l'effacer.",
    "À la une": "Choisir « oui » pour afficher cet événement en premier sur la page d'accueil.",
    "Type": "Choisit la couleur et la page où l'événement apparaît.",
    "Description": "Facultatif. Une ligne vide crée un nouveau paragraphe.",
    ("Équipe", "Description"): "Facultatif : quelques mots sur la personne.",
    "Date": "Une date, par ex. 12/11/2026 (double-clic pour le calendrier).",
    "Heure": "Heure de début, par ex. 18:00.",
    "Lieu": "Mettre « Pantin » dans le lieu pour que l'événement apparaisse aussi sur la page GED Paris.",
    "Lien HelloAsso": "Le lien de l'événement sur HelloAsso. Vide = « Inscriptions bientôt ».",
    "Affiche": "Lien de l'affiche " + IMAGES,
    "Replay ou photos": "Après l'événement : lien du replay YouTube ou de l'album photos.",
    "Lien": "Facultatif : la page ouverte quand on clique sur l'annonce.",
    "Photo": "Lien de la photo " + IMAGES,
    ("Équipe", "Photo"): "Lien de la photo " + IMAGES + " Vide = initiales.",
    "Logo": "Lien du logo " + IMAGES,
    "Couverture": "Lien de l'image de la une " + IMAGES,
    "Lien du PDF": "Lien du PDF du numéro (partagé à tous ceux qui ont le lien).",
    "Page": "La page du site où la photo apparaît, dans la section « En images ».",
    ("Textes", "Page"): "La page du site où se trouve ce texte.",
    ("Textes", "Clé (ne pas modifier)"): "Repère utilisé par le site. Ne pas modifier. Les clés qui finissent par « -lien » sont l'adresse d'un bouton.",
    ("Textes", "Texte"): "Le texte affiché sur le site. Une ligne vide = un nouveau paragraphe. Pour un lien : [texte](adresse).",
    "Légende": "Facultatif : le texte sous la photo.",
    ("Photos d'équipe", "Photo"): "Photo de groupe, affichée sur la page Qui sommes-nous (« L'équipe en images »). Lien de la photo " + IMAGES,
    "Clé (ne pas modifier)": "Repère utilisé par le site. Ne pas modifier.",
}
LARG = {"Masquer": 10, "À la une": 10, "Type": 14, "Titre": 38, "Description": 44, "Date": 13, "Heure": 9,
        "Lieu": 30, "Intervenants": 36, "Lien HelloAsso": 36, "Affiche": 28, "Replay ou photos": 28,
        "Texte": 80, "Lien": 30, "Texte du bouton": 20, "Nom": 30, "Rôle": 30, "Photo": 40, "Logo": 30,
        "Site web": 30, "Numéro": 10, "Lien du PDF": 32, "Couverture": 30, "Page": 18, "Légende": 40,
        "Clé (ne pas modifier)": 30}
N = 300  # lignes prêtes à remplir
OUI = ("Masquer", "À la une")


def build(out):
    wb = Workbook(); wb.remove(wb.active)
    for name, f in TABS:
        rows = list(csv.reader(open(ROOT / "contenu" / f"{f}.csv", encoding="utf-8")))
        head = rows[0]
        ws = wb.create_sheet(name)
        ws.append(head)
        for r in rows[1:]:
            vals = []
            for h, v in zip(head, r):
                if h in OUI:
                    vals.append("oui" if v in ("TRUE", "oui") else None)
                elif h == "Date" and name == "Événements" and v:
                    j, m, a = v.split("/"); vals.append(datetime.date(int(a), int(m), int(j)))
                else:
                    vals.append(v or None)
            ws.append(vals)
        for c, h in enumerate(head, 1):
            cell = ws.cell(1, c)
            cell.font = Font(bold=True, color="FFFFFF"); cell.fill = PatternFill("solid", fgColor="16151D")
            cell.alignment = Alignment(vertical="center")
            note = AIDE.get((name, h), AIDE.get(h))
            if note: cell.comment = Comment(note, "GEM en Débat")
            ws.column_dimensions[cell.column_letter].width = LARG.get(h, 20)
            col = cell.column_letter
            date = h == "Date" and name == "Événements"
            for row in range(2, N + 2):
                x = ws[f"{col}{row}"]
                x.alignment = Alignment(vertical="top", wrap_text=True)
                if date: x.number_format = "dd/mm/yyyy"
                elif h not in OUI: x.number_format = "@"
                if name == "Textes" and h != "Texte":
                    x.font = Font(color="6B6B78"); x.fill = PatternFill("solid", fgColor="F1F1F4")
            rng = f"{col}2:{col}{N + 1}"
            choix = (["oui"] if h in OUI else TYPES if h == "Type" else PAGES if h == "Page" and name == "Photos" else None)
            if choix:
                dv = DataValidation(type="list", formula1='"' + ",".join(choix) + '"', allow_blank=True)
                dv.add(rng); ws.add_data_validation(dv)
            if date:
                dv = DataValidation(type="date", operator="greaterThan", formula1="36526", allow_blank=True,
                                    showErrorMessage=True, error="Mettre une date, par ex. 12/11/2026.")
                dv.add(rng); ws.add_data_validation(dv)
        ws.freeze_panes = "A2"
        ws.row_dimensions[1].height = 24
    wb.save(out)


if __name__ == "__main__":
    build(sys.argv[1])
    print("ok")
