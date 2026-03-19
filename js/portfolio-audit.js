/* ═══════════════════════════════════════════════════════════════════════════
   PORTFOLIO AUDIT PAGE SCRIPTS
   Live self-audit: CSP, XSS, inline scripts, headers, architecture
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  // Launch audit after loader finishes
  setTimeout(runAudit, 1800);

  // Re-run button
  var rerunBtn = document.getElementById('rerunAudit');
  if (rerunBtn) {
    rerunBtn.addEventListener('click', function() {
      resetAudit();
      setTimeout(runAudit, 400);
    });
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   AUDIT ENGINE
   ═══════════════════════════════════════════════════════════════════════════ */

var CHECKS = ['csp', 'xss', 'inline', 'headers', 'arch'];
var SCORE_WEIGHTS = { pass: 20, warn: 12, info: 10, fail: 0 };
var CIRCUMFERENCE = 2 * Math.PI * 88; // ~553

/* ─── Reset audit state ──────────────────────────────────────────────────── */
function resetAudit() {
  // Reset score ring
  var ring = document.querySelector('.audit-score__ring-progress');
  if (ring) ring.style.strokeDasharray = '0 ' + CIRCUMFERENCE;
  var scoreNum = document.getElementById('scoreNumber');
  if (scoreNum) scoreNum.textContent = '0';

  // Reset summary counters
  ['Pass', 'Warn', 'Fail', 'Info'].forEach(function(s) {
    var el = document.getElementById('count' + s);
    if (el) el.textContent = '0';
  });

  // Reset progress
  var fill = document.getElementById('scoreProgressFill');
  if (fill) fill.style.width = '0%';
  var text = document.getElementById('scoreProgressText');
  if (text) text.textContent = 'Initialisation de l\'audit...';

  // Reset each card
  CHECKS.forEach(function(id) {
    var card = document.getElementById('check-' + id);
    if (card) {
      card.className = 'audit-card reveal active';
    }

    var statusEl = document.getElementById('status-' + id);
    if (statusEl) {
      statusEl.innerHTML =
        '<span class="audit-badge audit-badge--scanning">' +
        '<span class="audit-scanning-dots"><span>.</span><span>.</span><span>.</span></span>' +
        '</span>';
    }

    var bodyEl = document.getElementById('body-' + id);
    if (bodyEl) {
      bodyEl.innerHTML =
        '<div class="audit-card__scanning">' +
        '<div class="audit-scanning-bar"><div class="audit-scanning-bar__fill"></div></div>' +
        '<span class="audit-scanning-text">Analyse en cours...</span>' +
        '</div>';
    }
  });
}

/* ─── Run audit sequentially ─────────────────────────────────────────────── */
function runAudit() {
  var results = [];
  var checkFunctions = [runCSPCheck, runXSSCheck, runInlineCheck, runHeadersCheck, runArchCheck];
  var delays = [800, 1200, 1000, 1100, 1400];
  var totalChecks = CHECKS.length;
  var completed = 0;

  function executeCheck(index) {
    if (index >= totalChecks) {
      // All checks done - animate final score
      setTimeout(function() { animateFinalScore(results); }, 400);
      return;
    }

    // Update progress text
    var progressText = document.getElementById('scoreProgressText');
    var progressFill = document.getElementById('scoreProgressFill');
    if (progressText) {
      var checkNames = [
        'Content Security Policy',
        'XSS Protections',
        'Inline Scripts',
        'Security Headers',
        'Architecture'
      ];
      progressText.textContent = 'Scanning: ' + checkNames[index] + '...';
    }
    if (progressFill) {
      progressFill.style.width = ((index / totalChecks) * 100) + '%';
    }

    setTimeout(function() {
      var result = checkFunctions[index]();
      results.push(result);
      renderCheckResult(CHECKS[index], result);
      completed++;

      // Update progress
      if (progressFill) {
        progressFill.style.width = ((completed / totalChecks) * 100) + '%';
      }

      executeCheck(index + 1);
    }, delays[index]);
  }

  executeCheck(0);
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHECK 1: CONTENT SECURITY POLICY
   ═══════════════════════════════════════════════════════════════════════════ */
function runCSPCheck() {
  var findings = [];
  var status = 'info';

  // Check for CSP meta tag
  var cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspMeta) {
    var content = cspMeta.getAttribute('content') || '';
    findings.push({ type: 'pass', text: 'CSP meta tag found: <code>' + escapeHTML(content.substring(0, 80)) + '</code>' });
    status = 'pass';

    // Check CSP directives
    if (content.indexOf('script-src') !== -1) {
      findings.push({ type: 'pass', text: 'CSP includes <code>script-src</code> directive' });
    }
    if (content.indexOf('unsafe-inline') !== -1) {
      findings.push({ type: 'warn', text: 'CSP allows <code>unsafe-inline</code> - reduces XSS protection' });
      status = 'warn';
    }
    if (content.indexOf('unsafe-eval') !== -1) {
      findings.push({ type: 'warn', text: 'CSP allows <code>unsafe-eval</code> - potential injection risk' });
      status = 'warn';
    }
  } else {
    findings.push({ type: 'info', text: 'No CSP meta tag found. Static site may rely on server-side headers.' });
    findings.push({ type: 'info', text: 'CSP via HTTP headers is preferred and can only be checked server-side.' });
    status = 'info';
  }

  // Check for X-Frame-Options equivalent
  var frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
  if (frameOptions) {
    findings.push({ type: 'pass', text: 'X-Frame-Options meta tag present: <code>' + escapeHTML(frameOptions.getAttribute('content') || '') + '</code>' });
  } else {
    findings.push({ type: 'info', text: 'No X-Frame-Options meta tag. Should be set via HTTP headers.' });
  }

  var message = cspMeta
    ? 'Content Security Policy is configured via meta tag.'
    : 'No CSP meta tag detected. For a static site, CSP should ideally be set via HTTP headers on the hosting provider.';

  return { status: status, message: message, findings: findings };
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHECK 2: XSS PROTECTIONS
   ═══════════════════════════════════════════════════════════════════════════ */
function runXSSCheck() {
  var findings = [];
  var issues = 0;
  var good = 0;

  // Check all script elements for innerHTML patterns in their content
  var allScripts = document.querySelectorAll('script');
  var innerHTMLCount = 0;
  var textContentCount = 0;

  allScripts.forEach(function(script) {
    var content = script.textContent || '';
    var matches = content.match(/\.innerHTML\s*[+=]/g);
    if (matches) {
      innerHTMLCount += matches.length;
    }
    var safeMatches = content.match(/\.textContent\s*[+=]/g);
    if (safeMatches) {
      textContentCount += safeMatches.length;
    }
  });

  if (innerHTMLCount > 0) {
    findings.push({ type: 'warn', text: 'Found <code>' + innerHTMLCount + '</code> innerHTML assignment(s) in scripts. Potential XSS vector if user input is involved.' });
    issues++;
  } else {
    findings.push({ type: 'pass', text: 'No direct innerHTML assignments detected in page scripts.' });
    good++;
  }

  if (textContentCount > 0) {
    findings.push({ type: 'pass', text: 'Found <code>' + textContentCount + '</code> safe textContent assignment(s) - good practice.' });
    good++;
  }

  // Check for input elements and their handling
  var inputs = document.querySelectorAll('input[type="text"], textarea');
  if (inputs.length > 0) {
    findings.push({ type: 'info', text: 'Found <code>' + inputs.length + '</code> text input(s) on the page.' });

    // Check for autocomplete="off" pattern
    var acOff = document.querySelectorAll('input[autocomplete="off"]');
    if (acOff.length > 0) {
      findings.push({ type: 'pass', text: '<code>' + acOff.length + '</code> input(s) have autocomplete disabled - reduces data leakage.' });
      good++;
    }
  } else {
    findings.push({ type: 'pass', text: 'No user text inputs on this page - minimal XSS surface.' });
    good++;
  }

  // Check for event handler attributes in HTML
  var allElements = document.querySelectorAll('*');
  var eventHandlerCount = 0;
  var eventAttrs = ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'];

  allElements.forEach(function(el) {
    eventAttrs.forEach(function(attr) {
      if (el.hasAttribute(attr)) {
        eventHandlerCount++;
      }
    });
  });

  if (eventHandlerCount > 0) {
    findings.push({ type: 'warn', text: 'Found <code>' + eventHandlerCount + '</code> inline event handler(s) in HTML attributes. Prefer addEventListener.' });
    issues++;
  } else {
    findings.push({ type: 'pass', text: 'No inline event handlers (onclick, onerror, etc.) in HTML - clean separation.' });
    good++;
  }

  // Check for X-XSS-Protection meta
  var xssProtection = document.querySelector('meta[http-equiv="X-XSS-Protection"]');
  if (xssProtection) {
    findings.push({ type: 'pass', text: 'X-XSS-Protection meta header is set: <code>' + escapeHTML(xssProtection.getAttribute('content') || '') + '</code>' });
    good++;
  } else {
    findings.push({ type: 'info', text: 'No X-XSS-Protection meta tag (deprecated in modern browsers, CSP is preferred).' });
  }

  var status = issues > 1 ? 'fail' : (issues > 0 ? 'warn' : 'pass');
  var message = issues === 0
    ? 'No significant XSS vulnerabilities detected in DOM analysis.'
    : issues + ' potential XSS concern(s) found. Review innerHTML usage and inline handlers.';

  return { status: status, message: message, findings: findings };
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHECK 3: INLINE SCRIPTS
   ═══════════════════════════════════════════════════════════════════════════ */
function runInlineCheck() {
  var findings = [];

  var allScripts = document.querySelectorAll('script');
  var inlineScripts = document.querySelectorAll('script:not([src])');
  var externalScripts = document.querySelectorAll('script[src]');

  var totalCount = allScripts.length;
  var inlineCount = inlineScripts.length;
  var externalCount = externalScripts.length;

  findings.push({ type: 'info', text: 'Total scripts: <code>' + totalCount + '</code> (inline: <code>' + inlineCount + '</code>, external: <code>' + externalCount + '</code>)' });

  // Calculate ratio
  if (totalCount > 0) {
    var externalRatio = Math.round((externalCount / totalCount) * 100);
    findings.push({ type: externalRatio >= 50 ? 'pass' : 'warn', text: 'External script ratio: <code>' + externalRatio + '%</code>' });
  }

  // Detail inline scripts
  inlineScripts.forEach(function(script, i) {
    var content = (script.textContent || '').trim();
    var lineCount = content.split('\n').length;
    var preview = content.substring(0, 60).replace(/</g, '&lt;').replace(/>/g, '&gt;');

    if (content.indexOf('__i18n') !== -1) {
      findings.push({ type: 'info', text: 'Inline script #' + (i + 1) + ': i18n translations object (<code>' + lineCount + ' lines</code>) - expected for localization.' });
    } else if (lineCount <= 5) {
      findings.push({ type: 'info', text: 'Inline script #' + (i + 1) + ': small config block (<code>' + lineCount + ' lines</code>).' });
    } else {
      findings.push({ type: 'warn', text: 'Inline script #' + (i + 1) + ': <code>' + lineCount + ' lines</code> - consider externalizing.' });
    }
  });

  // Detail external scripts
  externalScripts.forEach(function(script) {
    var src = script.getAttribute('src') || '';
    var hasIntegrity = script.hasAttribute('integrity');
    var hasCrossorigin = script.hasAttribute('crossorigin');

    if (hasIntegrity) {
      findings.push({ type: 'pass', text: 'External script <code>' + escapeHTML(src) + '</code> has SRI integrity hash.' });
    } else if (src.indexOf('http') === 0) {
      findings.push({ type: 'warn', text: 'External CDN script <code>' + escapeHTML(src) + '</code> missing SRI integrity attribute.' });
    } else {
      findings.push({ type: 'pass', text: 'Local script <code>' + escapeHTML(src) + '</code> loaded (SRI not required for same-origin).' });
    }
  });

  var status;
  if (inlineCount === 0) {
    status = 'pass';
  } else if (inlineCount <= 2) {
    status = 'info';
  } else {
    status = 'warn';
  }

  var message = inlineCount === 0
    ? 'All scripts are externalized - best practice for CSP compatibility.'
    : inlineCount + ' inline script(s) detected. Inline scripts are common for config/i18n, but reduce CSP effectiveness.';

  return { status: status, message: message, findings: findings };
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHECK 4: SECURITY HEADERS (META TAGS)
   ═══════════════════════════════════════════════════════════════════════════ */
function runHeadersCheck() {
  var findings = [];
  var found = 0;
  var missing = 0;

  // Check meta tags that can be set in HTML
  var headerChecks = [
    {
      selector: 'meta[name="referrer"]',
      name: 'Referrer-Policy',
      good: ['strict-origin-when-cross-origin', 'no-referrer', 'same-origin', 'strict-origin'],
    },
    {
      selector: 'meta[http-equiv="X-Content-Type-Options"]',
      name: 'X-Content-Type-Options',
      good: ['nosniff'],
    },
    {
      selector: 'meta[http-equiv="X-Frame-Options"]',
      name: 'X-Frame-Options',
      good: ['DENY', 'SAMEORIGIN'],
    },
    {
      selector: 'meta[http-equiv="Content-Security-Policy"]',
      name: 'Content-Security-Policy',
      good: null,
    },
    {
      selector: 'meta[http-equiv="X-XSS-Protection"]',
      name: 'X-XSS-Protection',
      good: ['1; mode=block'],
    },
  ];

  headerChecks.forEach(function(check) {
    var el = document.querySelector(check.selector);
    if (el) {
      var val = el.getAttribute('content') || el.getAttribute('value') || '';
      if (check.good && check.good.indexOf(val) === -1) {
        findings.push({ type: 'warn', text: '<code>' + check.name + '</code> is set to <code>' + escapeHTML(val) + '</code> - verify this is intentional.' });
        found++;
      } else {
        findings.push({ type: 'pass', text: '<code>' + check.name + '</code> is properly configured: <code>' + escapeHTML(val) + '</code>' });
        found++;
      }
    } else {
      findings.push({ type: 'info', text: '<code>' + check.name + '</code> not set via meta tag. Should be configured via HTTP headers.' });
      missing++;
    }
  });

  // Check for theme-color meta (not security but good practice)
  var themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    findings.push({ type: 'pass', text: '<code>theme-color</code> meta tag set: <code>' + escapeHTML(themeColor.getAttribute('content') || '') + '</code>' });
    found++;
  }

  // Check for charset
  var charset = document.querySelector('meta[charset]');
  if (charset) {
    var charsetVal = charset.getAttribute('charset') || '';
    if (charsetVal.toLowerCase() === 'utf-8') {
      findings.push({ type: 'pass', text: 'Character encoding set to <code>UTF-8</code> - prevents encoding-based attacks.' });
      found++;
    } else {
      findings.push({ type: 'warn', text: 'Character encoding is <code>' + escapeHTML(charsetVal) + '</code> - UTF-8 recommended.' });
    }
  } else {
    findings.push({ type: 'warn', text: 'No charset meta tag found. UTF-8 should be explicitly declared.' });
    missing++;
  }

  // Check viewport
  var viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    findings.push({ type: 'pass', text: 'Viewport meta tag is set - prevents mobile rendering issues.' });
    found++;
  }

  var status;
  if (found >= 4 && missing <= 2) {
    status = 'pass';
  } else if (found >= 2) {
    status = 'warn';
  } else {
    status = 'fail';
  }

  var message = found + ' security-related meta tag(s) found, ' + missing + ' missing. ' +
    'For a static site, HTTP headers are typically set at the hosting/CDN level.';

  return { status: status, message: message, findings: findings };
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHECK 5: SECURITY ARCHITECTURE
   ═══════════════════════════════════════════════════════════════════════════ */
function runArchCheck() {
  var findings = [];
  var issues = 0;
  var good = 0;

  // Check all links for HTTPS
  var allLinks = document.querySelectorAll('a[href]');
  var httpLinks = [];
  var httpsLinks = 0;
  var relativeLinks = 0;
  var anchorLinks = 0;

  allLinks.forEach(function(link) {
    var href = link.getAttribute('href') || '';
    if (href.indexOf('http://') === 0) {
      httpLinks.push(href);
    } else if (href.indexOf('https://') === 0) {
      httpsLinks++;
    } else if (href.indexOf('#') === 0) {
      anchorLinks++;
    } else {
      relativeLinks++;
    }
  });

  findings.push({ type: 'info', text: 'Links analyzed: <code>' + allLinks.length + '</code> total (<code>' + httpsLinks + '</code> HTTPS, <code>' + relativeLinks + '</code> relative, <code>' + anchorLinks + '</code> anchors)' });

  if (httpLinks.length > 0) {
    findings.push({ type: 'fail', text: '<code>' + httpLinks.length + '</code> insecure HTTP link(s) found - potential mixed content issue.' });
    httpLinks.forEach(function(href) {
      findings.push({ type: 'fail', text: 'Insecure link: <code>' + escapeHTML(href.substring(0, 80)) + '</code>' });
    });
    issues++;
  } else {
    findings.push({ type: 'pass', text: 'No insecure HTTP links found - all external links use HTTPS.' });
    good++;
  }

  // Check stylesheets for SRI
  var extStylesheets = document.querySelectorAll('link[rel="stylesheet"][href^="http"]');
  extStylesheets.forEach(function(link) {
    var href = link.getAttribute('href') || '';
    if (link.hasAttribute('integrity')) {
      findings.push({ type: 'pass', text: 'External stylesheet <code>' + escapeHTML(href.substring(0, 60)) + '</code> has SRI hash.' });
      good++;
    } else {
      findings.push({ type: 'warn', text: 'External stylesheet <code>' + escapeHTML(href.substring(0, 60)) + '</code> missing SRI integrity.' });
      issues++;
    }
  });

  if (extStylesheets.length === 0) {
    findings.push({ type: 'info', text: 'No external CDN stylesheets loaded - all styles are local.' });
  }

  // Check for preconnect hints (performance + security)
  var preconnects = document.querySelectorAll('link[rel="preconnect"]');
  if (preconnects.length > 0) {
    var preconnectDomains = [];
    preconnects.forEach(function(pc) {
      preconnectDomains.push(pc.getAttribute('href') || '');
    });
    findings.push({ type: 'pass', text: 'Preconnect hints for <code>' + preconnects.length + '</code> domain(s): ' + preconnectDomains.map(function(d) { return '<code>' + escapeHTML(d) + '</code>'; }).join(', ') });
    good++;
  }

  // Check for crossorigin attributes on external resources
  var crossoriginLinks = document.querySelectorAll('link[crossorigin]');
  if (crossoriginLinks.length > 0) {
    findings.push({ type: 'pass', text: '<code>' + crossoriginLinks.length + '</code> external resource(s) use crossorigin attribute - enables proper CORS handling.' });
    good++;
  }

  // Check for mixed content indicators
  var imgs = document.querySelectorAll('img[src^="http://"]');
  var iframes = document.querySelectorAll('iframe[src^="http://"]');
  if (imgs.length > 0 || iframes.length > 0) {
    findings.push({ type: 'fail', text: 'Mixed content detected: <code>' + (imgs.length + iframes.length) + '</code> resource(s) loaded over HTTP.' });
    issues++;
  } else {
    findings.push({ type: 'pass', text: 'No mixed content detected - all embedded resources use secure protocols.' });
    good++;
  }

  // Check for target="_blank" security
  var blankLinks = document.querySelectorAll('a[target="_blank"]');
  var unsafeBlank = 0;
  blankLinks.forEach(function(link) {
    var rel = link.getAttribute('rel') || '';
    if (rel.indexOf('noopener') === -1 && rel.indexOf('noreferrer') === -1) {
      unsafeBlank++;
    }
  });

  if (blankLinks.length > 0) {
    if (unsafeBlank > 0) {
      findings.push({ type: 'warn', text: '<code>' + unsafeBlank + '</code> of <code>' + blankLinks.length + '</code> target="_blank" link(s) missing <code>rel="noopener"</code> (modern browsers handle this, but explicit is better).' });
      issues++;
    } else {
      findings.push({ type: 'pass', text: 'All <code>' + blankLinks.length + '</code> target="_blank" links have proper rel attributes.' });
      good++;
    }
  }

  var status;
  if (issues === 0) {
    status = 'pass';
  } else if (issues <= 2) {
    status = 'warn';
  } else {
    status = 'fail';
  }

  var message = good + ' architecture check(s) passed, ' + issues + ' issue(s) detected. ' +
    (issues === 0 ? 'The site follows secure architecture patterns.' : 'Review flagged items for potential improvements.');

  return { status: status, message: message, findings: findings };
}

/* ═══════════════════════════════════════════════════════════════════════════
   RENDER RESULTS
   ═══════════════════════════════════════════════════════════════════════════ */
function renderCheckResult(checkId, result) {
  var card = document.getElementById('check-' + checkId);
  var statusEl = document.getElementById('status-' + checkId);
  var bodyEl = document.getElementById('body-' + checkId);

  if (!card || !statusEl || !bodyEl) return;

  // Update card class with status
  card.className = 'audit-card reveal active audit-card--' + result.status;

  // Update status badge
  var statusLabels = { pass: 'PASS', warn: 'WARN', fail: 'FAIL', info: 'INFO' };
  var statusIcons = {
    pass: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
    warn: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    fail: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  statusEl.innerHTML =
    '<span class="audit-badge audit-badge--' + result.status + '">' +
    statusIcons[result.status] + ' ' + statusLabels[result.status] +
    '</span>';

  // Build body content
  var html = '';

  // Message
  html += '<div class="audit-card__message">' + escapeHTML(result.message) + '</div>';

  // Findings
  if (result.findings && result.findings.length > 0) {
    html += '<div class="audit-findings">';
    html += '<button class="audit-findings__toggle" onclick="toggleFindings(this)">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>';
    html += result.findings.length + ' finding(s) - click to expand';
    html += '</button>';
    html += '<div class="audit-findings__list">';

    result.findings.forEach(function(f) {
      var icons = { pass: '+', warn: '!', fail: 'x', info: 'i' };
      html += '<div class="audit-findings__item audit-findings__item--' + f.type + '">';
      html += '<span class="audit-findings__item-icon">[' + icons[f.type] + ']</span>';
      html += '<span>' + f.text + '</span>';
      html += '</div>';
    });

    html += '</div>';
    html += '</div>';
  }

  bodyEl.innerHTML = html;
}

/* ─── Toggle findings list ───────────────────────────────────────────────── */
function toggleFindings(btn) {
  btn.classList.toggle('open');
  var list = btn.nextElementSibling;
  if (list) {
    list.classList.toggle('open');
  }
}

/* ─── Animate final score ────────────────────────────────────────────────── */
function animateFinalScore(results) {
  var counts = { pass: 0, warn: 0, fail: 0, info: 0 };

  results.forEach(function(r) {
    counts[r.status]++;
  });

  // Calculate score (0-100)
  var totalWeight = 0;
  results.forEach(function(r) {
    totalWeight += SCORE_WEIGHTS[r.status];
  });
  var maxWeight = results.length * SCORE_WEIGHTS.pass;
  var score = maxWeight > 0 ? Math.round((totalWeight / maxWeight) * 100) : 0;

  // Update summary counters
  document.getElementById('countPass').textContent = counts.pass;
  document.getElementById('countWarn').textContent = counts.warn;
  document.getElementById('countFail').textContent = counts.fail;
  document.getElementById('countInfo').textContent = counts.info;

  // Animate score number
  var scoreNum = document.getElementById('scoreNumber');
  animateNumber(scoreNum, 0, score, 2000);

  // Animate ring
  var ring = document.querySelector('.audit-score__ring-progress');
  if (ring) {
    var fillLength = (score / 100) * CIRCUMFERENCE;
    setTimeout(function() {
      ring.style.strokeDasharray = fillLength + ' ' + (CIRCUMFERENCE - fillLength);
    }, 100);
  }

  // Update progress
  var progressFill = document.getElementById('scoreProgressFill');
  var progressText = document.getElementById('scoreProgressText');
  if (progressFill) progressFill.style.width = '100%';
  if (progressText) {
    var gradeLabel;
    if (score >= 90) gradeLabel = 'Excellent';
    else if (score >= 70) gradeLabel = 'Good';
    else if (score >= 50) gradeLabel = 'Fair';
    else gradeLabel = 'Needs Improvement';
    progressText.textContent = 'Audit complete - Grade: ' + gradeLabel + ' (' + score + '/100)';
  }
}

/* ─── Animate number countup ─────────────────────────────────────────────── */
function animateNumber(el, from, to, duration) {
  if (!el) return;
  var start = performance.now();

  function tick(now) {
    var elapsed = now - start;
    var progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = to;
    }
  }

  requestAnimationFrame(tick);
}

/* ─── Escape HTML for safe rendering ─────────────────────────────────────── */
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
