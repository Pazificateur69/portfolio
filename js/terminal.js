/* ═══════════════════════════════════════════════════════════════════════════
   INTERACTIVE TERMINAL — pazent.fr
   Easter egg & immersive experience
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Terminal commands database
  const COMMANDS = {
    help: {
      description: 'Afficher les commandes disponibles',
      exec: () => `<span class="t-comment"># Commandes disponibles :</span>
<span class="t-cmd">whoami</span>          — Identité
<span class="t-cmd">skills</span>          — Compétences techniques
<span class="t-cmd">projects</span>        — Projets récents
<span class="t-cmd">contact</span>         — Coordonnées
<span class="t-cmd">education</span>       — Formation
<span class="t-cmd">experience</span>      — Expérience pro
<span class="t-cmd">certifications</span>  — Certs & objectifs
<span class="t-cmd">tools</span>           — Arsenal cybersec
<span class="t-cmd">cat cv.pdf</span>      — Ouvrir le CV
<span class="t-cmd">clear</span>           — Effacer le terminal
<span class="t-cmd">exit</span>            — Fermer`
    },
    whoami: {
      exec: () => `<span class="t-user">u0:alessandrogagliardi</span>
<span class="t-key">name</span>       : Alessandro Gagliardi
<span class="t-key">alias</span>      : pazent
<span class="t-key">location</span>   : Lyon, France 🇫🇷
<span class="t-key">role</span>       : Cybersecurity Engineer & Full-Stack Dev
<span class="t-key">school</span>     : Guardia Cybersecurity School (3A)
<span class="t-key">work</span>       : DevSecOps @ Net Strategy
<span class="t-key">web</span>        : <a href="https://pazent.fr" class="t-link">https://pazent.fr</a>
<span class="t-key">status</span>     : <span class="t-green">● Available for opportunities</span>`
    },
    skills: {
      exec: () => `<span class="t-comment"># Compétences techniques :</span>

<span class="t-section">OFFENSIVE SECURITY</span>
  Pentest Web · OWASP Top 10 · SQLi · XSS · IDOR
  Nmap · Burp Suite · Metasploit · Wireshark · Ghidra
  Forensics · OSINT · Reverse Engineering

<span class="t-section">DEVELOPMENT</span>
  Python · TypeScript · JavaScript · C · PHP · Solidity
  Next.js · React · TailwindCSS · Three.js · React Native
  Node.js · Prisma · Supabase · PostgreSQL

<span class="t-section">INFRASTRUCTURE</span>
  Docker · Kubernetes · CI/CD · GitHub Actions
  Nginx · Apache · VPS · DNS · Hardening
  
<span class="t-section">WEB3</span>
  Solidity · ERC-20 · Wagmi · Viem · Arbitrum · Foundry`
    },
    projects: {
      exec: () => `<span class="t-comment"># Projets récents :</span>

<span class="t-project">CRM Net Strategy</span>       Next.js 14 + Prisma + Supabase
<span class="t-project">AEDSC Stablecoin</span>        ERC-20 on Arbitrum · DAO governance
<span class="t-project">Pentest OWASP</span>           SQLi · XSS · IDOR · Auth bypass
<span class="t-project">Freeze or Flame</span>         React Native · Three.js · 3D engine
<span class="t-project">pazent.brain</span>            Next.js knowledge base · <a href="https://pazent-brain.vercel.app" class="t-link">Live ↗</a>

<span class="t-comment"># Pour plus de détails :</span>
<a href="#projects" class="t-link" onclick="document.getElementById('terminal-modal')?.remove()">→ Voir tous les projets</a>`
    },
    contact: {
      exec: () => `<span class="t-comment"># Contact :</span>

<span class="t-key">email</span>     : <a href="mailto:contact@pazent.fr" class="t-link">contact@pazent.fr</a>
<span class="t-key">github</span>    : <a href="https://github.com/Pazificateur69" target="_blank" class="t-link">github.com/Pazificateur69</a>
<span class="t-key">linkedin</span>  : <a href="https://www.linkedin.com/in/alessandro-%E2%80%8E-120258299/" target="_blank" class="t-link">linkedin.com/in/alessandro</a>
<span class="t-key">portfolio</span> : <a href="https://pazent.fr" class="t-link">pazent.fr</a>`
    },
    education: {
      exec: () => `<span class="t-comment"># Formation :</span>

<span class="t-section">2023 → 2026</span>
  <span class="t-project">Guardia Cybersecurity School</span> — Lyon
  Bachelor 3 Cybersécurité
  Pentest · Forensics · Réseau · Cryptographie · SOC

<span class="t-section">Diplômes antérieurs</span>
  Bac Général (Spé Maths/NSI)`
    },
    experience: {
      exec: () => `<span class="t-comment"># Expérience professionnelle :</span>

<span class="t-section">2024 → 2026</span>
  <span class="t-project">DevSecOps Engineer</span> — Net Strategy, Feyzin
  CI/CD Security · Internal CRM · Infrastructure Hardening
  Next.js · Docker · GitHub Actions · Prisma

<span class="t-section">Freelance</span>
  <span class="t-project">PAZENT Studio</span> — Fondateur
  Développement web · Audits sécurité · Web3
  <a href="https://pazent.fr" class="t-link">pazent.fr ↗</a>`
    },
    certifications: {
      exec: () => `<span class="t-comment"># Certifications :</span>

<span class="t-green">●</span> <span class="t-project">eJPT</span>      — eLearnSecurity Junior PT    [40% ████░░░░░░]
<span class="t-comment">○</span> <span class="t-project">OSCP</span>      — Offensive Security CP        [En préparation]
<span class="t-comment">○</span> <span class="t-project">CEH</span>       — Certified Ethical Hacker     [En préparation]`
    },
    tools: {
      exec: () => `<span class="t-comment"># Arsenal cybersécurité :</span>

<span class="t-section">RECON</span>
  nmap · masscan · shodan · theHarvester · subfinder · amass

<span class="t-section">WEB TESTING</span>
  burpsuite · sqlmap · nikto · ffuf · gobuster

<span class="t-section">EXPLOITATION</span>
  metasploit · impacket · searchsploit

<span class="t-section">REVERSE ENGINEERING</span>
  ghidra · gdb · frida · binwalk · strings

<span class="t-section">FORENSICS</span>
  volatility · autopsy · wireshark · tcpdump

<span class="t-section">DEVSECOPS</span>
  semgrep · trivy · trufflehog · snyk · gitleaks`
    },
    'cat cv.pdf': {
      exec: () => {
        window.open('/resume.html', '_blank');
        return `<span class="t-green">✓</span> Ouverture du CV...`;
      }
    },
    clear: {
      exec: () => '__clear__'
    },
    exit: {
      exec: () => {
        setTimeout(() => closeTerminal(), 300);
        return `<span class="t-comment">Goodbye 👋</span>`;
      }
    },
    pwd: { exec: () => '<span class="t-str">/home/alessandrogagliardi</span>' },
    ls: { exec: () => '<span class="t-dir">projects/</span>  <span class="t-dir">skills/</span>  <span class="t-file">cv.pdf</span>  <span class="t-file">README.md</span>  <span class="t-file">.secrets</span>' },
    'cat README.md': { exec: () => `# Alessandro Gagliardi\nCybersecurity Engineer · DevSecOps · Full-Stack Dev\nhttps://pazent.fr` },
    'cat .secrets': { exec: () => `<span class="t-err">Permission denied: cat: .secrets: clearance level 5 required</span>` },
    uname: { exec: () => 'pazent-os 6.x.x #1 SMP PREEMPT x86_64 GNU/Linux' },
    date: { exec: () => new Date().toString() },
    echo: { exec: (args) => `<span class="t-str">${args}</span>` },
  };

  let terminalHistory = [];
  let historyIndex = -1;
  let isOpen = false;

  function createTerminal() {
    const modal = document.createElement('div');
    modal.id = 'terminal-modal';
    modal.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; animation: termFadeIn .2s ease;
    `;

    modal.innerHTML = `
      <style>
        @keyframes termFadeIn { from { opacity:0; transform:scale(.97); } to { opacity:1; transform:scale(1); } }
        @keyframes termCursor { 0%,100% { opacity:1; } 50% { opacity:0; } }
        #term-box { background:#0d1117; border:1px solid #21262d; border-radius:12px; width:100%; max-width:720px; max-height:85vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 80px rgba(110,0,255,0.3); }
        #term-header { display:flex; align-items:center; gap:8px; padding:12px 16px; background:#161b22; border-bottom:1px solid #21262d; }
        .term-dot { width:12px; height:12px; border-radius:50%; cursor:pointer; }
        .term-dot--red { background:#ff5f57; }
        .term-dot--yellow { background:#febc2e; }
        .term-dot--green { background:#28c840; }
        #term-title { margin:0 auto; font-family:'JetBrains Mono',monospace; font-size:12px; color:#8b949e; }
        #term-body { flex:1; overflow-y:auto; padding:16px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:#e6edf3; }
        #term-body::-webkit-scrollbar { width:4px; }
        #term-body::-webkit-scrollbar-thumb { background:#21262d; border-radius:2px; }
        .term-line { margin-bottom:2px; }
        .term-prompt { color:#6e00ff; }
        .term-input-line { display:flex; align-items:center; gap:8px; margin-top:8px; }
        #term-input { background:none; border:none; outline:none; color:#e6edf3; font-family:'JetBrains Mono',monospace; font-size:13px; flex:1; caret-color:#00d4ff; }
        .t-comment { color:#8b949e; }
        .t-key { color:#00d4ff; }
        .t-str { color:#a5d6ff; }
        .t-num { color:#f0b429; }
        .t-bool { color:#ff7b72; }
        .t-user { color:#6e00ff; }
        .t-cmd { color:#00d4ff; }
        .t-section { color:#6e00ff; font-weight:600; }
        .t-project { color:#a78bfa; font-weight:600; }
        .t-green { color:#3fb950; }
        .t-err { color:#ff4444; }
        .t-dir { color:#00d4ff; }
        .t-file { color:#e6edf3; }
        .t-link { color:#00d4ff; text-decoration:underline; }
        @media (max-width:640px) { #term-box { max-height:90vh; } #term-body { font-size:12px; } }
      </style>
      <div id="term-box">
        <div id="term-header">
          <div class="term-dot term-dot--red" id="term-close"></div>
          <div class="term-dot term-dot--yellow"></div>
          <div class="term-dot term-dot--green"></div>
          <span id="term-title">terminal — pazent@localhost:~</span>
        </div>
        <div id="term-body">
          <div class="term-line"><span class="t-comment">Welcome to pazent.fr terminal 🔐</span></div>
          <div class="term-line"><span class="t-comment">Type <span style="color:#00d4ff">help</span> to see available commands.</span></div>
          <div class="term-line">&nbsp;</div>
        </div>
        <div class="term-input-line" style="padding:8px 16px;border-top:1px solid #21262d;">
          <span class="term-prompt">pazent@localhost:~$</span>
          <input type="text" id="term-input" placeholder="type a command..." autocomplete="off" spellcheck="false" />
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    isOpen = true;

    const input = document.getElementById('term-input');
    const body = document.getElementById('term-body');
    const closeBtn = document.getElementById('term-close');

    input.focus();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (!cmd) return;
        
        terminalHistory.unshift(cmd);
        historyIndex = -1;
        
        appendLine(`<span class="term-prompt">pazent@localhost:~$</span> <span>${cmd}</span>`);
        
        const result = executeCommand(cmd);
        if (result === '__clear__') {
          body.innerHTML = '';
        } else if (result) {
          appendLine(result);
        }
        appendLine('');
        
        input.value = '';
        body.scrollTop = body.scrollHeight;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < terminalHistory.length - 1) {
          historyIndex++;
          input.value = terminalHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = terminalHistory[historyIndex];
        } else {
          historyIndex = -1;
          input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const partial = input.value.toLowerCase();
        const match = Object.keys(COMMANDS).find(k => k.startsWith(partial));
        if (match) input.value = match;
      }
    });

    closeBtn.addEventListener('click', closeTerminal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeTerminal(); });
    
    document.addEventListener('keydown', handleEsc);

    function appendLine(html) {
      const div = document.createElement('div');
      div.className = 'term-line';
      div.innerHTML = html;
      body.insertBefore(div, body.lastElementChild.parentElement?.lastElementChild || body.lastChild);
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }
  }

  function executeCommand(cmd) {
    const lower = cmd.toLowerCase().trim();
    
    if (COMMANDS[lower]) return COMMANDS[lower].exec();
    if (lower.startsWith('echo ')) return COMMANDS['echo'].exec(cmd.slice(5));
    if (lower.startsWith('cat ')) {
      const file = lower.slice(4);
      if (COMMANDS[`cat ${file}`]) return COMMANDS[`cat ${file}`].exec();
    }
    
    return `<span class="t-err">bash: ${cmd}: command not found</span>\n<span class="t-comment">Essaie <span style="color:#00d4ff">help</span> pour voir les commandes disponibles.</span>`;
  }

  function closeTerminal() {
    const modal = document.getElementById('terminal-modal');
    if (modal) {
      modal.style.animation = 'none';
      modal.style.opacity = '0';
      modal.style.transition = 'opacity .15s';
      setTimeout(() => modal.remove(), 150);
    }
    isOpen = false;
    document.removeEventListener('keydown', handleEsc);
  }

  function handleEsc(e) {
    if (e.key === 'Escape') closeTerminal();
  }

  // Expose globally
  window.openTerminal = function() {
    if (!isOpen) createTerminal();
    else document.getElementById('term-input')?.focus();
  };

  // Keyboard shortcut: Ctrl+` or Ctrl+Shift+T
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.key === '`') || (e.ctrlKey && e.shiftKey && e.key === 'T')) {
      e.preventDefault();
      window.openTerminal();
    }
  });

})();
