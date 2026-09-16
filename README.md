# TACTICA AI

Integrated Intelligent Geospatial Reconnaissance, Analysis & Production Platform.

منصة متكاملة للاستطلاع والتحليل والإنتاج الجغرافي الذكي.

## TACTICA V1

Initial development scope:

- Bilingual Arabic / English interface with RTL/LTR support
- Command Center application shell
- Map & Explore workspace
- Layer management
- Drawing & Measurement
- Point, Line/Polyline, Polygon, Rectangle, Circle
- Buffer
- Fixed-Size Box centered on a selected point with width, height, units and rotation
- AOI management
- Cases and Evidence foundation
- Smart Alerts foundation
- Smart Guide and AI Copilot placeholders
- Production, Reports and Quality Check foundations

## Architecture

The initial web client will use Next.js + TypeScript. Geospatial functionality is designed around MapLibre-compatible web mapping, with later 3D/Digital Twin integration. Backend services will be separated from the web UI and designed for PostgreSQL/PostGIS persistence.

## Development phases

1. Platform shell, design system, Arabic/English and navigation.
2. Interactive map, layers, drawing and measurement.
3. AOI, cases, evidence and data import.
4. Alerts, timelines and period comparison.
5. AI-assisted analysis and Smart Guide.
6. Production, reporting, QC and approval workflows.
7. 3D Digital Twin and advanced geospatial/intelligence modules.
