/* ═══════════════════════════════════════════════════════════════════════════
   SECURITY LAB PAGE SCRIPTS
   XSS/SQLi Sandbox, scroll reveal, code highlight, severity countup
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  window.__tiltSelectors = ['.seclab-writeup-card', '.feature-item', '.pentest-finding', '.pentest-rec', '.sandbox'];

  initFeatureHover();
  initSeverityCountUp();
  initXSSSandbox();
  initSQLiSandbox();
});

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURE HOVER - text scramble on title
   ═══════════════════════════════════════════════════════════════════════════ */
function initFeatureHover() {
  var chars = '!<>-_\\/[]{}—=+*^?#';

  document.querySelectorAll('.feature-item__title, .seclab-writeup-card__title').forEach(function(title) {
    var original = title.textContent;
    var animating = false;

    var parent = title.closest('.feature-item') || title.closest('.seclab-writeup-card');
    if (!parent) return;

    parent.addEventListener('mouseenter', function() {
      if (animating) return;
      animating = true;
      var iteration = 0;

      var interval = setInterval(function() {
        title.textContent = original.split('').map(function(char, i) {
          if (i < iteration) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');

        iteration += 0.5;
        if (iteration >= original.length) {
          title.textContent = original;
          clearInterval(interval);
          animating = false;
        }
      }, 30);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   SEVERITY COUNT UP - Animate numbers on scroll
   ═══════════════════════════════════════════════════════════════════════════ */
function initSeverityCountUp() {
  var numbers = document.querySelectorAll('.seclab-stat__number[data-count]');
  if (!numbers.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 1500;
        var start = performance.now();

        function animate(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  numbers.forEach(function(el) { observer.observe(el); });
}

/* ═══════════════════════════════════════════════════════════════════════════
   XSS SANDBOX
   ═══════════════════════════════════════════════════════════════════════════ */
function initXSSSandbox() {
  var input = document.getElementById('xssInput');
  var runBtn = document.getElementById('xssRun');
  var fixBtn = document.getElementById('xssFix');
  var resetBtn = document.getElementById('xssReset');
  var frame = document.getElementById('xssFrame');
  var explanation = document.getElementById('xssExplanation');

  if (!input || !runBtn || !frame) return;

  runBtn.addEventListener('click', function() {
    var payload = input.value;
    if (!payload) return;

    // Write to sandboxed iframe
    var doc = frame.contentDocument || frame.contentWindow.document;
    doc.open();
    doc.write(
      '<!DOCTYPE html><html><head><style>' +
      'body{font-family:monospace;padding:12px;margin:0;background:#1a1a2e;color:#e0e0e0;font-size:13px;}' +
      '.alert-box{background:#ff4444;color:#fff;padding:8px 12px;border-radius:4px;margin:4px 0;font-weight:bold;}' +
      '</style></head><body>' +
      '<div class="alert-box">Rendu HTML (non sanitise) :</div>' +
      '<div>' + payload + '</div>' +
      '<script>window.alert=function(m){document.body.innerHTML+="<div class=\\"alert-box\\">alert() declenche : "+m+"</div>";}<\/script>' +
      '</body></html>'
    );
    doc.close();
  });

  if (fixBtn) {
    fixBtn.addEventListener('click', function() {
      var payload = input.value || '<img src=x onerror="alert(\'XSS\')">';
      // Show sanitized version
      var doc = frame.contentDocument || frame.contentWindow.document;
      doc.open();
      doc.write(
        '<!DOCTYPE html><html><head><style>' +
        'body{font-family:monospace;padding:12px;margin:0;background:#0a2a1a;color:#34d399;font-size:13px;}' +
        '.safe-box{background:#10b981;color:#fff;padding:8px 12px;border-radius:4px;margin:4px 0;font-weight:bold;}' +
        '.escaped{background:rgba(16,185,129,0.1);padding:8px;border-radius:4px;border:1px solid rgba(16,185,129,0.2);margin-top:8px;word-break:break-all;}' +
        '</style></head><body>' +
        '<div class="safe-box">Rendu securise (textContent) :</div>' +
        '<div class="escaped" id="safe"></div>' +
        '<script>document.getElementById("safe").textContent=' + JSON.stringify(payload) + ';<\/script>' +
        '</body></html>'
      );
      doc.close();
      if (explanation) explanation.style.display = 'block';
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      input.value = '';
      var doc = frame.contentDocument || frame.contentWindow.document;
      doc.open();
      doc.write('<!DOCTYPE html><html><head><style>body{background:#1a1a2e;}</style></head><body></body></html>');
      doc.close();
      if (explanation) explanation.style.display = 'none';
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SQLi SANDBOX
   ═══════════════════════════════════════════════════════════════════════════ */
function initSQLiSandbox() {
  var userInput = document.getElementById('sqliUser');
  var passInput = document.getElementById('sqliPass');
  var runBtn = document.getElementById('sqliRun');
  var resetBtn = document.getElementById('sqliReset');
  var preparedToggle = document.getElementById('sqliPrepared');
  var queryDisplay = document.getElementById('sqliQuery');
  var resultDisplay = document.getElementById('sqliResult');
  var explanation = document.getElementById('sqliExplanation');

  if (!userInput || !passInput || !runBtn || !queryDisplay) return;

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateQuery() {
    var user = userInput.value || '';
    var pass = passInput.value || '';
    var isPrepared = preparedToggle && preparedToggle.checked;

    if (isPrepared) {
      // Prepared statement version
      queryDisplay.innerHTML =
        '<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> users ' +
        '<span class="sql-keyword">WHERE</span> username = <span class="sql-param">?</span> ' +
        '<span class="sql-keyword">AND</span> password = <span class="sql-param">?</span>' +
        '<br><br><span class="sql-keyword">Params:</span> [<span class="sql-string">\'' + escapeHtml(user) + '\'</span>, <span class="sql-string">\'' + escapeHtml(pass) + '\'</span>]';

      // Always blocked with prepared statements
      if (resultDisplay) {
        resultDisplay.className = 'sandbox__result sandbox__result--blocked';
        resultDisplay.style.display = 'block';
        resultDisplay.textContent = 'Injection bloquee. Les parametres sont traites comme des donnees.';
      }
      if (explanation) explanation.style.display = 'block';
    } else {
      // Vulnerable concatenation
      var fullQuery = "SELECT * FROM users WHERE username = '" + escapeHtml(user) + "' AND password = '" + escapeHtml(pass) + "'";

      // Check for injection patterns
      var injectionPatterns = ["' OR", "' or", "1=1", "' --", "'; DROP", "' UNION", "1'='1"];
      var isInjected = injectionPatterns.some(function(p) { return user.includes(p) || pass.includes(p); });

      if (isInjected) {
        // Highlight the dangerous parts
        var highlighted = fullQuery
          .replace(/(OR\s+1=1|or\s+1=1|1=1|--.*$|DROP\s+TABLE|UNION\s+SELECT)/gi, '<span class="sql-danger">$1</span>');
        queryDisplay.innerHTML =
          '<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> users ' +
          '<span class="sql-keyword">WHERE</span> username = \'' + escapeHtml(user) + '\' ' +
          '<span class="sql-keyword">AND</span> password = \'' + escapeHtml(pass) + '\'';

        // Re-highlight
        queryDisplay.innerHTML = queryDisplay.innerHTML
          .replace(/(OR 1=1|or 1=1)/g, '<span class="sql-danger">$1</span>')
          .replace(/(--)/g, '<span class="sql-danger">$1</span>');

        if (resultDisplay) {
          resultDisplay.className = 'sandbox__result sandbox__result--success';
          resultDisplay.style.display = 'block';
          resultDisplay.textContent = 'Injection reussie ! Acces accorde sans mot de passe valide.';
        }
      } else {
        queryDisplay.innerHTML =
          '<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> users ' +
          '<span class="sql-keyword">WHERE</span> username = <span class="sql-string">\'' + escapeHtml(user) + '\'</span> ' +
          '<span class="sql-keyword">AND</span> password = <span class="sql-string">\'' + escapeHtml(pass) + '\'</span>';

        if (resultDisplay) {
          resultDisplay.style.display = 'none';
        }
      }
    }
  }

  // Live update on input
  userInput.addEventListener('input', updateQuery);
  passInput.addEventListener('input', updateQuery);

  if (preparedToggle) {
    preparedToggle.addEventListener('change', updateQuery);
  }

  runBtn.addEventListener('click', updateQuery);

  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      userInput.value = '';
      passInput.value = '';
      if (preparedToggle) preparedToggle.checked = false;
      queryDisplay.innerHTML = '<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> users <span class="sql-keyword">WHERE</span> username = <span class="sql-string">\'\'</span> <span class="sql-keyword">AND</span> password = <span class="sql-string">\'\'</span>';
      if (resultDisplay) {
        resultDisplay.style.display = 'none';
        resultDisplay.className = 'sandbox__result';
      }
      if (explanation) explanation.style.display = 'none';
    });
  }
}
