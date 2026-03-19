/* ═══════════════════════════════════════════════════════════════════════════
   IMMERSIVE.JS — pazent.fr
   The layer that makes it feel alive.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const isMobile = () => 'ontouchstart' in window || window.innerWidth < 768;

  /* ─── 1. PROJECT FILTERS — animation fluide ─── */
  function initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const grid = document.getElementById('projectsGrid');
    if (!btns.length || !grid) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('filter-btn--active'));
        btn.classList.add('filter-btn--active');
        const filter = btn.dataset.filter;
        const cards = grid.querySelectorAll('.project-card');
        cards.forEach((card, i) => {
          const match = filter === 'all' || card.dataset.category === filter;
          if (match) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            card.style.transition = 'none';
            requestAnimationFrame(() => {
              card.style.transition = `opacity .4s ease ${i * 40}ms, transform .4s cubic-bezier(.16,1,.3,1) ${i * 40}ms`;
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            card.style.transition = 'opacity .2s ease, transform .2s ease';
            setTimeout(() => { card.style.display = 'none'; }, 200);
          }
        });
      });
    });
  }

  /* ─── 2. ABOUT TERMINAL — typewriter effect ─── */
  function initTerminalTypewriter() {
    const body = document.querySelector('.about__terminal-body');
    if (!body) return;

    const lines = [
      { indent: 0, content: '{' },
      { indent: 1, key: '"name"', val: '"Alessandro Gagliardi"' },
      { indent: 1, key: '"role"', val: '"Cybersec Engineer & Dev"' },
      { indent: 1, key: '"location"', val: '"Lyon, France 🇫🇷"' },
      { indent: 1, key: '"school"', val: '"Guardia 3ème année"' },
      { indent: 1, key: '"work"', val: '"DevSecOps @ Net Strategy"' },
      { indent: 1, key: '"available"', val: 'true', bool: true },
      { indent: 1, key: '"coffee_per_day"', val: '4', num: true },
      { indent: 0, content: '}' },
    ];

    let started = false;
    const io = new IntersectionObserver(entries => {
      if (started || !entries[0].isIntersecting) return;
      started = true;

      body.innerHTML = '';
      const cursor = document.createElement('span');
      cursor.style.cssText = 'display:inline-block;width:8px;height:1.1em;background:#6e00ff;vertical-align:middle;animation:termBlink 1s step-end infinite;margin-left:2px;';
      const cursorStyle = document.createElement('style');
      cursorStyle.textContent = '@keyframes termBlink{0%,100%{opacity:1}50%{opacity:0}}';
      document.head.appendChild(cursorStyle);

      let li = 0;
      function typeLine() {
        if (li >= lines.length) { cursor.remove(); return; }
        const l = lines[li++];
        const div = document.createElement('div');
        div.style.cssText = 'padding-left:' + (l.indent * 16) + 'px; line-height:1.6; font-family:JetBrains Mono,monospace; font-size:13px;';

        if (l.content) {
          div.innerHTML = `<span style="color:#e6edf3">${l.content}</span>`;
        } else {
          const valColor = l.bool ? '#ff7b72' : l.num ? '#f0b429' : '#a5d6ff';
          div.innerHTML = `<span style="color:#8b949e">"</span><span style="color:#00d4ff">${l.key.slice(1,-1)}</span><span style="color:#8b949e">"</span><span style="color:#e6edf3">: </span><span style="color:${valColor}">${l.val}</span><span style="color:#8b949e">${li < lines.length ? ',' : ''}</span>`;
        }
        body.appendChild(div);
        body.appendChild(cursor);
        setTimeout(typeLine, 120);
      }
      setTimeout(typeLine, 400);
      io.unobserve(entries[0].target);
    }, { threshold: 0.4 });
    io.observe(body);
  }

  /* ─── 3. SCROLL JACKING HERO — smooth reveal on scroll ─── */
  function initHeroParallaxDepth() {
    if (isMobile()) return;
    const hero = document.querySelector('.hero');
    const content = document.querySelector('.hero__content');
    if (!hero || !content) return;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const h = hero.offsetHeight;
      const p = Math.min(y / h, 1);
      content.style.transform = `translateY(${y * 0.15}px)`;
      content.style.opacity = Math.max(1 - p * 1.5, 0);
    }, { passive: true });
  }

  /* ─── 4. HOVER PREVIEW sur les project cards ─── */
  function initProjectHoverPreview() {
    if (isMobile()) return;
    const css = document.createElement('style');
    css.textContent = `
      .project-card__peek {
        position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%) scale(.9);
        background: rgba(10,10,16,.95); border: 1px solid rgba(110,0,255,.3);
        border-radius: 8px; padding: 8px 14px; font-size: 12px;
        color: #a78bfa; white-space: nowrap; pointer-events: none;
        opacity: 0; transition: opacity .2s, transform .2s, bottom .2s cubic-bezier(.16,1,.3,1);
        z-index: 100; backdrop-filter: blur(8px);
      }
      .project-card:hover .project-card__peek {
        opacity: 1; transform: translateX(-50%) scale(1); bottom: -50px;
      }
    `;
    document.head.appendChild(css);

    document.querySelectorAll('.project-card').forEach(card => {
      const peek = document.createElement('div');
      peek.className = 'project-card__peek';
      const tags = [...card.querySelectorAll('.project-card__tags span')].slice(0, 3).map(s => s.textContent).join(' · ');
      peek.textContent = tags || 'Voir le projet';
      card.style.position = 'relative';
      card.appendChild(peek);
    });
  }

  /* ─── 5. STICKY SECTION INDICATOR — sidebar dot nav ─── */
  function initSectionNav() {
    if (isMobile()) return;
    const sections = ['hero','about','skills','projects','experience','contact'];
    const labels = ['Accueil','À propos','Skills','Projets','Parcours','Contact'];

    const nav = document.createElement('div');
    nav.style.cssText = `
      position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
      z-index: 9990; display: flex; flex-direction: column; gap: 12px; align-items: flex-end;
    `;

    const dots = sections.map((id, i) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex; align-items:center; gap:8px; cursor:pointer; opacity:.4; transition:opacity .3s;';
      wrap.innerHTML = `
        <span style="font-size:11px;color:#8b949e;letter-spacing:.05em;opacity:0;transform:translateX(6px);transition:opacity .2s,transform .2s;white-space:nowrap;">${labels[i]}</span>
        <span style="width:6px;height:6px;border-radius:50%;background:#6e00ff;display:block;transition:width .2s,height .2s,background .2s;flex-shrink:0;"></span>
      `;
      const label = wrap.querySelector('span:first-child');
      const dot = wrap.querySelector('span:last-child');

      wrap.addEventListener('mouseenter', () => {
        label.style.opacity = '1';
        label.style.transform = 'translateX(0)';
      });
      wrap.addEventListener('mouseleave', () => {
        label.style.opacity = '0';
        label.style.transform = 'translateX(6px)';
      });
      wrap.addEventListener('click', () => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });

      nav.appendChild(wrap);
      return { wrap, dot };
    });

    document.body.appendChild(nav);

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const i = sections.indexOf(e.target.id);
        if (i === -1) return;
        if (e.isIntersecting) {
          dots[i].wrap.style.opacity = '1';
          dots[i].dot.style.width = '10px';
          dots[i].dot.style.height = '10px';
          dots[i].dot.style.background = 'linear-gradient(135deg,#6e00ff,#00d4ff)';
          dots[i].dot.style.boxShadow = '0 0 8px rgba(110,0,255,0.5)';
        } else {
          dots[i].wrap.style.opacity = '.4';
          dots[i].dot.style.width = '6px';
          dots[i].dot.style.height = '6px';
          dots[i].dot.style.background = '#6e00ff';
          dots[i].dot.style.boxShadow = 'none';
        }
      });
    }, { threshold: .4 });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ─── 6. CONTACT FORM — micro-interactions ─── */
  function initContactInteractions() {
    const inputs = document.querySelectorAll('.contact__form input, .contact__form textarea, .contact__form select');
    if (!inputs.length) return;

    const css = document.createElement('style');
    css.textContent = `
      .contact__form input, .contact__form textarea, .contact__form select {
        transition: border-color .2s, box-shadow .2s, transform .1s;
      }
      .contact__form input:focus, .contact__form textarea:focus {
        border-color: rgba(110,0,255,.6) !important;
        box-shadow: 0 0 0 3px rgba(110,0,255,.12), 0 2px 8px rgba(0,0,0,.2);
        transform: scale(1.005);
        outline: none;
      }
      .contact__form label {
        transition: color .2s;
      }
      .contact__form input:focus + label,
      .contact__form textarea:focus + label {
        color: #a78bfa;
      }
    `;
    document.head.appendChild(css);
  }

  /* ─── 7. SMOOTH LINK TRANSITIONS ─── */
  function initLinkTransitions() {
    const css = document.createElement('style');
    css.textContent = `
      #ez-transition {
        position: fixed; inset: 0;
        background: #050508;
        z-index: 999997;
        pointer-events: none;
        clip-path: inset(0 100% 0 0);
        transition: clip-path .5s cubic-bezier(.87,0,.13,1);
      }
      #ez-transition.entering { clip-path: inset(0 0% 0 0); pointer-events: all; }
      #ez-transition.leaving { clip-path: inset(0 0 0 100%); }
    `;
    document.head.appendChild(css);

    const el = document.createElement('div');
    el.id = 'ez-transition';
    document.body.appendChild(el);

    // Animate in on load
    window.addEventListener('load', () => {
      el.classList.add('leaving');
      setTimeout(() => { el.style.transition = 'clip-path .4s cubic-bezier(.87,0,.13,1)'; }, 50);
    });

    // Animate on internal page links
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || a.target === '_blank') return;
      a.addEventListener('click', e => {
        e.preventDefault();
        el.style.transition = 'clip-path .4s cubic-bezier(.87,0,.13,1)';
        el.classList.remove('leaving');
        el.classList.add('entering');
        setTimeout(() => { window.location.href = href; }, 420);
      });
    });
  }

  /* ─── 8. SECTION DATA-NUMBER ─── */
  function initSectionNumbers() {
    const css = document.createElement('style');
    css.textContent = `
      .section__header[data-number]::after {
        content: attr(data-number);
        position: absolute; top: 0; right: 0;
        font-size: 6rem; font-weight: 800; line-height: 1;
        color: rgba(110,0,255,0.04);
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.04em;
        pointer-events: none;
        user-select: none;
      }
      .section__header { position: relative; }
    `;
    document.head.appendChild(css);
  }

  /* ─── 9. ACTIVE FILTER BTN SLIDE ─── */
  function initFilterSlider() {
    const css = document.createElement('style');
    css.textContent = `
      .projects__filters { position: relative; }
      .filter-btn {
        position: relative; z-index: 1;
        transition: color .2s, opacity .2s;
      }
      .filter-btn--active { color: #fff !important; }
      .filter-btn:not(.filter-btn--active) { opacity: .5; }
      .filter-btn:not(.filter-btn--active):hover { opacity: .8; }
    `;
    document.head.appendChild(css);
  }

  /* ─── 10. HERO FLOATERS — upgrade text ─── */
  function upgradeFloaters() {
    const floaterTexts = [
      { code: 'const secure = true;', color: '#3fb950' },
      { code: 'npm run pentest', color: '#ff6b35' },
      { code: '<Zero Trust />', color: '#00d4ff' },
      { code: '0x6e00ff...', color: '#a78bfa' },
      { code: 'chmod 700 ~/.ssh', color: '#f0b429' },
    ];
    document.querySelectorAll('.hero__float-code').forEach((el, i) => {
      if (floaterTexts[i]) {
        el.textContent = floaterTexts[i].code;
        el.style.color = floaterTexts[i].color;
      }
    });
  }

  /* ─── INIT ─── */
  function init() {
    initFilters();
    initTerminalTypewriter();
    initHeroParallaxDepth();
    initProjectHoverPreview();
    initSectionNav();
    initContactInteractions();
    initLinkTransitions();
    initSectionNumbers();
    initFilterSlider();
    upgradeFloaters();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
