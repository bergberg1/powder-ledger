/* ===================== UI ===================== */
const $ = s=>document.querySelector(s); const $$ = s=>[...document.querySelectorAll(s)];
const esc = s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inch = (v,d)=> v==null? '—' : (v<0.05? '0' : v.toFixed(d==null?(v<10?1:0):d));
const f0 = v=> v==null?'—':Math.round(v).toLocaleString();
const degC = f=> f==null? null : (f-32)*5/9;
const mFt = m=> m==null? null : m/0.3048;
const SEQ = ['var(--seq1)','var(--seq2)','var(--seq3)','var(--seq4)','var(--seq5)','var(--seq6)','var(--seq7)'];
const seqColor = (v, max)=>{ if(!(v>0.02)) return 'transparent'; const r=Math.min(1, v/Math.max(max,0.01)); return SEQ[Math.min(6, Math.floor(Math.pow(r,0.6)*6.999))]; };
const SNOW_MAX_HR = 1.2; // in/hr for strip scale
let tipEl;
function showTip(html, x, y){ tipEl=tipEl||$('#tip'); tipEl.innerHTML=html; tipEl.style.display='block'; const w=tipEl.offsetWidth, h=tipEl.offsetHeight; let L=x+14, T=y+14; if(L+w>window.innerWidth-8) L=x-w-14; if(T+h>window.innerHeight-8) T=y-h-14; tipEl.style.left=L+'px'; tipEl.style.top=T+'px'; }
function hideTip(){ (tipEl||$('#tip')).style.display='none'; }
function bindTips(root){ root.querySelectorAll('[data-tip]').forEach(el=>{ el.addEventListener('pointermove', e=>showTip(el.getAttribute('data-tip'), e.clientX, e.clientY)); el.addEventListener('pointerleave', hideTip); el.addEventListener('focus', ()=>{ const r=el.getBoundingClientRect(); showTip(el.getAttribute('data-tip'), r.left+r.width/2, r.top); }); el.addEventListener('blur', hideTip); }); }
const arrowSvg = (dir, color, size)=> dir==null? '' : `<svg class="arrow" viewBox="-10 -10 20 20" width="${size||14}" height="${size||14}" style="transform:rotate(${(dir+180)%360}deg)"><path d="M0,-8 L5,4 L0,1 L-5,4 Z" fill="${color||'currentColor'}"/></svg>`;
// tiny daily bar sparkline (7 days)
function sparkDays(days, w, h, max){ w=w||60; h=h||18; const m=Math.max(max||0, 0.5, ...days.map(d=>d.blend)); const bw=w/days.length; return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${days.map((d,i)=>{ const bh=Math.max(d.blend>0.05?1.5:0,(d.blend/m)*(h-2)); return `<rect x="${(i*bw+1).toFixed(1)}" y="${(h-bh).toFixed(1)}" width="${(bw-2).toFixed(1)}" height="${bh.toFixed(1)}" rx="1" fill="${d.blend>0.05?seqColor(d.blend,m):'var(--line)'}"/>`; }).join('')}</svg>`; }

function visibleLocations(){
  const q=state.q.trim().toLowerCase(); const maxDrive=+state.prefs.drive;
  return LOCATIONS.filter(l=>{
    if(state.favOnly && !isFav(l.id)) return false;
    if(maxDrive<10 && l.driveHrs>maxDrive) return false;
    if(state.regions.size && !state.regions.has(l.region)) return false;
    if(q && !(l.name+' '+l.region+' '+l.state+' '+(l.aka||'')).toLowerCase().includes(q)) return false;
    return true;
  });
}
function visRows(){ return visibleLocations().map(l=>({l, D:state.derived[l.id]})).filter(x=>x.D); }
function setStatus(cls, text){ $('#stLight').className='dot '+cls; $('#stText').textContent=text; }
function setLoad(frac){ $('#loadbar').style.width=(frac*100)+'%'; if(frac>=1) setTimeout(()=>{ $('#loadbar').style.width='0'; },600); }
function flowMeaning(dir){
  const c=degToCompass(dir);
  if(['NW','WNW','NNW'].includes(c)) return 'northwest flow: Steamboat, Winter Park, Vail and the Cottonwoods are favored';
  if(['W'].includes(c)) return 'westerly flow: the I-70 corridor and the Wasatch; San Juans mixed';
  if(['SW','WSW','SSW'].includes(c)) return 'southwest flow: San Juans, Wolf Creek, Telluride, Taos and southern Utah; the Front Range is shadowed';
  if(['N','NNE','NE','ENE','E','ESE','SE'].includes(c)) return 'easterly upslope: Front Range foothills, Eldora, Loveland and the east side of Winter Park';
  return 'southerly flow: often warm and dry west of the Divide';
}

/* ---------- Hero: storm headline + best bets ---------- */
function renderHero(){
  const locs=visRows(); const H=$('#hero');
  if(!locs.length){ const any=Object.keys(state.derived).length; H.innerHTML= any? '<div class="eyebrow">This week</div><h1>No locations match the filter</h1><p>Widen the drive-time slider or clear the region chips.</p>' : '<div class="eyebrow">Powder Ledger</div><h1>Waiting for the first model pull</h1><p>This page reads a data snapshot of ECMWF, GFS, ICON, GEM, HRRR and NWS output for 50 mountains across Colorado, Utah, Wyoming and New Mexico, then explains why each one gets what it gets. No snapshot has been published yet, and a hosted page cannot call the weather services directly. Once the first snapshot lands, the storm headline, best bets, ranked ledger and animated map fill in here.</p>'; $('#bets').innerHTML=''; return; }
  const wins=stormWindows(locs); const top=[...locs].sort((a,b)=>b.D.d7-a.D.d7)[0];
  let head, sub;
  if(!wins.length){ head=`Quiet week: no organized storm for the selected mountains`; sub=`Best of a dry stretch is ${top.l.name} with ${inch(top.D.d7)} in over 7 days. Check back after the 00Z and 12Z runs; patterns change fastest at day 4–6.`; }
  else { const w=wins[0]; const firstHit = regionsFirstHit(locs, w); const first=firstHit[0], last=firstHit[firstHit.length-1];
    head=`${wins.length>1?'Storm 1 of '+wins.length:'One storm'} arrives ${fmtDT(w.start)}${first&&last&&first.r!==last.r&&last.t-first.t>=3*3600?`, hitting ${first.r} first and reaching ${last.r} by ${fmtDT(last.t)}`:first&&last&&first.r!==last.r?`, hitting ${first.r} and ${last.r} together`:''}`;
    sub=`${w.flow?`Steering flow at 700 mb is <b>${degToCompass(w.flow.dir)} at ${f0(w.flow.spd)} mph</b>, so ${flowMeaning(w.flow.dir)}. `:''}Biggest total in this window: <b>${esc(w.top[0].l.name)} ${inch(w.top[0].v)} in</b>. Over the full 7 days the leader is <b>${esc(top.l.name)} at ${inch(top.D.d7)} in</b> (models ${inch(top.D.mn)}–${inch(top.D.mx)}, agreement ${top.D.conf.t}).`; }
  H.innerHTML=`<div class="grid"><div style="display:contents"><div><div class="eyebrow">This week's headline · ${new Date().toLocaleDateString('en-US',{timeZone:TZ,weekday:'long',month:'short',day:'numeric'})}</div><h1>${head}</h1><p>${sub}</p></div>
    <div class="heroHelp">New here? <a href="#" data-goto="sources">How to read this page</a> · <a href="#" data-goto="cams">Live cams</a></div></div>
    <div class="windows">${wins.slice(0,3).map((w,i)=>`<div class="win"><b>Storm ${i+1} · ${fmtDT(w.start)} → ${fmtDT(w.end)}</b><div class="r">${Math.round((w.end-w.start)/3600)} h · ${w.flow?degToCompass(w.flow.dir)+' '+f0(w.flow.spd)+' mph at 700 mb':'flow n/a'} · top: ${w.top.slice(0,3).map(x=>esc(x.l.short||x.l.name)+' '+inch(x.v)).join(', ')}</div></div>`).join('')||'<div class="win"><b>No storm windows</b><div class="r">Nothing reaches 0.15 in/hr at any selected location.</div></div>'}</div></div>`;
  $$('#hero [data-goto]').forEach(a=>a.onclick=e=>{ e.preventDefault(); $(`nav.tabs button[data-tab=${a.dataset.goto}]`).click(); window.scrollTo({top:0}); });
  // best bets: rank by powder score within filter
  const bets=[...locs].sort((a,b)=>b.D.powder.total-a.D.powder.total).slice(0,4);
  $('#bets').innerHTML = bets.map((x,i)=>{ const D=x.D,l=x.l; const fl=fitLabel(D.fit7,D.flow7); const reasons=[]; if(D.d3>=4) reasons.push(`${inch(D.d3)} in in 72 h`); if(D.powder.slr3&&D.powder.slr3>=14) reasons.push(`light ${Math.round(D.powder.slr3)}:1 snow`); else if(D.powder.slr3&&D.powder.slr3<10) reasons.push(`dense ${Math.round(D.powder.slr3)}:1 snow`); if(D.powder.gust!=null) reasons.push(D.powder.gust<25?'calm winds':D.powder.gust<40?`gusts to ${f0(D.powder.gust)} mph`:`wind-hold risk, gusts ${f0(D.powder.gust)} mph`); if(D.fit7!=null&&D.fit7>=0.4) reasons.push('terrain lines up with the flow'); if(D.fit7!=null&&D.fit7<=-0.4) reasons.push('shadowed in this flow'); reasons.push(`${D.conf.t} agreement`);
    return `<div class="bet" tabindex="0" data-id="${l.id}"><div class="rank">#${i+1} best bet · powder score ${D.powder.total}</div><h3>${esc(l.name)} <span class="muted" style="font-size:13px;font-family:var(--body);font-weight:400">${l.state} · ${l.driveHrs} h</span></h3>
      <div class="nums"><div class="big">${inch(D.d3)}<small> in / 72 h</small></div><div class="big" style="font-size:22px;color:var(--fg-2)">${inch(D.d7)}<small> in / 7 d</small></div>${sparkDays(D.days,70,24)}</div>
      <div class="reason">${reasons.join(' · ')}</div><div class="pills"><span class="pill ${D.conf.cls}">${D.conf.t}</span><span class="pill ${fl.cls}">${D.flow7?degToCompass(D.flow7.dir)+' · ':''}${fl.t}</span></div></div>`; }).join('');
  $$('#bets .bet').forEach(b=>{ b.onclick=()=>openDetail(b.dataset.id); b.onkeydown=e=>{ if(e.key==='Enter') openDetail(b.dataset.id); }; });
}
function regionsFirstHit(locs, w){
  const D0=locs[0].D; const a=D0.times.findIndex(t=>t>=w.start), b=D0.times.findIndex(t=>t>=w.end); const byR={};
  locs.forEach(x=>{ for(let i=Math.max(0,a);i<(b<0?D0.n:b);i++){ if((x.D.blend[i]||0)>=0.1){ const t=D0.times[i]; if(byR[x.l.region]==null||t<byR[x.l.region]) byR[x.l.region]=t; break; } } });
  return Object.entries(byR).map(([r,t])=>({r,t})).sort((p,q)=>p.t-q.t);
}

/* ---------- Pinned ---------- */
function renderPinned(){
  const el=$('#pinned'); if(!el) return; const favs=(state.prefs.favs||[]).map(id=>({l:LOCATIONS.find(x=>x.id===id), D:state.derived[id]})).filter(x=>x.l&&x.D);
  if(!favs.length){ el.innerHTML=`<div class="pinnedWrap"><div class="pinnedHead"><h2>Pinned</h2><span class="small muted">tap the ★ on any row or in a mountain's detail to keep it up here</span></div></div>`; return; }
  el.innerHTML=`<div class="pinnedWrap"><div class="pinnedHead"><h2>Pinned</h2><span class="small muted">${favs.length} mountain${favs.length>1?'s':''} · last 24 h is a model estimate; next 24 h and 7-day are the blend</span></div><div class="pinGrid">${favs.map(({l,D})=>{ const fl=fitLabel(D.fit7,D.flow7); return `<div class="pin" tabindex="0" data-id="${l.id}"><button class="star" data-fav="${l.id}" aria-pressed="true" title="Unpin">★</button><div class="name">${esc(l.name)} <span class="muted" style="font-family:var(--body);font-size:12px;font-weight:400">${l.state} · ${l.driveHrs} h</span></div>
    <div class="nums"><div class="past"><div>${D.hasPast?inch(D.p1):'—'}<small style="font-size:11px;color:var(--fg-3)"> in</small></div><span>last 24 h</span></div><div><div>${inch(D.d1)}<small style="font-size:11px;color:var(--fg-3)"> in</small></div><span>next 24 h</span></div><div><div>${inch(D.d7)}<small style="font-size:11px;color:var(--fg-3)"> in</small></div><span>7 day</span></div></div>
    <div class="pills"><span class="pill ${D.conf.cls}">${D.conf.t}</span><span class="pill ${fl.cls}">${D.flow7?degToCompass(D.flow7.dir)+' · ':''}${fl.t}</span><span class="pill neutral">powder ${D.powder.total}</span></div></div>`; }).join('')}</div></div>`;
  $$('#pinned .pin').forEach(c=>{ c.onclick=e=>{ if(e.target.closest('.star')) return; openDetail(c.dataset.id); }; c.onkeydown=e=>{ if(e.key==='Enter') openDetail(c.dataset.id); }; });
  $$('#pinned .star').forEach(b=>b.onclick=e=>{ e.stopPropagation(); toggleFav(b.dataset.fav); });
}
/* ---------- Stats ---------- */
function renderStats(){
  const locs=visRows(); if(!locs.length){ $('#stats').innerHTML=''; return; }
  const top=[...locs].sort((a,b)=>b.D.d7-a.D.d7)[0]; const top3=[...locs].sort((a,b)=>b.D.d3-a.D.d3)[0];
  const snowing=locs.filter(x=>x.D.d7>=6).length;
  const avgConf = mean(locs.filter(x=>x.D.d7>=3).map(x=>x.D.conf.rel));
  const flows = locs.map(x=>x.D.flow7).filter(Boolean); const fl = flows.length? vecMean(flows.map(f=>f.dir), flows.map(f=>f.spd)) : null;
  const okModels = MODELS.filter(m=>state.models[m.id]&&state.models[m.id].ok);
  const age = Math.round((Date.now()-Math.max(...okModels.map(m=>state.models[m.id].fetchedAt||0)))/60000);
  const troughs = locs.map(x=>x.D.trough).filter(Boolean); const tr = troughs.length? median(troughs.map(t=>t.t)) : null;
  const topP=[...locs].filter(x=>x.D.hasPast).sort((a,b)=>b.D.p1-a.D.p1)[0];
  const cards = [
    ...(topP?[{label:'Biggest last 24 h (model estimate)', value:`${inch(topP.D.p1)}<small> in</small>`, sub:`${topP.l.name} · ${inch(topP.D.p3)} in over 3 days`}]:[]),
    {label:'Biggest 7-day total', value:`${inch(top.D.d7)}<small> in</small> ${sparkDays(top.D.days,56,20)}`, sub:`${top.l.name} · models ${inch(top.D.mn)}–${inch(top.D.mx)} in`},
    {label:'Biggest next 72 h', value:`${inch(top3.D.d3)}<small> in</small> ${sparkDays(top3.D.days.slice(0,3),30,20)}`, sub:`${top3.l.name}`},
    {label:'Locations with 6 in+ this week', value:`${snowing}<small> of ${locs.length}</small>`, sub: snowing? 'click a row for the reasoning' : 'quiet week in this filter'},
    {label:'Prevailing 700 mb flow during snow', value: fl? `${degToCompass(fl.dir)}<small> ${f0(fl.spd)} mph</small>` : '—', sub: fl? flowMeaning(fl.dir) : 'no pressure-level data loaded'},
    {label:'500 mb trough axis passes', value: tr? `${fmtDT(tr)}` : '—', sub: tr? 'median across selected locations; snow usually peaks just ahead of it' : 'needs ECMWF or GFS 500 mb heights'},
    {label:'Model agreement', value: avgConf==null? '—' : (avgConf<0.5?'High':avgConf<1?'Mixed':'Low'), sub: avgConf==null? 'too little snow to judge' : `avg spread ${Math.round(avgConf*100)}% of the blended total`},
    {label:'Models loaded', value:`${okModels.length}<small> of ${MODELS.length}</small>`, sub: okModels.map(m=>m.short).join(' · ')+(isFinite(age)?` · ${age} min ago`:'')},
  ];
  $('#stats').innerHTML = cards.map(c=>`<div class="stat"><div class="label">${c.label}</div><div class="value">${c.value}</div><div class="sub" title="${esc(c.sub)}">${c.sub}</div></div>`).join('');
}

/* ---------- Ledger table ---------- */
const COLS = [
  {k:'fav', t:'★', w:'Pin this mountain'},
  {k:'name', t:'Location'}, {k:'driveHrs', t:'Drive', num:true, w:'Drive hours from Denver (approx.)'},
  {k:'p1', t:'Last 24 h', num:true, w:'Model-estimated snowfall in the last 24 hours (check SNOTEL in the detail for measured depth)'}, {k:'p3', t:'Last 3 d', num:true, w:'Model-estimated snowfall over the last 3 days'},
  {k:'d1', t:'Next 24 h', num:true}, {k:'d3', t:'Next 72 h', num:true}, {k:'d7', t:'7 day', num:true, w:'Blended 7-day snowfall (inches) with daily bars'},
  {k:'range', t:'Model range', w:'Lowest and highest 7-day total among the global models'},
  {k:'conf', t:'Agreement', w:'How tightly the models agree'},
  {k:'powder', t:'Powder', num:true, w:'Powder score 0–100 for the next 72 h: snow amount, ratio, wind, agreement and flow fit'},
  {k:'fit', t:'Flow fit', w:'700 mb wind direction during snow vs. this mountain\'s favored directions'},
  {k:'slr', t:'Ratio', num:true, w:'Estimated snow-to-liquid ratio (higher = lighter snow)'},
  {k:'snowlvl', t:'Snow level', num:true, w:'Estimated snow level (ft) during precipitation vs base elevation'},
  {k:'gust', t:'Gusts', num:true, w:'Peak 10 m wind gust in the next 7 days (lift holds above ~40 mph)'},
];
function sortVal(x,k){ const D=x.D,l=x.l; switch(k){ case 'fav': return isFav(l.id)?1:0; case 'p1': return D.p1||0; case 'p3': return D.p3||0; case 'name': return l.name; case 'driveHrs': return l.driveHrs; case 'range': return D.mx; case 'conf': return D.conf.rel; case 'powder': return D.powder.total; case 'fit': return D.fit7==null?-9:D.fit7; case 'slr': return D.slr7||0; case 'snowlvl': return D.fzl7||0; case 'gust': return D.gust7||0; default: return D[k]; } }
function renderLedger(){
  const rows=visRows();
  rows.sort((a,b)=>{ const va=sortVal(a,state.sortKey), vb=sortVal(b,state.sortKey); const c = typeof va==='string'? va.localeCompare(vb) : (va-vb); return state.sortDir==='asc'? c : -c; });
  const maxD7 = Math.max(1,...rows.map(x=>x.D.d7));
  $('#ledger thead').innerHTML = '<tr>'+COLS.map(c=>`<th class="${c.num?'num':''}" data-k="${c.k}" ${state.sortKey===c.k?`aria-sort="${state.sortDir==='asc'?'ascending':'descending'}"`:''} title="${esc(c.w||'')}">${c.t}</th>`).join('')+'</tr>';
  $('#ledger tbody').innerHTML = rows.map(({l,D})=>{
    const fl=fitLabel(D.fit7,D.flow7); const sl = D.fzl7!=null? mFt(D.fzl7)-1000 : null; const slCls = sl==null?'': sl>l.baseFt? 'low' : sl>l.baseFt-1500? 'med':'high';
    return `<tr class="row" tabindex="0" data-id="${l.id}" aria-selected="${state.selected===l.id}">
      <td><button class="star" data-fav="${l.id}" aria-pressed="${isFav(l.id)}" title="${isFav(l.id)?'Unpin':'Pin'}">★</button></td>
      <td><span class="name">${esc(l.name)}<span class="st">${l.state}</span></span><br><span class="region">${esc(l.region)} · ${f0(l.summitFt)} ft</span></td>
      <td class="num mono">${l.driveHrs}h</td>
      <td class="num mono pastCell">${D.hasPast?inch(D.p1):'—'}</td><td class="num mono pastCell">${D.hasPast?inch(D.p3):'—'}</td>
      <td class="num mono">${inch(D.d1)}</td><td class="num mono">${inch(D.d3)}</td>
      <td class="num" style="white-space:nowrap">${sparkDays(D.days,56,16,maxD7/2.5)} <b class="mono">${inch(D.d7)}</b></td>
      <td><span class="range mono">${inch(D.mn)}–${inch(D.mx)}</span></td>
      <td><span class="pill ${D.conf.cls}">${D.conf.t}</span></td>
      <td class="num"><span class="meter" data-tip="${esc(`<b>Powder score ${D.powder.total}</b><br>snow ${Math.round(D.powder.snow)}/45 · ratio ${Math.round(D.powder.ratio)}/20 · wind ${Math.round(D.powder.wind)}/15 · agreement ${D.powder.conf}/12 · flow fit ${Math.round(D.powder.fit)}/8`)}"><i><b style="width:${D.powder.total}%"></b></i><span class="mono">${D.powder.total}</span></span></td>
      <td><span class="fit">${D.flow7? arrowSvg(D.flow7.dir,'currentColor'):''}<span class="pill ${fl.cls}">${D.flow7? degToCompass(D.flow7.dir)+' · ':''}${fl.t}</span></span></td>
      <td class="num mono">${D.slr7? Math.round(D.slr7)+':1' : '—'}</td>
      <td class="num mono"><span class="pill ${slCls}">${sl==null?'—': f0(sl)+' ft'}</span></td>
      <td class="num mono">${D.gust7!=null? `<span class="${D.gust7>=40?'pill low':''}">${f0(D.gust7)}</span>` : '—'}</td>
    </tr>`; }).join('') || `<tr><td colspan="12" class="muted" style="padding:20px">${Object.keys(state.derived).length?'No locations match the filter.':'Waiting for data.'}</td></tr>`;
  $$('#ledger th').forEach(th=>th.onclick=()=>{ const k=th.dataset.k; if(state.sortKey===k) state.sortDir=state.sortDir==='asc'?'desc':'asc'; else { state.sortKey=k; state.sortDir = k==='name'||k==='driveHrs'?'asc':'desc'; } renderLedger(); });
  $$('#ledger .star').forEach(b=>b.onclick=e=>{ e.stopPropagation(); toggleFav(b.dataset.fav); });
  $$('#ledger tr.row').forEach(tr=>{ tr.onclick=()=>openDetail(tr.dataset.id); tr.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openDetail(tr.dataset.id);} }; });
  bindTips($('#ledger'));
}

/* ---------- Map ---------- */
const MAP = {lon0:-114.4, lon1:-103.6, lat0:35.5, lat1:44.1, W:820, H:0};
MAP.H = Math.round(MAP.W*(MAP.lat1-MAP.lat0)/((MAP.lon1-MAP.lon0)*Math.cos(39*Math.PI/180)));
const px = lon=> (lon-MAP.lon0)/(MAP.lon1-MAP.lon0)*MAP.W;
const py = lat=> (MAP.lat1-lat)/(MAP.lat1-MAP.lat0)*MAP.H;
const ROADS = {
  'I-70':[[-104.99,39.74],[-105.51,39.74],[-106.07,39.63],[-106.37,39.64],[-107.32,39.55],[-108.55,39.06],[-110.16,38.99],[-111.86,38.96],[-112.58,38.60]],
  'I-15':[[-113.58,37.10],[-113.06,37.68],[-112.64,38.28],[-112.58,38.60],[-111.84,39.71],[-111.66,40.23],[-111.89,40.76],[-111.97,41.22],[-112.02,41.51],[-112.10,42.0]],
  'I-80':[[-111.89,40.76],[-111.50,40.72],[-110.96,41.27],[-109.20,41.59],[-107.24,41.79],[-105.59,41.31],[-104.82,41.14]],
  'I-25':[[-104.82,41.14],[-104.99,39.74],[-104.82,38.83],[-104.61,38.25],[-104.50,37.17],[-104.44,36.90],[-105.94,35.69]],
  'US-160':[[-104.78,37.63],[-105.87,37.47],[-106.80,37.48],[-107.01,37.27],[-107.88,37.28],[-108.59,37.35]],
  'US-550':[[-107.88,37.28],[-107.66,37.81],[-107.67,38.02],[-107.88,38.48],[-108.55,39.06]],
  'US-285':[[-104.99,39.74],[-105.50,39.50],[-106.00,39.22],[-106.13,38.84],[-106.08,38.51],[-106.14,38.09],[-105.87,37.47]],
  'US-40':[[-105.51,39.74],[-105.78,39.80],[-105.93,40.08],[-106.62,40.38],[-106.83,40.49],[-107.63,40.52]],
  'US-6':[[-105.87,39.66],[-105.90,39.68]],
};
const RANGES=[{n:'WASATCH',lat:41.0,lon:-111.62},{n:'UINTAS',lat:40.72,lon:-110.6},{n:'SAN JUANS',lat:37.72,lon:-107.4},{n:'SAWATCH',lat:38.95,lon:-106.45},{n:'ELKS',lat:39.05,lon:-107.15},{n:'FRONT RANGE',lat:40.15,lon:-105.62},{n:'PARK RANGE',lat:40.72,lon:-106.72},{n:'SANGRE DE CRISTO',lat:36.95,lon:-105.25},{n:'TETONS',lat:43.65,lon:-110.75},{n:'GRAND MESA',lat:39.0,lon:-107.95},{n:'MEDICINE BOW',lat:41.45,lon:-106.3},{n:'TUSHARS',lat:38.35,lon:-112.4},{n:'MARKAGUNT',lat:37.6,lon:-112.85}];
let mapTimer=null;
function renderMapDays(){
  const D=state.derived[LOCATIONS[0].id]; if(!D) return;
  const frs=frameList(); if(state.mapFrame>=frs.length) state.mapFrame=0;
  const cur=frs[state.mapFrame];
  let html=`<button class="play" id="mapPlay" title="Animate through the week">${mapTimer?'■ Stop':'▶ Play'}</button>`;
  html+=`<button aria-pressed="${state.mapMode==='day'&&state.mapDay==='all'}" data-d="all">7-day total</button>`;
  html+=`<button aria-pressed="${state.mapMode==='6h'}" data-mode="6h" title="Six-hour frames">6-hour frames</button>`;
  if(state.mapMode==='day') html+=frs.map(d=>`<button aria-pressed="${state.mapDay===d.key}" data-d="${d.key}">${d.label.split(',')[0]}</button>`).join('');
  else html+=`<div class="frameSlider"><input type="range" id="frameRange" min="0" max="${frs.length-1}" value="${state.mapFrame}" aria-label="Six-hour frame"><span class="lbl">${cur?cur.label:''}</span></div>`;
  $('#mapDays').innerHTML=html;
  $$('#mapDays button[data-d]').forEach(b=>b.onclick=()=>{ stopMap(); state.mapMode='day'; state.mapDay = b.dataset.d==='all'?'all':+b.dataset.d; state.mapFrame=Math.max(0,frs.findIndex(f=>f.key===state.mapDay)); renderMapDays(); renderMap(); });
  const mb=$('#mapDays button[data-mode]'); if(mb) mb.onclick=()=>{ stopMap(); state.mapMode= state.mapMode==='6h'?'day':'6h'; state.mapFrame=0; if(state.mapMode==='day') state.mapDay='all'; renderMapDays(); renderMap(); };
  const rg=$('#frameRange'); if(rg) rg.oninput=()=>{ stopMap(); state.mapFrame=+rg.value; const f=frameList()[state.mapFrame]; $('#mapDays .lbl').textContent=f.label; renderMap(); };
  $('#mapPlay').onclick=()=>{ if(mapTimer){ stopMap(); renderMapDays(); return; } const list=frameList(); let k=state.mapMode==='day'?0:state.mapFrame; const step=()=>{ const f=list[k%list.length]; state.mapFrame=k%list.length; if(state.mapMode==='day') state.mapDay=f.key; k++; renderMapDays(); renderMap(); }; step(); mapTimer=setInterval(step, state.mapMode==='day'?1100:450); renderMapDays(); };
}
function stopMap(){ if(mapTimer){ clearInterval(mapTimer); mapTimer=null; } }
function dayVal(D, dKey){ if(dKey==='all') return {snow:D.d7, flow:D.flow7, fit:D.fit7}; const d=D.days.find(x=>x.d===dKey); return d? {snow:d.blend, flow:d.flow, fit:d.fit} : {snow:0}; }
function curFrame(){ const frs=frameList(); if(state.mapMode==='day') return state.mapDay==='all'? {key:'all',label:'7-day total'} : (frs.find(f=>f.key===state.mapDay)||{key:'all',label:'7-day total'}); return frs[Math.min(state.mapFrame, frs.length-1)]; }
state.mapView = state.mapView || {x:0,y:0,w:MAP.W,h:MAP.H}; state.map3d = state.map3d || false; state.mapFocus = state.mapFocus || null;
function mapZoomFactor(){ return state.mapView.w/MAP.W; }
function screenXY(X,Y){ const svg=$('#map svg'); if(!svg) return [0,0]; const r=svg.getBoundingClientRect(); const vb=state.mapView; return [(X-vb.x)/vb.w*r.width, (Y-vb.y)/vb.h*r.height]; }
function clampView(v){ const minW=MAP.W/10, maxW=MAP.W; let w=Math.max(minW,Math.min(maxW,v.w)); const h=w*MAP.H/MAP.W; let x=Math.max(-w*0.25, Math.min(MAP.W-w*0.75, v.x)), y=Math.max(-h*0.25, Math.min(MAP.H-h*0.75, v.y)); return {x,y,w,h}; }
function setView(v){ state.mapView=clampView(v); applyView(); }
function applyView(){ const svg=$('#map svg'); if(!svg) return; const vb=state.mapView; svg.setAttribute('viewBox',`${vb.x} ${vb.y} ${vb.w} ${vb.h}`); const z=mapZoomFactor();
  svg.querySelectorAll('[data-r]').forEach(c=>c.setAttribute('r', (+c.dataset.r)*z)); svg.querySelectorAll('[data-fs]').forEach(t=>t.setAttribute('font-size', (+t.dataset.fs)*z)); svg.querySelectorAll('[data-sw]').forEach(e=>e.setAttribute('stroke-width', (+e.dataset.sw)*z));
  svg.querySelectorAll('g[data-arrow]').forEach(g=>{ g.setAttribute('transform', g.dataset.arrow.replace('SCALE', `scale(${z})`)); });
  renderBars(); renderPopup(); }
function zoomAt(factor, cx, cy){ const vb=state.mapView; const svg=$('#map svg'); const r=svg.getBoundingClientRect(); const fx=(cx-r.left)/r.width, fy=(cy-r.top)/r.height; const nw=Math.max(MAP.W/10,Math.min(MAP.W,vb.w*factor)); const nh=nw*MAP.H/MAP.W; setView({x: vb.x+fx*(vb.w-nw), y: vb.y+fy*(vb.h-nh), w:nw, h:nh}); }
function zoomTo(X,Y,targetW){ const nw=Math.min(state.mapView.w, targetW); const nh=nw*MAP.H/MAP.W; setView({x:X-nw/2, y:Y-nh/2, w:nw, h:nh}); }
let mapWired=false;
function wireMap(){ if(mapWired) return; mapWired=true; const stage=$('#mapStage'); let drag=null, pinch=null;
  stage.addEventListener('wheel', e=>{ e.preventDefault(); zoomAt(e.deltaY>0?1.18:1/1.18, e.clientX, e.clientY); }, {passive:false});
  const ptrs=new Map();
  stage.addEventListener('pointerdown', e=>{ if(e.target.closest('.mapCtl')||e.target.closest('#mapPopup')) return; ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY}); stage.setPointerCapture(e.pointerId); if(ptrs.size===1){ drag={sx:e.clientX, sy:e.clientY, vx:state.mapView.x, vy:state.mapView.y, moved:false, target:e.target}; } else if(ptrs.size===2){ const [a,b]=[...ptrs.values()]; pinch={d:Math.hypot(a.x-b.x,a.y-b.y), w:state.mapView.w, cx:(a.x+b.x)/2, cy:(a.y+b.y)/2}; drag=null; } });
  stage.addEventListener('pointermove', e=>{ if(!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY}); const svg=$('#map svg'); if(!svg) return; const r=svg.getBoundingClientRect();
    if(pinch && ptrs.size===2){ const [a,b]=[...ptrs.values()]; const d=Math.hypot(a.x-b.x,a.y-b.y); const nw=pinch.w*(pinch.d/Math.max(10,d)); const vb=state.mapView; const fx=(pinch.cx-r.left)/r.width, fy=(pinch.cy-r.top)/r.height; const cw=Math.max(MAP.W/10,Math.min(MAP.W,nw)); const ch=cw*MAP.H/MAP.W; setView({x: vb.x+fx*(vb.w-cw), y: vb.y+fy*(vb.h-ch), w:cw, h:ch}); return; }
    if(drag){ const dx=e.clientX-drag.sx, dy=e.clientY-drag.sy; if(Math.hypot(dx,dy)>4){ drag.moved=true; stage.classList.add('dragging'); } if(drag.moved){ const vb=state.mapView; setView({x: drag.vx - dx/r.width*vb.w, y: drag.vy - dy/r.height*vb.h, w:vb.w, h:vb.h}); } } });
  const up=e=>{ ptrs.delete(e.pointerId); stage.classList.remove('dragging'); if(ptrs.size<2) pinch=null; if(drag && !drag.moved){ const g=drag.target.closest&&drag.target.closest('.loc'); if(g){ focusLocation(g.dataset.id); } else if(!drag.target.closest('#mapPopup')) { state.mapFocus=null; renderPopup(); } } drag=null; };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  stage.addEventListener('dblclick', e=>{ if(e.target.closest('.mapCtl')||e.target.closest('#mapPopup')) return; zoomAt(0.5, e.clientX, e.clientY); });
  $('#mapZoomIn').onclick=()=>{ const r=$('#map svg').getBoundingClientRect(); zoomAt(1/1.5, r.left+r.width/2, r.top+r.height/2); };
  $('#mapZoomOut').onclick=()=>{ const r=$('#map svg').getBoundingClientRect(); zoomAt(1.5, r.left+r.width/2, r.top+r.height/2); };
  $('#mapReset').onclick=()=>{ state.mapFocus=null; setView({x:0,y:0,w:MAP.W,h:MAP.H}); };
  $('#map3d').onclick=()=>{ state.map3d=!state.map3d; $('#mapStage').classList.toggle('is3d', state.map3d); $('#map3d').setAttribute('aria-pressed', state.map3d); renderBars(); renderPopup(); };
}
function focusLocation(id){ const l=LOCATIONS.find(x=>x.id===id); if(!l) return; state.mapFocus=id; const X=px(l.lon), Y=py(l.lat); if(state.mapView.w>MAP.W/3) zoomTo(X,Y,MAP.W/3.2); else renderPopup(); }
function renderPopup(){ const pop=$('#mapPopup'); if(!pop) return; const id=state.mapFocus; const l=id&&LOCATIONS.find(x=>x.id===id); const D=l&&state.derived[id]; if(!l||!D){ pop.hidden=true; return; }
  const fr=curFrame(); const v= fr.key==='all'? dayVal(D,'all') : frameVal(D, fr); const [sx,sy]=screenXY(px(l.lon),py(l.lat)); const fl=fitLabel(v.fit, v.flow);
  pop.hidden=false; pop.style.left=sx+'px'; pop.style.top=(sy-8)+'px';
  pop.innerHTML=`<h3>${esc(l.name)} <span class="muted" style="font-family:var(--body);font-size:11px;font-weight:400">${l.state} · ${l.driveHrs} h</span></h3>
    <div class="row"><span class="muted">${esc(fr.label||'7-day')}</span><b>${inch(v.snow)} in</b></div>
    <div class="row"><span class="muted">next 24 h / 7 day</span><b>${inch(D.d1)} / ${inch(D.d7)} in</b></div>
    ${D.hasPast?`<div class="row"><span class="muted">last 24 h (est.)</span><b>${inch(D.p1)} in</b></div>`:''}
    <div class="row"><span class="muted">flow</span><span>${v.flow?degToCompass(v.flow.dir)+' '+f0(v.flow.spd)+' mph · ':''}<span class="pill ${fl.cls}">${fl.t}</span></span></div>
    <div class="row"><span class="muted">agreement</span><span class="pill ${D.conf.cls}">${D.conf.t}</span></div>
    <div class="acts"><button class="btn sm primary" id="popOpen">Open details</button><button class="btn sm" id="popPin">${isFav(id)?'★ Unpin':'☆ Pin'}</button><button class="btn sm" id="popClose">✕</button></div>`;
  $('#popOpen').onclick=()=>openDetail(id); $('#popPin').onclick=()=>toggleFav(id); $('#popClose').onclick=()=>{ state.mapFocus=null; renderPopup(); }; }
function renderBars(){ const el=$('#mapBars'); if(!el) return; if(!state.map3d){ el.innerHTML=''; return; }
  const fr=curFrame(); const vals=visRows().map(x=>({l:x.l, v: fr.key==='all'? dayVal(x.D,'all') : frameVal(x.D, fr)})); const max=Math.max(2,...vals.map(x=>x.v.snow||0));
  const svg=$('#map svg'); if(!svg) return; const H=svg.getBoundingClientRect().height; const scale=(H*0.3)/max;
  el.innerHTML=vals.map(({l,v})=>{ const [sx,sy]=screenXY(px(l.lon),py(l.lat)); const h=Math.max(2,(v.snow||0)*scale); return `<div class="bar3d ${isFav(l.id)?'pinned':''}" style="left:${sx}px;top:${sy-h}px;height:${h}px;opacity:${(v.snow||0)>0.3?1:.35}">${(v.snow||0)>=max*0.3||isFav(l.id)?`<b>${esc(l.short||l.name)} ${inch(v.snow)}"</b>`:''}</div>`; }).join(''); }
function renderMap(){
  const fr=curFrame(); const vals=visRows().map(x=>Object.assign(x, fr.key==='all'? dayVal(x.D,'all') : frameVal(x.D, fr)));
  const max=Math.max(2,...vals.map(v=>v.snow||0));
  const rect=(a,b,c,d)=>`M${px(a)},${py(b)}L${px(c)},${py(b)}L${px(c)},${py(d)}L${px(a)},${py(d)}Z`;
  const states = `<rect class="mapbg" x="${-MAP.W}" y="${-MAP.H}" width="${MAP.W*3}" height="${MAP.H*3}"/>
    <path d="${rect(-109.05,41,-102.05,37)}" fill="none" stroke="var(--axis)" data-sw="1.2" stroke-width="1.2"/>
    <path d="M${px(-114.05)},${py(42)}L${px(-111.05)},${py(42)}L${px(-111.05)},${py(41)}L${px(-109.05)},${py(41)}L${px(-109.05)},${py(37)}L${px(-114.05)},${py(37)}Z" fill="none" stroke="var(--axis)" data-sw="1.2" stroke-width="1.2"/>
    <path d="${rect(-111.05,45,-104.05,41)}" fill="none" stroke="var(--axis)" data-sw="1.2" stroke-width="1.2"/>
    <path d="${rect(-109.05,37,-103.0,31.3)}" fill="none" stroke="var(--axis)" data-sw="1.2" stroke-width="1.2"/>
    <text x="${px(-106.9)}" y="${py(37.2)}" fill="var(--fg-3)" data-fs="11" font-size="11" font-family="var(--display)" letter-spacing="3">COLORADO</text>
    <text x="${px(-113.9)}" y="${py(37.2)}" fill="var(--fg-3)" data-fs="11" font-size="11" font-family="var(--display)" letter-spacing="3">UTAH</text>
    <text x="${px(-108.9)}" y="${py(42.6)}" fill="var(--fg-3)" data-fs="11" font-size="11" font-family="var(--display)" letter-spacing="3">WYOMING</text>
    <text x="${px(-107.2)}" y="${py(35.75)}" fill="var(--fg-3)" data-fs="11" font-size="11" font-family="var(--display)" letter-spacing="3">NEW MEXICO</text>`;
  const roads = Object.entries(ROADS).map(([n,pts])=>`<path d="M${pts.map(p=>`${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join('L')}" fill="none" stroke="var(--road)" data-sw="${n.startsWith('I-')?2:1.2}" stroke-width="${n.startsWith('I-')?2:1.2}" stroke-linejoin="round" stroke-linecap="round" data-tip="${n}"/>`).join('');
  const ranges = RANGES.map(r=>`<text x="${px(r.lon)}" y="${py(r.lat)}" text-anchor="middle" data-fs="8.5" font-size="8.5" fill="var(--range)" letter-spacing="1.5" font-family="var(--display)">${r.n}</text>`).join('');
  const cities = [{n:'Denver',lat:39.739,lon:-104.990},{n:'Salt Lake City',lat:40.761,lon:-111.891},{n:'Grand Junction',lat:39.064,lon:-108.550},{n:'Durango',lat:37.275,lon:-107.880},{n:'Laramie',lat:41.31,lon:-105.59},{n:'Santa Fe',lat:35.69,lon:-105.94}].map(c=>`<g><circle cx="${px(c.lon)}" cy="${py(c.lat)}" data-r="3" r="3" fill="var(--fg-2)"/><text x="${px(c.lon)+7}" y="${py(c.lat)+4}" data-fs="10" font-size="10" fill="var(--fg-2)">${c.n}</text></g>`).join('');
  const labelSet = new Set([...vals].sort((a,b)=>(b.snow||0)-(a.snow||0)).slice(0,10).map(v=>v.l.id));
  const dots = vals.sort((a,b)=>(a.snow||0)-(b.snow||0)).map(v=>{
    const r = 4+Math.sqrt((v.snow||0)/max)*17; const x=px(v.l.lon), y=py(v.l.lat); const col=seqColor(v.snow,max); const heavy=(v.snow||0)>=max*0.6; const fav=isFav(v.l.id);
    const al=Math.min(18,(v.flow?v.flow.spd:0)/3); const arrow = v.flow? `<g data-arrow="translate(${x},${y}) SCALE rotate(${(v.flow.dir+180)%360})" transform="translate(${x},${y}) rotate(${(v.flow.dir+180)%360})"><line x1="0" y1="${-r-2}" x2="0" y2="${-r-6-al}" stroke="var(--fg-2)" stroke-width="1.5"/><path d="M-3,${-r-4-al} L0,${-r-8-al} L3,${-r-4-al}" fill="none" stroke="var(--fg-2)" stroke-width="1.5"/></g>` : '';
    const tip = `<b>${esc(v.l.name)}</b> ${v.l.state}<br>${fr.key==='all'?'7-day':'frame'} blended: <b>${inch(v.snow)} in</b>${v.flow?`<br>700 mb flow: ${degToCompass(v.flow.dir)} ${f0(v.flow.spd)} mph · ${fitLabel(v.fit,v.flow).t}`:''}<br><span class="muted">click to focus · scroll to zoom · drag to pan</span>`;
    return `<g class="loc" tabindex="0" data-id="${v.l.id}" data-tip="${esc(tip)}" style="cursor:pointer">${arrow}${heavy?`<circle cx="${x}" cy="${y}" data-r="${r+6}" r="${r+6}" fill="${col}" opacity=".25" filter="url(#glow)"/>`:''}<circle cx="${x}" cy="${y}" data-r="${r}" r="${r}" fill="${col==='transparent'?'var(--panel)':col}" stroke="${fav?'#f5b800':'var(--fg-2)'}" data-sw="${fav?2.5:1}" stroke-width="${fav?2.5:1}" fill-opacity="${col==='transparent'?1:.9}"/>${fav?`<text x="${x}" y="${y+4}" text-anchor="middle" data-fs="11" font-size="11" fill="#f5b800" font-weight="800">★</text>`:''}${(labelSet.has(v.l.id)&&(v.snow||0)>0.5)||v.l.pin||fav?`<text x="${x}" y="${y-r-(v.flow?12:4)}" text-anchor="middle" data-fs="10" font-size="10" font-weight="600" fill="var(--fg)" paint-order="stroke" stroke="var(--panel)" stroke-width="3">${esc(v.l.short||v.l.name)}</text>`:''}</g>`;
  }).join('');
  const dayLabel = fr.label||'';
  let trackSvg=''; const trAll=stormTrack().filter(Boolean); const tr=trAll.filter(x=>!x.none);
  if(tr.length){ const pts=tr.map(x=>[px(x.lon),py(x.lat)]);
    if(pts.length>1) trackSvg+=`<path d="M${pts.map(p=>p.join(',')).join('L')}" fill="none" stroke="var(--s7)" data-sw="2" stroke-width="2" stroke-dasharray="5 4" opacity=".75"/>`;
    const curIdx = fr.key==='all'? -1 : tr.findIndex(x=>x.fr.key===fr.key);
    tr.forEach((x,k)=>{ const [X,Y]=pts[k]; const on=k===curIdx; trackSvg+=`<g data-tip="${esc(`<b>500 mb low centre</b><br>${x.fr.label}<br>lowest heights near ${x.l.name} (${f0(x.v)} m); ${f0(x.spread)} m gradient across the region`)}"><circle cx="${X}" cy="${Y}" data-r="${on?14:6}" r="${on?14:6}" fill="${on?'var(--s7)':'var(--panel)'}" stroke="var(--s7)" data-sw="2" stroke-width="2"/><text x="${X}" y="${Y+(on?5.5:3.5)}" text-anchor="middle" data-fs="${on?16:9}" font-size="${on?16:9}" font-weight="800" fill="${on?'#fff':'var(--s7)'}" font-family="var(--display)">L</text></g>`; }); }
  const curNone = fr.key!=='all' && trAll.find(x=>x.fr.key===fr.key && x.none);
  if(curNone) trackSvg+=`<text x="${MAP.W-10}" y="42" text-anchor="end" font-size="11" fill="var(--fg-3)">flat upper-air pattern this frame: no defined low</text>`;
  const vb=state.mapView;
  $('#map').innerHTML = `<svg viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" role="img" aria-label="Map of forecast snowfall"><defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>${states}${roads}${ranges}${cities}${trackSvg}${dots}<text x="${MAP.W-10}" y="22" text-anchor="end" font-family="var(--display)" font-size="20" font-weight="700" fill="var(--fg)" data-fs="20">${esc(dayLabel)}</text></svg>`;
  $('#mapLegend').innerHTML = `<span>Dot size and shade = blended snowfall (max ${inch(max)} in)</span><span><span class="sw" style="background:var(--seq2)"></span>light</span><span><span class="sw" style="background:var(--seq4)"></span>moderate</span><span><span class="sw" style="background:var(--seq7)"></span>heavy</span><span>→ arrow = where the 700 mb wind blows during precipitation (length = speed)</span><span><span class="ln" style="background:var(--road)"></span>interstates and highways</span><span><b style="color:var(--s7)">L</b> = 500 mb low centre each frame (the storm track); dashed line = its path through the week</span><span>★ = pinned</span><span class="muted">Scroll or pinch to zoom, drag to pan, click a dot to focus, 3D to raise snowfall columns.</span>`;
  bindTips($('#map')); wireMap(); $('#mapStage').classList.toggle('is3d', state.map3d); $('#map3d').setAttribute('aria-pressed', state.map3d);
  applyView();
}
/* ---------- Pattern read ---------- */
function renderPattern(){
  const locs=visRows(); if(!locs.length){ $('#pattern').innerHTML=''; return; }
  const byRegion={}; locs.forEach(x=>{ (byRegion[x.l.region]=byRegion[x.l.region]||[]).push(x); });
  const regs=Object.entries(byRegion).map(([r,xs])=>({r, avg:mean(xs.map(x=>x.D.d7)), top:[...xs].sort((a,b)=>b.D.d7-a.D.d7)[0]})).sort((a,b)=>b.avg-a.avg);
  const windows = stormWindows(locs); const parts=[];
  if(regs.length){ const w=regs[0], d=regs[regs.length-1]; parts.push(`<p><b>Who wins this week:</b> ${esc(w.r)} averages <b>${inch(w.avg)} in</b> across its locations (best: ${esc(w.top.l.name)}, ${inch(w.top.D.d7)} in). ${regs.length>1?`${esc(d.r)} is the quietest at ${inch(d.avg)} in.`:''}</p>`); }
  if(windows.length){ parts.push(`<p><b>Storm windows:</b> `+windows.map((w,i)=>`${i+1}) ${fmtDT(w.start)} → ${fmtDT(w.end)}${w.flow?` on ${degToCompass(w.flow.dir)} 700 mb flow (${f0(w.flow.spd)} mph)`:''}, biggest at ${esc(w.top[0].l.name)} (${inch(w.top[0].v)} in)`).join('; ')+`.</p>`); }
  else parts.push('<p><b>Storm windows:</b> no organized storm (≥0.15 in/hr anywhere) in the next 7 days for the selected locations.</p>');
  const tr=locs.map(x=>x.D.trough).filter(t=>t&&t.drop>40); if(tr.length){ const med=median(tr.map(t=>t.t)); const drop=mean(tr.map(t=>t.drop)); parts.push(`<p><b>Upper-air trough:</b> 500 mb heights bottom out around <b>${fmtDT(med)}</b> (a ${f0(drop)} m dip, ${drop>120?'a deep, well-defined trough':drop>70?'a moderate trough':'a weak wave'}). Snow is heaviest in the moist SW-to-W flow ahead of the axis and turns to colder, lighter NW-flow snow behind it.</p>`); }
  const fits=locs.filter(x=>x.D.fit7!=null && x.D.d7>=2); if(fits.length){ const fav=fits.filter(x=>x.D.fit7>=0.4).map(x=>x.l.name).slice(0,6), sh=fits.filter(x=>x.D.fit7<=-0.4).map(x=>x.l.name).slice(0,6);
    parts.push(`<p><b>Orographics:</b> ${fav.length?`the forecast flow lines up with the terrain at ${fav.map(esc).join(', ')}`:'no location has a strongly favorable flow'}${sh.length?`; ${sh.map(esc).join(', ')} sit in the rain shadow for this direction`:''}. Expect models to under-forecast favored slopes and over-forecast shadowed ones; coarse global grids smear precipitation across ranges.</p>`); }
  const cold=locs.filter(x=>x.D.t7000!=null&&x.D.d7>=2); if(cold.length){ const t=mean(cold.map(x=>x.D.t7000)); const s=mean(cold.map(x=>x.D.slr7).filter(Boolean)); parts.push(`<p><b>Snow quality:</b> 700 mb temperatures average <b>${f0(t)}°F (${f0(degC(t))}°C)</b> during snow → estimated ratios around <b>${s?Math.round(s):'—'}:1</b>. ${degC(t)<=-10?'Cold enough for low-density powder (dendrites grow best at −12 to −18 °C).':degC(t)<=-5?'Moderate density; good right-side-up snow.':'Warm storm: dense, heavy snow and possible rain at the bases.'}</p>`); }
  const windy=locs.filter(x=>x.D.gust7>=45).map(x=>`${esc(x.l.name)} (${f0(x.D.gust7)} mph)`).slice(0,5); if(windy.length) parts.push(`<p><b>Wind:</b> gusts above 45 mph at ${windy.join(', ')}. Expect wind holds on exposed lifts and wind-affected snow on ridgelines.</p>`);
  const disagree=locs.filter(x=>x.D.conf.cls==='low'&&x.D.d7>=3).map(x=>`${esc(x.l.name)} (${inch(x.D.mn)}–${inch(x.D.mx)})`).slice(0,5); if(disagree.length) parts.push(`<p><b>Low confidence:</b> models disagree most at ${disagree.join(', ')}. Load the ensemble in each location's detail before planning.</p>`);
  $('#pattern').innerHTML=parts.join('');
}
function stormWindows(locs){
  const D0=locs[0].D; const n=D0.n, t=D0.times; const inWin=new Array(n).fill(false);
  for(let i=D0.startIdx;i<n;i++){ if(locs.some(x=>(x.D.blend[i]||0)>=0.15)) inWin[i]=true; }
  const wins=[]; let cur=null, gap=0;
  for(let i=D0.startIdx;i<n;i++){ if(inWin[i]){ if(!cur) cur={a:i,b:i}; cur.b=i; gap=0; } else if(cur){ gap++; if(gap>=6){ wins.push(cur); cur=null; gap=0; } } }
  if(cur) wins.push(cur);
  return wins.map(w=>{ const per=locs.map(x=>{ let s=0; for(let i=w.a;i<=w.b;i++) s+=x.D.blend[i]||0; return {l:x.l,v:s}; }).sort((a,b)=>b.v-a.v);
    const fl=locs.map(x=>{ const days=x.D.days.filter(d=>d.t>=t[w.a]-86400&&d.t<=t[w.b]); return days.length&&days.some(d=>d.flow)? vecMean(days.map(d=>d.flow?d.flow.dir:null),days.map(d=>d.flow?d.flow.spd:null),days.map(d=>d.blend+0.01)) : null; }).filter(Boolean);
    return {start:t[w.a], end:t[w.b]+3600, top:per, flow: fl.length? vecMean(fl.map(f=>f.dir), fl.map(f=>f.spd)) : null}; });
}

/* ---------- Storm timing strips ---------- */
function renderStrips(){
  const locs=visRows().sort((a,b)=>a.l.lon-b.l.lon);
  if(!locs.length){ $('#stripes').innerHTML=''; $('#windows').innerHTML=''; return; }
  const D0=locs[0].D; const a=D0.pastIdx0||0, b=D0.n; const t=D0.times; const nowI=D0.startIdx;
  let head='<div class="strip hd"><div class="lab">west → east</div><div class="cells" style="height:auto;gap:0">'; let lastD=null; const labels=[]; for(let i=a;i<b;i++){ const d=dayIndex(t[i],state.offset); if(d!==lastD){ labels.push({i, txt:fmtDay(t[i])}); lastD=d; } }
  head += labels.map((L,k)=>{ const span=(labels[k+1]?labels[k+1].i:b)-L.i; return `<div style="grid-column:span ${span};font-size:11px;color:var(--fg-3);border-left:1px solid var(--line);padding-left:3px;white-space:nowrap;overflow:hidden">${L.txt}</div>`; }).join('')+'</div></div>';
  const rows = locs.map(({l,D})=>{ let tot=0; const cells=[]; for(let i=a;i<b;i++){ const v=D.blend[i]||0; if(i>=nowI) tot+=v; cells.push(`<i style="background:${seqColor(v,SNOW_MAX_HR)};${i<nowI?'opacity:.55':''}${i===nowI?';box-shadow:-2px 0 0 var(--fg)':''}" data-tip="${esc(`<b>${l.name}</b><br>${fmtDT(t[i])}: <b>${v.toFixed(2)} in/hr</b>${i<nowI?' (past, model estimate)':''}`)}"></i>`); }
    return `<div class="strip"><div class="lab" title="${esc(l.name)}"><a href="#" data-id="${l.id}" style="color:inherit;text-decoration:none">${esc(l.name)}</a> <span class="mono muted" title="last 3 days / next 7 days">${D.hasPast?inch(D.p3)+' / ':''}${inch(tot)}</span></div><div class="cells">${cells.join('')}</div></div>`; }).join('');
  $('#stripes').innerHTML=head+rows;
  $('#stripLegend').innerHTML=`<span>in/hr:</span><span><span class="sw" style="background:var(--seq1)"></span>trace</span><span><span class="sw" style="background:var(--seq3)"></span>0.3</span><span><span class="sw" style="background:var(--seq5)"></span>0.7</span><span><span class="sw" style="background:var(--seq7)"></span>${SNOW_MAX_HR}+</span><span class="muted">Dimmed cells on the left are the last 3 days (model estimate); the dark tick marks now. Totals are last 3 days / next 7 days.</span>`;
  bindTips($('#stripes'));
  $$('#stripes a').forEach(x=>x.onclick=e=>{ e.preventDefault(); openDetail(x.dataset.id); });
  const wins=stormWindows(locs);
  $('#windows').innerHTML = wins.length? wins.map((w,i)=>{ const fh=regionsFirstHit(locs,w); return `<div class="card" style="margin-bottom:10px"><h3>Storm ${i+1}: ${fmtDT(w.start)} → ${fmtDT(w.end)} <span class="muted small">(${Math.round((w.end-w.start)/3600)} h)</span></h3>
    <p class="small" style="margin:6px 0">${w.flow?`Mean 700 mb flow <b>${degToCompass(w.flow.dir)}</b> at ${f0(w.flow.spd)} mph: ${flowMeaning(w.flow.dir)}.`:'No pressure-level data for this window.'}${fh.length>1?` Arrival order: ${fh.map(x=>`${esc(x.r)} ${fmtDT(x.t)}`).join(' → ')}.`:''}</p>
    <div class="twocol"><div><div class="eyebrow">Most snow</div>${w.top.slice(0,6).map(x=>`<div style="display:flex;justify-content:space-between;gap:8px;font-size:13px"><span>${esc(x.l.name)}</span><b class="mono">${inch(x.v)} in</b></div>`).join('')}</div>
    <div><div class="eyebrow">Least snow</div>${w.top.slice(-6).reverse().map(x=>`<div style="display:flex;justify-content:space-between;gap:8px;font-size:13px"><span>${esc(x.l.name)}</span><b class="mono">${inch(x.v)} in</b></div>`).join('')}</div></div></div>`; }).join('') : '<p class="muted">No storm windows in the next 7 days for the selected locations.</p>';
}

/* ---------- Detail drawer ---------- */
function whyText(l, D){
  const p=[]; const fl=fitLabel(D.fit7,D.flow7);
  const peakDay=[...D.days].sort((a,b)=>b.blend-a.blend)[0];
  if(D.hasPast) p.push(`<p><b>Recent:</b> the models estimate <b>${inch(D.p1)} in</b> fell in the last 24 hours and <b>${inch(D.p3)} in</b> over the last 3 days${D.p3>=1?` (${D.pastLiq3.toFixed(2)} in of water)`:''}. The SNOTEL card below shows what the nearest gauge actually measured.</p>`);
  if(D.d7<1) p.push(`<p><b>Quiet week.</b> The blended forecast gives ${esc(l.name)} under an inch over 7 days; models range ${inch(D.mn)}–${inch(D.mx)} in.</p>`);
  else p.push(`<p><b>${inch(D.d7)} in over 7 days</b> (${state.prefs.blendMode==='mean'?'multi-model mean':state.prefs.blendMode==='median'?'multi-model median':'single model'}; range ${inch(D.mn)}–${inch(D.mx)} in across ${D.nModels} models, agreement <b>${D.conf.t}</b>). The heaviest day is <b>${peakDay.label}</b> with ${inch(peakDay.blend)} in${peakDay.peakT?`, peaking around ${fmtHour(peakDay.peakT)}`:''}. Liquid equivalent ≈ ${D.liq7.toFixed(2)} in.</p>`);
  if(D.flow7) p.push(`<p><b>Flow:</b> during precipitation the 700 mb wind (≈10,000 ft, the steering level for Rocky Mountain snow) averages <b>${degToCompass(D.flow7.dir)} at ${f0(D.flow7.spd)} mph</b> (${D.presSrc}). ${esc(l.name)} does best on <b>${(l.favored||[]).join('/')}</b> flow${l.shadowed&&l.shadowed.length?` and is shadowed on ${l.shadowed.join('/')}`:''}, so this pattern is <b>${fl.t}</b>${D.flow7.spd<6?' (winds this light, typical under the center of a cutoff low, give little orographic push either way)':D.flow7.steady<0.35?' (the direction swings around during the event, so terrain favoritism is weak)':''}. ${l.why?esc(l.why):''}</p>`);
  if(D.trough&&D.trough.drop>40) p.push(`<p><b>Upper air:</b> the 500 mb trough axis passes around <b>${fmtDT(D.trough.t)}</b> (heights fall ${f0(D.trough.drop)} m). Ahead of it the flow backs to SW and the air is moist; behind it the flow veers NW and turns colder, which is when NW-favored terrain gets its best snow.</p>`);
  if(D.t7000!=null){ const c=degC(D.t7000); p.push(`<p><b>Temperature and density:</b> 700 mb temps average <b>${f0(D.t7000)}°F (${c.toFixed(0)}°C)</b> while snowing, giving an estimated ratio of <b>${D.slr7?Math.round(D.slr7):'—'}:1</b> (${c<=-10?'light, low-density powder':c<=-5?'medium density':'dense, wet snow'}). ${D.fzl7!=null?`Freezing level ≈ ${f0(mFt(D.fzl7))} ft → snow level ≈ <b>${f0(mFt(D.fzl7)-1000)} ft</b>, which is ${mFt(D.fzl7)-1000>l.baseFt?`<b>above the ${f0(l.baseFt)} ft base</b>: rain or mix low, snow only up high`:`below the ${f0(l.baseFt)} ft base: snow top to bottom`}.`:''}</p>`); }
  if(D.rh7!=null) p.push(`<p><b>Moisture:</b> 700 mb relative humidity averages <b>${f0(D.rh7)}%</b> during snow${D.rh7>=85?' (saturated mountain layer, efficient snow production)':D.rh7>=70?' (moist but not saturated; totals depend on lift)':' (dry mid-levels; snow will be showery and hit-or-miss)'}.</p>`);
  if(D.gust7!=null&&D.d7>=1) p.push(`<p><b>Wind:</b> peak gusts of <b>${f0(D.gust7)} mph</b> this week${D.gust7>=45?'. Expect wind holds on upper lifts and transported snow on lee aspects (avalanche loading).':D.gust7>=30?'; some ridgeline transport, sheltered trees will ski best.':'; light winds, snow should stay where it lands.'}</p>`);
  if(D.wet&&D.dry&&D.wet!==D.dry&&D.d7>=2){ const w=MODELS.find(m=>m.id===D.wet), d=MODELS.find(m=>m.id===D.dry); p.push(`<p><b>Model spread:</b> ${w.short} is wettest at ${inch(D.perModel[D.wet].d7)} in and ${d.short} driest at ${inch(D.perModel[D.dry].d7)} in. ${D.conf.cls==='low'?'That is a big gap: the storm track or timing is unsettled, so lean on the ensemble percentiles below rather than any single run.':D.conf.cls==='med'?'Moderate spread, typical for days 3–7.':'Tight clustering, which usually means a well-handled, well-defined system.'}</p>`); }
  p.push(`<p><b>Powder score ${D.powder.total}/100</b> for the next 72 h: snow ${Math.round(D.powder.snow)}/45, ratio ${Math.round(D.powder.ratio)}/20, wind ${Math.round(D.powder.wind)}/15, agreement ${D.powder.conf}/12, flow fit ${Math.round(D.powder.fit)}/8.</p>`);
  return p.join('');
}
async function openDetail(id){
  const l=LOCATIONS.find(x=>x.id===id), D=state.derived[id]; if(!l||!D) return;
  state.selected=id; $$('#ledger tr.row').forEach(tr=>tr.setAttribute('aria-selected', tr.dataset.id===id));
  const dr=$('#drawer'); dr.classList.add('open'); $('#scrim').classList.add('on'); document.body.style.overflow='hidden'; dr.scrollTop=0;
  const el=$('#drawerInner');
  el.innerHTML = `<div class="head"><div style="flex:1;min-width:0"><div class="eyebrow">${esc(l.region)} · ${l.state}</div><h1>${esc(l.name)}</h1>
      <div class="facts"><span>Summit <b>${f0(l.summitFt)} ft</b></span><span>Base <b>${f0(l.baseFt)} ft</b></span><span>Drive <b>${l.driveHrs} h</b></span><span>NWS office <b>${l.nws}</b></span>${l.snotel?`<span>SNOTEL <b>${esc(l.snotelName||l.snotel)}</b></span>`:''}${l.avgSnow?`<span>Avg season <b>${l.avgSnow} in</b></span>`:''}<span>Powder score <b>${D.powder.total}</b></span></div></div>
      <button class="star" id="detailStar" aria-pressed="${isFav(l.id)}" title="Pin this mountain" style="font-size:26px">★</button><button class="btn" id="btnClose">Close ✕</button></div>
    <div class="stats" style="margin-top:0">
      <div class="stat"><div class="label">Last 24 h</div><div class="value" style="color:var(--fg-2)">${D.hasPast?inch(D.p1):'—'}<small> in</small></div><div class="sub" id="snotel24">model estimate</div></div>
      <div class="stat"><div class="label">Last 3 days</div><div class="value" style="color:var(--fg-2)">${D.hasPast?inch(D.p3):'—'}<small> in</small></div><div class="sub" id="snotel72">model estimate · ${D.pastLiq3!=null?D.pastLiq3.toFixed(2)+' in liquid':''}</div></div>
      <div class="stat"><div class="label">Next 24 h</div><div class="value">${inch(D.d1)}<small> in</small></div></div>
      <div class="stat"><div class="label">Next 72 h</div><div class="value">${inch(D.d3)}<small> in</small></div></div>
      <div class="stat"><div class="label">7 day blended</div><div class="value">${inch(D.d7)}<small> in</small> ${sparkDays(D.days,56,22)}</div><div class="sub">models ${inch(D.mn)}–${inch(D.mx)} in</div></div>
      <div class="stat"><div class="label">Agreement</div><div class="value"><span class="pill ${D.conf.cls}" style="font-size:16px">${D.conf.t}</span></div></div>
      <div class="stat"><div class="label">Flow fit</div><div class="value"><span class="pill ${fitLabel(D.fit7,D.flow7).cls}" style="font-size:16px">${fitLabel(D.fit7,D.flow7).t}</span></div><div class="sub">${D.flow7?degToCompass(D.flow7.dir)+' '+f0(D.flow7.spd)+' mph at 700 mb':'—'}</div></div>
    </div>
    <h2>When to go</h2>
    <div class="card" id="whenToGo"></div>
    <h2 style="margin-top:16px">Why this number</h2>
    <div class="why" id="why">${gloss(whyText(l,D))}</div>
    <div class="twocol" style="margin-top:16px">
      <div class="card"><h2>Daily snowfall by model</h2><div id="chDaily"></div><div class="legendRow" id="lgDaily"></div></div>
      <div class="card"><h2>Cumulative snowfall</h2><div id="chCum"></div><div class="legendRow" id="lgCum"></div><div style="margin-top:8px"><button class="btn sm" id="btnEns">Load ensembles (ECMWF 51 + GEFS 31 members)</button> <span class="small muted" id="ensNote"></span></div><div id="ensStats"></div></div>
    </div>
    <div class="card" style="margin-top:16px"><h2>Storm anatomy, hour by hour</h2><p class="small muted" style="margin:0 0 8px">Bars: blended snowfall per hour. Arrows: 700 mb wind (direction it blows toward; longer = stronger), green when favorable for this mountain, red when shadowed. Orange line: 700 mb temperature. Blue band: 700 mb humidity ≥ 80 %. Bottom lane: 500 mb height, with the trough axis marked.</p><div id="chHourly"></div></div>
    <div class="twocol" style="margin-top:16px">
      <div class="card"><h2>Day by day reasoning</h2><div id="dayTable"></div></div>
      <div class="card"><h2>Terrain and flow</h2><div id="rose"></div><p class="small" style="margin:8px 0 0">${esc(l.why||'')}</p><dl class="kv" style="margin-top:8px"><dt>Favored flow</dt><dd>${(l.favored||[]).join(', ')||'—'}</dd><dt>Shadowed on</dt><dd>${(l.shadowed||[]).join(', ')||'—'}</dd><dt>Upslope (east wind) helps</dt><dd>${l.upslope?'yes':'no'}</dd><dt>Lake effect</dt><dd>${l.lake?'yes (Great Salt Lake)':'no'}</dd><dt>Typical ratio</dt><dd>${l.slrTypical||'—'}:1</dd>${l.avalanche?`<dt>Avalanche center</dt><dd>${esc(l.avalanche)}</dd>`:''}</dl></div>
    </div>
    <div class="twocol" style="margin-top:16px">
      <div class="card"><h2>NWS official forecast (${l.nws} gridpoint)</h2><div id="nwsGrid" class="small muted">Loading…</div></div>
      <div class="card"><h2>SNOTEL ground truth</h2><div id="snotel" class="small muted">${l.snotel?'Loading…':'No SNOTEL assigned.'}</div></div>
    </div>
    <div class="card" style="margin-top:16px"><h2>Forecaster's discussion — NWS ${l.nws}</h2><p class="small muted" style="margin:0 0 8px">The Area Forecast Discussion is where the human forecaster explains the reasoning, model preferences and confidence. Mountain-relevant words are highlighted.</p><div id="afd" class="small muted">Loading…</div></div>
    <div class="card" style="margin-top:16px"><h2>Live cams</h2><p class="small muted" style="margin:0 0 8px">Resort cams plus the road cams on the way. Click a frame to enlarge; stills refresh every minute.</p><div id="detailCams"></div></div>
    <div class="card" style="margin-top:16px"><h2>Every hour, every model</h2><details><summary>Open the full hourly table (${D.n-D.startIdx} hours)</summary><div id="nerd" style="overflow:auto;max-height:480px;margin-top:8px"></div></details></div>
    <div class="card" style="margin-top:16px"><h2>Go deeper</h2><div id="links"></div></div>`;
  $('#btnClose').onclick=closeDetail; $('#detailStar').onclick=()=>toggleFav(l.id);
  drawWhenToGo(l,D); drawDaily(l,D); drawCum(l,D,null); drawHourly(l,D); drawDayTable(l,D); drawRose(l,D); drawLinks(l); drawNerd(l,D); drawDetailCams(l); bindTips($('#why'));
  if(state.ens[l.id]){ drawCum(l,D,state.ens[l.id]); drawEnsStats(l,state.ens[l.id]); $('#btnEns').hidden=true; }
  $('#btnEns').onclick=async()=>{ $('#btnEns').disabled=true; $('#ensNote').textContent='Loading ~80 ensemble members…'; const e=await fetchEnsemble(l); drawCum(l,D,e); drawEnsStats(l,e); $('#ensNote').textContent=''; };
  fetchNwsGrid(l).then(g=>drawNws(l,g)); fetchSnotel(l).then(s=>drawSnotel(l,s)); fetchAFD(l.nws).then(a=>drawAfd(l,a));
}
function closeDetail(){ $('#drawer').classList.remove('open'); $('#scrim').classList.remove('on'); document.body.style.overflow=''; state.selected=null; $$('#ledger tr.row').forEach(tr=>tr.setAttribute('aria-selected','false')); }

/* --- charts --- */
function chartFrame(w,h,m){ return {w,h,m, iw:w-m.l-m.r, ih:h-m.t-m.b}; }
function niceMax(v){ if(v<=0) return 1; const p=Math.pow(10,Math.floor(Math.log10(v))); const n=v/p; const s = n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10; return s*p; }
function drawDaily(l,D){
  const ids=MODELS.filter(m=>D.perModel[m.id]).map(m=>m.id); const days=[...(D.pastDays||[]), ...D.days]; const nPast=(D.pastDays||[]).length;
  const F=chartFrame(560,230,{l:34,r:8,t:10,b:28}); const maxV=niceMax(Math.max(1,...days.flatMap(d=>ids.map(id=>d.byModel[id]||0)), ...days.map(d=>d.blend)));
  const bw=F.iw/days.length; const gap=2; const n=ids.length; const barW=Math.min(14,(bw-16)/n);
  const y=v=>F.m.t+F.ih-(v/maxV)*F.ih;
  let s=`<svg viewBox="0 0 ${F.w} ${F.h}" width="100%" role="img" aria-label="Daily snowfall by model">`;
  for(let k=0;k<=4;k++){ const v=maxV*k/4; s+=`<line x1="${F.m.l}" x2="${F.w-F.m.r}" y1="${y(v)}" y2="${y(v)}" stroke="var(--grid)"/><text x="${F.m.l-4}" y="${y(v)+4}" text-anchor="end" font-size="10" fill="var(--fg-3)">${v%1?v.toFixed(1):v}</text>`; }
  if(nPast){ s+=`<rect x="${F.m.l}" y="${F.m.t}" width="${bw*nPast}" height="${F.ih}" fill="var(--panel-2)" opacity=".5"/><line x1="${F.m.l+bw*nPast}" x2="${F.m.l+bw*nPast}" y1="${F.m.t}" y2="${F.m.t+F.ih}" stroke="var(--fg-3)" stroke-dasharray="3 3"/><text x="${F.m.l+bw*nPast-4}" y="${F.m.t+10}" text-anchor="end" font-size="9" fill="var(--fg-3)">past</text><text x="${F.m.l+bw*nPast+4}" y="${F.m.t+10}" font-size="9" fill="var(--fg-3)">now →</text>`; }
  days.forEach((d,i)=>{ const x0=F.m.l+i*bw+(bw-n*barW-(n-1)*gap)/2;
    ids.forEach((id,k)=>{ const v=d.byModel[id]; if(v==null) return; const m=MODELS.find(x=>x.id===id); const x=x0+k*(barW+gap); const yy=y(v); const h=F.m.t+F.ih-yy;
      s+=`<rect x="${x}" y="${yy}" width="${barW}" height="${Math.max(0,h)}" fill="${m.color}" opacity="${d.past?.55:1}" rx="${h>4?3:0}" ry="${h>4?3:0}" data-tip="${esc(`<b>${inch(v)} in</b> ${m.name}<br>${d.label}${d.past?' (past, model estimate)':''}`)}"></rect>`; });
    s+=`<line x1="${F.m.l+i*bw+4}" x2="${F.m.l+(i+1)*bw-4}" y1="${y(d.blend)}" y2="${y(d.blend)}" stroke="var(--fg)" stroke-width="2" stroke-linecap="round"/>`;
    s+=`<text x="${F.m.l+i*bw+bw/2}" y="${F.h-10}" text-anchor="middle" font-size="10" fill="var(--fg-2)">${d.label.split(',')[0]}</text>`;
    s+=`<text x="${F.m.l+i*bw+bw/2}" y="${y(d.blend)-5}" text-anchor="middle" font-size="10" fill="var(--fg)" font-weight="600">${d.blend>=0.5?inch(d.blend):''}</text>`; });
  s+='</svg>';
  $('#chDaily').innerHTML=s; bindTips($('#chDaily'));
  $('#lgDaily').innerHTML = ids.map(id=>{ const m=MODELS.find(x=>x.id===id); const p=D.perModel[id]; return `<span><span class="sw" style="background:${m.color}"></span>${m.short} <span class="mono muted">${p.full?inch(p.d7):inch(p.d3)+' (72h)'}</span></span>`; }).join('')+'<span><span class="ln" style="background:var(--fg)"></span>blend</span>';
}
function drawCum(l,D,E){
  const ids=MODELS.filter(m=>D.perModel[m.id]).map(m=>m.id); const t=D.times, a=D.pastIdx0||0, n=D.n, nowI=D.startIdx;
  const series=ids.map(id=>{ const p=D.perModel[id]; let s=0; const pts=[]; for(let i=a;i<n;i++){ if(p.snow[i]==null){ if(i>nowI+2) break; else continue; } s+=p.snow[i]; pts.push([t[i],s]); } return {id, pts, m:MODELS.find(x=>x.id===id)}; });
  let s0=0; const bl=[]; for(let i=a;i<n;i++){ s0+=D.blend[i]||0; bl.push([t[i],s0]); }
  let maxV=Math.max(1,...series.map(x=>x.pts.length?x.pts[x.pts.length-1][1]:0), s0);
  if(E){ Object.values(E).forEach(e=>{ if(e.bands) maxV=Math.max(maxV, e.p.p90); }); }
  maxV=niceMax(maxV);
  const F=chartFrame(560,230,{l:34,r:8,t:10,b:28}); const t0=t[a], t1=t[n-1];
  const x=tt=>F.m.l+(tt-t0)/(t1-t0)*F.iw, y=v=>F.m.t+F.ih-(v/maxV)*F.ih;
  let s=`<svg viewBox="0 0 ${F.w} ${F.h}" width="100%" role="img" aria-label="Cumulative snowfall">`;
  for(let k=0;k<=4;k++){ const v=maxV*k/4; s+=`<line x1="${F.m.l}" x2="${F.w-F.m.r}" y1="${y(v)}" y2="${y(v)}" stroke="var(--grid)"/><text x="${F.m.l-4}" y="${y(v)+4}" text-anchor="end" font-size="10" fill="var(--fg-3)">${v%1?v.toFixed(1):v}</text>`; }
  let lastD=null; for(let i=a;i<n;i++){ const d=dayIndex(t[i],state.offset); if(d!==lastD){ lastD=d; s+=`<line x1="${x(t[i])}" x2="${x(t[i])}" y1="${F.m.t}" y2="${F.m.t+F.ih}" stroke="var(--grid)"/><text x="${x(t[i])+3}" y="${F.h-10}" font-size="10" fill="var(--fg-2)">${fmtDay(t[i]).split(',')[0]}</text>`; } }
  if(nowI>a){ s+=`<rect x="${F.m.l}" y="${F.m.t}" width="${x(t[nowI])-F.m.l}" height="${F.ih}" fill="var(--panel-2)" opacity=".5"/><line x1="${x(t[nowI])}" x2="${x(t[nowI])}" y1="${F.m.t}" y2="${F.m.t+F.ih}" stroke="var(--fg-3)" stroke-dasharray="3 3"/><text x="${x(t[nowI])+4}" y="${F.m.t+10}" font-size="9" fill="var(--fg-3)">now</text><text x="${x(t[nowI])-4}" y="${F.m.t+10}" text-anchor="end" font-size="9" fill="var(--fg-3)">last 3 days</text>`; }
  const lg=[];
  if(E){ const cols={ecmwf_ifs025:'var(--s2)', gfs025:'var(--s1)'}; Object.entries(E).forEach(([id,e])=>{ if(!e.bands) return; const path=(lo,hi)=>{ const up=e.bands.map(b=>`${x(b.t)},${y(b[hi])}`), dn=e.bands.slice().reverse().map(b=>`${x(b.t)},${y(b[lo])}`); return `M${up.join('L')}L${dn.join('L')}Z`; };
      s+=`<path d="${path('p10','p90')}" fill="${cols[id]}" fill-opacity=".10"/><path d="${path('p25','p75')}" fill="${cols[id]}" fill-opacity=".18"/>`; lg.push(`<span><span class="sw" style="background:${cols[id]};opacity:.35"></span>${e.name} 10–90 % / 25–75 %</span>`); }); }
  series.forEach(se=>{ if(!se.pts.length) return; s+=`<path d="M${se.pts.map(p=>`${x(p[0])},${y(p[1])}`).join('L')}" fill="none" stroke="${se.m.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`; const e=se.pts[se.pts.length-1]; s+=`<circle cx="${x(e[0])}" cy="${y(e[1])}" r="4" fill="${se.m.color}" stroke="var(--panel)" stroke-width="2"/>`; });
  s+=`<path d="M${bl.map(p=>`${x(p[0])},${y(p[1])}`).join('L')}" fill="none" stroke="var(--fg)" stroke-width="2.5"/>`;
  s+=`<rect id="cumHit" x="${F.m.l}" y="${F.m.t}" width="${F.iw}" height="${F.ih}" fill="transparent"/><line id="cumX" x1="0" x2="0" y1="${F.m.t}" y2="${F.m.t+F.ih}" stroke="var(--fg-3)" stroke-width="1" style="display:none"/></svg>`;
  $('#chCum').innerHTML=s;
  const hit=$('#cumHit'), xl=$('#cumX');
  hit.addEventListener('pointermove',e=>{ const r=hit.getBoundingClientRect(); const fr=(e.clientX-r.left)/r.width; const i=Math.max(a,Math.min(n-1,a+Math.round(fr*(n-1-a)))); const xx=x(t[i]); xl.setAttribute('x1',xx); xl.setAttribute('x2',xx); xl.style.display='';
    const rows=series.map(se=>{ const p=se.pts.find(q=>q[0]===t[i]) || se.pts[se.pts.length-1]; return `<div><span class="k" style="background:${se.m.color}"></span><b>${inch(p?p[1]:null)}</b> ${se.m.short}</div>`; }).join('');
    const b=bl[i-a]; let ens=''; if(E) Object.values(E).forEach(e=>{ if(!e.bands) return; const bb=e.bands.find(q=>q.t===t[i]); if(bb) ens+=`<div class="muted">${e.name.split(' ')[0]} median ${inch(bb.p50)} (${inch(bb.p10)}–${inch(bb.p90)})</div>`; });
    showTip(`<div class="muted">${fmtDT(t[i])}</div><div><span class="k" style="background:var(--fg)"></span><b>${inch(b?b[1]:null)}</b> blend</div>${rows}${ens}`, e.clientX, e.clientY); });
  hit.addEventListener('pointerleave',()=>{ xl.style.display='none'; hideTip(); });
  $('#lgCum').innerHTML = '<span><span class="ln" style="background:var(--fg)"></span>blend</span>'+series.map(se=>`<span><span class="ln" style="background:${se.m.color}"></span>${se.m.short}</span>`).join('')+lg.join('');
}
function drawEnsStats(l,E){
  const out=Object.values(E).map(e=>{ if(!e.bands) return `<div class="err">${esc(e.name)}: ${esc(e.err)}</div>`; return `<div style="margin-top:8px"><div class="eyebrow">${esc(e.name)} · 7-day totals</div>
    <div class="kv"><dt>10th / 50th / 90th percentile</dt><dd class="mono"><b>${inch(e.p.p10)} / ${inch(e.p.p50)} / ${inch(e.p.p90)} in</b></dd><dt>Chance of ≥ 6 in</dt><dd class="mono">${Math.round(e.prob(6)*100)}%</dd><dt>Chance of ≥ 12 in</dt><dd class="mono">${Math.round(e.prob(12)*100)}%</dd><dt>Chance of ≥ 24 in</dt><dd class="mono">${Math.round(e.prob(24)*100)}%</dd></div></div>`; }).join('');
  $('#ensStats').innerHTML = out + `<p class="small muted" style="margin:8px 0 0">Ensembles run the same model many times with slightly perturbed starting conditions. A wide 10–90 % band means the atmosphere is in a sensitive state and the point forecast above should not be trusted; a narrow band means confidence. The deterministic runs above are single members and routinely sit outside this band.</p>`;
}
function drawHourly(l,D){
  const t=D.times, a=D.pastIdx0||0, n=D.n, nowI=D.startIdx; const pres=D.pres;
  const has500 = pres && pres.h.geopotential_height_500hPa;
  const laneSnow=130, laneWind=44, laneT=60, lane500=has500?50:0;
  const F=chartFrame(900, 14+laneSnow+laneWind+laneT+lane500+26, {l:40,r:44,t:14,b:26});
  const maxV=niceMax(Math.max(0.5,...D.blend.slice(a)));
  const xw=F.iw/(n-a); const x=i=>F.m.l+(i-a)*xw; const ySnow=v=>F.m.t+laneSnow-(v/maxV)*laneSnow;
  let s=`<svg viewBox="0 0 ${F.w} ${F.h}" width="100%" role="img" aria-label="Hourly storm anatomy">`;
  if(nowI>a){ s+=`<rect x="${x(a)}" y="${F.m.t}" width="${x(nowI)-x(a)}" height="${F.ih}" fill="var(--panel-2)" opacity=".55"/>`; }
  if(pres&&pres.h.relative_humidity_700hPa){ for(let i=a;i<n;i++){ const j=pres.map.get(t[i]); const rh=j==null?null:pres.h.relative_humidity_700hPa[j]; if(rh!=null&&rh>=80) s+=`<rect x="${x(i)}" y="${F.m.t}" width="${xw}" height="${F.ih}" fill="var(--s1)" fill-opacity=".07"/>`; } }
  for(let k=0;k<=2;k++){ const v=maxV*k/2; s+=`<line x1="${F.m.l}" x2="${F.w-F.m.r}" y1="${ySnow(v)}" y2="${ySnow(v)}" stroke="var(--grid)"/><text x="${F.m.l-4}" y="${ySnow(v)+4}" text-anchor="end" font-size="10" fill="var(--fg-3)">${v}</text>`; }
  s+=`<text x="${F.m.l-4}" y="${F.m.t-3}" text-anchor="end" font-size="9" fill="var(--fg-3)">in/hr</text>`;
  let lastD=null; for(let i=a;i<n;i++){ const d=dayIndex(t[i],state.offset); if(d!==lastD){ lastD=d; s+=`<line x1="${x(i)}" x2="${x(i)}" y1="${F.m.t}" y2="${F.m.t+F.ih}" stroke="var(--axis)"/><text x="${x(i)+3}" y="${F.h-8}" font-size="10" fill="var(--fg-2)">${fmtDay(t[i]).split(',')[0]}</text>`; } }
  for(let i=a;i<n;i++){ const v=D.blend[i]||0; if(v>0.005) s+=`<rect x="${x(i)+0.5}" y="${ySnow(v)}" width="${Math.max(1,xw-1)}" height="${F.m.t+laneSnow-ySnow(v)}" fill="var(--seq5)" rx="1"/>`; }
  const yW=F.m.t+laneSnow+laneWind/2; s+=`<text x="${F.m.l-4}" y="${yW+3}" text-anchor="end" font-size="9" fill="var(--fg-3)">700 mb</text>`;
  if(pres){ for(let i=a;i<n;i+=3){ const j=pres.map.get(t[i]); if(j==null) continue; const d=pres.h.wind_direction_700hPa[j], sp=pres.h.wind_speed_700hPa[j]; if(d==null) continue; const len=4+Math.min(16,sp/4); const fit=fitScore(l,d); const col = fit>=0.5?'var(--good)':fit<=-0.5?'var(--bad)':'var(--fg-2)';
      s+=`<g transform="translate(${x(i)+xw*1.5},${yW}) rotate(${(d+180)%360})"><line x1="0" y1="${len/2}" x2="0" y2="${-len/2}" stroke="${col}" stroke-width="1.5"/><path d="M-3,${-len/2+4} L0,${-len/2} L3,${-len/2+4}" fill="none" stroke="${col}" stroke-width="1.5"/></g>`; }
    const yT0=F.m.t+laneSnow+laneWind, temps=[]; for(let i=a;i<n;i++){ const j=pres.map.get(t[i]); temps.push(j==null?null:pres.h.temperature_700hPa[j]); }
    const tv=temps.filter(v=>v!=null); if(tv.length){ const tmin=Math.floor(Math.min(...tv)/5)*5-5, tmax=Math.ceil(Math.max(...tv)/5)*5+5; const yT=v=>yT0+laneT-(v-tmin)/(tmax-tmin)*laneT;
      [tmin,tmax].forEach(v=>{ s+=`<text x="${F.w-F.m.r+4}" y="${yT(v)+3}" font-size="9" fill="var(--fg-3)">${v}°F</text>`; });
      const fz=yT(32); if(fz>yT0&&fz<yT0+laneT) s+=`<line x1="${F.m.l}" x2="${F.w-F.m.r}" y1="${fz}" y2="${fz}" stroke="var(--axis)"/><text x="${F.w-F.m.r+4}" y="${fz+3}" font-size="9" fill="var(--fg-3)">32°F</text>`;
      const m10=yT(14); if(m10>yT0&&m10<yT0+laneT) s+=`<line x1="${F.m.l}" x2="${F.w-F.m.r}" y1="${m10}" y2="${m10}" stroke="var(--grid)"/><text x="${F.w-F.m.r+4}" y="${m10+3}" font-size="9" fill="var(--fg-3)">−10°C</text>`;
      s+=`<path d="M${temps.map((v,k)=>v==null?null:`${x(a+k)+xw/2},${yT(v)}`).filter(Boolean).join('L')}" fill="none" stroke="var(--s2)" stroke-width="2"/>`; s+=`<text x="${F.m.l-4}" y="${yT0+laneT/2+3}" text-anchor="end" font-size="9" fill="var(--fg-3)">T 700</text>`; }
    if(has500){ const y50=yT0+laneT; const hs=[]; for(let i=a;i<n;i++){ const j=pres.map.get(t[i]); hs.push(j==null?null:pres.h.geopotential_height_500hPa[j]); } const hv=hs.filter(v=>v!=null); if(hv.length){ const hmin=Math.min(...hv), hmax=Math.max(...hv); const yH=v=>y50+lane500-4-(v-hmin)/Math.max(1,hmax-hmin)*(lane500-8);
      s+=`<line x1="${F.m.l}" x2="${F.w-F.m.r}" y1="${y50}" y2="${y50}" stroke="var(--grid)"/><path d="M${hs.map((v,k)=>v==null?null:`${x(a+k)+xw/2},${yH(v)}`).filter(Boolean).join('L')}" fill="none" stroke="var(--s7)" stroke-width="2"/><text x="${F.m.l-4}" y="${y50+lane500/2+3}" text-anchor="end" font-size="9" fill="var(--fg-3)">500 mb</text><text x="${F.w-F.m.r+4}" y="${yH(hmax)+3}" font-size="9" fill="var(--fg-3)">${f0(hmax)} m</text><text x="${F.w-F.m.r+4}" y="${yH(hmin)+3}" font-size="9" fill="var(--fg-3)">${f0(hmin)} m</text>`;
      if(D.trough){ const k=t.indexOf(D.trough.t); if(k>=a){ s+=`<line x1="${x(k)+xw/2}" x2="${x(k)+xw/2}" y1="${F.m.t}" y2="${y50+lane500}" stroke="var(--s7)" stroke-dasharray="3 3"/><text x="${x(k)+xw/2+4}" y="${y50+10}" font-size="9" fill="var(--s7)" font-weight="600">trough axis</text>`; } } } }
  }
  if(nowI>a){ s+=`<line x1="${x(nowI)}" x2="${x(nowI)}" y1="${F.m.t}" y2="${F.m.t+F.ih}" stroke="var(--fg)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="${x(nowI)+4}" y="${F.m.t+10}" font-size="10" font-weight="700" fill="var(--fg)">now</text><text x="${x(nowI)-4}" y="${F.m.t+10}" text-anchor="end" font-size="9" fill="var(--fg-3)">last 3 days (model estimate)</text>`; }
  s+=`<rect id="hrHit" x="${F.m.l}" y="${F.m.t}" width="${F.iw}" height="${F.ih}" fill="transparent"/></svg>`;
  $('#chHourly').innerHTML=s;
  const hit=$('#hrHit'); hit.addEventListener('pointermove',e=>{ const r=hit.getBoundingClientRect(); const i=Math.max(a,Math.min(n-1,a+Math.floor((e.clientX-r.left)/r.width*(n-a)))); let extra=''; if(pres){ const j=pres.map.get(t[i]); if(j!=null){ const h=pres.h; extra=`<div>700 mb: ${h.wind_direction_700hPa[j]!=null?degToCompass(h.wind_direction_700hPa[j]):'—'} ${f0(h.wind_speed_700hPa[j])} mph · ${f0(h.temperature_700hPa[j])}°F · RH ${f0(h.relative_humidity_700hPa?h.relative_humidity_700hPa[j]:null)}%</div><div>2 m: ${f0(h.temperature_2m[j])}°F${h.wind_gusts_10m?` · gusts ${f0(h.wind_gusts_10m[j])} mph`:''}${h.freezing_level_height?` · freezing level ${f0(mFt(h.freezing_level_height[j]))} ft`:''}${pres.slr[i]?` · ratio ${Math.round(pres.slr[i])}:1`:''}</div>${h.geopotential_height_500hPa?`<div>500 mb height ${f0(h.geopotential_height_500hPa[j])} m</div>`:''}`; } }
    const per=MODELS.filter(m=>D.perModel[m.id]&&D.perModel[m.id].snow[i]!=null).map(m=>`<span><span class="k" style="background:${m.color}"></span>${m.short} ${D.perModel[m.id].snow[i].toFixed(2)}</span>`).join(' ');
    showTip(`<div class="muted">${fmtDT(t[i])}</div><div><b>${(D.blend[i]||0).toFixed(2)} in/hr</b> blend</div><div class="small">${per}</div>${extra}`, e.clientX, e.clientY); });
  hit.addEventListener('pointerleave',hideTip);
}
function drawDayTable(l,D){
  $('#dayTable').innerHTML = `<div style="overflow-x:auto"><table class="cmpTable"><thead><tr><th>Day</th><th class="num">Snow</th><th class="num">Liquid</th><th>700 mb flow</th><th>Fit</th><th class="num">T 700</th><th class="num">RH</th><th class="num">Ratio</th><th class="num">Snow lvl</th><th class="num">Gust</th></tr></thead><tbody>`+
    D.days.map(d=>{ const fl=fitLabel(d.fit,d.flow); return `<tr><td style="white-space:nowrap">${d.label}</td><td class="num mono"><b>${inch(d.blend)}</b></td><td class="num mono">${d.liq.toFixed(2)}</td><td style="white-space:nowrap">${d.flow?`${arrowSvg(d.flow.dir,'currentColor',12)} ${degToCompass(d.flow.dir)} ${f0(d.flow.spd)} mph`:'—'}</td><td><span class="pill ${fl.cls}">${fl.t}</span></td><td class="num mono">${d.t700!=null?f0(d.t700)+'°':'—'}</td><td class="num mono">${d.rh!=null?f0(d.rh)+'%':'—'}</td><td class="num mono">${d.slr?Math.round(d.slr)+':1':'—'}</td><td class="num mono">${d.fzl!=null?f0(mFt(d.fzl)-1000):'—'}</td><td class="num mono">${d.gust!=null?`<span class="${d.gust>=40?'pill low':''}">${f0(d.gust)}</span>`:'—'}</td></tr>`; }).join('')+'</tbody></table></div><p class="small muted" style="margin:6px 0 0">Flow, temperature and humidity are precipitation-weighted over each day, so they describe conditions while it is actually snowing. Gust is the day\'s peak.</p>';
}
function drawRose(l,D){
  const R=70, cx=90, cy=90; let s=`<svg viewBox="0 0 180 180" width="180" height="180" role="img" aria-label="Favored wind directions">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="var(--panel-2)" stroke="var(--line)"/>`;
  const wedge=(name,col)=>{ const c=compassDeg(name); const a0=(c-22.5-90)*Math.PI/180, a1=(c+22.5-90)*Math.PI/180; return `<path d="M${cx},${cy}L${cx+R*Math.cos(a0)},${cy+R*Math.sin(a0)}A${R},${R},0,0,1,${cx+R*Math.cos(a1)},${cy+R*Math.sin(a1)}Z" fill="${col}" fill-opacity=".55"/>`; };
  (l.favored||[]).forEach(n=>s+=wedge(n,'var(--good)')); (l.shadowed||[]).forEach(n=>s+=wedge(n,'var(--bad)'));
  ['N','E','S','W'].forEach(n=>{ const c=compassDeg(n)*Math.PI/180; s+=`<text x="${cx+(R+9)*Math.sin(c)}" y="${cy-(R+9)*Math.cos(c)+4}" text-anchor="middle" font-size="11" fill="var(--fg-2)">${n}</text>`; });
  D.days.forEach((d,i)=>{ if(!d.flow||d.blend<0.3) return; const c=d.flow.dir*Math.PI/180; const len=R*0.9-(i%3)*12; const x0=cx+len*Math.sin(c), y0=cy-len*Math.cos(c); s+=`<line x1="${x0}" y1="${y0}" x2="${cx}" y2="${cy}" stroke="var(--fg)" stroke-width="${1+Math.min(3,d.blend/4)}" stroke-opacity=".8"/><circle cx="${x0}" cy="${y0}" r="3" fill="var(--fg)"/><text x="${x0+(x0>cx?5:-5)}" y="${y0+4}" font-size="9" text-anchor="${x0>cx?'start':'end'}" fill="var(--fg-2)">${d.label.split(',')[0]}</text>`; });
  s+='</svg>';
  $('#rose').innerHTML = `<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">${s}<div class="small"><div><span style="display:inline-block;width:12px;height:12px;background:var(--good);opacity:.6;vertical-align:-2px"></span> favored upwind sectors</div><div><span style="display:inline-block;width:12px;height:12px;background:var(--bad);opacity:.6;vertical-align:-2px"></span> shadowed sectors</div><div>— lines: where the 700 mb wind comes <i>from</i> on each snow day (thicker = more snow)</div></div></div>`;
}
function drawNerd(l,D){
  const t=D.times, a=D.startIdx, n=D.n; const ids=MODELS.filter(m=>D.perModel[m.id]).map(m=>m.id); const pres=D.pres;
  let h=`<table class="nerd"><thead><tr><th>Hour (MT)</th><th>Blend</th>${ids.map(id=>`<th>${MODELS.find(m=>m.id===id).short}</th>`).join('')}<th>Liquid</th><th>2 m °F</th><th>700 °F</th><th>700 wind</th><th>RH 700</th><th>Gust</th><th>Ratio</th><th>Frz lvl ft</th></tr></thead><tbody>`;
  let lastD=null; const maxB=Math.max(0.3,...D.blend.slice(a));
  for(let i=a;i<n;i++){ const d=dayIndex(t[i],state.offset); const newDay=d!==lastD; lastD=d; const j=pres?pres.map.get(t[i]):null; const ph=pres?pres.h:null; const b=D.blend[i]||0;
    h+=`<tr class="${newDay?'day':''}"><td>${newDay?fmtDay(t[i])+' ':''}${fmtHour(t[i])}</td><td class="${b>=maxB*0.5?'hot':''}">${b.toFixed(2)}</td>${ids.map(id=>{ const v=D.perModel[id].snow[i]; return `<td>${v==null?'·':v.toFixed(2)}</td>`; }).join('')}<td>${(D.blendLiq[i]||0).toFixed(2)}</td><td>${j!=null?f0(ph.temperature_2m[j]):'·'}</td><td>${j!=null&&ph.temperature_700hPa?f0(ph.temperature_700hPa[j]):'·'}</td><td>${j!=null&&ph.wind_direction_700hPa&&ph.wind_direction_700hPa[j]!=null?degToCompass(ph.wind_direction_700hPa[j])+' '+f0(ph.wind_speed_700hPa[j]):'·'}</td><td>${j!=null&&ph.relative_humidity_700hPa?f0(ph.relative_humidity_700hPa[j])+'%':'·'}</td><td>${j!=null&&ph.wind_gusts_10m?f0(ph.wind_gusts_10m[j]):'·'}</td><td>${pres&&pres.slr[i]?Math.round(pres.slr[i])+':1':'·'}</td><td>${j!=null&&ph.freezing_level_height?f0(mFt(ph.freezing_level_height[j])):'·'}</td></tr>`; }
  h+='</tbody></table>';
  $('#nerd').innerHTML=h;
}
function drawNws(l,g){
  if(!g||!g.ok){ $('#nwsGrid').innerHTML=`<div class="err">Could not load api.weather.gov (${esc(g&&g.err)}). <a href="https://forecast.weather.gov/MapClick.php?lat=${l.lat}&lon=${l.lon}" target="_blank" rel="noopener">Open the NWS point forecast</a></div>`; return; }
  const D=state.derived[l.id]; const diff=g.snow7-D.d7;
  $('#nwsGrid').innerHTML=`<div class="kv"><dt>NWS 7-day snow</dt><dd><b class="mono">${inch(g.snow7)} in</b> <span class="muted">(72 h: ${inch(g.snow3)} in)</span></dd><dt>NWS 7-day liquid</dt><dd class="mono">${g.qpf7.toFixed(2)} in</dd><dt>Max precip chance</dt><dd class="mono">${f0(g.popMax)}%</dd><dt>Grid cell</dt><dd class="mono">${g.office} ${g.gridX},${g.gridY} · ${f0(mFt(g.elevM))} ft</dd><dt>vs. this blend</dt><dd>${Math.abs(diff)<1?'about the same':diff>0?`NWS is <b>${inch(diff)} in higher</b>`:`NWS is <b>${inch(-diff)} in lower</b>`}</dd></div>
  <div style="margin-top:8px">${Object.entries(g.byDay).map(([d,v])=>`<span class="pill neutral" style="margin:2px">${d.split(',')[0]} ${inch(v)}</span>`).join('')}</div>
  <p class="small muted" style="margin:8px 0 0">The NWS gridpoint is the forecaster-edited product (NBM first guess, then human adjustments on a 2.5 km grid). Its grid elevation can differ from the summit by thousands of feet, which explains many gaps. <a href="${esc(g.forecastUrl)}" target="_blank" rel="noopener">Text forecast</a> · <a href="https://forecast.weather.gov/MapClick.php?lat=${l.lat}&lon=${l.lon}" target="_blank" rel="noopener">NWS page</a></p>`;
}
function drawSnotel(l,s){
  if(!s) return; if(!s.ok){ $('#snotel').innerHTML=`<div class="err">SNOTEL request failed (${esc(s.err)}). <a href="https://wcc.sc.egov.usda.gov/nwcc/site?sitenum=${l.snotel.split(':')[0]}" target="_blank" rel="noopener">Open station ${esc(l.snotelName||l.snotel)}</a></div>`; return; }
  const sn=s.series.SNWD||[], sw=s.series.WTEQ||[], tb=s.series.TOBS||[];
  const last=arr=>arr.length?arr[arr.length-1]:null; const d0=last(sn), w0=last(sw);
  const chg = sn.length>1? (sn[sn.length-1].v - sn[0].v) : null;
  const vals=sn.filter(x=>x.v!=null); const dChg=k=>{ if(vals.length<=k) return null; return vals[vals.length-1].v - vals[vals.length-1-k].v; }; const c1=dChg(1), c3=dChg(3);
  const D=state.derived[l.id]; const s24=$('#snotel24'), s72=$('#snotel72'); if(s24&&c1!=null) s24.innerHTML=`model estimate · SNOTEL depth <b>${c1>=0?'+':''}${c1} in</b>`; if(s72&&c3!=null) s72.innerHTML=`model estimate · SNOTEL depth <b>${c3>=0?'+':''}${c3} in</b> in 3 days`;
  const rows = sn.map(x=>`<tr><td>${x.date.slice(5)}</td><td class="num mono">${x.v==null?'—':x.v}</td><td class="num mono">${(sw.find(y=>y.date===x.date)||{}).v??'—'}</td><td class="num mono">${(tb.find(y=>y.date===x.date)||{}).v??'—'}</td></tr>`).join('');
  $('#snotel').innerHTML=`<div class="small muted" style="margin-bottom:6px">Station <b>${esc(s.name||l.snotelName||l.snotel)}</b>${s.elev?` · ${f0(s.elev)} ft`:''} <span class="mono">${esc(l.snotel)}</span>${l.snotelVerified===false?' · <span class="pill med">ID from memory, check the name</span>':''}</div><div class="kv"><dt>Snow depth now</dt><dd><b class="mono">${d0&&d0.v!=null?d0.v+' in':'—'}</b> <span class="muted">${d0?d0.date:''}</span></dd><dt>Depth change, last day / 3 days</dt><dd class="mono">${c1==null?'—':(c1>=0?'+':'')+c1+' in'} / ${c3==null?'—':(c3>=0?'+':'')+c3+' in'} <span class="muted">vs model ${D&&D.hasPast?inch(D.p1)+' / '+inch(D.p3)+' in':''}</span></dd><dt>Change, last ${Math.max(1,sn.length-1)} days</dt><dd class="mono">${chg==null?'—':(chg>=0?'+':'')+chg+' in'}</dd><dt>Snow water equivalent</dt><dd class="mono">${w0&&w0.v!=null?w0.v+' in':'—'}</dd></div>
  <details style="margin-top:6px"><summary>Daily readings</summary><table class="cmpTable"><thead><tr><th>Date</th><th class="num">Depth in</th><th class="num">SWE in</th><th class="num">Temp °F</th></tr></thead><tbody>${rows}</tbody></table></details>
  <p class="small muted" style="margin:8px 0 0">SNOTEL is the independent measurement the forecasts get verified against. Compare the depth change to what the models said for those days. <a href="https://wcc.sc.egov.usda.gov/nwcc/site?sitenum=${l.snotel.split(':')[0]}" target="_blank" rel="noopener">Station page</a></p>`;
}
function drawAfd(l,a){
  if(!a||!a.ok){ $('#afd').innerHTML=`<div class="err">Could not load the discussion (${esc(a&&a.err)}). <a href="https://forecast.weather.gov/product.php?site=NWS&issuedby=${l.nws}&product=AFD&format=CI&version=1&glossary=0" target="_blank" rel="noopener">Read it on weather.gov</a></div>`; return; }
  const kw=/(snow|upslope|orograph|northwest flow|southwest flow|westerly|ridge|trough|closed low|cut-?off|jet|moisture|ratios?|700 ?mb|500 ?mb|freezing level|snow level|ensemble|GFS|ECMWF|Euro|NAM|HRRR|NBM|mountain|Divide|Wasatch|Cottonwood|San Juan|Elk|Park Range|Front Range|Summit County|Vail|Steamboat|Alta|Snowbird|Uinta|lake[- ]effect|QPF|confidence)/gi;
  const text=a.text.replace(/\r/g,''); const html=esc(text).replace(new RegExp(kw.source,'gi'), m=>`<mark>${m}</mark>`);
  $('#afd').innerHTML=`<div class="small muted" style="margin-bottom:6px">Issued ${new Date(a.issued).toLocaleString('en-US',{timeZone:TZ})} · <a href="https://forecast.weather.gov/product.php?site=NWS&issuedby=${l.nws}&product=AFD&format=CI&version=1&glossary=0" target="_blank" rel="noopener">source</a></div><pre class="afd">${html}</pre>`;
}
function drawLinks(l){
  const links=[
    ['NWS point forecast', `https://forecast.weather.gov/MapClick.php?lat=${l.lat}&lon=${l.lon}`],
    ['NWS hourly graph', `https://forecast.weather.gov/MapClick.php?lat=${l.lat}&lon=${l.lon}&FcstType=graphical`],
    ['Open-Meteo model comparison', `https://open-meteo.com/en/docs?latitude=${l.lat}&longitude=${l.lon}&hourly=snowfall,temperature_2m&models=ecmwf_ifs025,gfs_global,icon_seamless,gem_seamless&timezone=America%2FDenver`],
    ['Pivotal Weather 700 mb maps (free)', 'https://www.pivotalweather.com/model.php?m=gfs&p=700wh'],
    ['Tropical Tidbits GFS/ECMWF/GEFS', 'https://www.tropicaltidbits.com/analysis/models/'],
    ['WPC winter weather (WSSI, day 4–7)', 'https://www.wpc.ncep.noaa.gov/wwd/winter_wx.shtml'],
    [l.state==='UT'?'Utah Avalanche Center':'Colorado Avalanche Information Center', l.state==='UT'?'https://utahavalanchecenter.org/forecasts':'https://avalanche.state.co.us/'],
    ['OpenSnow daily snow', l.state==='UT'?'https://opensnow.com/dailysnow/utah':'https://opensnow.com/dailysnow/colorado'],
  ];
  if(l.state==='UT') links.push(['Wasatch Weather Weenies (Steenburgh)', 'https://wasatchweatherweenies.blogspot.com/']);
  if(l.snotel) links.push(['SNOTEL station', `https://wcc.sc.egov.usda.gov/nwcc/site?sitenum=${l.snotel.split(':')[0]}`]);
  $('#links').innerHTML = `<div class="chips">${links.map(([t,u])=>`<a class="chip" href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join('')}</div>`;
}

/* ---------- Compare ---------- */
function renderCompareOptions(){
  const opts=LOCATIONS.map(l=>`<option value="${l.id}">${esc(l.name)} (${l.state})</option>`).join('');
  ['cmpA','cmpB','cmpC'].forEach((id,k)=>{ const sel=$('#'+id); const cur=sel.value; sel.innerHTML=(k===2?'<option value="">(none)</option>':'')+opts; if(cur) sel.value=cur; });
  if(!$('#cmpA').value) $('#cmpA').value='steamboat'; if(!$('#cmpB').value||$('#cmpB').value===$('#cmpA').value) $('#cmpB').value='wolfcreek';
  ['cmpA','cmpB','cmpC'].forEach(id=>$('#'+id).onchange=renderCompare);
}
function renderCompare(){
  const ids=['cmpA','cmpB','cmpC'].map(id=>$('#'+id).value).filter(Boolean); const xs=ids.map(id=>({l:LOCATIONS.find(x=>x.id===id),D:state.derived[id]})).filter(x=>x.D);
  if(xs.length<2){ $('#cmpOut').innerHTML='<p class="muted">Pick at least two locations.</p>'; return; }
  const row=(label,fn,tip)=>`<tr><th title="${esc(tip||'')}">${label}</th>${xs.map(x=>`<td>${fn(x)}</td>`).join('')}</tr>`;
  const best=(key)=>Math.max(...xs.map(x=>x.D[key]));
  const hi=(v,b)=> v===b? 'style="font-weight:700;color:var(--accent-ink)"' : '';
  $('#cmpOut').innerHTML=`<div style="overflow-x:auto"><table class="cmpTable" style="width:100%"><thead><tr><th></th>${xs.map(x=>`<th style="font-size:14px;text-transform:none;letter-spacing:0;color:var(--fg)">${esc(x.l.name)} <span class="muted">${x.l.state}</span></th>`).join('')}</tr></thead><tbody>
    ${row('Region',x=>esc(x.l.region))}
    ${row('Drive from Denver',x=>x.l.driveHrs+' h')}
    ${row('Summit / base',x=>`${f0(x.l.summitFt)} / ${f0(x.l.baseFt)} ft`)}
    ${row('Daily pattern',x=>sparkDays(x.D.days,120,28))}
    ${row('Last 24 h (model est.)',x=>`<span class="mono pastCell">${x.D.hasPast?inch(x.D.p1):'—'} in</span>`)}
    ${row('Last 3 days (model est.)',x=>`<span class="mono pastCell">${x.D.hasPast?inch(x.D.p3):'—'} in</span>`)}
    ${row('Next 24 h',x=>`<span class="mono" ${hi(x.D.d1,best('d1'))}>${inch(x.D.d1)} in</span>`)}
    ${row('Next 72 h',x=>`<span class="mono" ${hi(x.D.d3,best('d3'))}>${inch(x.D.d3)} in</span>`)}
    ${row('7-day blend',x=>`<span class="mono" ${hi(x.D.d7,best('d7'))}>${inch(x.D.d7)} in</span>`)}
    ${row('Model range',x=>`<span class="mono">${inch(x.D.mn)}–${inch(x.D.mx)} in</span>`)}
    ${row('Agreement',x=>`<span class="pill ${x.D.conf.cls}">${x.D.conf.t}</span>`)}
    ${row('Powder score',x=>`<span class="meter"><i><b style="width:${x.D.powder.total}%"></b></i><span class="mono">${x.D.powder.total}</span></span>`)}
    ${row('Liquid (7 d)',x=>`<span class="mono">${x.D.liq7.toFixed(2)} in</span>`,'Total precipitation; the raw ingredient before ratios')}
    ${row('Snow ratio',x=>`<span class="mono">${x.D.slr7?Math.round(x.D.slr7)+':1':'—'}</span>`)}
    ${row('700 mb flow during snow',x=>x.D.flow7?`${arrowSvg(x.D.flow7.dir,'currentColor',12)} ${degToCompass(x.D.flow7.dir)} ${f0(x.D.flow7.spd)} mph`:'—')}
    ${row('Favored / shadowed',x=>`${(x.l.favored||[]).join('/')||'—'} / ${(x.l.shadowed||[]).join('/')||'—'}`)}
    ${row('Flow fit',x=>`<span class="pill ${fitLabel(x.D.fit7,x.D.flow7).cls}">${fitLabel(x.D.fit7,x.D.flow7).t}</span>`)}
    ${row('700 mb temp',x=>x.D.t7000!=null?`${f0(x.D.t7000)}°F / ${f0(degC(x.D.t7000))}°C`:'—')}
    ${row('700 mb humidity',x=>x.D.rh7!=null?f0(x.D.rh7)+'%':'—')}
    ${row('Snow level vs base',x=>x.D.fzl7!=null?`${f0(mFt(x.D.fzl7)-1000)} ft ${mFt(x.D.fzl7)-1000>x.l.baseFt?'<span class="pill low">above base</span>':'<span class="pill high">below base</span>'}`:'—')}
    ${row('Peak gust (7 d)',x=>x.D.gust7!=null?f0(x.D.gust7)+' mph':'—')}
    ${row('Trough axis passes',x=>x.D.trough?fmtDT(x.D.trough.t):'—')}
    ${row('Wettest / driest model',x=>x.D.wet?`${MODELS.find(m=>m.id===x.D.wet).short} ${inch(x.D.perModel[x.D.wet].d7)} / ${MODELS.find(m=>m.id===x.D.dry).short} ${inch(x.D.perModel[x.D.dry].d7)}`:'—')}
    ${row('Avg season snowfall',x=>x.l.avgSnow?x.l.avgSnow+' in':'—')}
  </tbody></table></div>
  <div class="why" style="margin-top:12px">${compareNarrative(xs)}</div>`;
}
function compareNarrative(xs){
  const s=[...xs].sort((a,b)=>b.D.d7-a.D.d7); const A=s[0], B=s[s.length-1]; if(A.D.d7-B.D.d7<1) return `<p>${esc(A.l.name)} and ${esc(B.l.name)} are within an inch of each other this week; the difference is inside the model noise.</p>`;
  const reasons=[];
  if(A.D.liq7-B.D.liq7>0.15) reasons.push(`more liquid falls there (${A.D.liq7.toFixed(2)} vs ${B.D.liq7.toFixed(2)} in), which is the direct result of the storm track and orographic lift`);
  if(A.D.fit7!=null&&B.D.fit7!=null&&A.D.fit7-B.D.fit7>0.4) reasons.push(`the ${A.D.flow7?degToCompass(A.D.flow7.dir):''} flow is ${fitLabel(A.D.fit7,A.D.flow7).t} for ${esc(A.l.name)} but ${fitLabel(B.D.fit7,B.D.flow7).t} for ${esc(B.l.name)}`);
  if(A.D.slr7&&B.D.slr7&&A.D.slr7-B.D.slr7>2) reasons.push(`colder air gives it fluffier snow (${Math.round(A.D.slr7)}:1 vs ${Math.round(B.D.slr7)}:1), so the same water makes more inches`);
  if(A.D.rh7&&B.D.rh7&&A.D.rh7-B.D.rh7>10) reasons.push(`the mountain layer is more saturated (${f0(A.D.rh7)}% vs ${f0(B.D.rh7)}% at 700 mb)`);
  if(B.D.fzl7&&mFt(B.D.fzl7)-1000>B.l.baseFt) reasons.push(`${esc(B.l.name)} also loses some to rain or mix at the base (snow level ≈ ${f0(mFt(B.D.fzl7)-1000)} ft)`);
  return `<p><b>${esc(A.l.name)} beats ${esc(B.l.name)} by ${inch(A.D.d7-B.D.d7)} in</b> in the blend${reasons.length?' because '+reasons.join('; '):''}.</p><p class="small muted">Confidence: ${A.l.name} ${A.D.conf.t}, ${B.l.name} ${B.D.conf.t}. ${A.D.conf.cls==='low'||B.D.conf.cls==='low'?'At least one side has low model agreement, so this ranking could flip with the next runs.':''}</p>`;
}
