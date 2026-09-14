/* ============================================================
   1. UI — loader, nav, reveals, counters, testimonials, tilt
   ============================================================ */
const RM  = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB = matchMedia('(max-width: 900px)').matches;
const clamp = (v,a,b)=>Math.min(b,Math.max(a,v));
const lerp  = (a,b,t)=>a+(b-a)*t;

/* marquee */
(() => {
  const words = ['Architecture','Interior Design','Construction Management','Turnkey Execution',
                 'Space Planning','Custom Furniture','Site Supervision','Ahmedabad'];
  const row = document.getElementById('mq');
  if (row) row.innerHTML = [...words, ...words].map(w => `<span>${w}</span>`).join('');
})();

/* ---- loader: the drawing is set out, then the shutters open ---- */
(() => {
  const ld  = document.getElementById('loader');
  const bar = document.getElementById('ldBar');
  const pct = document.getElementById('ldPct');
  const msg = document.getElementById('ldMsg');
  if (!ld) { document.body.classList.add('ready', 'curtain-up'); return; }

  /* every stroke gets its own dash length so it draws at its own pace */
  ld.querySelectorAll('[data-draw]').forEach((el, i) => {
    const len = el.getTotalLength ? Math.ceil(el.getTotalLength()) : 400;
    el.style.setProperty('--len', len);
    el.style.animationDelay = (i * .055) + 's';
  });

  /* three stages, not five — at this speed five is a flicker, not a read */
  const STAGES = ['Setting out the grid','Framing the walls','Handing over the keys'];
  let p = 0, stage = -1;
  const finish = () => {
    ld.classList.add('done');
    document.body.classList.add('ready');
    /* the shutters need ~1.05s to clear; only then do the page's own
       drawings start, so they are not spent behind the curtain */
    setTimeout(() => { ld.remove(); document.body.classList.add('curtain-up'); }, 1100);
  };
  const tick = setInterval(() => {
    p = Math.min(100, p + 6 + Math.random() * 10);
    if (bar) bar.style.width = p + '%';
    if (pct) pct.textContent = Math.round(p) + '%';
    const s = Math.min(STAGES.length - 1, Math.floor(p / (100 / STAGES.length)));
    if (msg && s !== stage) { stage = s; msg.style.opacity = 0;
      setTimeout(() => { msg.textContent = STAGES[s]; msg.style.opacity = 1; }, 130); }
    if (p >= 100) { clearInterval(tick); setTimeout(finish, 380); }
  }, 140);
  /* never let a stuck loader hide the page */
  setTimeout(() => { clearInterval(tick); finish(); }, 3400);
})();

/* ---- measured drawings: each stroke draws at its own pace ---- */
document.querySelectorAll('.dwg').forEach(svg => {
  svg.querySelectorAll('[data-draw]').forEach((el, i) => {
    el.style.setProperty('--len', el.getTotalLength ? Math.ceil(el.getTotalLength()) : 700);
    el.style.setProperty('--i', i);
  });
});

/* ---- nav + mobile menu ---- */
const nav = document.getElementById('nav'), menu = document.getElementById('menu');
const burger = document.getElementById('burger');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
}
if (burger && menu) burger.onclick = () => {
  const open = menu.classList.toggle('open');
  document.body.classList.toggle('is-locked', open);
  burger.setAttribute('aria-expanded', open);
};
if (menu) menu.querySelectorAll('a').forEach(a => a.onclick = () => {
  menu.classList.remove('open'); document.body.classList.remove('is-locked');
});

/* ---- scroll reveals ---- */
const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ---- number counters ---- */
const cio = new IntersectionObserver((es) => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, to = +el.dataset.count; let t0 = null;
  const run = (ts) => {
    t0 ??= ts; const k = clamp((ts - t0) / 1400, 0, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + (el.dataset.suffix || '');
    if (k < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run); cio.unobserve(el);
}), { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* ---- clients: one quote, switched from the segmented bar ---- */
(() => {
  const box = document.getElementById('vx');
  if (!box) return;
  const tabs = [...box.querySelectorAll('.vx__pick button')];
  const qEl = document.getElementById('vxQuote'), nEl = document.getElementById('vxName'),
        mEl = document.getElementById('vxMeta'), iEl = document.getElementById('vxIni'),
        cEl = document.getElementById('vxCount');
  const HOLD = 7000;
  let at = 0, timer;

  const show = (i) => {
    at = i; const b = tabs[i];
    box.classList.add('swap');
    tabs.forEach((x, k) => {
      x.classList.toggle('on', k === i);
      const bar = x.querySelector('i');
      if (!bar) return;
      bar.style.transition = 'none'; bar.style.height = '0%';
      if (k === i && !RM) requestAnimationFrame(() => requestAnimationFrame(() => {
        bar.style.transition = `height ${HOLD}ms linear`; bar.style.height = '100%';
      }));
    });
    setTimeout(() => {
      qEl.textContent = '\u201c' + b.dataset.quote + '\u201d';
      nEl.textContent = b.dataset.name;
      mEl.textContent = b.dataset.meta;
      iEl.textContent = b.dataset.name.split(' ').map(w => w[0]).join('').slice(0, 2);
      if (cEl) cEl.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(tabs.length).padStart(2, '0');
      box.classList.remove('swap');
    }, 300);
  };
  const auto = () => { if (RM) return; clearInterval(timer); timer = setInterval(() => show((at + 1) % tabs.length), HOLD); };

  tabs.forEach((b, i) => { b.onclick = () => { show(i); auto(); }; });
  show(0); auto();
})();

/* ---- project card tilt ---- */
if (!MOB && !RM) document.querySelectorAll('[data-tilt]').forEach(card => {
  const media = card.querySelector('.card__media');
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    media.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(14px)`;
  });
  card.addEventListener('pointerleave', () => media.style.transform = '');
});
