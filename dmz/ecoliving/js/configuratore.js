/* =========================================================
   Configuratore "Componi il tuo regalo"
   ========================================================= */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const form = $("#cfg");
  if (!form) return;

  const P = window.PRODUCTS;
  const euro = window.euro;
  const MAX = 3;
  const DISCOUNT = 0.15; // codice CASA15
  const FREE_SHIP = 49;
  const SHIP = 4.9;

  const FOR = {
    sorpresa: ["palline", "candela", "renna"],
    piccoli: ["renna", "palline", "candela"],
    cucina: ["pentole", "posate", "candela"],
    casa: ["ghirlanda", "palline", "candela"],
  };

  const INK = "#2a2622";
  const CREAM = "#fbf6ec";
  const PAPERS = {
    kraft: { name: "Kraft riciclata", base: "#cfa176", pat: "speck" },
    bosco: { name: "Verde bosco", base: "#2e6b4f", pat: "stars" },
    natale: { name: "Rosso Natale", base: "#d2333f", pat: "dots" },
    riso: { name: "Rosa riso", base: "#f4a3a0", pat: "stripes" },
  };
  const RIBBONS = {
    rosso: { name: "Rosso", c: "#d2333f" },
    senape: { name: "Senape", c: "#f3b740" },
    verde: { name: "Verde bosco", c: "#2e6b4f" },
    spago: { name: "Spago naturale", c: "#e9dcc0" },
  };

  const initial = () => ({ who: "sorpresa", budget: 60, items: [], paper: "kraft", ribbon: "rosso", to: "", from: "", msg: "", hidePrice: true });
  let state = initial();

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const round2 = (n) => Math.round(n * 100) / 100;

  /* ---------- costruzione controlli ---------- */
  $("#picks").innerHTML = P.map(
    (p) => `<label class="pick" data-id="${p.id}">
      <input type="checkbox" name="items" value="${p.id}">
      <span class="pick__img"><img src="${p.image}" alt="" loading="lazy" decoding="async" data-fallback="${p.art}"></span>
      <span class="pick__body"><b>${p.name}</b><span class="pick__meta">${p.unit}</span></span>
      <span class="pick__price">${euro(p.price)}</span>
      <span class="pick__tag"></span>
      <span class="pick__check" aria-hidden="true">✓</span>
    </label>`
  ).join("");

  const patternPreview = (key) => {
    const pp = PAPERS[key];
    const bg = {
      speck: `radial-gradient(${INK}40 1px, transparent 1.5px) 0 0/9px 9px`,
      stars: `radial-gradient(#f3b740 2.5px, transparent 3px) 0 0/14px 14px`,
      dots: `radial-gradient(${CREAM} 2.5px, transparent 3px) 0 0/12px 12px`,
      stripes: `repeating-linear-gradient(45deg, #e8673c 0 4px, transparent 4px 11px)`,
    }[pp.pat];
    return `background:${bg}, ${pp.base}`;
  };

  $("[data-group=paper]").innerHTML = Object.entries(PAPERS)
    .map(([k, v]) => `<label class="swatch"><input type="radio" name="paper" value="${k}" ${k === state.paper ? "checked" : ""}><span class="swatch__dot" style="${patternPreview(k)}"></span><span class="swatch__name">${v.name}</span></label>`)
    .join("");
  $("[data-group=ribbon]").innerHTML = Object.entries(RIBBONS)
    .map(([k, v]) => `<label class="swatch"><input type="radio" name="ribbon" value="${k}" ${k === state.ribbon ? "checked" : ""}><span class="swatch__dot swatch__dot--ribbon" style="--rb:${v.c}"></span><span class="swatch__name">${v.name}</span></label>`)
    .join("");

  /* ---------- calcoli ---------- */
  function totals() {
    const items = state.items.map(window.findProduct).filter(Boolean);
    const sub = items.reduce((s, p) => s + p.price, 0);
    const disc = round2(sub * DISCOUNT);
    const after = round2(sub - disc);
    const ship = !items.length || after >= FREE_SHIP ? 0 : SHIP;
    return { items, sub, disc, after, ship, total: round2(after + ship) };
  }

  /* ---------- anteprima del pacco (SVG) ---------- */
  function giftSVG(t) {
    const pp = PAPERS[state.paper];
    const rb = RIBBONS[state.ribbon];
    const n = t.items.length;
    const s = [0.8, 0.8, 0.9, 1][n];
    const rbStroke = state.ribbon === "spago" ? `stroke="${INK}" stroke-width="1.5"` : "";
    const pattern = {
      speck: `<pattern id="pp" width="23" height="19" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1.2" fill="${INK}" opacity=".3"/><circle cx="15" cy="13" r="1" fill="${INK}" opacity=".25"/><path d="M9 2 l6 3" stroke="${INK}" stroke-width=".8" opacity=".25"/></pattern>`,
      stars: `<pattern id="pp" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M10 4 L12 9 L17 9 L13 12 L15 17 L10 14 L5 17 L7 12 L3 9 L8 9Z" fill="#f3b740"/><circle cx="30" cy="30" r="2" fill="${CREAM}"/></pattern>`,
      dots: `<pattern id="pp" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="3" fill="${CREAM}"/></pattern>`,
      stripes: `<pattern id="pp" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="22" fill="#e8673c"/></pattern>`,
    }[pp.pat];

    const to = state.to.trim();
    const tag = to ? `Per ${esc(to.length > 12 ? to.slice(0, 11) + "…" : to)}` : "Per te";
    const label = n
      ? `Anteprima: pacco in carta ${pp.name.toLowerCase()} con nastro ${rb.name.toLowerCase()}, ${n} ${n === 1 ? "oggetto" : "oggetti"}`
      : "Anteprima: scatola ancora vuota";

    if (!n) {
      return `<svg viewBox="0 0 400 400" role="img" aria-label="${label}">
        <ellipse cx="200" cy="345" rx="140" ry="12" fill="${INK}" opacity=".12"/>
        <path d="M95 190 L200 230 L305 190 V330 L200 360 L95 330Z" fill="${CREAM}" stroke="${INK}" stroke-width="3" stroke-dasharray="10 8"/>
        <path d="M95 190 L200 150 L305 190 L200 230Z" fill="#ede1cc" stroke="${INK}" stroke-width="3" stroke-dasharray="10 8"/>
        <text x="200" y="295" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="20" fill="${INK}">La scatola è vuota</text>
        <text x="200" y="320" text-anchor="middle" font-family="DM Mono, monospace" font-size="12" fill="${INK}" opacity=".7">scegli almeno un oggetto</text>
      </svg>`;
    }

    return `<svg viewBox="0 0 400 400" role="img" aria-label="${label}">
      <defs>${pattern}</defs>
      <ellipse cx="200" cy="346" rx="${150 * s}" ry="13" fill="${INK}" opacity=".15"/>
      <g transform="translate(200 340) scale(${s}) translate(-200 -340)">
        <rect x="95" y="180" width="210" height="160" rx="6" fill="${pp.base}"/>
        <rect x="95" y="180" width="210" height="160" rx="6" fill="url(#pp)"/>
        <rect x="95" y="190" width="210" height="8" fill="${INK}" opacity=".15"/>
        <rect x="95" y="250" width="210" height="22" fill="${rb.c}" ${rbStroke}/>
        <rect x="189" y="180" width="22" height="160" fill="${rb.c}" ${rbStroke}/>
        <rect x="80" y="145" width="240" height="46" rx="6" fill="${pp.base}"/>
        <rect x="80" y="145" width="240" height="46" rx="6" fill="url(#pp)"/>
        <rect x="189" y="145" width="22" height="46" fill="${rb.c}" ${rbStroke}/>
        <g transform="translate(5 4)" fill="none" stroke="${INK}" stroke-width="3">
          <rect x="95" y="180" width="210" height="160" rx="6"/>
          <rect x="80" y="145" width="240" height="46" rx="6"/>
        </g>
        <path d="M200 146 C168 96 120 104 140 140 C150 152 180 150 200 146Z" fill="${rb.c}" ${rbStroke}/>
        <path d="M200 146 C232 96 280 104 260 140 C250 152 220 150 200 146Z" fill="${rb.c}" ${rbStroke}/>
        <path d="M194 150 L170 196 L184 192 L190 206 Z M206 150 L230 196 L216 192 L210 206Z" fill="${rb.c}" ${rbStroke}/>
        <circle cx="200" cy="146" r="13" fill="${rb.c}" stroke="${INK}" stroke-width="2.5"/>
        <g transform="translate(4 3)" fill="none" stroke="${INK}" stroke-width="2.5">
          <path d="M200 146 C168 96 120 104 140 140 C150 152 180 150 200 146Z"/>
          <path d="M200 146 C232 96 280 104 260 140 C250 152 220 150 200 146Z"/>
        </g>
        <path d="M208 150 C240 170 262 178 282 196" stroke="${INK}" stroke-width="2" fill="none"/>
        <g transform="rotate(-9 320 214)">
          <rect x="258" y="190" width="132" height="52" rx="6" fill="${CREAM}" stroke="${INK}" stroke-width="2.5"/>
          <circle cx="271" cy="203" r="4" fill="none" stroke="${INK}" stroke-width="2"/>
          <text x="328" y="222" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-weight="600" font-size="15" fill="${INK}">${tag}</text>
        </g>
      </g>
    </svg>`;
  }

  /* ---------- aggiornamento interfaccia ---------- */
  let lastCount = 0;
  function update() {
    const t = totals();
    const rec = FOR[state.who];

    // oggetti: ordine consigliato, limite, budget
    $$(".pick").forEach((el) => {
      const id = el.dataset.id;
      const p = window.findProduct(id);
      const input = $("input", el);
      const checked = state.items.includes(id);
      input.checked = checked;
      const recIdx = rec.indexOf(id);
      el.style.order = recIdx >= 0 ? recIdx : 10 + P.indexOf(p);
      const over = !checked && t.sub + p.price > state.budget;
      const full = !checked && state.items.length >= MAX;
      input.disabled = full;
      el.classList.toggle("is-on", checked);
      el.classList.toggle("is-over", over);
      el.classList.toggle("is-disabled", full);
      $(".pick__tag", el).textContent = over ? "Fuori budget" : recIdx >= 0 ? "Consigliato" : "";
    });
    $("#picked-count").textContent = `${state.items.length} di ${MAX} scelti`;

    // budget
    $("#budget-out").textContent = euro(state.budget);
    const pct = Math.min(100, (t.sub / state.budget) * 100);
    const meter = $("#meter");
    meter.style.transform = `scaleX(${(pct / 100).toFixed(3)})`;
    meter.classList.toggle("is-over", t.sub > state.budget);
    $("#budget-hint").textContent = !t.items.length
      ? `Hai ${euro(state.budget)} da spendere.`
      : t.sub > state.budget
        ? `Sei ${euro(round2(t.sub - state.budget))} sopra il budget (prima dello sconto).`
        : `Ti restano ${euro(round2(state.budget - t.sub))}.`;

    // anteprima
    const stage = $("#gift");
    stage.innerHTML = giftSVG(t);
    if (t.items.length !== lastCount) {
      stage.classList.remove("is-pop");
      void stage.offsetWidth;
      stage.classList.add("is-pop");
      lastCount = t.items.length;
    }

    // bigliettino
    const card = $("#gift-card");
    const hasNote = state.to.trim() || state.from.trim() || state.msg.trim();
    card.hidden = !hasNote;
    card.innerHTML = hasNote
      ? `${state.to.trim() ? `<b>${esc(state.to.trim())},</b>` : ""}
         ${state.msg.trim() ? `<p>${esc(state.msg.trim())}</p>` : ""}
         ${state.from.trim() ? `<span>— ${esc(state.from.trim())}</span>` : ""}`
      : "";
    $("#msg-count").textContent = `${state.msg.length}/140`;

    // riepilogo
    $("#sum-items").innerHTML = t.items.length
      ? t.items.map((p) => `<li><span>${p.name}</span><span>${euro(p.price)}</span></li>`).join("")
      : `<li class="is-empty">Nessun oggetto ancora: parti dal passo 3.</li>`;
    $("#sum-rows").innerHTML = `
      <div><span>Confezione in carta ${PAPERS[state.paper].name.toLowerCase()}</span><span>gratis</span></div>
      ${t.items.length ? `<div class="is-promo"><span>Sconto Natale <code>CASA15</code></span><span>−${euro(t.disc)}</span></div>` : ""}
      <div><span>Spedizione</span><span>${t.items.length ? (t.ship ? euro(t.ship) : "gratuita") : "—"}</span></div>
      <div class="is-total"><span>Totale</span><span>${euro(t.total)}</span></div>`;

    const shipEl = $("#ship");
    if (t.items.length && t.after < FREE_SHIP) {
      const miss = round2(FREE_SHIP - t.after);
      shipEl.innerHTML = `<span>Ti mancano <b>${euro(miss)}</b> per la spedizione gratuita</span><span class="ship__bar"><i style="transform:scaleX(${(t.after / FREE_SHIP).toFixed(3)})"></i></span>`;
    } else {
      shipEl.innerHTML = t.items.length ? `<span>✶ Spedizione gratuita sbloccata, arriva entro il 23/12</span>` : "";
    }

    // CTA
    const cta = $("#cfg-cta");
    if (t.items.length) {
      const qs = new URLSearchParams({
        items: state.items.join(","),
        wrap: `Carta ${PAPERS[state.paper].name.toLowerCase()}, nastro ${RIBBONS[state.ribbon].name.toLowerCase()}`,
      });
      if (state.to.trim()) qs.set("to", state.to.trim());
      cta.href = `ordine-confermato.html?${qs}`;
      cta.removeAttribute("aria-disabled");
      cta.firstChild.textContent = `Ordina il regalo · ${euro(t.total)} `;
    } else {
      cta.href = "#step-items";
      cta.setAttribute("aria-disabled", "true");
      cta.firstChild.textContent = "Scegli almeno un oggetto ";
    }

    // barra mobile
    $("#bar-text").textContent = t.items.length ? `${t.items.length} ${t.items.length === 1 ? "oggetto" : "oggetti"} · ${euro(t.total)}` : "La scatola è vuota";
  }

  /* ---------- eventi ---------- */
  form.addEventListener("input", (e) => {
    const el = e.target;
    switch (el.name) {
      case "who":
      case "paper":
      case "ribbon":
        state[el.name] = el.value;
        break;
      case "budget":
        state.budget = +el.value;
        break;
      case "items":
        if (el.checked && state.items.length < MAX) state.items.push(el.value);
        else state.items = state.items.filter((id) => id !== el.value);
        break;
      case "to":
      case "from":
      case "msg":
        state[el.name] = el.value;
        break;
      case "hidePrice":
        state.hidePrice = el.checked;
        break;
      default:
        return;
    }
    update();
  });
  form.addEventListener("submit", (e) => e.preventDefault());

  $("#cfg-reset").addEventListener("click", () => {
    state = initial();
    form.reset();
    update();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // la barra mobile compare solo quando l'anteprima non è visibile
  const bar = $("#cfg-bar");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => bar.classList.toggle("is-hidden", e.isIntersecting), { threshold: 0.15 }).observe($("#anteprima"));
  }

  update();
})();
