# TACTICA AI — Platform Architecture

## Product principle
One integrated platform: Collect → Process → Exploit → Analyze → Fuse → Verify → Alert → Produce → QC → Approve → Disseminate → Archive.

## Core modules
1. Command Center — smart alerts, daily priority actions, active missions/cases, data health, recent intelligence, quick reports.
2. Map & Explore — 2D map, layers, AOI, drawing, measurement, coordinates, import/export.
3. Reconnaissance — optical, SAR, terrain, imagery exploitation, multi-date comparison, change detection.
4. Digital Twin — 3D terrain/buildings/assets, synchronized 2D↔3D, temporal comparison.
5. Maritime & Aviation — authorized AIS/ADS-B feeds, tracks, history and anomalies.
6. GNSS Integrity — navigation-integrity indicators, suspected jamming/spoofing anomalies, cross-source verification.
7. Intelligence Analysis — timeline, pattern of life, anomaly detection, link analysis, knowledge graph, hypotheses, gaps and contradictions.
8. Multi-source Fusion — spatial/temporal correlation while retaining source provenance and confidence.
9. Investigation & Evidence — cases, evidence board, analyst notes, provenance, reliability and audit trail.
10. TACTICA AI — copilot, geospatial query, image/change analyst, evidence validator, counter-evidence, report drafting and QC review.
11. Smart Guide — interactive onboarding, contextual help and guided workflows, separate from analytical Copilot.
12. Missions — AOI, collection requirements, tasks, status and mission products.
13. Production Center — production queue, product composer, quick products, imagery/map/intelligence products.
14. Reports — bilingual templates, quick reports, PDF/print/email/export workflow.
15. Quality Check — data, imagery, map, analysis, evidence and report QC with analyst/supervisor approval.
16. Data Management — import/update, source catalog, metadata, health, versioning, backup/restore.
17. Library & Collaboration — approved products, versions, comments and controlled sharing.
18. Administration — users, roles, RBAC, audit, retention, integrations and platform health.

## Map & Geo Tools
Select/Edit, Point, Multi-Point, Line/Polyline, Polygon, Rectangle, Circle, Freehand, Arrow, Text/Label, Buffer, Fixed-Size Box, Distance, Area, Perimeter, Radius/Diameter, Bearing/Azimuth, Coordinates, Elevation and Elevation Profile. Advanced 3D measurement is enabled when suitable 3D/elevation data exists.

### Fixed-Size Box
A generic fixed-dimension AOI tool centered on a selected point. Inputs: center, width, height, meters/kilometers, rotation and show-dimensions. Supports edit/move/rotate, save as layer/AOI, add to case/evidence and GeoJSON/KML export.

## Intelligence Twin
A living AOI intelligence twin stores observations and changes over time, distinguishes Observed Facts / AI Hypotheses / Intelligence Gaps, supports historical intelligence-time views, evidence graph and counter-evidence review.

## Data model
Organizations, Users, Roles, Projects, Missions, Cases, AOIs, Assets, DataSources, Datasets, Layers, Features, Observations, Detections, Events, Alerts, Evidence, Findings, Hypotheses, Analyses, AIRuns, Reports, Products, ProductVersions, QCChecks, QCIssues, Approvals, AuditLogs, Backups.

## Traceability rule
Every analytical finding must be traceable: Finding → Evidence → Dataset → Source → Time → Location → Analysis/Model → Reviewer.

## Languages
Arabic and English are first-class. Arabic uses RTL and English LTR. UI, alerts, guide, Copilot, templates and products support either language or bilingual output.

## Security baseline
Authentication, RBAC, least privilege, audit logs, encryption in transit/at rest, backup/restore, version history, data classification labels and controlled dissemination. Development uses demo/synthetic/non-sensitive data until production security controls are validated.
