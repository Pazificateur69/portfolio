/* ═══════════════════════════════════════════════════════════════════════════
   ALESSANDRO PORTFOLIO - ADVANCED INTERACTIONS
   Custom cursor, magnetic buttons, tilt cards, particles, typing, etc.
   ═══════════════════════════════════════════════════════════════════════════ */

// Card tilt selectors for index page (extends globals.js defaults)
window.__tiltSelectors = window.__tiltSelectors || [];

document.addEventListener('DOMContentLoaded', () => {
  // Page-specific inits (globals.js handles: loader, navbar, mobile menu,
  // scroll reveal, smooth scroll, page transitions, scroll progress,
  // back to top, section tag typing, code highlight, card tilt)
  initHeroEntrance();
  initHeroCharReveal();
  initTypingAnimation();
  initSkillBars();
  initCountUp();
  initProjectFilters();
  initCardShine();
  initMagneticButtons();
  initButtonRipple();
  initParticles();
  initKonamiCode();
  initTextScramble();
  initToolTagGlow();
  initTimelineProgress();
  initWordReveal();
  initContactGlow();
  initWeb3CardTilt();
  initParallaxDepth();
  initHeroParallax();
  initCardLinks();
  initTerminalLineReveal();
  initCodeShowcase();
  initFooterReveal();
});

/* Functions removed: initLoader, initNavbar, initMobileMenu — now in globals.js */

/* ═══════════════════════════════════════════════════════════════════════════
   HERO ENTRANCE - Timed stagger after loader
   ═══════════════════════════════════════════════════════════════════════════ */
function initHeroEntrance() {
  const elements = document.querySelectorAll('.hero-enter');
  if (!elements.length) return;

  // Stagger entrance after loader finishes (~800ms)
  setTimeout(() => {
    elements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
        el.classList.add('active'); // For word-reveal compatibility
      }, i * 120);
    });

    // After all entrances complete, remove transition so parallax works instantly
    const totalTime = elements.length * 120 + 900;
    setTimeout(() => {
      elements.forEach(el => {
        el.classList.remove('hero-enter');
      });
    }, totalTime);
  }, 900);
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO - Character by character reveal
   ═══════════════════════════════════════════════════════════════════════════ */
function initHeroCharReveal() {
  const nameEl = document.querySelector('.hero__title-name');
  if (!nameEl) return;

  const text = nameEl.textContent.trim();
  nameEl.textContent = '';
  nameEl.style.visibility = 'visible';

  // Create spans but don't animate yet
  const chars = [];
  text.split('').forEach((char) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationPlayState = 'paused';
    span.style.animationDelay = '0s';
    nameEl.appendChild(span);
    chars.push(span);
  });

  // Start animation after loader finishes (loader takes ~800ms)
  setTimeout(() => {
    chars.forEach((span, i) => {
      span.style.animationDelay = `${i * 0.06}s`;
      span.style.animationPlayState = 'running';
    });
  }, 700);
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPING ANIMATION
   ═══════════════════════════════════════════════════════════════════════════ */
function initTypingAnimation() {
  const element = document.getElementById('typingText');
  if (!element) return;

  const roles = [
    'Cybersecurite',
    'Developpement Full-Stack',
    'Pentest & OSINT',
    'Solutions Web3',
    'React / Next.js',
    'Applications Mobiles'
  ];

  let roleIndex = 0, charIndex = 0;
  let isDeleting = false, speed = 80;

  function type() {
    const current = roles[roleIndex];
    if (isDeleting) {
      element.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      speed = 35;
    } else {
      element.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      speed = 70 + Math.random() * 40;
    }
    if (!isDeleting && charIndex === current.length) {
      speed = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }
    setTimeout(type, speed);
  }

  setTimeout(type, 1200);
}

/* initScrollReveal — now in globals.js */

/* ═══════════════════════════════════════════════════════════════════════════
   SKILL BARS
   ═══════════════════════════════════════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-item__progress');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = (bar.dataset.value || 0) + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => observer.observe(bar));
}

/* ═══════════════════════════════════════════════════════════════════════════
   COUNT UP
   ═══════════════════════════════════════════════════════════════════════════ */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCount(el, 0, target, 2000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCount(el, start, end, duration) {
  const startTime = performance.now();
  function update(t) {
    const p = Math.min((t - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(start + (end - start) * ease);
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT FILTERS
   ═══════════════════════════════════════════════════════════════════════════ */
function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      const filter = btn.dataset.filter;

      let delay = 0;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        if (show) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = '';
          }, delay);
          delay += 60;
          // Clean up inline styles after animation
          setTimeout(() => {
            card.style.transition = '';
            card.style.opacity = '';
          }, delay + 600);
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
            card.style.transition = '';
            card.style.opacity = '';
            card.style.transform = '';
          }, 300);
        }
      });
    });
  });
}

/* initCardTilt — now in globals.js */

/* ═══════════════════════════════════════════════════════════════════════════
   CARD SHINE EFFECT
   ═══════════════════════════════════════════════════════════════════════════ */
function initCardShine() {
  if ('ontouchstart' in window) return;

  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const shine = card.querySelector('.project-card__shine');
    if (!shine) return;

    let shineRaf = 0;
    card.addEventListener('mousemove', (e) => {
      if (shineRaf) return;
      shineRaf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        shine.style.setProperty('--shine-x', x + '%');
        shine.style.setProperty('--shine-y', y + '%');
        shineRaf = 0;
      });
    });

    card.addEventListener('mouseleave', () => {
      shine.style.setProperty('--shine-x', '-100%');
      shine.style.setProperty('--shine-y', '-100%');
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAGNETIC BUTTONS
   ═══════════════════════════════════════════════════════════════════════════ */
function initMagneticButtons() {
  if ('ontouchstart' in window) return;

  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach(el => {
    let magRaf = 0;
    el.addEventListener('mousemove', (e) => {
      if (magRaf) return;
      magRaf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        magRaf = 0;
      });
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'translate(0, 0)';
      setTimeout(() => { el.style.transition = ''; }, 400);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTON RIPPLE / GLOW FOLLOW
   ═══════════════════════════════════════════════════════════════════════════ */
function initButtonRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    let btnRaf = 0;
    btn.addEventListener('mousemove', (e) => {
      if (btnRaf) return;
      btnRaf = requestAnimationFrame(() => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        btn.style.setProperty('--x', x + '%');
        btn.style.setProperty('--y', y + '%');
        btnRaf = 0;
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARTICLES - Interactive canvas
   ═══════════════════════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let paused = false;
  const CELL_SIZE = 110;
  let grid = {};
  let gridCols = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gridCols = Math.ceil(canvas.width / CELL_SIZE);
  }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Pause when page hidden
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) requestAnimationFrame(animate);
  });

  // Pause when canvas not visible
  const canvasObs = new IntersectionObserver((entries) => {
    paused = !entries[0].isIntersecting;
    if (!paused) requestAnimationFrame(animate);
  }, { threshold: 0 });
  canvasObs.observe(canvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.baseSpeedX = (Math.random() - 0.5) * 0.3;
      this.baseSpeedY = (Math.random() - 0.5) * 0.3;
      this.speedX = this.baseSpeedX;
      this.speedY = this.baseSpeedY;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = (180 - dist) / 180;
          this.speedX = this.baseSpeedX - dx * force * 0.008;
          this.speedY = this.baseSpeedY - dy * force * 0.008;
        } else {
          this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
          this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
        }
      }
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139, 92, 246, ' + this.opacity + ')';
      ctx.fill();
    }
  }

  const count = window.innerWidth < 768 ? 25 : 50;
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function getGridKey(x, y) {
    return (Math.floor(x / CELL_SIZE)) + ',' + (Math.floor(y / CELL_SIZE));
  }

  function buildGrid() {
    grid = {};
    for (let i = 0; i < particles.length; i++) {
      var key = getGridKey(particles[i].x, particles[i].y);
      if (!grid[key]) grid[key] = [];
      grid[key].push(i);
    }
  }

  function drawConnections() {
    buildGrid();
    var drawn = {};

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const cx = Math.floor(p.x / CELL_SIZE);
      const cy = Math.floor(p.y / CELL_SIZE);

      // Check only neighboring cells
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const key = (cx + dx) + ',' + (cy + dy);
          const cell = grid[key];
          if (!cell) continue;
          for (let k = 0; k < cell.length; k++) {
            const j = cell[k];
            if (j <= i) continue;
            const pairKey = i < j ? i + '-' + j : j + '-' + i;
            if (drawn[pairKey]) continue;
            drawn[pairKey] = 1;

            const ddx = p.x - particles[j].x;
            const ddy = p.y - particles[j].y;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < 110) {
              const opacity = (1 - dist / 110) * 0.12;
              ctx.beginPath();
              ctx.strokeStyle = 'rgba(139, 92, 246, ' + opacity + ')';
              ctx.lineWidth = 0.5;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
    }

    // Mouse connections
    if (mouse.x !== null) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const ddx = mouse.x - p.x;
        const ddy = mouse.y - p.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < 200) {
          const opacity = (1 - dist / 200) * 0.2;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(6, 182, 212, ' + opacity + ')';
          ctx.lineWidth = 0.6;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (paused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
}

/* initSmoothScroll, initPageTransitions — now in globals.js */

/* ═══════════════════════════════════════════════════════════════════════════
   KONAMI CODE EASTER EGG -> Matrix rain
   ═══════════════════════════════════════════════════════════════════════════ */
function initKonamiCode() {
  const code = [38,38,40,40,37,39,37,39,66,65];
  let index = 0;

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === code[index]) {
      index++;
      if (index === code.length) {
        startMatrixRain();
        index = 0;
      }
    } else {
      index = 0;
    }
  });
}

function startMatrixRain() {
  const existing = document.getElementById('matrixCanvas');
  if (existing) { existing.remove(); return; }

  const canvas = document.createElement('canvas');
  canvas.id = 'matrixCanvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:99990;pointer-events:none;opacity:0.4;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコ';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(5, 5, 8, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  const interval = setInterval(draw, 50);
  setTimeout(() => {
    clearInterval(interval);
    canvas.remove();
  }, 8000);
}

/* initScrollProgress, initBackToTop — now in globals.js */

/* ═══════════════════════════════════════════════════════════════════════════
   TEXT SCRAMBLE on project card titles hover
   ═══════════════════════════════════════════════════════════════════════════ */
function initTextScramble() {
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  document.querySelectorAll('.project-card__title').forEach(title => {
    const original = title.textContent;
    let animating = false;

    title.closest('.project-card').addEventListener('mouseenter', () => {
      if (animating) return;
      animating = true;
      let iteration = 0;
      const length = original.length;

      const interval = setInterval(() => {
        title.textContent = original.split('')
          .map((char, i) => {
            if (i < iteration) return original[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        iteration += 1 / 2;
        if (iteration >= length) {
          title.textContent = original;
          clearInterval(interval);
          animating = false;
        }
      }, 30);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOOL TAG RANDOM GLOW PULSE
   ═══════════════════════════════════════════════════════════════════════════ */
function initToolTagGlow() {
  const tags = document.querySelectorAll('.tool-tag');
  if (!tags.length) return;

  function randomGlow() {
    const idx = Math.floor(Math.random() * tags.length);
    const tag = tags[idx];
    tag.classList.add('glow-pulse');
    tag.addEventListener('animationend', () => {
      tag.classList.remove('glow-pulse');
    }, { once: true });
  }

  setInterval(randomGlow, 2000);
}

/* ═══════════════════════════════════════════════════════════════════════════
   TIMELINE SCROLL PROGRESS LINE
   ═══════════════════════════════════════════════════════════════════════════ */
function initTimelineProgress() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const progressLine = document.createElement('div');
  progressLine.className = 'timeline__progress-line';
  timeline.appendChild(progressLine);

  let ticking = false;
  const dots = timeline.querySelectorAll('.timeline__dot');

  function update() {
    const rect = timeline.getBoundingClientRect();
    const timelineHeight = rect.height;
    const scrollPos = window.innerHeight * 0.5;
    const progress = Math.max(0, Math.min(1, (scrollPos - rect.top) / timelineHeight));
    progressLine.style.height = (progress * timelineHeight) + 'px';

    // Batch all reads first, then writes
    const dotPositions = [];
    dots.forEach(dot => {
      dotPositions.push({ dot, top: dot.getBoundingClientRect().top });
    });
    dotPositions.forEach(({ dot, top }) => {
      if (scrollPos > top) {
        dot.classList.add('timeline__dot--active');
      }
    });
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function() {
        update();
        ticking = false;
      });
    }
  }, { passive: true });
  update();
}

/* ═══════════════════════════════════════════════════════════════════════════
   WORD-BY-WORD REVEAL for descriptions
   ═══════════════════════════════════════════════════════════════════════════ */
function initWordReveal() {
  const descriptions = document.querySelectorAll('.hero__description');
  descriptions.forEach(desc => {
    const text = desc.textContent.trim();
    desc.textContent = '';
    desc.classList.add('word-reveal');

    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word + '\u00A0';
      span.style.transitionDelay = (i * 0.03) + 's';
      desc.appendChild(span);
    });
  });
}

/* initSectionTagTyping — now in globals.js */

/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT CARD GLOW FOLLOW
   ═══════════════════════════════════════════════════════════════════════════ */
function initContactGlow() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.contact-card').forEach(card => {
    let glowRaf = 0;
    card.addEventListener('mousemove', (e) => {
      if (glowRaf) return;
      glowRaf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--glow-x', x + '%');
        card.style.setProperty('--glow-y', y + '%');
        glowRaf = 0;
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   WEB3 CARD 3D TILT + SHINE
   ═══════════════════════════════════════════════════════════════════════════ */
function initWeb3CardTilt() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.web3__card').forEach(card => {
    let tiltRaf = 0;
    card.addEventListener('mousemove', (e) => {
      if (tiltRaf) return;
      tiltRaf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -4;
        const rotateY = (x - centerX) / centerX * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        tiltRaf = 0;
      });
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = '';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARALLAX DEPTH - Background elements move on scroll
   ═══════════════════════════════════════════════════════════════════════════ */
function initParallaxDepth() {
  const glows = document.querySelectorAll('.bg-glow');
  if (!glows.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scroll = window.scrollY;
        glows.forEach((glow, i) => {
          const speed = 0.03 + i * 0.015;
          glow.style.transform = `translate(${Math.sin(scroll * 0.001 + i) * 20}px, ${scroll * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO PARALLAX - Elements move at different speeds
   ═══════════════════════════════════════════════════════════════════════════ */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const badge = hero.querySelector('.hero__badge');
  const name = hero.querySelector('.hero__title-name');
  const roles = hero.querySelector('.hero__roles');
  const desc = hero.querySelector('.hero__description');
  const stats = hero.querySelector('.hero__stats');
  const floaters = hero.querySelector('.hero__floaters');

  // Wait for hero entrance animations to complete before enabling parallax
  let enabled = false;
  setTimeout(() => { enabled = true; }, 2500);

  let ticking = false;
  let cachedHeroH = hero.offsetHeight;
  window.addEventListener('resize', () => { cachedHeroH = hero.offsetHeight; }, { passive: true });
  window.addEventListener('scroll', () => {
    if (!enabled) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scroll = window.scrollY;
      const heroH = cachedHeroH;
      if (scroll < heroH) {
        const ratio = scroll / heroH;
        if (badge) badge.style.transform = `translateY(${scroll * 0.15}px)`;
        if (name) name.style.transform = `translateY(${scroll * 0.08}px)`;
        if (roles) roles.style.transform = `translateY(${scroll * 0.12}px)`;
        if (desc) desc.style.transform = `translateY(${scroll * 0.18}px)`;
        if (stats) stats.style.transform = `translateY(${scroll * 0.22}px)`;
        if (floaters) floaters.style.opacity = 1 - ratio * 1.5;

        // Fade hero on scroll
        hero.style.opacity = 1 - ratio * 0.8;
      }
      ticking = false;
    });
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════════════════
   CLICKABLE PROJECT CARDS - Navigate to detail page on card click
   ═══════════════════════════════════════════════════════════════════════════ */
function initCardLinks() {
  const transition = document.querySelector('.page-transition');
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Let external link clicks pass through naturally
      if (e.target.closest('.project-card__link')) return;

      // Find the detail button href
      const detailBtn = card.querySelector('.project-card__detail-btn');
      if (!detailBtn) return;
      const href = detailBtn.getAttribute('href');
      if (!href) return;

      e.preventDefault();

      // Use page transition if available
      if (transition) {
        transition.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 500);
      } else {
        window.location.href = href;
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT TERMINAL - Line-by-line reveal on scroll
   ═══════════════════════════════════════════════════════════════════════════ */
function initTerminalLineReveal() {
  const terminalBody = document.querySelector('.about__terminal-body');
  if (!terminalBody) return;

  const lines = terminalBody.querySelectorAll('.line');
  if (!lines.length) return;

  // Set initial state
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-15px)';
    line.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lines.forEach(line => {
          line.style.opacity = '1';
          line.style.transform = 'translateX(0)';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(terminalBody);
}

/* ═══════════════════════════════════════════════════════════════════════════
   CODE SHOWCASE — Typing cursor + line-by-line reveal on scroll
   ═══════════════════════════════════════════════════════════════════════════ */
function initCodeShowcase() {
  const editors = document.querySelectorAll('.code-editor');
  if (!editors.length) return;

  editors.forEach(editor => {
    const code = editor.querySelector('.code-editor__code code');
    const lines = editor.querySelector('.code-editor__lines');
    if (!code || !lines) return;

    // Store original content
    const originalHTML = code.innerHTML;
    const lineSpans = lines.querySelectorAll('span');
    const totalLines = lineSpans.length;

    // Hide lines initially
    code.style.opacity = '0';
    lineSpans.forEach(s => { s.style.opacity = '0'; });

    let revealed = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !revealed) {
          revealed = true;
          revealCode(code, lineSpans, totalLines, originalHTML);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(editor);
  });
}

function revealCode(codeEl, lineSpans, totalLines, html) {
  const htmlLines = html.split('\n');
  codeEl.textContent = '';
  codeEl.style.opacity = '1';

  // Pre-build all content, reveal progressively via a single container
  const container = document.createDocumentFragment();
  const lineElements = [];
  htmlLines.forEach((line, i) => {
    const span = document.createElement('span');
    span.style.display = 'none';
    span.textContent = (i > 0 ? '\n' : '') + htmlLines[i].replace(/<[^>]*>/g, '');
    lineElements.push(span);
    container.appendChild(span);
  });
  codeEl.appendChild(container);

  let currentLine = 0;
  const interval = setInterval(() => {
    if (currentLine >= lineElements.length) {
      clearInterval(interval);
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      codeEl.appendChild(cursor);
      return;
    }

    if (lineSpans[currentLine]) {
      lineSpans[currentLine].style.opacity = '1';
      lineSpans[currentLine].style.transition = 'opacity 0.2s ease';
    }

    lineElements[currentLine].style.display = '';
    currentLine++;
  }, 60);
}

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER - Staggered entrance + live clock
   ═══════════════════════════════════════════════════════════════════════════ */
function initFooterReveal() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  // Staggered reveal for footer sections
  const cta = footer.querySelector('.footer__cta');
  const marquee = footer.querySelector('.footer__marquee');
  const bottom = footer.querySelector('.footer__bottom');
  const elements = [cta, marquee, bottom].filter(Boolean);

  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        elements.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(footer);

  // Live clock in footer
  const timeEl = document.getElementById('footerTime');
  if (timeEl) {
    function updateTime() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = 'Lyon, FR — ' + h + ':' + m + ':' + s;
    }
    updateTime();
    setInterval(updateTime, 1000);
  }
}
