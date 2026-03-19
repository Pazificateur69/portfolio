/* ═══════════════════════════════════════════════════════════════════════════
   VEILLE.JS — Curated news + optional RSS fetch + filters
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── Curated articles (always available) ─── */
  var CURATED = [
    {
      title: 'OWASP Top 10 — 2025 Update',
      url: 'https://owasp.org/Top10/',
      excerpt: 'Mise à jour du classement des 10 risques de sécurité les plus critiques pour les applications web.',
      source: 'OWASP',
      category: 'security',
      date: '2025-12-01',
      tags: ['Security', 'Web', 'OWASP']
    },
    {
      title: 'EIP-4844: Proto-Danksharding Explained',
      url: 'https://eips.ethereum.org/EIPS/eip-4844',
      excerpt: 'Comment le proto-danksharding réduit les coûts des rollups L2 avec les blob transactions.',
      source: 'Ethereum',
      category: 'web3',
      date: '2025-11-15',
      tags: ['Ethereum', 'L2', 'Scaling']
    },
    {
      title: 'Supply Chain Attacks in npm — 2025 Report',
      url: 'https://socket.dev/blog',
      excerpt: 'Analyse des attaques supply chain dans l\'écosystème npm : typosquatting, dependency confusion et protections.',
      source: 'Socket.dev',
      category: 'security',
      date: '2025-10-20',
      tags: ['npm', 'Supply Chain', 'Security']
    },
    {
      title: 'Vitalik: The Future of Ethereum Scaling',
      url: 'https://vitalik.eth.limo/',
      excerpt: 'Vision de Vitalik Buterin sur l\'avenir du scaling Ethereum : danksharding, verkle trees et statelessness.',
      source: 'Vitalik',
      category: 'web3',
      date: '2025-09-10',
      tags: ['Ethereum', 'Scaling', 'Research']
    },
    {
      title: 'Bun 1.2 — Faster Than Ever',
      url: 'https://bun.sh/blog',
      excerpt: 'Bun 1.2 apporte un runtime JS encore plus rapide, un bundler amélioré et la compatibilité Node.js étendue.',
      source: 'Bun',
      category: 'dev',
      date: '2025-08-05',
      tags: ['JavaScript', 'Runtime', 'Performance']
    },
    {
      title: 'CVE-2025-XXXXX: Critical OpenSSL Vulnerability',
      url: 'https://nvd.nist.gov/',
      excerpt: 'Vulnérabilité critique dans OpenSSL permettant une exécution de code à distance via buffer overflow dans le handshake TLS.',
      source: 'NVD',
      category: 'security',
      date: '2025-07-22',
      tags: ['CVE', 'OpenSSL', 'Critical']
    },
    {
      title: 'Deno 2.0 — Backwards Compatible, Forward Thinking',
      url: 'https://deno.com/blog',
      excerpt: 'Deno 2.0 avec compatibilité npm native, workspaces et performances améliorées.',
      source: 'Deno',
      category: 'dev',
      date: '2025-06-18',
      tags: ['Deno', 'TypeScript', 'Runtime']
    },
    {
      title: 'Uniswap v4 Hooks — A New DeFi Primitive',
      url: 'https://blog.uniswap.org/',
      excerpt: 'Les hooks Uniswap v4 permettent une personnalisation granulaire des pools de liquidité.',
      source: 'Uniswap',
      category: 'web3',
      date: '2025-05-30',
      tags: ['DeFi', 'Uniswap', 'Smart Contracts']
    },
    {
      title: 'Cloudflare Workers AI — Edge Inference',
      url: 'https://blog.cloudflare.com/',
      excerpt: 'Exécution de modèles IA directement sur le edge network de Cloudflare avec latence minimale.',
      source: 'Cloudflare',
      category: 'dev',
      date: '2025-04-12',
      tags: ['AI', 'Edge', 'Cloudflare']
    }
  ];

  /* ─── RSS Feeds (optional, fetched via allorigins proxy) ─── */
  var RSS_FEEDS = [
    { url: 'https://krebsonsecurity.com/feed/', category: 'security', source: 'Krebs' },
    { url: 'https://blog.ethereum.org/feed.xml', category: 'web3', source: 'Ethereum Blog' }
  ];

  var allArticles = CURATED.slice();
  var currentFilter = 'all';

  /* ─── DOM refs ─── */
  var grid, filters;

  /* ─── Render ─── */
  function renderArticles() {
    if (!grid) return;
    var filtered = currentFilter === 'all'
      ? allArticles
      : allArticles.filter(function (a) { return a.category === currentFilter; });

    if (!filtered.length) {
      grid.innerHTML = '<div class="veille-empty">Aucun article dans cette catégorie.</div>';
      return;
    }

    grid.innerHTML = filtered.map(function (a) {
      var sourceClass = 'veille-card__source--' + a.category;
      var tagsHtml = (a.tags || []).map(function (t) {
        return '<span class="veille-card__tag">' + t + '</span>';
      }).join('');

      return '<div class="veille-card reveal">' +
        '<div class="veille-card__header">' +
          '<span class="veille-card__source ' + sourceClass + '">' + escapeHtml(a.source) + '</span>' +
          '<span class="veille-card__date">' + formatDate(a.date) + '</span>' +
        '</div>' +
        '<h3 class="veille-card__title"><a href="' + escapeHtml(a.url) + '" target="_blank" rel="noopener">' + escapeHtml(a.title) + '</a></h3>' +
        '<p class="veille-card__excerpt">' + escapeHtml(a.excerpt) + '</p>' +
        '<div class="veille-card__tags">' + tagsHtml + '</div>' +
      '</div>';
    }).join('');

    /* Re-trigger scroll reveal for new cards */
    var reveals = grid.querySelectorAll('.reveal');
    if (reveals.length && window.IntersectionObserver) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add('active');
        });
      }, { threshold: 0.08 });
      reveals.forEach(function (el) { obs.observe(el); });
    }
  }

  /* ─── Helpers ─── */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /* ─── Optional RSS fetch ─── */
  function fetchRSS() {
    RSS_FEEDS.forEach(function (feed) {
      var proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(feed.url);
      fetch(proxyUrl).then(function (r) {
        if (!r.ok) throw new Error('Network error');
        return r.text();
      }).then(function (xml) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(xml, 'text/xml');
        var items = doc.querySelectorAll('item');
        var count = 0;
        items.forEach(function (item) {
          if (count >= 3) return;
          var title = item.querySelector('title');
          var link = item.querySelector('link');
          var desc = item.querySelector('description');
          var pubDate = item.querySelector('pubDate');
          if (title && link) {
            allArticles.push({
              title: title.textContent,
              url: link.textContent,
              excerpt: desc ? desc.textContent.replace(/<[^>]*>/g, '').substring(0, 200) : '',
              source: feed.source,
              category: feed.category,
              date: pubDate ? new Date(pubDate.textContent).toISOString().split('T')[0] : '',
              tags: [feed.category === 'security' ? 'Security' : 'Web3']
            });
            count++;
          }
        });
        /* Sort by date descending */
        allArticles.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
        renderArticles();
      }).catch(function () {
        /* Graceful fallback — curated articles still shown */
      });
    });
  }

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    grid = document.getElementById('veilleGrid');
    filters = document.querySelectorAll('.veille-filter');

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderArticles();
      });
    });

    renderArticles();
    fetchRSS();

    window.__tiltSelectors = window.__tiltSelectors || [];
    window.__tiltSelectors.push('.veille-card');
  });
})();
