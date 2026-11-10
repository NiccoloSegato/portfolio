/* =========================================================
   Illustrazioni "risograph" in SVG, generate via JS.
   Ogni colore è una lastra: le forme si sovrappongono con
   mix-blend-mode: multiply, i contorni neri sono stampati
   leggermente fuori registro e un filtro aggiunge grana e
   bordi irregolari.
   ========================================================= */
(function () {
  const K = {
    paper: "#f5eddf",
    paper2: "#ede1cc",
    cream: "#fbf6ec",
    ink: "#2a2622",
    green: "#2e6b4f",
    deep: "#1f4a3a",
    orange: "#e8673c",
    yellow: "#f3b740",
    pink: "#f4a3a0",
    blue: "#3b5ba5",
    red: "#d2333f",
  };
  const M = 'style="mix-blend-mode:multiply"';
  const OFF = 'transform="translate(5 4)"'; // lastra nera fuori registro

  // generatore pseudo-casuale deterministico (stessa illustrazione ad ogni caricamento)
  function rng(seed) {
    let s = seed;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  }

  /* ---------- defs globali (filtri + retini) ---------- */
  const dots = (id, c, size = 7, r = 1.7) =>
    `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="${c}"/></pattern>`;
  const lines = (id, c, size = 8, w = 2, rot = 45) =>
    `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})"><rect width="${w}" height="${size}" fill="${c}"/></pattern>`;

  const DEFS = `
    <defs>
      <filter id="riso" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="warp"/>
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="rough"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" result="grain"/>
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.05" result="speck"/>
        <feComposite in="rough" in2="speck" operator="in"/>
      </filter>
      ${dots("d-yellow", K.yellow)}
      ${dots("d-pink", K.pink)}
      ${dots("d-orange", K.orange)}
      ${dots("d-green", K.green)}
      ${dots("d-blue", K.blue)}
      ${dots("d-red", K.red)}
      ${dots("d-paper", K.cream, 9, 2)}
      ${dots("d-ink", K.ink, 6, 1.1)}
      ${lines("l-orange", K.orange, 10, 3)}
      ${lines("l-pink", K.pink, 10, 4, -30)}
      ${lines("l-green", K.green, 9, 3, 0)}
      ${lines("l-yellow", K.yellow, 12, 5, 90)}
    </defs>`;

  function wrap(vb, label, body, extra = "") {
    const [, , w, h] = vb.split(" ");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" aria-label="${label}">${DEFS}<g filter="url(#riso)"${extra}>${body}</g></svg>`;
  }

  /* ---------- piccoli mattoncini ---------- */
  function needles(x1, y1, x2, y2, n, color, len = 22, seed = 3) {
    const r = rng(seed);
    let out = "";
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      const a1 = -60 + r() * 20;
      const a2 = 60 + r() * 20;
      const l = len * (0.7 + r() * 0.5);
      out += `<line x1="${x}" y1="${y}" x2="${x + Math.cos((a1 * Math.PI) / 180) * l}" y2="${y - Math.sin((a1 * Math.PI) / 180) * l}" />`;
      out += `<line x1="${x}" y1="${y}" x2="${x + Math.cos((a2 * Math.PI) / 180) * l}" y2="${y - Math.sin((a2 * Math.PI) / 180) * l}" />`;
      out += `<line x1="${x}" y1="${y}" x2="${x - Math.cos((a1 * Math.PI) / 180) * l * 0.8}" y2="${y + Math.sin((a1 * Math.PI) / 180) * l * 0.8}" />`;
    }
    return `<g stroke="${color}" stroke-width="5" stroke-linecap="round" ${M}>${out}</g>`;
  }

  function sprig(x, y, rot = 0, scale = 1, color = K.green, seed = 1) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})">
      <path d="M0 0 C40 -6 80 -4 130 -14" stroke="${K.ink}" stroke-width="4" fill="none"/>
      ${needles(0, 0, 125, -13, 9, color, 24, seed)}
    </g>`;
  }

  function star(cx, cy, r, color, points = 5, inner = 0.45) {
    let d = "";
    for (let i = 0; i < points * 2; i++) {
      const rr = i % 2 ? r * inner : r;
      const a = (Math.PI / points) * i - Math.PI / 2;
      d += `${i ? "L" : "M"}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    }
    return `<path d="${d}Z" fill="${color}" ${M}/>`;
  }

  function orangeSlice(cx, cy, r) {
    let seg = "";
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      seg += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * r * 0.78}" y2="${cy + Math.sin(a) * r * 0.78}"/>`;
    }
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${K.orange}" ${M}/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.8}" fill="${K.yellow}" ${M}/>
      <g stroke="${K.cream}" stroke-width="${Math.max(1.5, r / 10)}">${seg}</g>`;
  }

  function snowField(w, h, n, seed, color = K.cream, maxR = 5) {
    const r = rng(seed);
    let out = "";
    for (let i = 0; i < n; i++) out += `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(1.5 + r() * maxR).toFixed(1)}" fill="${color}"/>`;
    return out;
  }

  /* ======================= HERO ======================= */
  function hero() {
    const winClip = `<clipPath id="win"><path d="M470 520 V220 a170 170 0 0 1 340 0 V520 Z"/></clipPath>`;
    return wrap(
      "0 0 1000 880",
      "Illustrazione: tavolo di legno davanti a una finestra innevata con candela, palline e ciotola di arance",
      `${winClip}
      <rect width="1000" height="880" fill="${K.paper}"/>
      <rect width="1000" height="880" fill="url(#d-pink)" opacity=".9"/>
      <!-- carta da parati -->
      <g ${M} opacity=".55">${Array.from({ length: 9 }, (_, i) => `<rect x="${i * 120 - 10}" y="0" width="34" height="880" fill="${K.pink}"/>`).join("")}</g>
      <!-- finestra notturna -->
      <path d="M470 520 V220 a170 170 0 0 1 340 0 V520 Z" fill="${K.blue}"/>
      <g clip-path="url(#win)">
        <circle cx="720" cy="170" r="46" fill="${K.yellow}"/>
        <path d="M470 470 L540 330 L610 470 Z M560 480 L650 290 L740 480 Z M700 480 L770 350 L840 480Z" fill="${K.green}" ${M}/>
        <path d="M470 470 Q600 430 820 470 V530 H470Z" fill="${K.cream}"/>
        ${snowField(360, 420, 60, 11)
          .replace(/cx="(\d+)"/g, (m, x) => `cx="${+x + 460}"`)
          .replace(/cy="(\d+)"/g, (m, y) => `cy="${+y + 50}"`)}
      </g>
      <g stroke="${K.cream}" stroke-width="16" fill="none">
        <path d="M470 520 V220 a170 170 0 0 1 340 0 V520 Z"/>
        <line x1="640" y1="52" x2="640" y2="520"/>
        <line x1="470" y1="300" x2="810" y2="300"/>
      </g>
      <g ${OFF} stroke="${K.ink}" stroke-width="4" fill="none"><path d="M458 528 V220 a182 182 0 0 1 364 0 V528"/></g>
      <!-- ghirlanda sulla finestra -->
      <path d="M440 120 Q640 260 840 120" stroke="${K.green}" stroke-width="34" fill="none" stroke-linecap="round"/>
      ${Array.from({ length: 10 }, (_, i) => {
        const p = (t) => [440 + 400 * t, 120 + 2 * (1 - t) * t * 140];
        const [ax, ay] = p(i / 10);
        const [bx, by] = p((i + 1) / 10);
        return needles(ax, ay, bx, by, 3, K.deep, 22, 5 + i);
      }).join("")}
      ${[0.08, 0.22, 0.36, 0.5, 0.64, 0.78, 0.92]
        .map((t, i) => {
          const x = 440 + 400 * t;
          const y = 120 + 2 * (1 - t) * t * 140 * 1;
          return `<circle cx="${x}" cy="${y + 8}" r="11" fill="${i % 2 ? K.red : K.yellow}" ${M}/>`;
        })
        .join("")}
      <!-- mensola / tavolo -->
      <rect x="0" y="560" width="1000" height="320" fill="${K.orange}"/>
      <rect x="0" y="560" width="1000" height="320" fill="url(#l-orange)" opacity=".5"/>
      <rect x="0" y="560" width="1000" height="26" fill="${K.yellow}" ${M}/>
      <g ${OFF}><line x1="0" y1="560" x2="1000" y2="560" stroke="${K.ink}" stroke-width="4"/></g>
      <!-- tovaglia di lino -->
      <path d="M120 600 L880 600 L940 880 L60 880Z" fill="${K.cream}"/>
      <path d="M120 600 L880 600 L940 880 L60 880Z" fill="url(#l-pink)" opacity=".7"/>
      <!-- bagliore candela -->
      <circle cx="300" cy="460" r="230" fill="url(#d-yellow)"/>
      <circle cx="300" cy="460" r="140" fill="${K.yellow}" opacity=".55" ${M}/>
      <!-- candela -->
      <rect x="235" y="440" width="130" height="190" rx="18" fill="${K.cream}"/>
      <rect x="243" y="500" width="114" height="122" rx="10" fill="${K.pink}" ${M}/>
      <rect x="255" y="530" width="90" height="54" fill="${K.paper}"/>
      <text x="300" y="563" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-weight="700" font-size="17" fill="${K.ink}">di Natale</text>
      <line x1="300" y1="440" x2="300" y2="420" stroke="${K.ink}" stroke-width="4"/>
      <path d="M300 340 C325 380 322 414 300 420 C278 414 275 380 300 340Z" fill="${K.orange}"/>
      <path d="M300 370 C312 392 311 410 300 413 C289 410 288 392 300 370Z" fill="${K.yellow}"/>
      <g ${OFF} stroke="${K.ink}" stroke-width="3.5" fill="none"><rect x="235" y="440" width="130" height="190" rx="18"/></g>
      <!-- ciotola con arance -->
      ${orangeSlice(560, 590, 46)}
      <circle cx="650" cy="585" r="50" fill="${K.orange}" ${M}/>
      <circle cx="610" cy="560" r="44" fill="${K.yellow}" ${M}/>
      <path d="M480 600 H760 C750 690 690 730 620 730 C550 730 490 690 480 600Z" fill="${K.green}"/>
      <path d="M492 640 H748 M505 670 H735" stroke="${K.pink}" stroke-width="10" ${M}/>
      <g ${OFF} stroke="${K.ink}" stroke-width="3.5" fill="none"><path d="M480 600 H760 C750 690 690 730 620 730 C550 730 490 690 480 600Z"/></g>
      <!-- palline sul tavolo -->
      <circle cx="830" cy="700" r="56" fill="${K.red}" ${M}/>
      <path d="M776 700 Q803 680 830 700 T884 700" stroke="${K.cream}" stroke-width="8" fill="none"/>
      <rect x="815" y="636" width="30" height="16" rx="3" fill="${K.yellow}"/>
      <circle cx="905" cy="760" r="40" fill="${K.yellow}" ${M}/>
      <circle cx="905" cy="760" r="40" fill="url(#d-red)"/>
      <g ${OFF} stroke="${K.ink}" stroke-width="3" fill="none"><circle cx="830" cy="700" r="56"/><circle cx="905" cy="760" r="40"/></g>
      <!-- tazza -->
      <rect x="100" y="640" width="96" height="100" rx="14" fill="${K.blue}" ${M}/>
      <path d="M196 665 a26 26 0 0 1 0 52" stroke="${K.blue}" stroke-width="14" fill="none" ${M}/>
      <g stroke="${K.ink}" stroke-width="4" fill="none" stroke-linecap="round"><path d="M130 625 q-14 -22 0 -42 q14 -20 0 -42"/><path d="M166 625 q-14 -22 0 -42 q14 -20 0 -42"/></g>
      ${sprig(370, 760, -10, 1.6, K.green, 8)}
      ${sprig(80, 830, -20, 1.4, K.green, 6)}
      ${star(420, 690, 18, K.red)}
      ${star(720, 800, 14, K.yellow)}`
    );
  }

  /* ======================= PRODOTTI ======================= */
  function ornaments() {
    const ball = (cx, cy, r, fill, deco) => `
      <line x1="${cx}" y1="62" x2="${cx}" y2="${cy - r - 14}" stroke="${K.ink}" stroke-width="3"/>
      <rect x="${cx - 13}" y="${cy - r - 16}" width="26" height="20" rx="4" fill="${K.yellow}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${M}/>
      ${deco}
      <ellipse cx="${cx - r * 0.38}" cy="${cy - r * 0.4}" rx="${r * 0.18}" ry="${r * 0.28}" fill="${K.cream}" opacity=".85" transform="rotate(30 ${cx - r * 0.38} ${cy - r * 0.4})"/>
      <g ${OFF}><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${K.ink}" stroke-width="3"/></g>`;
    return wrap(
      "0 0 400 400",
      "Illustrazione: tre palline di Natale appese a un ramo di abete",
      `<rect width="400" height="400" fill="${K.pink}"/>
      <circle cx="300" cy="110" r="130" fill="url(#d-yellow)"/>
      <rect y="340" width="400" height="60" fill="${K.orange}" ${M}/>
      ${ball(105, 220, 58, K.red, `<path d="M47 220 Q76 196 105 220 T163 220" stroke="${K.cream}" stroke-width="9" fill="none"/>`)}
      ${ball(318, 200, 50, K.yellow, `<rect x="268" y="186" width="100" height="10" fill="${K.orange}" ${M}/><rect x="268" y="208" width="100" height="10" fill="${K.orange}" ${M}/>`)}
      ${ball(214, 280, 66, K.green, `${star(214, 280, 22, K.yellow)}${star(178, 250, 9, K.cream)}${star(252, 318, 9, K.cream)}`)}
      <path d="M-10 70 C120 40 260 70 410 44" stroke="${K.ink}" stroke-width="7" fill="none"/>
      ${needles(0, 66, 400, 50, 22, K.green, 26, 2)}`
    );
  }

  function wreath() {
    const r = rng(5);
    let leaves = "";
    for (let i = 0; i < 34; i++) {
      const a = (i / 34) * 360;
      const rad = 92 + (i % 2 ? 18 : -14);
      const x = 200 + Math.cos((a * Math.PI) / 180) * rad;
      const y = 180 + Math.sin((a * Math.PI) / 180) * rad;
      leaves += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="26" ry="10" transform="rotate(${(a + 60 + r() * 40).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${i % 3 ? K.green : K.blue}" ${M}/>`;
    }
    let slices = "";
    [20, 95, 165, 235, 310].forEach((a, i) => {
      const x = 200 + Math.cos((a * Math.PI) / 180) * 96;
      const y = 180 + Math.sin((a * Math.PI) / 180) * 96;
      slices += orangeSlice(x, y, i % 2 ? 15 : 19);
    });
    let berries = "";
    [55, 130, 200, 275, 345].forEach((a) => {
      const x = 200 + Math.cos((a * Math.PI) / 180) * 100;
      const y = 180 + Math.sin((a * Math.PI) / 180) * 100;
      berries += `<circle cx="${x}" cy="${y}" r="7" fill="${K.red}"/><circle cx="${x + 9}" cy="${y + 5}" r="6" fill="${K.red}"/>`;
    });
    return wrap(
      "0 0 400 400",
      "Illustrazione: ghirlanda di abete con arance essiccate e fiocco rosso",
      `<rect width="400" height="400" fill="${K.yellow}"/>
      <rect width="400" height="400" fill="url(#d-orange)" opacity=".5"/>
      <rect y="340" width="400" height="60" fill="${K.orange}"/>
      <rect y="340" width="400" height="60" fill="url(#l-orange)" opacity=".6"/>
      <line x1="200" y1="0" x2="200" y2="70" stroke="${K.ink}" stroke-width="3"/>
      <circle cx="200" cy="180" r="98" fill="none" stroke="${K.green}" stroke-width="54"/>
      ${leaves}${slices}${berries}
      <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="3"><circle cx="200" cy="180" r="128"/><circle cx="200" cy="180" r="68"/></g>
      <!-- fiocco -->
      <path d="M200 286 L150 258 Q138 290 150 316 Z M200 286 L250 258 Q262 290 250 316Z" fill="${K.red}"/>
      <path d="M192 292 L168 360 L186 352 L196 372Z M208 292 L232 360 L214 352 L204 372Z" fill="${K.red}" ${M}/>
      <circle cx="200" cy="288" r="13" fill="${K.red}"/>
      <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="2.5"><path d="M200 286 L150 258 Q138 290 150 316 Z M200 286 L250 258 Q262 290 250 316Z"/></g>`
    );
  }

  function reindeer() {
    return wrap(
      "0 0 400 400",
      "Illustrazione: renna giocattolo in legno su ruote con sciarpa rossa",
      `<rect width="400" height="400" fill="${K.paper}"/>
      <circle cx="230" cy="190" r="170" fill="url(#d-pink)"/>
      <circle cx="230" cy="190" r="110" fill="${K.pink}" opacity=".6" ${M}/>
      <rect y="338" width="400" height="62" fill="${K.green}"/>
      <rect y="338" width="400" height="62" fill="url(#d-paper)" opacity=".5"/>
      <!-- filo -->
      <path d="M96 304 C60 330 40 300 -10 340" stroke="${K.ink}" stroke-width="3" fill="none"/>
      <!-- base e ruote -->
      <rect x="96" y="290" width="210" height="24" rx="8" fill="${K.orange}"/>
      <rect x="96" y="290" width="210" height="24" rx="8" fill="url(#l-orange)" opacity=".7"/>
      <!-- zampe -->
      <rect x="140" y="230" width="22" height="66" rx="6" fill="${K.orange}" ${M}/>
      <rect x="176" y="236" width="22" height="60" rx="6" fill="${K.yellow}" ${M}/>
      <rect x="236" y="236" width="22" height="60" rx="6" fill="${K.yellow}" ${M}/>
      <rect x="268" y="230" width="22" height="66" rx="6" fill="${K.orange}" ${M}/>
      <!-- corpo -->
      <rect x="126" y="176" width="180" height="80" rx="40" fill="${K.orange}"/>
      <path d="M150 200 Q215 188 285 202 M150 226 Q215 214 285 228" stroke="${K.yellow}" stroke-width="5" fill="none" ${M}/>
      <circle cx="306" cy="190" r="13" fill="${K.cream}"/>
      <!-- collo e testa -->
      <path d="M140 196 L118 120 L160 112 L176 186Z" fill="${K.orange}" ${M}/>
      <ellipse cx="128" cy="112" rx="44" ry="34" fill="${K.orange}"/>
      <ellipse cx="88" cy="126" rx="26" ry="20" fill="${K.yellow}" ${M}/>
      <circle cx="68" cy="122" r="11" fill="${K.red}"/>
      <circle cx="134" cy="102" r="5" fill="${K.ink}"/>
      <ellipse cx="166" cy="92" rx="18" ry="8" transform="rotate(-30 166 92)" fill="${K.yellow}"/>
      <!-- corna -->
      <g stroke="${K.ink}" stroke-width="6" stroke-linecap="round" fill="none">
        <path d="M120 82 C112 52 118 36 104 18 M116 58 L94 46 M114 40 L130 26"/>
        <path d="M146 84 C156 56 168 46 168 22 M160 58 L184 50 M166 40 L156 26"/>
      </g>
      <!-- sciarpa -->
      <path d="M118 150 Q150 166 178 150 L182 172 Q150 186 116 172Z" fill="${K.red}"/>
      <path d="M160 168 L172 236 L188 232 L178 166Z" fill="${K.red}" ${M}/>
      <g stroke="${K.cream}" stroke-width="4"><line x1="130" y1="158" x2="130" y2="176"/><line x1="150" y1="162" x2="150" y2="180"/><line x1="168" y1="160" x2="168" y2="178"/></g>
      <g stroke="${K.red}" stroke-width="3"><line x1="174" y1="236" x2="172" y2="248"/><line x1="181" y1="235" x2="180" y2="247"/><line x1="187" y1="233" x2="188" y2="245"/></g>
      <!-- ruote -->
      <circle cx="138" cy="322" r="22" fill="${K.ink}"/><circle cx="138" cy="322" r="8" fill="${K.yellow}"/>
      <circle cx="266" cy="322" r="22" fill="${K.ink}"/><circle cx="266" cy="322" r="8" fill="${K.yellow}"/>
      <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="3"><rect x="126" y="176" width="180" height="80" rx="40"/><ellipse cx="128" cy="112" rx="44" ry="34"/></g>
      ${star(330, 70, 16, K.yellow)}${star(360, 120, 9, K.red)}`
    );
  }

  function candle() {
    return wrap(
      "0 0 400 400",
      "Illustrazione: candela profumata in barattolo di vetro con cannella e arancia",
      `<rect width="400" height="400" fill="${K.paper}"/>
      <circle cx="200" cy="150" r="170" fill="url(#d-yellow)"/>
      <circle cx="200" cy="150" r="100" fill="${K.yellow}" opacity=".6" ${M}/>
      <rect y="300" width="400" height="100" fill="${K.green}"/>
      <rect y="300" width="400" height="100" fill="url(#l-green)" opacity=".35"/>
      <!-- barattolo -->
      <rect x="128" y="150" width="144" height="170" rx="20" fill="${K.cream}"/>
      <rect x="136" y="200" width="128" height="112" rx="12" fill="${K.pink}" ${M}/>
      <rect x="150" y="226" width="100" height="56" fill="${K.paper}"/>
      <text x="200" y="252" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="800" font-size="15" fill="${K.ink}">EcoLiving</text>
      <text x="200" y="271" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="11" fill="${K.ink}">cannella &amp; arancia</text>
      <line x1="200" y1="200" x2="200" y2="176" stroke="${K.ink}" stroke-width="4"/>
      <path d="M200 96 C226 134 222 168 200 176 C178 168 174 134 200 96Z" fill="${K.orange}"/>
      <path d="M200 126 C212 146 211 164 200 168 C189 164 188 146 200 126Z" fill="${K.yellow}"/>
      <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="3"><rect x="128" y="150" width="144" height="170" rx="20"/></g>
      <!-- cannella -->
      <g transform="rotate(-14 80 330)">
        <rect x="20" y="318" width="120" height="20" rx="10" fill="${K.orange}" ${M}/>
        <rect x="30" y="334" width="120" height="20" rx="10" fill="${K.orange}" ${M}/>
        <rect x="20" y="318" width="120" height="20" rx="10" fill="url(#l-orange)"/>
      </g>
      ${orangeSlice(330, 340, 40)}
      ${star(300, 290, 20, K.red, 8, 0.4)}
      ${sprig(250, 380, -25, 1.1, K.deep, 4)}`
    );
  }

  function pots() {
    const hammer = (x, y, w, h, seed) => {
      const r = rng(seed);
      let o = "";
      for (let i = 0; i < 26; i++) o += `<circle cx="${(x + r() * w).toFixed(0)}" cy="${(y + r() * h).toFixed(0)}" r="${(3 + r() * 4).toFixed(1)}" fill="${K.yellow}" opacity=".8"/>`;
      return `<g ${M}>${o}</g>`;
    };
    return wrap(
      "0 0 400 400",
      "Illustrazione: set di pentole in rame martellato con vapore",
      `<rect width="400" height="400" fill="${K.paper}"/>
      <rect width="400" height="290" fill="url(#d-blue)" opacity=".7"/>
      <rect y="290" width="400" height="110" fill="${K.yellow}"/>
      <rect y="290" width="400" height="110" fill="url(#l-yellow)" opacity=".5"/>
      <!-- vapore -->
      <g stroke="${K.ink}" stroke-width="4" fill="none" stroke-linecap="round">
        <path d="M110 140 q-16 -24 0 -46 q16 -22 0 -46"/><path d="M150 132 q-16 -24 0 -46 q16 -22 0 -46"/><path d="M190 140 q-16 -24 0 -46 q16 -22 0 -46"/>
      </g>
      <!-- pentola grande -->
      <rect x="20" y="236" width="44" height="14" rx="7" fill="${K.ink}"/>
      <rect x="236" y="236" width="44" height="14" rx="7" fill="${K.ink}"/>
      <rect x="56" y="180" width="190" height="130" rx="16" fill="${K.orange}"/>
      ${hammer(60, 190, 180, 110, 7)}
      <ellipse cx="151" cy="182" rx="98" ry="16" fill="${K.red}" ${M}/>
      <ellipse cx="151" cy="180" rx="84" ry="10" fill="${K.ink}" opacity=".8"/>
      <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="3"><rect x="56" y="180" width="190" height="130" rx="16"/></g>
      <!-- pentola piccola -->
      <rect x="262" y="232" width="110" height="80" rx="12" fill="${K.orange}" ${M}/>
      ${hammer(266, 238, 100, 70, 3)}
      <ellipse cx="317" cy="226" rx="62" ry="12" fill="${K.orange}"/>
      <path d="M296 214 a21 12 0 0 1 42 0" fill="${K.yellow}"/>
      <rect x="370" y="250" width="40" height="12" rx="6" fill="${K.ink}"/>
      <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="3"><rect x="262" y="232" width="110" height="80" rx="12"/></g>
      ${sprig(20, 370, -6, 1.3, K.green, 3)}
      <path d="M210 352 q30 -30 60 0 q30 30 60 0" stroke="${K.red}" stroke-width="10" fill="none" ${M}/>
      ${star(350, 70, 18, K.yellow)}`
    );
  }

  function cutlery() {
    const holly = (x, y) => `
      <ellipse cx="${x - 7}" cy="${y}" rx="9" ry="5" transform="rotate(-30 ${x - 7} ${y})" fill="${K.green}"/>
      <ellipse cx="${x + 7}" cy="${y}" rx="9" ry="5" transform="rotate(30 ${x + 7} ${y})" fill="${K.green}"/>
      <circle cx="${x}" cy="${y + 5}" r="4" fill="${K.red}"/><circle cx="${x + 5}" cy="${y + 9}" r="3.4" fill="${K.red}"/>`;
    const handle = (x) => `<rect x="${x - 14}" y="210" width="28" height="140" rx="14" fill="${K.cream}"/>
      ${holly(x, 250)}${holly(x, 300)}
      <g ${OFF}><rect x="${x - 14}" y="210" width="28" height="140" rx="14" fill="none" stroke="${K.ink}" stroke-width="2.5"/></g>`;
    return wrap(
      "0 0 400 400",
      "Illustrazione: forchetta, coltello e cucchiaio con manici decorati ad agrifoglio su tovagliolo verde",
      `<rect width="400" height="400" fill="${K.paper}"/>
      <rect width="400" height="400" fill="url(#d-pink)"/>
      <circle cx="400" cy="380" r="170" fill="${K.cream}"/>
      <circle cx="400" cy="380" r="130" fill="none" stroke="${K.pink}" stroke-width="14" ${M}/>
      <g ${OFF}><circle cx="400" cy="380" r="170" fill="none" stroke="${K.ink}" stroke-width="3"/></g>
      <rect x="70" y="20" width="250" height="380" rx="6" fill="${K.green}" transform="rotate(-8 200 200)" ${M}/>
      <rect x="70" y="20" width="250" height="380" rx="6" fill="url(#l-green)" transform="rotate(-8 200 200)" opacity=".5"/>
      <g transform="rotate(-8 200 200)" stroke="${K.cream}" stroke-width="4"><line x1="86" y1="20" x2="86" y2="400"/><line x1="304" y1="20" x2="304" y2="400"/></g>
      <!-- forchetta -->
      <g fill="${K.blue}" ${M}>
        <rect x="114" y="60" width="8" height="80" rx="4"/><rect x="128" y="60" width="8" height="80" rx="4"/>
        <rect x="142" y="60" width="8" height="80" rx="4"/><rect x="156" y="60" width="8" height="80" rx="4"/>
        <path d="M112 130 H166 Q166 170 146 178 V214 H132 V178 Q112 170 112 130Z"/>
      </g>
      ${handle(139)}
      <!-- coltello -->
      <path d="M200 50 Q228 80 222 214 H196 Z" fill="${K.blue}" ${M}/>
      <path d="M202 70 Q218 90 216 200" stroke="${K.cream}" stroke-width="4" fill="none" opacity=".8"/>
      ${handle(209)}
      <!-- cucchiaio -->
      <ellipse cx="279" cy="104" rx="30" ry="44" fill="${K.blue}" ${M}/>
      <ellipse cx="270" cy="92" rx="9" ry="18" fill="${K.cream}" opacity=".7"/>
      <rect x="273" y="140" width="12" height="74" fill="${K.blue}" ${M}/>
      ${handle(279)}
      <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="2.5"><ellipse cx="279" cy="104" rx="30" ry="44"/><path d="M200 50 Q228 80 222 214 H196 Z"/></g>
      ${sprig(-10, 40, 20, 1.1, K.green, 9)}`
    );
  }

  /* ======================= SEZIONI ======================= */
  function materials() {
    let rings = "";
    for (let i = 1; i <= 7; i++) rings += `<circle cx="140" cy="140" r="${i * 13}" fill="none" stroke="${K.ink}" stroke-width="${i % 2 ? 2 : 1.4}" opacity=".7"/>`;
    return wrap(
      "0 0 500 500",
      "Illustrazione: sezione di tronco, pila di lino, vaso in ceramica e casseruola in rame",
      `<rect width="500" height="500" fill="${K.paper2}"/>
      <rect width="500" height="500" fill="url(#d-pink)" opacity=".6"/>
      <!-- legno -->
      <circle cx="140" cy="140" r="104" fill="${K.orange}"/>
      <circle cx="140" cy="140" r="92" fill="${K.yellow}" ${M}/>
      ${rings}
      <path d="M140 140 L200 60" stroke="${K.ink}" stroke-width="3"/>
      <g ${OFF}><circle cx="140" cy="140" r="104" fill="none" stroke="${K.ink}" stroke-width="3"/></g>
      <!-- lino -->
      <g>
        <rect x="290" y="70" width="170" height="40" rx="8" fill="${K.pink}" ${M}/>
        <rect x="282" y="112" width="180" height="40" rx="8" fill="${K.blue}" ${M}/>
        <rect x="294" y="154" width="166" height="40" rx="8" fill="${K.cream}"/>
        <rect x="294" y="154" width="166" height="40" rx="8" fill="url(#l-pink)"/>
        <rect x="286" y="196" width="178" height="40" rx="8" fill="${K.green}" ${M}/>
        <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="2.5"><rect x="282" y="70" width="182" height="166" rx="10"/></g>
      </g>
      <!-- ceramica -->
      <path d="M90 470 C40 420 60 330 110 300 V270 H170 V300 C220 330 240 420 190 470Z" fill="${K.green}"/>
      <path d="M70 380 H210 M66 410 H214" stroke="${K.yellow}" stroke-width="10" ${M}/>
      <path d="M140 270 C130 230 100 220 90 210 M140 270 C150 220 190 220 200 200" stroke="${K.green}" stroke-width="5" fill="none"/>
      <ellipse cx="90" cy="210" rx="16" ry="8" fill="${K.green}" ${M}/><ellipse cx="200" cy="200" rx="16" ry="8" fill="${K.green}" ${M}/>
      <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="3"><path d="M90 470 C40 420 60 330 110 300 V270 H170 V300 C220 330 240 420 190 470Z"/></g>
      <!-- rame -->
      <rect x="290" y="330" width="170" height="120" rx="16" fill="${K.orange}"/>
      <ellipse cx="375" cy="332" rx="90" ry="14" fill="${K.red}" ${M}/>
      <rect x="452" y="360" width="60" height="14" rx="7" fill="${K.ink}"/>
      <circle cx="330" cy="380" r="6" fill="${K.yellow}" ${M}/><circle cx="360" cy="410" r="5" fill="${K.yellow}" ${M}/><circle cx="410" cy="372" r="7" fill="${K.yellow}" ${M}/><circle cx="430" cy="420" r="5" fill="${K.yellow}" ${M}/>
      <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="3"><rect x="290" y="330" width="170" height="120" rx="16"/></g>
      ${star(250, 260, 16, K.orange)}`
    );
  }

  function impact() {
    let rings = "";
    for (let i = 16; i >= 1; i--) {
      const r = i * 15 + (i % 3) * 2;
      rings += `<circle cx="250" cy="250" r="${r}" fill="${i % 2 ? K.yellow : K.orange}"/>`;
      if (i % 4 === 0) rings += `<circle cx="250" cy="250" r="${r - 4}" fill="url(#d-paper)" opacity=".6"/>`;
    }
    rings += `<circle cx="250" cy="250" r="82" fill="${K.cream}"/><circle cx="250" cy="250" r="82" fill="url(#d-yellow)"/>`;
    return wrap(
      "0 0 500 500",
      "Illustrazione: sezione di tronco con sedici anelli, uno per ogni anno di EcoLiving",
      `<rect width="500" height="500" fill="${K.cream}"/>
      <rect width="500" height="500" fill="url(#d-green)" opacity=".5"/>
      ${rings}
      <g fill="none" stroke="${K.ink}" stroke-width="2" ${OFF} opacity=".8">${Array.from({ length: 8 }, (_, i) => `<circle cx="250" cy="250" r="${(i + 1) * 30}"/>`).join("")}</g>
      <path d="M250 250 L250 0 M250 250 L470 360" stroke="${K.ink}" stroke-width="3" opacity=".7"/>
      <text x="250" y="282" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="900" font-size="96" fill="${K.green}">16</text>
      <text x="254" y="286" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="900" font-size="96" fill="${K.pink}" ${M} opacity=".8">16</text>`
    );
  }

  function parcel() {
    return wrap(
      "0 0 400 400",
      "Illustrazione: pacco regalo in carta riciclata legato con lo spago",
      `<rect width="400" height="400" fill="${K.paper}"/>
      <rect width="400" height="400" fill="url(#d-red)" opacity=".55"/>
      ${snowField(400, 400, 26, 4, K.cream, 6)}
      <rect x="80" y="150" width="240" height="180" rx="10" fill="${K.orange}"/>
      <rect x="80" y="150" width="240" height="180" rx="10" fill="url(#l-orange)" opacity=".5"/>
      <rect x="66" y="120" width="268" height="50" rx="10" fill="${K.yellow}" ${M}/>
      <rect x="186" y="120" width="28" height="210" fill="${K.red}" ${M}/>
      <rect x="66" y="232" width="268" height="20" fill="${K.red}" ${M}/>
      <path d="M200 120 C150 70 120 100 150 122Z M200 120 C250 70 280 100 250 122Z" fill="${K.red}"/>
      <rect x="230" y="262" width="74" height="50" fill="${K.cream}"/>
      <text x="267" y="292" text-anchor="middle" font-family="DM Mono, monospace" font-size="11" fill="${K.ink}">per te ✶</text>
      <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="3"><rect x="80" y="150" width="240" height="180" rx="10"/><rect x="66" y="120" width="268" height="50" rx="10"/></g>
      ${sprig(60, 360, -8, 1.2, K.green, 2)}
      ${star(330, 80, 22, K.yellow)}${star(70, 80, 14, K.cream)}`
    );
  }

  function shopStars() {
    const r = rng(21);
    let out = "";
    for (let i = 0; i < 26; i++) {
      const x = r() * 1200;
      const y = r() * 600;
      const s = 6 + r() * 22;
      out += star(Math.round(x), Math.round(y), s, i % 3 ? K.yellow : K.pink);
    }
    return wrap("0 0 1200 600", "", `${out}
      <circle cx="1080" cy="120" r="220" fill="url(#d-yellow)"/>
      <circle cx="80" cy="560" r="200" fill="url(#d-pink)"/>`, ' opacity=".85"');
  }

  /* ======================= PERSONE ======================= */
  function person(o) {
    const hair = {
      bun: `<circle cx="150" cy="70" r="32" fill="${o.hair}"/><path d="M86 150 C80 80 220 80 214 150 C200 110 110 104 86 150Z" fill="${o.hair}"/>`,
      short: `<path d="M84 152 C70 74 230 70 216 146 C196 112 150 102 120 112 C104 118 92 132 84 152Z" fill="${o.hair}"/>`,
      long: `<path d="M74 250 C56 140 90 72 150 72 C210 72 244 140 226 250 L198 250 C214 170 196 120 150 112 C104 120 86 170 102 250Z" fill="${o.hair}"/>`,
      curly: Array.from({ length: 11 }, (_, i) => {
        const a = Math.PI + (i / 10) * Math.PI;
        return `<circle cx="${150 + Math.cos(a) * 70}" cy="${140 + Math.sin(a) * 70}" r="26" fill="${o.hair}"/>`;
      }).join(""),
    }[o.style];
    return wrap(
      "0 0 300 360",
      `Ritratto illustrato di ${o.name}`,
      `<rect width="300" height="360" fill="${o.bg}"/>
      <circle cx="${o.dotX || 220}" cy="90" r="90" fill="url(#d-${o.dots || "yellow"})"/>
      ${o.style === "long" ? hair : ""}
      <path d="M30 360 C40 280 90 252 150 252 C210 252 260 280 270 360Z" fill="${o.shirt}" ${M}/>
      ${o.pattern ? `<path d="M30 360 C40 280 90 252 150 252 C210 252 260 280 270 360Z" fill="url(#${o.pattern})" opacity=".7"/>` : ""}
      <rect x="132" y="210" width="36" height="50" fill="${o.skin}"/>
      <ellipse cx="150" cy="160" rx="62" ry="72" fill="${o.skin}"/>
      ${o.style !== "long" ? hair : `<path d="M90 140 C100 96 200 96 210 140 C190 112 110 112 90 140Z" fill="${o.hair}"/>`}
      <circle cx="116" cy="182" r="13" fill="${K.pink}" ${M}/>
      <circle cx="184" cy="182" r="13" fill="${K.pink}" ${M}/>
      <g stroke="${K.ink}" stroke-width="4" fill="none" stroke-linecap="round">
        <path d="M118 160 q10 -8 20 0"/><path d="M162 160 q10 -8 20 0"/>
        <path d="M150 168 v16 h-6"/>
        <path d="M134 202 q16 14 32 0"/>
        ${o.glasses ? `<circle cx="128" cy="160" r="18" stroke-width="3"/><circle cx="172" cy="160" r="18" stroke-width="3"/><line x1="146" y1="160" x2="154" y2="160" stroke-width="3"/>` : ""}
      </g>
      <g ${OFF} fill="none" stroke="${K.ink}" stroke-width="2.5"><ellipse cx="150" cy="160" rx="62" ry="72"/></g>`
    );
  }

  const PEOPLE = {
    giulia: { name: "Giulia", bg: K.pink, skin: "#f0c6a6", hair: K.orange, style: "bun", shirt: K.green, dots: "yellow" },
    marco: { name: "Marco", bg: K.yellow, skin: "#d29b72", hair: K.ink, style: "short", shirt: K.blue, glasses: true, dots: "orange", pattern: "l-pink" },
    amina: { name: "Amina", bg: "#cfe0d4", skin: "#8a5a3c", hair: K.ink, style: "curly", shirt: K.orange, dots: "green", dotX: 80 },
    elena: { name: "Elena", bg: K.paper2, skin: "#ecbf9a", hair: "#7a4a2e", style: "long", shirt: K.red, dots: "pink", pattern: "d-paper" },
  };

  /* ---------- logo ---------- */
  const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="22" cy="21" r="15" fill="${K.yellow}"/><path d="M6 34 V18 L17 9 L28 18 V34Z" fill="${K.green}" style="mix-blend-mode:multiply"/><path d="M17 34 V25 a5 5 0 0 1 0 0" stroke="${K.cream}" stroke-width="3"/><path d="M17 31 C17 24 21 21 26 20 C25 26 22 29 17 31Z" fill="${K.orange}"/></svg>`;

  const ART = { hero, ornaments, wreath, reindeer, candle, pots, cutlery, materials, impact, parcel, shopStars };

  // Ogni illustrazione diventa un <img> (Blob URL): il browser applica i filtri
  // una sola volta e poi la tratta come bitmap, invece di ricalcolarli a ogni scroll.
  const cache = {};
  function img(name) {
    if (!cache[name]) {
      const svg = name.startsWith("person:") ? person(PEOPLE[name.slice(7)]) : ART[name] ? ART[name]() : "";
      const label = (svg.match(/aria-label="([^"]*)"/) || [, ""])[1];
      cache[name] = { url: URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })), label };
    }
    const { url, label } = cache[name];
    return `<img src="${url}" alt="${label}" decoding="async" draggable="false">`;
  }

  window.RisoArt = { img, logo: LOGO };
})();
