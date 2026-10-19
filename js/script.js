document.getElementById('year').textContent = new Date().getFullYear();

const toggle = document.getElementById('nav-toggle');
const nav = document.getElementById('main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* Header shrinks + gains shadow on scroll */
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Hero: network background. Dots drift and link up; they reach for the cursor or finger. */
const net = document.getElementById('hero-net');
if (net) {
  const hero = net.parentElement;
  const ctx = net.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, pts = [], pointer = null, running = false, frame = 0;
  const loop = () => { frame = 0; draw(); if (running && !reduceMotion) frame = requestAnimationFrame(loop); };

  const resize = () => {
    w = net.width = net.offsetWidth * dpr;
    h = net.height = net.offsetHeight * dpr;
    const count = Math.min(90, Math.round(net.offsetWidth * net.offsetHeight / 12000));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .4 * dpr, vy: (Math.random() - .5) * .4 * dpr
    }));
  };

  const link = 130 * dpr, reach = 170 * dpr;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      if (!reduceMotion) { p.x += p.vx; p.y += p.vy; }
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    ctx.lineWidth = dpr;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = `rgba(46,125,225,${(1 - d / link) * .22})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      let near = false;
      if (pointer) {
        const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (d < reach) {
          near = true;
          ctx.strokeStyle = `rgba(11,42,82,${(1 - d / reach) * .45})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
        }
      }
      ctx.fillStyle = near ? 'rgba(11,42,82,.75)' : 'rgba(46,125,225,.45)';
      ctx.beginPath(); ctx.arc(a.x, a.y, 2 * dpr, 0, Math.PI * 2); ctx.fill();
    }
  };

  const setPointer = (e) => {
    const r = net.getBoundingClientRect(), t = e.touches ? e.touches[0] : e;
    pointer = { x: (t.clientX - r.left) * dpr, y: (t.clientY - r.top) * dpr };
    if (reduceMotion) draw();
  };
  hero.addEventListener('mousemove', setPointer);
  hero.addEventListener('touchmove', setPointer, { passive: true });
  hero.addEventListener('mouseleave', () => { pointer = null; });
  hero.addEventListener('touchend', () => { pointer = null; });
  window.addEventListener('resize', () => { resize(); if (!running || reduceMotion) draw(); });

  resize();
  /* Only animate while the hero is on screen */
  new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting;
    if (running && !reduceMotion && !frame) frame = requestAnimationFrame(loop);
  }).observe(hero);
  draw();
}

/* Hero: headline word flip */
const rot = document.getElementById('hero-rot');
if (rot && !reduceMotion) {
  const words = [...rot.children];
  let i = 0;
  setInterval(() => {
    const cur = words[i], next = words[(i + 1) % words.length];
    cur.classList.remove('in'); cur.classList.add('out');
    next.classList.remove('out'); next.classList.add('in');
    setTimeout(() => cur.classList.remove('out'), 650);
    i = (i + 1) % words.length;
  }, 2200);
}

/* Scroll-triggered reveal animations */
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => observer.observe(el));
}
