

'use strict';

let _realtimeSubscription = null;
function _startRealtimeUpdates() {
  if (_realtimeSubscription) return;
  _realtimeSubscription = sbSubscribeToStatusUpdates(updatedIssue => {
    state.issues = state.issues.map(i =>
      i.id === updatedIssue.id ? { ...i, status: updatedIssue.status } : i
    );
    if (state.view === 'dashboard') renderDashboard();
    if (state.view === 'authority') renderAuthority();
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  if (typeof initApp === 'function') initApp();

  
  
  if (sessionStorage.getItem('cp_active') !== '1') {
    await _sb.auth.signOut();   
    return;
  }

  const profile = await sbGetCurrentUser();
  if (!profile) { sessionStorage.removeItem('cp_active'); return; }

  state.user = _profileToStateUser(profile);
  document.body.classList.add('logged-in');

  const issues = await sbFetchReports();
  state.issues = issues;

  _startRealtimeUpdates();
  _startProfileSubscription();   

  if (profile.role === 'authority') {
    renderAuthority();
    showView('authority');
    whenMapsReady(initAuthorityMap);
    const ahName = document.getElementById('ah-name-display');
    if (ahName) ahName.textContent = `${profile.name} · ${profile.ward}`;
  } else {
    renderTopbar(true);
    renderDashboard();
    showView('dashboard');
    whenMapsReady(initDashboardMap);
  }
});

async function handleLogin() {
  const isSignup = state.authMode === 'signup';
  const name     = (document.getElementById('login-name')?.value    || '').trim();
  const email    = (document.getElementById('login-email')?.value   || '').trim();
  const password =  document.getElementById('login-password')?.value || '';

  
  if (!email || !password) { showLoginError('Please enter email and password.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showLoginError('Invalid email address.'); return; }

  
  if (isSignup) {
    if (!name)                         { showLoginError('Please enter your name.'); return; }
    if (!/[A-Z]/.test(password))       { showLoginError('Password needs an uppercase letter.'); return; }
    if (!/[a-z]/.test(password))       { showLoginError('Password needs a lowercase letter.'); return; }
    if (!/[0-9]/.test(password))       { showLoginError('Password needs a number.'); return; }
    if (!/[^A-Za-z0-9]/.test(password)){ showLoginError('Password needs a special character (@, #, ! …)'); return; }
  }

  clearLoginError();

  const btn = document.getElementById('login-btn');
  const tab  = state.loginTab || 'citizen';
  const ward = state.selectedWard || 'Ward 1';

  if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }

  const resetBtn = () => {
    if (btn) {
      btn.disabled = false;
      btn.textContent = tab === 'authority' ? 'Access Authority Panel →' : 'Access Citizen Portal →';
    }
  };

  try {
    let authUser  = null;
    let profile   = null;
    let errorMsg  = null;

    
    const { data: signInData, error: signInErr } = await _sb.auth.signInWithPassword({ email, password });

    if (!signInErr && signInData?.user) {
      
      authUser = signInData.user;

    } else {
      const msg = (signInErr?.message || '').toLowerCase();

      if (msg.includes('email not confirmed')) {
        
        resetBtn();
        showLoginError('Please confirm your email first. Check your inbox for a confirmation link, or disable email confirmation in your Supabase dashboard (Auth → Providers → Email → uncheck "Confirm email").');
        return;
      }

      if (msg.includes('invalid login credentials') || msg.includes('user not found') || msg.includes('no user')) {
        if (isSignup) {
          
          if (btn) btn.textContent = 'Creating account…';
          const { data: signUpData, error: signUpErr } = await _sb.auth.signUp({
            email, password,
            options: { data: { name, role: tab, ward } },
          });

          if (signUpErr) {
            errorMsg = signUpErr.message.includes('already registered')
              ? 'This email is already registered. Please sign in instead.'
              : (signUpErr.message || 'Registration failed.');
          } else if (signUpData?.user) {
            authUser = signUpData.user;
          } else {
            
            resetBtn();
            showLoginError('Account created! Please check your email for a confirmation link before signing in.');
            return;
          }
        } else {
          
          resetBtn();
          showLoginError('No account found with this email. Please create an account first by clicking “Sign Up”.');
          return;
        }
      } else {
        errorMsg = signInErr?.message || 'Login failed. Please try again.';
      }
    }

    if (errorMsg) { resetBtn(); showLoginError(errorMsg); return; }
    if (!authUser) { resetBtn(); showLoginError('Something went wrong. Please try again.'); return; }

    
    
    profile = await _fetchProfile(authUser.id);
    if (!profile) {
      await new Promise(r => setTimeout(r, 1000));
      profile = await _fetchProfile(authUser.id);
    }
    if (!profile) {
      
      const { data: newProfile } = await _sb
        .from('profiles')
        .upsert({ id: authUser.id, name, email, role: tab, ward, civic_score: 0, reports_count: 0 })
        .select().single();
      profile = newProfile;
    }

    if (!profile) { resetBtn(); showLoginError('Could not load your profile. Please try again.'); return; }

    
    if (profile.role !== tab || profile.ward !== ward) {
      await _sb.from('profiles').update({ role: tab, ward }).eq('id', profile.id);
      profile = { ...profile, role: tab, ward };
    }

    
    sessionStorage.setItem('cp_active', '1');
    state.user = _profileToStateUser(profile);
    document.body.classList.add('logged-in');

    const issues = await sbFetchReports();
    state.issues = issues;

    _startRealtimeUpdates();

    
    _startProfileSubscription();

    resetBtn();

    if (profile.role === 'authority') {
      const ahName = document.getElementById('ah-name-display');
      if (ahName) ahName.textContent = `${profile.name} · ${profile.ward}`;
      renderAuthority();
      showView('authority');
      whenMapsReady(initAuthorityMap);
    } else {
      renderTopbar(true);
      renderDashboard();
      showView('dashboard');
      whenMapsReady(initDashboardMap);
    }

  } catch (err) {
    console.error('[CivicPulse] handleLogin error:', err);
    resetBtn();
    showLoginError('An unexpected error occurred: ' + (err.message || err));
  }
}

async function handleLogout() {
  _stopProfileSubscription();   
  sessionStorage.removeItem('cp_active');
  await sbSignOut();
  document.body.classList.remove('logged-in');
  state.user          = null;
  state.issues        = [];
  state.selectedIssueId = null;
  state.dashMap       = null;
  state.dashMarkers   = [];
  state.authMap       = null;
  state.authMarkers   = [];
  state.submitMap     = null;
  state.submitMarker  = null;
  showView('landing');
}

async function handleSubmitIssue() {
  if (!state.user) return;

  const btn = document.querySelector('#submit-card .btn-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

  
  const profile = await sbGetCurrentUser();
  if (!profile) {
    if (btn) { btn.disabled = false; btn.textContent = 'Submit Report'; }
    alert('Session expired. Please log in again.');
    handleLogout();
    return;
  }

  const { issue, error } = await sbSubmitReport(state.submitForm, profile);

  if (btn) { btn.disabled = false; btn.textContent = 'Submit Report'; }

  if (error) {
    alert('Failed to submit report: ' + (error.message || 'Unknown error'));
    return;
  }

  
  state.issues        = [issue, ...state.issues];
  state.submittedIssue = issue;

  
  const refreshed = await sbGetCurrentUser();
  if (refreshed) {
    state.user = _profileToStateUser(refreshed);
    renderTopbar(true);
  }

  renderSuccess();
  showView('success');
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function authAdvance(id) {
  const issue = state.issues.find(i => i.id == id);   
  if (!issue) return;

  const newStatus = NEXT_STATUS[issue.status];
  if (!newStatus) return;

  
  const prevState  = issue.status;
  const prevLog    = issue.statusLog;
  state.issues = state.issues.map(i => {
    if (i.id != id) return i;
    const newLog = { ...(i.statusLog || {}), [newStatus]: new Date() };
    return { ...i, status: newStatus, statusLog: newLog };
  });
  renderAuthority();

  
  
  
  if (!UUID_RE.test(String(id))) {
    
    return;
  }

  
  const profile = await sbGetCurrentUser();
  if (!profile) return;

  const { ok, error } = await sbAdvanceStatus(id, newStatus, profile);
  if (!ok) {
    
    console.error('Status advance failed:', error);
    state.issues = state.issues.map(i =>
      i.id == id ? { ...i, status: prevState, statusLog: prevLog } : i
    );
    renderAuthority();
    alert('Could not update status: ' + (error?.message || 'Unknown error'));
  }
}

function authSelectIssue(id) {
  
  state.authSelectedId = (String(state.authSelectedId) === String(id)) ? null : id;

  if (state.authSelectedId && state.authMap) {
    const issue = state.issues.find(i => String(i.id) === String(id));
    if (issue?.latlng) state.authMap.panTo([issue.latlng.lat, issue.latlng.lng]);
  }

  renderAuthority();

  
  if (state.authSelectedId && UUID_RE.test(String(state.authSelectedId))) {
    loadStatusHistory(state.authSelectedId);
  }
}

async function toggleUpvote(reportId) {
  if (!state.user) return;

  const issue = state.issues.find(i => i.id == reportId);
  if (!issue) return;

  
  const wasUpvoted = issue.hasUpvoted;
  state.issues = state.issues.map(i => {
    if (i.id != reportId) return i;
    return {
      ...i,
      upvotes:    i.upvotes + (wasUpvoted ? -1 : 1),
      hasUpvoted: !wasUpvoted,
    };
  });
  renderDashboard();

  
  const profile = await sbGetCurrentUser();
  if (!profile) return;

  const { upvotes, hasUpvoted, error } = await sbToggleUpvote(reportId, profile.id, wasUpvoted);
  if (error) {
    
    state.issues = state.issues.map(i => {
      if (i.id != reportId) return i;
      return { ...i, upvotes: issue.upvotes, hasUpvoted: wasUpvoted };
    });
    renderDashboard();
  } else {
    
    state.issues = state.issues.map(i =>
      i.id == reportId ? { ...i, upvotes, hasUpvoted } : i
    );
  }
}

async function loadLandingStats() {
  const { total, rate, citizens } = await sbFetchLandingStats();
  const issueEl    = document.getElementById('cnt-issues');
  const rateEl     = document.getElementById('cnt-rate');
  const citizensEl = document.getElementById('cnt-citizens');
  if (issueEl)    _animateCount(issueEl,    total);
  if (rateEl)     _animateCount(rateEl,     rate,    '%');
  if (citizensEl) _animateCount(citizensEl, Math.floor(citizens / 1000), 'K+');
}

function _animateCount(el, target, suffix = '') {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 30);
}

async function loadLeaderboardData(ward = null) {
  const rows = await sbFetchLeaderboard(ward);
  
  window._lbData = rows;   
  if (typeof renderLeaderboard === 'function') renderLeaderboard();
}

async function loadStatusHistory(reportId) {
  const history = await sbFetchStatusHistory(reportId);

  
  const logMap = {};
  history.forEach(h => { logMap[h.status] = new Date(h.changed_at); });

  
  state.issues = state.issues.map(i =>
    i.id === reportId ? { ...i, statusLog: logMap } : i
  );

  
  if (state.authSelectedId === reportId && typeof renderAuthDetail === 'function') {
    renderAuthDetail();
  }
}

function setLoginTab(tab) {
  state.loginTab = tab;   

  
  document.querySelectorAll('.tab-switcher button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.textContent = tab === 'authority'
      ? 'Access Authority Panel →'
      : 'Access Citizen Portal →';
  }
}

function _profileToStateUser(profile) {
  return {
    id:          profile.id,
    name:        profile.name || (profile.email ? profile.email.split('@')[0] : 'User'),
    email:       profile.email,
    role:        profile.role,
    ward:        profile.ward,
    civicScore:  profile.civic_score   || 0,
    reports:     profile.reports_count || 0,
    resolved:    0,
    designation: profile.role === 'authority' ? 'Ward Officer' : undefined,
  };
}

async function confirmRedeem() {
  const r = state.pendingReward;
  if (!r) return;

  const pts = state.user?.civicScore || 0;
  if (pts < r.pts) { alert('Not enough points!'); return; }

  
  const details = {
    address: document.getElementById('rm-address')?.value?.trim() || null,
    phone:   document.getElementById('rm-phone')?.value?.trim()   || null,
    notes:   document.getElementById('rm-notes')?.value?.trim()   || null,
  };

  
  const profileForOrder = {
    id:          state.user.id,
    name:        state.user.name,
    civic_score: state.user.civicScore || 0,
  };

  const { order, token, error } = await sbPlaceOrder(r, profileForOrder, details);

  if (error) {
    console.error('Order failed:', error);
    alert('Could not place order. Please try again.');
    return;
  }

  
  state.user.civicScore = Math.max(0, (state.user.civicScore || 0) - r.pts);
  r.stock = Math.max(0, r.stock - 1);

  
  state.shopOrders.unshift({
    id:     order?.id || Date.now(),
    reward: r,
    token,
    date:   new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'Processing',
  });

  
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

const _origRenderShop = typeof renderShop === 'function' ? renderShop : null;
async function renderShop() {
  
  if (_origRenderShop) _origRenderShop();

  
  if (state.user?.id) {
    const orders = await sbFetchOrders();
    
    state.shopOrders = orders.map(o => ({
      id:     o.id,
      reward: {
        id:   o.rewardId,
        name: o.rewardName,
        img:  o.rewardImg  || '',
        pts:  o.pts,
        cat:  o.rewardCat  || '',
      },
      token:  o.token,
      date:   o.date,
      status: o.status,
    }));
    if (typeof renderShopOrders === 'function') renderShopOrders();
  }
}

state.grantSelectedUser = null;   
state.grantPts          = 0;
state.grantCitizensList = [];     

function toggleGrantPanel() {
  const body  = document.getElementById('gp-body');
  const label = document.getElementById('gp-toggle-label');
  const open  = body.style.display === 'none' || body.style.display === '';
  body.style.display = open ? 'flex' : 'none';
  label.textContent  = open ? 'Collapse' : 'Expand';
  if (open) loadGrantCitizens();
}

async function loadGrantCitizens() {
  
  const list = await sbFetchCitizens();
  state.grantCitizensList = list;
}

function filterGrantCitizens(query) {
  const dd = document.getElementById('gp-citizen-dropdown');
  const q  = (query || '').toLowerCase().trim();

  if (!q) { dd.classList.add('hidden'); return; }

  const matches = state.grantCitizensList.filter(c =>
    c.name.toLowerCase().includes(q) || (c.ward || '').toLowerCase().includes(q)
  ).slice(0, 10);

  if (!matches.length) {
    dd.innerHTML = '<div class="gp-dropdown-empty">No citizens found</div>';
  } else {
    dd.innerHTML = matches.map(c => `
      <div class="gp-dropdown-item" onclick="selectGrantCitizen('${c.id}')">
        <div>
          <div class="gp-dropdown-item-name">${c.name}</div>
          <div class="gp-dropdown-item-meta">${c.ward || 'Unknown ward'}</div>
        </div>
        <div class="gp-dropdown-item-meta">⚡ ${(c.civicScore || 0).toLocaleString()} pts</div>
      </div>`
    ).join('');
  }
  dd.classList.remove('hidden');
}

function selectGrantCitizen(id) {
  const c = state.grantCitizensList.find(u => u.id === id);
  if (!c) return;

  state.grantSelectedUser = c;

  
  document.getElementById('gp-citizen-search').value = c.name;
  document.getElementById('gp-citizen-dropdown').classList.add('hidden');

  
  const card = document.getElementById('gp-selected-card');
  card.classList.remove('hidden');
  document.getElementById('gp-sel-avatar').textContent = (c.name || '?').charAt(0).toUpperCase();
  document.getElementById('gp-sel-name').textContent   = c.name;
  document.getElementById('gp-sel-meta').textContent   = `${c.ward || 'Unknown ward'} · ${c.email || ''}`;
  document.getElementById('gp-sel-score').textContent  = (c.civicScore || 0).toLocaleString();

  _updateGrantBtn();
}

function setGrantPts(n) {
  state.grantPts = n;
  document.getElementById('gp-pts-input').value = n;
  document.querySelectorAll('.gp-pts-preset').forEach(b => {
    b.classList.toggle('active', parseInt(b.textContent.replace('+','')) === n);
  });
  _updateGrantBtn();
}

function _updateGrantBtn() {
  const btn = document.getElementById('gp-submit-btn');
  const pts = state.grantPts || parseInt(document.getElementById('gp-pts-input')?.value) || 0;
  btn.disabled = !(state.grantSelectedUser && pts > 0);
}

async function handleGrantPoints() {
  const citizen = state.grantSelectedUser;
  const pts     = state.grantPts || parseInt(document.getElementById('gp-pts-input').value) || 0;
  const reason  = document.getElementById('gp-reason').value.trim();
  const granter = state.user;

  if (!citizen || pts <= 0) return;

  const btn = document.getElementById('gp-submit-btn');
  btn.disabled = true;
  btn.textContent = 'Granting…';

  const { newScore, error } = await sbAwardPoints(citizen.id, pts, granter, reason);

  btn.textContent = '⚡ Grant Points';

  const toast = document.getElementById('gp-toast');
  if (error) {
    toast.textContent = `❌ Failed: ${error.message || 'Unknown error'}`;
    toast.className   = 'gp-toast error';
  } else {
    
    state.grantSelectedUser.civicScore = newScore;
    document.getElementById('gp-sel-score').textContent = newScore.toLocaleString();
    state.grantCitizensList = state.grantCitizensList.map(u =>
      u.id === citizen.id ? { ...u, civicScore: newScore } : u
    );

    
    
    
    if (state.user && state.user.id === citizen.id) {
      state.user.civicScore = newScore;
      if (typeof renderTopbar === 'function') renderTopbar(true);
      if (typeof renderLeaderboard === 'function') renderLeaderboard();
      if (typeof _refreshScoreDisplays === 'function') _refreshScoreDisplays(newScore);
    }
    
    

    toast.textContent = `✅ Granted ${pts} pts to ${citizen.name}! New total: ${newScore.toLocaleString()} pts`;
    toast.className   = 'gp-toast success';

    
    document.getElementById('gp-pts-input').value = '';
    document.getElementById('gp-reason').value    = '';
    document.querySelectorAll('.gp-pts-preset').forEach(b => b.classList.remove('active'));
    state.grantPts = 0;
    btn.disabled   = true;
  }

  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 4000);
}

document.addEventListener('click', e => {
  if (!e.target.closest('#gp-citizen-search') && !e.target.closest('#gp-citizen-dropdown')) {
    const dd = document.getElementById('gp-citizen-dropdown');
    if (dd) dd.classList.add('hidden');
  }
});

const _origRenderLeaderboard = typeof renderLeaderboard === 'function' ? renderLeaderboard : null;
function renderLeaderboard() {
  if (_origRenderLeaderboard) _origRenderLeaderboard();

  
  
  if (typeof lbScope !== 'undefined' && lbScope === 'personal' && state.user) {
    const liveScore = state.user.civicScore || 0;
    const scoreEl = document.querySelector('#lb-personal-card .lbp-stat-num');
    if (scoreEl) scoreEl.textContent = liveScore.toLocaleString();

    
    const topScoreEl = document.querySelector('.user-score');
    if (topScoreEl) topScoreEl.textContent = `⚡ ${liveScore.toLocaleString()} pts`;
  }
}

let _scorePoller      = null;
let _focusListenerSet = false;

async function _fetchAndApplyScore() {
  if (!state.user?.id || state.user.role !== 'citizen') return;
  try {
    const { data, error } = await _sb
      .from('profiles')
      .select('civic_score')
      .eq('id', state.user.id)
      .single();
    if (error || !data) return;
    const fresh = data.civic_score || 0;
    if (fresh !== state.user.civicScore) {
      state.user.civicScore = fresh;
      _refreshScoreDisplays(fresh);
      _flashScoreBadge();
    }
  } catch (_) {}
}

function _startProfileSubscription() {
  if (!state.user || state.user.role !== 'citizen' || !state.user.id) return;

  
  _fetchAndApplyScore();

  
  if (!_scorePoller) {
    _scorePoller = setInterval(_fetchAndApplyScore, 20000);
  }

  
  if (!_focusListenerSet) {
    _focusListenerSet = true;
    window.addEventListener('focus', _fetchAndApplyScore);
    
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') _fetchAndApplyScore();
    });
  }
}

function _stopProfileSubscription() {
  if (_scorePoller) {
    clearInterval(_scorePoller);
    _scorePoller = null;
  }
  
  
}

function _refreshScoreDisplays(score) {
  const fmt = (score || 0).toLocaleString();

  
  
  document.querySelectorAll('.user-score').forEach(el => {
    el.textContent = `⚡ ${fmt} pts`;
  });

  
  const shopBal = document.getElementById('shop-bal-num');
  if (shopBal) shopBal.textContent = fmt;

  
  const lbScore = document.querySelector('#lb-personal-card .lbp-stat-num');
  if (lbScore) lbScore.textContent = fmt;

  
  const balAfter = document.querySelector('.rm-bal-after');
  if (balAfter) {
    const pending = state.pendingReward?.pts || 0;
    balAfter.textContent = `⚡ ${Math.max(0, (score || 0) - pending).toLocaleString()} pts`;
  }
}

function _flashScoreBadge() {
  document.querySelectorAll('.user-score').forEach(el => {
    el.style.transition = 'none';
    el.style.color      = '#22c55e';
    el.style.fontWeight = '800';
    setTimeout(() => {
      el.style.transition = 'color .6s';
      el.style.color      = '';
      el.style.fontWeight = '';
    }, 1400);
  });
}

async function saveWard() {
  const newWard = window._tempWard;
  if (!newWard) {
    const overlay = document.getElementById('ward-modal-overlay');
    if (overlay) overlay.remove();
    return;
  }

  
  const prevWard = state.selectedWard;
  state.selectedWard = newWard;
  if (state.user) state.user.ward = newWard;

  
  if (state.user?.id) {
    
    const saveBtn = document.querySelector('.ward-save-btn');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; }

    const { error } = await _sb
      .from('profiles')
      .update({ ward: newWard })
      .eq('id', state.user.id);

    if (error) {
      
      console.error('[CivicPulse] Ward update failed:', error);
      state.selectedWard = prevWard;
      if (state.user) state.user.ward = prevWard;
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Ward'; }
      alert('Could not save ward change. Please try again.');
      return;
    }
  }

  
  const overlay = document.getElementById('ward-modal-overlay');
  if (overlay) overlay.remove();

  
  _refreshAllWardDisplays(newWard);

  
  if (state.view === 'leaderboard' && typeof lbScope !== 'undefined' && lbScope === 'ward') {
    if (typeof loadLeaderboardData === 'function') loadLeaderboardData(newWard);
  }
}

function _refreshAllWardDisplays(ward) {
  
  const wardBtn = document.getElementById('ward-btn');
  if (wardBtn) wardBtn.textContent = ward + ' ▾';

  
  document.querySelectorAll('.ward-tag').forEach(el => {
    el.textContent = ward;
  });

  
  const ahNameEl = document.getElementById('ah-name-display');
  if (ahNameEl && state.user?.role === 'authority') {
    ahNameEl.textContent = `${state.user.name} · ${ward}`;
  }

  
  const lbpWard = document.querySelector('.lbp-ward');
  if (lbpWard) lbpWard.textContent = ward;

  
  if (typeof renderTopbar === 'function') renderTopbar(true);
}