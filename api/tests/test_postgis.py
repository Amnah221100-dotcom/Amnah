"""HTTP/database regression tests; use only a dedicated PostGIS test database."""
import os
from pathlib import Path
import unittest
from unittest.mock import patch
from uuid import uuid4

import psycopg
from psycopg import sql
from psycopg.rows import dict_row
from fastapi.testclient import TestClient
from psycopg_pool import AsyncConnectionPool

from api import main


TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")
POLYGON = {
    "type": "Polygon",
    "coordinates": [[[54.3, 24.4], [54.4, 24.4], [54.4, 24.5], [54.3, 24.4]]],
}
JSON_VALUES = {
    "label": "منطقة O'Brien \"A\"",
    "path": "folder\\file\nnext",
    "enabled": True,
    "missing": None,
    "nested": {"values": [False, None, 2.5, "عربي"]},
}


@unittest.skipUnless(TEST_DATABASE_URL, "Set TEST_DATABASE_URL to a dedicated PostGIS database")
class PostGISTests(unittest.TestCase):
    def setUp(self):
        # Every test gets its own schema; never truncate application tables.
        self.schema = "test_tactica_" + uuid4().hex
        self.db = psycopg.connect(TEST_DATABASE_URL, autocommit=True, row_factory=dict_row)
        self.addCleanup(self.db.close)
        self.db.execute("CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public")
        self.db.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public")
        self.db.execute(sql.SQL("CREATE SCHEMA {}").format(sql.Identifier(self.schema)))
        self.addCleanup(self.drop_schema)
        self.db.execute(sql.SQL("SET search_path TO {}, public").format(sql.Identifier(self.schema)))
        schema = Path(__file__).resolve().parents[2] / "database" / "schema.sql"
        self.db.execute(schema.read_text())
        # Reuse the application's row factory, so reverting its fix breaks these tests.
        test_pool = AsyncConnectionPool(
            TEST_DATABASE_URL,
            kwargs={**main.pool.kwargs, "options": f"-csearch_path={self.schema},public"},
            open=False,
            timeout=5,
        )
        self.enterContext(patch.object(main, "pool", test_pool))
        self.client = self.enterContext(TestClient(main.app))

    def drop_schema(self):
        self.db.execute(sql.SQL("DROP SCHEMA {} CASCADE").format(sql.Identifier(self.schema)))

    def create_case(self):
        response = self.client.post("/api/v1/cases", json={"title": "اختبار O'Brien", "classification": "demo"})
        self.assertEqual(response.status_code, 201, response.text)
        return response.json()

    def test_cases_create_and_list(self):
        case = self.create_case()
        self.assertEqual(case["status"], "active")
        self.assertEqual(case["title"], "اختبار O'Brien")
        self.assertEqual(case["classification"], "demo")
        self.assertTrue(case["created_at"])
        response = self.client.get("/api/v1/cases")
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json(), [case])

    def test_map_aoi_create_and_retrieve(self):
        # Same request shape as MapWorkspace.saveAOI: no case_id.
        payload = {"name": "AOI-map", "geometry": POLYGON, "properties": {"source": "TACTICA Map"}}
        response = self.client.post("/api/v1/aois", json=payload)
        self.assertEqual(response.status_code, 201, response.text)
        created = response.json()
        self.assertEqual(created["geometry"], POLYGON)
        self.assertEqual(created["properties"], payload["properties"])
        response = self.client.get("/api/v1/aois")
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json(), [{**created, "case_id": None}])
        row = self.db.execute("SELECT ST_SRID(geometry) AS srid FROM aois WHERE id=%s", (created["id"],)).fetchone()
        self.assertEqual(row["srid"], 4326)

    def test_aoi_json_round_trip_and_case_filter(self):
        case = self.create_case()
        # Valid GeoJSON foreign members exercise JSON escaping, booleans and null.
        geometry = {**POLYGON, "test_metadata": JSON_VALUES}
        response = self.client.post("/api/v1/aois", json={
            "case_id": case["id"], "name": "منطقة O'Brien", "geometry": geometry, "properties": JSON_VALUES,
        })
        self.assertEqual(response.status_code, 201, response.text)
        created = response.json()
        self.assertEqual(created["geometry"], POLYGON)
        self.assertEqual(created["properties"], JSON_VALUES)
        response = self.client.get("/api/v1/aois", params={"case_id": case["id"]})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json(), [{**created, "case_id": case["id"]}])
        self.assertEqual(self.client.get("/api/v1/aois", params={"case_id": str(uuid4())}).json(), [])

    def test_aoi_default_properties(self):
        response = self.client.post("/api/v1/aois", json={"name": "defaults", "geometry": POLYGON})
        self.assertEqual(response.status_code, 201, response.text)
        self.assertEqual(response.json()["properties"], {})

    def test_evidence_with_and_without_geometry(self):
        case = self.create_case()
        for geometry in (POLYGON, None):
            with self.subTest(geometry=geometry):
                payload = {"case_id": case["id"], "title": "دليل", "metadata": JSON_VALUES}
                if geometry is not None:
                    payload["geometry"] = {**geometry, "test_metadata": JSON_VALUES}
                response = self.client.post("/api/v1/evidence", json=payload)
                self.assertEqual(response.status_code, 201, response.text)
                row = self.db.execute(
                    "SELECT ST_AsGeoJSON(geometry)::json AS geometry, ST_SRID(geometry) AS srid, metadata FROM evidence WHERE id=%s",
                    (response.json()["id"],),
                ).fetchone()
                self.assertEqual(row["geometry"], geometry)
                self.assertEqual(row["metadata"], JSON_VALUES)
                self.assertEqual(row["srid"], None if geometry is None else 4326)
        response = self.client.post("/api/v1/evidence", json={"case_id": case["id"], "title": "defaults", "geometry": None})
        self.assertEqual(response.status_code, 201, response.text)
        row = self.db.execute("SELECT metadata, geometry FROM evidence WHERE id=%s", (response.json()["id"],)).fetchone()
        self.assertEqual(row, {"metadata": {}, "geometry": None})

    def test_alerts_list_and_filter(self):
        case = self.create_case()
        self.db.execute("INSERT INTO alerts(case_id,alert_type,severity,confidence,reason) VALUES(%s,'demo','low',0.75,'test')", (case["id"],))
        for params in ({}, {"case_id": case["id"]}):
            response = self.client.get("/api/v1/alerts", params=params)
            self.assertEqual(response.status_code, 200, response.text)
            self.assertEqual(len(response.json()), 1)
            self.assertEqual(response.json()[0]["case_id"], case["id"])
            self.assertEqual(response.json()[0]["reason"], "test")
        self.assertEqual(self.client.get("/api/v1/alerts", params={"case_id": str(uuid4())}).json(), [])

    def test_qc_checks_and_missing_product(self):
        product_id = self.db.execute("INSERT INTO products(product_type) VALUES('demo') RETURNING id").fetchone()["id"]
        self.db.execute("INSERT INTO qc_checks(product_id,domain,rule_key,status,message) VALUES(%s,'data','demo','passed','ok')", (product_id,))
        response = self.client.get(f"/api/v1/qc/{product_id}")
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["product_id"], str(product_id))
        self.assertEqual(response.json()["checks"][0]["status"], "passed")
        self.assertEqual(self.client.get(f"/api/v1/qc/{uuid4()}").status_code, 404)


if __name__ == "__main__":
    unittest.main()
