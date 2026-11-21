/* =========================================================
   GEM en Débat — les événements (partagé par toutes les pages)
   Ils viennent de l'onglet « Événements » du Google Sheet (voir assets/contenu.js).
   ========================================================= */

/* couleur de chaque type d'événement : [fond, texte] */
const TYPES = {
  "Conférence": ["#f2f1ed", "#111111"],
  "TEDx":       ["#e1251b", "#ffffff"],
  "Éloquence":  ["#6f8fff", "#111111"],
  "Podcast":    ["#2a2a2a", "#f2f1ed"],
  "Café-débat": ["#2a2a2a", "#f2f1ed"],
  "Autre":      ["#f2f1ed", "#111111"],
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

  /* ---------- Lecture de l'onglet Événements ---------- */
  // "19/11/2026" ou "2026-11-19", et "18:00" ou "18:00:00"
  function toISO(d, t) {
    d = (d || "").trim(); t = (t || "").trim() || "18:00";
    let y, m, j;
    if (/^\d{4}-\d{1,2}-\d{1,2}/.test(d)) [y, m, j] = d.split(/[-T ]/);
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(d)) [j, m, y] = d.split(/[\/ ]/);
    else return null;
    const [h = "18", mi = "00"] = (t.match(/\d{1,2}[:h]\d{2}|\d{1,2}/) || ["18"])[0].split(/[:h]/);
    return `${y}-${pad(+m)}-${pad(+j)}T${pad(+h)}:${pad(+mi || 0)}`;
  }

  let events = [];
  // Renvoie tous les événements, triés par date, avec { when, id, past }
  async function load() {
    const { tab, get, yes, image } = CONTENU;
    const list = (await tab("Événements")).map(r => ({
      type: get(r, "type") || "Conférence",
      titre: get(r, "titre"),
      description: get(r, "description"),
      date: toISO(get(r, "date"), get(r, "heure")),
      lieu: get(r, "lieu"),
      intervenants: get(r, "intervenant"),
      inscription: get(r, "helloasso", "inscription"),
      affiche: image(get(r, "affiche"), 800),
      apres: get(r, "replay", "photos"),
      une: yes(get(r, "a la une")),
    })).filter(e => e.titre && e.date);
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
          ${e.description ? `<div class="ev-desc">${CONTENU.paras(e.description)}</div>` : ""}
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
        ${who(e) ? `<p>Avec ${esc(who(e))}</p>` : ""}
        ${e.apres ? `<a class="ev-card-go" href="${esc(e.apres)}" target="_blank" rel="noopener">Replay et photos <span>→</span></a>` : ""}
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
