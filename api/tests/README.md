# API/PostGIS regression tests

From the repository root, install `api/requirements-test.txt` into a Python 3.12
virtual environment, then run:

```sh
export TEST_DATABASE_URL=postgresql://tactica:tactica@localhost:5433/tactica_test
python -m unittest discover -s api/tests -v
```

Use a dedicated test database. For example, start a disposable PostGIS instance:

```sh
docker run --rm -d --name tactica-postgis-test \
  -e POSTGRES_USER=tactica -e POSTGRES_PASSWORD=tactica \
  -e POSTGRES_DB=tactica_test -p 5433:5432 postgis/postgis:17-3.5
docker exec tactica-postgis-test pg_isready -U tactica -d tactica_test
```

Wait until `pg_isready` reports that connections are accepted before running tests.
Stop it afterward with `docker stop tactica-postgis-test`.

The suite uses the real API routes, Psycopg adapters and PostGIS functions. Each
test creates a uniquely named schema from `database/schema.sql` and drops it in
cleanup. The database user must be able to create schemas and install PostGIS
and pgcrypto extensions. No existing application tables are truncated. If
`TEST_DATABASE_URL` is absent, the integration tests are explicitly skipped;
a skipped run is not a successful database verification.

Coverage includes the map's no-case AOI save payload, create/list round trips,
case filtering, SRID 4326, nested JSON values and Arabic/quoted strings,
evidence with omitted/null/populated geometry, cases, alerts, and QC/404 responses.
GitHub Actions runs the suite against PostgreSQL 17 / PostGIS 3.5.

For a browser smoke check, start the existing app/API stack, draw a polygon,
click **Save AOI**, and confirm it appears in `GET /api/v1/aois`. Then exercise
Undo, Clear and GeoJSON export as described in `docs/DEMO_RUNBOOK.md`.
