/* =========================================================
   GEM en Débat — les événements (partagé par toutes les pages)

   Les membres de l'asso ajoutent les événements avec le Google Form.
   Les réponses arrivent dans un Google Sheet, que le site lit ici.
   Coller ci-dessous le lien « Publier sur le Web » du Sheet, au format CSV
   (voir GUIDE-evenements.md).
   ========================================================= */
const SHEET_CSV = "";

/* Événements de secours, utilisés tant que SHEET_CSV est vide
   ou si le Sheet ne répond pas.
   date : "AAAA-MM-JJTHH:MM" (heure de Grenoble) */
const EVENEMENTS = [
  {
    type: "Conférence",
    titre: "Sport et handicap",
    date: "2026-10-07T17:00",
    lieu: "Auditorium Jean-François Fiorina, GEM",
    intervenants: "nos invités",
    inscription: "https://www.helloasso.com/associations/gem-en-debat/evenements/conference-sport-et-handicap",
  },
  {
    type: "Conférence",
    titre: "Entreprendre, échouer et se relever",
    date: "2026-10-29T17:00",
    lieu: "Auditorium GEM, Grenoble",
    intervenants: "Joël Manly (Banque de France Isère) et Patrice Canac (60 000 rebonds)",
    inscription: "",
  },
  // ↓ Prochaines conférences (dates en cours de calage : horaires, lieux et liens HelloAsso à compléter)
  {
    type: "Conférence",
    titre: "La fabrique des nouveaux masculinistes",
    date: "2026-11-12T18:00",
    lieu: "GEM, Grenoble",
    intervenants: "intervenants à annoncer",
    inscription: "",
  },
  {
    type: "Conférence",
    titre: "Rencontre avec François Hollande",
    date: "2026-11-16T18:00",
    lieu: "GEM, Grenoble",
    intervenants: "François Hollande",
    inscription: "",
  },
  {
    type: "Conférence",
    titre: "L'art, une entreprise comme les autres ?",
    date: "2026-11-17T18:00",
    lieu: "GEM, Grenoble",
    intervenants: "intervenants à annoncer",
    inscription: "",
  },
  {
    type: "Conférence",
    titre: "Pour en finir avec la méritocratie",
    date: "2026-11-23T18:00",
    lieu: "GEM, Grenoble",
    intervenants: "intervenants à annoncer",
    inscription: "",
  },
  {
    type: "Conférence",
    titre: "CIC et immobilier",
    date: "2026-11-24T18:00",
    lieu: "GEM, Grenoble",
    intervenants: "le CIC",
    inscription: "",
  },
  {
    type: "Conférence",
    titre: "Et si on bifurquait ?",
    date: "2026-12-02T18:00",
    lieu: "GEM, Grenoble",
    intervenants: "intervenants à annoncer",
    inscription: "",
  },
  {
    type: "Conférence",
    titre: "Rencontre politique (7-8 décembre)",
    date: "2026-12-07T18:00",
    lieu: "GEM, Grenoble",
    intervenants: "intervenants à annoncer",
    inscription: "",
  },
];

/* couleur de chaque type d'événement : [fond, texte] */
const TYPES = {
  "Conférence": ["#004bff", "#ffffff"],
  "TEDx":       ["#e62b1e", "#ffffff"],
  "Éloquence":  ["#ebf155", "#16151d"],
  "Podcast":    ["#7a1d4f", "#ffb3d1"],
  "Café-débat": ["#003649", "#8fd0e8"],
  "Autre":      ["#16151d", "#ffffff"],
};

(() => {
  const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])).replace(/ ([?!:;»])/g, " $1");
  const pad = n => String(n).padStart(2, "0");
  const hour = d => `${d.getHours()}h${d.getMinutes() ? pad(d.getMinutes()) : ""}`;
  const day = d => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  // l'intervenant, s'il est connu et pas déjà dans le titre
  const who = e => {
    const i = (e.intervenants || "").trim();
    return !i || /à annoncer/i.test(i) || e.titre.includes(i) ? "" : i;
  };
  const fmtLong = d => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} · ${hour(d)}`;
  const colors = type => TYPES[type] || TYPES["Autre"];

  /* ---------- Lecture du Google Sheet ---------- */
  // petit lecteur CSV (gère les guillemets et les retours à la ligne dans les cellules)
  function parseCSV(text) {
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) {
        if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') q = false;
        else cell += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += ch;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(r => r.some(c => c.trim()));
  }
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  // "19/11/2026" ou "2026-11-19", et "18:00" ou "18:00:00"
  function toISO(d, t) {
    d = (d || "").trim(); t = (t || "").trim() || "18:00";
    let y, m, j;
    if (/^\d{4}-\d{1,2}-\d{1,2}/.test(d)) [y, m, j] = d.split(/[-T ]/);
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(d)) [j, m, y] = d.split(/[\/ ]/);
    else return null;
    const [h = "18", mi = "00"] = t.split(":");
    return `${y}-${pad(+m)}-${pad(+j)}T${pad(+h)}:${pad(+mi)}`;
  }
  // lien Google Drive de l'affiche → image affichable
  function posterURL(v) {
    v = (v || "").split(/[,\s]+/).find(Boolean) || "";
    const id = (v.match(/[?&]id=([\w-]+)/) || v.match(/\/d\/([\w-]+)/) || [])[1];
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w800` : v;
  }
  function fromSheet(text) {
    const [head, ...rows] = parseCSV(text);
    const H = head.map(norm);
    const col = (...keys) => H.findIndex(h => keys.some(k => h.includes(k)));
    const c = {
      type: col("type"), titre: col("titre"), date: H.findIndex(h => h.startsWith("date")), heure: col("heure"),
      lieu: col("lieu"), qui: col("intervenant"), lien: col("helloasso", "inscription"), affiche: col("affiche"),
    };
    const get = (r, i) => (i >= 0 ? (r[i] || "").trim() : "");
    return rows.map(r => ({
      type: get(r, c.type) || "Conférence",
      titre: get(r, c.titre),
      date: toISO(get(r, c.date), get(r, c.heure)),
      lieu: get(r, c.lieu),
      intervenants: get(r, c.qui),
      inscription: get(r, c.lien),
      affiche: posterURL(get(r, c.affiche)),
    })).filter(e => e.titre && e.date);
  }

  let events = [];
  // Renvoie tous les événements, triés par date, avec { when, id, past }
  async function load() {
    let list = EVENEMENTS;
    if (SHEET_CSV) {
      try {
        const r = await fetch(SHEET_CSV + (SHEET_CSV.includes("?") ? "&" : "?") + "t=" + Date.now());
        if (!r.ok) throw new Error(r.status);
        const fromS = fromSheet(await r.text());
        if (fromS.length) list = fromS;
      } catch (err) {
        console.warn("Sheet des événements indisponible, événements de secours utilisés.", err);
      }
    }
    const now = Date.now();
    events = list.map((e, i) => ({ ...e, id: i, when: new Date(e.date) }))
      .filter(e => !isNaN(e.when)).sort((a, b) => a.when - b.when)
      // un événement reste "à venir" jusqu'à 3 h après son début
      .map(e => ({ ...e, past: e.when.getTime() + 3 * 3600e3 <= now }));
    return events;
  }

  /* ---------- Liste d'événements (pages Conférences, Éloquence, TEDx) ---------- */
  function rows(list, empty = "Les prochaines dates arrivent très bientôt.") {
    if (!list.length) return `<p class="ev-empty">${esc(empty)}</p>`;
    return `<ul class="ev-rows">${list.map(e => {
      const [c, fg] = colors(e.type);
      return `
      <li class="ev-row" style="--c:${c};--fg:${fg}">
        <div class="ev-poster">${e.affiche ? `<img src="${esc(e.affiche)}" alt="Affiche — ${esc(e.titre)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}<svg viewBox="0 0 300 140" aria-hidden="true"><use href="#logo"/></svg></div>
        <div class="ev-date"><b>${day(e.when)}</b><span>${DAYS[e.when.getDay()]} · ${hour(e.when)}</span></div>
        <div class="ev-main">
          <span class="ev-type"><i></i>${esc(e.type)}</span>
          <h3>${esc(e.titre)}</h3>
          ${who(e) ? `<p class="ev-who">Avec ${esc(who(e))}</p>` : ""}
          <p>${esc(e.lieu)}</p>
        </div>
        <div class="ev-act">${e.inscription
          ? `<a class="btn" href="${esc(e.inscription)}" data-reg="${e.id}">S'inscrire gratuitement <span>→</span></a>`
          : `<span class="btn off">Inscriptions bientôt</span>`}</div>
      </li>`;
    }).join("")}</ul>`;
  }

  // Cartes des événements passés
  function cards(list, empty = "Les archives de la saison apparaîtront ici.") {
    if (!list.length) return `<p class="ev-empty">${esc(empty)}</p>`;
    return `<div class="ev-cards">${list.map(e => {
      const [c, fg] = colors(e.type);
      return `
      <article class="ev-card" style="--c:${c};--fg:${fg}">
        <div class="ev-card-img">${e.affiche ? `<img src="${esc(e.affiche)}" alt="Affiche — ${esc(e.titre)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}<svg viewBox="0 0 300 140" aria-hidden="true"><use href="#logo"/></svg></div>
        <span class="ev-card-d">${e.when.getDate()} ${MONTHS[e.when.getMonth()]} ${e.when.getFullYear()}</span>
        <h3>${esc(e.titre)}</h3>
        ${e.intervenants ? `<p>Avec ${esc(e.intervenants)}</p>` : ""}
      </article>`;
    }).join("")}</div>`;
  }

  /* ---------- Inscription HelloAsso (fenêtre) ---------- */
  document.body.insertAdjacentHTML("beforeend", `
    <dialog id="reg" class="reg" aria-labelledby="m-title">
      <div class="m-head">
        <small>Inscription gratuite · via HelloAsso</small>
        <h3 id="m-title"></h3>
        <div class="m-when" id="m-when"></div>
        <button class="close" type="button" aria-label="Fermer" data-close>×</button>
      </div>
      <div class="ha"><div class="loading">Chargement…</div><iframe id="ha-frame" title="Inscription HelloAsso" allow="payment"></iframe></div>
      <div class="m-foot"><button type="button" id="ics">+ Ajouter à mon agenda</button><a id="ha-link" target="_blank" rel="noopener">Ouvrir sur HelloAsso ↗</a></div>
    </dialog>`);
  const $ = s => document.querySelector(s);
  const dlg = $("#reg"), frame = $("#ha-frame");
  let current = null;

  function openReg(ev) {
    current = ev;
    const url = ev.inscription.replace(/\/+$/, "");
    $("#m-title").textContent = ev.titre;
    $("#m-when").textContent = `${ev.type} · ${fmtLong(ev.when)} — ${ev.lieu}`;
    $("#ha-link").href = url;
    frame.parentNode.classList.remove("ready");
    frame.src = url + "/widget";
    dlg.showModal();
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-reg]");
    // Sur petit écran, on laisse le lien ouvrir directement HelloAsso
    if (b && innerWidth > 640) {
      const ev = events.find(x => x.id === +b.dataset.reg);
      if (ev) { e.preventDefault(); openReg(ev); }
    }
    if (e.target.closest("[data-close]")) dlg.close();
  });
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { frame.src = "about:blank"; });
  frame.addEventListener("load", () => { if (frame.src !== "about:blank") frame.parentNode.classList.add("ready"); });
  $("#ics").addEventListener("click", () => {
    const ev = current;
    const stamp = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const end = new Date(ev.when.getTime() + 2 * 3600e3);
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GEM en Debat//FR", "BEGIN:VEVENT",
      `UID:${ev.date}-gemendebat`, `DTSTART:${stamp(ev.when)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:GEM en Débat — ${ev.titre}`, `LOCATION:${ev.lieu}`, `DESCRIPTION:Avec ${ev.intervenants}`,
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "gem-en-debat.ics"; a.click();
  });

  window.GEM = { load, rows, cards, colors, esc, pad, hour, fmtLong, MONTHS, DAYS, day, who };
})();
