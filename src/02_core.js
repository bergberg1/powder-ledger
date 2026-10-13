/* ===================== Core: config, fetch, derived metrics ===================== */
const TZ = 'America/Denver';
const CACHE_TTL_MS = 30*60*1000;
const MODELS = [
  {id:'ecmwf_ifs025', ids:['ecmwf_ifs025'], name:'ECMWF IFS', short:'ECMWF', color:'var(--s2)', hex:'#eb6834', res:'0.25° (~25 km) open data; the gold-standard global model', days:7, pressure:true, core:true},
  {id:'gfs_global',   ids:['gfs_global','ncep_gfs_global','gfs_seamless','ncep_gfs_seamless'],   name:'NOAA GFS',  short:'GFS',   color:'var(--s1)', hex:'#2a78d6', res:'0.11–0.25° (~13 km) global; runs 4×/day', days:7, pressure:true, core:true},
  {id:'icon_seamless',ids:['icon_seamless','dwd_icon_seamless'],name:'DWD ICON',  short:'ICON',  color:'var(--s3)', hex:'#1baf7a', res:'13 km global; German weather service', days:7, core:true},
  {id:'gem_seamless', ids:['gem_seamless','cmc_gem_seamless'], name:'Canadian GEM',short:'GEM', color:'var(--s4)', hex:'#eda100', res:'15 km global (2.5 km regional first 2 days)', days:7, core:true},
  {id:'gfs_hrrr',     ids:['gfs_hrrr','ncep_hrrr_conus'],     name:'NOAA HRRR', short:'HRRR',  color:'var(--s5)', hex:'#e87ba4', res:'3 km, 48 h only; best terrain detail short range', days:2, optional:true},
  {id:'ncep_nbm_conus',ids:['ncep_nbm_conus','nbm_conus'],name:'NOAA NBM',short:'NBM',   color:'var(--s6)', hex:'#008300', res:'2.5 km National Blend of Models (what NWS point forecasts start from)', days:7, optional:true},
  {id:'ecmwf_aifs025_single',ids:['ecmwf_aifs025_single','ecmwf_aifs025'],name:'ECMWF AIFS',short:'AIFS',color:'var(--s7)', hex:'#6250d6', res:'0.25° machine-learning model from ECMWF', days:7, optional:true},
];
const CORE_HOURLY = ['snowfall','precipitation','temperature_2m','wind_speed_10m','wind_direction_10m','weather_code'];
const EXT_HOURLY  = ['freezing_level_height','wind_gusts_10m'];
const PRES_HOURLY = ['temperature_700hPa','relative_humidity_700hPa','wind_speed_700hPa','wind_direction_700hPa','temperature_850hPa','geopotential_height_500hPa'];
const COMPASS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
const compassDeg = n => COMPASS.indexOf(n)*22.5;
const degToCompass = d => COMPASS[Math.round(((d%360)+360)%360/22.5)%16];

const state = {
  models:{},        // modelId -> {ok, data:[perLocation], fetchedAt, note}
  derived:{},       // locId -> derived metrics
  prefs: loadPrefs(),
  selected:null, sortKey:'d7', sortDir:'desc', regions:new Set(), q:'',
  mapDay:'all', stripDay:'all', offset:-6*3600, now:Math.floor(Date.now()/1000),
  afd:{}, nwsGrid:{}, snotel:{}, ens:{},
};
function loadPrefs(){ const d={slrMode:'kuchera', blendMode:'mean', drive:10, theme:'', favs:[]}; try{ const o=Object.assign(d, JSON.parse(localStorage.getItem('pl.prefs')||'{}')); if(!Array.isArray(o.favs)) o.favs=[]; return o; }catch(e){ return d; } }
function isFav(id){ return (state.prefs.favs||[]).includes(id); }
function toggleFav(id){ const f=state.prefs.favs||[]; const i=f.indexOf(id); if(i>=0) f.splice(i,1); else f.push(id); state.prefs.favs=f; savePrefs(); renderRegionChips(); renderAll(); if(state.selected){ const b=$('#detailStar'); if(b) b.setAttribute('aria-pressed', isFav(state.selected)); } }
function savePrefs(){ try{ localStorage.setItem('pl.prefs', JSON.stringify(state.prefs)); }catch(e){} }
function cacheGet(k){ try{ const v=JSON.parse(localStorage.getItem('pl.cache.'+k)||'null'); if(v && Date.now()-v.t<CACHE_TTL_MS) return v; }catch(e){} return null; }
function cacheSet(k,data){ try{ localStorage.setItem('pl.cache.'+k, JSON.stringify({t:Date.now(),data})); }catch(e){ /* quota: ignore */ } }

/* ---------- Open-Meteo ---------- */
function omUrl(modelId, vars, withElev, pastDays){
  const p = new URLSearchParams();
  if(pastDays) p.set('past_days', String(pastDays));
  p.set('latitude', LOCATIONS.map(l=>l.lat).join(','));
  p.set('longitude', LOCATIONS.map(l=>l.lon).join(','));
  if(withElev!==false) p.set('elevation', LOCATIONS.map(l=>Math.round(l.midFt*0.3048)).join(','));
  p.set('hourly', vars.join(','));
  p.set('models', modelId);
  p.set('timezone', TZ); p.set('timeformat','unixtime'); p.set('forecast_days','7');
  p.set('temperature_unit','fahrenheit'); p.set('wind_speed_unit','mph'); p.set('precipitation_unit','inch');
  return 'https://api.open-meteo.com/v1/forecast?'+p.toString();
}
// Open-Meteo reports geopotential height and freezing level in feet when imperial precipitation units are requested in some versions; keep everything in metres internally.
function normaliseUnits(h, units){
  if(!h) return h; const feet = k=>{ const u=units&&units[k]; if(u) return /ft|feet/i.test(u); const vals=(h[k]||[]).filter(v=>v!=null); if(!vals.length) return false; const med=vals.slice().sort((a,b)=>a-b)[vals.length>>1]; return med>8000; };
  for(const k of ['geopotential_height_500hPa','freezing_level_height']){ if(h[k] && feet(k)) h[k]=h[k].map(v=>v==null?null:v*0.3048); }
  return h;
}
async function fetchJson(url, opts){
  const r = await fetch(url, opts);
  let j=null; try{ j = await r.json(); }catch(e){}
  if(!r.ok || (j && j.error)) throw new Error((j && (j.reason||j.detail||j.title)) || ('HTTP '+r.status));
  return j;
}
async function fetchModel(m, force){
  const key = 'm.'+m.id;
  if(!force){ const c=cacheGet(key); if(c){ state.models[m.id] = Object.assign({fromCache:true, fetchedAt:c.t}, c.data); return; } }
  const attempts = [];
  for(const id of m.ids){
    for(const past of [3,0]){
      for(const elev of [true,false]){
        attempts.push({id, elev, past, vars:[...CORE_HOURLY, ...EXT_HOURLY, ...(m.pressure?PRES_HOURLY:[])], note: past?'':'no past-days history for this model'});
        if(m.pressure) attempts.push({id, elev, past, vars:[...CORE_HOURLY, ...EXT_HOURLY], note:'700 mb fields unavailable for this model'});
        attempts.push({id, elev, past, vars:[...CORE_HOURLY], note:'freezing level unavailable for this model'});
      }
    }
  }
  let lastErr=null;
  for(const a of attempts){
    try{
      const j = await fetchJson(omUrl(a.id, a.vars, a.elev, a.past));
      const arr = Array.isArray(j)?j:[j];
      if(arr.length!==LOCATIONS.length) throw new Error('location count mismatch');
      const data = {ok:true, data:arr.map(x=>({elev:x.elevation, offset:x.utc_offset_seconds, h:normaliseUnits(x.hourly, x.hourly_units), units:x.hourly_units})), note:a.note, usedId:a.id, pastDays:a.past};
      state.models[m.id] = Object.assign({fetchedAt:Date.now()}, data);
      cacheSet(key, data);
      return;
    }catch(e){ lastErr=e; }
  }
  state.models[m.id] = {ok:false, err:String(lastErr && lastErr.message || lastErr)};
}

/* ---------- Snow-to-liquid ratio ---------- */
// Open-Meteo snowfall is liquid × 7 (7:1). Liquid equivalent of the snow portion = snowfall/7.
function slrFor(loc, h, i){
  const mode = state.prefs.slrMode;
  if(mode==='fixed') return 7;
  if(mode==='typical') return loc.slrTypical || 14;
  // Kuchera-style: column max temperature proxy = warmest of 2 m, 850 mb, 700 mb (°F -> K)
  const cands = [h.temperature_2m && h.temperature_2m[i], (loc.midFt*0.3048<1600 && h.temperature_850hPa) ? h.temperature_850hPa[i] : null, h.temperature_700hPa && h.temperature_700hPa[i]].filter(v=>v!=null);
  if(!cands.length) return loc.slrTypical || 14;
  const tmaxF = Math.max(...cands); const tK = (tmaxF-32)*5/9 + 273.15;
  let slr = tK>271.16 ? 12 + 2*(271.16-tK) : 12 + (271.16-tK);
  const w = h.wind_speed_10m && h.wind_speed_10m[i]; if(w!=null && w>25) slr *= 0.85; // wind-packed
  return Math.max(5, Math.min(20, slr));
}
function adjustedSnow(loc, h, i){
  const raw = h.snowfall && h.snowfall[i]; if(raw==null) return null;
  if(state.prefs.slrMode==='fixed') return raw;
  return (raw/7) * slrFor(loc,h,i);
}

/* ---------- Derived metrics ---------- */
function dayIndex(t, offset){ return Math.floor((t+offset)/86400); }
function fmtDay(t, offset, style){ const d=new Date((t)*1000); return d.toLocaleDateString('en-US', Object.assign({timeZone:TZ}, style||{weekday:'short', month:'numeric', day:'numeric'})); }
function fmtHour(t){ return new Date(t*1000).toLocaleTimeString('en-US',{timeZone:TZ, hour:'numeric'}); }
function fmtDT(t){ return new Date(t*1000).toLocaleString('en-US',{timeZone:TZ, weekday:'short', hour:'numeric'}); }
function mean(a){ a=a.filter(v=>v!=null && !isNaN(v)); return a.length? a.reduce((s,v)=>s+v,0)/a.length : null; }
function median(a){ a=a.filter(v=>v!=null && !isNaN(v)).sort((x,y)=>x-y); if(!a.length) return null; const m=a.length>>1; return a.length%2? a[m] : (a[m-1]+a[m])/2; }
function quantile(sorted, q){ if(!sorted.length) return null; const pos=(sorted.length-1)*q, b=Math.floor(pos), r=pos-b; return sorted[b+1]!=null? sorted[b]+r*(sorted[b+1]-sorted[b]) : sorted[b]; }
function angDiff(a,b){ let d=Math.abs(a-b)%360; return d>180?360-d:d; }
function vecMean(dirs, spds, wts){ let u=0,v=0,W=0,S=0; for(let i=0;i<dirs.length;i++){ if(dirs[i]==null||spds[i]==null) continue; const w=(wts?wts[i]:1); if(!(w>0)) continue; const r=dirs[i]*Math.PI/180; u+= -Math.sin(r)*spds[i]*w; v+= -Math.cos(r)*spds[i]*w; S+=spds[i]*w; W+=w; } if(!W) return null; u/=W; v/=W; const vspd=Math.hypot(u,v), spd=S/W; let dir=(Math.atan2(-u,-v)*180/Math.PI+360)%360; return {dir, spd, vspd, steady: spd>0? vspd/spd : 0}; }
// Orographic fit: +1 favorable, 0 neutral, -1 shadowed, from flow direction vs the location's favored / shadowed sectors
function fitScore(loc, dir, steady, spd){
  if(dir==null) return null; if(steady!=null && steady<0.35) return 0; if(spd!=null && spd<6) return 0;
  const near = list => Math.min(...(list||[]).map(n=>angDiff(dir, compassDeg(n))), 999);
  const f = near(loc.favored), s = near(loc.shadowed);
  const fv = f<=22.5?1 : f<=45? 1-(f-22.5)/22.5 : 0;
  const sv = s<=22.5?1 : s<=45? 1-(s-22.5)/22.5 : 0;
  return fv - sv;
}
function fitLabel(v, flow){ if(v==null) return {t:'—', cls:'neutral'}; if(flow && flow.spd!=null && flow.spd<6) return {t:'light winds', cls:'neutral'}; if(flow && flow.steady!=null && flow.steady<0.35) return {t:'variable flow', cls:'neutral'}; if(v>=0.6) return {t:'favorable', cls:'high'}; if(v>=0.2) return {t:'leans favorable', cls:'high'}; if(v>-0.2) return {t:'neutral', cls:'neutral'}; if(v>-0.6) return {t:'leans shadowed', cls:'med'}; return {t:'shadowed', cls:'low'}; }

function computeAll(){
  const now = state.now;
  const ref = state.models['ecmwf_ifs025'] && state.models['ecmwf_ifs025'].ok ? state.models['ecmwf_ifs025'] : Object.values(state.models).find(m=>m.ok);
  if(!ref) return;
  state.offset = ref.data[0].offset;
  LOCATIONS.forEach((loc, li)=>{
    const times = ref.data[li].h.time;
    const n = times.length;
    const startIdx = Math.max(0, times.findIndex(t=>t>=now-3600));
    const perModel = {};
    for(const m of MODELS){
      const md = state.models[m.id]; if(!md || !md.ok) continue;
      const h = md.data[li].h; if(!h || !h.time) continue;
      // align by time
      const map = new Map(h.time.map((t,i)=>[t,i]));
      const snow = new Array(n).fill(null), liq=new Array(n).fill(null), slr=new Array(n).fill(null);
      let cover=0, pastCover=0;
      for(let i=0;i<n;i++){ const j=map.get(times[i]); if(j==null) continue; const s=adjustedSnow(loc,h,j); if(s!=null){ snow[i]=s; if(i>=startIdx) cover++; else pastCover++; } liq[i]= h.precipitation? h.precipitation[j] : null; slr[i]= (h.snowfall&&h.snowfall[j]>0)? slrFor(loc,h,j) : null; }
      const tot = (a,b)=>{ let s=0, any=false; for(let i=Math.max(0,a);i<Math.min(b,n);i++){ if(snow[i]!=null){ s+=snow[i]; any=true; } } return any? s : null; };
      perModel[m.id] = { snow, liq, slr, cover, pastCover, full: cover >= (n-startIdx)-2, hasPast: pastCover>=24, h, map,
        d1: tot(startIdx, startIdx+24), d3: tot(startIdx, startIdx+72), d7: tot(startIdx, n), p1: tot(startIdx-24, startIdx), p3: tot(startIdx-72, startIdx) };
    }
    // blend
    const blendIds = (()=>{ const bm=state.prefs.blendMode; if(bm==='mean'||bm==='median') return Object.keys(perModel).filter(id=>perModel[id].full); return perModel[bm]? [bm] : Object.keys(perModel).filter(id=>perModel[id].full); })();
    const blend = new Array(n).fill(null), blendLiq = new Array(n).fill(null);
    for(let i=0;i<n;i++){ const vals=blendIds.map(id=>perModel[id].snow[i]).filter(v=>v!=null); if(vals.length) blend[i] = state.prefs.blendMode==='median'? median(vals) : mean(vals); const lv=blendIds.map(id=>perModel[id].liq[i]).filter(v=>v!=null); if(lv.length) blendLiq[i]=mean(lv); }
    const sum=(arr,a,b)=>{ let s=0; for(let i=a;i<Math.min(b,n);i++) s+=arr[i]||0; return s; };
    const fullIds = Object.keys(perModel).filter(id=>perModel[id].full);
    const totals7 = fullIds.map(id=>perModel[id].d7).filter(v=>v!=null);
    const d7 = sum(blend,startIdx,n), d3=sum(blend,startIdx,startIdx+72), d1=sum(blend,startIdx,startIdx+24);
    const pastIdx0=Math.max(0,startIdx-72); const p1=sum(blend,Math.max(0,startIdx-24),startIdx), p3=sum(blend,pastIdx0,startIdx); const pastLiq3=sum(blendLiq,pastIdx0,startIdx);
    const hasPast = startIdx>=24;
    const mn = totals7.length? Math.min(...totals7):null, mx = totals7.length? Math.max(...totals7):null;
    const rel = (mx!=null && d7>0)? (mx-mn)/Math.max(d7,1) : 0;
    const conf = d7<1 ? {t:'dry', cls:'neutral', rel} : rel<0.5 ? {t:'high', cls:'high', rel} : rel<1.0 ? {t:'medium', cls:'med', rel} : {t:'low', cls:'low', rel};
    // daily buckets (local days)
    const days = []; const dayOf = times.map(t=>dayIndex(t, state.offset));
    const uniq = [...new Set(dayOf.slice(startIdx))];
    const pres = ['ecmwf_ifs025','gfs_global'].map(id=>perModel[id]).filter(p=>p && p.h.wind_direction_700hPa)[0];
    const presSrc = pres? MODELS.find(m=>perModel[m.id]===pres).short : null;
    for(const d of uniq){
      const idx = []; for(let i=startIdx;i<n;i++) if(dayOf[i]===d) idx.push(i);
      const first = times[idx[0]];
      const byModel = {}; for(const id in perModel){ const p=perModel[id]; let s=0, any=false; idx.forEach(i=>{ if(p.snow[i]!=null){ s+=p.snow[i]; any=true; } }); byModel[id]= any? s : null; }
      const bl = idx.reduce((s,i)=>s+(blend[i]||0),0);
      const liq = idx.reduce((s,i)=>s+(blendLiq[i]||0),0);
      let flow=null, rh=null, t700=null, t2=null, fzl=null, slrM=null, snowHours=0, peak=0, peakT=null, gust=null, h500=null;
      idx.forEach(i=>{ if((blend[i]||0)>=0.1) snowHours++; if((blend[i]||0)>peak){ peak=blend[i]; peakT=times[i]; } });
      if(pres){
        const h=pres.h; const snowW=idx.map(i=>{ const j=pres.map.get(times[i]); return j==null?0:Math.max(h.snowfall?h.snowfall[j]:0,0); }); const anySnow=snowW.some(v=>v>0); const w=idx.map((i,k)=>{ const j=pres.map.get(times[i]); return j==null?0:((anySnow? snowW[k] : Math.max(h.precipitation?h.precipitation[j]:0,0))+0.001); });
        const dirs=idx.map(i=>{ const j=pres.map.get(times[i]); return j==null?null:h.wind_direction_700hPa[j]; });
        const spds=idx.map(i=>{ const j=pres.map.get(times[i]); return j==null?null:h.wind_speed_700hPa[j]; });
        flow = vecMean(dirs, spds, w);
        const wm=(arr)=>{ let s=0,W=0; idx.forEach((i,k)=>{ const j=pres.map.get(times[i]); if(j==null||!arr||arr[j]==null) return; s+=arr[j]*w[k]; W+=w[k]; }); return W? s/W : null; };
        rh = wm(h.relative_humidity_700hPa); t700 = wm(h.temperature_700hPa); t2 = wm(h.temperature_2m); fzl = wm(h.freezing_level_height);
        if(fzl==null){ // freezing level from whichever model carries it (ECMWF open data often lacks it)
          const alt=['gfs_global','icon_seamless','gem_seamless','ncep_nbm_conus'].map(id=>perModel[id]).find(p=>p&&p.h.freezing_level_height&&p.h.freezing_level_height.some(v=>v!=null));
          if(alt){ let s=0,W=0; idx.forEach((i,k)=>{ const j=alt.map.get(times[i]); const v=j==null?null:alt.h.freezing_level_height[j]; if(v==null) return; s+=v*w[k]; W+=w[k]; }); fzl = W? s/W : null; }
        }
        const sl = idx.map(i=>{ const j=pres.map.get(times[i]); return j==null?null:pres.slr[i]; }).filter(v=>v!=null); slrM = sl.length? mean(sl) : null;
        if(h.wind_gusts_10m){ const g=idx.map(i=>{ const j=pres.map.get(times[i]); return j==null?null:h.wind_gusts_10m[j]; }).filter(v=>v!=null); gust = g.length? Math.max(...g) : null; }
        if(h.geopotential_height_500hPa){ h500 = wm(h.geopotential_height_500hPa); }
      }
      days.push({d, t:first, label:fmtDay(first), blend:bl, liq, byModel, flow, rh, t700, t2, fzl, slr:slrM, snowHours, peak, peakT, gust, h500, fit: flow? fitScore(loc, flow.dir, flow.steady, flow.spd) : null});
    }
    const pastDays=[]; if(hasPast){ const pu=[...new Set(dayOf.slice(pastIdx0,startIdx))]; for(const d of pu){ const idx=[]; for(let i=pastIdx0;i<startIdx;i++) if(dayOf[i]===d) idx.push(i); const bl=idx.reduce((s,i)=>s+(blend[i]||0),0); const liq=idx.reduce((s,i)=>s+(blendLiq[i]||0),0); const byModel={}; for(const id in perModel){ const pm=perModel[id]; let t=0,any=false; idx.forEach(i=>{ if(pm.snow[i]!=null){ t+=pm.snow[i]; any=true; } }); byModel[id]=any?t:null; } pastDays.push({d, t:times[idx[0]], label:fmtDay(times[idx[0]]), blend:bl, liq, byModel, past:true, hours:idx.length}); } }
    // overall flow during snow (precip-weighted over 7 days)
    const wDays = days.map(x=>x.blend+0.01);
    const flow7 = days.some(x=>x.flow)? vecMean(days.map(x=>x.flow?x.flow.dir:null), days.map(x=>x.flow?x.flow.spd:null), wDays) : null;
    const fit7 = flow7? ((flow7.steady<0.35||flow7.spd<6) ? 0 : (()=>{ let s=0,W=0; days.forEach((x,k)=>{ if(x.fit==null) return; s+=x.fit*wDays[k]; W+=wDays[k]; }); return W? s/W : null; })()) : null;
    const slr7 = (()=>{ let s=0,W=0; days.forEach(x=>{ if(x.slr==null) return; s+=x.slr*x.blend; W+=x.blend; }); return W? s/W : null; })();
    const t7000 = (()=>{ let s=0,W=0; days.forEach(x=>{ if(x.t700==null) return; s+=x.t700*(x.blend+0.01); W+=x.blend+0.01; }); return W? s/W : null; })();
    const fzl7 = (()=>{ let s=0,W=0; days.forEach(x=>{ if(x.fzl==null) return; s+=x.fzl*(x.blend+0.01); W+=x.blend+0.01; }); return W? s/W : null; })();
    const rh7 = (()=>{ let s=0,W=0; days.forEach(x=>{ if(x.rh==null) return; s+=x.rh*(x.blend+0.01); W+=x.blend+0.01; }); return W? s/W : null; })();
    const liq7 = sum(blendLiq,startIdx,n);
    // 500 mb trough passage (height minimum) and gust max
    let trough=null, gust7=null;
    if(pres && pres.h.geopotential_height_500hPa){ let minV=Infinity, minT=null, maxV=-Infinity; for(let i=startIdx;i<n;i++){ const j=pres.map.get(times[i]); if(j==null) continue; const v=pres.h.geopotential_height_500hPa[j]; if(v==null) continue; if(v<minV){ minV=v; minT=times[i]; } if(v>maxV) maxV=v; } if(minT!=null) trough={t:minT, min:minV, drop:maxV-minV}; }
    if(pres && pres.h.wind_gusts_10m){ let g=0; for(let i=startIdx;i<n;i++){ const j=pres.map.get(times[i]); if(j!=null && pres.h.wind_gusts_10m[j]>g) g=pres.h.wind_gusts_10m[j]; } gust7=g; }
    // wettest / driest model
    let wet=null, dry=null; fullIds.forEach(id=>{ const v=perModel[id].d7; if(v==null) return; if(!wet||v>perModel[wet].d7) wet=id; if(!dry||v<perModel[dry].d7) dry=id; });
    // Powder score 0–100: how good the skiing is likely to be in the next 72 h
    const gustIn3 = (()=>{ if(!pres||!pres.h.wind_gusts_10m) return null; let g=0; for(let i=startIdx;i<Math.min(n,startIdx+72);i++){ const j=pres.map.get(times[i]); if(j!=null&&(blend[i]||0)>0.05&&pres.h.wind_gusts_10m[j]>g) g=pres.h.wind_gusts_10m[j]; } return g; })();
    const slr3 = (()=>{ let s=0,W=0; days.slice(0,3).forEach(x=>{ if(x.slr==null) return; s+=x.slr*x.blend; W+=x.blend; }); return W? s/W : null; })();
    const powder = { snow: Math.min(1, d3/18)*45, ratio: slr3==null? 10 : Math.max(0,Math.min(1,(slr3-8)/10))*20, wind: gustIn3==null? 8 : gustIn3<25? 15 : gustIn3<40? 8 : 0, conf: conf.cls==='high'?12:conf.cls==='med'?7:conf.cls==='neutral'?4:2, fit: fit7==null? 4 : (fit7+1)/2*8 };
    powder.total = Math.round(powder.snow+powder.ratio+powder.wind+powder.conf+powder.fit); powder.gust=gustIn3; powder.slr3=slr3;
    state.derived[loc.id] = {times, startIdx, n, perModel, blend, blendLiq, d1, d3, d7, liq7, mn, mx, conf, days, flow7, fit7, slr7, t7000, fzl7, rh7, wet, dry, presSrc, nModels: fullIds.length, trough, gust7, powder, pres, p1, p3, pastLiq3, pastDays, pastIdx0, hasPast};
  });
}

/* ---------- Ensemble (on demand) ---------- */
async function fetchEnsemble(loc){
  if(state.ens[loc.id]) return state.ens[loc.id];
  const out = {};
  for(const em of [{id:'ecmwf_ifs025', ids:['ecmwf_ifs025_ensemble','ecmwf_ifs025'], name:'ECMWF ENS (51 members)'},{id:'gfs025', ids:['ncep_gefs025','gfs025'], name:'GEFS (31 members)'}]){
    try{
      let j=null, lastErr=null;
      for(const mid of em.ids){ for(const elev of [true,false]){ try{ const p = new URLSearchParams({latitude:loc.lat, longitude:loc.lon, hourly:'snowfall,temperature_2m', models:mid, timezone:TZ, timeformat:'unixtime', forecast_days:'7', temperature_unit:'fahrenheit', precipitation_unit:'inch'}); if(elev) p.set('elevation', Math.round(loc.midFt*0.3048)); j = await fetchJson('https://ensemble-api.open-meteo.com/v1/ensemble?'+p); break; }catch(e){ lastErr=e; } } if(j) break; }
      if(!j) throw lastErr||new Error('ensemble unavailable');
      const h=j.hourly; const keys=Object.keys(h).filter(k=>k.startsWith('snowfall'));
      const D = state.derived[loc.id]; const t0 = D.times[D.startIdx];
      const members = keys.map(k=>{ const suf=k.replace('snowfall',''); const temp=h['temperature_2m'+suf]||h.temperature_2m; const cum=[]; let s=0; for(let i=0;i<h.time.length;i++){ if(h.time[i]<t0){ cum.push(0); continue; } const raw=h.snowfall===undefined?null:h[k][i]; let v=0; if(raw!=null){ if(state.prefs.slrMode==='fixed') v=raw; else if(state.prefs.slrMode==='typical') v=raw/7*(loc.slrTypical||14); else { const tK=((temp&&temp[i]!=null?temp[i]:20)-32)*5/9+273.15; let slr=tK>271.16?12+2*(271.16-tK):12+(271.16-tK); slr=Math.max(5,Math.min(20,slr)); v=raw/7*slr; } } s+=v; cum.push(s); } return cum; });
      const times=h.time; const nT=times.length;
      const bands = times.map((t,i)=>{ const vals=members.map(m=>m[i]).sort((a,b)=>a-b); return {t, p10:quantile(vals,.1), p25:quantile(vals,.25), p50:quantile(vals,.5), p75:quantile(vals,.75), p90:quantile(vals,.9)}; });
      const finals = members.map(m=>m[nT-1]).sort((a,b)=>a-b);
      out[em.id] = {name:em.name, n:members.length, bands, finals, p:{p10:quantile(finals,.1), p25:quantile(finals,.25), p50:quantile(finals,.5), p75:quantile(finals,.75), p90:quantile(finals,.9)}, prob:th=>finals.filter(v=>v>=th).length/finals.length, times};
    }catch(e){ out[em.id] = {name:em.name, err:String(e.message||e)}; }
  }
  state.ens[loc.id]=out; return out;
}

/* ---------- NWS ---------- */
const NWS_HEADERS = undefined;
async function fetchAFD(office){
  if(state.afd[office]) return state.afd[office];
  try{
    const list = await fetchJson(`https://api.weather.gov/products/types/AFD/locations/${office}`);
    const first = list['@graph'] && list['@graph'][0]; if(!first) throw new Error('no AFD listed');
    const prod = await fetchJson(first['@id']);
    state.afd[office] = {ok:true, issued:prod.issuanceTime, text:prod.productText};
  }catch(e){ state.afd[office] = {ok:false, err:String(e.message||e)}; }
  return state.afd[office];
}
async function fetchNwsGrid(loc){
  if(state.nwsGrid[loc.id]) return state.nwsGrid[loc.id];
  try{
    const pt = await fetchJson(`https://api.weather.gov/points/${loc.lat.toFixed(4)},${loc.lon.toFixed(4)}`);
    const grid = await fetchJson(pt.properties.forecastGridData);
    const P = grid.properties;
    const parse = (prop)=>{ const v=(P[prop]&&P[prop].values)||[]; return v.map(x=>{ const [start,dur]=x.validTime.split('/'); const t=Date.parse(start)/1000; const m=/P(?:(\d+)D)?T?(?:(\d+)H)?/.exec(dur||'PT1H'); const hrs=(m?((+m[1]||0)*24+(+m[2]||0)):1)||1; return {t, hrs, v:x.value}; }); };
    const snow = parse('snowfallAmount'), qpf = parse('quantitativePrecipitation'), pop = parse('probabilityOfPrecipitation');
    const now = state.now, end = now+7*86400;
    const sumIn = arr => arr.filter(x=>x.t+x.hrs*3600>now && x.t<end && x.v!=null).reduce((s,x)=>s+x.v,0)/25.4;
    const sum3 = arr => arr.filter(x=>x.t+x.hrs*3600>now && x.t<now+72*3600 && x.v!=null).reduce((s,x)=>s+x.v,0)/25.4;
    const byDay = {}; snow.forEach(x=>{ if(x.v==null||x.t<now-6*3600) return; const d=fmtDay(x.t); byDay[d]=(byDay[d]||0)+x.v/25.4; });
    state.nwsGrid[loc.id] = {ok:true, office:pt.properties.gridId, gridX:pt.properties.gridX, gridY:pt.properties.gridY, forecastUrl:pt.properties.forecast, snow7:sumIn(snow), snow3:sum3(snow), qpf7:sumIn(qpf), byDay, popMax: Math.max(0,...pop.filter(x=>x.t>now&&x.t<end&&x.v!=null).map(x=>x.v)), elevM: P.elevation && P.elevation.value, updated:P.updateTime};
  }catch(e){ state.nwsGrid[loc.id] = {ok:false, err:String(e.message||e)}; }
  return state.nwsGrid[loc.id];
}

/* ---------- SNOTEL ---------- */
async function fetchSnotel(loc){
  if(!loc.snotel) return null;
  if(state.snotel[loc.id]) return state.snotel[loc.id];
  const end = new Date(); const begin = new Date(Date.now()-9*86400000);
  const f = d=>d.toISOString().slice(0,10);
  try{
    const p = new URLSearchParams({stationTriplets:loc.snotel, elements:'SNWD,WTEQ,TOBS,PREC', duration:'DAILY', beginDate:f(begin), endDate:f(end), periodRef:'END'});
    const j = await fetchJson('https://wcc.sc.egov.usda.gov/awdbRestApi/services/v1/data?'+p);
    const st = Array.isArray(j)? j[0] : j; const series = {};
    (st && st.data||[]).forEach(d=>{ const code=(d.stationElement&&d.stationElement.elementCode)||d.elementCode||'?'; series[code]=(d.values||[]).map(v=>({date:v.date, v:v.value})); });
    let name=null, elev=null; try{ const sj = await fetchJson('https://wcc.sc.egov.usda.gov/awdbRestApi/services/v1/stations?stationTriplets='+encodeURIComponent(loc.snotel)); const s0=Array.isArray(sj)?sj[0]:sj; if(s0){ name=s0.name; elev=s0.elevation; } }catch(e){}
    state.snotel[loc.id] = {ok:true, series, name, elev};
  }catch(e){ state.snotel[loc.id] = {ok:false, err:String(e.message||e)}; }
  return state.snotel[loc.id];
}
