/* ===================== Extras: storm track, frames, when-to-go, glossary, cams ===================== */
state.mapMode = state.mapMode || 'day'; state.mapFrame = state.mapFrame || 0;
function frameList(){ const D=state.derived[LOCATIONS[0].id]; if(!D) return []; if(state.mapMode==='day') return D.days.map(d=>({key:d.d, label:d.label, a:null}));
  const out=[]; for(let i=D.startIdx;i<D.n;i+=6){ const b=Math.min(D.n,i+6); out.push({key:i, label:`${fmtDay(D.times[i]).split(',')[0]} ${fmtHour(D.times[i])}–${fmtHour(D.times[b-1])}`, a:i, b}); } return out; }
function frameVal(D, fr){
  if(state.mapMode==='day') return dayVal(D, fr.key);
  let snow=0; for(let i=fr.a;i<fr.b;i++) snow+=D.blend[i]||0;
  let flow=null; const p=D.pres; if(p&&p.h.wind_direction_700hPa){ const dirs=[],spds=[],w=[]; for(let i=fr.a;i<fr.b;i++){ const j=p.map.get(D.times[i]); if(j==null) continue; dirs.push(p.h.wind_direction_700hPa[j]); spds.push(p.h.wind_speed_700hPa[j]); w.push((p.h.snowfall&&p.h.snowfall[j]||0)+0.001); } flow=vecMean(dirs,spds,w); }
  return {snow, flow, fit: flow? fitScore(LOCATIONS.find(l=>state.derived[l.id]===D), flow.dir, flow.steady, flow.spd) : null};
}
// Storm track: where the 500 mb low centre sits in each frame (lowest height among all locations)
function stormTrack(){
  const frs=frameList(); const locs=LOCATIONS.map(l=>({l,D:state.derived[l.id]})).filter(x=>x.D&&x.D.pres&&x.D.pres.h.geopotential_height_500hPa);
  if(!locs.length) return [];
  return frs.map(fr=>{ const vals=[]; locs.forEach(x=>{ let v=null; if(state.mapMode==='day'){ const d=x.D.days.find(q=>q.d===fr.key); v=d?d.h500:null; } else { const p=x.D.pres; const hv=[]; for(let i=fr.a;i<fr.b;i++){ const j=p.map.get(x.D.times[i]); if(j!=null&&p.h.geopotential_height_500hPa[j]!=null) hv.push(p.h.geopotential_height_500hPa[j]); } v=hv.length?mean(hv):null; } if(v!=null) vals.push({v,l:x.l}); });
    if(vals.length<5) return null; vals.sort((a,b)=>a.v-b.v); const spread=vals[vals.length-1].v-vals[0].v;
    // a closed low or sharp trough shows as a big height gradient across the region; a flat field (small spread) has no meaningful centre
    if(spread<45) return {fr, none:true, spread};
    // centre = height-weighted position of the lowest five points, which is steadier than a single minimum
    const low=vals.slice(0,5); const w=low.map(x=>(spread-(x.v-vals[0].v))+1); const W=w.reduce((a,b)=>a+b,0);
    const lat=low.reduce((a,x,k)=>a+x.l.lat*w[k],0)/W, lon=low.reduce((a,x,k)=>a+x.l.lon*w[k],0)/W;
    return {fr, lat, lon, l:vals[0].l, v:vals[0].v, spread}; });
}
/* ---------- When to go ---------- */
function whenToGo(l, D){
  const t=D.times, a=D.startIdx, n=D.n; const out={};
  // best powder morning: snow in the 24 h ending at 8 AM local on each day
  let best=null; D.days.forEach(d=>{ const end=t.findIndex(tt=>tt>=d.t+8*3600); if(end<0) return; let s=0, c=0; for(let i=Math.max(a,end-24);i<end;i++){ s+=D.blend[i]||0; c++; } if(c>=12 && (!best||s>best.s)) best={d, s}; });
  out.morning=best;
  // best 6-hour window
  let win=null; for(let i=a;i+6<=n;i++){ let s=0; for(let k=i;k<i+6;k++) s+=D.blend[k]||0; if(!win||s>win.s) win={i,s}; } out.window=win? {start:t[win.i], end:t[win.i+5]+3600, s:win.s} : null;
  // first day with 6 in+ in the previous 48 h (base-building marker)
  let first=null; for(let i=a;i<n;i++){ let s=0; for(let k=Math.max(a,i-48);k<=i;k++) s+=D.blend[k]||0; if(s>=6){ first=t[i]; break; } } out.sixIn=first;
  // verdict
  const p=D.powder.total; out.verdict = D.d3<1? 'Skip the drive this week unless it is a bluebird day you want.' : p>=70? 'Go. This is a real storm cycle for this mountain.' : p>=50? 'Worth it if the timing works; plan around the best morning.' : p>=30? 'Marginal. Snow is coming but something (amount, wind, density or confidence) is holding it back.' : 'Not yet. Keep watching the runs.';
  return out;
}
function drawWhenToGo(l, D){
  const w=whenToGo(l,D); const el=$('#whenToGo'); if(!el) return;
  el.innerHTML=`<p style="margin:0 0 10px;font-size:15px"><b>${esc(w.verdict)}</b></p><div class="goCard">
    <div class="g"><div class="l">Best powder morning</div><div class="v">${w.morning&&w.morning.s>=1?w.morning.d.label.split(',')[0]:'—'}</div><div class="s">${w.morning&&w.morning.s>=1?`${inch(w.morning.s)} in in the 24 h before 8 AM`:'nothing over an inch overnight this week'}</div></div>
    <div class="g"><div class="l">Heaviest 6 hours</div><div class="v">${w.window&&w.window.s>=0.5?fmtDT(w.window.start):'—'}</div><div class="s">${w.window&&w.window.s>=0.5?`${inch(w.window.s)} in through ${fmtHour(w.window.end)}`:'no concentrated burst'}</div></div>
    <div class="g"><div class="l">6 in on the ground by</div><div class="v">${w.sixIn?fmtDT(w.sixIn):'—'}</div><div class="s">${w.sixIn?'first time 48-h snowfall reaches 6 in':'not reached in 7 days'}</div></div>
    <div class="g"><div class="l">Powder score</div><div class="v">${D.powder.total}<span style="font-size:14px;color:var(--fg-3)">/100</span></div><div class="s">next 72 h: amount, ratio, wind, agreement, fit</div></div>
  </div>`;
}
/* ---------- Glossary tooltips ---------- */
const GLOSS = [
  [/700 mb/g, '700 millibars: the pressure level about 10,000 ft up, close to ridge-top height in these ranges. Wind and temperature here decide which slopes get lifted air and how dense the snow is.'],
  [/500 mb/g, '500 millibars: about 18,000 ft up, where forecasters track the jet stream and the trough/ridge pattern. Heights fall as a storm (trough) approaches.'],
  [/trough axis/g, 'The line of lowest upper-air heights, the core of the storm system. Snow is usually heaviest just ahead of it and turns colder behind it.'],
  [/ratio of/g, 'Snow-to-liquid ratio: inches of snow per inch of melted water. 10:1 is average, 15:1 and up is light powder, under 8:1 is heavy.'],
  [/freezing level/gi, 'The height where the air is 32°F. Snow usually survives down to roughly 1,000 ft below it, which is the snow level.'],
  [/ensemble/g, 'Dozens of runs of the same model with slightly different starting conditions. Their spread shows how certain the forecast is.'],
  [/orographic/gi, 'Lifting of air by terrain. Windward slopes squeeze out extra snow; lee slopes dry out.'],
  [/upslope/gi, 'Easterly wind pushed up the east side of the Front Range, the classic Denver-area big-snow setup.'],
  [/cutoff low/gi, 'A storm that has pinched off from the jet stream and spins in place, often over the Four Corners. Slow-moving, warm, and hard for models to time.'],
];
function gloss(html){ let out=html; GLOSS.forEach(([re,tip])=>{ let done=false; out=out.replace(re, m=> done? m : (done=true, `<span class="gl" data-tip="${esc(tip)}">${m}</span>`)); }); return out; }
/* ---------- Cams ---------- */
const CAMS = window.CAMS || {passes:[], resorts:{}};
CAMS.passes.forEach(c=>{ if(c.kind==='img'&&c.verified===false) c.sub=(c.sub?c.sub+' · ':'')+'feed URL untested, falls back to the official page'; });
function camCard(c){
  const id='cam'+Math.random().toString(36).slice(2,8); const isImg=c.kind==='img';
  const frame = isImg? `<a href="${esc(c.page||c.url)}" target="_blank" rel="noopener"><img id="${id}" alt="${esc(c.name)}" loading="lazy" referrerpolicy="no-referrer"></a><span class="age" id="${id}-age"></span>`
    : c.kind==='youtube'? `<iframe src="https://www.youtube.com/embed/${esc(c.id)}?autoplay=0&mute=1&rel=0" title="${esc(c.name)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe><span class="live">LIVE</span>`
    : c.kind==='iframe'? `<iframe src="${esc(c.url)}" title="${esc(c.name)}" loading="lazy" allowfullscreen></iframe>`
    : `<div class="fallback"><a href="${esc(c.page)}" target="_blank" rel="noopener">${esc(c.name)} ↗</a><br><span class="muted">opens the official cam page</span></div>`;
  return `<div class="cam" data-region="${esc(c.region||'')}"><div class="frame">${frame}</div><div class="meta"><div><b>${esc(c.name)}</b><div class="muted">${esc(c.sub||'')}</div></div><a class="src" href="${esc(c.page||c.url||'#')}" target="_blank" rel="noopener">${esc(c.provider||'source')} ↗</a></div></div>`;
}
const camTimers=[];
function renderCams(){
  const passes=CAMS.passes||[]; const regions=[...new Set(passes.map(c=>c.region).filter(Boolean))];
  state.camRegion = state.camRegion||'';
  $('#camFilters').innerHTML = `<button class="chip" aria-pressed="${!state.camRegion}" data-r="">All</button>`+regions.map(r=>`<button class="chip" aria-pressed="${state.camRegion===r}" data-r="${esc(r)}">${esc(r)}</button>`).join('');
  $$('#camFilters .chip').forEach(b=>b.onclick=()=>{ state.camRegion=b.dataset.r; renderCams(); });
  const shown=passes.filter(c=>!state.camRegion||c.region===state.camRegion);
  $('#camGridPasses').innerHTML = shown.length? shown.map(camCard).join('') : '<p class="muted">No pass cams configured yet.</p>';
  const res=Object.entries(CAMS.resorts||{}).flatMap(([id,list])=>{ const l=LOCATIONS.find(x=>x.id===id); return (list||[]).map(c=>Object.assign({sub:l?l.name+' · '+l.state:''}, c)); });
  $('#camGridResorts').innerHTML = res.length? res.map(camCard).join('') : '<p class="muted">No resort cams configured yet.</p>';
}
// images: load with cache-busting, refresh every 60 s, fall back to a link on error
function mountCamImages(root, cams){
  const cards=[...root.querySelectorAll('.cam')]; cards.forEach((card,k)=>{ const c=cams[k]; const img=card.querySelector('img'); if(!img||!c||c.kind!=='img') return;
    const load=()=>{ const u=c.url+(c.url.includes('?')?'&':'?')+'t='+Date.now(); img.src=u; const age=card.querySelector('.age'); if(age) age.textContent='updated '+new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}); };
    img.onerror=()=>{ card.querySelector('.frame').innerHTML=`<div class="fallback"><a href="${esc(c.page||c.url)}" target="_blank" rel="noopener">${esc(c.name)} ↗</a><br><span class="muted">this feed blocks embedding; opens the official page</span></div>`; };
    load(); camTimers.push(setInterval(load, (c.refresh||60)*1000)); });
}
function renderCamsTab(){
  camTimers.forEach(t=>clearInterval(t)); camTimers.length=0;
  const passes=(CAMS.passes||[]).filter(c=>!state.camRegion||c.region===state.camRegion);
  renderCams();
  const res=Object.entries(CAMS.resorts||{}).flatMap(([id,list])=>list||[]);
  mountCamImages($('#camGridPasses'), passes); mountCamImages($('#camGridResorts'), res);
}
function drawDetailCams(l){
  const el=$('#detailCams'); if(!el) return;
  const mine=(CAMS.resorts&&CAMS.resorts[l.id])||[]; const near=(CAMS.passes||[]).filter(c=>(c.near||[]).includes(l.id));
  const list=[...mine, ...near];
  if(!list.length){ el.innerHTML=`<p class="small muted">No cams wired for this location yet. <a href="${esc(l.camPage||'#')}" target="_blank" rel="noopener">${l.camPage?'Official webcam page ↗':''}</a></p>`; return; }
  el.innerHTML=`<div class="camGrid">${list.map(camCard).join('')}</div>`; mountCamImages(el, list);
}
