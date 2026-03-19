/* ═══════════════════════════════════════════════════════════════════════════
   GLOBALS.JS — Shared functions loaded on ALL pages
   Theme, Lang, Dropdown, Loader, Navbar, Mobile Menu, Scroll Reveal,
   Smooth Scroll, Page Transitions, Scroll Progress, Back To Top,
   Section Tag Typing, Code Highlight, Parallax Hero, Card Tilt,
   Unified Scroll Bus, Consolidated IntersectionObserver, Visibility API
   ═══════════════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  // ─── Apply theme BEFORE DOMContentLoaded to avoid flash ───
  var savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // ─── Apply saved language ───
  var savedLang = localStorage.getItem('portfolio-lang') || 'fr';

  document.addEventListener('DOMContentLoaded', function() {
    initColorSchemeDetect();
    initThemeToggle();
    initSkipLink();
    initLangToggle();
    initSoundToggle();
    initDropdownNav();
    initLoader();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initPageTransitions();
    initUnifiedScroll();
    initGlobalObserver();
    initVisibilityAPI();
    initCustomCursor();
    initMouseSpotlight();
    initStaggeredTitles();
    initSoundDelegation();
    registerServiceWorker();
    initCookieBanner();
    initOfflineDetection();
  });

  /* ═══════════════════════════════════════════════════════════════════════
     THEME TOGGLE — dark/light with localStorage
     ═══════════════════════════════════════════════════════════════════════ */
  function initThemeToggle() {
    var btns = [
      document.getElementById('themeToggle'),
      document.getElementById('themeToggleMobile')
    ].filter(Boolean);
    if (!btns.length) return;

    var moonSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    var sunSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

    function updateIcons() {
      var current = document.documentElement.getAttribute('data-theme');
      var icon = current === 'dark' ? moonSVG : sunSVG;
      var label = current === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      btns.forEach(function(b) {
        b.innerHTML = icon;
        b.setAttribute('aria-label', label);
      });
    }

    updateIcons();

    function toggle() {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      updateIcons();
    }

    btns.forEach(function(b) {
      b.addEventListener('click', function() {
        toggle();
        if (window.__sound) window.__sound.play('themeToggle');
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     LANGUAGE TOGGLE — FR/EN with window.__i18n and data-i18n
     ═══════════════════════════════════════════════════════════════════════ */
  function initLangToggle() {
    var btns = [
      document.getElementById('langToggle'),
      document.getElementById('langToggleMobile')
    ].filter(Boolean);
    if (!btns.length) return;

    function applyLang(lang) {
      var i18n = window.__i18n;
      if (!i18n || !i18n[lang]) return;

      var translations = i18n[lang];
      var elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (translations[key] !== undefined) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translations[key];
          } else {
            el.textContent = translations[key];
          }
        }
      });

      document.documentElement.setAttribute('lang', lang);
      var label = lang === 'fr' ? 'EN' : 'FR';
      btns.forEach(function(b) { b.textContent = label; });
    }

    applyLang(savedLang);

    function toggle() {
      var current = localStorage.getItem('portfolio-lang') || 'fr';
      var next = current === 'fr' ? 'en' : 'fr';
      localStorage.setItem('portfolio-lang', next);
      savedLang = next;
      applyLang(next);
    }

    btns.forEach(function(b) {
      b.addEventListener('click', function() {
        toggle();
        if (window.__sound) window.__sound.play('click');
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     SOUND TOGGLE — on/off with localStorage
     ═══════════════════════════════════════════════════════════════════════ */
  function initSoundToggle() {
    var btns = [
      document.getElementById('soundToggle'),
      document.getElementById('soundToggleMobile')
    ].filter(Boolean);
    if (!btns.length) return;

    var onSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    var offSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';

    function updateIcons() {
      var enabled = window.__sound && window.__sound.isEnabled();
      var icon = enabled ? onSVG : offSVG;
      var label = enabled ? 'Disable sound' : 'Enable sound';
      btns.forEach(function(b) {
        b.innerHTML = icon;
        b.setAttribute('aria-label', label);
      });
    }

    updateIcons();

    btns.forEach(function(b) {
      b.addEventListener('click', function() {
        if (window.__sound) {
          window.__sound.toggle();
          window.__sound.play('click');
          updateIcons();
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     DROPDOWN NAV — hover/click on .navbar__dropdown
     ═══════════════════════════════════════════════════════════════════════ */
  function initDropdownNav() {
    var dropdowns = document.querySelectorAll('.navbar__dropdown');
    if (!dropdowns.length) return;

    dropdowns.forEach(function(dropdown) {
      var trigger = dropdown.querySelector('.navbar__dropdown-trigger');
      var menu = dropdown.querySelector('.navbar__dropdown-menu');
      if (!trigger || !menu) return;

      var closeTimeout;

      function open() {
        clearTimeout(closeTimeout);
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }

      function close() {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      function delayedClose() {
        closeTimeout = setTimeout(close, 200);
      }

      dropdown.addEventListener('mouseenter', open);
      dropdown.addEventListener('mouseleave', delayedClose);

      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (dropdown.classList.contains('open')) {
          close();
        } else {
          open();
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') close();
      });

      document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) close();
      });
    });

    var mobileLabsToggle = document.querySelector('.mobile-menu__labs-toggle');
    if (mobileLabsToggle) {
      mobileLabsToggle.addEventListener('click', function() {
        var submenu = this.nextElementSibling;
        if (submenu) {
          submenu.classList.toggle('open');
          this.classList.toggle('open');
        }
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     LOADER — Terminal boot sequence (page-specific lines via data attr)
     ═══════════════════════════════════════════════════════════════════════ */
  function initLoader() {
    var loader = document.getElementById('loader');
    var progressBar = document.getElementById('loaderProgress');
    if (!loader) return;

    // Quick progress fill then fade
    requestAnimationFrame(function() {
      if (progressBar) progressBar.style.width = '100%';
    });
    setTimeout(function() { loader.classList.add('hidden'); }, 800);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     NAVBAR — hide/show on scroll + active link (scroll bus handles it)
     ═══════════════════════════════════════════════════════════════════════ */
  var _navbarEl = null;
  var _navbarLastScroll = 0;

  var _navIndicator = null;

  function initNavbar() {
    _navbarEl = document.getElementById('navbar');
    if (!_navbarEl) return;

    // Create the animated indicator pill
    var linksContainer = _navbarEl.querySelector('.navbar__links');
    if (linksContainer) {
      _navIndicator = document.createElement('div');
      _navIndicator.className = 'navbar__indicator';
      linksContainer.appendChild(_navIndicator);
    }

    // Active link highlighting via IntersectionObserver
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.navbar__link');
    if (sections.length && navLinks.length) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function(link) {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
            // Move the indicator
            moveNavIndicator(navLinks);
          }
        });
      }, { rootMargin: '-40% 0px -60% 0px' });
      sections.forEach(function(s) { obs.observe(s); });
    }
  }

  function moveNavIndicator(navLinks) {
    if (!_navIndicator) return;
    var activeLink = null;
    navLinks.forEach(function(link) {
      if (link.classList.contains('active')) activeLink = link;
    });
    if (activeLink) {
      var linksContainer = _navIndicator.parentElement;
      var containerRect = linksContainer.getBoundingClientRect();
      var linkRect = activeLink.getBoundingClientRect();
      _navIndicator.style.left = (linkRect.left - containerRect.left) + 'px';
      _navIndicator.style.width = linkRect.width + 'px';
      _navIndicator.classList.add('visible');
    } else {
      _navIndicator.classList.remove('visible');
    }
  }

  // Called by unified scroll handler
  function _updateNavbar(scrollY) {
    if (!_navbarEl) return;
    _navbarEl.classList.toggle('scrolled', scrollY > 60);
    if (scrollY > 300) {
      _navbarEl.classList.toggle('hide', scrollY > _navbarLastScroll);
    } else {
      _navbarEl.classList.remove('hide');
    }
    _navbarLastScroll = scrollY;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     MOBILE MENU
     ═══════════════════════════════════════════════════════════════════════ */
  function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    menu.querySelectorAll('.mobile-menu__link').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     SMOOTH SCROLL
     ═══════════════════════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE TRANSITIONS
     ═══════════════════════════════════════════════════════════════════════ */
  function initPageTransitions() {
    var transition = document.getElementById('pageTransition');
    if (!transition) return;

    // Enter animation: panels shrink away to reveal the page
    transition.classList.add('entering');
    setTimeout(function() {
      transition.classList.remove('entering');
    }, 900);

    // Intercept internal .html links for exit animation
    document.querySelectorAll('a[href$=".html"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (!href || href.startsWith('http')) return;
        e.preventDefault();
        if (window.__sound) window.__sound.play('pageTransition');
        transition.classList.add('exiting');
        setTimeout(function() { window.location.href = href; }, 700);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     UNIFIED SCROLL BUS — Single RAF-throttled scroll listener
     Handles: navbar, scroll progress, back-to-top, timeline, parallax hero
     Page-specific JS can register via window.__scrollHandlers.push(fn)
     ═══════════════════════════════════════════════════════════════════════ */
  var _scrollProgressBar = null;
  var _backToTopBtn = null;
  var _parallaxHero = null;
  window.__scrollHandlers = window.__scrollHandlers || [];

  function initUnifiedScroll() {
    // Scroll progress bar
    var existingBar = document.getElementById('scrollProgress') || document.getElementById('scrollProgressBar');
    if (existingBar) {
      _scrollProgressBar = existingBar;
    } else {
      _scrollProgressBar = document.createElement('div');
      _scrollProgressBar.className = 'scroll-progress';
      _scrollProgressBar.id = 'scrollProgressBar';
      document.body.prepend(_scrollProgressBar);
    }

    // Back to top button
    var existingBtn = document.getElementById('backToTop');
    if (existingBtn) {
      _backToTopBtn = existingBtn;
    } else {
      _backToTopBtn = document.createElement('button');
      _backToTopBtn.className = 'back-to-top';
      _backToTopBtn.setAttribute('aria-label', 'Retour en haut');
      _backToTopBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>';
      document.body.appendChild(_backToTopBtn);
    }
    _backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Parallax hero — supports multiple selectors
    _parallaxHero = document.querySelector('.project-hero') || document.querySelector('.w3-hero');
    var _cachedHeroHeight = _parallaxHero ? _parallaxHero.offsetHeight : 0;
    window.addEventListener('resize', function() {
      if (_parallaxHero) _cachedHeroHeight = _parallaxHero.offsetHeight;
    }, { passive: true });

    // Single scroll listener
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function() {
        var scrollY = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Navbar
        _updateNavbar(scrollY);

        // Scroll progress
        if (_scrollProgressBar) {
          var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
          _scrollProgressBar.style.width = progress + '%';
        }

        // Back to top
        if (_backToTopBtn) {
          _backToTopBtn.classList.toggle('visible', scrollY > 600);
        }

        // Parallax hero (sub-pages)
        if (_parallaxHero) {
          var heroHeight = _cachedHeroHeight;
          if (scrollY < heroHeight) {
            var opacity = 1 - scrollY / heroHeight;
            _parallaxHero.style.opacity = Math.max(opacity, 0);
            _parallaxHero.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
          }
        }

        // Page-specific scroll handlers
        for (var i = 0; i < window.__scrollHandlers.length; i++) {
          window.__scrollHandlers[i](scrollY, docHeight);
        }

        ticking = false;
      });
    }, { passive: true });

    // Initial update
    _updateNavbar(window.scrollY);
    if (_scrollProgressBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      _scrollProgressBar.style.width = (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0) + '%';
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     CONSOLIDATED INTERSECTION OBSERVER
     Routes by selector for all common patterns:
     - .reveal, .reveal-left, .reveal-right, .reveal-scale → add 'active'
     - .section__tag, .project-section__tag → typing animation
     - .code-block → staggered line reveal
     ═══════════════════════════════════════════════════════════════════════ */
  function initGlobalObserver() {
    // Scroll reveal observer
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (reveals.length) {
      var revealObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      reveals.forEach(function(el) { revealObs.observe(el); });
    }

    // Section tag typing observer
    var tags = document.querySelectorAll('.section__tag, .project-section__tag');
    if (tags.length) {
      var tagObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var tag = entry.target;
            var fullText = tag.textContent;
            tag.textContent = '';
            if (tag.classList.contains('project-section__tag')) {
              tag.style.borderRight = '2px solid var(--purple)';
            } else {
              tag.classList.add('typed');
            }
            var i = 0;

            function typeChar() {
              if (i < fullText.length) {
                tag.textContent += fullText[i];
                i++;
                setTimeout(typeChar, 35 + Math.random() * 25);
              } else {
                if (tag.classList.contains('project-section__tag')) {
                  setTimeout(function() { tag.style.borderRight = 'none'; }, 1000);
                } else {
                  setTimeout(function() { tag.classList.remove('typed'); }, 1000);
                }
              }
            }
            typeChar();
            tagObs.unobserve(tag);
          }
        });
      }, { threshold: 0.5 });
      tags.forEach(function(tag) { tagObs.observe(tag); });
    }

    // Code highlight observer
    var codeLines = document.querySelectorAll('.code-block__body .line');
    if (codeLines.length) {
      codeLines.forEach(function(line, i) {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-10px)';
        line.style.transition = 'all 0.4s ease ' + (i * 0.05) + 's';
      });

      var codeObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.line').forEach(function(line) {
              line.style.opacity = '1';
              line.style.transform = 'translateX(0)';
            });
          }
        });
      }, { threshold: 0.3 });
      document.querySelectorAll('.code-block').forEach(function(block) { codeObs.observe(block); });
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     CARD TILT — Generic 3D tilt on hover for all tiltable cards
     Page-specific selectors added via window.__tiltSelectors
     ═══════════════════════════════════════════════════════════════════════ */
  window.__tiltSelectors = window.__tiltSelectors || [];

  // Called after page-specific JS has had time to push selectors
  setTimeout(function() {
    if ('ontouchstart' in window) return;

    // Combine all selectors
    var defaultSelectors = [
      '.project-card', '.skill-card', '.contact-card',
      '.about__detail-card', '.timeline__content'
    ];
    var allSelectors = defaultSelectors.concat(window.__tiltSelectors);
    var selector = allSelectors.join(', ');
    var cards = document.querySelectorAll(selector);
    if (!cards.length) return;

    cards.forEach(function(card) {
      var tiltRaf = 0;
      card.addEventListener('mousemove', function(e) {
        if (tiltRaf) return;
        tiltRaf = requestAnimationFrame(function() {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          var centerX = rect.width / 2;
          var centerY = rect.height / 2;
          var rotateX = (y - centerY) / centerY * -3;
          var rotateY = (x - centerX) / centerX * 3;
          card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-3px)';
          tiltRaf = 0;
        });
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(function() { card.style.transition = ''; }, 500);
      });
    });
  }, 0);

  /* ═══════════════════════════════════════════════════════════════════════
     VISIBILITY API — Pause animations when page is hidden
     ═══════════════════════════════════════════════════════════════════════ */
  function initVisibilityAPI() {
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        document.body.classList.add('page-hidden');
      } else {
        document.body.classList.remove('page-hidden');
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     CUSTOM CURSOR — Dot + circle follower with glow
     Disabled on touch devices
     ═══════════════════════════════════════════════════════════════════════ */
  function initCustomCursor() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    var cursor = document.getElementById('customCursor');
    var dot = document.getElementById('cursorDot');
    var circle = document.getElementById('cursorCircle');
    if (!cursor || !dot || !circle) return;

    cursor.classList.add('active');
    document.body.classList.add('custom-cursor-active');

    var mouseX = 0, mouseY = 0;
    var circleX = 0, circleY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Smooth circle follow with lerp
    function animateCircle() {
      circleX += (mouseX - circleX) * 0.15;
      circleY += (mouseY - circleY) * 0.15;
      circle.style.left = circleX + 'px';
      circle.style.top = circleY + 'px';
      requestAnimationFrame(animateCircle);
    }
    animateCircle();

    // Hover detection for interactive elements
    var hoverTargets = 'a, button, .btn, .project-card__link, .project-card__detail-btn, .filter-btn, .tool-tag, .contact-card, .navbar__link, .navbar__control-btn, .web3__card-link, input, textarea';

    document.addEventListener('mouseover', function(e) {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', function(e) {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.remove('hovering');
      }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function() {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
      cursor.style.opacity = '1';
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     MOUSE SPOTLIGHT — Subtle radial gradient following cursor
     Disabled on touch devices
     ═══════════════════════════════════════════════════════════════════════ */
  function initMouseSpotlight() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    var spotlight = document.getElementById('mouseSpotlight');
    if (!spotlight) return;

    spotlight.classList.add('active');

    document.addEventListener('mousemove', function(e) {
      spotlight.style.setProperty('--mx', e.clientX + 'px');
      spotlight.style.setProperty('--my', e.clientY + 'px');
    });

    document.addEventListener('mouseleave', function() {
      spotlight.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
      spotlight.style.opacity = '';
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     STAGGERED TEXT REVEAL — Section titles word by word
     ═══════════════════════════════════════════════════════════════════════ */
  function initStaggeredTitles() {
    var titles = document.querySelectorAll('.section__title');
    titles.forEach(function(title) {
      var text = title.textContent.trim();
      if (!text) return;
      var words = text.split(/\s+/);
      title.innerHTML = '';
      words.forEach(function(word, i) {
        var span = document.createElement('span');
        span.className = 'word';
        var inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.textContent = word;
        inner.style.transitionDelay = (i * 0.08) + 's';
        span.appendChild(inner);
        title.appendChild(span);
        // Add space between words
        if (i < words.length - 1) {
          title.appendChild(document.createTextNode('\u00A0'));
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     GLOBAL SOUND DELEGATION — hover/click micro-sounds
     ═══════════════════════════════════════════════════════════════════════ */
  function initSoundDelegation() {
    if (!window.__sound) return;
    var targets = 'a, button, .btn, .project-card, .navbar__link, .navbar__control-btn, .filter-btn, .pub-card__toggle';

    document.addEventListener('mouseover', function(e) {
      if (e.target.closest(targets)) window.__sound.play('hover');
    });
    document.addEventListener('mousedown', function(e) {
      if (e.target.closest(targets)) window.__sound.play('click');
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     SERVICE WORKER REGISTRATION
     ═══════════════════════════════════════════════════════════════════════ */
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      var swPath = document.querySelector('link[rel="manifest"]')
        ? (window.location.pathname.indexOf('/projects/') !== -1 ? '../service-worker.js' : 'service-worker.js')
        : 'service-worker.js';
      navigator.serviceWorker.register(swPath).catch(function() { /* silent */ });
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     SKIP LINK — Accessibility skip-to-content link
     ═══════════════════════════════════════════════════════════════════════ */
  function initSkipLink() {
    var main = document.querySelector('main');
    if (!main) return;
    if (!main.id) main.id = 'main-content';
    var skip = document.createElement('a');
    skip.href = '#' + main.id;
    skip.className = 'skip-link';
    skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     COLOR SCHEME DETECT — Auto-detect OS preference if no saved theme
     ═══════════════════════════════════════════════════════════════════════ */
  function initColorSchemeDetect() {
    if (localStorage.getItem('portfolio-theme')) return;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     COOKIE / RGPD BANNER
     ═══════════════════════════════════════════════════════════════════════ */
  function initCookieBanner() {
    if (localStorage.getItem('portfolio-cookies-accepted')) return;

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = '<div class="cookie-banner__content">' +
      '<p class="cookie-banner__text">Ce site utilise localStorage pour sauvegarder vos préférences (thème, langue, son). Aucun cookie tiers ni tracking.</p>' +
      '<div class="cookie-banner__actions">' +
      '<button class="cookie-banner__btn cookie-banner__btn--accept" id="cookieAccept">Compris</button>' +
      '<a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" target="_blank" rel="noopener" class="cookie-banner__btn cookie-banner__btn--info">En savoir plus</a>' +
      '</div></div>';
    document.body.appendChild(banner);

    requestAnimationFrame(function() {
      requestAnimationFrame(function() { banner.classList.add('visible'); });
    });

    document.getElementById('cookieAccept').addEventListener('click', function() {
      localStorage.setItem('portfolio-cookies-accepted', '1');
      banner.classList.remove('visible');
      setTimeout(function() { banner.remove(); }, 300);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     OFFLINE DETECTION — Show/hide banner on connectivity changes
     ═══════════════════════════════════════════════════════════════════════ */
  function initOfflineDetection() {
    function showOffline() {
      var banner = document.getElementById('offlineBanner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'offlineBanner';
        banner.className = 'offline-banner';
        banner.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg> Mode hors-ligne — Navigation limitée au cache';
        document.body.appendChild(banner);
        requestAnimationFrame(function() { banner.classList.add('visible'); });
      }
    }

    function hideOffline() {
      var banner = document.getElementById('offlineBanner');
      if (banner) {
        banner.classList.remove('visible');
        setTimeout(function() { banner.remove(); }, 300);
      }
    }

    window.addEventListener('offline', showOffline);
    window.addEventListener('online', hideOffline);
    if (!navigator.onLine) showOffline();
  }

})();
