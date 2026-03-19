/* ═══════════════════════════════════════════════════════════════════════════
   SOUND ENGINE — Web Audio API micro-sounds (zero external files)
   Exposed as window.__sound : play(name), toggle(), isEnabled()
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORAGE_KEY = 'portfolio-sound';
  var ctx = null;
  var enabled = localStorage.getItem(STORAGE_KEY) === 'on';

  /* ─── Respect prefers-reduced-motion ─── */
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Lazy-create AudioContext on first user gesture ─── */
  function ensureCtx() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { /* unsupported */ }
    return ctx;
  }

  /* ─── Sound definitions ─── */
  var sounds = {
    hover: function () {
      var c = ensureCtx(); if (!c) return;
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = 'sine';
      o.frequency.value = 800;
      g.gain.value = 0.03;
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.002);
    },
    click: function () {
      var c = ensureCtx(); if (!c) return;
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = 'triangle';
      o.frequency.value = 400;
      g.gain.value = 0.06;
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.005);
    },
    themeToggle: function () {
      var c = ensureCtx(); if (!c) return;
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(600, c.currentTime);
      o.frequency.linearRampToValueAtTime(900, c.currentTime + 0.05);
      g.gain.setValueAtTime(0.05, c.currentTime);
      g.gain.linearRampToValueAtTime(0, c.currentTime + 0.05);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.06);
    },
    pageTransition: function () {
      var c = ensureCtx(); if (!c) return;
      var bufferSize = c.sampleRate * 0.2;
      var buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      var src = c.createBufferSource();
      var g = c.createGain();
      src.buffer = buffer;
      g.gain.value = 0.04;
      src.connect(g); g.connect(c.destination);
      src.start(); src.stop(c.currentTime + 0.2);
    }
  };

  /* ─── Public API ─── */
  function play(name) {
    if (!enabled || reducedMotion) return;
    if (sounds[name]) {
      try { sounds[name](); } catch (e) { /* silent fail */ }
    }
  }

  function toggle() {
    enabled = !enabled;
    localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
    if (enabled) ensureCtx();
    return enabled;
  }

  function isEnabled() {
    return enabled;
  }

  window.__sound = {
    play: play,
    toggle: toggle,
    isEnabled: isEnabled
  };
})();
