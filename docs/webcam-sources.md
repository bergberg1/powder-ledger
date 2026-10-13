# Embeddable live webcam sources for a CO / UT / northern NM / southern WY ski-weather page

Research date: 2026-10-13. Method: web search only (page fetches were blocked in this environment), so every URL below is tagged either **[confirmed by a source]** (the URL or pattern appears verbatim in a search-indexed page) or **[inferred from pattern, unverified]** (built from a documented pattern but not seen verbatim). No camera IDs were invented; where an ID could not be found the row says so and gives the official page as the fallback. Nothing here was loaded in a browser, so "confirmed" means "a cited page shows this URL", not "this URL returned a JPEG today".

Legend for the "embeddable URL" column: `img` = still image to put in an `<img>` and re-request every ~60 s (append a cache-buster such as `?t=<timestamp>`); `iframe` = embed the page/player; `youtube` = `https://www.youtube.com/embed/<VIDEO_ID>`; `link` = no embed found, link out only.

---

## Key question 1 — Colorado DOT (COtrip) camera stills, API key, and pass/corridor camera IDs

### Takeaway
COtrip still images are served from `cotrip.org` through a query-string image proxy (`/dimages/camera?imageURL=liveview/<CameraName>.jpg`, with older `/images/camera?imageURL=<id>.jpg` and `/images/ws/camera?imageURL=<n>` variants), and a newer CDN host (`cocam.carsprogram.org`) is credited for current CDOT images on third-party listings; no API key is needed to load an image URL, but the structured camera list (data.cotrip.org / manage-api.cotrip.org) needs a key that CDOT issues by request rather than self-service. I could not find a published, current camera-ID list for the specific passes requested, so per-pass rows below give the official map/list links and the third-party camera names, not image URLs.

### Cited Findings

**URL patterns and access**
- Older (pre-2021) direct still-image links were published by CDOT itself in the form `http://www.cotrip.org/images/camera?imageURL=60116W.jpg` (I-70 at SH 103 / Mt. Evans exit, westbound), with other Idaho Springs cameras under a `remote/` subfolder; the page is in CDOT's *archived* I-70 Twin Tunnels project section — [CDOT: Links to Cotrip Cameras](https://www.codot.gov/projects/archived-project-sites/i70twintunnels/links-to-cotrip-cameras)
- CDOT launched a new COtrip website in September 2021 and "renamed the location of every snapshot and video link on the State Site", which a camera-mirror site says broke its older links — [coloradowebcam.net I-70 Mountain Pass route page](https://coloradowebcam.net/cdotwebcamroutes/i70-mountain-pass-cdot-webcams); same point on [coloradowebcam.net Floyd Hill page](https://www.coloradowebcam.net/index.php/cdotcamera/idaho-springs-floyd-hill-central-city-pkwy-east)
- Newer-style still URLs indexed by search engines on cotrip.org: `https://www.cotrip.org/dimages/camera?imageURL=liveview/I70Mile191West9.jpg` — [COtrip indexed URL](https://www.cotrip.org/dimages/camera?imageURL=liveview/I70Mile191West9.jpg); `https://www.cotrip.org/dimages/camera?imageURL=liveview/US6Mile216West.jpg` — [COtrip indexed URL](https://www.cotrip.org/dimages/camera?imageURL=liveview/US6Mile216West.jpg); `https://www.cotrip.org/dimages/ws/camera?imageURL=90` — [COtrip indexed URL](https://www.cotrip.org/dimages/ws/camera?imageURL=90); `https://www.cotrip.org/images/ws/camera?imageURL=30` — [COtrip indexed URL](https://www.cotrip.org/images/ws/camera?imageURL=30)
- A third-party I-70 camera page embeds images in the form `i.cotrip.org/dimages/camera?imageURL=liveview/<name>.jpg&v=<cache-buster>` — [markboulder.com I-70 Traffic Cameras](https://www.markboulder.com/origin/originportal/WEBCAMS/I-70%20Traffic%20Cameras.html)
- Current CDOT images on Ventusky are attributed to host `cocam.carsprogram.org` (provider codot.gov), e.g. "US 40 MP 243.00 WB at Berthoud Pass LiveView" — [Ventusky webcam 393467625](https://www.ventusky.com/webcam-393467625); and "I-25 MP 209.45 NB at W 8th Ave" — [Ventusky webcam 592989903](https://www.ventusky.com/webcam-592989903). The exact path on that host was not exposed in any search result.
- COtrip has a camera list view with a text search parameter: `https://maps.cotrip.org/list/cameras?searchTerm=260&page=1&pageRecordLimit=25` — [COtrip list view](https://maps.cotrip.org/list/cameras?searchTerm=260&page=1&pageRecordLimit=25); the plain list is [maps.cotrip.org/list/cameras](https://maps.cotrip.org/list/cameras)
- COtrip help says users can "view a larger camera image", and the COtrip app offers "camera images and live streaming video" — [COtrip help](https://maps.cotrip.org/help/section/how-to-view-list-event-information.html); [COtrip Planner on Google Play](https://play.google.com/store/apps/details?id=crc.oneapp.co&hl=en_US)
- Developer data: Colorado's open-data catalog lists feeds at `https://data.cotrip.org/api/v1/wzdx?apiKey=` (key is a query parameter) and points to the COtrip for-developers page for keys; the catalog also says the feed lives at `https://manage-api.cotrip.org/` — [data.colorado.gov CDOT Real Time Data Feed](https://data.colorado.gov/Transportation/CDOT-Real-Time-Data-Feed-XML-/j3ch-zsvz); [COtrip for-developers page](https://www.cotrip.org/help/section/for-developers.html) (also at maps.cotrip.org/help/section/for-developers.html)
- A CDOT asset titled "Json APIs Access URLs for COtrip" exists but its contents are an image and were not readable from search — [CDOT asset page](https://www.codot.gov/assets/json-apis-access-urls-for-cotrip.png/view)
- A ski-conditions project reports that CDOT's feed "isn't a self-service signup", expects credentials rather than an instant key, and recommends emailing `cdot_cotrip@state.co.us` for camera-feed access — [informaswan/slopeinsights issue #1](https://github.com/informaswan/slopeinsights/issues/1) (anecdotal, ~3 weeks old)
- The older XML feeds (e.g. `/xml/cameras.xml`) required a username/password in the URL — [data.colorado.gov listing](https://data.colorado.gov/Transportation/CDOT-Real-Time-Data-Feed-XML-/j3ch-zsvz); a programmatic wrapper for those XML feeds exists — [jfredrickson/cotrip-feed](https://github.com/jfredrickson/cotrip-feed)
- Home Assistant users discuss COtrip's API for an integration (no image URL given) — [HA community thread](https://community.home-assistant.io/t/cotrip-colorado-road-information/666496)
- Refresh: a third-party aggregator says Eisenhower Tunnel cams "refresh automatically every 45 seconds, straight from CDOT" — [trafficvision.live](https://trafficvision.live/blog/eisenhower-tunnel-traffic-cameras); another says COtrip road data refreshes every five minutes — [Blue Sky Limo I-70 report](https://blueskylimovail.com/road-conditions/i70-road-report/)
- CDOT monitors "over 1,000 cameras statewide" via maps.cotrip.org — [CBS Colorado](https://www.cbsnews.com/colorado/news/colorado-highway-cameras-what-they-capture/)
- No published COtrip hotlinking/embedding policy was found; the only policy link on the app listing is CDOT's general privacy policy — [CDOT privacy policy](https://codot.gov/topcontent/privacypolicy)

**Camera names per location (third-party mirrors; no official IDs found)**
- Eisenhower Tunnel: cams at MP 209.85 WB (~3.8 mi W of tunnel), MP 213.45 EB (0.1 mi W), MP 215.6 EB approach — [trafficvision.live](https://trafficvision.live/blog/eisenhower-tunnel-traffic-cameras); "0.3 E of Eisenhower-Johnson Tunnels East" — [coloradowebcam.net](https://www.coloradowebcam.net/camera/east-eisenhower-i70-webcam-03-e-eisenhower-johnson-tunnels-webcam-east-cdot); JamJumper lists "All 20 Eisenhower Tunnel" cams on one page — [jamjumper.com](https://www.jamjumper.com/index.php?place=eisenhower-tunnel&sort=ASC)
- Loveland Pass (US-6): "Summit Loveland Pass West" and "Summit of Loveland Pass East" CDOT cams — [coloradowebcam.net west](https://coloradowebcam.net/camera/loveland-pass-webcam-summit-loveland-pass-west-webcam-cdot), [coloradowebcam.net east](https://www.coloradowebcam.net/camera/loveland-pass-webcam-summit-loveland-pass-east-webcam-cdot); "0.4 E of Loveland Pass US 6 East" — [coloradowebcam.net](https://www.coloradowebcam.net/camera/east-eisenhower-i70-webcam-04-e-loveland-pass-us-6-webcam-east-cdot); Loveland Ski Area's Chair 9 cam also looks over the pass — [coloradowebcam.net](https://coloradowebcam.net/camera/i70-eisenhower-tunnel-east-loveland-pass-loveland-ski-area-webcam-chair-9)
- Vail Pass: "0.7 Miles West Of Vail Pass Summit East Bound" CDOT cam — [coloradowebcam.net](https://coloradowebcam.net/camera/vail-pass-webcam-07-miles-west-vail-pass-summit-east-bound-webcam-cdot); route page — [CDOT I70 Vail Pass](https://coloradowebcam.net/cdotwebcamroutes/cdot-i70-vail-pass)
- Berthoud Pass (US-40): "US 40 MP 243.00 WB at Berthoud Pass LiveView" (CDOT via cocam.carsprogram.org) — [Ventusky](https://www.ventusky.com/webcam-393467625); route page — [coloradowebcam.net Berthoud Pass / Winter Park](https://coloradowebcam.net/cdotwebcamroutes/cdot-berthoud-pass-winter-park-webcams); Preserve Rollins Pass lists a Berthoud Pass parking-lot cam and a summit cam — [preserverollinspass.org](https://www.preserverollinspass.org/resources/rollins-pass-weather/); OpenSnow Berthoud cam page (link only) — [OpenSnow](https://opensnow.com/location/berthoud/cams); Webcam Galore mirrors "US-40 @ Berthoud Pass (LV)" — [webcamgalore](https://www.webcamgalore.com/webcam/USA/Berthoud-Pass-Colorado/24106.html)
- Floyd Hill / Idaho Springs: "I-70 MP 243.25 WB 0.3 miles E of Central City Pkwy", plus MP 242.00 EB and MP 242.85 WB — [coloradowebcam.net Floyd Hill route](https://coloradowebcam.net/cdotwebcamroutes/cdot-i70-idaho-springs-floyd-hill); old CDOT list had Idaho Springs EB/WB, Fall River Road EB, SH 103 EB/WB — [CDOT archived links](https://www.codot.gov/projects/archived-project-sites/i70twintunnels/links-to-cotrip-cameras)
- Statewide pass index pages (third party): [coloradoinfo.com CDOT webcams of passes](https://coloradoinfo.com/cdot-webcams-colorado-passes-highways/); [Fly Colorado pass cameras](https://www.flycolorado.org/index.php/mountain-passes/pass-cameras/) (links to legacy `cotrip.org/device.htm`); [wasatchroads.com CDOT cameras](https://wasatchroads.com/cdot-cameras); a personal COtrip cam viewer — [ian.wittmeyer.io cotrip_cam.php](https://ian.wittmeyer.io/ianwx_files/cotrip/cotrip_cam.php)
- Rabbit Ears, Wolf Creek, Monarch, Red Mountain, Independence Pass, Georgetown, Silverthorne, Copper, Vail, Glenwood Canyon: no camera names or IDs surfaced in search results (see Gaps).

#### Reference table — Colorado passes / corridors (COtrip)

| location | provider | embeddable URL (type) | official page | status / notes |
|---|---|---|---|---|
| COtrip generic still pattern | CDOT / COtrip | `https://www.cotrip.org/dimages/camera?imageURL=liveview/<CameraName>.jpg` (img) | https://maps.cotrip.org/list/cameras | Pattern [confirmed by a source] (two verbatim examples indexed); any specific `<CameraName>` other than the two below is [inferred, unverified]. Older `/images/camera?imageURL=<id>.jpg` and `/images/ws/camera?imageURL=<n>` forms also seen; Sept-2021 relaunch renamed links, so test before use. Current CDN host appears to be `cocam.carsprogram.org` (path unknown). |
| I-70 MP ~191 (Vail Pass summit is MP 190) | COtrip | `https://www.cotrip.org/dimages/camera?imageURL=liveview/I70Mile191West9.jpg` (img) | https://maps.cotrip.org/list/cameras?searchTerm=Vail%20Pass | URL [confirmed by a source] (indexed); location = Vail Pass is an inference from the milepost. |
| US-6 MP 216 West | COtrip | `https://www.cotrip.org/dimages/camera?imageURL=liveview/US6Mile216West.jpg` (img) | https://maps.cotrip.org/list/cameras?searchTerm=US%206 | URL [confirmed by a source] (indexed); exact spot on US-6 not verified (Loveland Pass summit is near MP 228, so this is probably below the pass). |
| I-70 Eisenhower Tunnel | COtrip | not found (cams exist at MP 209.85 WB, 213.45 EB, 215.6 EB) | https://maps.cotrip.org/list/cameras?searchTerm=Eisenhower | No image URL/ID found; names from third-party mirror. Mirror pages: jamjumper.com (20 cams), coloradowebcam.net. |
| Loveland Pass (US-6) | COtrip | not found ("Summit Loveland Pass West/East") | https://maps.cotrip.org/list/cameras?searchTerm=Loveland%20Pass | No image URL/ID found. |
| Vail Pass | COtrip | see I-70 MP 191 row; "0.7 mi W of Vail Pass Summit EB" | https://maps.cotrip.org/list/cameras?searchTerm=Vail%20Pass | ID not found. |
| Berthoud Pass (US-40) | COtrip (cocam.carsprogram.org) | not found ("US 40 MP 243.00 WB at Berthoud Pass LiveView") | https://maps.cotrip.org/list/cameras?searchTerm=Berthoud | Link-only fallbacks: https://www.ventusky.com/webcam-393467625 , https://opensnow.com/location/berthoud/cams , https://www.preserverollinspass.org/resources/rollins-pass-weather/ |
| Rabbit Ears Pass (US-40) | COtrip | not found | https://maps.cotrip.org/list/cameras?searchTerm=Rabbit%20Ears | No result in search. |
| Wolf Creek Pass (US-160) | COtrip | not found | https://maps.cotrip.org/list/cameras?searchTerm=Wolf%20Creek | No result in search; resort cams at wolfcreekski.com/webcams/ are the practical fallback. |
| Monarch Pass (US-50) | COtrip | not found | https://maps.cotrip.org/list/cameras?searchTerm=Monarch | No result in search. |
| Red Mountain Pass (US-550) | COtrip | not found | https://maps.cotrip.org/list/cameras?searchTerm=Red%20Mountain | No result in search. |
| Independence Pass (SH-82) | COtrip | not found | https://maps.cotrip.org/list/cameras?searchTerm=Independence | Seasonal closure road; no result. |
| Floyd Hill / Idaho Springs | COtrip | not found (MP 242.00 EB, 242.85 WB, 243.25 WB; legacy `60116W.jpg` = I-70 @ SH 103 WB) | https://maps.cotrip.org/list/cameras?searchTerm=Floyd%20Hill | Legacy URL `http://www.cotrip.org/images/camera?imageURL=60116W.jpg` [confirmed by a source] but HTTP-only and probably dead since 2021. |
| Georgetown, Silverthorne, Copper Mtn, Vail, Glenwood Canyon | COtrip | not found | https://maps.cotrip.org/list/cameras?searchTerm=<name> | No IDs surfaced; use list-view search (searchTerm parameter is confirmed). |

### Inferences
- The `searchTerm=` query on `maps.cotrip.org/list/cameras` is confirmed to exist, so `https://maps.cotrip.org/list/cameras?searchTerm=Loveland%20Pass` style links are a reasonable official-page fallback for every pass even though I could not confirm the result sets.
- Because Ventusky credits `cocam.carsprogram.org` for current CDOT images while the cotrip.org `dimages` URLs are only search-index artifacts, the `cotrip.org` proxy may be a legacy path that still proxies, or may be dead; anyone implementing this must open one camera on maps.cotrip.org in browser dev tools and copy the live `<img src>` to learn the actual current host/path for `cocam.carsprogram.org`.
- Loading a still image needs no API key (no source says the image proxy is keyed); a key is only needed for the camera inventory API.

### Gaps
- No current, official COtrip image URL or camera ID was found for any of the 15 requested locations; the only verbatim image URLs are the two indexed `liveview/` examples and the archived 2010s `60116W.jpg` set.
- The exact path format on `cocam.carsprogram.org` was not exposed.
- Whether `data.cotrip.org/api/v1/` has a cameras endpoint (and its field names) could not be confirmed; only `wzdx` and `cwz` endpoints were documented in the open-data catalog.
- No COtrip terms-of-use statement on hotlinking/embedding was found.

---

## Key question 2 — Utah DOT (UDOT Traffic) camera stills and canyon/pass camera IDs

### Takeaway
UDOT publishes a per-camera snapshot URL of the form `https://www.udottraffic.utah.gov/map/Cctv/<id>` (seen verbatim in UDOT's own API docs, and used key-free by a GitHub project that polls Little Cottonwood cams every 10 min); the `1_devices/aux<id>.jpeg` pattern mentioned in the assignment was not found in any source. Numeric IDs for the requested canyon cameras were not published anywhere I could reach, so the rows give camera names and the official canyon pages.

### Cited Findings
- UDOT's API docs give a `cameras` endpoint at `https://www.udottraffic.utah.gov/api/v2/get/cameras` with `format` = xml|json (default json) and a required developer `key`; the sample response shows each camera's views with a URL such as `https://www.udottraffic.utah.gov/map/Cctv/15160` — [UDOT Traffic cameras endpoint help (prod-ut.ibi511.com)](https://prod-ut.ibi511.com/help/endpoint/cameras); [UDOT API documentation](https://prod-ut.ibi511.com/developers/doc)
- A registered account is required before requesting a developer key (sign up, log in, then request the key on the developer docs page) — [UDOT API documentation](https://prod-ut.ibi511.com/developers/doc)
- "UDOT publishes ~1-minute snapshots at https://www.udottraffic.utah.gov/map/Cctv/<id>; no API key needed"; the project polls 7 cameras between the SR-209 intersection and Alta every 10 minutes — [medley/canyon-watch README](https://github.com/medley/canyon-watch)
- Third-party notes put the UDOT developer-key rate limit at 10 calls/60 s and say the key "unlocks live traffic-cam images" for Park City, Deer Valley, Alta, Snowbird and Solitude — [informaswan/slopeinsights issue #2](https://github.com/informaswan/slopeinsights/issues/2); a Home Assistant 511 integration says Utah requires a developer key throttled to 10 calls/min — [ihavespoken327/ha-the511](https://github.com/ihavespoken327/ha-the511)
- UDOT's Cottonwood Canyons site has named camera pages such as "Little Cottonwood Rd 3335 E SR-209 @ Old Wasatch Blvd 9710 S GNT" and "Little Cottonwood @ Alta MP 12.16", lists SR-210 camera locations including Seven Turns, White Pine and Upper Vault, and warns cameras "may temporarily go offline periodically due to technical maintenance" — [UDOT Cottonwood Canyons road information](https://cottonwoodcanyons.udot.utah.gov/road-information/); [camera page: SR-209 @ Old Wasatch Blvd](https://cottonwoodcanyons.udot.utah.gov/c4-traffic-camera/little-cottonwood-rd-3335-e-sr-209-old-wasatch-blvd-9710-s-gnt/); [camera page: Alta MP 12.16](https://cottonwoodcanyons.udot.utah.gov/c4-traffic-camera/little-cottonwood-alta-mp-12-16/)
- UDOT hosts an ArcGIS Experience "UDOT Traffic Cameras - Big Cottonwood Canyon" — [experience.arcgis.com](https://experience.arcgis.com/experience/a8eba972f11b494986c39c1ca3844991)
- Third-party camera listings name "Little Cottonwood Rd / SR-210 EB @ White Pine Parking / MP 9.2", "Little Cottonwood Rd / SR-210 EB @ Seven Turns / MP 7.4", "Big Cottonwood Canyon Rd / SR-190 @ Silver Fork / MP 12.54", and SR-143 near Brian Head "Milepost 18.19" — [milecheckapp.com UDOT cameras](https://milecheckapp.com/cameras/utah/); [duckcreekvillageinn.com live cams](https://www.duckcreekvillageinn.com/live-cams)
- UDOT's own map: click a camera icon, then "My Cameras" to save it; the site has a Cameras section with regional filters (Salt Lake County, Wasatch Back, etc.) — [udottraffic.utah.gov](https://www.udottraffic.utah.gov/)
- UDOT RWIS "streaming cameras" list uses internal IPs (10.x / 165.x) reachable only on the State of Utah network — [UDOT RWIS cameras](https://udottraffic.utah.gov/forecastview/documents/RWIS_cameras.htm)
- Third-party sites say most UDOT cameras refresh every minute or two; Wasatch Roads warns that third-party mirrors "often show outdated, cached images" and to check the timestamp — [wasatchroads.com UDOT cameras](https://wasatchroads.com/udot-cameras); [wasatchroads.com map guide](https://wasatchroads.com/blog/utah-udot-road-cameras-live-map-guide)
- Wasatch Roads has per-canyon cam pages (Little Cottonwood, Wasatch Back) that mix UDOT road cams with resort cams — [LCC cameras](https://wasatchroads.com/little-cottonwood-canyon/cameras); [Wasatch Back cameras](https://wasatchroads.com/wasatch-back/cameras)
- University of Utah's weather center republishes UDOT Salt Lake Valley cams — [forecast.utah.edu Pointer cams](https://forecast.utah.edu/pointer/real-time/cams.html)
- Snowbasin's webcam page links to UDOT road cameras for its access roads — [snowbasin.com web-cams](https://www.snowbasin.com/the-mountain/web-cams/)

#### Reference table — Utah canyons / passes (UDOT)

| location | provider | embeddable URL (type) | official page | status / notes |
|---|---|---|---|---|
| UDOT generic snapshot pattern | UDOT Traffic | `https://www.udottraffic.utah.gov/map/Cctv/<id>` (img, per canyon-watch) | https://www.udottraffic.utah.gov/ | Pattern [confirmed by a source] (UDOT API docs sample id 15160 + canyon-watch README, key-free, ~1-min refresh). Whether it returns a raw JPEG vs. an HTML wrapper is not stated; test with `curl -I`. `https://udottraffic.utah.gov/1_devices/aux<id>.jpeg` = [inferred, unverified; no source found]. |
| Sample camera id 15160 | UDOT | `https://www.udottraffic.utah.gov/map/Cctv/15160` (img) | https://prod-ut.ibi511.com/help/endpoint/cameras | URL [confirmed by a source] but location of 15160 is not stated in the docs excerpt. |
| LCC SR-210 mouth (SR-209 @ Old Wasatch Blvd) | UDOT | id not found | https://cottonwoodcanyons.udot.utah.gov/c4-traffic-camera/little-cottonwood-rd-3335-e-sr-209-old-wasatch-blvd-9710-s-gnt/ | Named camera page exists [confirmed]; numeric Cctv id not published. |
| LCC Seven Turns (SR-210 MP 7.4) | UDOT | id not found | https://cottonwoodcanyons.udot.utah.gov/road-information/ | Name [confirmed] (UDOT + milecheckapp); id not found. |
| LCC White Pine (SR-210 MP 9.2) | UDOT | id not found | https://cottonwoodcanyons.udot.utah.gov/road-information/ | Name [confirmed]; id not found. |
| LCC Upper Vault / Snowbird entry | UDOT | id not found | https://cottonwoodcanyons.udot.utah.gov/road-information/ | "Upper Vault" named by UDOT; no "Snowbird entry" camera name found. |
| LCC Alta bypass / Alta MP 12.16 | UDOT | id not found | https://cottonwoodcanyons.udot.utah.gov/c4-traffic-camera/little-cottonwood-alta-mp-12-16/ | Named camera page [confirmed]; no "Alta bypass" camera name found. |
| BCC SR-190 mouth, Solitude, Brighton | UDOT | ids not found ("SR-190 @ Silver Fork MP 12.54" exists) | https://experience.arcgis.com/experience/a8eba972f11b494986c39c1ca3844991 | BCC ArcGIS camera app [confirmed]; ids not published. Brighton's own "Molly Greens" cam shows the base/parking lot (see resorts). |
| Parleys Summit / I-80 | UDOT | id not found | https://www.udottraffic.utah.gov/ (search "Parleys") | Third-party guide confirms I-80 Parleys Summit cams exist; id not found. |
| Kimball Junction | UDOT | id not found | https://wasatchroads.com/wasatch-back/cameras (third party) | Not found in search. |
| Ogden Canyon / Trappers Loop / SR-39 Powder Mtn road | UDOT | ids not found | https://www.snowbasin.com/the-mountain/web-cams/ (links UDOT cams) | Not found in search. |
| Provo Canyon / Sundance (US-189, SR-92) | UDOT | id not found | https://www.udottraffic.utah.gov/ | Not found in search. |
| Logan Canyon (US-89) | UDOT | id not found | https://utahavalanchecenter.org/mountain-weather/logan (weather only) | Not found in search. |
| Brian Head (SR-143, MP 18.19) | UDOT | id not found | https://www.duckcreekvillageinn.com/live-cams (third party) | Camera name [confirmed] via third party; id not found. |

### Inferences
- Since the `map/Cctv/<id>` URL is what UDOT's own API returns as the camera "view" URL and a key-free scraper uses it as a snapshot source, it is the right thing to put in an `<img>`; if it turns out to be an HTML wrapper, the raw image URL will be visible in that page's source.
- To obtain the ids without a key: open udottraffic.utah.gov, zoom to SR-210/SR-190, click each camera, and read the `Cctv/<id>` from the popup image URL; or request a dev key and dump `api/v2/get/cameras?key=...&format=json` once (10 calls/min limit is ample for a one-time inventory).

### Gaps
- No numeric UDOT camera ids were found for any requested canyon/pass camera.
- The `1_devices/aux{id}.jpeg` pattern from the assignment has no supporting source.
- No UDOT statement on hotlinking/embedding was found.

---

## Key question 3 — Resort webcams (official page, provider, embeddable URL, hotlink behaviour)

### Takeaway
Official webcam pages were confirmed for 25 of the 30 resorts (not Eldora, Monarch, Silverton, Alta, or an alta.com page), but search results exposed essentially no direct JPEG, Roundshot, or YouTube video-ID embed URLs — only provider hints (Aspen uses Roundshot panoramas; Solitude and Grand Targhee/SeeJH stream on YouTube; Vail Resorts and Alterra sites refresh stills every 5 min). Hotlink behaviour for resort-hosted images could not be determined from search.

### Cited Findings
- Arapahoe Basin: base, mid-mountain (Black Mountain Lodge), Montezuma Bowl and snow-stake cams; "camera image refreshes about every 5 minutes" — [arapahoebasin.com mountain cams](https://www.arapahoebasin.com/mountain-cams/); A-Basin has a YouTube channel but no live feed was confirmed — [YouTube ArapahoeBasinSkiArea](https://www.youtube.com/user/ArapahoeBasinSkiArea)
- Loveland: five cams (Loveland Valley, Loveland Basin, Chair 1, snow stake, Ptarmigan Roost) — [skiloveland.com webcams](https://skiloveland.com/webcams/)
- Keystone: Dercum Mountain (11,640 ft) and North Peak views — [keystoneresort.com mountain cams](https://www.keystoneresort.com/the-mountain/mountain-conditions/mountain-cams.aspx)
- Breckenridge: on-mountain cams and snow stake "updated throughout the day from 6 a.m. to 3:55 p.m." — [breckenridge.com mountain cams](https://www.breckenridge.com/the-mountain/mountain-conditions/mountain-cams.aspx)
- Copper: individual cam pages (Super Bee HD, Center Village HD, Union Peak, Excelerator) under `/the-mountain/webcams/` — [coppercolorado.com Super Bee HD](https://www.coppercolorado.com/the-mountain/webcams/super-bee-hd-cam/), [Center Village HD](https://www.coppercolorado.com/the-mountain/webcams/center-village-hd-cam/), [Union Peak](https://www.coppercolorado.com/the-mountain/webcams/union-peak-cam/), [Excelerator](https://coppercolorado.com/the-mountain/webcams/mountain/excelerator-cam)
- Vail — [vail.com mountain cams](https://www.vail.com/the-mountain/mountain-conditions/mountain-cams.aspx); Beaver Creek — [beavercreek.com mountain cams](https://www.beavercreek.com/the-mountain/mountain-conditions/mountain-cams.aspx)
- Winter Park: snow stake, base and town cams; also in the resort app — [winterparkresort.com mountain cams](https://www.winterparkresort.com/the-mountain/mountain-cams)
- Steamboat: multiple cams (Thunderhead, Four Points, Christie Express, mid-mountain and summit snow stakes) — [steamboat.com live cams](https://www.steamboat.com/the-mountain/live-cams); [Christie cam](https://www.steamboat.com/the-mountain/live-cams/christie-cam)
- Aspen Snowmass: four-mountain cam hub; Aspen Highlands page is titled "Live Panoramic Webcams", some cams are "panoramic Roundshot cams"; Buttermilk snow stake "updated every 10 minutes sunrise to sunset" — [aspensnowmass.com mountain cams](https://www.aspensnowmass.com/four-mountains/mountain-cams); [Aspen Highlands](https://www.aspensnowmass.com/four-mountains/aspen-highlands/mountain-cams); [Buttermilk](https://www.aspensnowmass.com/four-mountains/buttermilk/mountain-cams); [Snowmass](https://www.aspensnowmass.com/four-mountains/snowmass/mountain-cams); [Aspen Mountain](https://www.aspensnowmass.com/four-mountains/aspen-mountain/mountain-cams)
- Crested Butte: cams "updated every 5 minutes throughout the day" — [skicb.com mountain cams](https://www.skicb.com/the-mountain/mountain-conditions/mountain-cams.aspx)
- Wolf Creek: "three live webcam feeds available, two within the base area and the other located near the summit" — [wolfcreekski.com webcams](https://wolfcreekski.com/webcams/); OnTheSnow labels one the "Wolf Creek Ski Area Base Area stream" — [OnTheSnow Rocky Mountains](https://www.onthesnow.com/rocky-mountains/webcams)
- Purgatory: Village Plaza cam at 8,793 ft — [purgatory.ski mountain webcams](https://www.purgatory.ski/mountain/mountain-webcams/) and [purgatory.ski/mountaincams](https://purgatory.ski/mountaincams)
- Telluride: "live panoramic views of the resort and mountain from various vantage point locations" — [tellurideskiresort.com webcams](https://tellurideskiresort.com/webcams/)
- Silverton: a Colorado cam directory says "oops can't seem to find any!" — [mtntownmagazine.com cams](https://mtntownmagazine.com/cams/)
- Taos: weather page "combines live webcams, weather, snow fall and more" — [skitaos.com weather](https://www.skitaos.com/weather); Mountain Collective lists a Taos "Base" cam — [OnTheSnow Mountain Collective](https://www.onthesnow.com/mountain-collective/webcams)
- Alta: third-party listings name Albion Basin, Mount Superior, High Rustler and "7 real-time webcams"; no alta.com page surfaced — [OpenSnow Alta cams](https://opensnow.com/location/alta-ut-us/cams); [snowstash Alta cams](https://snowstash.com/usa/utah/alta/snow-cams)
- Snowbird: Hidden Peak 360, Powder Paradise, Top of Mineral Basin, Peruvian Gulch, Little Cloud — [snowbird.com all webcams](https://www.snowbird.com/the-mountain/webcams/view-all-webcams/); [Hidden Peak 360](https://www.snowbird.com/the-mountain/webcams/view-all-webcams/hidden-peak-360-webcam/); [Powder Paradise](https://www.snowbird.com/the-mountain/webcams/view-all-webcams/powder-paradise-webcam/); [Top of Mineral Basin](https://www.snowbird.com/the-mountain/webcams/view-all-webcams/top-mineral-basin-webcam/)
- Brighton: "Molly Greens" cam gives a wide view of base and parking lot, "refreshing every few minutes"; Snake Creek, Explorer and Great Western bases have no cam — [help.brightonresort.com Live Cameras](https://help.brightonresort.com/s/article/Live-Cameras)
- Solitude: live views from top of Powderhorn and Sunshine Bowl; "for the best viewing experience, visit our YouTube channel" — [solitudemountain.com webcams](https://www.solitudemountain.com/mountain-and-village/webcams)
- Park City: feeds "update every 5 minutes throughout the day from 6:00AM to 3:55PM" — [parkcitymountain.com mountain cams](https://www.parkcitymountain.com/the-mountain/mountain-conditions/mountain-cams.aspx)
- Deer Valley: Snow Park, Silver Lake, Empire Canyon — [deervalley.com webcams](https://www.deervalley.com/explore-the-mountain/webcams)
- Snowbasin: cams from base to John Paul Lodge (8,819 ft), plus UDOT road-cam links — [snowbasin.com web-cams](https://www.snowbasin.com/the-mountain/web-cams/)
- Powder Mountain: webcams page with a live feed and a Lightning Ridge cam — [living.powdermountain.com webcams](https://www.living.powdermountain.com/resort/the-mountain/conditions/webcams)
- Sundance: Bearclaw Summit, Sundance Base, Mandan Summit, Snow Stake — [sundanceresort.com webcams](http://www.sundanceresort.com/webcams/) (indexed as HTTP)
- Brian Head: combined webcams/weather/snow page — [brianhead.com weather-conditions-webcams](https://www.brianhead.com/weather-conditions-webcams/)
- Jackson Hole: "real-time views from the base to the top of Rendezvous Mountain"; a separate cams subdomain hosts the mountain report — [jacksonhole.com live mountain cams](https://www.jacksonhole.com/live-mountain-cams); [cams.jacksonhole.com mountain report](https://cams.jacksonhole.com/mountain-report); Mountain Collective lists a Cody Bowl cam — [OnTheSnow](https://www.onthesnow.com/mountain-collective/webcams)
- Grand Targhee: Dreamcatcher, Summit, Plaza, Stick of Truth (cleared 9:00 am daily); "for more information about these cams please visit seeJH.com", which shows YouTube thumbnails — [grandtarghee.com webcams](https://www.grandtarghee.com/the-mountain/cams-conditions/webcams); [sportsmansparadiseonline Targhee cams](https://sportsmansparadiseonline.com/grand-targhee-resort-ski-cam/); See Jackson Hole streams on YouTube — [youtube.com/@Seejh/streams](https://www.youtube.com/@Seejh/streams); [seejh.ai live](https://seejh.ai/live/)
- Third-party 24/7 YouTube restreams: "Colorado Live Cams" lists Arapahoe Basin, Keystone and Winter Park among its views — [youtube.com/@ColoradoLiveCams](https://www.youtube.com/@ColoradoLiveCams) (channel id UCos7NZG5vxtRGtuAJeweKag — [channel](https://www.youtube.com/channel/UCos7NZG5vxtRGtuAJeweKag)); "Ultimate Colorado Webcam Tour" — [YouTube ecMsbHZJLfY](https://www.youtube.com/watch?v=ecMsbHZJLfY)
- Aggregator pages (link-only fallbacks): [Ski Utah webcams](https://www.skiutah.com/resorts/webcams); [Visit Salt Lake webcams](https://www.visitsaltlake.com/things-to-do/skiing-snowboarding/webcams/); [OnTheSnow Colorado](https://www.onthesnow.com/colorado/webcams), [OnTheSnow Utah](https://www.onthesnow.com/utah/webcams); [Epic Mountain Express resort cams](https://www.epicmountainexpress.com/mountain-cams); [Summit Daily mountain cams](https://www.summitdaily.com/sports/webcams/); [Steamboat Pilot cams](https://www.steamboatpilot.com/webcams/); [Jackson Hole Chamber webcams](https://www.jacksonholechamber.com/plan-your-visit/webcams/); [skicamslive.com](https://skicamslive.com/) (claims 8 Aspen, 7 Copper, 5 WP, 3 Eldora, 8 Steamboat, 9 Deer Valley, 7 Park City, 7 Snowbasin, 3 Sundance, 4 Brian Head cams)
- Provider background: Prism built resort web cams "for pulling real-time images" and the interview says Prism "is back as Archr" — [slopefillers.com](https://www.slopefillers.com/violet-resort-wecam/); note that `prismlive.com` is an unrelated streaming app — [PRISM Live FAQ](https://prismlive.com/en_us/faq/faq.html?app=tab1)

#### Reference table — Resorts

| location | provider | embeddable URL (type) | official page | status / notes |
|---|---|---|---|---|
| Arapahoe Basin | resort-hosted stills (~5 min) | not found | https://www.arapahoebasin.com/mountain-cams/ | Page [confirmed]; no direct JPEG/YouTube id found. Third-party 24/7 restream on @ColoradoLiveCams (link). |
| Loveland | resort-hosted stills | not found | https://skiloveland.com/webcams/ | Page [confirmed]; 5 cams. |
| Keystone | Vail Resorts stills (5-min cadence per sibling sites) | not found | https://www.keystoneresort.com/the-mountain/mountain-conditions/mountain-cams.aspx | Page [confirmed]. |
| Breckenridge | Vail Resorts stills, 6:00–15:55 | not found | https://www.breckenridge.com/the-mountain/mountain-conditions/mountain-cams.aspx | Page [confirmed]. |
| Copper Mountain | resort-hosted ("HD Cam" pages) | not found | https://www.coppercolorado.com/the-mountain/webcams/super-bee-hd-cam/ (index https://www.coppercolorado.com/the-mountain/webcams/ [inferred]) | Individual cam pages [confirmed]. |
| Vail | Vail Resorts stills | not found | https://www.vail.com/the-mountain/mountain-conditions/mountain-cams.aspx | Page [confirmed]. |
| Beaver Creek | Vail Resorts stills | not found | https://www.beavercreek.com/the-mountain/mountain-conditions/mountain-cams.aspx | Page [confirmed]. |
| Winter Park | Alterra resort-hosted | not found | https://www.winterparkresort.com/the-mountain/mountain-cams | Page [confirmed]. |
| Eldora | unknown | not found | not found (likely under eldora.com) | No eldora.com page surfaced; third-party says 3 cams incl. snow stake cleared 4:30 pm. |
| Steamboat | Alterra resort-hosted | not found | https://www.steamboat.com/the-mountain/live-cams | Page [confirmed]; per-cam pages like /christie-cam. |
| Aspen Snowmass | Roundshot panoramas + stills (10-min snow stake) | Roundshot iframe would be `https://<resort>.roundshot.com/...` [inferred, unverified] | https://www.aspensnowmass.com/four-mountains/mountain-cams | Page [confirmed]; Roundshot named. Roundshot iframe embed codes are generated in the customer CMS and are "not protected" once visible in page source (see Q4). |
| Crested Butte | Vail Resorts stills (5 min) | not found | https://www.skicb.com/the-mountain/mountain-conditions/mountain-cams.aspx | Page [confirmed]. |
| Monarch | unknown | not found | not found (skimonarch.com not surfaced) | OnTheSnow lists "Sun Deck Cam"; third party says 2 mountain + 2 snow-stake cams. |
| Wolf Creek | resort-hosted, described as "stream" by OnTheSnow | not found | https://wolfcreekski.com/webcams/ | Page [confirmed]; 3 feeds (2 base, 1 near summit). |
| Purgatory | resort-hosted | not found | https://www.purgatory.ski/mountain/mountain-webcams/ | Page [confirmed] (also /mountaincams). |
| Telluride | panoramic (provider not named) | not found | https://tellurideskiresort.com/webcams/ | Page [confirmed]. |
| Silverton | none found | none | https://silvertonmountain.com/ (no cam page found) | Directory reports no cams. |
| Taos | resort-hosted | not found | https://www.skitaos.com/weather | Page [confirmed]; Mountain Collective "Base" cam. |
| Alta | unknown | not found | https://opensnow.com/location/alta-ut-us/cams (link-only; alta.com page not found) | No alta.com URL surfaced in search. |
| Snowbird | resort-hosted incl. "Hidden Peak 360" | not found | https://www.snowbird.com/the-mountain/webcams/view-all-webcams/ | Page [confirmed]; per-cam pages exist. |
| Brighton | resort-hosted stills ("every few minutes") | not found | https://help.brightonresort.com/s/article/Live-Cameras | Help article [confirmed]; Molly Greens cam. |
| Solitude | YouTube live | `https://www.youtube.com/embed/<id>` — id not found | https://www.solitudemountain.com/mountain-and-village/webcams | Page [confirmed]; resort says watch on its YouTube channel; channel/video id not found. |
| Park City | Vail Resorts stills (5 min, 6:00–15:55) | not found | https://www.parkcitymountain.com/the-mountain/mountain-conditions/mountain-cams.aspx | Page [confirmed]. |
| Deer Valley | Alterra resort-hosted | not found | https://www.deervalley.com/explore-the-mountain/webcams | Page [confirmed]. |
| Snowbasin | resort-hosted + UDOT links | not found | https://www.snowbasin.com/the-mountain/web-cams/ | Page [confirmed]. |
| Powder Mountain | resort-hosted | not found | https://www.living.powdermountain.com/resort/the-mountain/conditions/webcams | Page [confirmed] (note unusual `living.` subdomain). |
| Sundance | resort-hosted | not found | http://www.sundanceresort.com/webcams/ | Page [confirmed] but indexed as HTTP — check for HTTPS before embedding. |
| Brian Head | resort-hosted | not found | https://www.brianhead.com/weather-conditions-webcams/ | Page [confirmed]. |
| Jackson Hole | resort-hosted (cams.jacksonhole.com) | not found | https://www.jacksonhole.com/live-mountain-cams | Page [confirmed]; `cams.jacksonhole.com` subdomain [confirmed]. |
| Grand Targhee | YouTube via SeeJH | `https://www.youtube.com/embed/<id>` — ids not found | https://www.grandtarghee.com/the-mountain/cams-conditions/webcams | Page [confirmed]; SeeJH YouTube streams [confirmed] but video ids not exposed in search. |

### Inferences
- Vail Resorts properties (Vail, Beaver Creek, Breckenridge, Keystone, Crested Butte, Park City) all share the `/the-mountain/mountain-conditions/mountain-cams.aspx` path and a 5-minute, 6:00–15:55 refresh cadence, so they almost certainly share one image backend; inspecting one page's `<img src>` will reveal the pattern for all six.
- YouTube embeds (`/embed/<id>`) are the only stream type that is reliably embeddable without permission from the operator; Solitude and Targhee/SeeJH are the only resorts in scope with confirmed YouTube live cams.
- Resort-hosted stills on Alterra/Vail/independent sites are not documented as hotlink-protected, but none of the sites publish a policy, so assume images may be referer-checked and test.

### Gaps
- No YouTube video IDs, Roundshot embed URLs, or direct JPEG URLs for any resort were exposed by search results; obtaining them requires opening each official page.
- Official pages not found: Eldora, Monarch, Silverton, Alta (search returned only aggregators).
- No resort publishes an embed/hotlink policy that search could find.

---

## Key question 4 — Other public cam sources (NWS/NOAA, SNOTEL, CAIC, Alta Guard/UDOT avalanche, universities, OpenSnow, Windy)

### Takeaway
Of the aggregator/agency sources asked about, only Windy has documented embed terms (allowed via the Share-button widget with a visible, clickable Windy credit), WYDOT explicitly forbids image hotlinks, and Roundshot documents that its iframe embeds are unprotected; I found no public camera feeds from NWS, SNOTEL, CAIC's public site, an "Alta Guard" cam, or Storm Peak Lab.

### Cited Findings
- Windy webcams API terms: the user "must at all times explicitly state in a visible manner that the Provider is the source of the Webcams", each image "should link to the webcam page or timelapse player", free tier is low-resolution — [Windy Webcams API terms](https://api.windy.com/webcams/terms); [Windy API webcams terms of use](https://account.windy.com/agreements/windy-api-webcams-terms-of-use); [Windy webcam services terms](https://account.windy.com/agreements/webcams-terms-of-use)
- Windy general terms exempt "the Windy embeddable widget" from the no-redistribution rule; community: "The Windy logo must be present and clickable" and widgets may not be used by weather apps; webcam embed code is reached from the Share button on a webcam's page — [Windy general terms](https://account.windy.com/agreements/windy-terms-of-use); [Windy community: embed webcam](https://community.windy.com/topic/17737/embed-webcam); [Windy community: attribution](https://community.windy.com/topic/42774/webcams-attribution); [Windy community: widget in application](https://community.windy.com/topic/12273/using-windy-widget-in-application)
- Roundshot: the CMS "Share" section generates "animated thumbnails in html/java, iframes, overview maps as well as direct links to images"; thumbnail/direct-link codes include a random key, iframe codes do not and "are not protected"; codes are only available in the customer CMS — [Roundshot Livecam CMS tutorial (PDF)](https://www.roundshot.com/public/upload/assets/2768/Roundshot_Livecam_CMS_Tutorial_English.pdf?fp=2); [Roundshot Livecam service conditions (PDF)](https://www.roundshot.com/public/upload/assets/2713/Livecam-service-conditions.pdf?fp=1)
- WYDOT: official I-80 camera list (Summit, Summit East, Laramie, Vedauwoo) — [wyoroad.info I-80 cameras](https://www.wyoroad.info/Highway/webcameras/all?route=I80Cameras); Laramie tourism says "WYDOT no longer allows image hotlinks due to bandwidth issues" and lists a Snowy Range Ski Area cam — [visitlaramie.org webcams](https://www.visitlaramie.org/plan-your-visit/webcams/); third-party WYDOT map — [wasatchroads.com WYDOT](https://wasatchroads.com/wydot-cameras)
- CAIC: public weather-station map is described as station data, with no camera mention — [CAIC weather station map help](https://avalanche.state.co.us/forecasts/help/weather-station-map-help); CAIC's internal bookmark pages list "Cameron Pass snow stake cam", "Cameron Pass Wx cam" and a "CAIC Web Cams" page — [caic.mtnweather.info](http://caic.mtnweather.info/) (HTTP, internal-looking); [CAIC monitor](http://caic.mtnweather.info/monitor/)
- Storm Peak Lab (U. of Utah, Steamboat): no live camera found; a 2000s archive page linked a cam at fsvisimages.com; current site is stormpeak.utah.edu; facility "not open to the public" — [UCAR RACCOON SPL site info](https://archive.eol.ucar.edu/homes/stephens/RACCOON/SPLsite.html); [DRI Storm Peak page (has a "Web cam" link)](https://wrcc.dri.edu/weather/strm.html); [U of U Storm Peak Lab](https://atmos.utah.edu/storm_peak_lab/index.php); Windfinder's "Storm Peak Observatory" cam is the ski resort ~5 km away — [windfinder](https://es.windfinder.com/webcams/storm_peak_observatory)
- University of Utah: Pointer real-time cams page republishes UDOT valley cams — [forecast.utah.edu cams](https://forecast.utah.edu/pointer/real-time/cams.html); a "University of Utah" campus cam is on Ventusky — [ventusky webcam 528204810](https://www.ventusky.com/webcam-528204810)
- SNOTEL: NRCS describes stations as measuring snow depth, SWE, precip, temperature and soil data; no camera feed — [NRCS Utah: what is a SNOTEL station](https://www.nrcs.usda.gov/state-offices/utah/what-is-a-snotel-station); [NRCS snow survey program](https://www.nrcs.usda.gov/programs-initiatives/sswsf-snow-survey-and-water-supply-forecasting-program)
- Utah Avalanche Center mountain weather pages exist (Logan) but no cams were shown in results — [utahavalanchecenter.org Logan](https://utahavalanchecenter.org/mountain-weather/logan)
- OpenSnow cam pages exist per location (e.g. Snowbird, Vail, Breckenridge, A-Basin, Berthoud) and list "live mountain cams, highway cams, and a snow stake cam"; indexed ~500 days ago; no embed terms found — [OpenSnow Snowbird cams](https://opensnow.com/location/snowbird/cams); [OpenSnow Vail cams](https://opensnow.com/location/vail/cams); [OpenSnow Breckenridge](https://opensnow.com/location/breckenridge/cams); [OpenSnow A-Basin](https://opensnow.com/location/arapahoebasin/cams)
- Open-data camera registries / HA integrations: a sources registry with per-state uptime — [bzsasson/traffic-camera-sources](https://github.com/bzsasson/traffic-camera-sources); an HA integration that shows only a link (never an image) for "cameras whose agency only allows linking" — [bzsasson/livetrafficcam-homeassistant](https://github.com/bzsasson/livetrafficcam-homeassistant); 511 HA integration — [ihavespoken327/ha-the511](https://github.com/ihavespoken327/ha-the511); multi-state 511 normalizer with free key — [road511 on DEV](https://dev.to/road511/how-i-normalized-30-different-511-traffic-apis-into-one-rest-endpoint-3cl9)
- Other mirrors of CDOT/UDOT cams (link-only): [coloradowebcam.net](https://www.coloradowebcam.net/); [trafficvision.live](https://trafficvision.live/blog/eisenhower-tunnel-traffic-cameras); [connorontheweb.com Utah map](https://connorontheweb.com/map/utah); [CBS Colorado cams](https://www.cbsnews.com/colorado/cams/); [utah-cams.com](https://www.utah-cams.com/); [utahagenda.com webcams](https://utahagenda.com/utah-webcams/)

#### Reference table — Other sources

| location / source | provider | embeddable URL (type) | official page | status / notes |
|---|---|---|---|---|
| Berthoud Pass (US-40 MP 243 WB) via Ventusky | CDOT image on cocam.carsprogram.org, listed by Ventusky | not found | https://www.ventusky.com/webcam-393467625 | Listing [confirmed]; Ventusky/Windy-style listings require their own embed widget and attribution. |
| Berthoud Pass summit + parking lot | Preserve Rollins Pass (hosts/links cams) | not found | https://www.preserverollinspass.org/resources/rollins-pass-weather/ | Page [confirmed]; cam host unknown. |
| Windy webcams (any CO/UT cam) | Windy (webcams.windy.com) | Share-button iframe widget (iframe) — URL generated per cam | https://api.windy.com/webcams/terms | Allowed with visible, clickable Windy credit; not for "weather apps"; API free tier low-res. |
| Roundshot panoramas (Aspen Highlands etc.) | Roundshot | iframe code from operator CMS (iframe) | https://www.roundshot.com/ | iframe embeds "not protected" but are the resort's codes; thumbnails/direct image links carry a random key. |
| WYDOT I-80 Summit / Laramie / Vedauwoo | WYDOT | none — hotlinking disallowed | https://www.wyoroad.info/Highway/webcameras/all?route=I80Cameras | Link only; WYDOT "no longer allows image hotlinks". |
| Snowy Range Ski Area (WY) | resort | not found | https://www.visitlaramie.org/plan-your-visit/webcams/ | Mentioned only. |
| CAIC cameras (Cameron Pass snow stake / Wx cam) | CAIC (internal) | not found | http://caic.mtnweather.info/ | Internal bookmark pages, HTTP; no public cam page found on avalanche.state.co.us. |
| Storm Peak Lab (Steamboat) | U. of Utah | not found | https://atmos.utah.edu/storm_peak_lab/index.php | No live cam confirmed; old fsvisimages link likely dead. |
| Alta Guard / UDOT avalanche cam | UDOT / Alta | not found | https://cottonwoodcanyons.udot.utah.gov/ | No "Alta Guard" camera appeared in any result. |
| University of Utah Pointer cams | U. of Utah (UDOT images) | not found | https://forecast.utah.edu/pointer/real-time/cams.html | Salt Lake Valley cams; link only. |
| NWS / NOAA webcams | — | none found | — | No NWS webcam source for these regions surfaced. |
| SNOTEL / NRCS cameras | — | none | https://www.nrcs.usda.gov/state-offices/utah/what-is-a-snotel-station | SNOTEL stations are sensor-only per NRCS. |
| OpenSnow cam pages | OpenSnow (aggregator) | link only | https://opensnow.com/location/<slug>/cams | Per instructions, link only; no embed terms found. |
| Ski Utah / Visit Salt Lake / OnTheSnow / Summit Daily | aggregators | link only | see Cited Findings | Convenient per-region fallbacks. |

### Inferences
- Windy's rules (credit + link, widget via Share button) are the only clearly-permitted third-party embed route for highway cams that otherwise lack a documented policy; the CDOT Berthoud cam listed on Ventusky suggests the same cam is probably on Windy/webcams.travel and could be embedded that way with attribution.
- Given WYDOT's explicit hotlink ban and the general lack of published policies at CDOT/UDOT, the safest design is `<img>` from CDOT/UDOT with a visible "Source: COtrip / UDOT Traffic" caption linking to the official page, and link-outs for WYDOT.

### Gaps
- No public NWS/NOAA, SNOTEL, CAIC, Alta Guard, or Storm Peak Lab camera URL was found.
- Windy webcam IDs for specific CO/UT cams were not retrieved.

---

## Key question 5 — Legal / technical notes (hotlinking, attribution, HTTPS, refresh intervals)

### Takeaway
Documented positions: WYDOT bans image hotlinks; Windy allows widget embeds with a visible, clickable credit; Roundshot iframes are embeddable once the operator exposes them; CDOT, UDOT and all resorts publish no hotlink/embed policy that search could find. All CDOT/UDOT/resort pages found are HTTPS except Sundance's webcam page (indexed as HTTP) and the legacy `http://www.cotrip.org/images/camera?...` links; typical refresh is ~1 min (UDOT), 45 s–5 min (CDOT per third parties), 5 min (Vail Resorts, A-Basin, Crested Butte), 10 min (Aspen snow stake), "every few minutes" (Brighton).

### Cited Findings
- Hotlink ban: "WYDOT no longer allows image hotlinks due to bandwidth issues" — [visitlaramie.org](https://www.visitlaramie.org/plan-your-visit/webcams/)
- Hotlink mechanics: Cloudflare Hotlink Protection "denies access to requests when the HTTP referer does not include your website domain name (and is not blank)" — [Cloudflare docs](https://developers.cloudflare.com/waf/tools/scrape-shield/hotlink-protection/). (Implication: `<img referrerpolicy="no-referrer">` can pass referer-based checks that allow blank referers.)
- Mixed content: when an image is HTTP on an HTTPS page, "Chrome will attempt to load it in https only. If that fails, the image will be blocked" — [Oracle Eloqua note on Chrome mixed content](https://docs.oracle.com/en/cloud/saas/marketing/eloqua-user/Help/General/ChromeMixedContent.htm); background on enabling mixed content — [Adobe](https://experienceleague.adobe.com/docs/target/using/experiences/vec/troubleshoot-composer/mixed-content.html?lang=hi)
- Windy attribution and widget rules (credit + link, logo clickable, free tier low-res) — [Windy API webcams terms](https://api.windy.com/webcams/terms); [Windy community attribution thread](https://community.windy.com/topic/42774/webcams-attribution)
- Roundshot iframe codes "are not protected" and "embedding codes are visible in public" once on a page — [Roundshot CMS tutorial PDF](https://www.roundshot.com/public/upload/assets/2768/Roundshot_Livecam_CMS_Tutorial_English.pdf?fp=2)
- HA integration treats some agencies as "link only" (never an image) — [bzsasson/livetrafficcam-homeassistant](https://github.com/bzsasson/livetrafficcam-homeassistant)
- Refresh intervals: UDOT ~1 min snapshots — [canyon-watch](https://github.com/medley/canyon-watch); UDOT "every minute or two" — [wasatchroads](https://wasatchroads.com/udot-cameras); CDOT tunnel cams "every 45 seconds" (third party) — [trafficvision.live](https://trafficvision.live/blog/eisenhower-tunnel-traffic-cameras); A-Basin ~5 min — [arapahoebasin.com](https://www.arapahoebasin.com/mountain-cams/); Park City 5 min, 06:00–15:55 — [parkcitymountain.com](https://www.parkcitymountain.com/the-mountain/mountain-conditions/mountain-cams.aspx); Breckenridge 6 a.m.–3:55 p.m. — [breckenridge.com](https://www.breckenridge.com/the-mountain/mountain-conditions/mountain-cams.aspx); Crested Butte 5 min — [skicb.com](https://www.skicb.com/the-mountain/mountain-conditions/mountain-cams.aspx); Aspen Buttermilk snow stake 10 min sunrise–sunset — [aspensnowmass.com](https://www.aspensnowmass.com/four-mountains/buttermilk/mountain-cams); Brighton "every few minutes" — [help.brightonresort.com](https://help.brightonresort.com/s/article/Live-Cameras); UDOT cams "may temporarily go offline periodically" — [UDOT Cottonwood Canyons](https://cottonwoodcanyons.udot.utah.gov/road-information/)
- API rate limits: UDOT key 10 calls/60 s (third-party reports) — [slopeinsights issue #2](https://github.com/informaswan/slopeinsights/issues/2); CDOT key by email request — [slopeinsights issue #1](https://github.com/informaswan/slopeinsights/issues/1)
- HTTPS status: all cotrip.org `dimages` examples and the udottraffic.utah.gov `map/Cctv` pattern are indexed as HTTPS (see Q1/Q2 sources); the legacy CDOT list uses `http://` — [CDOT archived links](https://www.codot.gov/projects/archived-project-sites/i70twintunnels/links-to-cotrip-cameras); Sundance's webcam page is indexed as `http://www.sundanceresort.com/webcams/` — [sundanceresort.com](http://www.sundanceresort.com/webcams/)

### Inferences
- For a 60 s `<img>` refresh, UDOT's ~1-min cadence matches well; CDOT and resort stills change every 45 s–10 min, so refreshing every 60 s wastes bandwidth on most resort cams without harm. Appending a cache-buster (`?t=<epoch>` or COtrip's observed `&v=`) is needed because the URLs are otherwise stable.
- A visible "Image: COtrip (CDOT)" / "UDOT Traffic" caption with a link to the official page is prudent even though neither agency publishes an attribution requirement, and it mirrors what every mirror site found (coloradowebcam.net, wasatchroads.com, trafficvision.live) does.
- If a resort image fails with 403 on the HTTPS host, try `referrerpolicy="no-referrer"` first (Cloudflare-style protection allows blank referers); if it still fails, fall back to linking the official page.

### Gaps
- No explicit CDOT/COtrip or UDOT terms on reuse/hotlinking were found; "allowed" status for those agencies is unverified.
- Whether resort image hosts enforce referer checks could not be tested from search results.
