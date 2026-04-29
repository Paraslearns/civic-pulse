'use strict';

const NCR_CENTER = { lat: 28.5355, lng: 77.3910 }; 

const NCR_WARDS = [
  'Ward 1','Ward 2','Ward 3','Ward 4','Ward 5','Ward 6','Ward 7','Ward 8',
  'Ward 9','Ward 10','Ward 11','Ward 12','Ward 13','Ward 14','Ward 15',
  'Ward 16','Ward 17','Ward 18','Ward 19','Ward 20','Ward 21','Ward 22',
  'Ward 23','Ward 24','Ward 25','Ward 26','Ward 27','Ward 28','Ward 29','Ward 30'
];

const INITIAL_ISSUES = [
  
  { id: 1,  title: "Pothole at Golf Course Rd Junction",   category: "Roads & Pavement",   location: "Sector 54, Gurugram",           city: "Gurugram",  ward: "Ward 15", latlng: { lat: 28.4643, lng: 77.0738 }, status: "In Progress",  upvotes: 67, reportedBy: "Rahul K.",    civic_id: "CP-2025-1041", date: "Apr 12, 2025", urgency: "High",     hasUpvoted: false, photo: null, description: "A severe pothole approximately 1.5 ft wide at the junction. Two two-wheelers have skidded. Reported to ward helpline twice with no response." },
  { id: 2,  title: "Overflowing garbage bin — Market",     category: "Waste Management",    location: "Old Bazaar, Gurugram",           city: "Gurugram",  ward: "Ward 15", latlng: { lat: 28.4521, lng: 77.0182 }, status: "Reported",     upvotes: 31, reportedBy: "Sneha P.",    civic_id: "CP-2025-1038", date: "Apr 13, 2025", urgency: "Medium",   hasUpvoted: false, photo: null, description: "The main community bin near Old Bazaar has not been emptied in 5 days. Waste is overflowing onto the footpath." },
  { id: 3,  title: "Broken street lights — D-Block",       category: "Street Lighting",     location: "D-Block, Sector 45, Gurugram",  city: "Gurugram",  ward: "Ward 15", latlng: { lat: 28.4710, lng: 77.0580 }, status: "Acknowledged", upvotes: 45, reportedBy: "Paras J.",    civic_id: "CP-2025-1035", date: "Apr 10, 2025", urgency: "High",     hasUpvoted: false, photo: null, description: "Three consecutive streetlights down for 2+ weeks. Creating safety hazard at night. Elderly residents are afraid to go out after dark." },
  { id: 4,  title: "Burst water pipe — Sector 23",         category: "Water Supply",        location: "Sector 23, Gurugram",           city: "Gurugram",  ward: "Ward 14", latlng: { lat: 28.4480, lng: 77.0310 }, status: "Resolved",     upvotes: 89, reportedBy: "Anita R.",    civic_id: "CP-2025-1019", date: "Apr 05, 2025", urgency: "Critical", hasUpvoted: false, photo: null, description: "Large burst pipe causing water logging. Road flooded and traffic diverted. Required immediate intervention." },
  { id: 5,  title: "Damaged park benches — Leisure Valley", category: "Parks & Recreation", location: "Leisure Valley, Sec 29, Gurugram", city: "Gurugram", ward: "Ward 15", latlng: { lat: 28.4560, lng: 77.0450 }, status: "Reported",     upvotes: 14, reportedBy: "Mohan D.",    civic_id: "CP-2025-1044", date: "Apr 15, 2025", urgency: "Low",      hasUpvoted: false, photo: null, description: "Multiple benches have broken planks. Children and elderly using the park are at risk of injury." },
  { id: 6,  title: "Illegal dumping near IFFCO underpass", category: "Waste Management",    location: "IFFCO Chowk, Gurugram",         city: "Gurugram",  ward: "Ward 16", latlng: { lat: 28.4720, lng: 77.0730 }, status: "In Progress",  upvotes: 53, reportedBy: "Deepak S.",   civic_id: "CP-2025-1033", date: "Apr 09, 2025", urgency: "High",     hasUpvoted: false, photo: null, description: "Construction debris and household waste being dumped illegally near the underpass entrance." },
  { id: 7,  title: "Waterlogging after rain — Sector 40",  category: "Drainage & Flooding", location: "Sector 40, Gurugram",           city: "Gurugram",  ward: "Ward 15", latlng: { lat: 28.4590, lng: 77.0620 }, status: "Acknowledged", upvotes: 38, reportedBy: "Kavita M.",   civic_id: "CP-2025-1040", date: "Apr 11, 2025", urgency: "Medium",   hasUpvoted: false, photo: null, description: "The drain in the sub-market area is blocked. Any rain causes severe waterlogging for 4–5 hours affecting shops and pedestrians." },
  
  { id: 8,  title: "Crater-sized pothole near Lajpat Nagar", category: "Roads & Pavement", location: "Ring Road, Lajpat Nagar, Delhi", city: "Delhi",     ward: "Ward 8",  latlng: { lat: 28.5645, lng: 77.2427 }, status: "Reported",     upvotes: 112, reportedBy: "Ravi S.",   civic_id: "CP-2025-1022", date: "Apr 08, 2025", urgency: "Critical", hasUpvoted: false, photo: null, description: "A massive pothole on Ring Road near Lajpat Nagar metro has caused 3 accidents this week. Cars are swerving dangerously." },
  { id: 9,  title: "Sewage overflow — Rohini Sector 3",    category: "Drainage & Flooding", location: "Sector 3, Rohini, Delhi",       city: "Delhi",     ward: "Ward 22", latlng: { lat: 28.7041, lng: 77.1025 }, status: "Acknowledged", upvotes: 76, reportedBy: "Priya M.",   civic_id: "CP-2025-1028", date: "Apr 07, 2025", urgency: "High",     hasUpvoted: false, photo: null, description: "Sewage pipe burst on the main road. Raw sewage spilling into the street for 3 days now. Residents unable to leave homes." },
  { id: 10, title: "Street dog menace — Dwarka Sector 10", category: "Public Property",     location: "Sector 10, Dwarka, Delhi",      city: "Delhi",     ward: "Ward 19", latlng: { lat: 28.5921, lng: 77.0460 }, status: "Reported",     upvotes: 44, reportedBy: "Sunita V.",   civic_id: "CP-2025-1036", date: "Apr 14, 2025", urgency: "Medium",   hasUpvoted: false, photo: null, description: "Pack of aggressive stray dogs near the school zone. Two children bitten this month. Urgent sterilisation drive needed." },
  { id: 11, title: "Defunct traffic signal — Connaught Pl", category: "Traffic & Signals",  location: "Connaught Place, Delhi",        city: "Delhi",     ward: "Ward 3",  latlng: { lat: 28.6315, lng: 77.2167 }, status: "In Progress",  upvotes: 91, reportedBy: "Arjun T.",   civic_id: "CP-2025-1017", date: "Apr 03, 2025", urgency: "High",     hasUpvoted: false, photo: null, description: "Traffic light at one of the busiest CP intersections has been blinking amber for 2 weeks, causing near-daily accidents." },
  { id: 12, title: "Broken footpath — Saket Metro exit",   category: "Roads & Pavement",    location: "Saket Metro Station, Delhi",    city: "Delhi",     ward: "Ward 11", latlng: { lat: 28.5244, lng: 77.2066 }, status: "Resolved",     upvotes: 58, reportedBy: "Neha G.",    civic_id: "CP-2025-1009", date: "Mar 28, 2025", urgency: "Medium",   hasUpvoted: false, photo: null, description: "Footpath tiles broken and upturned near metro exit. Multiple trip-and-fall incidents reported, especially for elderly." },
  
  { id: 13, title: "Water supply cut for 4 days — Sec 62", category: "Water Supply",        location: "Sector 62, Noida",              city: "Noida",     ward: "Ward 7",  latlng: { lat: 28.6277, lng: 77.3694 }, status: "In Progress",  upvotes: 138, reportedBy: "Vikram N.", civic_id: "CP-2025-1031", date: "Apr 06, 2025", urgency: "Critical", hasUpvoted: false, photo: null, description: "No water supply for 4 consecutive days in Sector 62. Residents dependent on tankers at high cost. NMRC not responding to complaints." },
  { id: 14, title: "Garbage pile-up — Sector 18 market",   category: "Waste Management",    location: "Sector 18 Market, Noida",       city: "Noida",     ward: "Ward 9",  latlng: { lat: 28.5708, lng: 77.3219 }, status: "Reported",     upvotes: 63, reportedBy: "Pooja A.",   civic_id: "CP-2025-1045", date: "Apr 16, 2025", urgency: "High",     hasUpvoted: false, photo: null, description: "Market area bins overflowing for 6 days. Health hazard with flies and rodents. Shopkeepers threatening to close shops." },
  { id: 15, title: "Park lights non-functional — Sec 50",  category: "Street Lighting",     location: "Sector 50, Noida",              city: "Noida",     ward: "Ward 12", latlng: { lat: 28.6139, lng: 77.3564 }, status: "Acknowledged", upvotes: 29, reportedBy: "Suresh P.",  civic_id: "CP-2025-1042", date: "Apr 12, 2025", urgency: "Medium",   hasUpvoted: false, photo: null, description: "All park lights out for 3 weeks. Evening walkers, especially women, feel unsafe. Theft incident also reported in the dark zone." },
  
  { id: 16, title: "Road completely dug up — NIT Faridabad", category: "Roads & Pavement",  location: "NIT, Faridabad",                city: "Faridabad", ward: "Ward 4",  latlng: { lat: 28.3670, lng: 77.3080 }, status: "Reported",     upvotes: 47, reportedBy: "Harish K.",  civic_id: "CP-2025-1046", date: "Apr 15, 2025", urgency: "High",     hasUpvoted: false, photo: null, description: "A major road in NIT area dug up for pipeline work weeks ago but never restored. Traffic chaos and flooding in every rain." },
  { id: 17, title: "Industrial effluent in drain — Sec 37", category: "Drainage & Flooding", location: "Sector 37, Faridabad",          city: "Faridabad", ward: "Ward 6",  latlng: { lat: 28.3947, lng: 77.3203 }, status: "Acknowledged", upvotes: 82, reportedBy: "Meena J.",   civic_id: "CP-2025-1030", date: "Apr 04, 2025", urgency: "Critical", hasUpvoted: false, photo: null, description: "Chemical effluent from nearby factory being discharged directly into the residential drain. Foul smell, skin rashes in the area." },
  
  { id: 18, title: "Broken metro feeder road — Vaishali",  category: "Roads & Pavement",    location: "Vaishali, Ghaziabad",           city: "Ghaziabad", ward: "Ward 17", latlng: { lat: 28.6448, lng: 77.3387 }, status: "In Progress",  upvotes: 55, reportedBy: "Amit D.",    civic_id: "CP-2025-1029", date: "Apr 05, 2025", urgency: "High",     hasUpvoted: false, photo: null, description: "The approach road to Vaishali metro is riddled with potholes. Daily commuters face accidents and vehicle damage." },
  { id: 19, title: "Stagnant water mosquito breeding — Raj Nagar", category: "Drainage & Flooding", location: "Raj Nagar, Ghaziabad",   city: "Ghaziabad", ward: "Ward 20", latlng: { lat: 28.6730, lng: 77.4140 }, status: "Reported",     upvotes: 34, reportedBy: "Sanjay R.",  civic_id: "CP-2025-1047", date: "Apr 16, 2025", urgency: "High",     hasUpvoted: false, photo: null, description: "Stagnant water in open drain near Raj Nagar colony for weeks. Dengue cases rising — 4 children hospitalised this month." },
  
  { id: 20, title: "No streetlights on Yamuna Expressway stretch", category: "Street Lighting", location: "Yamuna Expressway, Greater Noida", city: "Greater Noida", ward: "Ward 25", latlng: { lat: 28.4744, lng: 77.5040 }, status: "Resolved",   upvotes: 103, reportedBy: "Ritu P.",    civic_id: "CP-2025-1011", date: "Mar 30, 2025", urgency: "Critical", hasUpvoted: false, photo: null, description: "3 km stretch of Yamuna Expressway completely dark at night. Multiple fatal accidents in the past month." },
];

const LEADERBOARD_DATA = [
  { rank: 1,  name: "Meera Iyer",       ward: "Ward 15", score: 412, reports: 28, resolved: 21 },
  { rank: 2,  name: "Arjun Nair",       ward: "Ward 14", score: 389, reports: 25, resolved: 18 },
  { rank: 3,  name: "Priya Malhotra",   ward: "Ward 15", score: 356, reports: 24, resolved: 16 },
  { rank: 4,  name: "Paras Jain",       ward: "Ward 15", score: 245, reports: 17, resolved: 12 },
  { rank: 5,  name: "Somya Sharma",     ward: "Ward 16", score: 234, reports: 16, resolved: 11 },
  { rank: 6,  name: "Rahul Kumar",      ward: "Ward 15", score: 198, reports: 13, resolved: 9  },
  { rank: 7,  name: "Anupriya Agarwal", ward: "Ward 14", score: 187, reports: 12, resolved: 10 },
  { rank: 8,  name: "Vikram Singh",     ward: "Ward 16", score: 156, reports: 11, resolved: 7  },
  { rank: 9,  name: "Neha Gupta",       ward: "Ward 15", score: 143, reports: 10, resolved: 6  },
  { rank: 10, name: "Amit Sharma",      ward: "Ward 14", score: 128, reports: 9,  resolved: 5  },
];

const CATEGORIES   = ["Roads & Pavement", "Street Lighting", "Waste Management", "Water Supply", "Parks & Recreation", "Drainage & Flooding", "Traffic & Signals", "Public Property"];
const STATUS_ORDER = ["Reported", "Acknowledged", "In Progress", "Resolved"];
const NEXT_STATUS  = { "Reported": "Acknowledged", "Acknowledged": "In Progress", "In Progress": "Resolved" };

function parseDateStr(str) { const d = new Date(str); return isNaN(d) ? new Date() : d; }
function fmtAuditTime(date) {
  const d = date.toLocaleDateString('en-IN', { month:'short', day:'numeric' });
  const t = date.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });
  return `${d} · ${t}`;
}

function seedStatusLog(issue) {
  const base   = parseDateStr(issue.date);
  const curIdx = STATUS_ORDER.indexOf(issue.status);
  const gaps   = [0, 5 * 3600000, 18 * 3600000, 38 * 3600000];
  const log    = {};
  for (let i = 0; i <= curIdx; i++) {
    log[STATUS_ORDER[i]] = new Date(base.getTime() + gaps[i]);
  }
  return log;
}
const CAT_COLORS   = {
  "Roads & Pavement": "#f97316", "Street Lighting": "#eab308",
  "Waste Management": "#84cc16", "Water Supply": "#06b6d4",
  "Parks & Recreation": "#22c55e", "Drainage & Flooding": "#3b82f6",
  "Traffic & Signals": "#a855f7", "Public Property": "#ec4899",
};

let state = {
  view: 'landing',
  user: null,
  issues: INITIAL_ISSUES.map(i => ({ ...i, statusLog: seedStatusLog(i) })),
  submittedIssue: null,
  selectedIssueId: null,
  filterStatus: 'All',
  sortBy: 'priority',
  loginTab: 'citizen',
  submitStep: 1,
  submitForm: { title: '', category: '', description: '', location: '', latlng: null, urgency: 'Medium', photoDataUrl: null },
  aiResult: null,
  aiLoading: false,
  authFilter: 'All',
  authSortBy: 'priority',
  authSelectedId: null,
  authMap: null,
  authMarkers: [],
  dashMap: null,
  dashMarkers: [],
  submitMap: null,
  submitMarker: null,
  selectedWard: 'Ward 15',
};

function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;
  cursor.style.opacity = '0';
  document.addEventListener('mousemove', e => {
    cursor.style.left    = e.clientX + 'px';
    cursor.style.top     = e.clientY + 'px';
    cursor.style.opacity = '1';
  });

  
  document.addEventListener('mouseover', e => {
    const el = e.target.closest('button, a, input, textarea, select, [onclick], .issue-card, .auth-issue-item, .lb-row, .ward-option, .cat-btn, .urg-btn, .filter-btn, .tab-switcher button, .upvote-btn, .advance-btn');
    document.body.classList.toggle('cursor-hover', !!el);
  });
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
}

function initLoginCursorFX() {
  const loginView = document.getElementById('view-login');
  if (!loginView) return;

  let lastSpawn = 0;
  loginView.addEventListener('mousemove', e => {
    const now = Date.now();
    
    if (now - lastSpawn > 60) {
      lastSpawn = now;
      spawnLoginParticle(e.clientX, e.clientY);
    }
  });

  loginView.addEventListener('click', e => {
    spawnLoginRipple(e.clientX, e.clientY);
  });
}

function spawnLoginParticle(x, y) {
  const container = document.getElementById('login-particles');
  if (!container) return;
  const p = document.createElement('div');
  p.className = 'login-particle';
  const size = 4 + Math.random() * 8;
  const dx = (Math.random() - 0.5) * 60;
  const dy = (Math.random() - 0.5) * 60;
  p.style.cssText = `
    left:${x}px; top:${y}px;
    width:${size}px; height:${size}px;
    --dx:${dx}px; --dy:${dy}px;
    opacity:0;
  `;
  container.appendChild(p);
  
  requestAnimationFrame(() => { p.style.opacity = '.7'; p.style.transform = 'translate(-50%,-50%) scale(1)'; });
  setTimeout(() => p.remove(), 900);
}

function spawnLoginRipple(x, y) {
  const container = document.getElementById('login-particles');
  if (!container) return;
  const size = 80 + Math.random() * 40;
  const r = document.createElement('div');
  r.className = 'login-ripple';
  r.style.cssText = `left:${x}px; top:${y}px; width:${size}px; height:${size}px;`;
  container.appendChild(r);
  setTimeout(() => r.remove(), 1500);
}

const MAP_CENTER = { lat: 28.5355, lng: 77.3910 }; 

function whenMapsReady(fn) {
  if (window.gmapsReady) { fn(); }
  else { window.pendingMapInit = fn; }
}

function initDashboardMap() {
  const el = document.getElementById('google-map');
  if (!el || state.dashMap) return;
  state.dashMap = L.map('google-map', { zoomControl: true }).setView([MAP_CENTER.lat, MAP_CENTER.lng], 11);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd', maxZoom: 19,
  }).addTo(state.dashMap);
  document.getElementById('map-loading').style.display = 'none';
  renderMapMarkers();
}

function renderMapMarkers() {
  if (!state.dashMap) return;
  state.dashMarkers.forEach(m => state.dashMap.removeLayer(m));
  state.dashMarkers = [];
  state.issues.forEach(issue => {
    if (!issue.latlng) return;
    const color = issue.status === 'Resolved' ? '#22c55e' : (CAT_COLORS[issue.category] || '#C9996B');
    const isSel = String(state.selectedIssueId) === String(issue.id);
    const size  = isSel ? 18 : 13;
    const icon  = L.divIcon({
      className: '',
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
      iconSize: [size, size], iconAnchor: [size/2, size/2],
    });
    const marker = L.marker([issue.latlng.lat, issue.latlng.lng], { icon })
      .addTo(state.dashMap)
      .bindPopup(`
        <div style="font-family:'DM Sans',sans-serif;min-width:180px">
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:4px">${issue.title}</div>
          <div style="font-size:10px;color:#64748b;margin-bottom:2px">📍 ${issue.location}</div>
          <div style="font-size:10px;color:#94a3b8;margin-bottom:6px">🏙️ ${issue.city || ''}</div>
          <div style="display:flex;gap:5px;align-items:center">
            ${statusBadge(issue.status)}
            <span style="font-size:10px;color:#94a3b8">▲ ${issue.upvotes}</span>
          </div>
        </div>`, { offset: [0, -4] });
    marker.on('click', () => selectIssue(issue.id));
    state.dashMarkers.push(marker);
  });
}

function initSubmitMap() {
  const el = document.getElementById('submit-map');
  if (!el) return;
  const center = state.submitForm.latlng || MAP_CENTER;
  state.submitMap = L.map('submit-map').setView([center.lat, center.lng], 11);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd', maxZoom: 19,
  }).addTo(state.submitMap);
  document.getElementById('submit-map-loading').style.display = 'none';
  state.submitMap.on('click', (e) => { placeSubmitPin(e.latlng.lat, e.latlng.lng, true); });
  const searchInput = document.getElementById('location-search');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const q = searchInput.value.trim();
      if (!q) return;
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&countrycodes=in&limit=1&format=json`)
        .then(r => r.json()).then(results => {
          if (results && results[0]) {
            const lat = parseFloat(results[0].lat), lng = parseFloat(results[0].lon);
            state.submitForm.location = results[0].display_name;
            searchInput.value = results[0].display_name;
            state.submitMap.setView([lat, lng], 16);
            placeSubmitPin(lat, lng, false);
            updateStep2NextBtn();
          }
        }).catch(() => {});
    });
  }
  if (state.submitForm.latlng) placeSubmitPin(state.submitForm.latlng.lat, state.submitForm.latlng.lng, false);
}

function placeSubmitPin(lat, lng, reverseGeocode) {
  state.submitForm.latlng = { lat, lng };
  if (state.submitMarker) {
    state.submitMarker.setLatLng([lat, lng]);
  } else {
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:22px;height:22px;border-radius:50%;background:#C9996B;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
      iconSize: [22, 22], iconAnchor: [11, 11],
    });
    state.submitMarker = L.marker([lat, lng], { icon, draggable: true }).addTo(state.submitMap);
    state.submitMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      placeSubmitPin(pos.lat, pos.lng, true);
    });
  }
  const latlngEl = document.getElementById('latlng-display');
  latlngEl.style.display = 'block';
  latlngEl.textContent = `📌 ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  document.getElementById('submit-map-hint').style.display = 'none';
  updateStep2NextBtn();
  if (reverseGeocode) reverseGeocodePin(lat, lng);
}

function reverseGeocodePin(lat, lng) {
  fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
    .then(r => r.json()).then(data => {
      if (data && data.display_name) {
        state.submitForm.location = data.display_name;
        const el = document.getElementById('location-search');
        if (el) el.value = data.display_name;
        updateStep2NextBtn();
      }
    }).catch(() => {});
}

function locateMe() {
  if (!navigator.geolocation) { alert('Geolocation not supported by your browser.'); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      if (state.submitMap) { state.submitMap.setView([lat, lng], 16); placeSubmitPin(lat, lng, true); }
      else { state.submitForm.latlng = { lat, lng }; reverseGeocodePin(lat, lng); }
    },
    () => alert('Could not get your location. Please allow location access.')
  );
}

function statusClass(s) { return 'status-' + s.replace(/ /g, '-'); }
function statusBadge(status) {
  return `<span class="status-badge ${statusClass(status)}"><span class="status-dot"></span>${status}</span>`;
}
function urgencyBadge(urgency) {
  return `<span class="urgency-badge urgency-${urgency}">${urgency}</span>`;
}
function catBadge(category) {
  return `<span style="background:var(--bg3);padding:2px 7px;border-radius:20px;font-size:11px;color:var(--text3)">${category}</span>`;
}

function openWardModal() {
  let existing = document.getElementById('ward-modal-overlay');
  if (existing) { existing.remove(); return; }
  const overlay = document.createElement('div');
  overlay.id = 'ward-modal-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

  const modal = document.createElement('div');
  modal.id = 'ward-modal';
  modal.innerHTML = `
    <h3>Change Your Ward</h3>
    <p>Select the ward number you belong to in Delhi NCR.</p>
    <div class="ward-grid">
      ${NCR_WARDS.map(w => `<button class="ward-option ${w === state.selectedWard ? 'selected' : ''}" onclick="tempSelectWard('${w}',this)">${w}</button>`).join('')}
    </div>
    <div class="ward-modal-btns">
      <button class="ward-cancel-btn" onclick="document.getElementById('ward-modal-overlay').remove()">Cancel</button>
      <button class="ward-save-btn" onclick="saveWard()">Save Ward</button>
    </div>
  `;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  window._tempWard = state.selectedWard;
}

function tempSelectWard(ward, el) {
  window._tempWard = ward;
  document.querySelectorAll('.ward-option').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

function saveWard() {
  if (window._tempWard) {
    state.selectedWard = window._tempWard;
    if (state.user) state.user.ward = window._tempWard;
    updateWardDisplay();
  }
  const overlay = document.getElementById('ward-modal-overlay');
  if (overlay) overlay.remove();
}

function updateWardDisplay() {
  const wardBtn = document.getElementById('ward-btn');
  if (wardBtn) wardBtn.textContent = state.selectedWard + ' ▾';
}

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-' + name);
  if (el) el.classList.add('active');
  state.view = name;

  const topbar = document.getElementById('topbar');
  const showTopbar = name === 'dashboard' || name === 'leaderboard' || name === 'shop';
  topbar.classList.toggle('hidden', !showTopbar);
  document.getElementById('view-dashboard').style.paddingTop = showTopbar ? '52px' : '0';

  
  if (name === 'login') {
    setTimeout(initLoginCursorFX, 100);
  }
}

function navigate(view) { showView(view); renderForView(view); }

function renderForView(view) {
  if (view === 'dashboard')   renderDashboard();
  if (view === 'leaderboard') { lbScope = 'overall'; lbWardFilter = 'all'; document.querySelectorAll('.lb-scope-btn').forEach(b => b.classList.toggle('active', b.dataset.scope === 'overall')); document.getElementById('lb-ward-picker')?.classList.add('hidden'); renderLeaderboard(); }
  if (view === 'authority')   renderAuthority();
  if (view === 'shop')        renderShop();
}

function goHome() {
  if (!state.user) return;
  if (state.user.role === 'authority') { navigate('authority'); }
  else { navigate('dashboard'); }
}

function initLanding() {
  showView('landing');
  state.submitMap  = null;
  state.submitMarker = null;
  setTimeout(() => {
    const left  = document.getElementById('landing-left');
    const right = document.getElementById('landing-right');
    if (left)  left.classList.add('loaded');
    if (right) right.classList.add('loaded');
  }, 60);
  initLandingCanvas();
  spawnFloatingCards();
  initTicker();
  animateCounters();
  loadLandingStats();
  initCursorGlow();
}

function goToLogin() {
  showView('login');
  const nameEl = document.getElementById('login-name');
  const emailEl = document.getElementById('login-email');
  const pwEl    = document.getElementById('login-password');
  if (nameEl)  nameEl.value  = '';
  if (emailEl) emailEl.value = '';
  if (pwEl)    pwEl.value    = '';
  const sw = document.getElementById('pw-strength-wrap');
  if (sw) sw.style.display = 'none';
  clearLoginError();
  setLoginTab('citizen');
}

function goToLanding() { showView('landing'); }

function initLandingCanvas() {
  const canvas = document.getElementById('landing-canvas');
  if (!canvas || canvas._running) return;
  canvas._running = true;
  const ctx = canvas.getContext('2d');
  let W, H, dots = [], mouse = { x: -999, y: -999 };
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 70; i++) {
    dots.push({ x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, vx: (Math.random()-.5)*.4, vy: (Math.random()-.5)*.4, r: Math.random()*2+1 });
  }
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  function draw() {
    if (!document.getElementById('landing-canvas')) return;
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
      const dx = d.x - mouse.x, dy = d.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) { d.vx += dx/dist*.04; d.vy += dy/dist*.04; }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(201,153,107,0.45)';
      ctx.fill();
    });
    for (let i = 0; i < dots.length; i++) {
      for (let j = i+1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(201,153,107,${.18*(1-d/130)})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

function spawnFloatingCards() {
  const container = document.getElementById('landing-cards-bg');
  if (!container) return;
  container.innerHTML = '';
  const cards = [
    { title:'Pothole — Golf Course Rd, GGN', loc:'Sector 54, Gurugram', status:'In Progress', statusColor:'#dbeafe', statusText:'#1e40af', urgency:'HIGH', urgColor:'#fee2e2', urgText:'#991b1b', dotColor:'#3b82f6' },
    { title:'Sewage overflow — Rohini', loc:'Sector 3, Rohini, Delhi', status:'Acknowledged', statusColor:'#fef3c7', statusText:'#92400e', urgency:'HIGH', urgColor:'#fee2e2', urgText:'#991b1b', dotColor:'#f59e0b' },
    { title:'Water supply cut — Noida Sec 62', loc:'Sector 62, Noida', status:'In Progress', statusColor:'#dbeafe', statusText:'#1e40af', urgency:'CRITICAL', urgColor:'#ede9fe', urgText:'#5b21b6', dotColor:'#3b82f6' },
    { title:'Burst pipe resolved — Sec 23', loc:'Sector 23, Gurugram', status:'Resolved', statusColor:'#dcfce7', statusText:'#166534', urgency:'CRITICAL', urgColor:'#ede9fe', urgText:'#5b21b6', dotColor:'#22c55e' },
    { title:'Industrial effluent — Faridabad', loc:'Sector 37, Faridabad', status:'Acknowledged', statusColor:'#fef3c7', statusText:'#92400e', urgency:'CRITICAL', urgColor:'#ede9fe', urgText:'#5b21b6', dotColor:'#f59e0b' },
    { title:'Broken metro feeder — Vaishali', loc:'Vaishali, Ghaziabad', status:'In Progress', statusColor:'#dbeafe', statusText:'#1e40af', urgency:'HIGH', urgColor:'#fee2e2', urgText:'#991b1b', dotColor:'#3b82f6' },
  ];
  const laneCount = cards.length, laneWidth = 100 / laneCount;
  cards.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'bg-issue-card';
    const laneMid = laneWidth * i + laneWidth / 2;
    const jitter  = (Math.random() - .5) * (laneWidth * 0.4);
    const leftPct = Math.max(2, Math.min(76, laneMid + jitter));
    const rot      = (Math.random() - .5) * 14;
    const duration = 16 + Math.random() * 8;
    const delay    = -(duration * i / laneCount);
    el.style.cssText = `left:${leftPct}%;--rot:${rot}deg;animation-duration:${duration}s;animation-delay:${delay}s;`;
    el.innerHTML = `
      <div class="bg-card-title">${c.title}</div>
      <div class="bg-card-loc">📍 ${c.loc}</div>
      <div class="bg-card-tags">
        <span class="bg-card-status" style="background:${c.statusColor};color:${c.statusText}">
          <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${c.dotColor};margin-right:4px;vertical-align:middle"></span>${c.status}
        </span>
        <span class="bg-card-urgency" style="background:${c.urgColor};color:${c.urgText}">${c.urgency}</span>
      </div>`;
    container.appendChild(el);
  });
}

function initTicker() {
  const track = document.getElementById('ticker-track');
  if (!track) return;
  const items = [
    { text: 'Water cut 4 days — Sec 62 Noida · CRITICAL',      color: '#a855f7' },
    { text: 'Pothole accidents — Lajpat Nagar, Delhi',          color: '#94a3b8' },
    { text: 'Sewage burst — Rohini Sector 3, Delhi',            color: '#f59e0b' },
    { text: 'Illegal dumping resolved — IFFCO Gurugram',        color: '#22c55e' },
    { text: 'Industrial effluent — Faridabad Sector 37',        color: '#ef4444' },
    { text: 'Broken metro road — Vaishali, Ghaziabad',          color: '#3b82f6' },
    { text: 'Dengue risk: stagnant drain — Raj Nagar GZB',      color: '#f97316' },
    { text: 'Streetlights restored — Yamuna Expressway GN',     color: '#22c55e' },
  ];
  const html = [...items, ...items].map(it =>
    `<span class="ticker-item"><span class="ticker-dot" style="background:${it.color}"></span>${it.text}</span>`
  ).join('<span style="margin-right:20px;opacity:.3">·</span>');
  track.innerHTML = html;
}

function animateCounters() {
  const targets = [
    { el: document.getElementById('cnt-issues'),   end: 2847, suffix: '',   dur: 2000 },
    { el: document.getElementById('cnt-rate'),     end: 95,   suffix: '%',  dur: 1600 },  
    { el: document.getElementById('cnt-citizens'), end: 12,   suffix: 'K+', dur: 1400 },
  ];
  targets.forEach(({ el, end, suffix, dur }) => {
    if (!el) return;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * end).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  function moveGlow() {
    if (!document.getElementById('cursor-glow')) return;
    gx += (tx - gx) * .08;
    gy += (ty - gy) * .08;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(moveGlow);
  }
  moveGlow();
}

function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  
  document.body.classList.toggle('theme-dark', dark);
  const icon  = dark ? '☀️' : '🌙';
  const label = dark ? 'Light' : 'Dark';
  document.querySelectorAll('.theme-icon-all').forEach(el => el.textContent = icon);
  const li = document.getElementById('landing-theme-icon');
  const ll = document.getElementById('landing-theme-label');
  if (li) li.textContent = icon;
  if (ll) ll.textContent = label;
  document.querySelectorAll('.login-theme-label-text').forEach(el => el.textContent = label);
}

function toggleTheme() {
  const isDark = !document.body.classList.contains('dark');
  localStorage.setItem('cp-theme', isDark ? 'dark' : 'light');
  applyTheme(isDark);
}

function setLoginTab(tab) {
  state.loginTab = tab;
  document.querySelectorAll('.tab-switcher button').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  const ph = tab === 'citizen' ? 'john.doe@example.com' : 'ward15.officer@mcg.gov.in';
  const emailEl = document.getElementById('login-email');
  if (emailEl) emailEl.placeholder = ph;
  const btn = document.getElementById('login-btn');
  if (btn) btn.textContent = tab === 'citizen' ? 'Access Citizen Portal →' : 'Access Authority Panel →';
  clearLoginError();
}

function clearLoginError() {
  const el = document.getElementById('login-error');
  if (!el) return;
  el.textContent = '';
  el.classList.add('hidden');
}

function showLoginError(msg) {
  const el = document.getElementById('login-error');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function togglePassword() {
  const inp = document.getElementById('login-password');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function checkPasswordStrength(val) {
  const wrap = document.getElementById('pw-strength-wrap');
  if (!wrap) return;
  if (!val) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  const hasUpper = /[A-Z]/.test(val);
  const hasLower = /[a-z]/.test(val);
  const hasNum   = /[0-9]/.test(val);
  const hasSpec  = /[^A-Za-z0-9]/.test(val);
  const score    = [hasUpper, hasLower, hasNum, hasSpec].filter(Boolean).length;
  const rules    = [['pr-upper','Uppercase letter',hasUpper],['pr-lower','Lowercase letter',hasLower],['pr-num','Number',hasNum],['pr-spec','Special character',hasSpec]];
  rules.forEach(([id, label, ok]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'pw-rule' + (ok ? ' ok' : '');
    el.textContent = (ok ? '✓' : '✗') + ' ' + label;
  });
  for (let i = 1; i <= 4; i++) {
    const bar = document.getElementById('pwb' + i);
    if (bar) bar.className = 'pw-bar' + (i <= score ? ` active-${score}` : '');
  }
}

function handleLogin() {
  const name     = (document.getElementById('login-name')?.value || '').trim();
  const email    = (document.getElementById('login-email')?.value || '').trim();
  const password = document.getElementById('login-password')?.value || '';

  if (!email || !password) { showLoginError('Please enter your email and password.'); return; }

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(email)) { showLoginError('Please enter a valid email address.'); return; }
  if (!/[A-Z]/.test(password)) { showLoginError('Password must contain at least one uppercase letter (A–Z).'); return; }
  if (!/[a-z]/.test(password)) { showLoginError('Password must contain at least one lowercase letter (a–z).'); return; }
  if (!/[0-9]/.test(password)) { showLoginError('Password must contain at least one number (0–9).'); return; }
  if (!/[^A-Za-z0-9]/.test(password)) { showLoginError('Password must contain at least one special character (e.g. @, #, !).'); return; }

  clearLoginError();

  const tab = state.loginTab;
  if (tab === 'authority') {
    state.user = { name, ward: state.selectedWard, role: 'authority', designation: 'Ward Officer' };
    document.body.classList.add('logged-in');
    const ahName = document.getElementById('ah-name-display');
    if (ahName) ahName.textContent = `${name} · ${state.selectedWard}`;
    renderAuthority();
    showView('authority');
    whenMapsReady(initAuthorityMap);
  } else {
    state.user = { name, ward: state.selectedWard, role: 'citizen', civicScore: 245, reports: 3, resolved: 12 };
    document.body.classList.add('logged-in');
    renderTopbar(true);
    renderDashboard();
    showView('dashboard');
    whenMapsReady(initDashboardMap);
  }
}

function handleLogout() {
  document.body.classList.remove('logged-in');
  state.authFullMap = null;
  state.user = null;
  state.selectedIssueId = null;
  state.dashMap = null;
  state.dashMarkers = [];
  state.authMap = null;
  state.authMarkers = [];
  state.submitMap = null;
  state.submitMarker = null;
  showView('landing');
}

function renderTopbar(showNav = true) {
  const { user } = state;
  document.getElementById('topbar-nav').innerHTML = showNav ? `
    <button onclick="navigate('dashboard')">Dashboard</button>
    <button onclick="navigate('leaderboard')">🏆 Leaderboard</button>
    <button onclick="navigate('shop')">🛍️ Shop</button>
  ` : '';
  document.getElementById('topbar-user').innerHTML = user ? `
    <div class="user-info">
      <div class="avatar">${(user.name || 'U')[0].toUpperCase()}</div>
      <div>
        <div class="user-name">${user.name || 'User'}</div>
        ${user.civicScore !== undefined ? `<div class="user-score">⚡ ${user.civicScore} pts</div>` : ''}
      </div>
      <button class="ward-tag-btn" id="ward-btn" onclick="openWardModal()" title="Change ward">${state.selectedWard} ▾</button>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>` : '';
}

const URGENCY_RANK = { Critical: 4, High: 3, Medium: 2, Low: 1 };

function sortIssues(issues, sortBy) {
  const arr = [...issues];
  if (sortBy === 'priority') return arr.sort((a,b) => (URGENCY_RANK[b.urgency]||0) - (URGENCY_RANK[a.urgency]||0));
  if (sortBy === 'upvotes')  return arr.sort((a,b) => b.upvotes - a.upvotes);
  if (sortBy === 'date')     return arr.sort((a,b) => new Date(b.date) - new Date(a.date));
  return arr;
}

function setSort(val)     { state.sortBy = val;     renderIssueList(); }
function setAuthSort(val) { state.authSortBy = val; renderAuthority(); }

function renderDashboard() {
  renderTopbar(true);
  const { user, issues, filterStatus } = state;
  const active   = issues.filter(i => i.status !== 'Resolved').length;
  const resolved = issues.filter(i => i.status === 'Resolved').length;
  document.getElementById('stat-active').textContent     = active;
  document.getElementById('stat-resolved').textContent   = resolved;
  document.getElementById('stat-my-reports').textContent = user.reports || 0;

  
  const wardTag = document.querySelector('.ward-tag');
  if (wardTag) wardTag.textContent = state.selectedWard;

  document.getElementById('filter-bar').innerHTML =
    `<div class="filter-row">
      <div class="filter-btns">
        ${['All','Reported','Acknowledged','In Progress','Resolved'].map(s =>
          `<button class="filter-btn ${filterStatus === s ? 'active' : ''}" onclick="setFilter('${s}')">${s}</button>`
        ).join('')}
      </div>
      <select class="sort-select" onchange="setSort(this.value)" title="Sort issues">
        <option value="priority" ${state.sortBy === 'priority' ? 'selected' : ''}>🔺 Priority</option>
        <option value="upvotes"  ${state.sortBy === 'upvotes'  ? 'selected' : ''}>▲ Most Voted</option>
        <option value="date"     ${state.sortBy === 'date'     ? 'selected' : ''}>📅 Newest</option>
      </select>
    </div>`;
  renderIssueList();
  renderMapMarkers();
  renderDetailPanel();
}

function setFilter(status) {
  state.filterStatus = status;
  renderIssueList();
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.textContent === status));
}

function renderIssueList() {
  const filtered = state.issues.filter(i => state.filterStatus === 'All' || i.status === state.filterStatus);
  const sorted   = sortIssues(filtered, state.sortBy);
  document.getElementById('issue-count').textContent = `${sorted.length} ISSUES ACROSS NCR`;
  document.getElementById('issue-cards').innerHTML = sorted.map(issueCardHTML).join('');
}

function issueCardHTML(issue) {
  return `<div class="issue-card" onclick="selectIssue('${issue.id}')">
    <div class="card-top">
      <div class="card-meta">
        <div class="card-badges">${statusBadge(issue.status)}${urgencyBadge(issue.urgency)}</div>
        <div class="card-title">${issue.title}</div>
        <div class="card-loc">📍 ${issue.location} · ${issue.date}</div>
      </div>
      <button class="upvote-btn ${issue.hasUpvoted ? 'upvoted' : ''}"
        onclick="event.stopPropagation();toggleUpvote('${issue.id}')">
        <span class="arrow">▲</span>
        <span class="count">${issue.upvotes}</span>
      </button>
    </div>
    <div class="card-footer">
      <span class="cat-tag">${issue.category}</span>
      <span>by ${issue.reportedBy} · ${issue.civic_id}</span>
    </div>
  </div>`;
}

function handleUpvote(id) {
  state.issues = state.issues.map(i =>
    i.id === id ? { ...i, upvotes: i.hasUpvoted ? i.upvotes-1 : i.upvotes+1, hasUpvoted: !i.hasUpvoted } : i
  );
  renderIssueList();
  renderMapMarkers();
  if (String(state.selectedIssueId) === String(id)) renderDetailPanel();
}

function selectIssue(id) {
  state.selectedIssueId = String(state.selectedIssueId) === String(id) ? null : id;
  renderDetailPanel();
  renderMapMarkers();
  if (state.selectedIssueId && state.dashMap) {
    const issue = state.issues.find(i => String(i.id) === String(state.selectedIssueId));
    if (issue?.latlng) state.dashMap.panTo(issue.latlng);
  }
}

function renderDetailPanel() {
  const panel = document.getElementById('detail-panel');
  const issue = state.issues.find(i => String(i.id) === String(state.selectedIssueId));
  if (!issue) { panel.classList.remove('visible'); return; }
  panel.classList.add('visible');
  document.getElementById('detail-badges').innerHTML = statusBadge(issue.status) + urgencyBadge(issue.urgency) + `<span class="civic-id-small">${issue.civic_id}</span>`;
  document.getElementById('detail-title').textContent = issue.title;
  document.getElementById('detail-desc').textContent  = issue.description;
  document.getElementById('detail-meta').innerHTML = `📍 ${issue.location} · 🏙️ ${issue.city || ''} · Reported by ${issue.reportedBy} · ${issue.date}`;
  const photoWrap = document.getElementById('detail-photo-wrap');
  const photoImg  = document.getElementById('detail-photo');
  if (issue.photo) { photoImg.src = issue.photo; photoWrap.style.display = 'block'; }
  else             { photoWrap.style.display = 'none'; }
  const curIdx = STATUS_ORDER.indexOf(issue.status);
  document.getElementById('pipeline-steps').innerHTML = STATUS_ORDER.map((s, i) => {
    const done = i <= curIdx, cur = i === curIdx;
    return `<div class="pipeline-step ${done ? 'done' : ''}">
      <div class="pipeline-dot ${done ? 'done' : ''} ${cur ? 'current' : ''}">${done ? '✓' : ''}</div>
      <span>${s}</span>
    </div>`;
  }).join('');
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 10*1024*1024) { alert('Photo must be under 10 MB.'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    state.submitForm.photoDataUrl = e.target.result;
    document.getElementById('photo-placeholder').style.display = 'none';
    document.getElementById('photo-preview-wrap').style.display = 'block';
    document.getElementById('photo-preview').src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  state.submitForm.photoDataUrl = null;
  document.getElementById('photo-input').value = '';
  document.getElementById('photo-placeholder').style.display = 'flex';
  document.getElementById('photo-preview-wrap').style.display = 'none';
  document.getElementById('photo-preview').src = '';
}

function initSubmit() {
  state.submitStep = 1;
  state.submitForm = { title: '', category: '', description: '', location: '', latlng: null, urgency: 'Medium', photoDataUrl: null };
  state.aiResult   = null;
  state.submitMap  = null;
  state.submitMarker = null;
  renderSubmit();
  showView('submit');
}

function renderSubmit() {
  updateStepper();
  document.querySelectorAll('.step-panel').forEach((p, i) => p.classList.toggle('active', i+1 === state.submitStep));
  if (state.submitStep === 1) renderStep1();
  if (state.submitStep === 2) renderStep2();
  if (state.submitStep === 3) renderStep3();
}

function updateStepper() {
  const step = state.submitStep;
  document.querySelectorAll('.step-num').forEach((el, i) => {
    el.classList.remove('active','done');
    if (i+1 < step)       { el.classList.add('done');   el.textContent = '✓'; }
    else if (i+1 === step){ el.classList.add('active'); el.textContent = i+1; }
    else                  { el.textContent = i+1; }
  });
  document.querySelectorAll('.step-label').forEach((el, i) => el.classList.toggle('active', i+1 === step));
  document.querySelectorAll('.step-connector').forEach((el, i) => el.classList.toggle('done', i+1 < step));
}

function renderStep1() {
  document.getElementById('s1-desc').value = state.submitForm.description;
  if (state.submitForm.photoDataUrl) {
    document.getElementById('photo-placeholder').style.display = 'none';
    document.getElementById('photo-preview-wrap').style.display = 'block';
    document.getElementById('photo-preview').src = state.submitForm.photoDataUrl;
  } else {
    document.getElementById('photo-placeholder').style.display = 'flex';
    document.getElementById('photo-preview-wrap').style.display = 'none';
  }
  renderAIResult();
}

function renderStep2() {
  document.getElementById('s2-title').value        = state.submitForm.title;
  document.getElementById('location-search').value = state.submitForm.location;
  document.getElementById('cat-grid').innerHTML = CATEGORIES.map(cat =>
    `<button class="cat-btn ${state.submitForm.category === cat ? 'selected' : ''}"
      onclick="selectCategory('${cat}')">${cat}</button>`
  ).join('');
  document.getElementById('urgency-grid').innerHTML = ['Low','Medium','High','Critical'].map(u =>
    `<button class="urg-btn ${state.submitForm.urgency === u ? 'selected-'+u : ''}"
      onclick="selectUrgency('${u}')">${u}</button>`
  ).join('');
  updateStep2NextBtn();
  whenMapsReady(() => setTimeout(initSubmitMap, 100));
}

function updateStep2NextBtn() {
  const f = state.submitForm;
  document.getElementById('s2-next').disabled = !(f.title && (f.location || f.latlng) && f.category);
}

function selectCategory(cat) { state.submitForm.category = cat; renderStep2(); }
function selectUrgency(u)    { state.submitForm.urgency = u;    renderStep2(); }

function renderStep3() {
  const f = state.submitForm;
  document.getElementById('review-cat-badge').innerHTML    = catBadge(f.category);
  document.getElementById('review-urgency-badge').innerHTML = urgencyBadge(f.urgency);
  document.getElementById('review-title').textContent      = f.title;
  const locationText = f.location || (f.latlng ? `${f.latlng.lat.toFixed(5)}, ${f.latlng.lng.toFixed(5)}` : '—');
  document.getElementById('review-location').textContent   = '📍 ' + locationText;
  const latlngEl = document.getElementById('review-latlng');
  if (f.latlng) { latlngEl.textContent = `🗺 ${f.latlng.lat.toFixed(5)}, ${f.latlng.lng.toFixed(5)}`; latlngEl.style.display = 'block'; }
  else          { latlngEl.style.display = 'none'; }
  document.getElementById('review-desc').textContent = f.description;
  const photoWrap = document.getElementById('review-photo-wrap');
  const photoImg  = document.getElementById('review-photo');
  if (f.photoDataUrl) { photoImg.src = f.photoDataUrl; photoWrap.style.display = 'block'; }
  else                { photoWrap.style.display = 'none'; }
}

function renderAIResult() {
  const r = state.aiResult;
  document.getElementById('ai-result').style.display = r ? 'block' : 'none';
  if (r) {
    document.getElementById('ai-cat').textContent       = r.category || '—';
    document.getElementById('ai-urg').textContent       = r.urgency  || '—';
    document.getElementById('ai-sug-title').textContent = r.suggested_title || '—';
    document.getElementById('ai-est').textContent       = r.estimated_resolution_days ? r.estimated_resolution_days + ' days' : '—';
    document.getElementById('ai-reasoning').textContent = r.reasoning || '';
  }
}

async function runAI() {
  const desc = state.submitForm.description.trim();
  if (!desc || state.aiLoading) return;
  state.aiLoading = true;
  const btn = document.getElementById('ai-classify-btn');
  btn.disabled = true;
  btn.textContent = '⏳ Analysing…';
  document.getElementById('ai-error').style.display = 'none';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are the AI module for CivicPulse, a civic issue reporting platform for Delhi NCR. Analyse the issue description below and respond ONLY with a JSON object (no markdown, no backticks, no preamble) with exactly these fields:
{
  "category": "one of: Roads & Pavement | Street Lighting | Waste Management | Water Supply | Parks & Recreation | Drainage & Flooding | Traffic & Signals | Public Property",
  "urgency": "one of: Low | Medium | High | Critical",
  "suggested_title": "concise 5-10 word title",
  "estimated_resolution_days": <number>,
  "reasoning": "one short sentence explaining classification"
}

Issue description: "${desc}"`
        }]
      })
    });
    const data = await res.json();
    const text = (data.content?.find(b => b.type === 'text')?.text || '').replace(/```json|```/g,'').trim();
    const parsed = JSON.parse(text);
    state.aiResult = parsed;
    if (parsed.category)                                   state.submitForm.category = parsed.category;
    if (parsed.urgency)                                    state.submitForm.urgency  = parsed.urgency;
    if (!state.submitForm.title && parsed.suggested_title) state.submitForm.title    = parsed.suggested_title;
    renderAIResult();
  } catch (e) {
    document.getElementById('ai-error').style.display = 'block';
  }
  state.aiLoading = false;
  btn.disabled = false;
  btn.textContent = '✨ AI Auto-Classify';
}

function handleSubmitIssue() {
  const form   = state.submitForm;
  const latlng = form.latlng || { lat: MAP_CENTER.lat + (Math.random()-.5)*.12, lng: MAP_CENTER.lng + (Math.random()-.5)*.12 };
  const newIssue = {
    id: Date.now(), title: form.title, category: form.category || 'Public Property',
    location: form.location, city: 'Delhi NCR', ward: state.selectedWard, latlng, status: 'Reported', upvotes: 0,
    reportedBy: state.user?.name || 'Anonymous',
    civic_id: `CP-2025-10${49 + Math.floor(Math.random() * 50)}`,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    urgency: form.urgency || 'Medium', hasUpvoted: false, photo: form.photoDataUrl, description: form.description,
    statusLog: { 'Reported': new Date() },
  };
  state.issues = [newIssue, ...state.issues];
  state.submittedIssue = newIssue;
  renderSuccess();
  showView('success');
}

function renderSuccess() {
  const issue = state.submittedIssue;
  document.getElementById('success-issue-title').textContent = issue?.title || '';
  document.getElementById('success-civic-id').textContent    = issue?.civic_id || 'CP-2025-1049';
}

function handleBackToDashboard() {
  if (state.user) {
    state.user = { ...state.user, civicScore: (state.user.civicScore || 0) + 10, reports: (state.user.reports || 0) + 1 };
  }
  renderTopbar(true);
  renderDashboard();
  showView('dashboard');
  whenMapsReady(initDashboardMap);
}

function initAuthorityMap() {
  const el = document.getElementById('auth-map');
  if (!el || state.authMap) return;
  state.authMap = L.map('auth-map', { zoomControl: true }).setView([MAP_CENTER.lat, MAP_CENTER.lng], 10);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd', maxZoom: 19,
  }).addTo(state.authMap);
  document.getElementById('auth-map-loading').style.display = 'none';
  renderAuthMapMarkers();
}

function renderAuthMapMarkers() {
  if (!state.authMap) return;
  state.authMarkers = state.authMarkers || [];
  state.authMarkers.forEach(m => state.authMap.removeLayer(m));
  state.authMarkers = [];
  state.issues.forEach(issue => {
    if (!issue.latlng) return;
    const color = issue.status === 'Resolved' ? '#22c55e' : (CAT_COLORS[issue.category] || '#C9996B');
    const isSel = String(state.authSelectedId) === String(issue.id);
    const size  = isSel ? 20 : 13;
    const icon  = L.divIcon({
      className: '',
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`,
      iconSize: [size,size], iconAnchor: [size/2,size/2],
    });
    const marker = L.marker([issue.latlng.lat, issue.latlng.lng], { icon })
      .addTo(state.authMap)
      .bindPopup(`
        <div style="font-family:'DM Sans',sans-serif;min-width:180px">
          <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:4px">${issue.title}</div>
          <div style="font-size:10px;color:#64748b;margin-bottom:2px">📍 ${issue.location}</div>
          <div style="font-size:10px;color:#94a3b8;margin-bottom:6px">🏙️ ${issue.city || ''}</div>
          <div style="display:flex;gap:5px;align-items:center">
            ${statusBadge(issue.status)}${urgencyBadge(issue.urgency)}
            <span style="font-size:10px;color:#94a3b8">▲ ${issue.upvotes}</span>
          </div>
        </div>`, { offset: [0,-4] });
    marker.on('click', () => { authSelectIssue(issue.id); state.authMap.panTo([issue.latlng.lat, issue.latlng.lng]); });
    state.authMarkers.push(marker);
  });
}

function openAuthFullMap() {
  
  if (!document.getElementById('auth-fullmap-modal')) {
    const modal = document.createElement('div');
    modal.id = 'auth-fullmap-modal';
    modal.innerHTML = `
      <div id="auth-fullmap-inner">
        <div id="auth-fullmap-header">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:18px">🗺️</span>
            <span style="font-weight:700;font-size:15px;color:#fff;font-family:'Syne',sans-serif">Full Issue Map — Delhi NCR</span>
            <span style="font-size:11px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.6);padding:3px 10px;border-radius:20px">${state.issues.length} issues</span>
          </div>
          <button id="auth-fullmap-close" onclick="closeAuthFullMap()">✕ Close</button>
        </div>
        <div id="auth-fullmap-map"></div>
      </div>`;
    document.body.appendChild(modal);
  }

  const modal = document.getElementById('auth-fullmap-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  
  modal.onclick = function(e) { if (e.target === modal) closeAuthFullMap(); };

  
  if (!state.authFullMap) {
    setTimeout(() => {
      state.authFullMap = L.map('auth-fullmap-map', { zoomControl: true })
        .setView([MAP_CENTER.lat, MAP_CENTER.lng], 10);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 19,
      }).addTo(state.authFullMap);

      
      state.issues.forEach(issue => {
        if (!issue.latlng) return;
        const color = issue.status === 'Resolved' ? '#22c55e' : (CAT_COLORS[issue.category] || '#C9996B');
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`,
          iconSize: [14,14], iconAnchor: [7,7],
        });
        L.marker([issue.latlng.lat, issue.latlng.lng], { icon })
          .addTo(state.authFullMap)
          .bindPopup(`
            <div style="font-family:'DM Sans',sans-serif;min-width:200px;padding:4px 0">
              <div style="font-size:11px;color:#94a3b8;margin-bottom:3px">${issue.civic_id}</div>
              <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:5px">${issue.title}</div>
              <div style="font-size:11px;color:#64748b;margin-bottom:2px">📍 ${issue.location}</div>
              <div style="font-size:11px;color:#64748b;margin-bottom:8px">🏙️ ${issue.city || ''} · ▲ ${issue.upvotes} upvotes</div>
              <div style="display:flex;gap:5px;flex-wrap:wrap">${statusBadge(issue.status)}${urgencyBadge(issue.urgency)}</div>
            </div>`, { offset: [0, -6], maxWidth: 260 });
      });
    }, 60);
  } else {
    setTimeout(() => state.authFullMap.invalidateSize(), 60);
  }
}

function closeAuthFullMap() {
  const modal = document.getElementById('auth-fullmap-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

const GOVT_SYSTEMS = [
  { id: 'pgportal',  name: 'PG Portal (DARPG)',       url: 'https://pgportal.gov.in',       desc: 'Central public grievance portal — auto-escalates Unresolved issues > 15 days' },
  { id: 'ndmc',      name: 'NDMC Smart City',          url: 'https://www.ndmc.gov.in',       desc: 'New Delhi Municipal Council — Roads, Lighting, Drainage tickets' },
  { id: 'mcg',       name: 'MCG Gurugram',             url: 'https://mcg.gov.in',            desc: 'Municipal Corporation Gurugram — direct ward officer routing' },
  { id: 'nda',       name: 'Noida Authority',          url: 'https://www.noidaauthority.in', desc: 'Noida Development Authority — Water, Sewage, Roads' },
  { id: 'digilocker',name: 'DigiLocker',               url: 'https://digilocker.gov.in',     desc: 'Citizen identity verification via Aadhaar-linked DigiLocker' },
  { id: 'umang',     name: 'UMANG App API',            url: 'https://web.umang.gov.in',      desc: 'Unified Mobile Application for New-age Governance — push notifications' },
];

function showGovtIntegrations() {
  if (document.getElementById('govt-modal')) {
    document.getElementById('govt-modal').style.display = 'flex';
    return;
  }
  const rows = GOVT_SYSTEMS.map(s => `
    <div class="govt-row">
      <div class="govt-row-left">
        <div class="govt-name">${s.name}</div>
        <div class="govt-desc">${s.desc}</div>
        <div class="govt-url">${s.url}</div>
      </div>
      <div class="govt-row-right">
        <span class="govt-status-badge">✓ Configured</span>
        <button class="govt-test-btn" onclick="testGovtConnection('${s.id}',this)">Test Connection</button>
      </div>
    </div>`).join('');

  const modal = document.createElement('div');
  modal.id = 'govt-modal';
  modal.innerHTML = `
    <div id="govt-modal-inner">
      <div id="govt-modal-header">
        <div>
          <div style="font-weight:800;font-size:16px;color:#fff;font-family:'Syne',sans-serif">🏛️ Government System Integrations</div>
          <div style="font-size:11px;color:rgba(255,255,255,.45);margin-top:2px">Simulated connections — production requires official API credentials</div>
        </div>
        <button class="govt-close-btn" onclick="closeGovtModal()">✕ Close</button>
      </div>
      <div id="govt-modal-body">
        <div class="govt-notice">
          ⚠️ <strong>Demo Mode:</strong> CivicPulse simulates govt API calls. In production, each integration requires whitelisted IPs, ministry-issued OAuth2 tokens, and NIC-approved data formats (XML/JSON as per department spec).
        </div>
        <div id="govt-rows">${rows}</div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.onclick = e => { if (e.target === modal) closeGovtModal(); };
  modal.style.display = 'flex';
}

function closeGovtModal() {
  const m = document.getElementById('govt-modal');
  if (m) m.style.display = 'none';
}

function testGovtConnection(id, btn) {
  btn.textContent = '⏳ Testing…';
  btn.disabled = true;
  setTimeout(() => {
    
    btn.textContent = '✓ 200 OK';
    btn.style.background = 'rgba(34,197,94,.15)';
    btn.style.borderColor = 'rgba(34,197,94,.4)';
    btn.style.color = '#22c55e';
    setTimeout(() => {
      btn.textContent = 'Test Connection';
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 2500);
  }, 800 + Math.random() * 600);
}

function renderAuthority() {
  const { issues, authFilter } = state;
  const counts = {
    Reported:      issues.filter(i => i.status === 'Reported').length,
    Acknowledged:  issues.filter(i => i.status === 'Acknowledged').length,
    'In Progress': issues.filter(i => i.status === 'In Progress').length,
    Resolved:      issues.filter(i => i.status === 'Resolved').length,
  };
  document.getElementById('auth-stat-reported').textContent    = counts.Reported;
  document.getElementById('auth-stat-ack').textContent         = counts.Acknowledged;
  document.getElementById('auth-stat-inprogress').textContent  = counts['In Progress'];
  document.getElementById('auth-stat-resolved').textContent    = counts.Resolved;

  document.querySelectorAll('.auth-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === authFilter));

  const filtered = authFilter === 'All' ? issues : issues.filter(i => i.status === authFilter);
  const sorted   = sortIssues(filtered, state.authSortBy);
  const authSortEl = document.querySelector('#view-authority .sort-select');
  if (authSortEl) authSortEl.value = state.authSortBy;

  document.getElementById('auth-issue-list').innerHTML = sorted.map(issue => {
    const next = NEXT_STATUS[issue.status];
    return `<div class="auth-issue-item ${String(state.authSelectedId) === String(issue.id) ? 'selected' : ''}" onclick="authSelectIssue('${issue.id}')">
      <div class="auth-issue-top">
        <div class="auth-issue-meta">
          <div class="auth-issue-badges">${statusBadge(issue.status)}${urgencyBadge(issue.urgency)}</div>
          <div class="auth-issue-title">${issue.title}</div>
          <div class="auth-issue-loc">📍 ${issue.location} · 🏙️ ${issue.city || ''} · ▲ ${issue.upvotes}</div>
        </div>
        ${next ? `<button class="advance-btn" onclick="event.stopPropagation();authAdvance('${issue.id}')">→ ${next}</button>` : ''}
      </div>
    </div>`;
  }).join('');

  renderAuthMapMarkers();
  renderAuthDetail();
}

function setAuthFilter(filter) { state.authFilter = filter; renderAuthority(); }

function authSelectIssue(id) {
  state.authSelectedId = String(state.authSelectedId) === String(id) ? null : id;
  if (state.authSelectedId && state.authMap) {
    const issue = state.issues.find(i => String(i.id) === String(state.authSelectedId));
    if (issue?.latlng) state.authMap.panTo([issue.latlng.lat, issue.latlng.lng]);
  }
  renderAuthority();
}

function authAdvance(id) {
  state.issues = state.issues.map(i => {
    if (i.id !== id) return i;
    const ns = NEXT_STATUS[i.status];
    if (!ns) return i;
    const newLog = { ...(i.statusLog || {}), [ns]: new Date() };
    return { ...i, status: ns, statusLog: newLog };
  });
  renderAuthority();
}

function renderAuthDetail() {
  const issue = state.issues.find(i => String(i.id) === String(state.authSelectedId));
  const empty = document.getElementById('auth-detail-empty');
  const panel = document.getElementById('auth-detail-panel');
  if (!issue) { empty.style.display = 'flex'; panel.classList.remove('visible'); return; }
  empty.style.display = 'none';
  panel.classList.add('visible');
  document.getElementById('adh-id').textContent    = issue.civic_id;
  document.getElementById('adh-title').textContent = issue.title;
  document.getElementById('adh-badges').innerHTML  = statusBadge(issue.status) + urgencyBadge(issue.urgency);
  document.getElementById('adb-desc').textContent  = issue.description;
  document.getElementById('adb-meta').innerHTML    = `📍 ${issue.location}<br>🏙️ ${issue.city || 'Delhi NCR'}<br>👤 Reported by ${issue.reportedBy} · ${issue.date}<br>▲ ${issue.upvotes} community upvotes<br>🏷️ ${issue.category}`;
  const photoWrap = document.getElementById('adb-photo-wrap');
  const photoImg  = document.getElementById('adb-photo');
  if (issue.photo) { photoImg.src = issue.photo; photoWrap.style.display = 'block'; }
  else             { photoWrap.style.display = 'none'; }
  const next   = NEXT_STATUS[issue.status];
  const advBtn = document.getElementById('auth-advance-btn');
  if (next) { advBtn.style.display = 'block'; advBtn.textContent = `Mark as ${next} →`; advBtn.onclick = () => authAdvance(issue.id); }
  else       { advBtn.style.display = 'none'; }
  const curIdx = STATUS_ORDER.indexOf(issue.status);
  const log    = issue.statusLog || {};
  document.getElementById('audit-trail').innerHTML = STATUS_ORDER.slice(0, curIdx+1).map(s =>
    `<div class="audit-step">
      <div class="audit-dot"></div>
      <div><div class="audit-name">${s}</div><div class="audit-time">${log[s] ? fmtAuditTime(log[s]) : '—'} · System</div></div>
    </div>`
  ).join('');
}

let lbScope    = 'overall'; 
let lbWardFilter = 'all';

function setLbScope(scope) {
  lbScope = scope;
  
  document.querySelectorAll('.lb-scope-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.scope === scope);
  });
  
  const picker = document.getElementById('lb-ward-picker');
  picker.classList.toggle('hidden', scope !== 'ward');
  renderLeaderboard();
}

function setLbWard(ward) {
  lbWardFilter = ward;
  renderLeaderboard();
}

function renderLeaderboard() {
  const me = state.user;
  const podiumColors = ['#94a3b8','#C9996B','#cd7f32'];
  const podiumH      = [110, 145, 90];
  const medals       = ['🥈','🏆','🥉'];

  
  if (lbScope === 'personal') {
    document.getElementById('podium').innerHTML = '';
    document.getElementById('lb-personal-card').classList.remove('hidden');
    document.getElementById('lb-table').style.display = 'none';

    const myEntry = LEADERBOARD_DATA.find(p => p.name === me?.name) || {
      rank: 4, name: me?.name || 'You', ward: state.selectedWard || 'Ward 15',
      score: me?.civicScore || 0, reports: state.issues.filter(i => i.reportedBy === me?.name).length, resolved: 0
    };
    const nextEntry = LEADERBOARD_DATA.find(p => p.rank === myEntry.rank - 1);
    const nextScore = nextEntry ? nextEntry.score : myEntry.score;
    const pct = nextEntry ? Math.min(100, Math.round((myEntry.score / nextScore) * 100)) : 100;

    document.getElementById('lb-personal-card').innerHTML = `
      <div class="lbp-top">
        <div class="lbp-avatar">${(myEntry.name || 'U').charAt(0)}</div>
        <div>
          <div class="lbp-name">${myEntry.name}</div>
          <div class="lbp-ward">${myEntry.ward}</div>
        </div>
        <div class="lbp-rank-pill">${myEntry.rank <= 3 ? ['🥇','🥈','🥉'][myEntry.rank-1] : '#' + myEntry.rank} Overall</div>
      </div>
      <div class="lbp-stats">
        <div class="lbp-stat">
          <div class="lbp-stat-num" style="color:var(--accent)">${myEntry.score}</div>
          <div class="lbp-stat-lbl">Civic Score</div>
        </div>
        <div class="lbp-stat">
          <div class="lbp-stat-num">${myEntry.reports}</div>
          <div class="lbp-stat-lbl">Reports</div>
        </div>
        <div class="lbp-stat">
          <div class="lbp-stat-num" style="color:#22c55e">${myEntry.resolved}</div>
          <div class="lbp-stat-lbl">Resolved</div>
        </div>
      </div>
      ${nextEntry ? `
        <div class="lbp-progress-label">Progress to #${myEntry.rank - 1} (${nextEntry.name.split(' ')[0]}, ${nextScore} pts)</div>
        <div class="lbp-progress-track"><div class="lbp-progress-fill" style="width:${pct}%"></div></div>
        <div style="font-size:11px;color:var(--text4);margin-top:5px">${nextScore - myEntry.score} pts to next rank</div>
      ` : `<div style="font-size:12px;color:#f59e0b;font-weight:700">🎉 You're the top citizen!</div>`}
    `;
    document.getElementById('lb-rows').innerHTML = '';
    return;
  }

  // ── Overall / Ward scope ──
  document.getElementById('lb-personal-card').classList.add('hidden');
  document.getElementById('lb-table').style.display = '';

  let data = [...LEADERBOARD_DATA];

  if (lbScope === 'ward') {
    if (lbWardFilter !== 'all') {
      data = data.filter(p => p.ward === lbWardFilter);
    }
    // Re-rank after filter
    data = data.map((p, i) => ({ ...p, rank: i + 1 }));
  }

  // Podium (top 3 of filtered data)
  if (data.length >= 3) {
    const top3 = [data[1], data[0], data[2]];
    document.getElementById('podium').innerHTML = top3.map((p, i) => `
      <div class="podium-col">
        <div class="podium-name">${p.name.split(' ')[0]}</div>
        <div class="podium-score" style="color:${podiumColors[i]}">${p.score} pts</div>
        <div class="podium-bar" style="height:${podiumH[i]}px;background:${podiumColors[i]}">${medals[i]}</div>
      </div>`).join('');
  } else if (data.length > 0) {
    document.getElementById('podium').innerHTML = `
      <div style="text-align:center;padding:18px 0;color:var(--text4);font-size:13px">
        ${data.length === 1 ? '🏆 Only 1 citizen in this ward' : ''}
      </div>`;
  } else {
    document.getElementById('podium').innerHTML = `
      <div style="text-align:center;padding:18px 0;color:var(--text4);font-size:13px">No citizens in this ward yet.</div>`;
  }

  if (data.length === 0) {
    document.getElementById('lb-rows').innerHTML = `
      <div style="padding:28px;text-align:center;color:var(--text4);font-size:13px">No data for this filter.</div>`;
    return;
  }

  document.getElementById('lb-rows').innerHTML = data.map(p => {
    const isMe = p.name === me?.name;
    const rank = p.rank <= 3 ? ['🥇','🥈','🥉'][p.rank-1] : `#${p.rank}`;
    return `<div class="lb-row ${isMe ? 'me' : ''}">
      <div class="lb-rank ${p.rank <= 3 ? 'top' : ''}">${rank}</div>
      <div>
        <div class="lb-person-name">${p.name} ${isMe ? '<span class="lb-me-tag">← You</span>' : ''}</div>
        <div class="lb-ward">${p.ward}</div>
      </div>
      <div class="lb-score">${p.score}</div>
      <div class="lb-reports">${p.reports}</div>
      <div class="lb-resolved">${p.resolved}</div>
    </div>`;
  }).join('');
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('cp-theme');
  applyTheme(saved === 'dark');

  initCustomCursor();

  initLanding();
});
/* ═══════════════════════════════════════════════════════════════════════
   CivicPulse — Script Additions Patch
   Paste this code at the END of your existing script.js
   (or add <script src="script_additions.js"></script> after script.js)
   ═══════════════════════════════════════════════════════════════════════ */

// ─── INJECT AMBIENT LOGIN ELEMENTS ────────────────────────────────────────────
// Call this once when the login view is shown (already handled by showView)

function injectLoginAmbient() {
  const loginView = document.getElementById('view-login');
  if (!loginView || loginView._ambientInjected) return;
  loginView._ambientInjected = true;

  // Ambient orbs
  ['login-orb-1','login-orb-2','login-orb-3'].forEach(id => {
    if (!document.getElementById(id)) {
      const el = document.createElement('div');
      el.id = id;
      loginView.insertBefore(el, loginView.firstChild);
    }
  });

  // Scanline grid
  if (!document.getElementById('login-scanlines')) {
    const sl = document.createElement('div');
    sl.id = 'login-scanlines';
    loginView.insertBefore(sl, loginView.firstChild);
  }

  // Floating accent dots layer
  if (!document.getElementById('login-dots')) {
    const dotsLayer = document.createElement('div');
    dotsLayer.id = 'login-dots';
    const leftPanel = document.getElementById('login-left-panel');
    if (leftPanel) leftPanel.style.position = 'relative';
    loginView.insertBefore(dotsLayer, loginView.firstChild);

    // Spawn 12 static dots with randomised positions & timing
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('div');
      dot.className = 'ldot';
      const size = 3 + Math.random() * 5;
      const left = 5 + Math.random() * 55; // keep to left side
      const bottom = Math.random() * 80;
      const dur = 6 + Math.random() * 8;
      const delay = -(Math.random() * dur);
      dot.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${left}%; bottom: ${bottom}%;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
      `;
      dotsLayer.appendChild(dot);
    }
  }

  // Second logo pulse ring
  const logoWrap = loginView.querySelector('.login-logo');
  if (logoWrap && !logoWrap.querySelector('.logo-pulse-2')) {
    const ring2 = document.createElement('div');
    ring2.className = 'logo-pulse-2';
    logoWrap.appendChild(ring2);
  }
}

// ─── HOOK INTO showView ────────────────────────────────────────────────────────
// Wrap the existing showView to inject ambient elements whenever login is shown

(function() {
  const _orig = showView;
  window.showView = function(name) {
    _orig(name);
    if (name === 'login') {
      // Small delay so the DOM is ready
      setTimeout(injectLoginAmbient, 50);
    }
  };
})();

// ─── MAGNETIC INPUT LABELS ────────────────────────────────────────────────────
// Inputs in login-right subtly attract their label colour on focus

document.addEventListener('focusin', function(e) {
  if (e.target.closest('#login-right') && (e.target.tagName === 'INPUT')) {
    const grp = e.target.closest('.form-group');
    if (grp) grp.dataset.focused = '1';
  }
});
document.addEventListener('focusout', function(e) {
  if (e.target.closest('#login-right') && (e.target.tagName === 'INPUT')) {
    const grp = e.target.closest('.form-group');
    if (grp) delete grp.dataset.focused;
  }
});
// ═══════════════════════════════════════════════════════════════════════
// CIVIC REWARDS SHOP
// ═══════════════════════════════════════════════════════════════════════

const REWARDS = [
  // Collectibles — 50–300 pts
  { id: 'r01', name: 'CivicPulse Member Badge',        cat: 'Collectibles',   pts: 50,   img: 'images/2.png',  badge: 'hot',     desc: 'Official enamel keychain with the CivicPulse logo. A badge of civic pride!', stock: 120, delivery: 'Shipped to your address' },
  { id: 'r02', name: 'Ward Hero Sticker Pack',      cat: 'Collectibles',   pts: 75,   img: 'images/29.png',  badge: 'new',     desc: '12 holographic stickers featuring NCR landmarks and civic icons.', stock: 85,  delivery: 'Digital download link' },
  { id: 'r03', name: 'CivicPulse Tote Bag',         cat: 'Collectibles',   pts: 100,  img: 'images/1.png',  badge: 'popular', desc: 'Eco-canvas tote with "My Ward, My Pride" artwork. Sturdy, reusable, stylish.', stock: 40,  delivery: 'Shipped to your address' },
  { id: 'r04', name: 'Civic Champion Badge',         cat: 'Collectibles',   pts: 150,  img: 'images/28.png',  badge: 'limited', desc: 'Premium metal badge awarded to top reporters. Display it on your profile.', stock: 15,  delivery: 'Shipped to your address' },

  // Food & Drink — 100–500 pts
  { id: 'r05', name: '₹100 Zomato Voucher',         cat: 'Food & Drink',   pts: 500,  img: 'images/5.png',  badge: 'hot',     desc: 'Valid on orders above ₹300. Use at any restaurant on Zomato in Delhi NCR.', stock: 200, delivery: 'Voucher code via email' },
  { id: 'r06', name: 'Chai Pe Charcha Voucher',      cat: 'Food & Drink',   pts: 500,  img: 'images/6.png',  badge: 'new',     desc: '2 free cutting chais + 1 samosa at any CPC outlet near you.', stock: 150, delivery: 'QR code via email' },
  { id: 'r07', name: '₹200 Swiggy Credit',          cat: 'Food & Drink',   pts: 1000,  img: 'images/7.png',  badge: null,      desc: 'Swiggy wallet credit. Valid 30 days from issue date.', stock: 100, delivery: 'Applied to your Swiggy account' },
  { id: 'r08', name: 'McDonald\'s Meal for Two',     cat: 'Food & Drink',   pts: 1000,  img: 'images/8.png',  badge: 'popular', desc: '2 McVeggie Meals with fries and drinks at any McDonald\'s NCR outlet.', stock: 60,  delivery: 'Voucher code via email' },
  { id: 'r09', name: '₹500 Restaurant Gift Card',   cat: 'Food & Drink',   pts: 1500,  img: 'images/9.png',  badge: 'limited', desc: 'Redeemable at 200+ partner restaurants across Delhi, Gurugram & Noida.', stock: 25,  delivery: 'Physical card delivered' },

  
  { id: 'r10', name: 'Metro Day Pass',              cat: 'Transport',      pts: 150,  img: 'images/10.png', badge: null,      desc: 'One-day unlimited travel on Delhi Metro (all lines). Valid for 30 days from issue.', stock: 300, delivery: 'Digital QR code via email' },
  { id: 'r11', name: '₹150 Rapido Credit',         cat: 'Transport',      pts: 150,  img: 'images/11.png', badge: 'new',     desc: 'Wallet credit for Rapido bike, cab, or auto rides in NCR.', stock: 180, delivery: 'Applied to your Rapido account' },
  { id: 'r12', name: '3-Day Metro Pass',            cat: 'Transport',      pts: 300,  img: 'images/12.png', badge: 'popular', desc: 'Unlimited metro travel for 3 consecutive days. Great for visitors!', stock: 80,  delivery: 'Digital QR code via email' },
  { id: 'r13', name: '₹500 Ola Cab Credit',        cat: 'Transport',      pts: 500,  img: 'images/13.png', badge: null,      desc: 'Ola cab wallet credit. Valid on mini, sedan, and prime categories.', stock: 50,  delivery: 'Applied to your Ola account' },
  { id: 'r14', name: 'Monthly Bus Pass Subsidy',    cat: 'Transport',      pts: 800,  img: 'images/14.png', badge: 'limited', desc: '50% subsidy on DTC or Gurugram City Bus monthly pass. Applied on purchase.', stock: 10,  delivery: 'Voucher code via email' },

  
  { id: 'r15', name: 'BookMyShow ₹200 Voucher',    cat: 'Entertainment',  pts: 500,  img: 'images/15.png', badge: 'hot',     desc: 'For movies, events, or sports tickets on BookMyShow. Valid 60 days.', stock: 120, delivery: 'Voucher code via email' },
  { id: 'r16', name: 'Gaming Zone 2-Hour Pass',    cat: 'Entertainment',  pts: 250,  img: 'images/16.png', badge: 'new',     desc: 'Play unlimited at Fun City or Smaaash — select NCR outlets. Weekday only.', stock: 70,  delivery: 'QR code via email' },
  { id: 'r17', name: 'ZEE5 1-Month Premium',       cat: 'Entertainment',  pts: 400,  img: 'images/17.png', badge: null,      desc: 'Access to ZEE5 Premium including Originals, movies, and live TV for 30 days.', stock: 90,  delivery: 'Activation code via email' },
  { id: 'r18', name: 'Amazon Music 3 Months',      cat: 'Entertainment',  pts: 800,  img: 'images/18.png', badge: 'popular', desc: 'Prime Video, Prime Music, and free next-day delivery for 3 months.', stock: 35,  delivery: 'Gift code via email' },
  { id: 'r19', name: 'Amusement Park Family Pass', cat: 'Entertainment',  pts: 1200, img: 'images/19.png', badge: 'limited', desc: 'Entry for a family of 4 to Worlds of Wonder, Noida or Appu Ghar, Delhi.', stock: 20,  delivery: 'Tickets courier-delivered' },
  { id: 'r20', name: 'Delhi NCR Cricket Match Tickets', cat: 'Entertainment', pts: 2000, img: 'images/20.png', badge: 'hot', desc: '2 premium stand tickets to an IPL or Ranji Trophy match at Feroz Shah Kotla. Rare reward!', stock: 8, delivery: 'Physical tickets courier-delivered' },

  
  { id: 'r21', name: 'Yoga Class Drop-in',         cat: 'Wellness',       pts: 150,  img: 'images/21.png', badge: null,      desc: 'One free drop-in class at any partnered yoga or meditation studio in NCR.', stock: 100, delivery: 'QR code via email' },
  { id: 'r22', name: '₹300 PharmEasy Credit',     cat: 'Wellness',       pts: 300,  img: 'images/22.png', badge: 'new',     desc: 'PharmEasy wallet credit for medicines, health devices, or lab tests.', stock: 60,  delivery: 'Applied to your account' },
  { id: 'r23', name: '1-Month Gym Membership',     cat: 'Wellness',       pts: 600,  img: 'images/23.png', badge: 'popular', desc: 'Monthly membership at Cult Fit or Gold\'s Gym — NCR centres. No registration fee.', stock: 30,  delivery: 'Membership code via email' },
  { id: 'r24', name: 'Annual Health Checkup',      cat: 'Wellness',       pts: 1000, img: 'images/24.png', badge: 'limited', desc: 'Complete blood panel + ECG + BMI assessment at Thyrocare or Dr Lal PathLabs.', stock: 15,  delivery: 'Booking link via email' },

  
  { id: 'r25', name: 'Tree Planted in Your Name',  cat: 'Eco',            pts: 75,   img: 'images/25.png', badge: 'new',     desc: 'We plant a tree in a Delhi NCR green belt and send you a certificate with GPS coordinates.', stock: 500, delivery: 'Certificate via email' },
  { id: 'r26', name: 'Cloth Bag Bundle (5 bags)',  cat: 'Eco',            pts: 450,  img: 'images/26.png', badge: null,      desc: '5 reusable jute shopping bags printed with civic awareness messages.', stock: 200, delivery: 'Shipped to your address' },
  { id: 'r27', name: 'Solar Lantern',              cat: 'Eco',            pts: 3000,  img: 'images/27.png', badge: 'popular', desc: 'Compact foldable solar-charged lantern — useful for power cuts and camping.', stock: 45,  delivery: 'Shipped to your address' },
  { id: 'r28', name: 'Rooftop Garden Starter Kit', cat: 'Eco',            pts: 5000,  img: 'images/4.png', badge: 'limited', desc: 'Grow 5 vegetables at home: seeds, pots, soil, fertilizer, and a care guide.', stock: 22,  delivery: 'Shipped to your address' },
];

state.shopCat    = 'All';
state.shopOrders = [];   

function setShopCat(cat) {
  state.shopCat = cat;
  document.querySelectorAll('.shop-tab').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  renderShopGrid();
}

function renderShop() {
  const pts = state.user?.civicScore || 0;
  document.getElementById('shop-bal-num').textContent = pts.toLocaleString();
  renderShopGrid();
  renderShopOrders();
}

function renderShopGrid() {
  const pts  = state.user?.civicScore || 0;
  const cat  = state.shopCat;
  const list = cat === 'All' ? REWARDS : REWARDS.filter(r => r.cat === cat);
  const grid = document.getElementById('shop-grid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<div class="shop-empty"><div class="shop-empty-icon">🛒</div><h3>Nothing here yet</h3><p>More rewards coming soon!</p></div>`;
    return;
  }

  grid.innerHTML = list.map(r => {
    const canAfford = pts >= r.pts;
    const badgeHTML = r.badge ? `<span class="reward-badge rb-${r.badge}">${r.badge}</span>` : '';
    const lowStock  = r.stock < 20;
    const stockHTML = `<div class="reward-stock"><span class="stock-dot${lowStock ? ' low' : ''}"></span>${r.stock > 50 ? 'In stock' : `Only ${r.stock} left`}</div>`;
    const btnHTML   = canAfford
      ? `<button class="redeem-btn" onclick="openRedeemModal('${r.id}')">Redeem</button>`
      : `<button class="redeem-btn locked-btn" title="Need ${r.pts - pts} more points">🔒 ${r.pts - pts} more</button>`;
    return `
      <div class="reward-card ${!canAfford ? 'locked' : ''}">
        ${badgeHTML}
        <div class="reward-img"><img src="${r.img}" alt="${r.name}" loading="lazy" /></div>
        <div class="reward-info">
          <div class="reward-cat">${r.cat}</div>
          <div class="reward-name">${r.name}</div>
          <div class="reward-desc">${r.desc}</div>
          ${stockHTML}
          <div class="reward-footer">
            <div class="reward-pts"><span class="reward-pts-icon">⚡</span>${r.pts.toLocaleString()} pts</div>
            ${btnHTML}
          </div>
        </div>
      </div>`;
  }).join('');
}

function renderShopOrders() {
  const el = document.getElementById('shop-orders-list');
  if (!el) return;
  if (!state.shopOrders.length) {
    el.innerHTML = `<div class="order-empty">No orders yet. Redeem a reward to get started! 🎁</div>`;
    return;
  }
  el.innerHTML = state.shopOrders.map(o => {
    const statusCls = { Processing: 'os-processing', Shipped: 'os-shipped', Delivered: 'os-delivered' }[o.status] || 'os-processing';
    return `<div class="order-row">
      <div class="order-emoji"><img src="${o.reward.img}" alt="${o.reward.name}" /></div>
      <div class="order-info">
        <div class="order-name">${o.reward.name}</div>
        <div class="order-meta">Ordered ${o.date} · Token: <strong>${o.token}</strong></div>
      </div>
      <div class="order-pts">-${o.reward.pts.toLocaleString()} pts</div>
      <span class="order-status ${statusCls}">${o.status}</span>
    </div>`;
  }).join('');
}

function openRedeemModal(rewardId) {
  const r   = REWARDS.find(x => x.id === rewardId);
  const pts = state.user?.civicScore || 0;
  if (!r || pts < r.pts) return;
  const after = pts - r.pts;
  const overlay = document.getElementById('redeem-modal-overlay');
  const modal   = document.getElementById('redeem-modal');
  modal.innerHTML = `
    <div class="rm-header">
      <h3>Redeem Reward</h3>
      <button class="rm-close" onclick="closeRedeemModal()">×</button>
    </div>
    <div class="rm-body">
      <div class="rm-product">
        <div class="rm-emoji"><img src="${r.img}" alt="${r.name}" /></div>
        <div class="rm-product-info">
          <h4>${r.name}</h4>
          <p>${r.desc}</p>
          <div class="rm-pts-cost">
            <span class="rm-pts-num">${r.pts}</span>
            <span class="rm-pts-label">Civic Points</span>
          </div>
        </div>
      </div>
      <div class="rm-balance-note">
        <span>Balance after redemption:</span>
        <span class="rm-bal-after">⚡ ${after.toLocaleString()} pts</span>
      </div>
      <div class="rm-field">
        <label>Full Name *</label>
        <input id="rm-name" type="text" placeholder="e.g. Paras Jain" value="${state.user?.name || ''}" />
      </div>
      <div class="rm-field">
        <label>Email Address *</label>
        <input id="rm-email" type="email" placeholder="paras@example.com" />
      </div>
      ${r.delivery.includes('Shipped') || r.delivery.includes('courier') ? `
      <div class="rm-field">
        <label>Delivery Address *</label>
        <textarea id="rm-address" placeholder="House no., street, landmark, city, PIN code…"></textarea>
      </div>` : ''}
      <div class="rm-field">
        <label>Phone Number</label>
        <input id="rm-phone" type="tel" placeholder="+91 98765 43210" />
      </div>
      <div style="font-size:11px;color:var(--text4);margin-bottom:14px;line-height:1.6">
        📦 <strong>Delivery:</strong> ${r.delivery} · Expected within 3–5 working days.
      </div>
      <button class="rm-submit-btn" onclick="submitRedeem('${r.id}')">Confirm Redemption 🎉</button>
    </div>`;
  overlay.classList.add('open');
}

function submitRedeem(rewardId) {
  const nameEl = document.getElementById('rm-name');
  const emailEl = document.getElementById('rm-email');
  if (!nameEl?.value.trim() || !emailEl?.value.trim()) {
    alert('Please fill in your name and email to continue.');
    return;
  }
  const r = REWARDS.find(x => x.id === rewardId);
  if (!r) return;

  
  if (state.user) state.user.civicScore = (state.user.civicScore || 0) - r.pts;
  r.stock = Math.max(0, r.stock - 1);

  
  const token = 'CP' + Math.random().toString(36).slice(2,8).toUpperCase();

  
  const order = {
    id: Date.now(), reward: r, token,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'Processing',
  };
  state.shopOrders.unshift(order);

  
  const modal = document.getElementById('redeem-modal');
  modal.innerHTML = `
    <div class="rm-header">
      <h3>Redemption Confirmed!</h3>
      <button class="rm-close" onclick="closeRedeemModal()">×</button>
    </div>
    <div class="rm-success">
      <div class="rm-success-icon"><img src="${r.img}" alt="${r.name}" /></div>
      <h3>You've claimed it!</h3>
      <p>Your <strong>${r.name}</strong> is being processed. Details will be sent to your email within 24 hours.</p>
      <div class="rm-token-box">
        <div class="rm-token-label">Your Order Token</div>
        <div class="rm-token-code">${token}</div>
      </div>
      <p style="font-size:12px;color:var(--text4)">Save this token. Remaining balance: ⚡ ${(state.user?.civicScore || 0).toLocaleString()} pts</p>
      <button class="rm-done-btn" onclick="closeRedeemModal()">Done! Return to Shop</button>
    </div>`;

  
  renderTopbar(true);
  document.getElementById('shop-bal-num').textContent = (state.user?.civicScore || 0).toLocaleString();
  renderShopGrid();
  renderShopOrders();
}

function closeRedeemModal(e) {
  if (e && e.target !== document.getElementById('redeem-modal-overlay')) return;
  document.getElementById('redeem-modal-overlay').classList.remove('open');
}

function setAuthMode(mode) {
  
  state.authMode = mode;
  const isSignup = mode === 'signup';

  
  const nameGroup = document.getElementById('name-group');
  if (nameGroup) nameGroup.style.display = isSignup ? 'block' : 'none';

  
  const confirmGroup = document.getElementById('confirm-pw-group');
  if (confirmGroup) confirmGroup.style.display = isSignup ? 'block' : 'none';

  
  const signinBtn = document.getElementById('mode-signin');
  const signupBtn = document.getElementById('mode-signup');
  if (signinBtn) signinBtn.classList.toggle('active', !isSignup);
  if (signupBtn) signupBtn.classList.toggle('active',  isSignup);

  
  const titleEl = document.getElementById('auth-mode-title');
  const subtitleEl = document.getElementById('auth-mode-subtitle');
  const noteEl  = document.getElementById('auth-mode-note');
  const btnEl   = document.getElementById('login-btn');

  if (titleEl)    titleEl.textContent    = isSignup ? 'Create Account'                   : 'Sign In';
  if (subtitleEl) subtitleEl.textContent = isSignup ? 'Join CivicPulse today — it\'s free' : 'Welcome back — select your portal';
  if (noteEl) {
    if (isSignup) {
      noteEl.innerHTML = 'Already have an account? <a href="#" onclick="setAuthMode(\'signin\');return false;" style="color:var(--accent);text-decoration:none">Sign in</a>';
    } else {
      noteEl.innerHTML = 'New here? <a href="#" onclick="setAuthMode(\'signup\');return false;" style="color:var(--accent);text-decoration:none">Create an account</a>';
    }
  }
  if (btnEl) {
    const tab = state.loginTab || 'citizen';
    if (isSignup) {
      btnEl.textContent = 'Create Account →';
    } else {
      btnEl.textContent = tab === 'authority' ? 'Access Authority Panel →' : 'Access Citizen Portal →';
    }
  }

  clearLoginError();
}

function toggleConfirmPassword() {
  const inp = document.getElementById('login-password-confirm');
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}

if (typeof state !== 'undefined') {
  state.authMode = 'signin';
}