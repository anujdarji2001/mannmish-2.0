/* ============================================================
   1. UI  —  loader, nav, reveals, counters, accordion, tilt
   ============================================================ */
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB = matchMedia('(max-width: 760px)').matches;
const clamp = (v,a,b)=>Math.min(b,Math.max(a,v));
const lerp  = (a,b,t)=>a+(b-a)*t;

/* marquee */
(() => {
  const words = ['Architecture','Interior Design','Construction Management','Turnkey Execution',
                 'Space Planning','Custom Furniture','Site Supervision','Ahmedabad'];
  const row = document.getElementById('mq');
  if (row) row.innerHTML = [...words, ...words].map(w => `<span>${w}</span>`).join('');
})();

/* loader */
(() => {
  const bar = document.getElementById('ldBar'), pct = document.getElementById('ldPct'), ld = document.getElementById('loader');
  if (!ld) { document.body.classList.add('ready'); return; }
  let p = 0;
  const finish = () => { ld.classList.add('done'); document.body.classList.add('ready'); };
  const tick = setInterval(() => {
    p = Math.min(100, p + Math.random() * 18);
    if (bar) bar.style.width = p + '%';
    if (pct) pct.textContent = Math.round(p) + '%';
    if (p >= 100) { clearInterval(tick); setTimeout(finish, 350); }
  }, 130);
  /* never let a stuck loader hide the page */
  setTimeout(() => { clearInterval(tick); finish(); }, 4000);
})();

/* nav + mobile menu */
const nav = document.getElementById('nav'), menu = document.getElementById('menu');
const burger = document.getElementById('burger');
if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });
if (burger && menu) burger.onclick = () => {
  menu.classList.toggle('open'); document.body.classList.toggle('is-locked', menu.classList.contains('open'));
};
if (menu) menu.querySelectorAll('a').forEach(a => a.onclick = () => {
  menu.classList.remove('open'); document.body.classList.remove('is-locked');
});

/* scroll reveals */
const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* number counters */
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

/* expertise accordion */
document.querySelectorAll('.srv').forEach(s => s.querySelector('.srv__hd').onclick = () => {
  const open = s.classList.contains('open');
  document.querySelectorAll('.srv').forEach(x => x.classList.remove('open'));
  if (!open) s.classList.add('open');
});

/* project card tilt */
if (!MOB && !RM) document.querySelectorAll('[data-tilt]').forEach(card => {
  const media = card.querySelector('.card__media');
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    media.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(18px)`;
  });
  card.addEventListener('pointerleave', () => media.style.transform = '');
});
