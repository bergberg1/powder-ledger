/* ===================== Cams =====================
   kind: 'img' (still image, auto-refreshed), 'youtube' (live stream id), 'iframe', or 'link' (official page only).
   Every 'img' / 'youtube' / 'iframe' entry below was fetched and checked on checkedAt (status 200, image content type,
   real photo, no hotlink block; iframes send no X-Frame-Options / frame-ancestors). See docs/cams-verified.md for the
   full test table. 'link' entries are feeds that failed verification (stale image, offline stream, embedding blocked)
   and fall back to the official page. COtrip stills: cocam.carsprogram.org (Snapshots/* are 320x240 frames of the
   CDOT video streams, Cellular/* are 352x240 stills that update every few minutes). UDOT stills: /map/Cctv/<id>. */
window.CAMS = {
  passes: [
    // ---- I-70 corridor (COtrip) ----
    {name:'Eisenhower Tunnel west portal', sub:'I-70 MP 213.45 EB : 0.1 miles W of Eisenhower Tunnel (cam 15404)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070E21345CAM1RHS-T.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Eisenhower', near:['loveland','lovelandpass','abasin','keystone','breck','copper']},
    {name:'Eisenhower Tunnel east portal', sub:'I-70 MP 215.60 EB : 0.3 miles E of Eisenhower Tunnel (cam 15331)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070E21560CAM1GP2.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Eisenhower', near:['loveland','lovelandpass','abasin','keystone','breck','copper']},
    {name:'Loveland Pass (US-6)', sub:'US 6 MP 226.25 WB : 2.5 miles W of Loveland Ski Area (cam 15682)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/006W22625CAM2RHS.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Loveland%20Pass', near:['lovelandpass','abasin','loveland','keystone']},
    {name:'Vail Pass summit', sub:'I-70 MP 190.10 EB at Vail Pass Summit (cam 15573)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070E19010CAM1RP1.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Vail%20Pass', near:['vailpass','vail','copper','beavercreek']},
    {name:'Vail Pass west side', sub:'I-70 MP 189.45 WB : 0.7 miles W of Vail Pass Summit (cam 15278)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070W18945CAM1RHS.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Vail%20Pass', near:['vailpass','vail','copper','beavercreek']},
    {name:'Copper Mountain / CO-91', sub:'I-70 MP 195.25 EB at CO 91 in Copper Mountain (cam 15254)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070E19525CAM2RHS.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Copper', near:['copper','vailpass']},
    {name:'Silverthorne', sub:'I-70 MP 205.75 WB : 0.3 miles E of US 6/CO 9 in Silverthorne (cam 14903)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070W20575CAM1RHS.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Silverthorne', near:['keystone','breck','abasin','loveland']},
    {name:'Georgetown', sub:'I-70 MP 228.00 WB : 0.1 miles E of 15th St in Georgetown (cam 15296)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070W22800CAM1RHS.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Georgetown', near:['loveland','lovelandpass','abasin','echo']},
    {name:'Floyd Hill', sub:'I-70 MP 243.25 WB : 0.3 miles E of Central City Pkwy (cam 15540)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070W24325CAM1RHS.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Floyd%20Hill', near:['echo','eldora','loveland','winterpark']},
    {name:'Idaho Springs / Veterans Memorial Tunnels', sub:'I-70 MP 242.00 EB : 0.2 miles W of Veterans Memorial Tunnels (cam 15425)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070E24200CAM1RP1.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Idaho%20Springs', near:['echo','loveland','winterpark']},
    {name:'Vail (Vail Rd)', sub:'I-70 MP 175.85 WB : 0.3 miles W of Vail Rd (cam 15250)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070W17585CAM1RHS.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Vail', near:['vail','beavercreek']},
    {name:'Glenwood Canyon: No Name', sub:'I-70 MP 117.65 WB at W No Name Tunnel (cam 15102)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070W11765CAM1RHS.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Glenwood', near:['sunlight','aspen','highlands','snowmass','powderhorn']},
    {name:'Glenwood Canyon: Grizzly Creek', sub:'I-70 MP 120.85 WB : 0.2 miles W of Grizzly Creek Rest Area (cam 15031)', region:'I-70 corridor', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/070W12085CAM1RHS.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Glenwood', near:['sunlight','aspen','highlands','snowmass','powderhorn']},
    // ---- Front Range ----
    {name:'Berthoud Pass (US-40 MP 243)', sub:'COtrip cam 9314 exists but its stills were last captured 3 Aug 2026 (stale), so this opens the official list', region:'Front Range', provider:'COtrip', kind:'link', page:'https://maps.cotrip.org/list/cameras?searchTerm=Berthoud', near:['berthoud','winterpark']},
    {name:'Berthoud Falls (US-40 below the pass)', sub:'US 40 MP 248.85 WB at Berthoud Falls, looking west (cam 964, cellular still, updates every few minutes)', region:'Front Range', provider:'COtrip', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Cellular/040W24885CAM1RHS-W.jpg', page:'https://maps.cotrip.org/list/cameras?searchTerm=Berthoud', near:['berthoud','winterpark']},
    {name:'Winter Park / Mary Jane Rd (US-40)', sub:'US 40 MP 234.60 EB : 0.1 miles E of Mary Jane Rd, looking east (cam 963, cellular still)', region:'Front Range', provider:'COtrip', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Cellular/040E23460CAM1GP1-E.jpg', page:'https://maps.cotrip.org/list/cameras?searchTerm=Winter%20Park', near:['berthoud','winterpark']},
    {name:'US-285 at Grant (below Kenosha Pass)', sub:'US 285 MP 207.85 NB : 0.2 miles N of CR 60 in Grant, looking north (cam 9285, cellular still)', region:'Front Range', provider:'COtrip', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Cellular/285N20785CAM1RHS-N.jpg', page:'https://maps.cotrip.org/list/cameras?searchTerm=285', near:['breck']},
    // ---- Northern Colorado ----
    {name:'Rabbit Ears Pass (US-40)', sub:'COtrip cam 9321 (5.5 mi W of the pass) stills were last captured 12 Aug 2026 (stale), so this opens the official list', region:'Northern Colorado', provider:'COtrip', kind:'link', page:'https://maps.cotrip.org/list/cameras?searchTerm=Rabbit%20Ears', near:['rabbitears','steamboat']},
    // ---- Aspen & Central ----
    {name:'Monarch Pass (US-50)', sub:'US 50 MP 199.35 EB at Monarch Pass, looking west (cam 944, cellular still, updates every few minutes)', region:'Aspen & Central', provider:'COtrip', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Cellular/050W19935CAM1RHS-W.jpg', page:'https://maps.cotrip.org/list/cameras?searchTerm=Monarch', near:['monarch','crestedbutte']},
    {name:'Fremont Pass (CO-91)', sub:'CO 91 MP 011.10 SB at Fremont Pass, looking south (cam 1020, cellular still)', region:'Aspen & Central', provider:'COtrip', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Cellular/091S01110CAM1RHS-S.jpg', page:'https://maps.cotrip.org/list/cameras?searchTerm=Fremont', near:['copper','cooper']},
    {name:'Independence Pass (CO-82, closed in winter)', sub:'CO-82 W MM 62.05 at Independence Pass, road surface (cam 9297, cellular still)', region:'Aspen & Central', provider:'COtrip', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Cellular/082W06215CAM1RHS-RoadSurface.jpg', page:'https://maps.cotrip.org/list/cameras?searchTerm=Independence', near:['aspen','highlands','snowmass']},
    // ---- San Juans ----
    {name:'Wolf Creek Pass, east of the ski area', sub:'US 160 MP 168.20 EB : 0.5 miles E of Wolf Creek Ski Area, looking west (cam 997, cellular still)', region:'San Juans', provider:'COtrip', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Cellular/160E16820CAM1RHS-W.jpg', page:'https://maps.cotrip.org/list/cameras?searchTerm=Wolf%20Creek', near:['wolfcreek','wolfcreekpass']},
    {name:'Wolf Creek Pass, west side', sub:'US 160 MP 165.15 EB : 2.6 miles W of Wolf Creek Ski Area (cam 15422)', region:'San Juans', provider:'COtrip', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Snapshots/160E16515CAM2RHS.flv.png', page:'https://maps.cotrip.org/list/cameras?searchTerm=Wolf%20Creek', near:['wolfcreek','wolfcreekpass']},
    {name:'Red Mountain Pass (US-550)', sub:'US 550 MP 087.95 NB : 2.2 miles N of Ironton, looking north (cam 9304, cellular still, updates a few times a day)', region:'San Juans', provider:'COtrip', kind:'img', refresh:300, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Cellular/550N08795CAM1RHS-N.jpg', page:'https://maps.cotrip.org/list/cameras?searchTerm=Red%20Mountain', near:['redmtnpass','silverton','telluride','purgatory']},
    {name:'Silverton (US-550)', sub:'US 550 MP 070.65 NB : 0.2 miles W of CO 110 in Silverton, looking north (cam 951, cellular still)', region:'San Juans', provider:'COtrip', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://cocam.carsprogram.org/Cellular/550N07065CAM1RHS-N.jpg', page:'https://maps.cotrip.org/list/cameras?searchTerm=Silverton', near:['silverton','redmtnpass','purgatory']},
    // ---- Cottonwoods (UDOT) ----
    {name:'Little Cottonwood: mouth', sub:'SR-210 @ Little Cottonwood Rd / SR-209 (UDOT 164559)', region:'Cottonwoods', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/164559', page:'https://cottonwoodcanyons.udot.utah.gov/road-information/', near:['alta','snowbird']},
    {name:'Little Cottonwood: Seven Turns', sub:'SR-210 EB @ Seven Turns / MP 7.4 (UDOT 166033)', region:'Cottonwoods', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/166033', page:'https://cottonwoodcanyons.udot.utah.gov/road-information/', near:['alta','snowbird']},
    {name:'Little Cottonwood: White Pine', sub:'SR-210 EB @ White Pine Parking / MP 9.2 (UDOT 165998)', region:'Cottonwoods', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/165998', page:'https://cottonwoodcanyons.udot.utah.gov/road-information/', near:['alta','snowbird']},
    {name:'Little Cottonwood: Alta Bypass (Snowbird)', sub:'SR-210 EB @ Alta Bypass / MP 10.95 (UDOT 165175)', region:'Cottonwoods', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/165175', page:'https://cottonwoodcanyons.udot.utah.gov/road-information/', near:['snowbird','alta']},
    {name:'Little Cottonwood: Alta MP 12.16', sub:'SR-210 WB @ Alta / MP 12.16 (UDOT 165271)', region:'Cottonwoods', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/165271', page:'https://cottonwoodcanyons.udot.utah.gov/c4-traffic-camera/little-cottonwood-alta-mp-12-16/', near:['alta','snowbird']},
    {name:'Big Cottonwood: mouth', sub:'SR-190/SR-210 @ Big Cottonwood Canyon Rd / Fort Union Blvd (UDOT 164333)', region:'Cottonwoods', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/164333', page:'https://cottonwoodcanyons.udot.utah.gov/road-information/', near:['brighton','solitude']},
    {name:'Big Cottonwood: S-curves', sub:'SR-190 @ S-Curves / MP 6.38 (UDOT 164788)', region:'Cottonwoods', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/164788', page:'https://cottonwoodcanyons.udot.utah.gov/road-information/', near:['brighton','solitude']},
    {name:'Big Cottonwood: Silver Fork', sub:'SR-190 @ Silver Fork / MP 12.54 (UDOT 164818)', region:'Cottonwoods', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/164818', page:'https://cottonwoodcanyons.udot.utah.gov/road-information/', near:['solitude','brighton']},
    {name:'Big Cottonwood: Solitude', sub:'SR-190 @ Solitude / MP 14.53 (UDOT 165123)', region:'Cottonwoods', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/165123', page:'https://cottonwoodcanyons.udot.utah.gov/road-information/', near:['solitude','brighton']},
    {name:'Big Cottonwood: Brighton', sub:'SR-190 @ Brighton / MP 16.07 (UDOT 165825, RWIS animated GIF)', region:'Cottonwoods', provider:'UDOT', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/165825', page:'https://cottonwoodcanyons.udot.utah.gov/road-information/', near:['brighton','solitude']},
    {name:'Cottonwood Canyons road status (all cams)', region:'Cottonwoods', provider:'UDOT', kind:'link', page:'https://cottonwoodcanyons.udot.utah.gov/road-information/', near:['alta','snowbird','brighton','solitude']},
    // ---- Wasatch Back (UDOT) ----
    {name:'Parleys Summit eastbound', sub:'I-80 EB @ Parleys Summit / MP 139.24 (UDOT 165548)', region:'Wasatch Back', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/165548', page:'https://www.udottraffic.utah.gov/', near:['parkcity','deervalley']},
    {name:'Parleys Summit westbound', sub:'I-80 WB @ Parleys Summit / MP 138.9 (UDOT 166241)', region:'Wasatch Back', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/166241', page:'https://www.udottraffic.utah.gov/', near:['parkcity','deervalley']},
    {name:'Kimball Junction (I-80 / SR-224)', sub:'I-80 WB @ Kimball Jct / SR-224 / MP 144.22 (UDOT 166233)', region:'Wasatch Back', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/166233', page:'https://www.udottraffic.utah.gov/', near:['parkcity','deervalley']},
    {name:'SR-224 at Olympic Park (Bobsled Blvd)', sub:'SR-224 @ Bobsled Blvd / Cutter Ln (UDOT 166295)', region:'Wasatch Back', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/166295', page:'https://www.udottraffic.utah.gov/', near:['parkcity','deervalley']},
    // ---- Northern Utah (UDOT) ----
    {name:'Ogden Canyon (SR-39)', sub:'SR-39 / Ogden Canyon @ Milepost 13.24 (UDOT 164973)', region:'Northern Utah', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/164973', page:'https://www.udottraffic.utah.gov/', near:['snowbasin','powdermtn','nordic']},
    {name:'Ogden Canyon at SR-158 (Powder Mountain turn-off)', sub:'SR-39 / Ogden Canyon @ SR-158 / MP 13.8 (UDOT 165883, RWIS animated GIF)', region:'Northern Utah', provider:'UDOT', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/165883', page:'https://www.udottraffic.utah.gov/', near:['powdermtn','nordic','snowbasin']},
    {name:'Trappers Loop at Snowbasin Rd', sub:'SR-167 / Trappers Loop RWIS SB @ SR-226 / Snow Basin Rd / MP 6.92 (UDOT 164505, RWIS animated GIF)', region:'Northern Utah', provider:'UDOT', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/164505', page:'https://www.udottraffic.utah.gov/', near:['snowbasin']},
    {name:'Snowbasin Rd (SR-226)', sub:'SR-226 @ Snow Basin / MP 0.7 (UDOT 165868, RWIS animated GIF)', region:'Northern Utah', provider:'UDOT', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/165868', page:'https://www.snowbasin.com/the-mountain/web-cams/', near:['snowbasin']},
    {name:'Logan Canyon: Logan Summit (US-89)', sub:'US-89 RWIS SB @ Logan Summit / MP 489.68 (UDOT 164753)', region:'Northern Utah', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/164753', page:'https://www.udottraffic.utah.gov/', near:['beavermtn','cherrypeak']},
    // ---- Provo Canyon (UDOT) ----
    {name:'Provo Canyon at the Sundance turn-off', sub:'US-189 @ Alpine Scenic Hwy / SR-92 / MP 14.26 (UDOT 164497)', region:'Wasatch Front', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/164497', page:'https://www.udottraffic.utah.gov/', near:['sundance']},
    {name:'SR-92 above Sundance', sub:'Alpine Loop / SR-92 @ Milepost 14.54 (UDOT 165197)', region:'Wasatch Front', provider:'UDOT', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/165197', page:'https://www.udottraffic.utah.gov/', near:['sundance']},
    // ---- Southern Utah (UDOT) ----
    {name:'Brian Head (SR-143 MP 18)', sub:'SR-143 @ Brian Head / MP 18.19 (UDOT 164506, RWIS animated GIF)', region:'Southern Utah', provider:'UDOT', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/164506', page:'https://www.udottraffic.utah.gov/', near:['brianhead']},
    {name:'SR-143 below Brian Head', sub:'SR-143 @ Milepost 13.43 (UDOT 164428, RWIS animated GIF)', region:'Southern Utah', provider:'UDOT', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://www.udottraffic.utah.gov/map/Cctv/164428', page:'https://www.udottraffic.utah.gov/', near:['brianhead']},
    // ---- Wyoming ----
    {name:'I-80 Summit / Laramie', region:'Wyoming', provider:'WYDOT', kind:'link', page:'https://www.wyoroad.info/Highway/webcameras/all?route=I80Cameras', near:['snowyrange']},
  ],
  resorts: {
    abasin:[
      {name:'A-Basin: Summit', provider:'Arapahoe Basin', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://b15.hdrelay.com/camera/61f47337c621805ca7d0e6fb/snapshot', page:'https://www.arapahoebasin.com/mountain-cams/'},
      {name:'A-Basin: Black Mountain Lodge (mid-mountain)', provider:'Arapahoe Basin', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://img.hdrelay.com/frames/61f1bacffaf0bf0b5629ac62/default/last.jpg', page:'https://www.arapahoebasin.com/mountain-cams/'},
      {name:'A-Basin: snow stake', provider:'Arapahoe Basin', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://img.hdrelay.com/frames/929449a8-672b-46c4-8191-b1a6d0842a3f/default/last.jpg', page:'https://www.arapahoebasin.com/mountain-cams/'},
      {name:'A-Basin: Pali + Molly lifts (live video)', provider:'Arapahoe Basin', kind:'iframe', verified:true, checkedAt:'2026-10-13', url:'https://watch.hdrelay.io/player.html?cam=cam_arapahoe_basin_pali_cam_1790623627806&profile=p_muokmxflu1at&sig=c6e953ba2274e80ec94a1a93&exp=1822510424635&dom=', page:'https://www.arapahoebasin.com/mountain-cams/'},
    ],
    loveland:[
      {name:'Loveland: Ptarmigan Roost (summit)', provider:'Loveland', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cams.skiloveland.com/lsacams/ptarmroost/ptarmroost.jpg', page:'https://skiloveland.com/webcams/'},
      {name:"Loveland: top of Chet's Dream", provider:'Loveland', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cams.skiloveland.com/lsacams/chetstop/chetstop.jpg', page:'https://skiloveland.com/webcams/'},
      {name:'Loveland: Basin deck', provider:'Loveland', kind:'img', refresh:180, verified:true, checkedAt:'2026-10-13', url:'https://cams.skiloveland.com/lsacams/basindeck/basindeck.jpg', page:'https://skiloveland.com/webcams/'},
      {name:'Loveland: Valley deck', provider:'Loveland', kind:'img', refresh:180, verified:true, checkedAt:'2026-10-13', url:'https://cams.skiloveland.com/lsacams/valleydeck/valleydeck.jpg', page:'https://skiloveland.com/webcams/'},
    ],
    keystone:[
      {name:'Keystone: Dercum Mountain', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live9.brownrice.com/cam-images/keystonedercum.jpg', page:'https://www.keystoneresort.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Keystone: North Peak', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live9.brownrice.com/cam-images/keystonenorthpeak.jpg', page:'https://www.keystoneresort.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Keystone: Bergman Bowl', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live8p.brownrice.com/cam-images/keystonebergman.jpg', page:'https://www.keystoneresort.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Keystone: River Run base', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live9.brownrice.com/cam-images/keystoneriverrun.jpg', page:'https://www.keystoneresort.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
    ],
    breck:[
      {name:'Breckenridge: Peak 8 from Peak 9', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live9.brownrice.com/cam-images/breckenridge9.jpg', page:'https://www.breckenridge.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Breckenridge mountain cams (Peak 7, Peak 9, snow stake)', provider:'Vail Resorts', kind:'link', page:'https://www.breckenridge.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
    ],
    copper:[
      {name:'Copper: Excelerator', provider:'Copper Mountain', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://manage.hdrelay.com/snapshot/0a21617e-b513-4f3a-999a-4ba0896b9df4?size=800x450&f=300000', page:'https://www.coppercolorado.com/the-mountain/webcams/'},
      {name:'Copper: Super Bee', provider:'Copper Mountain', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://img.hdrelay.com/frames/671bcfb507697ecebbaffc13/default/last.jpg', page:'https://www.coppercolorado.com/the-mountain/webcams/'},
      {name:'Copper: Aerie', provider:'Copper Mountain', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://manage.hdrelay.com/snapshot/faba06d4-a3e9-4caf-93a8-8fc61e573958?size=800x450&f=300000', page:'https://www.coppercolorado.com/the-mountain/webcams/'},
      {name:'Copper: Center Village', provider:'Copper Mountain', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://img.hdrelay.com/frames/0d6c3cf7-c523-41cf-9e01-0019ed77f9a3/default/last.jpg', page:'https://www.coppercolorado.com/the-mountain/webcams/'},
    ],
    vail:[
      {name:'Vail: Sun Up Bowl overlook', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live9.brownrice.com/cam-images/vailch11.jpg', page:'https://www.vail.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Vail: Back Bowls', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live9.brownrice.com/cam-images/vailch21.jpg', page:'https://www.vail.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:"Vail: Eagle's Nest", provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live9.brownrice.com/cam-images/vaileaglesnest.jpg', page:'https://www.vail.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Vail: snow stake (summit)', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live9.brownrice.com/cam-images/vailsnowsummit.jpg', page:'https://www.vail.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
    ],
    beavercreek:[{name:'Beaver Creek mountain cams (streams offline pre-season)', provider:'Vail Resorts', kind:'link', page:'https://www.beavercreek.com/the-mountain/mountain-conditions/mountain-cams.aspx'}],
    winterpark:[
      {name:'Winter Park: base', provider:'Winter Park', kind:'youtube', id:'vyWAzJAWv4w', verified:true, checkedAt:'2026-10-13', page:'https://www.winterparkresort.com/the-mountain/mountain-cams'},
      {name:'Winter Park: snow stake', provider:'Winter Park', kind:'youtube', id:'yj-5Q1vBMaA', verified:true, checkedAt:'2026-10-13', page:'https://www.winterparkresort.com/the-mountain/mountain-cams'},
    ],
    eldora:[{name:'Eldora webcams', provider:'Eldora', kind:'link', page:'https://www.eldora.com/the-mountain/current-conditions/webcams/'}],
    steamboat:[
      {name:'Steamboat: Four Points (upper mountain)', provider:'Steamboat', kind:'youtube', id:'Zf21nwFUyUs', verified:true, checkedAt:'2026-10-13', page:'https://www.steamboat.com/the-mountain/live-cams'},
      {name:'Steamboat: Thunderhead Lodge', provider:'Steamboat', kind:'youtube', id:'nuCNVEHvrHQ', verified:true, checkedAt:'2026-10-13', page:'https://www.steamboat.com/the-mountain/live-cams'},
      {name:'Steamboat: Christie Peak Express & Wild Blue Gondola', provider:'Steamboat', kind:'youtube', id:'nfTQNv3jdSQ', verified:true, checkedAt:'2026-10-13', page:'https://www.steamboat.com/the-mountain/live-cams'},
      {name:'Steamboat: Steamboat Square (base)', provider:'Steamboat', kind:'youtube', id:'2UJDLWcSADk', verified:true, checkedAt:'2026-10-13', page:'https://www.steamboat.com/the-mountain/live-cams'},
    ],
    aspen:[
      {name:'Aspen Mountain: summit panorama (Roundshot)', provider:'Aspen Snowmass', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://backend.roundshot.com/cams/91/medium', page:'https://www.aspensnowmass.com/four-mountains/mountain-cams'},
      {name:'Aspen: Power of Four panorama (Roundshot)', provider:'Aspen Snowmass', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://backend.roundshot.com/cams/90/medium', page:'https://www.aspensnowmass.com/four-mountains/mountain-cams'},
    ],
    highlands:[
      {name:'Aspen Highlands: panorama (Roundshot)', provider:'Aspen Snowmass', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://backend.roundshot.com/cams/89/medium', page:'https://www.aspensnowmass.com/four-mountains/mountain-cams'},
    ],
    snowmass:[
      {name:'Snowmass: panorama (Roundshot)', provider:'Aspen Snowmass', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://backend.roundshot.com/cams/88/medium', page:'https://www.aspensnowmass.com/four-mountains/mountain-cams'},
      {name:"Snowmass: Sam's Knob panorama (Roundshot)", provider:'Aspen Snowmass', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://backend.roundshot.com/cams/d06c2257c923777ee36fee23722ea2c2/medium', page:'https://www.aspensnowmass.com/four-mountains/mountain-cams'},
    ],
    crestedbutte:[
      {name:'Crested Butte: Pow Cam', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live9.brownrice.com/cam-images/crestedbuttepow.jpg', page:'https://www.skicb.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Crested Butte: Paradise warming house', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live9.brownrice.com/cam-images/crestedbuttewarm.jpg', page:'https://www.skicb.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Crested Butte: base', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live6.brownrice.com/cam-images/crestedbuttebase.jpg', page:'https://www.skicb.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Crested Butte: snow stake', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live9.brownrice.com/cam-images/crestedbuttesnowstake.jpg', page:'https://www.skicb.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
    ],
    monarch:[
      {name:'Monarch: Powder Cam', provider:'Monarch', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://webcam.io/webcams/z7Arw9/latest.jpg', page:'https://skimonarch.com/conditions/cams/'},
      {name:'Monarch: Storm Cam', provider:'Monarch', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://webcam.io/webcams/9RmqeM/latest.jpg', page:'https://skimonarch.com/conditions/cams/'},
      {name:'Monarch: Mountain Cam', provider:'Monarch', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://webcam.io/webcams/MwKk2M/latest.jpg', page:'https://skimonarch.com/conditions/cams/'},
    ],
    wolfcreek:[{name:'Wolf Creek webcams (streams offline pre-season)', provider:'Wolf Creek', kind:'link', page:'https://wolfcreekski.com/webcams/'}],
    wolfcreekpass:[{name:'Wolf Creek webcams (streams offline pre-season)', provider:'Wolf Creek', kind:'link', page:'https://wolfcreekski.com/webcams/'}],
    purgatory:[
      {name:'Purgatory: plaza', provider:'Purgatory', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live5.brownrice.com/cam-images/purgatoryplaza.jpg', page:'https://www.purgatory.ski/mountain/mountain-webcams/'},
      {name:'Purgatory mountain webcams', provider:'Purgatory', kind:'link', page:'https://www.purgatory.ski/mountain/mountain-webcams/'},
    ],
    telluride:[
      {name:'Telluride: See Forever', provider:'Telluride', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://g1.ipcamlive.com/player/snapshot.php?alias=jointpoint', page:'https://tellurideskiresort.com/webcams/'},
      {name:'Telluride: Hoot Brown terrain park', provider:'Telluride', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://g1.ipcamlive.com/player/snapshot.php?alias=hootbrown', page:'https://tellurideskiresort.com/webcams/'},
      {name:'Telluride: Village / plaza', provider:'Telluride', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://g1.ipcamlive.com/player/snapshot.php?alias=plazacam', page:'https://tellurideskiresort.com/webcams/'},
    ],
    taos:[
      {name:'Taos: Kachina Peak', provider:'Taos Ski Valley', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live4.brownrice.com/cam-images/tsvlonestar.jpg', page:'https://www.skitaos.com/weather'},
      {name:'Taos: Highline / Kachina ridge', provider:'Taos Ski Valley', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live4.brownrice.com/cam-images/tsvridge.jpg', page:'https://www.skitaos.com/weather'},
      {name:'Taos: Kachina Basin', provider:'Taos Ski Valley', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live4.brownrice.com/cam-images/tsvbav.jpg', page:'https://www.skitaos.com/weather'},
      {name:'Taos: base', provider:'Taos Ski Valley', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live4.brownrice.com/cam-images/tsv.jpg', page:'https://www.skitaos.com/weather'},
    ],
    alta:[
      {name:'Alta: Mount Baldy', provider:'Alta', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://app.prismcam.com/public/helpers/realtime_preview.php?c=88&s=720', page:'https://www.alta.com/weather'},
      {name:'Alta: Sugarloaf Peak', provider:'Alta', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://alta-webcams.sfo3.cdn.digitaloceanspaces.com/sugar_peak.jpg', page:'https://www.alta.com/weather'},
      {name:'Alta: High Rustler', provider:'Alta', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://alta-webcams.sfo3.cdn.digitaloceanspaces.com/Highrustler.jpg', page:'https://www.alta.com/weather'},
      {name:'Alta: Collins snow stake', provider:'Alta', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://alta-webcams.sfo3.cdn.digitaloceanspaces.com/Collins_Snow_Stake.jpg', page:'https://www.alta.com/weather'},
    ],
    snowbird:[
      {name:'Snowbird: Hidden Peak', provider:'Snowbird', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://backend.roundshot.com/cams/44cfff4ff2a218a1178dbb105d95846a/medium', page:'https://www.snowbird.com/the-mountain/webcams/view-all-webcams/'},
      {name:'Snowbird: Little Cloud', provider:'Snowbird', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://b15.hdrelay.com/camera/db2a69c5-66e9-4c48-a713-919eaf191fc1/snapshot', page:'https://www.snowbird.com/the-mountain/webcams/view-all-webcams/'},
      {name:'Snowbird: Mineral Basin', provider:'Snowbird', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://manage.hdrelay.com/snapshot/5780754f-8da1-4223-ab8a-6755d84cbc10', page:'https://www.snowbird.com/the-mountain/webcams/view-all-webcams/'},
      {name:'Snowbird: Peruvian Gulch', provider:'Snowbird', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://b15.hdrelay.com/camera/544432bd-3910-4888-aa9f-14b6f51a7eb5/snapshot', page:'https://www.snowbird.com/the-mountain/webcams/view-all-webcams/'},
    ],
    brighton:[
      {name:'Brighton: top of Crest', provider:'Brighton', kind:'youtube', id:'Zv8HYwaXjBg', verified:true, checkedAt:'2026-10-13', page:'https://www.brightonresort.com/conditions'},
      {name:'Brighton: Milly Express', provider:'Brighton', kind:'youtube', id:'N-d3MuOagLg', verified:true, checkedAt:'2026-10-13', page:'https://www.brightonresort.com/conditions'},
      {name:'Brighton: Explorer lift', provider:'Brighton', kind:'youtube', id:'vMwQRjlfqtA', verified:true, checkedAt:'2026-10-13', page:'https://www.brightonresort.com/conditions'},
      {name:'Brighton: Molly Greens (base)', provider:'Brighton', kind:'youtube', id:'uZ24vqOWEkQ', verified:true, checkedAt:'2026-10-13', page:'https://www.brightonresort.com/conditions'},
    ],
    solitude:[
      {name:'Solitude: Sunshine Bowl', provider:'Solitude', kind:'youtube', id:'Lnznapxh2xM', verified:true, checkedAt:'2026-10-13', page:'https://www.solitudemountain.com/mountain-and-village/webcams'},
      {name:'Solitude webcams (Summit Express, Honeycomb and snow stake streams were offline when checked)', provider:'Solitude', kind:'link', page:'https://www.solitudemountain.com/mountain-and-village/webcams'},
    ],
    parkcity:[
      {name:'Park City: top of Crescent', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live6.brownrice.com/cam-images/parkcitytopcrescent.jpg', page:'https://www.parkcitymountain.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Park City: Crescent Ridge', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live6.brownrice.com/cam-images/parkcitycrescentridge.jpg', page:'https://www.parkcitymountain.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Park City: Lookout Cabin', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live4.brownrice.com/cam-images/parkcitylookoutcabin.jpg', page:'https://www.parkcitymountain.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
      {name:'Park City: Canyons Village ski beach', provider:'Vail Resorts', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://live4.brownrice.com/cam-images/parkcitycnskibeach.jpg', page:'https://www.parkcitymountain.com/the-mountain/mountain-conditions/mountain-cams.aspx'},
    ],
    deervalley:[
      {name:'Deer Valley: Empire Express', provider:'Deer Valley', kind:'youtube', id:'r8qiPv9XCOM', verified:true, checkedAt:'2026-10-13', page:'https://www.deervalley.com/explore-the-mountain/webcams'},
      {name:'Deer Valley: Revelator Express', provider:'Deer Valley', kind:'youtube', id:'XZjubaPbamE', verified:true, checkedAt:'2026-10-13', page:'https://www.deervalley.com/explore-the-mountain/webcams'},
      {name:'Deer Valley: Sterling Express', provider:'Deer Valley', kind:'youtube', id:'iNdfTLilLlU', verified:true, checkedAt:'2026-10-13', page:'https://www.deervalley.com/explore-the-mountain/webcams'},
      {name:'Deer Valley: Snow Park Lodge (base)', provider:'Deer Valley', kind:'youtube', id:'QozKoFs-hL0', verified:true, checkedAt:'2026-10-13', page:'https://www.deervalley.com/explore-the-mountain/webcams'},
    ],
    snowbasin:[{name:'Snowbasin web cams (resort page embeds the UDOT road cams listed above)', provider:'Snowbasin', kind:'link', page:'https://www.snowbasin.com/the-mountain/web-cams/'}],
    powdermtn:[{name:'Powder Mountain webcams', provider:'Powder Mountain', kind:'link', page:'https://www.living.powdermountain.com/resort/the-mountain/conditions/webcams'}],
    sundance:[
      {name:'Sundance: Bearclaw summit', provider:'Sundance', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://app.prismcam.com/public/helpers/realtime_preview.php?c=74&s=720', page:'https://www.sundanceresort.com/webcams/'},
      {name:'Sundance: Mandan summit', provider:'Sundance', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://watch.hdrelay.io/api/public/poster/cam_sundance_mountain___mandan_summit_1781718266360', page:'https://www.sundanceresort.com/webcams/'},
      {name:'Sundance: base', provider:'Sundance', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://app.prismcam.com/public/helpers/realtime_preview.php?c=75&s=720', page:'https://www.sundanceresort.com/webcams/'},
    ],
    brianhead:[
      {name:'Brian Head: Giant Steps summit', provider:'Brian Head', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://b15.hdrelay.com/camera/1fbebe18-f211-4fec-a185-0024cbc0838c/snapshot', page:'https://www.brianhead.com/weather-conditions-webcams/'},
      {name:'Brian Head: Giant Steps base', provider:'Brian Head', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://b15.hdrelay.com/camera/bcca39a1-43c0-477f-9389-5b039c797c5d/snapshot', page:'https://www.brianhead.com/weather-conditions-webcams/'},
      {name:'Brian Head: snow stake', provider:'Brian Head', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://b16.hdrelay.com/camera/66e069aee2c05fceb65b6688/snapshot', page:'https://www.brianhead.com/weather-conditions-webcams/'},
    ],
    jackson:[
      {name:'Jackson Hole: Rendezvous summit panorama (Roundshot)', provider:'Jackson Hole', kind:'img', refresh:120, verified:true, checkedAt:'2026-10-13', url:'https://backend.roundshot.com/cams/12a4b2c24cd515e0a115d4a0f59ef7f8/medium', page:'https://www.jacksonhole.com/live-mountain-cams'},
      {name:'Jackson Hole: Cody Bowl', provider:'Jackson Hole', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cams.jacksonhole.com/webcam/codybowl.jpg', page:'https://www.jacksonhole.com/live-mountain-cams'},
      {name:'Jackson Hole: Teewinot', provider:'Jackson Hole', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cams.jacksonhole.com/webcam/teewinot.jpg', page:'https://www.jacksonhole.com/live-mountain-cams'},
      {name:'Jackson Hole: Teton Village commons', provider:'Jackson Hole', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://cams.jacksonhole.com/webcam/tetonvillagecommons.jpg', page:'https://www.jacksonhole.com/live-mountain-cams'},
    ],
    targhee:[
      {name:'Grand Targhee: Dreamcatcher', provider:'Grand Targhee (SeeJH)', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://copyrighted.seejh.com/gtrdream/gtrdream.jpg', page:'https://www.grandtarghee.com/the-mountain/cams-conditions/webcams'},
      {name:'Grand Targhee: Colter', provider:'Grand Targhee (SeeJH)', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://copyrighted.seejh.com/gtrcolter/gtrcolter.jpg', page:'https://www.grandtarghee.com/the-mountain/cams-conditions/webcams'},
      {name:'Grand Targhee: Stick of Truth snow stake', provider:'Grand Targhee (SeeJH)', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://copyrighted.seejh.com/gtrsnowstick/gtrsnowstick.jpg', page:'https://www.grandtarghee.com/the-mountain/cams-conditions/webcams'},
      {name:'Grand Targhee: plaza', provider:'Grand Targhee (SeeJH)', kind:'img', refresh:60, verified:true, checkedAt:'2026-10-13', url:'https://copyrighted.seejh.com/gtrplaza/gtrplaza.jpg', page:'https://www.grandtarghee.com/the-mountain/cams-conditions/webcams'},
    ],
    snowyrange:[{name:'Laramie area webcams', provider:'Visit Laramie', kind:'link', page:'https://www.visitlaramie.org/plan-your-visit/webcams/'}],
  }
};
