/* ===================== Sources & methods tab ===================== */
function renderSources(){
  $('#sources').innerHTML = `
  <h2>Plain-English guide to the numbers</h2>
  <p>If you only read one section, read this one.</p>
  <dl class="kv" style="row-gap:10px;max-width:none">
    <dt>Agreement</dt><dd>Several weather models each make their own forecast. If they all land near the same total, agreement is <b>high</b> and the number is trustworthy. If one says 3 inches and another says 15, agreement is <b>low</b> and the number is a coin flip. The "model range" column shows that low-to-high spread. Day 1–2 is usually high; day 4–7 is often low, and that is normal.</dd>
    <dt>Ratio (snow-to-liquid)</dt><dd>How fluffy the snow is. It is the number of inches of snow you get from one inch of melted water. <b>10:1</b> is average. <b>15:1 to 20:1</b> is light, dry powder (cold storms). <b>5:1 to 8:1</b> is heavy, wet snow (warm storms, often early and late season). The same storm can give 6 inches of cement at one mountain and 12 inches of fluff at a colder one.</dd>
    <dt>Flow fit</dt><dd>Mountains get the most snow when the wind at ridge height blows up their favored side. "Favorable" means the forecast wind is coming from a direction that historically dumps on this mountain. "Shadowed" means a neighboring range is upwind and will steal the moisture. "Light winds" or "variable flow" means there is no strong push either way, so terrain matters less than usual.</dd>
    <dt>700 mb</dt><dd>A level in the atmosphere about 10,000 ft up, roughly ridge-top height for these ranges. Wind direction and temperature up there decide where the snow lands and how dense it is. It is the single level forecasters look at most for mountain snow.</dd>
    <dt>500 mb and the trough axis</dt><dd>About 18,000 ft up, where the storm's steering pattern lives. A "trough" is a dip in that pattern, meaning a storm. The trough axis is its center line; the map's <b>L</b> is the low center. Snow is heaviest just ahead of it (warm, moist, southwest wind) and turns colder and lighter behind it (northwest wind).</dd>
    <dt>Snow level</dt><dd>The elevation above which precipitation falls as snow. If it is above a resort's base, the bottom of the mountain gets rain or slush and the forecast total only applies up high.</dd>
    <dt>Powder score</dt><dd>A 0–100 ranking for the next three days that combines how much snow (45 points), how fluffy (20), how windy (15), how much the models agree (12) and whether the terrain lines up with the wind (8). 70+ means go; 50–70 means plan around the best morning; under 30 means wait.</dd>
    <dt>Ensemble</dt><dd>The same model run 30–50 times with tiny differences in the starting conditions. The band it draws shows the realistic range of outcomes. A narrow band means confidence; a wide band means the atmosphere is in a touchy state and any single forecast could be wrong.</dd>
    <dt>Gusts</dt><dd>Peak wind at the surface. Above about 40 mph, upper lifts go on wind hold and ridgelines get scoured; the best snow will be in sheltered trees.</dd>
    <dt>Blend</dt><dd>The headline number is the average of the global models. Switch it to a single model if you have a favorite; ECMWF is usually the most skillful, GFS updates most often.</dd>
  </dl>
  <h2 style="margin-top:22px">How to read this dashboard</h2>
  <p>Every number here is computed in your browser from raw model output, so you can see the ingredients instead of a resort's marketing number. The pipeline for each mountain:</p>
  <ol>
    <li><b>Liquid first.</b> Each model's hourly precipitation and snowfall are pulled for the mountain's coordinates, with the model's temperature profile downscaled to the upper-mountain elevation.</li>
    <li><b>Then the ratio.</b> Open-Meteo reports snowfall at a flat 7:1 ratio (7 cm of snow per 10 mm of water), which is far too dense for Colorado and Utah. The default here re-derives snow depth with a Kuchera-style ratio from the warmest temperature in the low-to-mid column (2 m, 850 mb, 700 mb), capped at 5–20:1, with a wind penalty above 25 mph. Switch the <i>Snow ratio</i> control to see the raw 7:1 number or a flat regional typical ratio.</li>
    <li><b>Then the blend.</b> The headline is the mean (or median) of the global models that cover the full 7 days; HRRR and other short-range models show in the charts but do not drive the 7-day total.</li>
    <li><b>Then the why.</b> During the hours each model has precipitation, the dashboard averages the 700 mb wind, temperature and humidity (precipitation-weighted) and compares the wind direction to the mountain's historically favored and shadowed sectors.</li>
  </ol>
  <h3>The columns, and what each one is telling you</h3>
  <table class="srcTable"><thead><tr><th>Column</th><th>What it is</th><th>How to use it</th></tr></thead><tbody>
    <tr><td>24 h / 72 h / 7 day</td><td>Blended snowfall from now, in inches</td><td>Day 1–2 is usually solid; day 4–7 is a trend, not a total.</td></tr>
    <tr><td>Model range</td><td>Lowest and highest 7-day total among the global models</td><td>A 6–18 in range means "a storm is likely, size unknown." Plan on the low end for travel, hope for the high end.</td></tr>
    <tr><td>Agreement</td><td>Range divided by the blended total: high &lt; 50 %, medium &lt; 100 %, low above</td><td>Low agreement plus a big number is the classic "wait for the next run" case. Open the ensemble in the detail view.</td></tr>
    <tr><td>Flow fit</td><td>700 mb wind direction during snow vs. the mountain's favored / shadowed sectors</td><td>Favorable means the models are probably <i>under</i>-forecasting (coarse grids smear terrain). Shadowed means be suspicious of a big number.</td></tr>
    <tr><td>Ratio</td><td>Estimated snow-to-liquid ratio while it is snowing</td><td>15:1 and up is blower powder; under 10:1 is heavy, wet, base-building snow.</td></tr>
    <tr><td>Snow level</td><td>Freezing level minus about 1,000 ft, during precipitation</td><td>If it sits above the base, the lower mountain gets rain or mix and the "total" only applies up high.</td></tr>
    <tr><td>Powder score</td><td>0–100 for the next 72 h: snow amount (45), ratio (20), wind (15), model agreement (12), flow fit (8)</td><td>A ranking of where the skiing is most likely to be good, not just where the most inches fall. Hover the meter for the breakdown.</td></tr>
    <tr><td>Gusts</td><td>Peak 10 m wind gust in the next 7 days</td><td>Above ~40 mph expect lift holds and wind-scoured ridges; the best snow will be in sheltered trees.</td></tr>
    <tr><td>Trough axis</td><td>Time the 500 mb height bottoms out</td><td>Snow is heaviest in the moist SW flow just ahead of it and turns to colder NW-flow snow behind it. It is the "storm track" in one number.</td></tr>
  </tbody></table>

  <h3>Why one mountain beats another: the physics in four lines</h3>
  <ul>
    <li><b>Direction.</b> Air forced up a slope cools and drops its moisture on the windward side, then dries on the lee side. At 700 mb (about 10,000 ft) the wind direction tells you which slopes are windward. NW flow loads Steamboat, the I-70 corridor and the Cottonwoods; SW flow loads Wolf Creek, the San Juans, Taos and the Wasatch Back / southern Utah; easterly upslope behind a Front Range low loads Eldora, Winter Park, Loveland and the foothills while the I-70 resorts west of the Divide sit under sun.</li>
    <li><b>Moisture.</b> 700 mb relative humidity near saturation (80 %+) and a deep moist layer make orographic lift efficient; dry mid-levels produce showery, hit-or-miss snow even with a good direction.</li>
    <li><b>Temperature.</b> Snow crystals grow fastest between −12 and −18 °C (the dendritic growth zone). When that layer sits in the cloud with saturation and lift, ratios run 15–25:1. Warm storms with 700 mb temps near −5 °C give 8–10:1 "cement".</li>
    <li><b>Track.</b> A closed low cut off over the Four Corners / Albuquerque means multi-day SW/NE flow: southern Colorado and the Front Range win, I-70 often dries out. A fast Pacific trough swings flow from SW to NW in a day: the San Juans get the front end, Steamboat and Vail get the back end. Split flow and cutoffs are where models disagree most.</li>
  </ul>

  <h2>Model guide (as of October 2026)</h2>
  <table class="srcTable"><thead><tr><th>Model</th><th>Resolution / range</th><th>Reputation for CO–UT snow</th></tr></thead><tbody>
    <tr><td>ECMWF IFS (Cycle 50r1, May 2026)</td><td>~9 km, 10 days; 51-member ENS</td><td>Best medium-range skill overall. Wet bias at valley elevations, slight dry bias on high terrain in the West (Caron &amp; Steenburgh 2020). Open data is served at 0.25°.</td></tr>
    <tr><td>NOAA GFS v16</td><td>13 km, 16 days; GEFS 31 members at ~25 km</td><td>Runs 4×/day, so it reacts fastest. Tends to be the wet outlier and flip-flops at day 4+. At Alta it averages 33 % dry on liquid vs. SNOTEL.</td></tr>
    <tr><td>DWD ICON</td><td>13 km, 7.5 days</td><td>Independent third opinion; useful tie-breaker when GFS and ECMWF split.</td></tr>
    <tr><td>Canadian GEM / GDPS</td><td>15 km, 10 days</td><td>Fourth opinion; NAEFS (GEFS + Canadian ensemble) plumes are a favorite Utah tool.</td></tr>
    <tr><td>NOAA HRRR</td><td>3 km, 18 h hourly / 48 h at synoptic runs</td><td>Best terrain detail for tonight and tomorrow; underestimates Colorado cold-season precipitation by 25–65 % vs SNOTEL, ~29 % dry at Alta.</td></tr>
    <tr><td>NOAA NBM v5.0 (Apr 2026)</td><td>2.5 km blend, 11 days</td><td>Weighted blend of ~100 inputs with calibrated snow probabilities and its own ratio / snow-level fields; the first guess for every NWS point forecast.</td></tr>
    <tr><td>ECMWF AIFS</td><td>0.25°, 15 days, machine learning</td><td>Excellent large-scale pattern skill, but smoothed: it cannot resolve orographic extremes, so treat its totals as a floor.</td></tr>
    <tr><td>RRFS / REFS</td><td>3 km, 84 h; 5-member ensemble + HRRR</td><td>NOAA's replacement for NAM / HREF; switchover scheduled Oct 14, 2026. Not yet in Open-Meteo.</td></tr>
  </tbody></table>

  <h2>Where the data comes from</h2>
  <table class="srcTable"><thead><tr><th>Source</th><th>Used for</th><th>Notes</th></tr></thead><tbody>
    <tr><td><a href="https://open-meteo.com/en/docs" target="_blank" rel="noopener">Open-Meteo forecast API</a></td><td>All hourly model fields</td><td>Free, no key, CORS, 10,000 calls/day. Each refresh here makes one request per model for all ${LOCATIONS.length} locations. Attribution: CC BY 4.0.</td></tr>
    <tr><td><a href="https://open-meteo.com/en/docs/ensemble-api" target="_blank" rel="noopener">Open-Meteo ensemble API</a></td><td>ECMWF ENS and GEFS member plumes</td><td>Loaded on demand per location (about 80 members).</td></tr>
    <tr><td><a href="https://www.weather.gov/documentation/services-web-api" target="_blank" rel="noopener">api.weather.gov</a></td><td>Gridpoint snowfall / QPF and Area Forecast Discussions</td><td>Free, CORS. The AFD is the single best free "why" document: the human forecaster's reasoning, model preferences and confidence, updated at least twice a day.</td></tr>
    <tr><td><a href="https://wcc.sc.egov.usda.gov/awdbRestApi/swagger-ui/index.html" target="_blank" rel="noopener">USDA NRCS AWDB (SNOTEL)</a></td><td>Measured snow depth, SWE and temperature</td><td>Ground truth for verification. If a request fails in your browser, the station link still opens the official page.</td></tr>
  </tbody></table>

  <h2>Expert sources worth reading alongside this (ranked)</h2>
  <ol>
    <li><b>NWS Area Forecast Discussions</b> — <a href="https://forecast.weather.gov/product.php?site=NWS&issuedby=BOU&product=AFD&format=CI&version=1&glossary=0" target="_blank" rel="noopener">Boulder</a> · <a href="https://forecast.weather.gov/product.php?site=NWS&issuedby=GJT&product=AFD&format=CI&version=1&glossary=0" target="_blank" rel="noopener">Grand Junction</a> · <a href="https://forecast.weather.gov/product.php?site=NWS&issuedby=PUB&product=AFD&format=CI&version=1&glossary=0" target="_blank" rel="noopener">Pueblo</a> · <a href="https://forecast.weather.gov/product.php?site=NWS&issuedby=SLC&product=AFD&format=CI&version=1&glossary=0" target="_blank" rel="noopener">Salt Lake City</a>. Free, 2+ per day, written to explain reasoning and alternate scenarios. Shown inside each location's detail here.</li>
    <li><b>OpenSnow</b> — <a href="https://opensnow.com/dailysnow/colorado" target="_blank" rel="noopener">Colorado Daily Snow</a> (Joel Gratz) and <a href="https://opensnow.com/dailysnow/utah" target="_blank" rel="noopener">Utah Daily Snow</a> (Evan Thayer). Narrative is free; Base ($49.99/yr) and Premium ($99.99/yr) tiers add the 3 km "PEAKS" downscaled model, 15-day and precipitation-type tools. Best plain-English storm-track confidence statements.</li>
    <li><b><a href="https://wasatchweatherweenies.blogspot.com/" target="_blank" rel="noopener">Wasatch Weather Weenies</a></b> — Jim Steenburgh (University of Utah), free. The scientific reference for Cottonwood snow, lake effect and ratios.</li>
    <li><b><a href="https://avalanche.state.co.us/" target="_blank" rel="noopener">CAIC weather</a></b> — twice-daily mountain weather for 21 Colorado sites plus an in-house 2 km WRF run 4×/day; <b><a href="https://utahavalanchecenter.org/forecasts" target="_blank" rel="noopener">Utah Avalanche Center</a></b> and the <a href="https://www.weather.gov/slc/mtnwx" target="_blank" rel="noopener">NWS SLC mountain weather page</a> for Utah.</li>
    <li><b><a href="https://www.wpc.ncep.noaa.gov/wwd/winter_wx.shtml" target="_blank" rel="noopener">WPC winter weather</a></b> — probabilistic snowfall (chance of 4 / 8 / 12 in), the Winter Storm Severity Index (WSSI and the 7-day WSSI-P), day 4–7 outlooks and Key Messages.</li>
    <li><b>Model graphics</b> — <a href="https://www.pivotalweather.com/" target="_blank" rel="noopener">Pivotal Weather</a> (700 mb maps, Kuchera snow, NBM), <a href="https://www.tropicaltidbits.com/analysis/models/" target="_blank" rel="noopener">Tropical Tidbits</a> (ensemble plumes, 500 mb heights for storm track), <a href="https://charts.ecmwf.int/" target="_blank" rel="noopener">ECMWF Open Charts</a> (free snowfall anomaly and extreme forecast index), <a href="https://www.windy.com/" target="_blank" rel="noopener">Windy</a> (quick multi-model point comparison), <a href="https://mag.ncep.noaa.gov/" target="_blank" rel="noopener">NOAA MAG</a> (NBM snow maps). WeatherBELL ($29.99/mo) adds 0.1° hourly ECMWF.</li>
    <li><b>Colorado independents</b> — <a href="https://www.bouldercast.com/" target="_blank" rel="noopener">BoulderCAST</a> (free weekly outlook, paid daily and SummitCAST), Chris Tomer (free, syndicated via Unofficial Networks and SnowBrains), <a href="https://powderchasers.com/" target="_blank" rel="noopener">Powderchasers</a> (free posts; paid chase concierge).</li>
    <li><b>Verification</b> — <a href="https://bestsnow.net/" target="_blank" rel="noopener">bestsnow.net</a> (Tony Crocker's independent snowfall records; resort claims run 10–40 % high at several areas) and SNOTEL.</li>
  </ol>

  <h2>Caveats you should know</h2>
  <ul>
    <li>Global models at 9–25 km put a mountain like Alta or Wolf Creek on a grid cell that averages thousands of feet of terrain. Expect them to under-forecast windward peaks and over-forecast valleys; this is why the flow-fit column exists.</li>
    <li>The Kuchera ratio is an estimate from temperature alone. NWS Utah uses an Alcott–Steenburgh regression (650 mb temperature and wind) and the NBM uses a Cobb-style method; all of them carry 4–8 ratio points of error on any given day.</li>
    <li>Favored / shadowed sectors are a mix of published studies (Steamboat, Cottonwoods, Wolf Creek, Front Range upslope) and forecaster consensus. They are written into the page and easy to edit.</li>
    <li>SNOTEL station IDs marked "from memory" were not verified against the USDA station list; the station name returned by the API is shown so you can catch a mismatch.</li>
    <li>Free Open-Meteo use is limited to roughly 10,000 requests a day per IP; this page caches each refresh for 30 minutes.</li>
  </ul>`;
}

/* ===================== Boot ===================== */
function applyTheme(){ const t=state.prefs.theme; if(t) document.documentElement.setAttribute('data-theme',t); else document.documentElement.removeAttribute('data-theme'); }
function renderAll(){ renderHero(); renderStats(); renderLedger(); renderMapDays(); renderMap(); renderPattern(); renderStrips(); renderCompare(); }
function renderRegionChips(){ const regs=[...new Set(LOCATIONS.map(l=>l.region))]; $('#regionChips').innerHTML=regs.map(r=>`<button class="chip" aria-pressed="${state.regions.has(r)}" data-r="${esc(r)}">${esc(r)}</button>`).join(''); $$('#regionChips .chip').forEach(c=>c.onclick=()=>{ const r=c.dataset.r; if(state.regions.has(r)) state.regions.delete(r); else state.regions.add(r); renderRegionChips(); renderAll(); }); }
function showNotices(){
  const bad=MODELS.filter(m=>state.models[m.id]&&!state.models[m.id].ok&&!m.optional); const opt=MODELS.filter(m=>m.optional&&state.models[m.id]&&!state.models[m.id].ok);
  const notes=MODELS.filter(m=>state.models[m.id]&&state.models[m.id].ok&&state.models[m.id].note).map(m=>`${m.short}: ${state.models[m.id].note}`);
  let html='';
  const okAny=MODELS.some(m=>state.models[m.id]&&state.models[m.id].ok);
  if(!okAny && location.protocol!=='file:'){ $('#notices').innerHTML='<div class="notice small">No data snapshot has been published to this page yet, and hosted pages cannot call the weather services directly. The downloadable file version fetches live model runs.</div>'; return; }
  if(bad.length) html+=`<div class="err">Could not load ${bad.map(m=>m.name).join(', ')} (${bad.map(m=>esc(state.models[m.id].err)).join('; ')}). If every model fails, the page is probably blocked from reaching api.open-meteo.com: open this file directly in a normal browser tab.</div>`;
  if(opt.length) html+=`<div class="notice">Optional models not available right now: ${opt.map(m=>m.short).join(', ')}. The blend uses the ${MODELS.filter(m=>state.models[m.id]&&state.models[m.id].ok&&m.days>=7).length} full-range models that loaded.</div>`;
  if(notes.length) html+=`<div class="notice small">${notes.map(esc).join(' · ')}</div>`;
  $('#notices').innerHTML=html;
}
async function loadSnapshot(){ if(location.protocol==='file:') return null; try{ const r=await fetch('data/snapshot.json',{cache:'no-store'}); if(!r.ok) return null; const j=await r.json(); return (j && j.models)? j : null; }catch(e){ return null; } }
function applySnapshot(snap){
  state.snapshot=snap;
  for(const m of MODELS){ const d=snap.models[m.id]; if(d&&d.data) d.data.forEach(x=>{ x.h=normaliseUnits(x.h, x.units); }); state.models[m.id]= d? Object.assign({fetchedAt:snap.fetchedAt, fromSnapshot:true}, d) : {ok:false, err:'not in snapshot'}; }
  Object.assign(state.afd, snap.afd||{}); Object.assign(state.nwsGrid, snap.nwsGrid||{}); Object.assign(state.snotel, snap.snotel||{});
  if(snap.ens){ for(const id in snap.ens){ const e=snap.ens[id]; for(const k in e){ if(e[k].finals){ const f=e[k].finals; e[k].prob = th=>f.filter(v=>v>=th).length/f.length; } } } Object.assign(state.ens, snap.ens); }
}
async function loadAll(force){
  setStatus('busy','Fetching model runs…'); state.now=Math.floor(Date.now()/1000); setLoad(0.05);
  if(!force){ const snap=await loadSnapshot(); if(snap){ applySnapshot(snap); try{ computeAll(); renderAll(); }catch(e){ console.error(e); } showNotices(); setLoad(1);
      const age=Math.round((Date.now()-snap.fetchedAt)/60000); const ok=MODELS.filter(m=>state.models[m.id]&&state.models[m.id].ok).length;
      setStatus(age<8*60?'ok':'warn', `${ok} models · snapshot from ${new Date(snap.fetchedAt).toLocaleString('en-US',{timeZone:TZ,weekday:'short',hour:'numeric',minute:'2-digit'})} MT (${age<60?age+' min':Math.round(age/60)+' h'} old)`);
      $('#notices').insertAdjacentHTML('afterbegin', `<div class="notice small">This hosted copy shows a data snapshot that is refreshed on a schedule. The downloadable file version pulls fresh model runs every time it opens.</div>`);
      return; } }
  let done=0; await Promise.all(MODELS.map(async m=>{ await fetchModel(m, force); done++; setLoad(0.05+0.85*done/MODELS.length); if(state.models['ecmwf_ifs025']&&state.models['ecmwf_ifs025'].ok&&done>=2){ try{ computeAll(); renderAll(); }catch(e){ console.error(e); } } }));
  try{ computeAll(); renderAll(); }catch(e){ console.error(e); setStatus('bad','Render error: '+e.message); }
  showNotices(); setLoad(1);
  const ok=MODELS.filter(m=>state.models[m.id]&&state.models[m.id].ok);
  if(!ok.length){ setStatus('bad','No model data loaded'); if(state.snapshot){ applySnapshot(state.snapshot); try{ computeAll(); renderAll(); }catch(e){} $('#notices').insertAdjacentHTML('afterbegin','<div class="err">This hosted page cannot call the weather APIs directly (browser security policy), so the snapshot stays in place. Open the downloaded file to fetch live runs.</div>'); } } else { const cached=ok.every(m=>state.models[m.id].fromCache); setStatus(ok.length>=4?'ok':'warn', `${ok.length} models loaded${cached?' (cached)':''} · ${new Date().toLocaleTimeString('en-US',{timeZone:TZ,hour:'numeric',minute:'2-digit'})} MT`); }
}
function init(){
  applyTheme();
  $('#slrMode').value=state.prefs.slrMode; $('#blendMode').value=state.prefs.blendMode; $('#drive').value=state.prefs.drive; $('#driveLbl').textContent= state.prefs.drive>=10?'any':state.prefs.drive+' h';
  $('#q').oninput=e=>{ state.q=e.target.value; renderHero(); renderStats(); renderLedger(); renderMap(); renderPattern(); renderStrips(); };
  $('#drive').oninput=e=>{ state.prefs.drive=+e.target.value; $('#driveLbl').textContent= state.prefs.drive>=10?'any':state.prefs.drive+' h'; savePrefs(); renderAll(); };
  $('#slrMode').onchange=e=>{ state.prefs.slrMode=e.target.value; savePrefs(); state.ens={}; computeAll(); renderAll(); if(state.selected) openDetail(state.selected); };
  $('#blendMode').onchange=e=>{ state.prefs.blendMode=e.target.value; savePrefs(); computeAll(); renderAll(); if(state.selected) openDetail(state.selected); };
  $('#btnRefresh').onclick=()=>loadAll(true);
  $('#btnTheme').onclick=()=>{ const cur=document.documentElement.getAttribute('data-theme'); const sysDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches; const isDark= cur? cur==='dark' : sysDark; state.prefs.theme= isDark?'light':'dark'; savePrefs(); applyTheme(); };
  $$('nav.tabs button').forEach(b=>b.onclick=()=>{ $$('nav.tabs button').forEach(x=>x.setAttribute('aria-selected', x===b)); $$('[role=tabpanel]').forEach(p=>p.hidden = p.id!=='tab-'+b.dataset.tab); $('#filters').hidden = b.dataset.tab==='sources'||b.dataset.tab==='cams'; if(b.dataset.tab==='cams') renderCamsTab(); else { camTimers.forEach(t=>clearInterval(t)); camTimers.length=0; } });
  $('#scrim').onclick=closeDetail; document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeDetail(); });
  renderRegionChips(); renderSources(); renderCompareOptions();
  $('#ledger thead').innerHTML='<tr>'+COLS.map(c=>`<th>${c.t}</th>`).join('')+'</tr>';
  loadAll(false);
}
/* ---------- Hero art: generated ridgelines and drifting snow ---------- */
function heroArt(){
  const c=$('#heroArt'); if(!c) return; const ctx=c.getContext('2d'); const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W=0,H=0,dpr=1,flakes=[],raf=null,last=0;
  const ridge=(seed, base, amp)=>{ const pts=[]; for(let x=0;x<=W+8;x+=6){ const u=x/W; let y=0; for(let k=1;k<=6;k++){ y+=Math.sin(u*Math.PI*2*k*0.9+seed*k*1.7+k*0.6)*amp/(k*0.9); } y+=Math.sin(u*55+seed*3)*amp*0.06; pts.push([x, base+y]); } return pts; };
  function size(){ const r=c.parentElement.getBoundingClientRect(); dpr=Math.min(2,window.devicePixelRatio||1); W=c.width=Math.max(10,Math.round(r.width*dpr)); H=c.height=Math.max(10,Math.round(r.height*dpr)); flakes=Array.from({length:Math.round(W/dpr/14)},()=>({x:Math.random()*W,y:Math.random()*H,r:(0.6+Math.random()*1.6)*dpr,v:(0.15+Math.random()*0.35)*dpr,w:Math.random()*Math.PI*2})); draw(0); }
  function draw(dt){ ctx.clearRect(0,0,W,H);
    // sun glow top-right
    const g=ctx.createRadialGradient(W*0.86,H*0.1,0,W*0.86,H*0.1,W*0.35); g.addColorStop(0,'rgba(255,255,255,0.16)'); g.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    const layers=[{b:0.58,a:0.09,f:0.10,s:0.30},{b:0.70,a:0.13,f:0.16,s:0.42},{b:0.82,a:0.17,f:0.24,s:0.55},{b:0.95,a:0.22,f:0.34,s:0.7}];
    layers.forEach((L,i)=>{ const pts=ridge(i*2.3+1.1, H*L.b, H*L.a); ctx.beginPath(); ctx.moveTo(0,H); pts.forEach(p=>ctx.lineTo(p[0],p[1])); ctx.lineTo(W,H); ctx.closePath(); ctx.fillStyle=`rgba(4,12,28,${L.f})`; ctx.fill(); ctx.beginPath(); pts.forEach((p,k)=>k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])); ctx.strokeStyle=`rgba(230,240,255,${L.s})`; ctx.lineWidth=1.1*dpr; ctx.stroke();
      // snow caps: lighter fill above a snow line on each ridge
      ctx.save(); ctx.beginPath(); ctx.moveTo(0,H); pts.forEach(p=>ctx.lineTo(p[0],p[1])); ctx.lineTo(W,H); ctx.closePath(); ctx.clip(); const snowLine=H*(L.b-L.a*0.35); const sg=ctx.createLinearGradient(0,snowLine-H*0.12,0,snowLine); sg.addColorStop(0,'rgba(255,255,255,0.22)'); sg.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=sg; ctx.fillRect(0,0,W,snowLine); ctx.restore(); });
    // flakes
    ctx.fillStyle='rgba(255,255,255,0.85)'; flakes.forEach(f=>{ ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill(); if(dt){ f.y+=f.v*dt/16; f.x+=Math.sin(f.w+=0.01*dt/16)*0.25*dpr; if(f.y>H+4){ f.y=-4; f.x=Math.random()*W; } } }); }
  function loop(ts){ if(document.hidden){ raf=null; return; } const dt=last?Math.min(50,ts-last):16; last=ts; draw(dt); raf=requestAnimationFrame(loop); }
  size(); window.addEventListener('resize', size); new ResizeObserver(size).observe(c.parentElement);
  if(!reduce){ raf=requestAnimationFrame(loop); document.addEventListener('visibilitychange',()=>{ if(!document.hidden&&!raf){ last=0; raf=requestAnimationFrame(loop); } }); }
}
/* ---------- Snapshot export (used by the scheduled refresher: open ?snapshot=1 in a headless browser) ---------- */
async function prefetchAllForSnapshot(){
  const offices=[...new Set(LOCATIONS.map(l=>l.nws))]; await Promise.all(offices.map(o=>fetchAFD(o)));
  for(const l of LOCATIONS){ await Promise.all([fetchNwsGrid(l), fetchSnotel(l), fetchEnsemble(l)]); }
}
window.__snapshot = async function(){ await prefetchAllForSnapshot(); const models={}; for(const m of MODELS){ const d=state.models[m.id]; if(d&&d.ok) models[m.id]={ok:true,data:d.data,note:d.note,usedId:d.usedId}; }
  const ens={}; for(const id in state.ens){ ens[id]={}; for(const k in state.ens[id]){ const e=state.ens[id][k]; ens[id][k]= e.bands? {name:e.name,n:e.n,bands:e.bands,finals:e.finals,p:e.p} : {name:e.name,err:e.err}; } }
  return {fetchedAt:Date.now(), models, afd:state.afd, nwsGrid:state.nwsGrid, snotel:state.snotel, ens}; };
document.addEventListener('DOMContentLoaded', ()=>{ init(); heroArt(); });
