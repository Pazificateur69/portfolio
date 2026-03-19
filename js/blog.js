/* ═══════════════════════════════════════════════════════════════════════════
   BLOG.JS — Reading progress, auto-generated TOC, copy code button
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initReadingProgress();
    initTOC();
    initCopyButtons();
  });

  /* ─── Reading Progress Bar ─── */
  function initReadingProgress() {
    var bar = document.getElementById('blogProgress');
    if (!bar) return;

    window.__scrollHandlers = window.__scrollHandlers || [];
    window.__scrollHandlers.push(function (scrollY, docHeight) {
      var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      bar.style.width = Math.min(progress, 100) + '%';
    });
  }

  /* ─── Auto-generated Table of Contents ─── */
  function initTOC() {
    var tocList = document.getElementById('tocList');
    var content = document.querySelector('.blog-content');
    if (!tocList || !content) return;

    var headings = content.querySelectorAll('h2');
    if (!headings.length) {
      var tocEl = document.querySelector('.blog-toc');
      if (tocEl) tocEl.style.display = 'none';
      return;
    }

    headings.forEach(function (h, i) {
      var id = 'section-' + i;
      h.id = id;

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'blog-toc__link';
      a.href = '#' + id;
      a.textContent = h.textContent;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      li.appendChild(a);
      tocList.appendChild(li);
    });

    /* Highlight active TOC item on scroll */
    var tocLinks = tocList.querySelectorAll('.blog-toc__link');
    if (headings.length && window.IntersectionObserver) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            tocLinks.forEach(function (link) {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { rootMargin: '-80px 0px -70% 0px' });
      headings.forEach(function (h) { obs.observe(h); });
    }
  }

  /* ─── Copy Code Buttons ─── */
  function initCopyButtons() {
    var blocks = document.querySelectorAll('.blog-code-block .code-block');
    blocks.forEach(function (block) {
      var btn = document.createElement('button');
      btn.className = 'code-block__copy';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        var codeBody = block.querySelector('.code-block__body');
        if (!codeBody) return;
        var lines = codeBody.querySelectorAll('.line');
        var text = [];
        lines.forEach(function (line) {
          var clone = line.cloneNode(true);
          var lineNum = clone.querySelector('.line-num');
          if (lineNum) lineNum.remove();
          text.push(clone.textContent);
        });
        navigator.clipboard.writeText(text.join('\n')).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
        });
      });
      block.parentElement.insertBefore(btn, block);
    });
  }
})();
