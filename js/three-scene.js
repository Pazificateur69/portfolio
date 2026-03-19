/* ═══════════════════════════════════════════════════════════════════════════
   THREE.JS PARTICLE CONSTELLATION — pazent.fr
   WebGL fullscreen background for #hero section
   3000 particles | connection lines | mouse repulsion | auto-rotation
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Disable on touch devices (mobile)
  if ('ontouchstart' in window) return;

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', initThreeScene);

  function initThreeScene() {
    var canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // ── Renderer ────────────────────────────────────────────────────────────
    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false,   // off for perf on large canvas
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // ── Scene & Camera ───────────────────────────────────────────────────────
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );
    camera.position.z = 700;

    // ── Constants ────────────────────────────────────────────────────────────
    var PARTICLE_COUNT    = 3000;
    var SPREAD_X          = 1400;
    var SPREAD_Y          = 800;
    var SPREAD_Z          = 600;
    var CONNECTION_DIST   = 120;           // max px distance for lines
    var MAX_LINES         = 6000;          // pre-allocate line pairs
    var REPULSION_RADIUS  = 140;           // mouse influence radius
    var REPULSION_FORCE   = 0.06;          // strength of repulsion
    var RETURN_SPEED      = 0.04;          // speed of return to origin
    var ROTATION_SPEED_X  = 0.00012;
    var ROTATION_SPEED_Y  = 0.00018;

    // Colors
    var COL_PURPLE = new THREE.Color(0x6e00ff);
    var COL_CYAN   = new THREE.Color(0x00d4ff);

    // ── Particle Positions & State ───────────────────────────────────────────
    var positions    = new Float32Array(PARTICLE_COUNT * 3);
    var origins      = new Float32Array(PARTICLE_COUNT * 3);
    var velocities   = new Float32Array(PARTICLE_COUNT * 3); // displacement velocity
    var colors       = new Float32Array(PARTICLE_COUNT * 3);
    var sizes        = new Float32Array(PARTICLE_COUNT);

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var ix = i * 3;
      var x  = (Math.random() - 0.5) * SPREAD_X;
      var y  = (Math.random() - 0.5) * SPREAD_Y;
      var z  = (Math.random() - 0.5) * SPREAD_Z;

      positions[ix]   = x;  positions[ix+1] = y;  positions[ix+2] = z;
      origins[ix]     = x;  origins[ix+1]   = y;  origins[ix+2]   = z;
      velocities[ix]  = 0;  velocities[ix+1]= 0;  velocities[ix+2]= 0;

      // Random blend between purple and cyan
      var t = Math.random();
      var c = COL_PURPLE.clone().lerp(COL_CYAN, t);
      colors[ix] = c.r; colors[ix+1] = c.g; colors[ix+2] = c.b;

      sizes[i] = 1.5 + Math.random() * 2.5;
    }

    // ── Points Geometry & Material ───────────────────────────────────────────
    var pointsGeom = new THREE.BufferGeometry();
    pointsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeom.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    pointsGeom.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    var pointsMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: [
        'attribute float size;',
        'varying vec3 vColor;',
        'void main() {',
        '  vColor = color;',
        '  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
        '  gl_PointSize = size * (300.0 / -mvPosition.z);',
        '  gl_Position = projectionMatrix * mvPosition;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vColor;',
        'void main() {',
        '  float d = distance(gl_PointCoord, vec2(0.5));',
        '  if (d > 0.5) discard;',
        '  float alpha = 1.0 - smoothstep(0.3, 0.5, d);',
        '  gl_FragColor = vec4(vColor, alpha * 0.85);',
        '}'
      ].join('\n'),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    var points = new THREE.Points(pointsGeom, pointsMat);
    scene.add(points);

    // ── Line Geometry (pre-allocated) ─────────────────────────────────────────
    var linePositions = new Float32Array(MAX_LINES * 2 * 3);
    var lineColors    = new Float32Array(MAX_LINES * 2 * 3);
    var lineGeom      = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeom.setAttribute('color',    new THREE.BufferAttribute(lineColors, 3));

    var lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    var lineSegments = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(lineSegments);

    // ── Mouse Tracking (RAF-throttled) ───────────────────────────────────────
    var mouseNDC = new THREE.Vector2(9999, 9999); // NDC = normalized device coordinates
    var mouseWorld = new THREE.Vector3();
    var mousePending = false;
    var pendingMX = 0, pendingMY = 0;

    window.addEventListener('mousemove', function (e) {
      pendingMX = e.clientX;
      pendingMY = e.clientY;
      mousePending = true;
    }, { passive: true });

    function updateMouseWorld() {
      if (!mousePending) return;
      mousePending = false;
      mouseNDC.x = (pendingMX / window.innerWidth)  * 2 - 1;
      mouseNDC.y = -(pendingMY / window.innerHeight) * 2 + 1;
      // Unproject to z=0 plane
      var ray = new THREE.Raycaster();
      ray.setFromCamera(mouseNDC, camera);
      var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      ray.ray.intersectPlane(plane, mouseWorld);
    }

    // ── Resize ───────────────────────────────────────────────────────────────
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });

    // ── Only render while hero visible ───────────────────────────────────────
    var heroVisible = true;
    var heroEl = document.getElementById('hero');
    if (heroEl && 'IntersectionObserver' in window) {
      var heroObs = new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
      }, { threshold: 0 });
      heroObs.observe(heroEl);
    }

    // ── Rotation state ────────────────────────────────────────────────────────
    var rotX = 0, rotY = 0;

    // ── Animation Loop ───────────────────────────────────────────────────────
    var animId;

    function animate() {
      animId = requestAnimationFrame(animate);
      if (!heroVisible) return;

      updateMouseWorld();

      // Auto-rotation angles
      rotX += ROTATION_SPEED_X;
      rotY += ROTATION_SPEED_Y;

      // ── Update particle positions with mouse repulsion ──────────────────
      var posAttr = pointsGeom.attributes.position;

      for (var i = 0; i < PARTICLE_COUNT; i++) {
        var ix = i * 3;

        // Rotate origin around Y axis (scene rotation applied via matrix below)
        // We do repulsion in local (pre-rotation) space for simplicity
        var ox = origins[ix];
        var oy = origins[ix+1];
        var oz = origins[ix+2];

        // Current displaced position
        var cx = posAttr.array[ix];
        var cy = posAttr.array[ix+1];
        var cz = posAttr.array[ix+2];

        // Mouse repulsion (in world space, approximate — use rotated world pos)
        var wx = cx * Math.cos(rotY) - cz * Math.sin(rotY);
        var wy = cy;
        var wz = cx * Math.sin(rotY) + cz * Math.cos(rotY);

        var dx = wx - mouseWorld.x;
        var dy = wy - mouseWorld.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPULSION_RADIUS && dist > 0.01) {
          var force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS;
          var fx = (dx / dist) * force * REPULSION_FORCE * 40;
          var fy = (dy / dist) * force * REPULSION_FORCE * 40;
          velocities[ix]   += fx;
          velocities[ix+1] += fy;
        }

        // Spring return to origin
        velocities[ix]   += (ox - cx) * RETURN_SPEED;
        velocities[ix+1] += (oy - cy) * RETURN_SPEED;
        velocities[ix+2] += (oz - cz) * RETURN_SPEED;

        // Damping
        velocities[ix]   *= 0.88;
        velocities[ix+1] *= 0.88;
        velocities[ix+2] *= 0.88;

        posAttr.array[ix]   = cx + velocities[ix];
        posAttr.array[ix+1] = cy + velocities[ix+1];
        posAttr.array[ix+2] = cz + velocities[ix+2];
      }

      posAttr.needsUpdate = true;

      // Apply scene rotation (whole points cloud)
      points.rotation.x = rotX;
      points.rotation.y = rotY;

      // ── Update connection lines ─────────────────────────────────────────
      var linePos = lineGeom.attributes.position.array;
      var lineCol = lineGeom.attributes.color.array;
      var lineIdx = 0;
      var CONN_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;

      // For performance with 3000 particles, sample only nearby pairs
      // Use a simple spatial skip: compare particle i with i+1..i+50 neighbors
      var NEIGHBOR_WINDOW = 50;

      for (var i = 0; i < PARTICLE_COUNT && lineIdx < MAX_LINES - 1; i++) {
        var ix = i * 3;
        var ax = posAttr.array[ix];
        var ay = posAttr.array[ix+1];
        var az = posAttr.array[ix+2];
        var ca = colors[ix]; var cag = colors[ix+1]; var cab = colors[ix+2];

        var limit = Math.min(i + NEIGHBOR_WINDOW, PARTICLE_COUNT);
        for (var j = i + 1; j < limit && lineIdx < MAX_LINES - 1; j++) {
          var jx = j * 3;
          var bx = posAttr.array[jx];
          var by = posAttr.array[jx+1];
          var bz = posAttr.array[jx+2];

          var ddx = ax - bx;
          var ddy = ay - by;
          var ddz = az - bz;
          var distSq = ddx*ddx + ddy*ddy + ddz*ddz;

          if (distSq < CONN_DIST_SQ) {
            var li = lineIdx * 6;
            linePos[li]   = ax; linePos[li+1] = ay; linePos[li+2] = az;
            linePos[li+3] = bx; linePos[li+4] = by; linePos[li+5] = bz;

            // Fade by distance
            var fade = (1.0 - distSq / CONN_DIST_SQ) * 0.6;
            // Purple tint for lines
            lineCol[li]   = 0.43 * fade; lineCol[li+1] = 0.0  * fade; lineCol[li+2] = 1.0 * fade;
            lineCol[li+3] = 0.43 * fade; lineCol[li+4] = 0.0  * fade; lineCol[li+5] = 1.0 * fade;

            lineIdx++;
          }
        }
      }

      // Zero-out remaining pre-allocated slots
      for (var k = lineIdx; k < MAX_LINES; k++) {
        var lk = k * 6;
        linePos[lk] = linePos[lk+1] = linePos[lk+2] = 0;
        linePos[lk+3] = linePos[lk+4] = linePos[lk+5] = 0;
      }

      lineGeom.attributes.position.needsUpdate = true;
      lineGeom.attributes.color.needsUpdate    = true;
      lineGeom.setDrawRange(0, lineIdx * 2);

      // Sync line mesh rotation with points
      lineSegments.rotation.x = rotX;
      lineSegments.rotation.y = rotY;

      renderer.render(scene, camera);
    }

    animate();

    // ── Cleanup on page unload ──────────────────────────────────────────────
    window.addEventListener('beforeunload', function () {
      cancelAnimationFrame(animId);
      renderer.dispose();
    });
  }

})();
