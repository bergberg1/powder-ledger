// Pulls a fresh data snapshot for the hosted (artifact) copy of Powder Ledger.
// Usage: node tools/refresh_snapshot.js  -> writes artifact/data/snapshot.json
// Needs network access to api.open-meteo.com, ensemble-api.open-meteo.com, api.weather.gov, wcc.sc.egov.usda.gov
const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path'); const http=require('http');
const ROOT=path.resolve(__dirname,'..'); const SITE=path.join(ROOT,'artifact');
(async()=>{
  // serve the artifact folder so the page runs under http (file:// skips snapshot logic and blocks fetch in some browsers)
  const srv=http.createServer((req,res)=>{ const p=path.join(SITE, req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]); fs.readFile(p,(e,d)=>{ if(e){ res.writeHead(404); res.end(); return; } res.writeHead(200,{'Content-Type': p.endsWith('.json')?'application/json':'text/html'}); res.end(d); }); }).listen(0);
  const port=srv.address().port;
  const browser=await chromium.launch(); const page=await browser.newPage();
  page.on('console',m=>{ if(m.type()==='error') console.error('console:', m.text()); });
  // never load an old snapshot while making a new one
  await page.route('**/data/snapshot.json', r=>r.fulfill({status:404, body:''}));
  await page.goto(`http://127.0.0.1:${port}/index.html?snapshot=1`);
  await page.waitForFunction(()=>/models loaded|No model/i.test(document.querySelector('#stText').textContent), null, {timeout:120000});
  const status=await page.textContent('#stText'); console.log('page status:', status);
  if(/No model/.test(status)) { console.error('No model data; aborting'); process.exit(2); }
  const snap=await page.evaluate(()=>window.__snapshot());
  const json=JSON.stringify(snap,(k,v)=>typeof v==='number'&&!Number.isInteger(v)?Math.round(v*1000)/1000:v);
  fs.mkdirSync(path.join(SITE,'data'),{recursive:true}); fs.writeFileSync(path.join(SITE,'data','snapshot.json'), json);
  console.log('wrote', path.join(SITE,'data','snapshot.json'), (json.length/1e6).toFixed(2),'MB', 'models:', Object.keys(snap.models).join(','));
  await browser.close(); srv.close();
})().catch(e=>{ console.error(e); process.exit(1); });
