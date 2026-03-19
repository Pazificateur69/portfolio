/* ═══════════════════════════════════════════════════════════════════════════
   EASTER EGGS — Hidden features and fun surprises
   ═══════════════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  /* ─── Matrix Mode: type "matrix" anywhere on the page ─── */
  var matrixBuffer = '';
  var matrixActive = false;
  var matrixCanvas = null;
  var matrixCtx = null;
  var matrixInterval = null;

  document.addEventListener('keypress', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    matrixBuffer += e.key.toLowerCase();
    if (matrixBuffer.length > 10) matrixBuffer = matrixBuffer.slice(-10);

    if (matrixBuffer.indexOf('matrix') !== -1) {
      matrixBuffer = '';
      toggleMatrix();
    }
  });

  function toggleMatrix() {
    if (matrixActive) {
      stopMatrix();
    } else {
      startMatrix();
    }
  }

  function startMatrix() {
    matrixActive = true;
    matrixCanvas = document.createElement('canvas');
    matrixCanvas.id = 'matrixEasterEgg';
    matrixCanvas.style.cssText = 'position:fixed;inset:0;z-index:199999;pointer-events:none;opacity:0.4;';
    document.body.appendChild(matrixCanvas);
    matrixCtx = matrixCanvas.getContext('2d');

    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    var columns = Math.floor(matrixCanvas.width / 14);
    var drops = [];
    for (var i = 0; i < columns; i++) drops[i] = Math.random() * -100;

    var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

    matrixInterval = setInterval(function() {
      matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      matrixCtx.fillStyle = '#0F0';
      matrixCtx.font = '14px monospace';

      for (var i = 0; i < drops.length; i++) {
        var char = chars[Math.floor(Math.random() * chars.length)];
        matrixCtx.fillText(char, i * 14, drops[i] * 14);
        if (drops[i] * 14 > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 35);

    // Auto-stop after 10 seconds
    setTimeout(function() { if (matrixActive) stopMatrix(); }, 10000);

    // Show toast
    showToast('Matrix mode activated. Type "matrix" again to deactivate.');
  }

  function stopMatrix() {
    matrixActive = false;
    if (matrixInterval) clearInterval(matrixInterval);
    if (matrixCanvas) matrixCanvas.remove();
    matrixCanvas = null;
    matrixCtx = null;
  }

  /* ─── Hacker Mode: type "hack" ─── */
  var hackBuffer = '';
  document.addEventListener('keypress', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    hackBuffer += e.key.toLowerCase();
    if (hackBuffer.length > 10) hackBuffer = hackBuffer.slice(-10);

    if (hackBuffer.indexOf('hack') !== -1) {
      hackBuffer = '';
      triggerHack();
    }
  });

  function triggerHack() {
    document.documentElement.style.filter = 'hue-rotate(120deg) saturate(2)';
    showToast('// ACCESS GRANTED — root@portfolio:~#');
    setTimeout(function() {
      document.documentElement.style.filter = '';
    }, 5000);
  }

  /* ─── Party Mode: type "party" ─── */
  var partyBuffer = '';
  document.addEventListener('keypress', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    partyBuffer += e.key.toLowerCase();
    if (partyBuffer.length > 10) partyBuffer = partyBuffer.slice(-10);

    if (partyBuffer.indexOf('party') !== -1) {
      partyBuffer = '';
      triggerParty();
    }
  });

  function triggerParty() {
    var hue = 0;
    var interval = setInterval(function() {
      hue = (hue + 5) % 360;
      document.documentElement.style.filter = 'hue-rotate(' + hue + 'deg)';
    }, 50);
    showToast('Party mode! Colors go brrr...');
    setTimeout(function() {
      clearInterval(interval);
      document.documentElement.style.filter = '';
    }, 8000);
  }

  /* ─── Toast notification helper ─── */
  function showToast(msg) {
    var existing = document.getElementById('easterToast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'easterToast';
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:rgba(139,92,246,0.9);color:white;padding:0.75rem 1.5rem;border-radius:10px;font-family:var(--font-mono);font-size:0.8rem;z-index:300000;animation:toastIn 0.3s ease;backdrop-filter:blur(10px);';
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 4000);
  }

  // Toast animation
  var style = document.createElement('style');
  style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
  document.head.appendChild(style);
})();
