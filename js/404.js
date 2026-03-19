/* ═══════════════════════════════════════════════════════════════════════════
   404.JS — Matrix rain canvas + interactive terminal
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── Matrix Rain ─── */
  function initMatrixRain() {
    var canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/\\';
    var fontSize = 14;
    var columns = Math.floor(canvas.width / fontSize);
    var drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    function draw() {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#8b5cf6';
      ctx.font = fontSize + 'px monospace';

      for (var i = 0; i < drops.length; i++) {
        var char = chars[Math.floor(Math.random() * chars.length)];
        var x = i * fontSize;
        var y = drops[i] * fontSize;
        ctx.globalAlpha = Math.random() * 0.5 + 0.1;
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
      setInterval(draw, 45);
    }
  }

  /* ─── Terminal ─── */
  function initTerminal() {
    var body = document.getElementById('terminalBody');
    var input = document.getElementById('terminalInput');
    if (!body || !input) return;

    var pages = {
      'index':          'index.html',
      'home':           'index.html',
      'accueil':        'index.html',
      'engineering':    'engineering.html',
      'infrastructure': 'infrastructure.html',
      'web3':           'web3-engineering.html',
      'security':       'security-lab.html',
      'security-lab':   'security-lab.html',
      'publications':   'publications.html',
      'audit':          'portfolio-audit.html',
      'sandbox':        'security-sandbox.html',
      'resume':         'resume.html',
      'cv':             'resume.html',
      'changelog':      'changelog.html',
      'veille':         'veille.html',
      'blog':           'blog/'
    };

    function addLine(text, cls) {
      var div = document.createElement('div');
      div.className = 'terminal__line' + (cls ? ' terminal__line--' + cls : '');
      div.textContent = text;
      body.insertBefore(div, body.lastElementChild);
      body.scrollTop = body.scrollHeight;
    }

    function processCommand(cmd) {
      var trimmed = cmd.trim().toLowerCase();
      var parts = trimmed.split(/\s+/);
      var command = parts[0];
      var arg = parts.slice(1).join(' ');

      addLine('visitor@portfolio:~$ ' + cmd, '');

      switch (command) {
        case 'help':
          addLine('Available commands:', 'info');
          addLine('  help       — Show this help', 'output');
          addLine('  ls         — List pages', 'output');
          addLine('  cd <page>  — Navigate to page', 'output');
          addLine('  whoami     — Who are you?', 'output');
          addLine('  hack       — Try to hack the server', 'output');
          addLine('  clear      — Clear terminal', 'output');
          break;

        case 'ls':
          addLine('Pages disponibles :', 'info');
          Object.keys(pages).forEach(function (p) {
            addLine('  ' + p + '/', 'success');
          });
          break;

        case 'cd':
          if (!arg) {
            addLine('Usage: cd <page>', 'error');
            addLine('Type "ls" to list available pages', 'output');
          } else if (pages[arg]) {
            addLine('Navigating to ' + arg + '...', 'success');
            setTimeout(function () {
              window.location.href = pages[arg];
            }, 600);
          } else {
            addLine('cd: ' + arg + ': No such directory', 'error');
            addLine('Type "ls" to list available pages', 'output');
          }
          break;

        case 'whoami':
          addLine('visitor — guest user', 'info');
          addLine('Privilege level: read-only', 'output');
          addLine('Location: 404 — lost in cyberspace', 'purple');
          break;

        case 'hack':
          addLine('[!] Initializing exploit...', 'error');
          var steps = [
            { text: '[*] Scanning ports...', cls: 'output', delay: 400 },
            { text: '[*] Port 443 open — HTTPS', cls: 'success', delay: 800 },
            { text: '[*] Injecting payload...', cls: 'output', delay: 1200 },
            { text: '[*] Bypassing WAF...', cls: 'output', delay: 1600 },
            { text: '[!] ACCESS DENIED — Nice try ;)', cls: 'error', delay: 2200 },
            { text: '[*] Redirecting to safety...', cls: 'purple', delay: 2800 }
          ];
          steps.forEach(function (s) {
            setTimeout(function () { addLine(s.text, s.cls); }, s.delay);
          });
          setTimeout(function () {
            window.location.href = 'index.html';
          }, 3500);
          break;

        case 'clear':
          var lines = body.querySelectorAll('.terminal__line');
          lines.forEach(function (l) { l.remove(); });
          break;

        case '':
          break;

        default:
          addLine('command not found: ' + command, 'error');
          addLine('Type "help" for available commands', 'output');
      }
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var val = input.value;
        input.value = '';
        processCommand(val);
      }
    });

    /* Focus input on click anywhere in terminal */
    body.parentElement.addEventListener('click', function () {
      input.focus();
    });
  }

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    initMatrixRain();
    initTerminal();
  });
})();
