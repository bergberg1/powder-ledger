# Verified webcam feeds

Every feed shipped in `src/00b_cams.js` was fetched from this build environment on 2026-10-13 (about 01:40–02:05 UTC, i.e. 7:40–8:05 pm MDT, so most frames are night shots). Tests per still image: HTTP status, Content-Type, body size, a second fetch about a minute later (md5 compared) and a fetch with `Referer: https://bergberg1.github.io/` to detect hotlink blocking. Tests per iframe/YouTube embed: HTTP status of the embed URL, `X-Frame-Options` and any `frame-ancestors` CSP directive, and for YouTube the `isLive` flag of the watch page. The headless check of the built page then loaded all 112 `.cam img` elements (naturalWidth > 0) with 0 fallbacks other than the 14 deliberate link-only cards.

Legend: **changed** = the two fetches a minute apart returned different bytes (live still). **same** = identical bytes a minute apart (slow-updating cam; verified as a real current photo). Referer 200 = the host serves the image with a third-party Referer, so no `noReferrer` flag is needed anywhere.

## Shipped feeds (all passed)

| # | kind | name | URL | status | content-type | size | 2nd fetch | referer | frame headers |
|---|---|---|---|---|---|---|---|---|---|
| 1 | img | Eisenhower Tunnel west portal | `https://cocam.carsprogram.org/Snapshots/070E21345CAM1RHS-T.flv.png` | 200 | image/jpeg | 132 KB | same | 200 | - |
| 2 | img | Eisenhower Tunnel east portal | `https://cocam.carsprogram.org/Snapshots/070E21560CAM1GP2.flv.png` | 200 | image/jpeg | 133 KB | changed | 200 | - |
| 3 | img | Loveland Pass (US-6) | `https://cocam.carsprogram.org/Snapshots/006W22625CAM2RHS.flv.png` | 200 | image/jpeg | 19 KB | same | 200 | - |
| 4 | img | Vail Pass summit | `https://cocam.carsprogram.org/Snapshots/070E19010CAM1RP1.flv.png` | 200 | image/jpeg | 53 KB | changed | 200 | - |
| 5 | img | Vail Pass west side | `https://cocam.carsprogram.org/Snapshots/070W18945CAM1RHS.flv.png` | 200 | image/jpeg | 33 KB | changed | 200 | - |
| 6 | img | Copper Mountain / CO-91 | `https://cocam.carsprogram.org/Snapshots/070E19525CAM2RHS.flv.png` | 200 | image/jpeg | 10 KB | changed | 200 | - |
| 7 | img | Silverthorne | `https://cocam.carsprogram.org/Snapshots/070W20575CAM1RHS.flv.png` | 200 | image/jpeg | 120 KB | changed | 200 | - |
| 8 | img | Georgetown | `https://cocam.carsprogram.org/Snapshots/070W22800CAM1RHS.flv.png` | 200 | image/jpeg | 111 KB | changed | 200 | - |
| 9 | img | Floyd Hill | `https://cocam.carsprogram.org/Snapshots/070W24325CAM1RHS.flv.png` | 200 | image/jpeg | 104 KB | changed | 200 | - |
| 10 | img | Idaho Springs / Veterans Memorial Tunnels | `https://cocam.carsprogram.org/Snapshots/070E24200CAM1RP1.flv.png` | 200 | image/jpeg | 37 KB | same | 200 | - |
| 11 | img | Vail (Vail Rd) | `https://cocam.carsprogram.org/Snapshots/070W17585CAM1RHS.flv.png` | 200 | image/jpeg | 81 KB | changed | 200 | - |
| 12 | img | Glenwood Canyon: No Name | `https://cocam.carsprogram.org/Snapshots/070W11765CAM1RHS.flv.png` | 200 | image/jpeg | 116 KB | changed | 200 | - |
| 13 | img | Glenwood Canyon: Grizzly Creek | `https://cocam.carsprogram.org/Snapshots/070W12085CAM1RHS.flv.png` | 200 | image/jpeg | 42 KB | same | 200 | - |
| 14 | img | Berthoud Falls (US-40 below the pass) | `https://cocam.carsprogram.org/Cellular/040W24885CAM1RHS-W.jpg` | 200 | image/jpeg | 9 KB | changed | 200 | - |
| 15 | img | Winter Park / Mary Jane Rd (US-40) | `https://cocam.carsprogram.org/Cellular/040E23460CAM1GP1-E.jpg` | 200 | image/jpeg | 6 KB | changed | 200 | - |
| 16 | img | US-285 at Grant (below Kenosha Pass) | `https://cocam.carsprogram.org/Cellular/285N20785CAM1RHS-N.jpg` | 200 | image/jpeg | 13 KB | changed | 200 | - |
| 17 | img | Monarch Pass (US-50) | `https://cocam.carsprogram.org/Cellular/050W19935CAM1RHS-W.jpg` | 200 | image/jpeg | 8 KB | changed | 200 | - |
| 18 | img | Fremont Pass (CO-91) | `https://cocam.carsprogram.org/Cellular/091S01110CAM1RHS-S.jpg` | 200 | image/jpeg | 14 KB | changed | 200 | - |
| 19 | img | Independence Pass (CO-82, closed in winter) | `https://cocam.carsprogram.org/Cellular/082W06215CAM1RHS-RoadSurface.jpg` | 200 | image/jpeg | 7 KB | changed | 200 | - |
| 20 | img | Wolf Creek Pass, east of the ski area | `https://cocam.carsprogram.org/Cellular/160E16820CAM1RHS-W.jpg` | 200 | image/jpeg | 12 KB | changed | 200 | - |
| 21 | img | Wolf Creek Pass, west side | `https://cocam.carsprogram.org/Snapshots/160E16515CAM2RHS.flv.png` | 200 | image/jpeg | 45 KB | same | 200 | - |
| 22 | img | Red Mountain Pass (US-550) | `https://cocam.carsprogram.org/Cellular/550N08795CAM1RHS-N.jpg` | 200 | image/jpeg | 18 KB | same | 200 | - |
| 23 | img | Silverton (US-550) | `https://cocam.carsprogram.org/Cellular/550N07065CAM1RHS-N.jpg` | 200 | image/jpeg | 14 KB | changed | 200 | - |
| 24 | img | Little Cottonwood: mouth | `https://www.udottraffic.utah.gov/map/Cctv/164559` | 200 | image/jpeg | 80 KB | changed | 200 | - |
| 25 | img | Little Cottonwood: Seven Turns | `https://www.udottraffic.utah.gov/map/Cctv/166033` | 200 | image/jpeg | 126 KB | changed | 200 | - |
| 26 | img | Little Cottonwood: White Pine | `https://www.udottraffic.utah.gov/map/Cctv/165998` | 200 | image/jpeg | 121 KB | changed | 200 | - |
| 27 | img | Little Cottonwood: Alta Bypass (Snowbird) | `https://www.udottraffic.utah.gov/map/Cctv/165175` | 200 | image/jpeg | 109 KB | changed | 200 | - |
| 28 | img | Little Cottonwood: Alta MP 12.16 | `https://www.udottraffic.utah.gov/map/Cctv/165271` | 200 | image/jpeg | 91 KB | changed | 200 | - |
| 29 | img | Big Cottonwood: mouth | `https://www.udottraffic.utah.gov/map/Cctv/164333` | 200 | image/jpeg | 104 KB | changed | 200 | - |
| 30 | img | Big Cottonwood: S-curves | `https://www.udottraffic.utah.gov/map/Cctv/164788` | 200 | image/jpeg | 156 KB | changed | 200 | - |
| 31 | img | Big Cottonwood: Silver Fork | `https://www.udottraffic.utah.gov/map/Cctv/164818` | 200 | image/jpeg | 125 KB | changed | 200 | - |
| 32 | img | Big Cottonwood: Solitude | `https://www.udottraffic.utah.gov/map/Cctv/165123` | 200 | image/jpeg | 110 KB | changed | 200 | - |
| 33 | img | Big Cottonwood: Brighton | `https://www.udottraffic.utah.gov/map/Cctv/165825` | 200 | image/gif | 455 KB | same | 200 | - |
| 34 | img | Parleys Summit eastbound | `https://www.udottraffic.utah.gov/map/Cctv/165548` | 200 | image/jpeg | 134 KB | changed | 200 | - |
| 35 | img | Parleys Summit westbound | `https://www.udottraffic.utah.gov/map/Cctv/166241` | 200 | image/jpeg | 96 KB | changed | 200 | - |
| 36 | img | Kimball Junction (I-80 / SR-224) | `https://www.udottraffic.utah.gov/map/Cctv/166233` | 200 | image/jpeg | 95 KB | changed | 200 | - |
| 37 | img | SR-224 at Olympic Park (Bobsled Blvd) | `https://www.udottraffic.utah.gov/map/Cctv/166295` | 200 | image/jpeg | 87 KB | changed | 200 | - |
| 38 | img | Ogden Canyon (SR-39) | `https://www.udottraffic.utah.gov/map/Cctv/164973` | 200 | image/jpeg | 114 KB | changed | 200 | - |
| 39 | img | Ogden Canyon at SR-158 (Powder Mountain turn-off) | `https://www.udottraffic.utah.gov/map/Cctv/165883` | 200 | image/gif | 589 KB | same | 200 | - |
| 40 | img | Trappers Loop at Snowbasin Rd | `https://www.udottraffic.utah.gov/map/Cctv/164505` | 200 | image/gif | 514 KB | same | 200 | - |
| 41 | img | Snowbasin Rd (SR-226) | `https://www.udottraffic.utah.gov/map/Cctv/165868` | 200 | image/gif | 743 KB | same | 200 | - |
| 42 | img | Logan Canyon: Logan Summit (US-89) | `https://www.udottraffic.utah.gov/map/Cctv/164753` | 200 | image/jpeg | 44 KB | changed | 200 | - |
| 43 | img | Provo Canyon at the Sundance turn-off | `https://www.udottraffic.utah.gov/map/Cctv/164497` | 200 | image/jpeg | 116 KB | changed | 200 | - |
| 44 | img | SR-92 above Sundance | `https://www.udottraffic.utah.gov/map/Cctv/165197` | 200 | image/jpeg | 85 KB | changed | 200 | - |
| 45 | img | Brian Head (SR-143 MP 18) | `https://www.udottraffic.utah.gov/map/Cctv/164506` | 200 | image/gif | 519 KB | same | 200 | - |
| 46 | img | SR-143 below Brian Head | `https://www.udottraffic.utah.gov/map/Cctv/164428` | 200 | image/gif | 624 KB | same | 200 | - |
| 47 | img | A-Basin: Summit | `https://b15.hdrelay.com/camera/61f47337c621805ca7d0e6fb/snapshot` | 200 | image/jpeg | 79 KB | changed | 200 | - |
| 48 | img | A-Basin: Black Mountain Lodge (mid-mountain) | `https://img.hdrelay.com/frames/61f1bacffaf0bf0b5629ac62/default/last.jpg` | 200 | image/jpeg | 348 KB | changed | 200 | - |
| 49 | img | A-Basin: snow stake | `https://img.hdrelay.com/frames/929449a8-672b-46c4-8191-b1a6d0842a3f/default/last.jpg` | 200 | image/jpeg | 305 KB | changed | 200 | - |
| 50 | iframe | A-Basin: Pali + Molly lifts (live video) | `https://watch.hdrelay.io/player.html?cam=cam_arapahoe_basin_pali_cam_1790623627806&profile=p_muokmxflu1at&sig=c6e953ba2274e80ec94a1a93&exp=1822510424635&dom=` | 200 | text/html | - | - | 200 | none |
| 51 | img | Loveland: Ptarmigan Roost (summit) | `https://cams.skiloveland.com/lsacams/ptarmroost/ptarmroost.jpg` | 200 | image/jpeg | 73 KB | changed | 200 | - |
| 52 | img | Loveland: top of Chet's Dream | `https://cams.skiloveland.com/lsacams/chetstop/chetstop.jpg` | 200 | image/jpeg | 81 KB | changed | 200 | - |
| 53 | img | Loveland: Basin deck | `https://cams.skiloveland.com/lsacams/basindeck/basindeck.jpg` | 200 | image/jpeg | 913 KB | same | 200 | - |
| 54 | img | Loveland: Valley deck | `https://cams.skiloveland.com/lsacams/valleydeck/valleydeck.jpg` | 200 | image/jpeg | 896 KB | changed | 200 | - |
| 55 | img | Keystone: Dercum Mountain | `https://live9.brownrice.com/cam-images/keystonedercum.jpg` | 200 | image/jpeg | 61 KB | changed | 200 | - |
| 56 | img | Keystone: North Peak | `https://live9.brownrice.com/cam-images/keystonenorthpeak.jpg` | 200 | image/jpeg | 75 KB | changed | 200 | - |
| 57 | img | Keystone: Bergman Bowl | `https://live8p.brownrice.com/cam-images/keystonebergman.jpg` | 200 | image/jpeg | 51 KB | changed | 200 | - |
| 58 | img | Keystone: River Run base | `https://live9.brownrice.com/cam-images/keystoneriverrun.jpg` | 200 | image/jpeg | 36 KB | changed | 200 | - |
| 59 | img | Breckenridge: Peak 8 from Peak 9 | `https://live9.brownrice.com/cam-images/breckenridge9.jpg` | 200 | image/jpeg | 44 KB | changed | 200 | - |
| 60 | img | Copper: Excelerator | `https://manage.hdrelay.com/snapshot/0a21617e-b513-4f3a-999a-4ba0896b9df4?size=800x450&f=300000` | 200 | image/jpeg | 173 KB | changed | 200 | - |
| 61 | img | Copper: Super Bee | `https://img.hdrelay.com/frames/671bcfb507697ecebbaffc13/default/last.jpg` | 200 | image/jpeg | 489 KB | changed | 200 | - |
| 62 | img | Copper: Aerie | `https://manage.hdrelay.com/snapshot/faba06d4-a3e9-4caf-93a8-8fc61e573958?size=800x450&f=300000` | 200 | image/jpeg | 84 KB | changed | 200 | - |
| 63 | img | Copper: Center Village | `https://img.hdrelay.com/frames/0d6c3cf7-c523-41cf-9e01-0019ed77f9a3/default/last.jpg` | 200 | image/jpeg | 231 KB | changed | 200 | - |
| 64 | img | Vail: Sun Up Bowl overlook | `https://live9.brownrice.com/cam-images/vailch11.jpg` | 200 | image/jpeg | 280 KB | changed | 200 | - |
| 65 | img | Vail: Back Bowls | `https://live9.brownrice.com/cam-images/vailch21.jpg` | 200 | image/jpeg | 88 KB | changed | 200 | - |
| 66 | img | Vail: Eagle's Nest | `https://live9.brownrice.com/cam-images/vaileaglesnest.jpg` | 200 | image/jpeg | 246 KB | changed | 200 | - |
| 67 | img | Vail: snow stake (summit) | `https://live9.brownrice.com/cam-images/vailsnowsummit.jpg` | 200 | image/jpeg | 38 KB | changed | 200 | - |
| 68 | youtube | Winter Park: base | `https://www.youtube.com/embed/vyWAzJAWv4w` | 200 | text/html | - | - | 200 | none |
| 69 | youtube | Winter Park: snow stake | `https://www.youtube.com/embed/yj-5Q1vBMaA` | 200 | text/html | - | - | 200 | none |
| 70 | youtube | Steamboat: Four Points (upper mountain) | `https://www.youtube.com/embed/Zf21nwFUyUs` | 200 | text/html | - | - | 200 | none |
| 71 | youtube | Steamboat: Thunderhead Lodge | `https://www.youtube.com/embed/nuCNVEHvrHQ` | 200 | text/html | - | - | 200 | none |
| 72 | youtube | Steamboat: Christie Peak Express & Wild Blue Gondola | `https://www.youtube.com/embed/nfTQNv3jdSQ` | 200 | text/html | - | - | 200 | none |
| 73 | youtube | Steamboat: Steamboat Square (base) | `https://www.youtube.com/embed/2UJDLWcSADk` | 200 | text/html | - | - | 200 | none |
| 74 | img | Aspen Mountain: summit panorama (Roundshot) | `https://backend.roundshot.com/cams/91/medium` | 200 | image/jpeg | 51 KB | same | 200 | - |
| 75 | img | Aspen: Power of Four panorama (Roundshot) | `https://backend.roundshot.com/cams/90/medium` | 200 | image/jpeg | 82 KB | same | 200 | - |
| 76 | img | Aspen Highlands: panorama (Roundshot) | `https://backend.roundshot.com/cams/89/medium` | 200 | image/jpeg | 143 KB | same | 000 | - |
| 77 | img | Snowmass: panorama (Roundshot) | `https://backend.roundshot.com/cams/88/medium` | 200 | image/jpeg | 133 KB | changed | 200 | - |
| 78 | img | Snowmass: Sam's Knob panorama (Roundshot) | `https://backend.roundshot.com/cams/d06c2257c923777ee36fee23722ea2c2/medium` | 200 | image/jpeg | 289 KB | same | 200 | - |
| 79 | img | Crested Butte: Pow Cam | `https://live9.brownrice.com/cam-images/crestedbuttepow.jpg` | 200 | image/jpeg | 210 KB | same | 200 | - |
| 80 | img | Crested Butte: Paradise warming house | `https://live9.brownrice.com/cam-images/crestedbuttewarm.jpg` | 200 | image/jpeg | 28 KB | changed | 200 | - |
| 81 | img | Crested Butte: base | `https://live6.brownrice.com/cam-images/crestedbuttebase.jpg` | 200 | image/jpeg | 64 KB | changed | 200 | - |
| 82 | img | Crested Butte: snow stake | `https://live9.brownrice.com/cam-images/crestedbuttesnowstake.jpg` | 200 | image/jpeg | 175 KB | same | 200 | - |
| 83 | img | Monarch: Powder Cam | `https://webcam.io/webcams/z7Arw9/latest.jpg` | 200 | image/jpeg | 27 KB | changed | 200 | - |
| 84 | img | Monarch: Storm Cam | `https://webcam.io/webcams/9RmqeM/latest.jpg` | 200 | image/jpeg | 36 KB | same | 200 | - |
| 85 | img | Monarch: Mountain Cam | `https://webcam.io/webcams/MwKk2M/latest.jpg` | 200 | image/jpeg | 30 KB | changed | 200 | - |
| 86 | img | Purgatory: plaza | `https://live5.brownrice.com/cam-images/purgatoryplaza.jpg` | 200 | image/jpeg | 61 KB | changed | 200 | - |
| 87 | img | Telluride: See Forever | `https://g1.ipcamlive.com/player/snapshot.php?alias=jointpoint` | 200 | image/jpeg | 37 KB | changed | 200 | - |
| 88 | img | Telluride: Hoot Brown terrain park | `https://g1.ipcamlive.com/player/snapshot.php?alias=hootbrown` | 200 | image/jpeg | 34 KB | changed | 200 | - |
| 89 | img | Telluride: Village / plaza | `https://g1.ipcamlive.com/player/snapshot.php?alias=plazacam` | 200 | image/jpeg | 36 KB | changed | 200 | - |
| 90 | img | Taos: Kachina Peak | `https://live4.brownrice.com/cam-images/tsvlonestar.jpg` | 200 | image/jpeg | 286 KB | changed | 200 | - |
| 91 | img | Taos: Highline / Kachina ridge | `https://live4.brownrice.com/cam-images/tsvridge.jpg` | 200 | image/jpeg | 28 KB | changed | 200 | - |
| 92 | img | Taos: Kachina Basin | `https://live4.brownrice.com/cam-images/tsvbav.jpg` | 200 | image/jpeg | 148 KB | same | 200 | - |
| 93 | img | Taos: base | `https://live4.brownrice.com/cam-images/tsv.jpg` | 200 | image/jpeg | 65 KB | changed | 200 | - |
| 94 | img | Alta: Mount Baldy | `https://app.prismcam.com/public/helpers/realtime_preview.php?c=88&s=720` | 200 | image/jpeg | 120 KB | same | 200 | - |
| 95 | img | Alta: Sugarloaf Peak | `https://alta-webcams.sfo3.cdn.digitaloceanspaces.com/sugar_peak.jpg` | 200 | image/jpeg | 91 KB | same | 200 | - |
| 96 | img | Alta: High Rustler | `https://alta-webcams.sfo3.cdn.digitaloceanspaces.com/Highrustler.jpg` | 200 | image/jpeg | 104 KB | same | 200 | - |
| 97 | img | Alta: Collins snow stake | `https://alta-webcams.sfo3.cdn.digitaloceanspaces.com/Collins_Snow_Stake.jpg` | 200 | image/jpeg | 454 KB | same | 200 | - |
| 98 | img | Snowbird: Hidden Peak | `https://backend.roundshot.com/cams/44cfff4ff2a218a1178dbb105d95846a/medium` | 200 | image/jpeg | 30 KB | same | 200 | - |
| 99 | img | Snowbird: Little Cloud | `https://b15.hdrelay.com/camera/db2a69c5-66e9-4c48-a713-919eaf191fc1/snapshot` | 200 | image/jpeg | 53 KB | changed | 200 | - |
| 100 | img | Snowbird: Mineral Basin | `https://manage.hdrelay.com/snapshot/5780754f-8da1-4223-ab8a-6755d84cbc10` | 200 | image/jpeg | 101 KB | changed | 200 | - |
| 101 | img | Snowbird: Peruvian Gulch | `https://b15.hdrelay.com/camera/544432bd-3910-4888-aa9f-14b6f51a7eb5/snapshot` | 200 | image/jpeg | 106 KB | changed | 200 | - |
| 102 | youtube | Brighton: top of Crest | `https://www.youtube.com/embed/Zv8HYwaXjBg` | 200 | text/html | - | - | 200 | none |
| 103 | youtube | Brighton: Milly Express | `https://www.youtube.com/embed/N-d3MuOagLg` | 200 | text/html | - | - | 200 | none |
| 104 | youtube | Brighton: Explorer lift | `https://www.youtube.com/embed/vMwQRjlfqtA` | 200 | text/html | - | - | 200 | none |
| 105 | youtube | Brighton: Molly Greens (base) | `https://www.youtube.com/embed/uZ24vqOWEkQ` | 200 | text/html | - | - | 200 | none |
| 106 | youtube | Solitude: Sunshine Bowl | `https://www.youtube.com/embed/Lnznapxh2xM` | 200 | text/html | - | - | 200 | none |
| 107 | img | Park City: top of Crescent | `https://live6.brownrice.com/cam-images/parkcitytopcrescent.jpg` | 200 | image/jpeg | 30 KB | changed | 200 | - |
| 108 | img | Park City: Crescent Ridge | `https://live6.brownrice.com/cam-images/parkcitycrescentridge.jpg` | 200 | image/jpeg | 59 KB | changed | 200 | - |
| 109 | img | Park City: Lookout Cabin | `https://live4.brownrice.com/cam-images/parkcitylookoutcabin.jpg` | 200 | image/jpeg | 28 KB | same | 200 | - |
| 110 | img | Park City: Canyons Village ski beach | `https://live4.brownrice.com/cam-images/parkcitycnskibeach.jpg` | 200 | image/jpeg | 183 KB | same | 200 | - |
| 111 | youtube | Deer Valley: Empire Express | `https://www.youtube.com/embed/r8qiPv9XCOM` | 200 | text/html | - | - | 200 | none |
| 112 | youtube | Deer Valley: Revelator Express | `https://www.youtube.com/embed/XZjubaPbamE` | 200 | text/html | - | - | 200 | none |
| 113 | youtube | Deer Valley: Sterling Express | `https://www.youtube.com/embed/iNdfTLilLlU` | 200 | text/html | - | - | 200 | none |
| 114 | youtube | Deer Valley: Snow Park Lodge (base) | `https://www.youtube.com/embed/QozKoFs-hL0` | 200 | text/html | - | - | 200 | none |
| 115 | img | Sundance: Bearclaw summit | `https://app.prismcam.com/public/helpers/realtime_preview.php?c=74&s=720` | 200 | image/jpeg | 31 KB | changed | 200 | - |
| 116 | img | Sundance: Mandan summit | `https://watch.hdrelay.io/api/public/poster/cam_sundance_mountain___mandan_summit_1781718266360` | 200 | image/jpeg | 92 KB | changed | 200 | - |
| 117 | img | Sundance: base | `https://app.prismcam.com/public/helpers/realtime_preview.php?c=75&s=720` | 200 | image/jpeg | 138 KB | same | 200 | - |
| 118 | img | Brian Head: Giant Steps summit | `https://b15.hdrelay.com/camera/1fbebe18-f211-4fec-a185-0024cbc0838c/snapshot` | 200 | image/jpeg | 10 KB | changed | 200 | - |
| 119 | img | Brian Head: Giant Steps base | `https://b15.hdrelay.com/camera/bcca39a1-43c0-477f-9389-5b039c797c5d/snapshot` | 200 | image/jpeg | 34 KB | changed | 200 | - |
| 120 | img | Brian Head: snow stake | `https://b16.hdrelay.com/camera/66e069aee2c05fceb65b6688/snapshot` | 200 | image/jpeg | 115 KB | same | 200 | - |
| 121 | img | Jackson Hole: Rendezvous summit panorama (Roundshot) | `https://backend.roundshot.com/cams/12a4b2c24cd515e0a115d4a0f59ef7f8/medium` | 200 | image/jpeg | 111 KB | same | 200 | - |
| 122 | img | Jackson Hole: Cody Bowl | `https://cams.jacksonhole.com/webcam/codybowl.jpg` | 200 | image/jpeg | 236 KB | changed | 200 | - |
| 123 | img | Jackson Hole: Teewinot | `https://cams.jacksonhole.com/webcam/teewinot.jpg` | 200 | image/jpeg | 250 KB | changed | 200 | - |
| 124 | img | Jackson Hole: Teton Village commons | `https://cams.jacksonhole.com/webcam/tetonvillagecommons.jpg` | 200 | image/jpeg | 133 KB | changed | 200 | - |
| 125 | img | Grand Targhee: Dreamcatcher | `https://copyrighted.seejh.com/gtrdream/gtrdream.jpg` | 200 | image/jpeg | 383 KB | changed | 200 | - |
| 126 | img | Grand Targhee: Colter | `https://copyrighted.seejh.com/gtrcolter/gtrcolter.jpg` | 200 | image/jpeg | 180 KB | changed | 200 | - |
| 127 | img | Grand Targhee: Stick of Truth snow stake | `https://copyrighted.seejh.com/gtrsnowstick/gtrsnowstick.jpg` | 200 | image/jpeg | 122 KB | changed | 200 | - |
| 128 | img | Grand Targhee: plaza | `https://copyrighted.seejh.com/gtrplaza/gtrplaza.jpg` | 200 | image/jpeg | 233 KB | changed | 200 | - |

Notes on the "same" rows: COtrip *Cellular* stills carry an EXIF capture time and the ones shipped were captured on 2026-10-12 (Monarch 19:30, Red Mountain 13:16, Fremont 19:30, Silverton 19:30, Wolf Creek 19:18, Grant 19:30 local); UDOT RWIS feeds are animated GIFs that update every few minutes; Roundshot panoramas update every 10 minutes.

## Tested and rejected

| source | URL / id | result | why it was not shipped |
|---|---|---|---|
| COtrip Berthoud Pass (cam 9314) | `https://cocam.carsprogram.org/Cellular/040W24300CAM1RHS-E.jpg (+ -W, -RoadSurface, -ParkingLot)` | 200 image/jpeg 352x240 | EXIF capture time 2026-08-03 12:15 — daytime summer frame served at night; stale. Kept as link. |
| COtrip Rabbit Ears (cam 9321, 5.5 mi W of pass) | `https://cocam.carsprogram.org/Cellular/040E14720CAM1RHS-E.jpg (+ -W, -RoadSurface)` | 200 image/jpeg | EXIF 2026-08-12 — stale. Kept as link. |
| COtrip US-40 MP 141.60 Steamboat (cam 9302) | `https://cocam.carsprogram.org/Cellular/040E14160CAM1RHS-*.jpg` | 200 image/jpeg | EXIF 2026-08-12 — stale. |
| COtrip I-70 MP 241.65 Idaho Springs cellular (cam 9292) | `https://cocam.carsprogram.org/Cellular/070E24165CAM1RHS-*.jpg` | 200 image/jpeg | EXIF 2026-08-06 — stale; the stream snapshot of cam 15425 was used instead. |
| COtrip I-70 MP 216.60 "Loveland Pass 2/3/4" (cams 15083/15473/15028) | `https://cocam.carsprogram.org/Snapshots/070E21660CAM1RHS-2.flv.png (-3, -4)` | 200 image/jpeg 21107 B 1920x1080 | "STREAM NOT AVAILABLE" placeholder (md5 a2f0687d). |
| COtrip CO-9 Breckenridge (cam 15272) | `https://cocam.carsprogram.org/Snapshots/009S08600CAM1RHS.flv.png` | 200, placeholder | "STREAM NOT AVAILABLE" placeholder. |
| COtrip I-70 MP 172.85 Vail (15045), MP 246.35/246.40 Floyd Hill (15660/15223) | `https://cocam.carsprogram.org/Snapshots/070W17285CAM1RHS.flv.png, 070W24635CAM1RHS.flv.png, 070W24640CAM1RHS.flv.png` | 200, placeholder | "STREAM NOT AVAILABLE" placeholder. |
| COtrip I-70 MP 123.15 Glenwood (14857) | `https://cocam.carsprogram.org/Snapshots/070E12315CAM1MED.flv.png` | 200 image, unchanged | Frame did not change in a minute; neighbours at MP 117.65 and 120.85 shipped instead. |
| COtrip documented legacy pattern | `https://www.cotrip.org/dimages/camera?imageURL=liveview/I70Mile191West9.jpg` | not used | Superseded: the live site serves stills from cocam.carsprogram.org (inventory: https://api-511x-co.carsprogram.org/cameras/map-features). The two old entries in 00b_cams.js were replaced. |
| COtrip HLS streams (831 cameras) | `https://publicstreamer{1-4}.cotrip.org/rtplive/<cam>/playlist.m3u8` | 200 m3u8 | The page has no HLS player; the matching https://cocam.carsprogram.org/Snapshots/<cam>.flv.png frame (320x240, refreshed by CDOT) was used instead. |
| UDOT placeholder cameras | `/map/Cctv/155967 (LCC Entry 2), 141123, 142189, 164385 (Deer Valley Dr/Park Ave), 154500 (SR-224 Canyons), 154642 (US-189 MP 21.57), 165749 (SR-14)` | 200 image/png 73525 B or 27805 B | Static "camera unavailable" PNG (md5 585afd07 / 0e8aaf5e). |
| UDOT US-40 Mayflower Summit RWIS (164705) | `https://www.udottraffic.utah.gov/map/Cctv/164705` | 200 image/gif 1.3 MB | Works but 1.3 MB per refresh; left out for bandwidth. |
| UDOT other LCC/BCC/I-80/SR-224/US-189/SR-92/SR-143 cams (≈45 ids) | `e.g. 164767 Upper Vault, 166000 Tanners Flat, 165174 Upper White Pine, 164789 Butler, 165945 Cardiff, 166151/166232/166107 Parleys Canyon, 166133 Summit Park, 166134 Jeremy Ranch, 164599 Vivian Park, 164684 Bridal Veil, 165763 Pine Hollow, 165986 SR-143 MP 21.91 …` | 200 image/jpeg or gif, live | Passed but not shipped: the brief asked for the key cameras per canyon, so the closest ones to the summits, mouths and resort entrances were kept. |
| A-Basin direct stills | `https://ftp.purchus.io/wwwroot/abasin/webcam/abasincam1001m.jpg (Base Area), abasincam5.jpg (Zuma)` | TLS failure | Host certificate has expired (curl 60); browsers would also refuse it. The hdrelay stills were used instead. |
| Vail Resorts brownrice stills that are offline | `https://live5.brownrice.com/cam-images/breckenridge10.jpg (Peak 9), live7…/breckenridge7.jpg (Peak 7), live2…/vailch2.jpg (Gore Range), live2…/parkcityhighmeadow.jpg, live2…/parkcitytopobx.jpg` | 200 text/html (brownrice "offline" page) or 404 | Camera offline pre-season; no still available. |
| Beaver Creek (brownrice) | `player.brownrice.com/embed/bcspruce, bcredbuffalo, bcmccoy, bctalons, bcvillage, bcsnowstake2 and liveN…/cam-images/<name>.jpg` | embed 200 but no m3u8; stills 404 / html | All six streams report "offline" (pre-season). Kept as link. |
| Wolf Creek (brownrice) | `player.brownrice.com/embed/wolfcreeksummit, wolfcreektreasure, wolfcreektresurlift` | streams offline, stills html | Kept as link. |
| Purgatory Paradise (brownrice) | `player.brownrice.com/embed/purgatoryparadise` | stream offline | Only the Plaza still (live5…/purgatoryplaza.jpg) works. |
| Purgatory / Sundance / Aspen Verkada embeds | `https://vauth.command.verkada.com/__v/purgatory/embed/html/…, …/sundance-mountain-resort/embed/html/…, Aspen lift cams (vstream.command.verkada.com)` | 302 → command.verkada.com/embed.html, X-Frame-Options: SAMEORIGIN + CSP | Embedding on another site is blocked by the Verkada host. |
| Monarch brownrice streams | `player.brownrice.com/embed/skimonarchgarfield, skimonarchsundeck, skimonarchpanoflats` | offline | webcam.io stills (Powder/Storm/Mountain cams) shipped instead. |
| Telluride Black Iron Bowl | `https://g1.ipcamlive.com/player/snapshot.php?alias=bonvivant` | 404 | Camera not published. |
| Breckenridge snow stake (timecam) | `https://timecam.tv/view_cam_embed.aspx?C=704bajekd613` | TLS: certificate has expired | Not embeddable safely. |
| Winter Park Best Western cam | `https://cams.winterparkresort.com/best-western-cam.jpg` | 200 image/jpeg 1.05 MB | Works but 1 MB per refresh and a hotel view; four YouTube feeds exist but only Base and Snow Stake reported isLive (Lunch Rock HfX4H3MSwXs, Snoasis Dt_WhmxV0yE, Tubing jGS0j-viJmM did not). |
| Steamboat YouTube | `lKc9xwndUK4 (Mid-Mountain Snow Stake), oKKj_upaoCI (Gondola)` | exists; isLive not confirmed / confirmed only once | Four confirmed-live feeds shipped (Four Points, Thunderhead, Christie Peak, Steamboat Square). |
| Solitude YouTube | `rUXoOLxKKX4 (Summit Express), gfHReYIuydU (Honeycomb), QCqYmOGzULs (Snowstake)` | playabilityStatus UNPLAYABLE (stream ended) | Only Sunshine Bowl (Lnznapxh2xM) reported live. fKLVbvQhPsc / NSiItCGabfo / l2X9DlRzX54 / yeoBog_kSzc / Yx3QmuKfwjY not confirmed live. |
| Deer Valley YouTube | `sAjdqw-lzgI (Sultan), uE_ent5rC3Y (Silver Lake), 0shWeR7Fvpg (Galena)` | isLive not confirmed | Empire, Revelator, Sterling and Snow Park confirmed live and shipped. |
| Brighton help-centre page | `https://help.brightonresort.com/s/article/Live-Cameras` | Salesforce page, no content in headless browser | The five YouTube feeds were found on https://www.brightonresort.com/conditions instead (all isLive). |
| Powder Mountain | `https://www.living.powdermountain.com/… (proxy 502), https://powdermountain.com/conditions (error page), https://storage.googleapis.com/prism-cam-00112/360.jpg` | 200 image/jpeg 640x360 | The only image found is a daytime frame served at night (stale/hero). Kept as link. |
| Eldora | `https://www.eldora.com/the-mountain/current-conditions/webcams/` | page loads, no camera media found | No img/iframe/video camera sources in the DOM or network log. Kept as link (page URL corrected; the old one was a 404). |
| Snowbasin | `https://www.snowbasin.com/the-mountain/web-cams/` | only UDOT embeds | The resort page shows UDOT cams 138642/136126 (same feeds as 164505/165868, shipped as pass cams). Kept as link. |
| Alta extra stills | `https://alta-webcams.sfo3.cdn.digitaloceanspaces.com/Superior.jpg, Greeley.jpg, collins_dtc.jpg; prismcam c=65 (Albion Basin)` | 200 image/jpeg, live | Passed; left out by the 4-per-resort cap. |
| Snowbird extra stills | `manage.hdrelay.com/snapshot/8611e276… (snow stake), …/61b2490b… (Tram bullpen), backend.roundshot.com/cams/09123258…/medium (Hidden Peak 360)` | 200 image/jpeg | Passed; left out by the 4-per-resort cap. |
| Copper extra | `manage.hdrelay.com/snapshot/59703a85… (snow stake), img.hdrelay.com/frames/fb469125…/default/last.jpg (Union Peak 800x600)` | 200 | Passed; cap. |
| Keystone Lakeside, Loveland snowcam, Park City Mountain Village, Crested Butte Umbrella Bar, Taos Lower Plaza, Jackson South Hoback / gondola bottom, Aspen Buttermilk (roundshot 87) | `various` | 200 image/jpeg | Passed; cap or lower priority. |

## Discovery notes

- COtrip: the camera inventory the map uses is `https://api-511x-co.carsprogram.org/cameras/map-features` (GeoJSON, 1036 cameras, no key). Each camera lists `views[]` of type `STILL_IMAGE` (cocam.carsprogram.org/Cellular/… or …/Snapshots/…) or `WMP` (publicstreamerN.cotrip.org HLS). For WMP cameras the still frame is `https://cocam.carsprogram.org/Snapshots/<stream name>.flv.png` (served as image/jpeg, actually PNG 320x240).
- UDOT: `https://www.udottraffic.utah.gov/map/mapIcons/Cameras` lists 2082 camera ids with coordinates; `https://www.udottraffic.utah.gov/tooltip/Cameras/<id>?lang=en` gives the name; the still is `https://www.udottraffic.utah.gov/map/Cctv/<id>` (jpeg, png placeholder, or RWIS gif).
- Resorts: Vail Resorts sites use brownrice players with stills at `https://liveN.brownrice.com/cam-images/<name>.jpg`; A-Basin, Copper, Snowbird, Brian Head and Sundance use hdrelay (`img.hdrelay.com/frames/<id>/default/last.jpg`, `manage.hdrelay.com/snapshot/<id>`, `b15.hdrelay.com/camera/<id>/snapshot`); Aspen Snowmass, Snowbird and Jackson Hole use Roundshot (`backend.roundshot.com/cams/<id>/medium`); Winter Park, Steamboat and Deer Valley use camstreamer embeds that 302 to YouTube live streams; Brighton and Solitude embed YouTube directly; Alta uses DigitalOcean Spaces + prismcam; Telluride uses ipcamlive; Grand Targhee uses SeeJH; Monarch uses webcam.io.
