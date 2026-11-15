'use strict';
/* BrickL — lesson 1 (Fast gears). Plain JS, no build step. */

// ---------- Geometry ----------
// One hole = U px. Two gears mesh when axle distance (in holes) = (teeth1 + teeth2) / 16.
const U = 56, COLS = 13, ROWS = 7, OX = 56, OY = 56;
const BW = OX * 2 + (COLS - 1) * U, BH = OY * 2 + (ROWS - 1) * U;
const holeX = (h) => OX + h * U, holeY = (h) => OY + h * U;
const radius = (t) => (t * U) / 16;
const GEAR_COL = { 8: ['#3E7BEA', '#1F55B5', '#EEF3FD'], 16: ['#8E5BD9', '#5E33A8', '#F3EEFC'], 24: ['#F2A33A', '#B86E0F', '#FFF6EA'] };
const TAU = Math.PI * 2;

const pathCache = {};
function gearPath(N, r) {
  const key = N + ':' + r;
  if (pathCache[key]) return pathCache[key];
  const m = (2 * r) / N, ro = r + m * 0.95, rr = r - m * 1.15, t = TAU / N, pts = [];
  for (let i = 0; i < N; i++) {
    const c = i * t;
    for (const [f, R] of [[-0.5, rr], [-0.3, rr], [-0.14, ro], [0.14, ro], [0.3, rr]]) {
      const a = c + f * t;
      pts.push((R * Math.cos(a)).toFixed(1) + ',' + (R * Math.sin(a)).toFixed(1));
    }
  }
  return (pathCache[key] = 'M' + pts.join('L') + 'Z');
}

// ---------- Text (EN / DE) ----------
const T = {
  en: {
    tagline: 'Learn engineering with bricks', path: 'Your path',
    tiers: ['Basics', 'Mechanisms', 'Machines'], tierSub: ['Learn the parts', 'Make things move', 'Combine your tools'],
    lessons: ['Fast gears', 'Strong gears', 'Flip it', 'Axles and bushes', 'Gear chain', 'Crank and winch', 'Worm gear', 'Up and down', 'Turn a corner', 'Levers', 'Push and pull', 'Crane', 'Elevator', 'Forklift', 'Steering', 'Plane controls'],
    lesson: 'Lesson', start: 'Start', again: 'Play again', soon: 'Coming soon', doneTag: 'Done',
    steps: ['Idea', 'Play', 'Build'],
    idea: 'A big gear turns a small gear.\nThe small gear spins fast!',
    ideaSub: 'Watch the white dots. The big gear turns 1 time. The small gear turns 3 times.',
    next: 'Next', back: 'Back', listen: 'Read aloud',
    parts: 'Parts', dragTip: 'Drag parts onto the board',
    axle: 'Axle', gear: 'Gear', motor: 'Motor', teeth: 'teeth', big: 'big', small: 'small', medium: 'medium', left: 'left',
    goal: 'GOAL', goal1: 'Make the small gear spin 3 times faster than the big gear. Use the motor.',
    motorBtn: 'Motor', flip: 'Flip', helpers: 'Helpers', test: 'Test it!', hint: 'Hint',
    tapTip: 'Tip: turn a gear with your finger. Tap a part to remove it.',
    dropAxle: 'Axles go into a hole.', dropGear: 'Gears go on an axle.', dropMotor: 'The motor goes on an axle.', full: 'This axle already has a gear.', noneLeft: 'None left. Remove one from the board first.',
    jamToast: 'Stuck! Two gears push into each other.',
    fail1: 'Not yet. Try again!', fail2: 'Not yet. Want a hint?', getHint: 'Get a hint', moreHint: 'More help', ok: 'OK',
    prob: {
      axle: 'Gears need axles. Drag an axle into a hole first.',
      big: 'Put the big gear (24 teeth) on an axle.',
      small: 'Put the small gear (8 teeth) on an axle.',
      motor: 'The motor must turn the big gear. Put the motor on the big gear’s axle.',
      jam: 'Two gears push into each other. Move one away.',
      touch: 'Do the gears touch? Their teeth must fit together.',
      on: 'Switch the motor on!',
      ratio: 'Look at the speed numbers. Is the small gear 3×?',
      done: 'It looks right! Press “Test it!”',
    },
    pointText: 'Look where it blinks.', showText: 'Put the parts on the shadows.',
    win: 'You did it!', winSub: 'The small gear spins 3 times faster than the big gear.', toBuild: 'Now build it for real',
    findParts: 'Find these parts', haveAll: 'I have them all',
    missing: 'Missing a part? You can still look at the steps.',
    beam9: 'Beam, 9 holes', axle4: 'Axle, 4 long', gear24: 'Gear, 24 teeth', gear8: 'Gear, 8 teeth', bush: 'Bush',
    b: ['Take the beam. Count the holes from the left.', 'Push an axle into hole 2.', 'Push the second axle into hole 4.', 'Slide the big gear onto the first axle.', 'Slide the small gear onto the second axle. The teeth must touch.', 'Put a bush on the back of each axle, so nothing falls out.'],
    front: 'front', backSide: 'back',
    testQ: 'Test it! Turn the big gear 1 time, slowly. How many times does the small gear turn?',
    right: 'Yes! 3 times. Small gear = fast.', wrong: 'Count again, slowly. A sticker on the small gear helps.',
    finish: 'Finish', done: 'Lesson done!', tool: 'New tool: Fast gears', toMap: 'Back to the map',
    disclaimer: 'BrickL is not made by, sponsored by or connected to the LEGO Group.',
  },
  de: {
    tagline: 'Technik lernen mit Steinen', path: 'Dein Weg',
    tiers: ['Grundlagen', 'Mechanik', 'Maschinen'], tierSub: ['Lerne die Teile kennen', 'Bring Dinge in Bewegung', 'Kombiniere deine Werkzeuge'],
    lessons: ['Schnelle Zahnräder', 'Starke Zahnräder', 'Umdrehen', 'Achsen und Buchsen', 'Zahnrad-Kette', 'Kurbel und Seilwinde', 'Schneckengetriebe', 'Hoch und runter', 'Um die Ecke', 'Hebel', 'Schieben und ziehen', 'Kran', 'Aufzug', 'Gabelstapler', 'Lenkung', 'Flugzeug-Steuerung'],
    lesson: 'Lektion', start: 'Los', again: 'Nochmal spielen', soon: 'Kommt bald', doneTag: 'Geschafft',
    steps: ['Idee', 'Spielen', 'Bauen'],
    idea: 'Ein großes Zahnrad dreht ein kleines.\nDas kleine dreht sich schnell!',
    ideaSub: 'Schau auf die weißen Punkte. Das große dreht sich 1-mal. Das kleine dreht sich 3-mal.',
    next: 'Weiter', back: 'Zurück', listen: 'Vorlesen',
    parts: 'Teile', dragTip: 'Zieh Teile aufs Brett',
    axle: 'Achse', gear: 'Zahnrad', motor: 'Motor', teeth: 'Zähne', big: 'groß', small: 'klein', medium: 'mittel', left: 'übrig',
    goal: 'ZIEL', goal1: 'Lass das kleine Zahnrad 3-mal schneller drehen als das große. Nimm den Motor.',
    motorBtn: 'Motor', flip: 'Umdrehen', helpers: 'Helfer', test: 'Testen!', hint: 'Tipp',
    tapTip: 'Tipp: Dreh ein Zahnrad mit dem Finger. Tipp ein Teil an, um es wegzunehmen.',
    dropAxle: 'Achsen kommen in ein Loch.', dropGear: 'Zahnräder kommen auf eine Achse.', dropMotor: 'Der Motor kommt auf eine Achse.', full: 'Auf dieser Achse ist schon ein Zahnrad.', noneLeft: 'Keins mehr da. Nimm erst eins vom Brett.',
    jamToast: 'Es klemmt! Zwei Zahnräder drücken ineinander.',
    fail1: 'Noch nicht. Versuch es nochmal!', fail2: 'Noch nicht. Möchtest du einen Tipp?', getHint: 'Tipp zeigen', moreHint: 'Mehr Hilfe', ok: 'OK',
    prob: {
      axle: 'Zahnräder brauchen Achsen. Zieh zuerst eine Achse in ein Loch.',
      big: 'Steck das große Zahnrad (24 Zähne) auf eine Achse.',
      small: 'Steck das kleine Zahnrad (8 Zähne) auf eine Achse.',
      motor: 'Der Motor muss das große Zahnrad drehen. Steck ihn auf die Achse vom großen Zahnrad.',
      jam: 'Zwei Zahnräder drücken ineinander. Schieb eins weg.',
      touch: 'Berühren sich die Zahnräder? Die Zähne müssen ineinander passen.',
      on: 'Schalte den Motor an!',
      ratio: 'Schau auf die Zahlen. Dreht das kleine Zahnrad 3×?',
      done: 'Sieht gut aus! Drück auf „Testen!“',
    },
    pointText: 'Schau, wo es blinkt.', showText: 'Leg die Teile auf die Schatten.',
    win: 'Geschafft!', winSub: 'Das kleine Zahnrad dreht sich 3-mal schneller als das große.', toBuild: 'Jetzt in echt bauen',
    findParts: 'Such diese Teile', haveAll: 'Ich habe alle',
    missing: 'Fehlt ein Teil? Du kannst die Schritte trotzdem anschauen.',
    beam9: 'Balken, 9 Löcher', axle4: 'Achse, 4 lang', gear24: 'Zahnrad, 24 Zähne', gear8: 'Zahnrad, 8 Zähne', bush: 'Buchse',
    b: ['Nimm den Balken. Zähl die Löcher von links.', 'Steck eine Achse in Loch 2.', 'Steck die zweite Achse in Loch 4.', 'Schieb das große Zahnrad auf die erste Achse.', 'Schieb das kleine Zahnrad auf die zweite Achse. Die Zähne müssen sich berühren.', 'Steck hinten auf jede Achse eine Buchse, damit nichts herausfällt.'],
    front: 'vorne', backSide: 'hinten',
    testQ: 'Teste es! Dreh das große Zahnrad 1-mal, ganz langsam. Wie oft dreht sich das kleine?',
    right: 'Ja! 3-mal. Kleines Zahnrad = schnell.', wrong: 'Zähl nochmal, ganz langsam. Ein Aufkleber am kleinen Zahnrad hilft.',
    finish: 'Fertig', done: 'Lektion geschafft!', tool: 'Neues Werkzeug: Schnelle Zahnräder', toMap: 'Zurück zur Karte',
    disclaimer: 'BrickL ist kein Produkt der LEGO Gruppe und wird von ihr weder unterstützt noch gesponsert.',
  },
};
const MAP = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10], [11, 12, 13, 14, 15]];

// ---------- Saved progress (browser only) ----------
const SAVE_KEY = 'brickl.v1';
function load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { return {}; } }
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ lang: S.lang, done: S.done })); } catch (e) { /* storage blocked: progress lives in memory only */ } }

// ---------- Lesson 1 data ----------
const L1 = {
  stock: { axle: 3, g8: 1, g16: 1, g24: 1, motor: 1 },
  // Guided ghosts (Tier 1): shown one at a time.
  ghosts: [
    { type: 'axle', hx: 4, hy: 3 }, { type: 'axle', hx: 6, hy: 3 },
    { type: 'gear', teeth: 24, hx: 4, hy: 3 }, { type: 'gear', teeth: 8, hx: 6, hy: 3 },
    { type: 'motor', hx: 4, hy: 3 },
  ],
};

function newPlay() {
  return { axles: [], gears: [], motor: null, motorOn: false, reverse: false, helpers: true, sel: null, ang: {}, phis: {}, nextId: 1 };
}

const saved = load();
const S = {
  lang: saved.lang === 'de' ? 'de' : 'en',
  done: Array.isArray(saved.done) ? saved.done : [],
  screen: 'map', step: 0, play: newPlay(), an: null,
  fails: 0, hintLevel: 0, panel: null, toast: null, win: false,
  build: { i: 0, have: {}, answer: null },
};
const t = () => T[S.lang];

// ---------- Small SVG pieces ----------
function gearSVG(teeth, opts = {}) {
  const r = radius(teeth), [fill, dk, light] = GEAR_COL[teeth];
  const ghost = opts.ghost;
  if (ghost) return `<path d="${gearPath(teeth, r)}" fill="none" stroke="#1F2430" stroke-width="3" stroke-dasharray="7 6" opacity=".45"/>`;
  const holes = teeth >= 24 ? [0, 1, 2].map((i) => { const a = (i * TAU) / 3 - Math.PI / 2; return `<circle cx="${(r * 0.45 * Math.cos(a)).toFixed(1)}" cy="${(r * 0.45 * Math.sin(a)).toFixed(1)}" r="${(r * 0.11).toFixed(1)}" fill="${light}"/>`; }).join('') : '';
  return `<path d="${gearPath(teeth, r)}" fill="${fill}" stroke="${dk}" stroke-width="2.5" stroke-linejoin="round"/>${holes}` +
    `<circle r="${Math.max(9, r * 0.17).toFixed(1)}" fill="${light}"/>${axleCross(Math.max(6.5, r * 0.11))}` +
    `<circle cx="${(r * 0.72).toFixed(1)}" cy="0" r="${Math.max(4, r * 0.075).toFixed(1)}" fill="#fff" stroke="${dk}" stroke-width="1.5"/>`;
}
const axleCross = (s) => `<path d="M${-s},${-s * 0.28} H${s} V${s * 0.28} H${-s}Z M${-s * 0.28},${-s} H${s * 0.28} V${s} H${-s * 0.28}Z" fill="#1F2430"/>`;
const axleEnd = () => `<circle r="12" fill="#5B6270"/>${axleCross(8)}`;
const motorBadge = () => `<g transform="translate(0 0)"><rect x="-26" y="14" width="52" height="24" rx="8" fill="#1F2430"/><path d="M-6 18l-6 9h6l-3 7 10-11h-6l3-5z" fill="#F2A33A"/><text x="10" y="31" font-size="13" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">M</text></g>`;

function icon(kind, w = 56, h = 44) {
  if (kind === 'axle') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="4" y="19" width="48" height="7" rx="2" fill="#1F2430"/><rect x="4" y="15" width="5" height="15" rx="1.5" fill="#1F2430"/></svg>`;
  if (kind === 'motor') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="4" y="8" width="38" height="28" rx="7" fill="#5B6270"/><rect x="42" y="18" width="11" height="8" rx="2" fill="#1F2430"/><path d="M22 13l-6 9h6l-3 8 10-11h-6l3-6z" fill="#F2A33A"/></svg>`;
  if (kind === 'bush') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="14" y="8" width="28" height="28" rx="6" fill="#9AA3B2" stroke="#5B6270" stroke-width="2"/><g transform="translate(28 22)">${axleCross(7)}</g></svg>`;
  if (kind === 'beam9') return `<svg width="${w * 2}" height="${h}" viewBox="0 0 120 44" aria-hidden="true"><rect x="2" y="10" width="116" height="24" rx="12" fill="#3A4150"/>${Array.from({ length: 9 }, (_, i) => `<circle cx="${14 + i * 11.5}" cy="22" r="4.2" fill="#FAF8F3"/>`).join('')}</svg>`;
  if (kind === 'axle4') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="6" y="18" width="44" height="8" rx="2" fill="#1F2430"/>${[1, 2, 3].map((i) => `<rect x="${6 + i * 11 - 0.75}" y="18" width="1.5" height="8" fill="#5B6270"/>`).join('')}</svg>`;
  const teeth = +kind.slice(1);
  const r = radius(teeth), s = r + r * 0.1 + 4;
  return `<svg width="${w}" height="${h}" viewBox="${-s} ${-s} ${2 * s} ${2 * s}" aria-hidden="true">${gearSVG(teeth)}</svg>`;
}

// ---------- Gear physics (math, no physics engine) ----------
function analyze(p) {
  const gs = p.gears.map((g) => { const a = p.axles.find((x) => x.id === g.axle); return { ...g, x: holeX(a.hx), y: holeY(a.hy), r: radius(g.teeth) }; });
  const adj = {}; gs.forEach((g) => (adj[g.id] = []));
  const pairs = [];
  for (let i = 0; i < gs.length; i++) for (let j = i + 1; j < gs.length; j++) {
    const a = gs[i], b = gs[j], d = Math.hypot(b.x - a.x, b.y - a.y), s = a.r + b.r;
    if (Math.abs(d - s) < 1.5) {
      adj[a.id].push([b, 'mesh']); adj[b.id].push([a, 'mesh']);
      pairs.push({ type: 'mesh', x: a.x + ((b.x - a.x) * a.r) / d, y: a.y + ((b.y - a.y) * a.r) / d });
    } else if (d < s - 1.5) {
      adj[a.id].push([b, 'jam']); adj[b.id].push([a, 'jam']);
      const f = d > 0 ? (a.r - (s - d) / 2) / d : 0;
      pairs.push({ type: 'jam', x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f });
    }
  }
  const motorGear = p.motor ? gs.find((g) => g.axle === p.motor) || null : null;
  const order = motorGear ? [motorGear, ...gs.filter((g) => g !== motorGear)] : gs;
  const info = {};
  for (const root of order) {
    if (info[root.id]) continue;
    info[root.id] = { root: root.id, k: 1, c: 0 };
    const comp = [root], q = [root];
    let jam = false;
    while (q.length) {
      const u = q.shift(), iu = info[u.id];
      for (const [v, type] of adj[u.id]) {
        if (type === 'jam') jam = true;
        const th = Math.atan2(v.y - u.y, v.x - u.x), ratio = u.teeth / v.teeth;
        const k2 = -ratio * iu.k, c2 = th + Math.PI + Math.PI / v.teeth - ratio * (iu.c - th);
        if (info[v.id]) { if (type === 'mesh' && Math.abs(info[v.id].k - k2) > 1e-6) jam = true; continue; }
        info[v.id] = { root: root.id, k: k2, c: c2 }; comp.push(v); q.push(v);
      }
    }
    comp.forEach((g) => (info[g.id].jam = jam));
  }
  // Keep the root gear where it was, so adding parts doesn't make gears jump.
  const phis = {};
  for (const g of gs) if (info[g.id].root === g.id) phis[g.id] = p.ang[g.id] || 0;
  p.phis = phis;
  return { gs, info, pairs, motorGear };
}
const gearAngle = (an, p, g) => { const i = an.info[g.id]; return i.k * (p.phis[i.root] || 0) + i.c; };

// ---------- Lesson check + hints ----------
function check(p, an) {
  if (!p.axles.length) return 'axle';
  const big = an.gs.find((g) => g.teeth === 24);
  if (!big) return 'big';
  if (!an.gs.some((g) => g.teeth === 8)) return 'small';
  if (!an.motorGear || an.motorGear.teeth !== 24) return 'motor';
  const mi = an.info[an.motorGear.id];
  if (mi.jam) return 'jam';
  const s = an.gs.find((g) => g.teeth === 8 && an.info[g.id].root === mi.root);
  if (!s) return 'touch';
  if (!p.motorOn) return 'on';
  if (Math.abs(Math.abs(an.info[s.id].k) - 3) > 1e-6) return 'ratio';
  return null;
}
function hintTarget(prob, an) {
  if (prob === 'jam') { const j = an.pairs.find((x) => x.type === 'jam'); if (j) return [j.x, j.y]; }
  const g = L1.ghosts;
  if (prob === 'small' || prob === 'touch' || prob === 'ratio') return [holeX(g[1].hx), holeY(g[1].hy)];
  if (prob === 'on') return null;
  return [holeX(g[0].hx), holeY(g[0].hy)];
}
function nextGhost(p) {
  for (const gh of L1.ghosts) {
    const ax = p.axles.find((a) => a.hx === gh.hx && a.hy === gh.hy);
    if (gh.type === 'axle' && !ax) return gh;
    if (gh.type === 'gear' && !(ax && p.gears.some((g) => g.axle === ax.id && g.teeth === gh.teeth))) return gh;
    if (gh.type === 'motor' && !(ax && p.motor === ax.id)) return gh;
  }
  return null;
}
function used(p) {
  return { axle: p.axles.length, g8: p.gears.filter((g) => g.teeth === 8).length, g16: p.gears.filter((g) => g.teeth === 16).length, g24: p.gears.filter((g) => g.teeth === 24).length, motor: p.motor ? 1 : 0 };
}

// ---------- Speech ----------
function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\n/g, ' '));
    u.lang = S.lang === 'de' ? 'de-DE' : 'en-GB'; u.rate = 0.9;
    speechSynthesis.speak(u);
  } catch (e) { /* no voice available */ }
}
const speakerIcon = `<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="#1F2430"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#1F2430" stroke-width="2" stroke-linecap="round"/></svg>`;
const logo = `<svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true"><rect x="2" y="10" width="32" height="22" rx="5" fill="#F2A33A"/><rect x="7" y="4" width="8" height="8" rx="3" fill="#F2A33A"/><rect x="21" y="4" width="8" height="8" rx="3" fill="#F2A33A"/><circle cx="12" cy="21" r="4" fill="#fff"/><circle cx="24" cy="21" r="4" fill="#fff"/></svg>`;
const check_ = (c = '#1E6E40') => `<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 9.5l4 4 8-9" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const lockIcon = `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
const bulb = `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Screens ----------
const app = document.getElementById('app');

function header(inLesson) {
  const L = t();
  const langSw = `<div class="lang" role="group" aria-label="Language / Sprache"><button data-act="lang" data-v="en" aria-pressed="${S.lang === 'en'}">EN</button><button data-act="lang" data-v="de" aria-pressed="${S.lang === 'de'}">DE</button></div>`;
  if (!inLesson) return `<header class="top"><button class="logo" data-act="map" aria-label="BrickL">${logo}<span>BrickL</span></button><span style="color:var(--muted)">${esc(L.tagline)}</span><span class="spacer"></span>${langSw}</header>`;
  const steps = L.steps.map((s, i) => `<button class="step ${i === S.step ? 'on' : i < S.step ? 'done' : ''}" data-act="step" data-v="${i}" ${i === S.step ? 'aria-current="step"' : ''}>${i < S.step ? check_() : i + 1 + ' '}${esc(s)}</button>`).join('');
  return `<header class="top"><button class="logo" data-act="map" aria-label="${esc(L.back)}">${logo}<span>BrickL</span></button>
    <div class="lesson-name"><small>${esc(L.lesson)} 1</small><b>${esc(L.lessons[0])}</b></div>
    <nav class="steps" aria-label="Steps">${steps}</nav>${langSw}
    ${S.step === 1 ? `<button class="btn" data-act="hint">${bulb}${esc(L.hint)}</button>` : ''}</header>`;
}

function renderMap() {
  const L = t();
  let n = 0;
  const tiers = MAP.map((ids, ti) => `<section class="tier"><h2>${ti + 1}. ${esc(L.tiers[ti])} <small>${esc(L.tierSub[ti])}</small></h2><div class="cards">${ids.map((id) => {
    n++;
    const open = id === 0, done = S.done.includes('l1') && id === 0;
    const cls = done ? 'done' : open ? 'open' : 'locked';
    const tag = done ? check_() + esc(L.doneTag) : open ? esc(L.start) + ' →' : lockIcon + esc(L.soon);
    return `<button class="lcard ${cls}" ${open ? 'data-act="open"' : 'aria-disabled="true"'}><span class="num">${esc(L.lesson)} ${n}</span><b>${esc(L.lessons[id])}</b><span class="tag">${tag}</span></button>`;
  }).join('')}</div></section>`).join('');
  app.innerHTML = header(false) + `<main class="map"><h1>${esc(L.path)}</h1>${tiers}</main><footer class="foot">${esc(L.disclaimer)}</footer>`;
}

function renderIdea() {
  const L = t();
  const r24 = radius(24), r8 = radius(8);
  app.innerHTML = header(true) + `<main class="idea">
    <svg class="pic" viewBox="0 0 460 300" role="img" aria-label="${esc(L.idea)}">
      <g transform="translate(170 150)"><g id="ig1">${gearSVG(24)}</g><text y="${r24 + 34}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="22" font-weight="800" fill="#1F2430">1×</text></g>
      <g transform="translate(${170 + r24 + r8} 150)"><g id="ig2">${gearSVG(8)}</g><text y="${r8 + 34}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="22" font-weight="800" fill="#1F2430">3×</text></g>
    </svg>
    <div class="say"><div class="row"><button class="speak" data-act="speak" aria-label="${esc(L.listen)}">${speakerIcon}</button></div>
      <p>${esc(L.idea)}</p><p class="sub">${esc(L.ideaSub)}</p>
      <div class="row"><button class="btn big" data-act="step" data-v="1">${esc(L.next)} →</button></div></div>
  </main>`;
}

function renderPlay() {
  const L = t(), p = S.play, u = used(p), st = L1.stock;
  const ng = nextGhost(p);
  const nextKey = ng ? (ng.type === 'gear' ? 'g' + ng.teeth : ng.type) : null;
  const items = [['axle', L.axle, ''], ['g24', L.gear + ' 24', L.big], ['g16', L.gear + ' 16', L.medium], ['g8', L.gear + ' 8', L.small], ['motor', L.motor, '']]
    .map(([k, name, sub]) => {
      const left = st[k] - u[k];
      return `<button class="titem ${left <= 0 ? 'empty' : ''} ${k === nextKey && left > 0 ? 'next' : ''}" data-part="${k}" aria-label="${esc(name)}, ${left} ${esc(L.left)}">${icon(k)}<span><b>${esc(name)}</b><small>${sub ? esc(sub) + ' · ' : ''}×${left}</small></span></button>`;
    }).join('');
  app.innerHTML = header(true) + `<main class="play">
    <aside class="tray" aria-label="${esc(L.parts)}"><h3>${esc(L.parts)}</h3><p class="tip">${esc(L.dragTip)}</p>${items}</aside>
    <div class="boardwrap">
      <div class="goal"><small>${esc(L.goal)}</small><span>${esc(L.goal1)}</span></div>
      <section class="board" id="board" aria-label="Board"><svg id="bsvg" viewBox="0 0 ${BW} ${BH}" preserveAspectRatio="xMidYMid meet"></svg>
        ${S.toast ? `<div class="toast" role="status">${esc(S.toast)}</div>` : ''}
      </section>
      <div class="controls">
        <button class="toggle" data-act="motor" aria-pressed="${p.motorOn}"><span class="track"></span>${esc(L.motorBtn)}</button>
        <button class="chip" data-act="flip">${flipIcon}${esc(L.flip)}</button>
        <button class="chip" data-act="helpers" aria-pressed="${p.helpers}">${eyeIcon}${esc(L.helpers)}</button>
        <span class="spacer"></span>
        <button class="btn big" data-act="test">${esc(L.test)}</button>
      </div>
    </div></main>` + panelHTML();
  S.an = analyze(p);
  drawBoard();
}
const flipIcon = `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M18.5 2.5v4.5H14M5.5 21.5V17H10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const eyeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`;

function fmtSpeed(k) {
  const a = Math.abs(k);
  if (a >= 1 - 1e-6) return (Math.round(a * 10) / 10) + '×';
  return '1/' + Math.round(1 / a) + '×';
}

function drawBoard() {
  const svg = document.getElementById('bsvg');
  if (!svg) return;
  const p = S.play, an = S.an;
  let out = '';
  // Technic wall: one beam per row
  for (let r = 0; r < ROWS; r++) {
    out += `<rect x="${OX - 26}" y="${holeY(r) - 20}" width="${(COLS - 1) * U + 52}" height="40" rx="20" fill="#3A4150"/>`;
    for (let c = 0; c < COLS; c++) out += `<circle cx="${holeX(c)}" cy="${holeY(r)}" r="12" fill="#F3EFE6"/>`;
  }
  // Ghosts
  const showAll = S.hintLevel >= 3;
  const gl = showAll ? L1.ghosts : [nextGhost(p)].filter(Boolean);
  for (const gh of gl) {
    const x = holeX(gh.hx), y = holeY(gh.hy);
    if (gh.type === 'axle') out += `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="#F2A33A" stroke-width="4" stroke-dasharray="6 5" class="pulse"/>`;
    if (gh.type === 'gear') out += `<g transform="translate(${x} ${y})" class="pulse">${gearSVG(gh.teeth, { ghost: true })}</g>`;
    if (gh.type === 'motor') out += `<g transform="translate(${x} ${y})" class="pulse" opacity=".5"><rect x="-26" y="14" width="52" height="24" rx="8" fill="none" stroke="#1F2430" stroke-width="3" stroke-dasharray="6 5"/></g>`;
  }
  // Bare axles
  for (const a of p.axles) if (!p.gears.some((g) => g.axle === a.id)) out += `<g transform="translate(${holeX(a.hx)} ${holeY(a.hy)})" data-aid="${a.id}" style="cursor:pointer"><circle r="22" fill="transparent"/>${axleEnd()}</g>`;
  // Gears
  for (const g of an.gs) {
    const deg = (gearAngle(an, p, g) * 180) / Math.PI;
    out += `<g transform="translate(${g.x} ${g.y})" data-gid="${g.id}" style="cursor:grab"><g id="rot-${g.id}" transform="rotate(${deg.toFixed(2)})">${gearSVG(g.teeth)}</g></g>`;
  }
  // Motor
  if (p.motor) { const a = p.axles.find((x) => x.id === p.motor); out += `<g transform="translate(${holeX(a.hx)} ${holeY(a.hy)})" data-mid="1" style="cursor:pointer">${motorBadge()}</g>`; }
  // Mesh / jam marks
  for (const pr of an.pairs) out += pr.type === 'mesh'
    ? `<circle cx="${pr.x}" cy="${pr.y}" r="7" fill="#1E8A4C" stroke="#fff" stroke-width="2.5" pointer-events="none"/>`
    : `<g transform="translate(${pr.x} ${pr.y})" pointer-events="none"><circle r="13" fill="#C93C3C" stroke="#fff" stroke-width="2.5"/><text y="6" text-anchor="middle" font-size="18" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">!</text></g>`;
  // Helpers: speed and direction
  if (p.helpers) for (const g of an.gs) {
    const inf = an.info[g.id];
    const driven = an.motorGear && inf.root === an.motorGear.id && !inf.jam;
    const label = driven ? `${g.teeth} · ${fmtSpeed(inf.k)}` : `${g.teeth}`;
    const w = label.length * 9 + 18;
    out += `<g transform="translate(${g.x} ${g.y + g.r + 22})" pointer-events="none"><rect x="${-w / 2}" y="-14" width="${w}" height="28" rx="9" fill="#1F2430"/><text y="6" text-anchor="middle" font-size="16" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">${label}</text></g>`;
    if (driven && p.motorOn) {
      const R = g.r + 14, cw = inf.k * (p.reverse ? -1 : 1) > 0;
      const a0 = (-150 * Math.PI) / 180, a1 = (-30 * Math.PI) / 180;
      const x0 = R * Math.cos(a0), y0 = R * Math.sin(a0), x1 = R * Math.cos(a1), y1 = R * Math.sin(a1);
      const col = GEAR_COL[g.teeth][1];
      out += `<g transform="translate(${g.x} ${g.y}) scale(${cw ? 1 : -1} 1)" pointer-events="none"><path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round"/><path d="M${(x1 + 9).toFixed(1)},${(y1 + 2).toFixed(1)} L${(x1 - 5).toFixed(1)},${(y1 - 6).toFixed(1)} L${(x1 - 3).toFixed(1)},${(y1 + 9).toFixed(1)}Z" fill="${col}"/></g>`;
    }
  }
  // Hint: point
  if (S.hintLevel >= 2 && !S.win) {
    const pr = check(p, an), tg = pr && hintTarget(pr, an);
    if (tg) out += `<circle cx="${tg[0]}" cy="${tg[1]}" r="44" fill="none" stroke="#F2A33A" stroke-width="7" class="blink" pointer-events="none"/>`;
  }
  // Selection: remove button
  if (p.sel) {
    const pos = selPos(p.sel);
    if (pos) out += `<g transform="translate(${pos[0]} ${pos[1]})" data-del="1" style="cursor:pointer" role="button" aria-label="Remove"><circle r="22" fill="#C93C3C" stroke="#fff" stroke-width="3"/><path d="M-7,-7 L7,7 M7,-7 L-7,7" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></g>`;
  }
  svg.innerHTML = out;
}
function selPos(sel) {
  const p = S.play;
  if (sel.kind === 'gear') { const g = S.an.gs.find((x) => x.id === sel.id); return g ? [g.x + g.r * 0.72, g.y - g.r * 0.72] : null; }
  if (sel.kind === 'axle') { const a = p.axles.find((x) => x.id === sel.id); return a ? [holeX(a.hx) + 26, holeY(a.hy) - 26] : null; }
  if (sel.kind === 'motor' && p.motor) { const a = p.axles.find((x) => x.id === p.motor); return [holeX(a.hx) + 40, holeY(a.hy) + 26]; }
  return null;
}

function panelHTML() {
  const L = t();
  if (S.win) return `<div class="overlay"><div class="panel" role="dialog" aria-modal="true"><h2>${esc(L.win)}</h2><p>${esc(L.winSub)}</p><button class="btn big" data-act="step" data-v="2">${esc(L.toBuild)} →</button></div></div>`;
  if (!S.panel) return '';
  const p = S.play, prob = check(p, S.an || analyze(p));
  let body = '';
  if (S.panel === 'fail') {
    body = `<h2>${esc(S.fails >= 2 ? L.fail2 : L.fail1)}</h2><div class="row" style="justify-content:center">` +
      (S.fails >= 2 ? `<button class="btn dark" data-act="hint">${bulb}${esc(L.getHint)}</button>` : '') + `<button class="btn" data-act="close">${esc(L.ok)}</button></div>`;
  } else if (S.panel === 'hint') {
    const lines = [prob ? L.prob[prob] : L.prob.done];
    if (S.hintLevel === 2) lines.push(L.pointText);
    if (S.hintLevel >= 3) lines.push(L.showText);
    body = `<div class="hintbox">${lines.map((x) => `<p>${esc(x)}</p>`).join('')}</div><div class="row" style="justify-content:center">` +
      (S.hintLevel < 3 ? `<button class="btn dark" data-act="hint">${bulb}${esc(L.moreHint)}</button>` : '') + `<button class="btn" data-act="close">${esc(L.ok)}</button></div>`;
  }
  return `<div class="overlay"><div class="panel" role="dialog" aria-modal="true">${body}</div></div>`;
}

// ---------- Build step ----------
const BUILD_PARTS = [['beam9', 1], ['axle4', 2], ['g24', 1], ['g8', 1], ['bush', 2]];
function buildScene(i) {
  // Side view of a 9-hole beam. Axles in hole 2 and 4 (2 holes apart).
  const bx = 110, by = 128, hx = (n) => bx + n * U;
  let s = `<svg class="scene" viewBox="0 0 760 270" role="img" aria-label="${esc(t().b[Math.min(i, 5)])}">`;
  const hl = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#F2A33A" stroke-width="5" stroke-dasharray="8 6" class="pulse"/>`;
  s += `<rect x="${bx - 26}" y="${by - 20}" width="${8 * U + 52}" height="40" rx="20" fill="#3A4150"/>`;
  for (let n = 0; n < 9; n++) s += `<circle cx="${hx(n)}" cy="${by}" r="12" fill="#F3EFE6"/><text x="${hx(n)}" y="${by + 112}" text-anchor="middle" font-size="15" font-weight="800" fill="#5B6270" font-family="Nunito, sans-serif">${n + 1}</text>`;
  if (i === 0) s += `<rect x="${bx - 32}" y="${by - 26}" width="${8 * U + 64}" height="52" rx="26" fill="none" stroke="#F2A33A" stroke-width="5" stroke-dasharray="8 6" class="pulse"/>`;
  if (i >= 1 && i < 3) s += `<g transform="translate(${hx(1)} ${by})">${axleEnd()}</g>`;
  if (i >= 2 && i < 4) s += `<g transform="translate(${hx(3)} ${by})">${axleEnd()}</g>`;
  if (i >= 3) s += `<g transform="translate(${hx(1)} ${by}) rotate(0)">${gearSVG(24)}</g>`;
  if (i >= 4) s += `<g transform="translate(${hx(3)} ${by}) rotate(${(Math.PI + Math.PI / 8) * 180 / Math.PI})">${gearSVG(8)}</g>`;
  if (i === 1) s += hl(hx(1), by, 24);
  if (i === 2) s += hl(hx(3), by, 24);
  if (i === 3) s += hl(hx(1), by, radius(24) + 12);
  if (i === 4) s += hl(hx(3), by, radius(8) + 12);
  if (i === 5) {
    // Top view inset: front gear | beam | bush at the back
    const L = t();
    s += `<g transform="translate(600 40)"><rect x="-10" y="-10" width="160" height="190" rx="16" fill="#FAF8F3" stroke="#E3DED3" stroke-width="2"/>
      <rect x="62" y="10" width="10" height="150" rx="2" fill="#1F2430"/>
      <rect x="24" y="44" width="86" height="12" rx="3" fill="#F2A33A" stroke="#B86E0F" stroke-width="2"/>
      <rect x="20" y="72" width="94" height="24" rx="8" fill="#3A4150"/>
      <rect x="48" y="112" width="38" height="18" rx="4" fill="#9AA3B2" stroke="#5B6270" stroke-width="2"/>
      <circle cx="67" cy="121" r="26" fill="none" stroke="#F2A33A" stroke-width="4" stroke-dasharray="6 5" class="pulse"/>
      <text x="70" y="30" text-anchor="middle" font-size="14" font-weight="800" fill="#5B6270" font-family="Nunito, sans-serif">${esc(L.front)} ↑</text>
      <text x="70" y="175" text-anchor="middle" font-size="14" font-weight="800" fill="#5B6270" font-family="Nunito, sans-serif">${esc(L.backSide)} ↓</text></g>`;
  }
  return s + '</svg>';
}
function renderBuild() {
  const L = t(), B = S.build;
  let main = '';
  if (B.i === 0) {
    main = `<h2>${esc(L.findParts)}</h2><div class="pcards">${BUILD_PARTS.map(([k, n]) => `<button class="pcard" data-act="have" data-v="${k}" aria-pressed="${!!B.have[k]}">${icon(k, 64, 50)}<span class="cnt">×${n}</span><span class="nm">${esc(L[k === 'g24' ? 'gear24' : k === 'g8' ? 'gear8' : k])}</span></button>`).join('')}</div>
      <p class="note">${esc(L.missing)}</p><button class="btn big" data-act="bnext">${esc(L.haveAll)} →</button>`;
  } else if (B.i <= 6) {
    const si = B.i - 1;
    main = `<div class="dots" aria-hidden="true">${L.b.map((_, k) => `<i class="${k === si ? 'on' : ''}"></i>`).join('')}</div>
      <p class="instr"><button class="speak" data-act="speak" aria-label="${esc(L.listen)}">${speakerIcon}</button><span>${si + 1}. ${esc(L.b[si])}</span></p>${buildScene(si)}
      <div class="row"><button class="btn" data-act="bprev">← ${esc(L.back)}</button><button class="btn big" data-act="bnext">${esc(L.next)} →</button></div>`;
  } else if (B.i === 7) {
    const fb = B.answer == null ? '' : B.answer === 3 ? L.right : L.wrong;
    main = `<p class="instr"><button class="speak" data-act="speak" aria-label="${esc(L.listen)}">${speakerIcon}</button><span>${esc(L.testQ)}</span></p>
      <div class="answers">${[1, 2, 3, 4].map((n) => `<button data-act="answer" data-v="${n}" class="${B.answer === n ? (n === 3 ? 'right' : 'wrong') : ''}">${n}</button>`).join('')}</div>
      <p class="feedback" role="status">${esc(fb)}</p>
      <div class="row"><button class="btn" data-act="bprev">← ${esc(L.back)}</button>${B.answer === 3 ? `<button class="btn big" data-act="bnext">${esc(L.finish)} →</button>` : ''}</div>`;
  } else {
    main = `<div class="badge">${icon('g24', 110, 110)}</div><h2>${esc(L.done)}</h2><p class="instr">${esc(L.tool)}</p><button class="btn big" data-act="map">${esc(L.toMap)}</button>`;
  }
  app.innerHTML = header(true) + `<main class="build">${main}</main>`;
}

function render() {
  document.documentElement.lang = S.lang;
  if (S.screen === 'map') return renderMap();
  if (S.step === 0) return renderIdea();
  if (S.step === 1) return renderPlay();
  return renderBuild();
}

// ---------- Actions ----------
let toastTimer = null;
function toast(msg) {
  S.toast = msg; renderPlay();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { S.toast = null; if (S.screen === 'lesson' && S.step === 1) { const el = document.querySelector('.toast'); if (el) el.remove(); } }, 3200);
}
function structureChanged() {
  const p = S.play;
  S.an = analyze(p);
  if (S.an.motorGear && S.an.info[S.an.motorGear.id].jam && p.motorOn) { toast(t().jamToast); return; }
  renderPlay();
}

app.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act, v = b.dataset.v, L = t(), p = S.play;
  switch (act) {
    case 'lang': S.lang = v; save(); render(); break;
    case 'map': S.screen = 'map'; render(); break;
    case 'open': S.screen = 'lesson'; S.step = 0; S.win = false; S.panel = null; S.build = { i: 0, have: {}, answer: null }; render(); break;
    case 'step': S.step = +v; S.panel = null; S.win = false; if (S.step === 2) S.build.i = 0; render(); break;
    case 'speak':
      if (S.step === 0) speak(L.idea + ' ' + L.ideaSub);
      else if (S.build.i >= 1 && S.build.i <= 6) speak(L.b[S.build.i - 1]);
      else speak(L.testQ);
      break;
    case 'motor': p.motorOn = !p.motorOn; structureChanged(); break;
    case 'flip': p.reverse = !p.reverse; renderPlay(); break;
    case 'helpers': p.helpers = !p.helpers; renderPlay(); break;
    case 'test': {
      const prob = check(p, S.an);
      if (!prob) { S.win = true; S.panel = null; }
      else { S.fails++; S.panel = 'fail'; }
      renderPlay(); break;
    }
    case 'hint': S.hintLevel = Math.min(3, S.hintLevel + 1); S.panel = 'hint'; renderPlay(); break;
    case 'close': S.panel = null; renderPlay(); break;
    case 'have': S.build.have[v] = !S.build.have[v]; renderBuild(); break;
    case 'bnext':
      S.build.i++;
      if (S.build.i === 8 && !S.done.includes('l1')) { S.done.push('l1'); save(); }
      renderBuild(); break;
    case 'bprev': S.build.i = Math.max(0, S.build.i - 1); S.build.answer = null; renderBuild(); break;
    case 'answer': S.build.answer = +v; renderBuild(); break;
  }
});

// ---------- Board: dragging parts in, turning gears, removing parts ----------
const dragLayer = document.getElementById('drag-layer');
let drag = null;   // dragging a part from the tray
let turn = null;   // turning a gear with a finger
let tap = null;    // tapping a placed part

function svgPt(cx, cy) {
  const svg = document.getElementById('bsvg');
  const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}
function overBoard(cx, cy) {
  const b = document.getElementById('board');
  if (!b) return false;
  const r = b.getBoundingClientRect();
  return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
}

function tryDrop(kind, x, y) {
  const p = S.play, L = t();
  const left = L1.stock[kind] - used(p)[kind];
  if (left <= 0) return toast(L.noneLeft);
  const nearestAxle = () => {
    let best = null, bd = U * 0.75;
    for (const a of p.axles) { const d = Math.hypot(holeX(a.hx) - x, holeY(a.hy) - y); if (d < bd) { bd = d; best = a; } }
    return best;
  };
  if (kind === 'axle') {
    const hx = Math.round((x - OX) / U), hy = Math.round((y - OY) / U);
    if (hx < 0 || hy < 0 || hx >= COLS || hy >= ROWS || Math.hypot(holeX(hx) - x, holeY(hy) - y) > U * 0.6) return toast(L.dropAxle);
    if (p.axles.some((a) => a.hx === hx && a.hy === hy)) return toast(L.dropAxle);
    p.axles.push({ id: 'a' + p.nextId++, hx, hy });
  } else if (kind === 'motor') {
    const a = nearestAxle();
    if (!a) return toast(L.dropMotor);
    p.motor = a.id;
  } else {
    const a = nearestAxle();
    if (!a) return toast(L.dropGear);
    if (p.gears.some((g) => g.axle === a.id)) return toast(L.full);
    p.gears.push({ id: 'g' + p.nextId++, axle: a.id, teeth: +kind.slice(1) });
  }
  p.sel = null;
  structureChanged();
}

function removeSel() {
  const p = S.play, sel = p.sel;
  if (!sel) return;
  if (sel.kind === 'gear') p.gears = p.gears.filter((g) => g.id !== sel.id);
  if (sel.kind === 'axle') {
    p.gears = p.gears.filter((g) => g.axle !== sel.id);
    if (p.motor === sel.id) { p.motor = null; p.motorOn = false; }
    p.axles = p.axles.filter((a) => a.id !== sel.id);
  }
  if (sel.kind === 'motor') { p.motor = null; p.motorOn = false; }
  p.sel = null;
  structureChanged();
}

document.addEventListener('pointerdown', (e) => {
  if (S.screen !== 'lesson' || S.step !== 1 || S.panel || S.win) return;
  const item = e.target.closest('.titem');
  if (item) {
    e.preventDefault();
    const kind = item.dataset.part;
    drag = { kind, x0: e.clientX, y0: e.clientY, moved: false, el: null };
    return;
  }
  const svg = document.getElementById('bsvg');
  if (!svg || !svg.contains(e.target)) return;
  e.preventDefault();
  const p = S.play;
  if (e.target.closest('[data-del]')) { removeSel(); return; }
  const gEl = e.target.closest('[data-gid]'), aEl = e.target.closest('[data-aid]'), mEl = e.target.closest('[data-mid]');
  if (mEl) { tap = { kind: 'motor', id: 'motor' }; return; }
  if (gEl) {
    const g = S.an.gs.find((x) => x.id === gEl.dataset.gid), pt = svgPt(e.clientX, e.clientY);
    turn = { g, last: Math.atan2(pt.y - g.y, pt.x - g.x), total: 0 };
    tap = { kind: 'gear', id: g.id };
    try { svg.setPointerCapture(e.pointerId); } catch (_) {}
    return;
  }
  if (aEl) { tap = { kind: 'axle', id: aEl.dataset.aid }; return; }
  if (p.sel) { p.sel = null; drawBoard(); }
});

document.addEventListener('pointermove', (e) => {
  if (drag) {
    if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 6) {
      drag.moved = true;
      drag.el = document.createElement('div');
      drag.el.className = 'dragging';
      const big = drag.kind[0] === 'g' ? radius(+drag.kind.slice(1)) * 2.2 : 64;
      drag.el.innerHTML = icon(drag.kind, big, big);
      dragLayer.appendChild(drag.el);
    }
    if (drag.el) { drag.el.style.left = e.clientX + 'px'; drag.el.style.top = e.clientY + 'px'; }
    return;
  }
  if (turn) {
    const g = turn.g, inf = S.an.info[g.id];
    const pt = svgPt(e.clientX, e.clientY), a = Math.atan2(pt.y - g.y, pt.x - g.x);
    let d = a - turn.last; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU;
    turn.last = a; turn.total += Math.abs(d);
    if (turn.total > 0.08) tap = null;
    if (!inf.jam) S.play.phis[inf.root] = (S.play.phis[inf.root] || 0) + d / inf.k;
  }
});

document.addEventListener('pointerup', (e) => {
  if (drag) {
    const d = drag; drag = null;
    if (d.el) d.el.remove();
    if (d.moved) { if (overBoard(e.clientX, e.clientY)) { const pt = svgPt(e.clientX, e.clientY); tryDrop(d.kind, pt.x, pt.y); } }
    else {
      // Tap on a tray part: place it on the next ghost spot if it matches.
      const ng = nextGhost(S.play);
      const key = ng ? (ng.type === 'gear' ? 'g' + ng.teeth : ng.type) : null;
      if (key === d.kind) tryDrop(d.kind, holeX(ng.hx), holeY(ng.hy));
      else toast(t().dragTip);
    }
    return;
  }
  if (turn && S.an.info[turn.g.id] && S.an.info[turn.g.id].jam && turn.total > 0.08) toast(t().jamToast);
  turn = null;
  if (tap) {
    const p = S.play, same = p.sel && p.sel.kind === tap.kind && p.sel.id === tap.id;
    p.sel = same ? null : { kind: tap.kind, id: tap.id };
    tap = null;
    drawBoard();
  }
});
document.addEventListener('pointercancel', () => { if (drag && drag.el) drag.el.remove(); drag = null; turn = null; tap = null; });

// ---------- Animation ----------
let lastT = performance.now(), ideaA = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
  if (S.screen === 'lesson' && S.step === 0) {
    ideaA += dt * 0.9;
    const g1 = document.getElementById('ig1'), g2 = document.getElementById('ig2');
    if (g1 && g2) {
      const a2 = Math.PI + Math.PI / 8 - 3 * ideaA;
      g1.setAttribute('transform', `rotate(${(ideaA * 180 / Math.PI).toFixed(2)})`);
      g2.setAttribute('transform', `rotate(${(a2 * 180 / Math.PI).toFixed(2)})`);
    }
  }
  if (S.screen === 'lesson' && S.step === 1 && S.an) {
    const p = S.play, an = S.an;
    if (p.motorOn && an.motorGear && !an.info[an.motorGear.id].jam) p.phis[an.motorGear.id] = (p.phis[an.motorGear.id] || 0) + (p.reverse ? -1 : 1) * 1.4 * dt;
    for (const g of an.gs) {
      const a = gearAngle(an, p, g);
      p.ang[g.id] = a;
      const el = document.getElementById('rot-' + g.id);
      if (el) el.setAttribute('transform', `rotate(${(a * 180 / Math.PI).toFixed(2)})`);
    }
  }
  requestAnimationFrame(frame);
}

render();
requestAnimationFrame(frame);
