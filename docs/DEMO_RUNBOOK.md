# TACTICA AI — Presentation Demo Runbook

## Demo rule
Use synthetic/demo data only. Do not depend on live external feeds during the presentation.

## 7-minute presentation flow

### 1. Command Center — 60 sec
Start in Arabic. Explain that TACTICA is one integrated geospatial intelligence platform. Show Smart Alerts, daily priority actions, active cases, source health and QC status. Switch Arabic ↔ English once.

### 2. Map & Explore — 2 min
Open Map & Explore. Demonstrate Point, Line/Polygon and measurement briefly. Select Fixed-Size Box, set 10 × 10 km, rotation 0°, then click the map center. Explain that it is a generic fixed-dimension AOI tool. Demonstrate Buffer and Save AOI if the API/PostGIS stack is running. If backend is unavailable, skip Save AOI and continue with local drawing/export.

### 3. Analysis — 90 sec
Open Intelligence Analysis. Explain Situation Overview, Entities & Relationships, Timeline, Hypotheses & Evidence, Intelligence Gaps, Multi-source Fusion, Intelligence Twin and Counter-Evidence AI. Clearly identify demo/AI-generated hypotheses versus observed facts.

### 4. Smart Guide — 30 sec
Open Smart Guide. Explain that Smart Guide teaches the user how to operate TACTICA while Copilot is reserved for analytical assistance.

### 5. Production — 60 sec
Open Production Center. Show Production Queue, report templates, Quick Product, Period Comparison, Print/PDF, Email and Save Version.

### 6. Quality Check — 60 sec
Open QC. Show QC Score and Data / Imagery / Map / Analysis / Evidence / Report checks. Explain workflow: Draft → Analyst Review → QC → Supervisor Approval → Approved → Published.

### 7. Close — 30 sec
Return to Command Center. Closing message: One Platform → Many Integrated Modules → One Intelligence Picture.

## Pre-demo checklist
- GitHub Actions build is green.
- Browser zoom 90–100%.
- Internet connection available for the MapLibre demo basemap.
- Open application before presentation and allow map tiles to load.
- Keep demo data enabled.
- If backend/PostGIS is not running, do not press Save AOI.
- Do not introduce new code immediately before the presentation.

## Fallback plan
If map tiles fail, continue with Command / Analysis / Production / QC. If backend is unavailable, drawing and GeoJSON export can still demonstrate the map workflow. If any experimental feature is unstable, skip it rather than debugging live.
