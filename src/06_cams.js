/* ===================== Cam wall ===================== */
const CAMS = window.CAMS || {passes:[], resorts:{}};
// Approximate camera coordinates (for the cam map), matched by name fragment
const CAM_COORDS = [
  ['Eisenhower Tunnel west',39.679,-105.930],['Eisenhower Tunnel east',39.680,-105.898],['Loveland Pass (US-6)',39.665,-105.885],['Vail Pass summit',39.531,-106.218],['Vail Pass west',39.545,-106.235],
  ['Copper Mountain / CO-91',39.504,-106.146],['Silverthorne',39.630,-106.070],['Georgetown',39.706,-105.699],['Floyd Hill',39.731,-105.405],['Idaho Springs',39.740,-105.470],['Vail (Vail Rd)',39.643,-106.378],
  ['No Name',39.565,-107.270],['Grizzly Creek',39.562,-107.240],['Berthoud Pass',39.798,-105.777],['Berthoud Falls',39.831,-105.806],['Mary Jane',39.885,-105.765],['US-285 at Grant',39.460,-105.670],
  ['Rabbit Ears',40.385,-106.616],['Monarch Pass',38.497,-106.325],['Fremont Pass',39.370,-106.195],['Independence Pass',39.108,-106.564],['Wolf Creek Pass, east',37.470,-106.760],['Wolf Creek Pass, west',37.483,-106.830],
  ['Red Mountain Pass',37.898,-107.712],['Silverton (US-550)',37.812,-107.665],['Little Cottonwood: mouth',40.573,-111.800],['Seven Turns',40.571,-111.740],['White Pine',40.575,-111.690],['Alta Bypass',40.580,-111.655],['Alta MP 12',40.588,-111.636],
  ['Big Cottonwood: mouth',40.620,-111.790],['S-curves',40.635,-111.700],['Silver Fork',40.627,-111.610],['Big Cottonwood: Solitude',40.620,-111.592],['Big Cottonwood: Brighton',40.598,-111.583],['Cottonwood Canyons road status',40.600,-111.700],
  ['Parleys Summit eastbound',40.757,-111.612],['Parleys Summit westbound',40.757,-111.606],['Kimball Junction',40.722,-111.540],['SR-224',40.710,-111.555],['Ogden Canyon (SR-39)',41.235,-111.900],['SR-158',41.262,-111.770],['Trappers Loop',41.200,-111.840],['Snowbasin Rd',41.215,-111.855],
  ['Logan Summit',41.930,-111.520],['Provo Canyon',40.355,-111.600],['SR-92',40.395,-111.585],['Brian Head (SR-143',37.700,-112.840],['SR-143 below',37.650,-112.900],['I-80 Summit',41.260,-105.430],
];
function camCoord(c){ if(c.lat!=null) return [c.lat,c.lon]; const hit=CAM_COORDS.find(x=>c.name.includes(x[0])); return hit? [hit[1],hit[2]] : null; }
// Drive routes: ordered cam-name fragments with approximate miles from the start city, plus destination locations
const ROUTES = [
  {id:'summit', name:'Denver → Summit County', from:'Denver', stops:[['Floyd Hill',35],['Idaho Springs',40],['Georgetown',47],['Eisenhower Tunnel east',60],['Eisenhower Tunnel west',61],['Loveland Pass (US-6)',62],['Silverthorne',70],['Copper Mountain / CO-91',78]], dest:['loveland','abasin','keystone','breck','copper']},
  {id:'vail', name:'Denver → Vail / Beaver Creek', from:'Denver', stops:[['Floyd Hill',35],['Georgetown',47],['Eisenhower Tunnel west',61],['Silverthorne',70],['Copper Mountain / CO-91',78],['Vail Pass summit',90],['Vail Pass west',93],['Vail (Vail Rd)',100]], dest:['vail','beavercreek']},
  {id:'aspen', name:'Denver → Glenwood / Aspen', from:'Denver', stops:[['Eisenhower Tunnel west',61],['Vail Pass summit',90],['Vail (Vail Rd)',100],['Grizzly Creek',150],['No Name',155],['Independence Pass',200]], dest:['sunlight','aspen','highlands','snowmass']},
  {id:'wp', name:'Denver → Winter Park', from:'Denver', stops:[['Floyd Hill',35],['Idaho Springs',40],['Berthoud Falls',55],['Berthoud Pass',60],['Mary Jane',66]], dest:['winterpark','berthoud','eldora']},
  {id:'steamboat', name:'Denver → Steamboat', from:'Denver', stops:[['Georgetown',47],['Eisenhower Tunnel west',61],['Silverthorne',70],['Rabbit Ears',140]], dest:['steamboat','rabbitears']},
  {id:'central', name:'Denver → Monarch / Crested Butte', from:'Denver', stops:[['US-285 at Grant',55],['Fremont Pass',110],['Monarch Pass',160]], dest:['monarch','crestedbutte','cooper']},
  {id:'wolf', name:'Denver → Wolf Creek', from:'Denver', stops:[['US-285 at Grant',55],['Wolf Creek Pass, east',250],['Wolf Creek Pass, west',255]], dest:['wolfcreek','wolfcreekpass']},
  {id:'sanjuan', name:'Durango → Silverton / Telluride', from:'Durango', stops:[['Silverton (US-550)',48],['Red Mountain Pass',60]], dest:['purgatory','silverton','redmtnpass','telluride']},
  {id:'lcc', name:'SLC → Little Cottonwood', from:'Salt Lake City', stops:[['Little Cottonwood: mouth',18],['Seven Turns',21],['White Pine',23],['Alta Bypass',25],['Alta MP 12',26]], dest:['snowbird','alta']},
  {id:'bcc', name:'SLC → Big Cottonwood', from:'Salt Lake City', stops:[['Big Cottonwood: mouth',17],['S-curves',22],['Silver Fork',29],['Big Cottonwood: Solitude',30],['Big Cottonwood: Brighton',32]], dest:['solitude','brighton']},
  {id:'pc', name:'SLC → Park City', from:'Salt Lake City', stops:[['Parleys Summit eastbound',18],['Parleys Summit westbound',18],['Kimball Junction',27],['SR-224',30]], dest:['parkcity','deervalley']},
  {id:'ogden', name:'SLC → Snowbasin / Powder Mountain', from:'Salt Lake City', stops:[['Trappers Loop',45],['Snowbasin Rd',48],['Ogden Canyon (SR-39)',45],['SR-158',52]], dest:['snowbasin','powdermtn','nordic']},
  {id:'sundance', name:'Provo → Sundance', from:'Provo', stops:[['Provo Canyon',8],['SR-92',12]], dest:['sundance']},
  {id:'brianhead', name:'I-15 → Brian Head', from:'Parowan', stops:[['SR-143 below',8],['Brian Head (SR-143',12]], dest:['brianhead']},
];
const camTimers=[]; let camRegistry=[]; let lbIdx=-1, lbTimer=null, lbAuto=false, lbRefresh=null, wallClockTimer=null;
function fcBadge(ids){ for(const id of ids||[]){ const D=state.derived[id]; if(D){ const l=LOCATIONS.find(x=>x.id===id); return `<span class="fc">${esc(l.short||l.name)} <b>${inch(D.d1)}"</b> next 24 h</span>`; } } return ''; }
function camCard(c, idx){
  const isImg=c.kind==='img';
  const frame = isImg? `<img alt="${esc(c.name)}" loading="lazy" referrerpolicy="no-referrer"><span class="age"></span>`
    : c.kind==='youtube'? `<iframe src="https://www.youtube.com/embed/${esc(c.id)}?autoplay=0&mute=1&rel=0" title="${esc(c.name)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe><span class="live">LIVE</span>`
    : c.kind==='iframe'? `<iframe src="${esc(c.url)}" title="${esc(c.name)}" loading="lazy" allowfullscreen allow="autoplay; encrypted-media"></iframe><span class="live">LIVE</span>`
    : `<div class="fallback"><a href="${esc(c.page)}" target="_blank" rel="noopener">${esc(c.name)} ↗</a><br><span class="muted">${esc(c.sub||'opens the official cam page')}</span></div>`;
  return `<div class="cam" data-idx="${idx}" data-region="${esc(c.region||'')}"><div class="frame">${frame}${fcBadge(c.near||c._loc)}</div><div class="meta"><div><b>${esc(c.name)}</b><div class="muted">${esc(c.sub||'')}</div></div><a class="src" href="${esc(c.page||c.url||'#')}" target="_blank" rel="noopener">${esc(c.provider||'source')} ↗</a></div></div>`;
}
function mountCams(root){
  root.querySelectorAll('.cam').forEach(card=>{ const c=camRegistry[+card.dataset.idx]; if(!c) return; const img=card.querySelector('img'); const frame=card.querySelector('.frame');
    if(c.kind!=='link') frame.addEventListener('click', e=>{ if(e.target.closest('a')) return; openLightbox(+card.dataset.idx); });
    if(!img||c.kind!=='img') return;
    const load=()=>{ img.src=c.url+(c.url.includes('?')?'&':'?')+'t='+Date.now(); };
    img.onload=()=>{ const age=card.querySelector('.age'); if(age) age.textContent='updated '+new Date().toLocaleTimeString('en-US',{timeZone:TZ,hour:'numeric',minute:'2-digit'})+' MT'; c._ok=true; updateOnline(); try{ frame.classList.toggle('dark', isDarkImage(img)); }catch(e){} };
    img.onerror=()=>{ c._ok=false; frame.innerHTML=`<div class="fallback"><a href="${esc(c.page||c.url)}" target="_blank" rel="noopener">${esc(c.name)} ↗</a><br><span class="muted">feed did not load; opens the official page</span></div>`; updateOnline(); };
    load(); camTimers.push(setInterval(load, (c.refresh||60)*1000)); });
}
function isDarkImage(img){ const cv=document.createElement('canvas'); cv.width=16; cv.height=9; const ctx=cv.getContext('2d'); ctx.drawImage(img,0,0,16,9); const d=ctx.getImageData(0,0,16,9).data; let s=0; for(let i=0;i<d.length;i+=4) s+=d[i]+d[i+1]+d[i+2]; return s/(d.length/4*3) < 28; }
function updateOnline(){ const imgs=camRegistry.filter(c=>c.kind==='img'); const ok=imgs.filter(c=>c._ok).length; const streams=camRegistry.filter(c=>c.kind==='youtube'||c.kind==='iframe').length; const el=$('#wallOnline'); if(el) el.textContent=`${ok}/${imgs.length} stills online · ${streams} streams`; }
// Sunrise/sunset for Denver (approximate NOAA method)
function sunTimes(lat, lon, date){ const rad=Math.PI/180; const d=date||new Date(); const start=Date.UTC(d.getUTCFullYear(),0,0); const doy=Math.floor((d.getTime()-start)/86400000); const lngHour=lon/15;
  const calc=rise=>{ const t=doy+((rise?6:18)-lngHour)/24; const M=(0.9856*t)-3.289; let L=M+(1.916*Math.sin(M*rad))+(0.020*Math.sin(2*M*rad))+282.634; L=(L+360)%360; let RA=Math.atan(0.91764*Math.tan(L*rad))/rad; RA=(RA+360)%360; const Lq=Math.floor(L/90)*90, RAq=Math.floor(RA/90)*90; RA=(RA+(Lq-RAq))/15; const sinDec=0.39782*Math.sin(L*rad); const cosDec=Math.cos(Math.asin(sinDec)); const cosH=(Math.cos(90.833*rad)-(sinDec*Math.sin(lat*rad)))/(cosDec*Math.cos(lat*rad)); if(cosH>1||cosH<-1) return null; let H=rise? 360-Math.acos(cosH)/rad : Math.acos(cosH)/rad; H/=15; const T=H+RA-(0.06571*t)-6.622; let UT=(T-lngHour)%24; if(UT<0) UT+=24; return new Date(start+ (doy*24+UT)*3600000); };
  return {rise:calc(true), set:calc(false)}; }
function wallClock(){ const now=new Date(); const el=$('#wallClock'); if(el) el.textContent=now.toLocaleTimeString('en-US',{timeZone:TZ,hour:'numeric',minute:'2-digit'})+' MT';
  const st=sunTimes(39.74,-104.99,now); const se=$('#wallSun'); if(se&&st.rise&&st.set){ const fmt=t=>t.toLocaleTimeString('en-US',{timeZone:TZ,hour:'numeric',minute:'2-digit'}); const day = now>st.rise && now<st.set; let next = day? st.set : (now<st.rise? st.rise : new Date(st.rise.getTime()+86400000)); const mins=Math.max(0,Math.round((next-now)/60000)); se.innerHTML = day? `☀ daylight · sunset ${fmt(st.set)} (${Math.floor(mins/60)} h ${mins%60} m)` : `☾ night at Denver · sunrise ${fmt(st.rise)} (in ${Math.floor(mins/60)} h ${mins%60} m)`; } }
function buildRegistry(){ camRegistry=[]; (CAMS.passes||[]).forEach(c=>{ c._kind='pass'; camRegistry.push(c); }); Object.entries(CAMS.resorts||{}).forEach(([id,list])=>{ (list||[]).forEach(c=>{ const l=LOCATIONS.find(x=>x.id===id); c._kind='resort'; c._loc=[id]; c.sub=c.sub||(l?`${l.name} · ${l.state}`:''); c.region=c.region||(l?l.region:''); camRegistry.push(c); }); }); }
function renderCamsTab(){
  camTimers.forEach(t=>clearInterval(t)); camTimers.length=0; buildRegistry();
  state.camRegion=state.camRegion||''; state.route=state.route||'';
  // route bar
  $('#routeBar').innerHTML = `<button class="chip" aria-pressed="${!state.route}" data-r="">All cams</button>`+ROUTES.map(r=>`<button class="chip" aria-pressed="${state.route===r.id}" data-r="${r.id}">${esc(r.name)}</button>`).join('');
  $$('#routeBar .chip').forEach(b=>b.onclick=()=>{ state.route=b.dataset.r; renderCamsTab(); });
  const route=ROUTES.find(r=>r.id===state.route);
  if(route){ const stops=route.stops.map(([frag,mi])=>({c:camRegistry.find(x=>x._kind==='pass'&&x.name.includes(frag)), mi})).filter(x=>x.c); const dest=route.dest.flatMap(id=>camRegistry.filter(x=>x._kind==='resort'&&x._loc[0]===id)).slice(0,6);
    const dl=route.dest.map(id=>LOCATIONS.find(l=>l.id===id)).filter(Boolean); const fc=dl.map(l=>{ const D=state.derived[l.id]; return D? `${l.short||l.name} ${inch(D.d1)}"` : null; }).filter(Boolean).join(' · ');
    $('#routeStrip').innerHTML=`<div class="routeStrip"><div class="rsHead"><b>${esc(route.name)}</b><span class="wallSub">road cams in driving order from ${esc(route.from)}, then the destination${fc?` · next 24 h: ${fc}`:''}</span></div><div class="road">${stops.map(s=>`<div class="stop"><div class="mile"><i></i>mile ${s.mi}</div>${camCard(s.c, camRegistry.indexOf(s.c))}</div>`).join('')}${dest.map(c=>`<div class="stop dest"><div class="mile"><i></i>destination</div>${camCard(c, camRegistry.indexOf(c))}</div>`).join('')}</div></div>`; }
  else $('#routeStrip').innerHTML='';
  // pass grid with region filter
  const passes=camRegistry.filter(c=>c._kind==='pass'); const regions=[...new Set(passes.map(c=>c.region).filter(Boolean))];
  $('#camFilters').innerHTML = `<button class="chip" aria-pressed="${!state.camRegion}" data-r="">All</button>`+regions.map(r=>`<button class="chip" aria-pressed="${state.camRegion===r}" data-r="${esc(r)}">${esc(r)}</button>`).join('');
  $$('#camFilters .chip').forEach(b=>b.onclick=()=>{ state.camRegion=b.dataset.r; renderCamsTab(); });
  const shown=passes.filter(c=>!state.camRegion||c.region===state.camRegion);
  $('#camGridPasses').innerHTML = shown.map(c=>camCard(c, camRegistry.indexOf(c))).join('') || '<p class="muted">No pass cams in this region.</p>';
  const res=camRegistry.filter(c=>c._kind==='resort');
  $('#camGridResorts').innerHTML = res.map(c=>camCard(c, camRegistry.indexOf(c))).join('');
  renderCamMap(); mountCams($('#tab-cams')); updateOnline(); wallClock(); if(wallClockTimer) clearInterval(wallClockTimer); wallClockTimer=setInterval(wallClock, 30000);
  $('#btnWall').onclick=()=>{ const first=camRegistry.findIndex(c=>c.kind!=='link'); if(first>=0){ openLightbox(first); setAuto(true); } };
}
function renderCamMap(){
  const pts=camRegistry.map((c,i)=>({c,i,ll:camCoord(c)||(c._loc? (l=>l?[l.lat,l.lon]:null)(LOCATIONS.find(x=>x.id===c._loc[0])) : null)})).filter(p=>p.ll);
  const rect=(a,b,c,d)=>`M${px(a)},${py(b)}L${px(c)},${py(b)}L${px(c)},${py(d)}L${px(a)},${py(d)}Z`;
  let s=`<svg viewBox="0 0 ${MAP.W} ${MAP.H}" role="img" aria-label="Camera locations">`;
  s+=`<path d="${rect(-109.05,41,-102.05,37)}" fill="none" stroke="#2a3a52"/><path d="M${px(-114.05)},${py(42)}L${px(-111.05)},${py(42)}L${px(-111.05)},${py(41)}L${px(-109.05)},${py(41)}L${px(-109.05)},${py(37)}L${px(-114.05)},${py(37)}Z" fill="none" stroke="#2a3a52"/><path d="${rect(-111.05,45,-104.05,41)}" fill="none" stroke="#2a3a52"/><path d="${rect(-109.05,37,-103.0,31.3)}" fill="none" stroke="#2a3a52"/>`;
  s+=Object.entries(ROADS).map(([n,p])=>`<path d="M${p.map(q=>`${px(q[0]).toFixed(1)},${py(q[1]).toFixed(1)}`).join('L')}" fill="none" stroke="#26344a" stroke-width="${n.startsWith('I-')?2:1.2}" stroke-linejoin="round"/>`).join('');
  s+=pts.map(p=>{ const [la,lo]=p.ll; const x=px(lo), y=py(la); const col=p.c._kind==='pass'? '#5aa2ff' : '#2dd4a0'; return `<g class="camDot" data-i="${p.i}" style="cursor:pointer" data-tip="${esc(`<b>${p.c.name}</b><br>${p.c.sub||''}<br><span class='muted'>click to view</span>`)}"><circle cx="${x}" cy="${y}" r="5" fill="${col}" fill-opacity=".85" stroke="#06101f" stroke-width="1.2"/></g>`; }).join('');
  s+=`<text x="12" y="${MAP.H-12}" font-size="11" fill="#9fb0c6">● road cams  <tspan fill="#2dd4a0">●</tspan> resort cams</text></svg>`;
  $('#camMap').innerHTML=s; bindTips($('#camMap'));
  $$('#camMap .camDot').forEach(g=>g.onclick=()=>openLightbox(+g.dataset.i));
}
/* lightbox */
function openLightbox(i){ const c=camRegistry[i]; if(!c||c.kind==='link') return; lbIdx=i; const lb=$('#lightbox'); lb.hidden=false; lb.style.display='flex'; document.body.style.overflow='hidden';
  $('#lbTitle').textContent=c.name; const fr=$('#lbFrame'); if(lbRefresh) clearInterval(lbRefresh);
  if(c.kind==='img'){ fr.innerHTML=`<img alt="${esc(c.name)}" referrerpolicy="no-referrer">`; const im=fr.querySelector('img'); const load=()=>{ im.src=c.url+(c.url.includes('?')?'&':'?')+'t='+Date.now(); }; load(); lbRefresh=setInterval(load,15000); }
  else if(c.kind==='youtube') fr.innerHTML=`<iframe src="https://www.youtube.com/embed/${esc(c.id)}?autoplay=1&mute=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  else fr.innerHTML=`<iframe src="${esc(c.url)}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  const ids=c.near||c._loc||[]; const l=ids.map(id=>LOCATIONS.find(x=>x.id===id)).find(Boolean); const D=l&&state.derived[l.id];
  $('#lbFoot').innerHTML=`<span>${esc(c.sub||'')} · <a href="${esc(c.page||c.url)}" target="_blank" rel="noopener" style="color:#9fd0ff">${esc(c.provider||'source')} ↗</a></span><span>${D?`${esc(l.name)}: <b style="color:#fff">${inch(D.d1)} in</b> next 24 h · ${inch(D.d7)} in this week · ${D.conf.t} agreement`:''}</span>`; }
function closeLightbox(){ $('#lightbox').hidden=true; $('#lightbox').style.display='none'; document.body.style.overflow=''; if(lbRefresh) clearInterval(lbRefresh); setAuto(false); $('#lbFrame').innerHTML=''; }
function stepLightbox(d){ if(lbIdx<0) return; let i=lbIdx; for(let k=0;k<camRegistry.length;k++){ i=(i+d+camRegistry.length)%camRegistry.length; if(camRegistry[i].kind!=='link' && (camRegistry[i].kind!=='img' || camRegistry[i]._ok!==false)) break; } openLightbox(i); }
function setAuto(on){ lbAuto=on; if(lbTimer) clearInterval(lbTimer); lbTimer=null; if(on) lbTimer=setInterval(()=>stepLightbox(1), 8000); const b=$('#lbAuto'); if(b) b.textContent= on? '■ Stop auto-advance' : 'Auto-advance'; }
document.addEventListener('DOMContentLoaded', ()=>{ const lb0=$('#lightbox'); lb0.hidden=true; lb0.style.display='none'; $('#lbClose').onclick=closeLightbox; $('#lbPrev').onclick=()=>stepLightbox(-1); $('#lbNext').onclick=()=>stepLightbox(1); $('#lbAuto').onclick=()=>setAuto(!lbAuto); $('#lightbox').addEventListener('click',e=>{ if(e.target.id==='lightbox') closeLightbox(); });
  document.addEventListener('keydown',e=>{ if($('#lightbox').hidden) return; if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowRight') stepLightbox(1); if(e.key==='ArrowLeft') stepLightbox(-1); }); });
function drawDetailCams(l){
  const el=$('#detailCams'); if(!el) return; if(!camRegistry.length) buildRegistry();
  const list=camRegistry.filter(c=>(c._loc&&c._loc[0]===l.id)||(c.near||[]).includes(l.id));
  if(!list.length){ el.innerHTML=`<p class="small muted">No cams wired for this location yet.</p>`; return; }
  el.innerHTML=`<div class="wall" style="padding:12px"><div class="camGrid">${list.map(c=>camCard(c, camRegistry.indexOf(c))).join('')}</div></div>`; mountCams(el);
}
