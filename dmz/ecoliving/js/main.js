/* =========================================================
   EcoLiving — interazioni condivise + rendering delle pagine
   ========================================================= */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Data limite per ricevere i regali prima di Natale
  const XMAS_DEADLINE = new Date("2026-12-18T23:59:59+01:00");

  const ICONS = {
    arrow: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z"/></svg>`,
    pinterest: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.7 2-2.7.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.3 1.1.5 2 1.6 2 1.9 0 3.4-2 3.4-5 0-2.6-1.9-4.4-4.5-4.4-3.1 0-4.9 2.3-4.9 4.7 0 .9.4 1.9.8 2.5.1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.4-.7-2.2-2.7-2.2-4.3 0-3.5 2.5-6.7 7.3-6.7 3.8 0 6.8 2.7 6.8 6.4 0 3.8-2.4 6.9-5.8 6.9-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.3 1-.9 2.2-1.4 2.9A10 10 0 1 0 12 2Z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12c0 1.3.1 2.6.4 3.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM10 15V9l5.2 3L10 15Z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4V9.5Z"/></svg>`,
  };
  window.ICONS = ICONS;

  /* ---------------- chrome condiviso ---------------- */
  function chrome() {

    const nav = [
      ["index.html", "Home", "home"],
      ["shop.html", "Collezione di Natale", "shop"],
      ["configuratore.html", "Componi un regalo", "config"],
      ["index.html#materiali", "Materiali", ""],
      ["index.html#produzione", "Come produciamo", ""],
      ["index.html#persone", "Chi siamo", ""],
      ["index.html#faq", "FAQ", ""],
    ];

    const promoMsgs = [
      "Ordina entro il 18 dicembre: arriva prima di Natale",
      "Confezione regalo in carta riciclata, gratis",
      "Spedizione gratuita sopra i 49€",
      "Codice CASA15: −15% sulla collezione di Natale",
    ];
    const promo = `<div class="promo-bar" role="region" aria-label="Promozioni di Natale"><div class="promo-bar__track">${[...promoMsgs, ...promoMsgs]
      .map((m, i) => `<span ${i >= promoMsgs.length ? 'aria-hidden="true"' : ""}>${m}</span>`)
      .join("")}</div></div>`;

    const header = `
    <a class="skip-link" href="#main">Vai al contenuto</a>
    ${promo}
    <header class="site-header">
      <div class="wrap site-header__inner">
        <a class="logo" href="index.html" aria-label="EcoLiving, torna alla home">${window.RisoArt.logo}<span>EcoLiving</span></a>
        <nav class="header-nav" aria-label="Principale">
          <a class="nav-link" href="configuratore.html" ${page === "config" ? 'aria-current="page"' : ""}>Componi un regalo</a>
          <a class="nav-link" href="index.html#materiali">Materiali</a>
          <a class="nav-link" href="index.html#produzione">Produzione</a>
          <a class="nav-link" href="index.html#persone">Chi siamo</a>
          <div class="header-actions">
            <a class="btn btn--green btn--shop" href="shop.html" ${page === "shop" ? 'aria-current="page"' : ""}>SHOP</a>
            <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Apri il menu"><span></span></button>
          </div>
        </nav>
      </div>
    </header>
    <div class="menu" id="menu" aria-hidden="true">
      <div class="menu__inner">
        <ol>${nav.map(([h, l, p]) => `<li><a href="${h}" ${p && p === page ? 'aria-current="page"' : ""}>${l}</a></li>`).join("")}</ol>
        <aside class="menu__aside">
          <div class="card-xmas">
            <h3>Regali che restano</h3>
            <p>Ordina entro il 18 dicembre per riceverlo sotto l’albero.</p>
            <div class="countdown" data-countdown style="margin-top:14px"></div>
          </div>
          <p>Bottega e magazzino a Padova<br>ciao@ecoliving.example · lun–ven 9–18</p>
        </aside>
      </div>
    </div>`;

    const newsletter = `
    <section class="newsletter section scallop-top" aria-labelledby="nl-title">
      <span class="newsletter__deco halftone" style="--dot: var(--green); left:-60px; top:30px"></span>
      <span class="newsletter__deco halftone" style="--dot: var(--orange); right:-50px; bottom:20px"></span>
      <div class="wrap">
        <span class="eyebrow">Newsletter</span>
        <h2 id="nl-title">Una mail al mese,<br>niente spam</h2>
        <p class="muted">Storie dalle botteghe, nuovi oggetti prima di tutti e un consiglio al mese per far durare di più le cose che hai già.</p>
        <form class="nl-form" novalidate>
          <label class="sr-only" for="nl-email">Email</label>
          <input id="nl-email" type="email" name="email" placeholder="La tua email" autocomplete="email" required>
          <button class="btn btn--light" type="submit">Iscriviti</button>
        </form>
        <p class="nl-msg" role="status" aria-live="polite"></p>
        <p class="nl-small">Iscrivendoti accetti i nostri <a href="#">Termini e condizioni</a>. Puoi cancellarti con un clic.</p>
      </div>
    </section>`;

    const footer = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-top">
          <a class="logo" href="index.html">${window.RisoArt.logo}<span>EcoLiving</span></a>
          <nav class="footer-links" aria-label="Footer">
            <a href="shop.html">Shop</a>
            <a href="configuratore.html">Componi un regalo</a>
            <a href="index.html#materiali">Materiali</a>
            <a href="index.html#produzione">Produzione</a>
            <a href="index.html#persone">Chi siamo</a>
            <a href="index.html#faq">FAQ</a>
          </nav>
          <div class="socials">
            <a href="#" aria-label="Instagram">${ICONS.instagram}</a>
            <a href="#" aria-label="Facebook">${ICONS.facebook}</a>
            <a href="#" aria-label="Pinterest">${ICONS.pinterest}</a>
            <a href="#" aria-label="YouTube">${ICONS.youtube}</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 EcoLiving. Tutti i diritti riservati.</span>
          <a href="#">Privacy Policy</a>
          <a href="#">Termini di servizio</a>
          <a href="#">Impostazioni cookie</a>
        </div>
      </div>
    </footer>`;

    $("[data-header]")?.insertAdjacentHTML("beforebegin", header);
    $("[data-header]")?.remove();
    $("[data-footer]")?.insertAdjacentHTML("beforebegin", newsletter + footer);
    $("[data-footer]")?.remove();
  }

  /* ---------------- grana della carta ----------------
     Generata una volta su canvas (PNG piccolo, ripetuto): niente
     filtri SVG né blend mode sull'overlay fisso, che su Safari
     costringono a ridipingere tutta la pagina a ogni scroll. */
  function grain() {
    try {
      const size = 160;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d");
      const data = ctx.createImageData(size, size);
      for (let i = 0; i < data.data.length; i += 4) {
        const v = Math.random();
        data.data[i] = 42;
        data.data[i + 1] = 38;
        data.data[i + 2] = 34;
        data.data[i + 3] = v > 0.5 ? (v - 0.5) * 150 : 0;
      }
      ctx.putImageData(data, 0, 0);
      document.documentElement.style.setProperty("--grain", `url(${c.toDataURL("image/png")})`);
    } catch (e) {
      /* senza canvas la pagina resta senza grana */
    }
  }

  /* ---------------- menu ---------------- */
  function menu() {
    const btn = $(".burger");
    const panel = $("#menu");
    if (!btn) return;
    const set = (open) => {
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
      panel.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", !open);
      document.body.classList.toggle("menu-open", open);
      if (open) setTimeout(() => $("a", panel)?.focus(), 250);
    };
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
    panel.addEventListener("click", (e) => e.target.closest("a") && set(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("is-open")) {
        set(false);
        btn.focus();
      }
    });
  }

  /* ---------------- illustrazioni ---------------- */
  function renderArt(root = document) {
    $$("[data-art]", root).forEach((el) => {
      el.innerHTML = window.RisoArt.img(el.dataset.art);
    });
  }

  /* ---------------- neve ---------------- */
  function snow() {
    if (reduceMotion) return;
    $$("[data-snow]").forEach((el) => {
      const n = +el.dataset.snow || 40;
      let html = "";
      for (let i = 0; i < n; i++) {
        const s = 3 + Math.random() * 7;
        html += `<i style="left:${Math.random() * 100}%;--s:${s.toFixed(1)}px;--d:${(9 + Math.random() * 12).toFixed(1)}s;--delay:${(-Math.random() * 20).toFixed(1)}s;--x:${(Math.random() * 80 - 40).toFixed(0)}px"></i>`;
      }
      el.innerHTML = html;
    });
  }

  /* ---------------- countdown ---------------- */
  function countdown() {
    const els = $$("[data-countdown]");
    if (!els.length) return;
    const tick = () => {
      let ms = Math.max(0, XMAS_DEADLINE - new Date());
      const d = Math.floor(ms / 864e5);
      const h = Math.floor((ms % 864e5) / 36e5);
      const m = Math.floor((ms % 36e5) / 6e4);
      const s = Math.floor((ms % 6e4) / 1e3);
      const pad = (n) => String(n).padStart(2, "0");
      const html = ms
        ? `<div><b>${d}</b><small>giorni</small></div><div><b>${pad(h)}</b><small>ore</small></div><div><b>${pad(m)}</b><small>min</small></div><div><b>${pad(s)}</b><small>sec</small></div>`
        : `<div><b>Ultime ore!</b><small>spedizione express</small></div>`;
      els.forEach((el) => (el.innerHTML = html));
    };
    tick();
    setInterval(tick, 1000);
    els.forEach((el) => el.setAttribute("aria-label", "Tempo rimasto per ordinare entro Natale"));
  }

  /* ---------------- reveal + contatori ---------------- */
  function reveal() {
    const items = $$(".reveal, [data-count], .timeline li");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          if (e.target.dataset.count) countUp(e.target);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  function countUp(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) {
      el.textContent = target.toLocaleString("it-IT") + suffix;
      return;
    }
    const t0 = performance.now();
    const dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString("it-IT") + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------------- timeline progress ---------------- */
  function timeline() {
    const tl = $(".timeline");
    if (!tl) return;
    const bar = $(".timeline__progress", tl);
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = tl.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      bar.style.transform = `scaleY(${p.toFixed(3)})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------------- tabs ---------------- */
  function tabs() {
    $$("[role=tablist]").forEach((list) => {
      const btns = $$("[role=tab]", list);
      const activate = (btn) => {
        btns.forEach((b) => {
          const on = b === btn;
          b.setAttribute("aria-selected", on);
          b.tabIndex = on ? 0 : -1;
          document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
        });
      };
      btns.forEach((b, i) => {
        b.addEventListener("click", () => activate(b));
        b.addEventListener("keydown", (e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          const next = btns[(i + (e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
          next.focus();
          activate(next);
        });
      });
    });
  }

  /* ---------------- FAQ: una sola aperta ---------------- */
  function faq() {
    const all = $$(".faq details");
    all.forEach((d) =>
      d.addEventListener("toggle", () => {
        if (d.open) all.forEach((o) => o !== d && (o.open = false));
      })
    );
  }

  /* ---------------- newsletter ---------------- */
  function newsletter() {
    $$(".nl-form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = $("input", form);
        const msg = form.parentElement.querySelector(".nl-msg");
        if (!input.checkValidity() || !input.value.trim()) {
          msg.textContent = "Controlla l’indirizzo email: sembra incompleto.";
          input.focus();
          return;
        }
        msg.textContent = "Fatto! Ci sentiamo a inizio mese ✶";
        form.reset();
      });
    });
  }

  /* ---------------- foto prodotto ----------------
     Usa assets/images/product_N.png; se il file non c'è ancora,
     al suo posto compare l'illustrazione riso del prodotto. */
  function productMedia(p, eager = false) {
    if (!p.image) return { attr: `data-art="${p.art}"`, html: "" };
    return {
      attr: "",
      html: `<img src="${p.image}" alt="${p.name}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" data-fallback="${p.art}">`,
    };
  }
  document.addEventListener(
    "error",
    (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || !img.dataset.fallback) return;
      const box = img.parentElement;
      box.dataset.art = img.dataset.fallback;
      box.innerHTML = window.RisoArt.img(img.dataset.fallback);
    },
    true
  );

  /* ---------------- card prodotto ---------------- */
  function card(p) {
    const media = productMedia(p);
    return `<a class="p-card" href="prodotto.html?id=${p.id}">
      ${p.badge ? `<span class="tag">${p.badge}</span>` : ""}
      <div class="p-card__img" ${media.attr}>${media.html}</div>
      <div class="p-card__body">
        <h3>${p.name}</h3>
        <p>${p.short}</p>
        <div class="p-card__foot">
          <span class="price">${window.euro(p.price)}</span>
          <span class="p-card__cta" aria-hidden="true">${ICONS.arrow}</span>
        </div>
      </div>
    </a>`;
  }

  /* ---------------- home: carosello regali ---------------- */
  function homeGifts() {
    const el = $("[data-gifts]");
    if (!el) return;
    el.innerHTML = window.PRODUCTS.map(card).join("");
    renderArt(el);
  }

  /* ---------------- shop ---------------- */
  function shop() {
    const grid = $("#product-grid");
    if (!grid) return;
    const count = $(".shop-count");
    const chips = $$(".chip");
    const draw = (cat) => {
      const list = cat === "tutti" ? window.PRODUCTS : window.PRODUCTS.filter((p) => p.cats.includes(cat));
      grid.innerHTML = list.map(card).join("");
      $$(".p-card", grid).forEach((c, i) => (c.style.animationDelay = `${i * 60}ms`));
      renderArt(grid);
      count.textContent = `${list.length} ${list.length === 1 ? "oggetto" : "oggetti"}`;
    };
    chips.forEach((c) =>
      c.addEventListener("click", () => {
        chips.forEach((o) => o.setAttribute("aria-pressed", o === c));
        draw(c.dataset.cat);
      })
    );
    draw("tutti");
  }

  /* ---------------- pagina prodotto ---------------- */
  function product() {
    const root = $("#pdp");
    if (!root) return;
    const id = new URLSearchParams(location.search).get("id");
    const p = window.findProduct(id) || window.PRODUCTS[0];
    document.title = `${p.name} — EcoLiving`;

    const media = productMedia(p, true);
    root.innerHTML = `
      <div class="pdp__img" ${media.attr}>${media.html}</div>
      <div class="pdp__info">
        <nav class="crumbs" aria-label="Percorso"><a href="index.html">Home</a><span>/</span><a href="shop.html">Collezione di Natale</a><span>/</span><span aria-current="page">${p.name}</span></nav>
        ${p.badge ? `<span class="eyebrow">${p.badge}</span>` : ""}
        <h1 class="misprint" style="font-size:clamp(2.4rem,5vw,4.2rem)">${p.name}</h1>
        <p><span class="price">${window.euro(p.price)}</span><span class="pdp__unit">${p.unit}</span></p>
        <p class="lead">${p.desc}</p>
        <ul class="specs">
          <li><span>Materiale</span><span>${p.material}</span></li>
          <li><span>Misure</span><span>${p.size}</span></li>
          <li><span>Fatto a</span><span>${p.origin}</span></li>
          <li><span>Garanzia</span><span>${p.id === "pentole" ? "25 anni + riparazioni" : "2 anni + riparazioni"}</span></li>
        </ul>
        <label class="gift-opt">
          <input type="checkbox" id="gift" checked>
          <span><b>Confezione regalo gratuita</b><small>Carta riciclata, spago di cotone e bigliettino scritto a mano.</small></span>
        </label>
        <div class="buy-row">
          <div class="qty" role="group" aria-label="Quantità">
            <button type="button" data-q="-1" aria-label="Diminuisci quantità">−</button>
            <output id="qty" aria-live="polite">1</output>
            <button type="button" data-q="1" aria-label="Aumenta quantità">+</button>
          </div>
          <a class="btn btn--red" id="buy" href="#">Acquista ora <span class="arrow">${ICONS.arrow}</span></a>
        </div>
        <p class="ship-note">Disponibile · ordina entro il 18 dicembre per riceverlo prima di Natale</p>
      </div>`;
    renderArt(root);

    let q = 1;
    const out = $("#qty");
    const buy = $("#buy");
    const sync = () => {
      out.textContent = q;
      buy.href = `ordine-confermato.html?id=${p.id}&q=${q}&gift=${$("#gift").checked ? 1 : 0}`;
    };
    $$("[data-q]", root).forEach((b) =>
      b.addEventListener("click", () => {
        q = Math.min(9, Math.max(1, q + +b.dataset.q));
        sync();
      })
    );
    $("#gift").addEventListener("change", sync);
    sync();

    const rel = $("#related");
    if (rel) {
      rel.innerHTML = window.PRODUCTS.filter((x) => x.id !== p.id)
        .slice(0, 3)
        .map(card)
        .join("");
      renderArt(rel);
    }
  }

  /* ---------------- ordine confermato ---------------- */
  function order() {
    const el = $("#receipt");
    if (!el) return;
    const qs = new URLSearchParams(location.search);
    const p = window.findProduct(qs.get("id"));
    const q = Math.min(9, Math.max(1, parseInt(qs.get("q"), 10) || 1));
    const n = `EL-${String(Math.floor(10000 + Math.random() * 89999))}`;
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

    // regalo composto dal configuratore
    const box = (qs.get("items") || "").split(",").map(window.findProduct).filter(Boolean).slice(0, 3);
    if (box.length) {
      const sub = box.reduce((s, x) => s + x.price, 0);
      const disc = Math.round(sub * 0.15 * 100) / 100;
      const after = sub - disc;
      const ship = after >= 49 ? 0 : 4.9;
      const to = qs.get("to");
      el.innerHTML = `
        <div class="row"><span>Ordine</span><span>${n}</span></div>
        <hr>
        ${box.map((x) => `<div class="row"><span>${x.name}</span><span>${window.euro(x.price)}</span></div>`).join("")}
        <div class="row"><span>${esc(qs.get("wrap") || "Confezione regalo")}</span><span>gratis</span></div>
        <div class="row"><span>Sconto CASA15</span><span>−${window.euro(disc)}</span></div>
        <div class="row"><span>Spedizione</span><span>${ship ? window.euro(ship) : "gratuita"}</span></div>
        <hr>
        <div class="row total"><span>Totale</span><span>${window.euro(Math.round((after + ship) * 100) / 100)}</span></div>
        <hr>
        ${to ? `<div class="row"><span>Bigliettino per</span><span>${esc(to.slice(0, 18))}</span></div>` : ""}
        <div class="row"><span>Arrivo previsto</span><span>entro il 23/12</span></div>`;
      return;
    }

    if (!p) {
      el.innerHTML = `<div class="row"><span>Ordine</span><span>${n}</span></div><hr><p>Ti abbiamo inviato una mail con il riepilogo.</p>`;
      return;
    }
    const sub = p.price * q;
    const ship = sub >= 49 ? 0 : 4.9;
    el.innerHTML = `
      <div class="row"><span>Ordine</span><span>${n}</span></div>
      <hr>
      <div class="row"><span>${q} × ${p.name}</span><span>${window.euro(sub)}</span></div>
      <div class="row"><span>Confezione regalo</span><span>${qs.get("gift") === "1" ? "inclusa" : "—"}</span></div>
      <div class="row"><span>Spedizione</span><span>${ship ? window.euro(ship) : "gratuita"}</span></div>
      <hr>
      <div class="row total"><span>Totale</span><span>${window.euro(sub + ship)}</span></div>
      <hr>
      <div class="row"><span>Arrivo previsto</span><span>entro il 23/12</span></div>`;
  }

  function socials() {
    $$("[data-socials]").forEach((el) => {
      const n = el.dataset.socials;
      el.innerHTML = `<a href="#" aria-label="LinkedIn di ${n}">${ICONS.linkedin}</a><a href="#" aria-label="Instagram di ${n}">${ICONS.instagram}</a>`;
    });
  }

  /* ---------------- avvio ---------------- */
  grain();
  chrome();
  socials();
  menu();
  renderArt();
  snow();
  countdown();
  homeGifts();
  shop();
  product();
  order();
  tabs();
  faq();
  newsletter();
  reveal();
  timeline();
})();
