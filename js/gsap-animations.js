/* ═══════════════════════════════════════════════════════════════════════════
   GSAP SCROLLTRIGGER ANIMATIONS — pazent.fr
   Word reveal on h2 | Enhanced card stagger | Parallax floaters
   NOTE: skill bars & counters are handled by main.js (IntersectionObserver)
   This file adds GSAP-layer polish on top.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Wait for GSAP to be available
  function waitForGSAP(cb) {
    if (window.gsap && window.ScrollTrigger) {
      cb();
    } else {
      var t = setInterval(function () {
        if (window.gsap && window.ScrollTrigger) {
          clearInterval(t);
          cb();
        }
      }, 50);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    waitForGSAP(initGSAPAnimations);
  });

  function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // ── 1. WORD-BY-WORD H2 REVEAL ──────────────────────────────────────────
    // Select all section h2s (not the hero name which has its own animation)
    var headings = document.querySelectorAll('.section__title');

    headings.forEach(function (h2) {
      // Skip if already animated
      if (h2.dataset.gsapDone) return;
      h2.dataset.gsapDone = '1';

      var text = h2.textContent.trim();
      if (!text) return;

      // Split into words, preserve HTML entities manually
      var words = text.split(/\s+/);
      h2.innerHTML = words.map(function (w) {
        return '<span class="gsap-word-wrap"><span class="gsap-word">' + w + '</span></span>';
      }).join(' ');

      var wordEls = h2.querySelectorAll('.gsap-word');

      gsap.fromTo(wordEls,
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: h2,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // Inject CSS for word overflow clip if not present
    if (!document.getElementById('gsap-word-style')) {
      var style = document.createElement('style');
      style.id = 'gsap-word-style';
      style.textContent = [
        '.gsap-word-wrap {',
        '  display: inline-block;',
        '  overflow: hidden;',
        '  vertical-align: bottom;',
        '}',
        '.gsap-word {',
        '  display: inline-block;',
        '  will-change: transform, opacity;',
        '}'
      ].join('\n');
      document.head.appendChild(style);
    }

    // ── 2. PROJECT CARDS — STAGGER FROM BOTTOM ───────────────────────────────
    var projectGrid = document.getElementById('projectsGrid');
    if (projectGrid) {
      var cards = projectGrid.querySelectorAll('.project-card');
      if (cards.length) {
        // Group cards by "batch" of 3 for stagger
        ScrollTrigger.create({
          trigger: projectGrid,
          start: 'top 80%',
          once: true,
          onEnter: function () {
            gsap.fromTo(cards,
              { y: 60, opacity: 0, scale: 0.96 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.65,
                stagger: { amount: 0.8, from: 'start' },
                ease: 'power2.out',
                clearProps: 'transform'
              }
            );
          }
        });
      }
    }

    // ── 3. SECTION TAGS — SLIDE IN FROM LEFT ─────────────────────────────────
    var tags = document.querySelectorAll('.section__tag');
    tags.forEach(function (tag) {
      gsap.fromTo(tag,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: tag,
            start: 'top 88%',
            once: true
          }
        }
      );
    });

    // ── 4. SKILL CARDS — ENHANCED ENTRANCE ──────────────────────────────────
    var skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(function (card, i) {
      gsap.fromTo(card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // ── 5. TIMELINE ITEMS ────────────────────────────────────────────────────
    var timelineItems = document.querySelectorAll('.timeline__item');
    timelineItems.forEach(function (item, i) {
      gsap.fromTo(item,
        { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // ── 6. CONTACT CARDS — STAGGER ───────────────────────────────────────────
    var contactCards = document.querySelectorAll('.contact-card');
    if (contactCards.length) {
      gsap.fromTo(contactCards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contactCards[0],
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    // ── 7. HERO FLOATERS — SUBTLE PARALLAX ON SCROLL ─────────────────────────
    // Only if touch not available (already checked by three-scene, but be safe)
    if (!('ontouchstart' in window)) {
      var floaterEls = document.querySelectorAll('.hero__float');
      if (floaterEls.length) {
        var speeds = [0.12, -0.08, 0.15, -0.1, 0.09];
        floaterEls.forEach(function (floater, i) {
          var speed = speeds[i % speeds.length];
          gsap.to(floater, {
            y: function () { return window.innerHeight * speed * -1; },
            ease: 'none',
            scrollTrigger: {
              trigger: '#hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          });
        });
      }
    }

    // ── 8. TESTIMONIAL CARDS ─────────────────────────────────────────────────
    var testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length) {
      gsap.fromTo(testimonials,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: testimonials[0],
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    // ── 9. WEB3 CARDS ────────────────────────────────────────────────────────
    var web3Cards = document.querySelectorAll('.web3__card');
    if (web3Cards.length) {
      gsap.fromTo(web3Cards,
        { y: 30, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: web3Cards[0],
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    // ── 10. FOOTER CTA — SCALE UP ────────────────────────────────────────────
    var footerCta = document.querySelector('.footer__cta');
    if (footerCta) {
      gsap.fromTo(footerCta,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerCta,
            start: 'top 90%',
            once: true
          }
        }
      );
    }

  } // end initGSAPAnimations

})();
