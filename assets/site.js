/* GEM en Débat — éléments communs à toutes les pages : logo, menu, pied de page.
   Le menu et le pied de page se modifient ici, une seule fois pour tout le site. */
(() => {
  const PAGES = [
    ["conferences.html", "Conférences"],
    ["eloquence.html", "Éloquence"],
    ["tedx.html", "TEDx"],
    ["la-quinzaine.html", "La Quinzaine"],
    ["podcasts.html", "Podcasts"],
    ["ged-paris.html", "GED Paris"],
    ["qui-sommes-nous.html", "Qui sommes-nous"],
  ];
  // nos réseaux (pied de page et page Qui sommes-nous)
  const SOCIAL = [
    ["Instagram", "https://www.instagram.com/gemendebat/"],
    ["LinkedIn", "https://www.linkedin.com/company/gem-en-d%C3%A9bat/"],
    ["YouTube", "https://www.youtube.com/@gemendebat"],
    ["TikTok", "https://www.tiktok.com/@gemendebat"],
    ["Newsletter", "https://forms.office.com/e/6Dq8nwca7X"],
  ];
  const here = location.pathname.split("/").pop() || "index.html";

  // Le logo (bulle GEM EN DEBAT), redessiné en vectoriel — réutilisé partout avec <use href="#logo">
  document.body.insertAdjacentHTML("afterbegin", `
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <symbol id="logo" viewBox="0 0 300 140">
        <path d="M16 22 L284 10 L288 96 L74 106 L34 132 L44 107 L20 108 Z" fill="none" stroke="currentColor" stroke-width="8" stroke-linejoin="miter"/>
        <text x="152" y="76" text-anchor="middle" transform="rotate(-2.4 152 62)" fill="currentColor" font-family="Archivo, sans-serif" font-weight="800" font-stretch="62%" font-size="46" letter-spacing="1">GEM EN DEBAT</text>
      </symbol>
    </svg>`);

  const header = document.querySelector("[data-site-header]");
  if (header) header.innerHTML = `
    <div class="sh">
      <a class="sh-logo" href="index.html" aria-label="GEM en Débat — accueil"><svg viewBox="0 0 300 140"><use href="#logo"/></svg></a>
      <nav class="sh-nav" aria-label="Navigation principale">
        ${PAGES.map(([href, label]) => `<a href="${href}"${href === here ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
      </nav>
    </div>`;

  const footer = document.querySelector("[data-site-footer]");
  if (footer) footer.innerHTML = `
    <div><h6>Nous trouver</h6>Grenoble École de Management<br>12 rue Pierre Sémard, Grenoble<br>et sur le campus de Pantin (Paris)</div>
    <div><h6>Nous suivre</h6><ul>${SOCIAL.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`).join("")}</ul></div>
    <div><h6>Ils nous soutiennent</h6><span data-partenaires>CIC Lyonnaise de Banque · Oresys · Grenoble École de Management · CIRFA</span><br><a href="qui-sommes-nous.html#partenaire">Devenir partenaire →</a></div>
    <div><h6>GEM en Débat</h6>© ${new Date().getFullYear()} — la tribune étudiante de GEM</div>`;
})();
