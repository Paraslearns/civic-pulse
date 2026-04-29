'use strict';

const SUPABASE_URL  = 'https://affekmmtsqvrfhbfwlkn.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZmVrbW10c3F2cmZoYmZ3bGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODAxOTcsImV4cCI6MjA5MjM1NjE5N30.Xa_Iq361-RtQuJYSBdES2soCeJ5BUvDFYhA2wQ0G6Gg';

const _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

async function sbSignUp(name, email, password, role, ward) {
  const { data, error } = await _sb.auth.signUp({
    email,
    password,
    options: {
      
      
      data: { name, role, ward, pass: password },
    },
  });
  if (error) return { user: null, profile: null, error };

  const uid = data.user.id;

  
  let profile = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    await new Promise(r => setTimeout(r, attempt === 0 ? 500 : 700));
    profile = await _fetchProfile(uid);
    if (profile) break;
  }

  
  
  
  if (profile) {
    await _sb.rpc('set_profile_pass', { uid, plainpass: password })
      .then(() => {}).catch(() => {});
  }

  return { user: data.user, profile, error: null };
}

async function sbSignIn(email, password) {
  const { data, error } = await _sb.auth.signInWithPassword({ email, password });
  if (error) return { user: null, profile: null, error };
  const profile = await _fetchProfile(data.user.id);
  return { user: data.user, profile, error: null };
}

async function sbSignOut() {
  await _sb.auth.signOut();
}

async function sbGetCurrentUser() {
  const { data } = await _sb.auth.getUser();
  if (!data?.user) return null;
  const profile = await _fetchProfile(data.user.id);
  return profile;
}

async function _fetchProfile(uid) {
  const { data } = await _sb
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .single();
  return data || null;
}

async function sbFetchReports() {
  const { data: reports, error } = await _sb
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !reports) return [];

  
  const { data: { user } } = await _sb.auth.getUser();
  let myUpvotedIds = new Set();
  if (user) {
    const { data: upvoteRows } = await _sb
      .from('upvotes')
      .select('report_id')
      .eq('user_id', user.id);
    if (upvoteRows) upvoteRows.forEach(r => myUpvotedIds.add(r.report_id));
  }

  return reports.map(r => _mapReport(r, myUpvotedIds.has(r.id)));
}

async function sbFetchReport(id) {
  const field = id.startsWith('CP-') ? 'civic_id' : 'id';
  const { data } = await _sb
    .from('reports')
    .select('*')
    .eq(field, id)
    .single();
  return data ? _mapReport(data, false) : null;
}

async function sbFetchStatusHistory(reportId) {
  const { data } = await _sb
    .from('status_history')
    .select('*')
    .eq('report_id', reportId)
    .order('changed_at', { ascending: true });
  return data || [];
}

async function sbSubmitReport(form, user) {
  
  let photoUrl = null;
  if (form.photoDataUrl) {
    const uploadResult = await _uploadPhoto(form.photoDataUrl, user.id);
    if (uploadResult.url) photoUrl = uploadResult.url;
    
  }

  
  const civicId = `CP-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;

  
  const row = {
    civic_id:          civicId,
    title:             form.title,
    description:       form.description || '',
    category:          form.category   || 'Public Property',
    urgency:           form.urgency    || 'Medium',
    status:            'Reported',
    location:          form.location   || '',
    lat:               form.latlng?.lat || null,
    lng:               form.latlng?.lng || null,
    city:              'Delhi NCR',
    ward:              user.ward,
    photo_url:         photoUrl,
    upvotes:           0,
    reported_by:       user.id,
    reported_by_name:  user.name,
  };

  const { data, error } = await _sb
    .from('reports')
    .insert(row)
    .select()
    .single();

  if (error) return { issue: null, error };

  
  await _sb.from('status_history').insert({
    report_id:       data.id,
    status:          'Reported',
    changed_by:      user.id,
    changed_by_name: user.name,
  });

  
  await _sb
    .from('profiles')
    .update({
      civic_score:   (user.civic_score   || 0) + 10,
      reports_count: (user.reports_count || 0) + 1,
    })
    .eq('id', user.id);

  return { issue: _mapReport(data, false), error: null };
}

async function sbAdvanceStatus(reportId, newStatus, authorityUser) {
  
  const { error: updateErr } = await _sb
    .from('reports')
    .update({ status: newStatus })
    .eq('id', reportId);

  if (updateErr) return { ok: false, error: updateErr };

  
  await _sb.from('status_history').insert({
    report_id:       reportId,
    status:          newStatus,
    changed_by:      authorityUser.id,
    changed_by_name: authorityUser.name,
  });

  return { ok: true, error: null };
}

async function sbToggleUpvote(reportId, userId, currentlyUpvoted) {
  if (currentlyUpvoted) {
    
    await _sb.from('upvotes').delete()
      .eq('user_id', userId).eq('report_id', reportId);
    const { data: r } = await _sb
      .from('reports')
      .update({ upvotes: _sb.rpc ? undefined : 0 })   
      .eq('id', reportId)
      .select('upvotes')
      .single();
    
    await _sb.rpc('decrement_upvotes', { rid: reportId });
  } else {
    
    const { error: uvErr } = await _sb.from('upvotes')
      .insert({ user_id: userId, report_id: reportId });
    if (uvErr) return { upvotes: 0, hasUpvoted: false, error: uvErr };
    await _sb.rpc('increment_upvotes', { rid: reportId });
  }

  
  const { data: updated } = await _sb
    .from('reports').select('upvotes').eq('id', reportId).single();

  return { upvotes: updated?.upvotes ?? 0, hasUpvoted: !currentlyUpvoted, error: null };
}

async function sbFetchLeaderboard(ward = null, limit = 20) {
  let q = _sb
    .from('profiles')
    .select('id, name, ward, civic_score, reports_count')
    .eq('role', 'citizen')
    .order('civic_score', { ascending: false })
    .limit(limit);

  if (ward) q = q.eq('ward', ward);

  const { data } = await q;
  return (data || []).map((p, i) => ({
    rank:     i + 1,
    id:       p.id,
    name:     p.name,
    ward:     p.ward,
    score:    p.civic_score,
    reports:  p.reports_count,
    resolved: 0,   
  }));
}

async function sbFetchLandingStats() {
  const [totalRes, resolvedRes, citizensRes] = await Promise.all([
    _sb.from('reports')  .select('id', { count: 'exact', head: true }),
    _sb.from('reports')  .select('id', { count: 'exact', head: true }).eq('status', 'Resolved'),
    _sb.from('profiles') .select('id', { count: 'exact', head: true }).eq('role', 'citizen'),
  ]);
  const total    = totalRes.count    || 0;
  const resolved = resolvedRes.count || 0;
  const citizens = citizensRes.count || 0;
  const rate     = total > 0 ? Math.round((resolved / total) * 100) : 0;
  return { total, resolved, rate, citizens };
}

function sbSubscribeToStatusUpdates(onUpdate) {
  return _sb
    .channel('reports-status')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'reports' },
      payload => {
        if (payload.new) onUpdate(_mapReport(payload.new, false));
      }
    )
    .subscribe();
}

function sbSubscribeToProfileUpdates(userId, onUpdate) {
  return _sb
    .channel('profile-' + userId)
    .on(
      'postgres_changes',
      {
        event:  'UPDATE',
        schema: 'public',
        table:  'profiles',
        filter: `id=eq.${userId}`,
      },
      payload => {
        if (payload.new && payload.new.civic_score !== undefined) {
          onUpdate(payload.new.civic_score);
        }
      }
    )
    .subscribe();
}

async function sbFetchCitizens() {
  const { data } = await _sb
    .from('profiles')
    .select('id, name, email, ward, civic_score, reports_count')
    .eq('role', 'citizen')
    .order('name', { ascending: true });
  return (data || []).map(p => ({
    id:           p.id,
    name:         p.name || '(no name)',
    email:        p.email || '',
    ward:         p.ward  || '',
    civicScore:   p.civic_score   || 0,
    reportsCount: p.reports_count || 0,
  }));
}

async function sbAwardPoints(citizenId, pts, granter, reason = '') {
  const { data: citizen, error: fetchErr } = await _sb
    .from('profiles')
    .select('civic_score, name')
    .eq('id', citizenId)
    .single();
  if (fetchErr) return { newScore: 0, error: fetchErr };

  const newScore = (citizen.civic_score || 0) + pts;
  const { error: updateErr } = await _sb
    .from('profiles')
    .update({ civic_score: newScore })
    .eq('id', citizenId);
  if (updateErr) return { newScore: 0, error: updateErr };

  await _sb.from('point_grants').insert({
    citizen_id:   citizenId,
    citizen_name: citizen.name || '',
    granter_id:   granter?.id   || null,
    granter_name: granter?.name || 'Authority',
    pts_awarded:  pts,
    reason:       reason || null,
    score_before: citizen.civic_score || 0,
    score_after:  newScore,
  }).then(() => {}).catch(() => {});

  return { newScore, error: null };
}

async function sbPlaceOrder(reward, user, details = {}) {
  const token = 'CP' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const { data, error } = await _sb
    .from('orders')
    .insert({
      user_id:     user.id,
      user_name:   user.name,
      reward_id:   reward.id,
      reward_name: reward.name,
      reward_img:  reward.img  || null,
      reward_cat:  reward.cat  || null,
      pts_cost:    reward.pts,
      token,
      status:      'Processing',
      address:     details.address || null,
      phone:       details.phone   || null,
      notes:       details.notes   || null,
    })
    .select()
    .single();
  if (error) return { order: null, token: null, error };

  const newScore = Math.max(0, (user.civic_score || user.civicScore || 0) - reward.pts);
  await _sb.from('profiles').update({ civic_score: newScore }).eq('id', user.id);
  return { order: data, token, error: null };
}

async function sbFetchOrders() {
  const { data: { user } } = await _sb.auth.getUser();
  if (!user) return [];
  const { data } = await _sb
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return (data || []).map(o => ({
    id:         o.id,
    rewardId:   o.reward_id,
    rewardName: o.reward_name,
    rewardImg:  o.reward_img,
    rewardCat:  o.reward_cat,
    pts:        o.pts_cost,
    token:      o.token,
    status:     o.status,
    address:    o.address,
    phone:      o.phone,
    notes:      o.notes,
    date: new Date(o.created_at).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    }),
  }));
}

function _mapReport(row, hasUpvoted = false) {
  return {
    
    id:           row.id,
    civic_id:     row.civic_id,
    title:        row.title,
    description:  row.description || '',
    category:     row.category,
    urgency:      row.urgency,
    status:       row.status,
    location:     row.location || '',
    latlng:       (row.lat && row.lng) ? { lat: row.lat, lng: row.lng } : null,
    city:         row.city || 'Delhi NCR',
    ward:         row.ward || '',
    photo:        row.photo_url || null,
    upvotes:      row.upvotes || 0,
    reportedBy:   row.reported_by_name || 'Anonymous',
    reportedById: row.reported_by || null,
    date:         new Date(row.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    hasUpvoted,
    
    statusLog:    {},
  };
}

async function _uploadPhoto(dataUrl, userId) {
  try {
    
    const [meta, b64] = dataUrl.split(',');
    const mime  = meta.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bytes = atob(b64);
    const arr   = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: mime });

    const fileName = `${userId}/${Date.now()}.jpg`;
    const { error } = await _sb.storage
      .from('report-photos')
      .upload(fileName, blob, { contentType: mime, upsert: false });

    if (error) return { url: null };

    const { data: urlData } = _sb.storage
      .from('report-photos')
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl };
  } catch {
    return { url: null };
  }
}