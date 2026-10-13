# Powder Ledger

Seven-day snow forecasts for 50 mountains across Colorado, Utah, Wyoming and northern New Mexico, with the model data and orographic reasoning behind each number.

The page is a single static file (`index.html`). Open it in a browser and it fetches live model runs from Open-Meteo (ECMWF IFS, GFS, ICON, GEM, HRRR, NBM, AIFS), forecast discussions and gridpoint forecasts from the National Weather Service, and ground truth from USDA SNOTEL stations. No backend, no keys.

- `index.html` – the built page served by GitHub Pages
- `src/` – the source parts (`build.sh` concatenates them into `index.html`)
- `tools/refresh_snapshot.js` – headless data snapshot for hosted copies that cannot call the APIs directly
- `docs/research-report.md` – the research behind the data sources and methods

Data: Open-Meteo (CC BY 4.0), NOAA/NWS, USDA NRCS. Forecasts beyond day 3 are low-confidence by nature; read the model spread, not the point value.
