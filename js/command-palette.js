/* ═══════════════════════════════════════════════════════════════════════════
   COMMAND PALETTE — VS Code-style Ctrl+K navigation
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var commands = [
    { label: 'Accueil',              url: 'index.html',              icon: 'home',     keys: ['accueil','home','index'] },
    { label: 'CV / Resume',          url: 'resume.html',             icon: 'file',     keys: ['cv','resume','formation'] },
    { label: 'Engineering',          url: 'engineering.html',        icon: 'code',     keys: ['engineering','archi','solid'] },
    { label: 'Infrastructure',       url: 'infrastructure.html',     icon: 'server',   keys: ['infra','devops','cicd','pipeline'] },
    { label: 'Web3 Engineering',     url: 'web3-engineering.html',   icon: 'cube',     keys: ['web3','blockchain','defi','solidity'] },
    { label: 'Security Lab',         url: 'security-lab.html',       icon: 'shield',   keys: ['security','pentest','osint'] },
    { label: 'Interactive Sandbox',  url: 'security-sandbox.html',   icon: 'terminal', keys: ['sandbox','xss','csrf','jwt'] },
    { label: 'Portfolio Audit',      url: 'portfolio-audit.html',    icon: 'scan',     keys: ['audit','scan'] },
    { label: 'Publications',         url: 'publications.html',       icon: 'book',     keys: ['publications','articles','blog'] },
    { label: 'Blog',                 url: 'blog/',                   icon: 'edit',     keys: ['blog','articles','writeup'] },
    { label: 'CTF Writeups',         url: 'ctf.html',                icon: 'flag',     keys: ['ctf','capture','flag','hack'] },
    { label: 'Veille Techno',        url: 'veille.html',             icon: 'rss',      keys: ['veille','rss','news','feed'] },
    { label: 'Changelog',            url: 'changelog.html',          icon: 'git',      keys: ['changelog','version','update'] },
    { label: 'Uses / Setup',         url: 'uses.html',               icon: 'tool',     keys: ['uses','setup','tools','stack'] },
    { label: 'Stats',                url: 'stats.html',              icon: 'scan',     keys: ['stats','metrics','dashboard'] },
    { label: 'Now',                  url: 'now.html',                icon: 'home',     keys: ['now','currently','maintenant'] },
    { label: 'Contact',              url: 'index.html#contact',      icon: 'mail',     keys: ['contact','email','message'] },
    { label: 'Projets',              url: 'index.html#projects',     icon: 'folder',   keys: ['projets','projects','portfolio'] },
    { label: 'GitHub',               url: 'https://github.com/Pazificateur', icon: 'github', keys: ['github','git','repo'], external: true }
  ];

  var icons = {
    home:     '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    file:     '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    code:     '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    server:   '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
    cube:     '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    shield:   '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    scan:     '<path d="M11 4H4v7"/><path d="M4 15v5h7"/><path d="M20 9V4h-5"/><path d="M13 20h7v-5"/>',
    book:     '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    edit:     '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    flag:     '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    rss:      '<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>',
    git:      '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>',
    tool:     '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    mail:     '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    folder:   '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    github:   '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>'
  };

  var overlay, input, list, selectedIndex = 0, filteredCommands = [];
  var isInSubdir = window.location.pathname.indexOf('/projects/') !== -1 || window.location.pathname.indexOf('/blog/') !== -1;
  var prefix = isInSubdir ? '../' : '';

  function getIcon(name) {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (icons[name] || '') + '</svg>';
  }

  function createPalette() {
    overlay = document.createElement('div');
    overlay.id = 'commandPalette';
    overlay.innerHTML =
      '<div class="cmd-palette">' +
        '<div class="cmd-palette__search">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<input type="text" class="cmd-palette__input" placeholder="Rechercher une page..." autocomplete="off" spellcheck="false">' +
          '<kbd class="cmd-palette__kbd">ESC</kbd>' +
        '</div>' +
        '<ul class="cmd-palette__list"></ul>' +
      '</div>';
    document.body.appendChild(overlay);

    input = overlay.querySelector('.cmd-palette__input');
    list = overlay.querySelector('.cmd-palette__list');

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) close();
    });

    input.addEventListener('input', function() {
      filter(this.value);
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); execute(); }
      else if (e.key === 'Escape') { close(); }
    });
  }

  function filter(query) {
    var q = query.toLowerCase().trim();
    filteredCommands = commands.filter(function(cmd) {
      if (!q) return true;
      if (cmd.label.toLowerCase().indexOf(q) !== -1) return true;
      return cmd.keys.some(function(k) { return k.indexOf(q) !== -1; });
    });
    selectedIndex = 0;
    render();
  }

  function render() {
    list.innerHTML = filteredCommands.map(function(cmd, i) {
      var cls = 'cmd-palette__item' + (i === selectedIndex ? ' cmd-palette__item--active' : '');
      return '<li class="' + cls + '" data-index="' + i + '">' +
        '<span class="cmd-palette__icon">' + getIcon(cmd.icon) + '</span>' +
        '<span class="cmd-palette__label">' + cmd.label + '</span>' +
        (cmd.external ? '<span class="cmd-palette__badge">External</span>' : '') +
      '</li>';
    }).join('');

    list.querySelectorAll('.cmd-palette__item').forEach(function(item) {
      item.addEventListener('click', function() {
        selectedIndex = parseInt(this.getAttribute('data-index'));
        execute();
      });
      item.addEventListener('mouseenter', function() {
        selectedIndex = parseInt(this.getAttribute('data-index'));
        render();
      });
    });
  }

  function move(dir) {
    selectedIndex = (selectedIndex + dir + filteredCommands.length) % filteredCommands.length;
    render();
    var active = list.querySelector('.cmd-palette__item--active');
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  function execute() {
    var cmd = filteredCommands[selectedIndex];
    if (!cmd) return;
    close();
    if (cmd.external) {
      window.open(cmd.url, '_blank');
    } else {
      var href = cmd.url.startsWith('#') ? cmd.url : prefix + cmd.url;
      window.location.href = href;
    }
  }

  function open() {
    if (!overlay) createPalette();
    filter('');
    overlay.classList.add('open');
    input.value = '';
    input.focus();
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ─── Keyboard shortcut: Ctrl+K ─── */
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (overlay && overlay.classList.contains('open')) {
        close();
      } else {
        open();
      }
    }
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      close();
    }
  });
})();
