/* =========================================================
   GEM en Débat — le contenu du site (partagé par toutes les pages)

   Tout le contenu vient du Google Sheet « GEM en Débat — Contenu du site » :
   événements, annonce, équipe, partenaires, numéros de la Quinzaine et textes.
   SHEET_ID : l'identifiant du Sheet, la partie entre /d/ et /edit dans son adresse.
   Tant qu'il est vide, ou si Google ne répond pas, le site lit les copies
   du dossier contenu/ (une par onglet).
   ========================================================= */
const SHEET_ID = "1THPYbx_VVEasc8qlWT7rW4HWj_nZ177tpstfyT_K0Q4";

(() => {
  // onglet du Sheet → copie de secours dans contenu/
  const ONGLETS = {
    "Événements": "evenements", "Annonce": "annonce", "Équipe": "equipe",
    "Partenaires": "partenaires", "Quinzaine": "quinzaine", "Photos d'équipe": "photos-equipe", "Photos": "photos", "Textes": "textes",
  };

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])).replace(/ ([?!:;»])/g, " $1");
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

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
  // une ligne par objet, indexé par le nom de colonne (en minuscules, sans accents)
  function table(text) {
    const [head = [], ...rows] = parseCSV(text);
    const H = head.map(norm);
    return rows.map(r => Object.fromEntries(H.map((h, i) => [h, (r[i] || "").trim()])));
  }

  const cache = {};
  // Renvoie les lignes d'un onglet (sans les lignes « Masquer » cochées)
  function tab(name) {
    return cache[name] ??= (async () => {
      let rows = null;
      if (SHEET_ID) {
        try {
          const r = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(name)}&t=${Date.now()}`);
          if (!r.ok) throw new Error(r.status);
          rows = table(await r.text());
        } catch (err) {
          console.warn(`Onglet « ${name} » du Sheet indisponible, copie de secours utilisée.`, err);
        }
      }
      if (!rows) {
        const r = await fetch(`contenu/${ONGLETS[name]}.csv`);
        rows = r.ok ? table(await r.text()) : [];
      }
      return rows.filter(row => !yes(get(row, "masquer")));
    })().catch(err => { console.warn(err); return []; });
  }

  // valeur de la colonne nommée key (nom exact d'abord, puis qui commence par, puis qui contient)
  function get(row, ...keys) {
    const H = Object.keys(row);
    for (const k of keys.map(norm)) {
      const h = H.find(h => h === k) || H.find(h => h.startsWith(k)) || H.find(h => h.includes(k));
      if (h && row[h]) return row[h];
    }
    return "";
  }
  const yes = v => /^(true|vrai|oui|x|1)$/i.test((v || "").trim());

  // un lien Google Drive → une image affichable (le fichier doit être partagé « tous les utilisateurs disposant du lien »)
  function image(v, size = 1000) {
    v = (v || "").split(/[,\s]+/).find(Boolean) || "";
    const id = /drive\.google|docs\.google/.test(v) && (v.match(/[?&]id=([\w-]+)/) || v.match(/\/d\/([\w-]+)/) || [])[1];
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${size}` : v;
  }

  // texte du Sheet → HTML (une ligne vide = un nouveau paragraphe, [texte](lien) = un lien)
  const lines = t => esc(t).replace(/\n/g, "<br>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, url) => `<a href="${url}"${/^https?:/.test(url) ? ' target="_blank" rel="noopener"' : ""}>${txt}</a>`);
  const paras = t => t.split(/\n\s*\n/).map(p => `<p>${lines(p.trim())}</p>`).join("");

  /* ---------- Les textes des pages (onglet Textes) ---------- */
  const marked = document.querySelectorAll("[data-texte]"), linked = document.querySelectorAll("[data-lien], [data-image]");
  if (marked.length || linked.length) tab("Textes").then(rows => {
    const T = Object.fromEntries(rows.map(r => [get(r, "cle"), get(r, "texte")]));
    marked.forEach(el => {
      const v = T[el.dataset.texte];
      if (v) el.innerHTML = el.tagName === "DIV" ? paras(v) : lines(v);
    });
    // l'image du haut de chaque page (à la place du fond de couleur)
    document.querySelectorAll("[data-image]").forEach(el => {
      const v = image(T[el.dataset.image] || "", 2000);
      if (v) { el.style.setProperty("--img", `url("${new URL(v, location.href).href.replace(/"/g, "%22")}")`); el.classList.add("has-image"); }
    });
    // les liens des boutons (une adresse e-mail seule devient un lien « écrire à »)
    linked.forEach(el => {
      const v = (T[el.dataset.lien] || "").trim();
      if (v) el.href = /^[^\s:/]+@[^\s/]+$/.test(v) ? "mailto:" + v : v;
    });
  });

  /* ---------- Le bandeau d'annonce (onglet Annonce) ---------- */
  tab("Annonce").then(rows => {
    const a = rows.find(r => get(r, "texte"));
    if (!a) return;
    const link = get(a, "lien"), btn = get(a, "texte du bouton") || "En savoir plus";
    const inner = `<i></i><span>${esc(get(a, "texte"))}</span>${link ? `<b>${esc(btn)} <span>→</span></b>` : ""}`;
    const html = link ? `<a class="annonce" href="${esc(link)}">${inner}</a>` : `<div class="annonce">${inner}</div>`;
    const home = document.querySelector(".i-head");
    if (home) home.insertAdjacentHTML("afterbegin", html);
    else document.querySelector("[data-site-header]")?.insertAdjacentHTML("afterend", html);
  });

  /* ---------- Les galeries de photos ----------
     data-photos="Page" : les lignes de l'onglet Photos pour cette page
     data-onglet="Photos d'équipe" : toutes les lignes de cet onglet */
  document.querySelectorAll("[data-photos], [data-onglet]").forEach(sec => {
    tab(sec.dataset.onglet || "Photos").then(rows => {
      const mine = rows.filter(r => get(r, "photo") && (sec.dataset.onglet || norm(get(r, "page")) === norm(sec.dataset.photos)));
      if (!mine.length) return;
      sec.querySelector(".gallery").innerHTML = mine.map(r => {
        const src = image(get(r, "photo"), 1400), cap = get(r, "legende");
        return `<figure><a href="${esc(src)}" target="_blank" rel="noopener"><img src="${esc(src)}" alt="${esc(cap)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('figure').remove()"></a>${cap ? `<figcaption>${esc(cap)}</figcaption>` : ""}</figure>`;
      }).join("");
      sec.hidden = false;
    });
  });

  /* ---------- Les partenaires dans le pied de page ---------- */
  const foot = document.querySelector("[data-partenaires]");
  if (foot) tab("Partenaires").then(rows => {
    if (rows.length) foot.textContent = rows.map(r => get(r, "nom")).filter(Boolean).join(" · ");
  });

  window.CONTENU = { tab, get, yes, image, esc, lines, paras };
})();
