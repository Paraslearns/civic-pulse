

(function() {

  
  let glowEl, sparkEl, mx = 0, my = 0, gx = 0, gy = 0;

  function initLoginCursorGlow() {
    const v = document.getElementById('view-login');
    if (!v) return;

    if (!document.getElementById('login-cursor-glow')) {
      glowEl = document.createElement('div');
      glowEl.id = 'login-cursor-glow';
      v.appendChild(glowEl);
    } else { glowEl = document.getElementById('login-cursor-glow'); }

    if (!document.getElementById('login-cursor-spark')) {
      sparkEl = document.createElement('div');
      sparkEl.id = 'login-cursor-spark';
      v.appendChild(sparkEl);
    } else { sparkEl = document.getElementById('login-cursor-spark'); }
  }

  function animateGlow() {
    if (!glowEl || !sparkEl) return;
    
    gx += (mx - gx) * 0.07;
    gy += (my - gy) * 0.07;
    glowEl.style.left  = gx + 'px';
    glowEl.style.top   = gy + 'px';
    sparkEl.style.left = mx + 'px';
    sparkEl.style.top  = my + 'px';

    
    const rp = document.getElementById('login-right');
    if (rp) {
      const rect = rp.getBoundingClientRect();
      const dist = mx - rect.left;
      rp.classList.toggle('cursor-near', dist > -120 && dist < rect.width + 60 && my > rect.top && my < rect.bottom);
    }
    requestAnimationFrame(animateGlow);
  }

  
  function initFieldCanvas() {
    const v = document.getElementById('view-login');
    if (!v || document.getElementById('login-field-canvas')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'login-field-canvas';
    v.insertBefore(canvas, v.firstChild);

    const ctx = canvas.getContext('2d');
    let W, H;
    const NODES = 55;
    let nodes = [];

    function resize() {
      W = canvas.width  = v.offsetWidth;
      H = canvas.height = v.offsetHeight;
    }
    resize();
    new ResizeObserver(resize).observe(v);

    for (let i = 0; i < NODES; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35,
        r: Math.random()*1.8+.6
      });
    }

    function draw() {
      if (!document.getElementById('login-field-canvas')) return;
      ctx.clearRect(0, 0, W, H);
      const dark = document.body.classList.contains('dark');
      const baseColor = dark ? '201,153,107' : '139,94,53';

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        
        const dx = n.x - mx, dy = n.y - my;
        const d  = Math.sqrt(dx*dx+dy*dy);
        if (d < 100) { n.vx += dx/d*.05; n.vy += dy/d*.05; }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${baseColor},.5)`;
        ctx.fill();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i+1; j < nodes.length; j++) {
          const dx = nodes[i].x-nodes[j].x, dy = nodes[i].y-nodes[j].y;
          const d  = Math.sqrt(dx*dx+dy*dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${baseColor},${.15*(1-d/120)})`;
            ctx.lineWidth = .7;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  
  function spawnGeos() {
    const v = document.getElementById('view-login');
    if (!v) return;
    const shapes = ['', 'border-radius:4px', 'border-radius:50%'];
    function spawn() {
      if (!document.getElementById('view-login')?.classList.contains('active')) return;
      const el = document.createElement('div');
      el.className = 'login-geo';
      const size = 20 + Math.random() * 50;
      const dur  = 12 + Math.random() * 10;
      el.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*60}%;
        bottom:-${size}px;
        ${shapes[Math.floor(Math.random()*shapes.length)]};
        animation-duration:${dur}s;
        animation-delay:0s;
      `;
      v.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000);
      setTimeout(spawn, 3000 + Math.random() * 4000);
    }
    setTimeout(spawn, 500);
  }

  
  function addOrbitRing() {
    const logo = document.querySelector('#view-login .login-logo');
    if (!logo || logo.querySelector('.logo-orbit')) return;
    const ring = document.createElement('div');
    ring.className = 'logo-orbit';
    logo.appendChild(ring);
  }

  
  function addGridDots() {
    const v = document.getElementById('view-login');
    if (!v || document.getElementById('login-grid-dots')) return;
    const el = document.createElement('div');
    el.id = 'login-grid-dots';
    v.insertBefore(el, v.firstChild);
  }

  
  function initBtnRipple() {
    const btn = document.getElementById('login-btn');
    if (!btn || btn._ripple) return;
    btn._ripple = true;
    btn.addEventListener('click', function(e) {
      const r = document.createElement('span');
      r.className = 'btn-ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY  - rect.top  - size/2}px;
      `;
      btn.appendChild(r);
      setTimeout(() => r.remove(), 700);
    });
  }

  
  function attachLoginMouseMove() {
    const v = document.getElementById('view-login');
    if (!v || v._mmBound) return;
    v._mmBound = true;

    
    if (glowEl)  glowEl.style.opacity  = '0';
    if (sparkEl) sparkEl.style.opacity = '0';

    v.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (gx === 0 && gy === 0) { gx = mx; gy = my; }
      if (glowEl)  glowEl.style.opacity  = '1';
      if (sparkEl) sparkEl.style.opacity = '1';
    });
    v.addEventListener('mouseleave', () => {
      if (glowEl)  glowEl.style.opacity  = '0';
      if (sparkEl) sparkEl.style.opacity = '0';
    });
    v.addEventListener('mouseenter', () => {
      if (glowEl)  glowEl.style.opacity  = '1';
      if (sparkEl) sparkEl.style.opacity = '1';
    });
  }

  
  const _origSpawnParticle = window.spawnLoginParticle;
  window.spawnLoginParticle = function(x, y) {
    if (_origSpawnParticle) _origSpawnParticle(x, y);
    
    for (let i = 0; i < 2; i++) {
      const p = document.createElement('div');
      p.className = 'login-particle';
      const sz = 3 + Math.random() * 5;
      p.style.cssText = `
        left:${x}px; top:${y}px;
        width:${sz}px; height:${sz}px;
        --dx:${(Math.random()-.5)*80}px;
        --dy:${(Math.random()-.5)*80}px;
      `;
      const c = document.getElementById('login-particles');
      if (c) { c.appendChild(p); setTimeout(() => p.remove(), 950); }
    }
  };

  
  const _origShowView = window.showView;
  window.showView = function(name) {
    _origShowView(name);
    if (name === 'login') {
      setTimeout(() => {
        initLoginCursorGlow();
        attachLoginMouseMove();
        initFieldCanvas();
        addGridDots();
        spawnGeos();
        addOrbitRing();
        initBtnRipple();
        animateGlow();
      }, 50);
    }
  };

})();

function injectLoginAmbient() {
  const v = document.getElementById('view-login');
  if (!v || v._amb) return;
  v._amb = true;

  
  ['login-orb-1','login-orb-2','login-orb-3'].forEach(id => {
    if (!document.getElementById(id)) {
      const el = document.createElement('div');
      el.id = id;
      v.insertBefore(el, v.firstChild);
    }
  });

  
  if (!document.getElementById('login-scanlines')) {
    const sl = document.createElement('div');
    sl.id = 'login-scanlines';
    v.insertBefore(sl, v.firstChild);
  }

  
  if (!document.getElementById('login-dots')) {
    const layer = document.createElement('div');
    layer.id = 'login-dots';
    v.insertBefore(layer, v.firstChild);
    for (let i = 0; i < 14; i++) {
      const d = document.createElement('div');
      d.className = 'ldot';
      const sz  = 3 + Math.random() * 5;
      const dur = 6 + Math.random() * 9;
      d.style.cssText = `
        width:${sz}px; height:${sz}px;
        left:${5 + Math.random()*55}%;
        bottom:${Math.random()*85}%;
        animation-duration:${dur}s;
        animation-delay:-${Math.random()*dur}s;
      `;
      layer.appendChild(d);
    }
  }

  
  const logo = v.querySelector('.login-logo');
  if (logo && !logo.querySelector('.logo-pulse-2')) {
    const r = document.createElement('div');
    r.className = 'logo-pulse-2';
    logo.appendChild(r);
  }
}

(function() {
  const orig = window.showView;
  window.showView = function(name) {
    orig(name);
    if (name === 'login') setTimeout(injectLoginAmbient, 40);
  };
})();

(function() {

  const PING_LOCATIONS = [
    { label: 'Gurugram', x: 18, y: 55 },
    { label: 'Noida',    x: 78, y: 35 },
    { label: 'Delhi',    x: 48, y: 50 },
    { label: 'Faridabad',x: 55, y: 75 },
    { label: 'Dwarka',   x: 30, y: 62 },
    { label: 'Rohini',   x: 42, y: 28 },
    { label: 'Ghaziabad',x: 85, y: 55 },
    { label: 'Saket',    x: 52, y: 58 },
  ];

  const ISSUE_CARDS = [
    { emoji: '💡', cat: 'Electricity', title: 'Power outage — Sector 14', loc: 'Gurugram', votes: 38, status: 'resolved' },
    { emoji: '🚧', cat: 'Roads', title: 'Pothole near metro gate', loc: 'Noida Sec-62', votes: 24, status: 'progress' },
    { emoji: '🚰', cat: 'Water Supply', title: 'Pipe burst on MG Road', loc: 'Delhi', votes: 61, status: 'resolved' },
    { emoji: '🗑️', cat: 'Sanitation', title: 'Garbage not collected', loc: 'Faridabad', votes: 17, status: 'reported' },
    { emoji: '🌳', cat: 'Parks', title: 'Broken park bench', loc: 'Rohini', votes: 9, status: 'progress' },
    { emoji: '🚦', cat: 'Traffic', title: 'Signal malfunction', loc: 'Dwarka Sec-10', votes: 43, status: 'resolved' },
    { emoji: '💧', cat: 'Drainage', title: 'Waterlogging after rain', loc: 'Ghaziabad', votes: 55, status: 'progress' },
    { emoji: '🏗️', cat: 'Infrastructure', title: 'Footpath encroachment', loc: 'Saket', votes: 30, status: 'reported' },
  ];

  const TICKER_ITEMS = [
    { text: 'Power outage resolved — Gurugram Sec-14', type: 'resolved' },
    { text: 'New: Pothole reported — Noida Sec-62', type: '' },
    { text: 'Waterlogging fixed — Ghaziabad', type: 'resolved' },
    { text: 'Signal malfunction — Dwarka (38 upvotes)', type: '' },
    { text: 'Garbage collection restored — Faridabad', type: 'resolved' },
    { text: 'Pipe burst reported — MG Road Delhi', type: '' },
    { text: 'Footpath encroachment — Saket (30 upvotes)', type: '' },
    { text: 'Park bench repaired — Rohini', type: 'resolved' },
    { text: 'New: Stray animals — Dwarka (12 upvotes)', type: '' },
    { text: 'Street light fixed — Noida Sec-18', type: 'resolved' },
  ];

  let llpInited = false;

  function initLLP() {
    if (llpInited) return;
    const zone = document.getElementById('llp-anim-zone');
    if (!zone) return;
    llpInited = true;

    initMapPings();
    initFloatingCards();
    initTicker();
  }

  
  function initMapPings() {
    const field = document.getElementById('llp-ping-field');
    if (!field) return;
    PING_LOCATIONS.forEach((loc, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'llp-ping';
      wrap.style.left = loc.x + '%';
      wrap.style.top  = loc.y + '%';
      wrap.style.animationDelay = (i * 0.5) + 's';

      const dot = document.createElement('div');
      dot.className = 'llp-ping-dot';

      const ring1 = document.createElement('div');
      ring1.className = 'llp-ping-ring';
      ring1.style.animationDelay = (i * 0.5) + 's';

      const ring2 = document.createElement('div');
      ring2.className = 'llp-ping-ring llp-ping-ring2';
      ring2.style.animationDelay = (i * 0.5 + 0.7) + 's';

      const chip = document.createElement('div');
      chip.className = 'llp-ping-chip';
      chip.textContent = loc.label;
      chip.style.animationDelay = (i * 0.5) + 's';

      wrap.appendChild(chip);
      wrap.appendChild(ring1);
      wrap.appendChild(ring2);
      wrap.appendChild(dot);
      field.appendChild(wrap);
    });
  }

  
  function spawnCard(layer, idx) {
    if (!document.getElementById('view-login')?.classList.contains('active')) return;
    const c = ISSUE_CARDS[idx % ISSUE_CARDS.length];
    const card = document.createElement('div');
    card.className = 'llp-issue-card';

    const isLeft = Math.random() > 0.5;
    const startX = isLeft ? '-10%' : '55%';
    const dur    = 14 + Math.random() * 8;
    const tilt   = (Math.random() - 0.5) * 6;
    const dx     = (Math.random() - 0.5) * 60 + 'px';
    const dy     = -(30 + Math.random() * 50) + 'px';

    card.style.cssText = `
      left: ${startX};
      top: ${Math.random() * 40}px;
      --tilt: ${tilt}deg;
      --dx: ${dx};
      --dy: ${dy};
      animation-duration: ${dur}s;
      animation-delay: 0s;
    `;

    const badgeClass = c.status === 'resolved' ? 'resolved' : c.status === 'progress' ? 'progress' : 'reported';
    const badgeLabel = c.status === 'resolved' ? '✓ Resolved' : c.status === 'progress' ? '⚡ In Progress' : '● Reported';

    card.innerHTML = `
      <div class="llp-ic-top">
        <span class="llp-ic-emoji">${c.emoji}</span>
        <span class="llp-ic-cat">${c.cat}</span>
        <span class="llp-ic-badge ${badgeClass}">${badgeLabel}</span>
      </div>
      <div class="llp-ic-title">${c.title}</div>
      <div class="llp-ic-loc">📍 ${c.loc}</div>
      <div class="llp-ic-votes">▲ ${c.votes} upvotes</div>
    `;

    layer.appendChild(card);
    setTimeout(() => {
      card.remove();
      if (document.getElementById('view-login')?.classList.contains('active')) {
        setTimeout(() => spawnCard(layer, idx + 1), 500 + Math.random() * 2000);
      }
    }, dur * 1000);
  }

  function initFloatingCards() {
    const layer = document.getElementById('llp-cards-layer');
    if (!layer) return;
    
    [0, 3, 6].forEach((idx, i) => {
      setTimeout(() => spawnCard(layer, idx), i * 2800);
    });
  }

  
  function initTicker() {
    const track = document.getElementById('llp-ticker-track');
    if (!track || track._built) return;
    track._built = true;
    
    [1, 2].forEach(() => {
      TICKER_ITEMS.forEach(item => {
        const el = document.createElement('span');
        el.className = 'llp-tick-item' + (item.type ? ' ' + item.type : '');
        el.innerHTML = `<span class="llp-tick-dot"></span>${item.text}`;
        track.appendChild(el);
      });
    });
  }

  
  const _origShowViewLLP = window.showView;
  window.showView = function(name) {
    _origShowViewLLP(name);
    if (name === 'login') {
      setTimeout(initLLP, 60);
    }
  };

})();