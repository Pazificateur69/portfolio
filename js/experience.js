/* ═══════════════════════════════════════════════════════════════════════════
   EXPERIENCE.JS — pazent.fr
   Agency-level interactions. Precision over spectacle.
   Inspired by: Linear, Vercel, Framer
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const isMobile = () => 'ontouchstart' in window || window.innerWidth < 768;

  /* ═══════════════════════════════════════════════════════════════════════
     1. CURSOR PREMIUM — like Linear
     ═══════════════════════════════════════════════════════════════════════ */
  function initCursor() {
    if (isMobile()) return;

    const css = document.createElement('style');
    css.textContent = `
      *, *::before, *::after { cursor: none !important; }
      #ez-cursor {
        position: fixed; top: 0; left: 0; pointer-events: none;
        z-index: 1000000; mix-blend-mode: difference;
        transform: translate(-50%, -50%);
        will-change: transform;
      }
      #ez-cursor-inner {
        width: 8px; height: 8px; background: #fff;
        border-radius: 50%; transition: width .2s, height .2s, border-radius .2s;
      }
      #ez-cursor-outer {
        position: fixed; top: 0; left: 0; pointer-events: none;
        z-index: 999999; transform: translate(-50%, -50%);
        width: 40px; height: 40px;
        border: 1.5px solid rgba(110,0,255,0.5);
        border-radius: 50%;
        transition: width .4s cubic-bezier(.16,1,.3,1), height .4s cubic-bezier(.16,1,.3,1), border-color .3s, opacity .3s;
        will-change: transform;
      }
      .cursor-hover #ez-cursor-inner { width: 0; height: 0; }
      .cursor-hover #ez-cursor-outer {
        width: 64px; height: 64px;
        border-color: rgba(110,0,255,0.8);
        background: rgba(110,0,255,0.06);
        backdrop-filter: blur(4px);
      }
      .cursor-link #ez-cursor-outer { width: 52px; height: 52px; border-color: rgba(0,212,255,0.8); }
      .cursor-click #ez-cursor-outer { width: 32px; height: 32px; transition: width .1s, height .1s; }
    `;
    document.head.appendChild(css);

    const inner = document.createElement('div'); inner.id = 'ez-cursor';
    inner.innerHTML = '<div id="ez-cursor-inner"></div>';
    const outer = document.createElement('div'); outer.id = 'ez-cursor-outer';
    document.body.append(inner, outer);

    let mx = -100, my = -100, ox = -100, oy = -100;
    function lerp(a, b, n) { return (1 - n) * a + n * b; }

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

    document.querySelectorAll('.project-card, .skill-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
    });

    (function loop() {
      inner.style.transform = `translate(${mx - .5}px,${my - .5}px) translate(-50%,-50%)`;
      ox = lerp(ox, mx, 0.1); oy = lerp(oy, my, 0.1);
      outer.style.transform = `translate(${ox}px,${oy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ═══════════════════════════════════════════════════════════════════════
     2. HERO — Reveal cinématique au chargement
     ═══════════════════════════════════════════════════════════════════════ */
  function initHeroReveal() {
    const css = document.createElement('style');
    css.textContent = `
      .hero-enter { opacity: 0; transform: translateY(20px); }
      .hero-enter.entered { animation: heroEnter .8s cubic-bezier(.16,1,.3,1) forwards; }
      @keyframes heroEnter {
        to { opacity: 1; transform: translateY(0); }
      }
      .hero__title-name {
        display: inline-block;
        background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,.7) 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        position: relative;
      }
      .hero__title-name::after {
        content: attr(data-text);
        position: absolute; inset: 0;
        background: linear-gradient(135deg, #6e00ff, #00d4ff);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        opacity: 0; transition: opacity 1.2s ease;
      }
      .hero__title-name.colored::after { opacity: 1; }
    `;
    document.head.appendChild(css);

    const titleName = document.querySelector('.hero__title-name');
    if (titleName) titleName.setAttribute('data-text', titleName.textContent);

    const enters = document.querySelectorAll('.hero-enter');
    window.addEventListener('load', () => {
      enters.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('entered');
          el.style.animationDelay = '0s';
        }, i * 100 + 200);
      });
      setTimeout(() => {
        if (titleName) titleName.classList.add('colored');
      }, enters.length * 100 + 800);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     3. SCROLL REVEAL — Précis et fluide
     ═══════════════════════════════════════════════════════════════════════ */
  function initReveal() {
    const css = document.createElement('style');
    css.textContent = `
      [data-reveal] {
        opacity: 0;
        transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
      }
      [data-reveal="up"] { transform: translateY(32px); }
      [data-reveal="left"] { transform: translateX(-32px); }
      [data-reveal="right"] { transform: translateX(32px); }
      [data-reveal="scale"] { transform: scale(.94); }
      [data-reveal].revealed { opacity: 1; transform: none; }
    `;
    document.head.appendChild(css);

    // Tag elements with reveal attributes
    document.querySelectorAll('.section__header').forEach(el => el.setAttribute('data-reveal', 'up'));
    document.querySelectorAll('.about__text').forEach(el => el.setAttribute('data-reveal', 'left'));
    document.querySelectorAll('.about__details').forEach(el => el.setAttribute('data-reveal', 'right'));
    document.querySelectorAll('.project-card').forEach((el, i) => {
      el.setAttribute('data-reveal', 'up');
      el.style.transitionDelay = `${(i % 3) * 80}ms`;
    });
    document.querySelectorAll('.skill-card, .skill__item, .about__detail-card').forEach((el, i) => {
      el.setAttribute('data-reveal', 'up');
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
    });
    document.querySelectorAll('.timeline__item').forEach((el, i) => {
      el.setAttribute('data-reveal', i % 2 === 0 ? 'left' : 'right');
      el.style.transitionDelay = `${i * 80}ms`;
    });
    document.querySelectorAll('.contact__card, .web3__card').forEach((el, i) => {
      el.setAttribute('data-reveal', 'up');
      el.style.transitionDelay = `${i * 70}ms`;
    });
    document.querySelectorAll('.hero__github, .hero__stats').forEach(el => el.setAttribute('data-reveal', 'up'));

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════════════════
     4. PROJECT CARDS — 3D + Spotlight (Linear-style)
     ═══════════════════════════════════════════════════════════════════════ */
  function initCardSpotlight() {
    const css = document.createElement('style');
    css.textContent = `
      .project-card {
        position: relative; overflow: hidden;
        transform-style: preserve-3d;
        transition: box-shadow .4s ease, transform .4s cubic-bezier(.16,1,.3,1);
        --spotlight-x: 50%; --spotlight-y: 50%;
      }
      .project-card::before {
        content: '';
        position: absolute; inset: -1px;
        background: radial-gradient(circle at var(--spotlight-x) var(--spotlight-y), rgba(110,0,255,0.15) 0%, transparent 60%);
        opacity: 0; transition: opacity .3s; border-radius: inherit;
        pointer-events: none; z-index: 1;
      }
      .project-card:hover::before { opacity: 1; }
      .project-card:hover {
        transform: translateY(-4px) perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));
        box-shadow: 0 20px 60px rgba(0,0,0,.4), 0 0 0 1px rgba(110,0,255,.2), 0 0 40px rgba(110,0,255,.08);
      }
      .project-card > * { position: relative; z-index: 2; }
    `;
    document.head.appendChild(css);

    if (isMobile()) return;

    document.querySelectorAll('.project-card').forEach(card => {
      let raf;
      card.addEventListener('mousemove', e => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          const rx = (y - 0.5) * -8;
          const ry = (x - 0.5) * 8;
          card.style.setProperty('--rx', rx + 'deg');
          card.style.setProperty('--ry', ry + 'deg');
          card.style.setProperty('--spotlight-x', (x * 100) + '%');
          card.style.setProperty('--spotlight-y', (y * 100) + '%');
          raf = null;
        });
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     5. MAGNETIC BUTTONS — Précis
     ═══════════════════════════════════════════════════════════════════════ */
  function initMagnetic() {
    if (isMobile()) return;
    document.querySelectorAll('.btn, .navbar__logo, .navbar__social a').forEach(el => {
      let raf;
      el.addEventListener('mousemove', e => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * .3;
          const y = (e.clientY - r.top - r.height / 2) * .3;
          el.style.transform = `translate(${x}px, ${y}px)`;
          raf = null;
        });
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
        el.style.transform = '';
        setTimeout(() => el.style.transition = '', 500);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     6. COUNTERS
     ═══════════════════════════════════════════════════════════════════════ */
  function initCounters() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, target = +el.dataset.count;
        const dur = 1200, start = performance.now();
        const tick = now => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(p < 1 ? (1 - Math.pow(1 - p, 3)) * target : target);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: .5 });
    document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════════════════
     7. SKILL BARS
     ═══════════════════════════════════════════════════════════════════════ */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill__progress, .skill__bar-fill');
    if (!bars.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const w = el.style.width || el.getAttribute('style')?.match(/width:\s*([^;]+)/)?.[1] || '0%';
        el.style.width = '0%';
        el.style.transition = 'none';
        requestAnimationFrame(() => {
          el.style.transition = 'width 1s cubic-bezier(.16,1,.3,1)';
          requestAnimationFrame(() => { el.style.width = w; });
        });
        io.unobserve(el);
      });
    }, { threshold: .3 });
    bars.forEach(b => io.observe(b));
  }

  /* ═══════════════════════════════════════════════════════════════════════
     8. PARALLAX SUBTIL
     ═══════════════════════════════════════════════════════════════════════ */
  function initParallax() {
    if (isMobile()) return;
    const floaters = document.querySelectorAll('.hero__float');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        floaters.forEach((f, i) => {
          f.style.transform = `translateY(${y * (0.06 + i * 0.02)}px)`;
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     9. AMBIENT GLOW — Hero background glow qui suit la souris
     ═══════════════════════════════════════════════════════════════════════ */
  function initAmbientGlow() {
    if (isMobile()) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const glow = document.createElement('div');
    glow.style.cssText = `
      position: absolute; width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(110,0,255,0.08) 0%, transparent 70%);
      pointer-events: none; z-index: 0;
      transform: translate(-50%, -50%);
      transition: left .8s cubic-bezier(.16,1,.3,1), top .8s cubic-bezier(.16,1,.3,1);
      border-radius: 50%;
    `;
    hero.appendChild(glow);

    let raf;
    document.addEventListener('mousemove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        if (e.clientY < r.bottom) {
          glow.style.left = (e.clientX - r.left) + 'px';
          glow.style.top = (e.clientY - r.top) + 'px';
        }
        raf = null;
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     10. SECTION PROGRESS LINE — comme Linear docs
     ═══════════════════════════════════════════════════════════════════════ */
  function initScrollProgress() {
    const bar = document.querySelector('#scrollProgress') || (() => {
      const b = document.createElement('div');
      b.id = 'scroll-prog';
      b.style.cssText = `
        position: fixed; top: 0; left: 0; height: 2px; z-index: 99999;
        background: linear-gradient(90deg, #6e00ff, #00d4ff);
        transform-origin: left; transform: scaleX(0);
        transition: transform .1s linear; pointer-events: none;
      `;
      document.body.prepend(b);
      return b;
    })();

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrolled / total;
      (document.getElementById('scroll-prog') || bar).style.transform = `scaleX(${progress})`;
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     11. HOVER UNDERLINE ANIMATION — nav links
     ═══════════════════════════════════════════════════════════════════════ */
  function initNavUnderline() {
    const css = document.createElement('style');
    css.textContent = `
      .navbar__link {
        position: relative; overflow: hidden;
      }
      .navbar__link::after {
        content: ''; position: absolute; bottom: -2px; left: 0;
        width: 100%; height: 1px;
        background: linear-gradient(90deg, #6e00ff, #00d4ff);
        transform: translateX(-101%);
        transition: transform .3s cubic-bezier(.16,1,.3,1);
      }
      .navbar__link:hover::after,
      .navbar__link.active::after { transform: translateX(0); }
      .navbar__link.active { color: #fff !important; }
    `;
    document.head.appendChild(css);

    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.navbar__link[href^="#"]');

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { threshold: .4 });
    sections.forEach(s => io.observe(s));
  }

  /* ═══════════════════════════════════════════════════════════════════════
     12. CARD BORDER GRADIENT HOVER
     ═══════════════════════════════════════════════════════════════════════ */
  function initCardBorderGlow() {
    const css = document.createElement('style');
    css.textContent = `
      .skill-card, .about__detail-card, .contact__card, .web3__card {
        position: relative; overflow: hidden;
        transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease;
        --bx: 50%; --by: 50%;
      }
      .skill-card::before, .about__detail-card::before,
      .contact__card::before, .web3__card::before {
        content: ''; position: absolute; inset: 0;
        background: radial-gradient(circle at var(--bx) var(--by), rgba(110,0,255,0.12) 0%, transparent 55%);
        opacity: 0; transition: opacity .35s; pointer-events: none; z-index: 0; border-radius: inherit;
      }
      .skill-card:hover::before, .about__detail-card:hover::before,
      .contact__card:hover::before, .web3__card:hover::before { opacity: 1; }
      .skill-card:hover, .about__detail-card:hover, .contact__card:hover, .web3__card:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 40px rgba(0,0,0,.35), 0 0 0 1px rgba(110,0,255,.15);
      }
      .skill-card > *, .about__detail-card > *, .contact__card > *, .web3__card > * {
        position: relative; z-index: 1;
      }
    `;
    document.head.appendChild(css);

    if (isMobile()) return;
    document.querySelectorAll('.skill-card, .about__detail-card, .contact__card, .web3__card').forEach(card => {
      let raf;
      card.addEventListener('mousemove', e => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--bx', ((e.clientX - r.left) / r.width * 100) + '%');
          card.style.setProperty('--by', ((e.clientY - r.top) / r.height * 100) + '%');
          raf = null;
        });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     INIT ALL
     ═══════════════════════════════════════════════════════════════════════ */
  function init() {
    initCursor();
    initHeroReveal();
    initReveal();
    initCardSpotlight();
    initMagnetic();
    initCounters();
    initSkillBars();
    initParallax();
    initAmbientGlow();
    initScrollProgress();
    initNavUnderline();
    initCardBorderGlow();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();

/* ═══════════════════════════════════════════════════════════════════════
   ADDITIONAL EXPERIENCE LAYERS — v2
   ═══════════════════════════════════════════════════════════════════════ */

/* 13. FLOATING CODE TAGS — meilleure animation */
(function initFloaters() {
  const floaters = document.querySelectorAll('.hero__float');
  if (!floaters.length || isMobile()) return;

  floaters.forEach((f, i) => {
    const speed = 3 + i * 0.7;
    const amp = 8 + i * 4;
    const offset = i * 1.2;
    let start;

    (function animate(ts) {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      const y = Math.sin(t / speed * Math.PI * 2 + offset) * amp;
      const x = Math.cos(t / (speed * 1.3) * Math.PI * 2 + offset) * (amp * 0.4);
      f.style.transform = `translate(${x}px, ${y}px) translateY(${window.scrollY * (0.06 + i * 0.02)}px)`;
      requestAnimationFrame(animate);
    })(performance.now());
  });
})();

/* 14. STAGGERED TOOL TAGS hover */
(function initToolTags() {
  document.querySelectorAll('.tool-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.color = '#6e00ff';
      tag.style.borderColor = 'rgba(110,0,255,0.4)';
      tag.style.background = 'rgba(110,0,255,0.08)';
      tag.style.transform = 'translateY(-2px)';
      tag.style.transition = 'all .2s cubic-bezier(.16,1,.3,1)';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.color = '';
      tag.style.borderColor = '';
      tag.style.background = '';
      tag.style.transform = '';
    });
  });
})();

/* 15. SKILL PROGRESS BARS — avec data-value */
(function initSkillBarsV2() {
  const bars = document.querySelectorAll('.skill-item__progress');
  if (!bars.length) return;

  bars.forEach(bar => {
    const val = bar.dataset.value;
    if (val) bar.style.width = val + '%';
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const bar = e.target;
      const w = bar.dataset.value ? bar.dataset.value + '%' : bar.style.width;
      bar.style.width = '0%';
      bar.style.transition = 'none';
      requestAnimationFrame(() => {
        bar.style.transition = 'width 1.2s cubic-bezier(.16,1,.3,1)';
        requestAnimationFrame(() => { bar.style.width = w; });
      });
      io.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => io.observe(b));
})();

/* 16. CODE EDITORS — typing effect */
(function initCodeEditors() {
  const editors = document.querySelectorAll('.code-editor');
  if (!editors.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.opacity = '1';
      e.target.style.transform = 'none';
      io.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  editors.forEach(ed => {
    ed.style.opacity = '0';
    ed.style.transform = 'translateY(20px)';
    ed.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.16,1,.3,1)';
    io.observe(ed);
  });
})();

/* 17. GITHUB STATS — fetch réel */
(function initGithubStats() {
  const repoEl = document.getElementById('ghRepos');
  const starEl = document.getElementById('ghStars');
  if (!repoEl && !starEl) return;

  fetch('https://api.github.com/users/Pazificateur69', { headers: { 'Accept': 'application/vnd.github.v3+json' } })
    .then(r => r.json())
    .then(d => {
      if (repoEl && d.public_repos) {
        const t = d.public_repos;
        let c = 0;
        const timer = setInterval(() => {
          c = Math.min(c + 1, t);
          repoEl.textContent = c;
          if (c >= t) clearInterval(timer);
        }, 40);
      }
    })
    .catch(() => {});

  // Stars total
  fetch('https://api.github.com/users/Pazificateur69/repos?per_page=100')
    .then(r => r.json())
    .then(repos => {
      if (!Array.isArray(repos)) return;
      const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      if (starEl) {
        let c = 0;
        const timer = setInterval(() => {
          c = Math.min(c + 1, stars || 0);
          starEl.textContent = c;
          if (c >= (stars || 0)) clearInterval(timer);
        }, 80);
      }
    })
    .catch(() => {});
})();

/* 18. SECTION TRANSITION LINES — horizontal rules entre sections */
(function initSectionLines() {
  const css = document.createElement('style');
  css.textContent = `
    .section + .section::before,
    .section--alt + .section::before,
    .section + .section--alt::before {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(110,0,255,0.15), rgba(0,212,255,0.1), transparent);
      margin: 0;
    }

    /* Timeline dots enhanced */
    .timeline__dot {
      position: relative;
      transition: transform .3s ease, box-shadow .3s ease;
    }
    .timeline__item:hover .timeline__dot {
      transform: scale(1.3);
    }

    /* Code editor cursor blink */
    .code-editor__code::after {
      content: '|';
      color: #6e00ff;
      animation: blink 1s step-end infinite;
      margin-left: 2px;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    /* Tool tag base style override */
    .tool-tag {
      transition: color .2s, border-color .2s, background .2s, transform .2s;
    }

    /* Project card image hover zoom */
    .project-card__image img,
    .project-card__mockup img {
      transition: transform .5s cubic-bezier(.16,1,.3,1);
    }
    .project-card:hover .project-card__image img,
    .project-card:hover .project-card__mockup img {
      transform: scale(1.04);
    }

    /* Hero badge pill */
    .hero__badge {
      border: 1px solid rgba(63,185,80,0.3);
      background: rgba(63,185,80,0.06);
      backdrop-filter: blur(8px);
      transition: border-color .3s, background .3s;
    }
    .hero__badge:hover {
      border-color: rgba(63,185,80,0.5);
      background: rgba(63,185,80,0.1);
    }

    /* Stats number gradient */
    .hero__stat-number {
      background: linear-gradient(135deg, #fff 40%, rgba(167,139,250,.9));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      font-variant-numeric: tabular-nums;
    }

    /* Float code tags */
    .hero__float { will-change: transform; }
    .hero__float-code {
      backdrop-filter: blur(12px);
      background: rgba(10,10,16,0.7);
      border: 1px solid rgba(110,0,255,0.2);
      box-shadow: 0 8px 32px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,0.04);
    }
  `;
  document.head.appendChild(css);
})();
