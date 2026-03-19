/* ═══════════════════════════════════════════════════════════════════════════
   EXPERIENCE.JS — pazent.fr
   Premium interactions. Subtle. Professional. Immersive.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const isMobile = () => window.innerWidth < 768 || 'ontouchstart' in window;

  /* ─── 1. MAGNETIC CURSOR (custom cursor professionnel) ─── */
  function initCursor() {
    if (isMobile()) return;

    const style = document.createElement('style');
    style.textContent = `
      * { cursor: none !important; }
      #cursor-dot {
        position: fixed; top: 0; left: 0; width: 6px; height: 6px;
        background: #fff; border-radius: 50%;
        pointer-events: none; z-index: 999999;
        transform: translate(-50%, -50%);
        transition: width .15s, height .15s, background .15s, opacity .15s;
        mix-blend-mode: difference;
      }
      #cursor-ring {
        position: fixed; top: 0; left: 0; width: 36px; height: 36px;
        border: 1px solid rgba(110,0,255,0.6); border-radius: 50%;
        pointer-events: none; z-index: 999998;
        transform: translate(-50%, -50%);
        transition: width .3s cubic-bezier(.16,1,.3,1), height .3s cubic-bezier(.16,1,.3,1),
                    border-color .3s, opacity .2s;
      }
      #cursor-ring.hover {
        width: 56px; height: 56px;
        border-color: rgba(110,0,255,0.9);
        background: rgba(110,0,255,0.06);
      }
      #cursor-ring.click {
        width: 28px; height: 28px;
        border-color: rgba(0,212,255,1);
      }
    `;
    document.head.appendChild(style);

    const dot = document.createElement('div'); dot.id = 'cursor-dot';
    const ring = document.createElement('div'); ring.id = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0, raf;
    function lerp(a, b, t) { return a + (b - a) * t; }

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mousedown', () => ring.classList.add('click'));
    document.addEventListener('mouseup', () => ring.classList.remove('click'));

    const interactables = 'a, button, [role="button"], .project-card, .skill-card, label';
    document.querySelectorAll(interactables).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    function loop() {
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      rx = lerp(rx, mx, 0.12); ry = lerp(ry, my, 0.12);
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      raf = requestAnimationFrame(loop);
    }
    loop();
  }

  /* ─── 2. MAGNETIC BUTTONS ─── */
  function initMagnetic() {
    if (isMobile()) return;
    document.querySelectorAll('.btn, .navbar__link, .project-card__link').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.25;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
        el.style.transform = 'translate(0,0)';
        setTimeout(() => el.style.transition = '', 500);
      });
    });
  }

  /* ─── 3. SCROLL REVEAL — propre et subtil ─── */
  function initReveal() {
    const style = document.createElement('style');
    style.textContent = `
      .sr { opacity: 0; transform: translateY(24px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
      .sr.sr--left { transform: translateX(-24px); }
      .sr.sr--right { transform: translateX(24px); }
      .sr.sr--scale { transform: scale(.96) translateY(16px); }
      .sr.visible { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .project-card, .skill-card, .timeline__item, .about__detail-card, .contact__card, .web3__card');
    els.forEach((el, i) => {
      el.classList.add('sr');
      if (el.classList.contains('reveal-left')) el.classList.add('sr--left');
      if (el.classList.contains('reveal-right')) el.classList.add('sr--right');
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
  }

  /* ─── 4. CARDS TILT — subtil et pro ─── */
  function initCardTilt() {
    if (isMobile()) return;

    const style = document.createElement('style');
    style.textContent = `
      .project-card { transform-style: preserve-3d; transition: box-shadow .3s ease; will-change: transform; }
      .project-card::after {
        content: ''; position: absolute; inset: 0; border-radius: inherit;
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04), transparent 60%);
        opacity: 0; transition: opacity .3s; pointer-events: none;
      }
      .project-card:hover::after { opacity: 1; }
      .project-card:hover { box-shadow: 0 24px 60px rgba(110,0,255,0.2), 0 8px 20px rgba(0,0,0,0.4); }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
        // light reflection
        const after = getComputedStyle(card, '::after');
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1), box-shadow .3s ease';
        card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
        setTimeout(() => card.style.transition = '', 500);
      });
    });
  }

  /* ─── 5. SMOOTH ACTIVE NAV ─── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.navbar__link');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.navbar__link[href="#${e.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => io.observe(s));
  }

  /* ─── 6. SMOOTH PAGE TRANSITIONS (subtiles) ─── */
  function initPageTransitions() {
    const style = document.createElement('style');
    style.textContent = `
      #page-overlay {
        position: fixed; inset: 0;
        background: #050508;
        z-index: 999997;
        transform-origin: left;
        transform: scaleX(0);
        pointer-events: none;
      }
      @keyframes overlayIn { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @keyframes overlayOut { from { transform: scaleX(1); transform-origin: right; } to { transform: scaleX(0); transform-origin: right; } }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'page-overlay';
    document.body.appendChild(overlay);

    // Fade in on load
    document.addEventListener('DOMContentLoaded', () => {
      overlay.style.transformOrigin = 'right';
      overlay.style.animation = 'overlayOut 0.5s cubic-bezier(.16,1,.3,1) forwards';
    });

    // Transition on external links only (not anchors)
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
      if (a.target === '_blank') return;

      a.addEventListener('click', e => {
        e.preventDefault();
        overlay.style.transformOrigin = 'left';
        overlay.style.animation = 'overlayIn 0.4s cubic-bezier(.87,0,.13,1) forwards';
        setTimeout(() => { window.location = href; }, 400);
      });
    });
  }

  /* ─── 7. STATS COUNTER ANIMATION ─── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const duration = 1500;
        const start = performance.now();

        function update(now) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(ease * target);
          if (t < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => io.observe(c));
  }

  /* ─── 8. SKILL BARS ─── */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill__progress, .skill__bar-fill, [data-progress]');
    if (!bars.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const width = el.dataset.progress || el.style.width || '0%';
        el.style.width = '0%';
        el.style.transition = 'width 1s cubic-bezier(.16,1,.3,1)';
        setTimeout(() => { el.style.width = width; }, 100);
        io.unobserve(el);
      });
    }, { threshold: 0.3 });

    bars.forEach(b => io.observe(b));
  }

  /* ─── 9. PARALLAX HERO FLOATERS ─── */
  function initParallax() {
    if (isMobile()) return;
    const floaters = document.querySelectorAll('.hero__float');
    if (!floaters.length) return;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      floaters.forEach((f, i) => {
        const speed = 0.08 + i * 0.03;
        f.style.transform = `translateY(${y * speed}px)`;
      });
    }, { passive: true });
  }

  /* ─── INIT ─── */
  function init() {
    initCursor();
    initMagnetic();
    initReveal();
    initCardTilt();
    initActiveNav();
    initPageTransitions();
    initCounters();
    initSkillBars();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
