'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl, { GeoJSONSource, Map } from 'maplibre-gl';
import * as turf from '@turf/turf';
import 'maplibre-gl/dist/maplibre-gl.css';

type Tool = 'select' | 'point' | 'line' | 'polygon' | 'buffer' | 'fixed-box';

const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

export default function MapWorkspace() {
  const container = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [tool, setTool] = useState<Tool>('select');
  const [points, setPoints] = useState<[number, number][]>([]);
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [unit, setUnit] = useState<'kilometers' | 'meters'>('kilometers');
  const [bufferRadius, setBufferRadius] = useState(5);

  const addFeature = (feature: GeoJSON.Feature) => {
    const map = mapRef.current;
    const source = map?.getSource('drawings') as GeoJSONSource | undefined;
    if (!source) return;
    const current = (source.serialize().data as GeoJSON.FeatureCollection) || EMPTY;
    source.setData({ type: 'FeatureCollection', features: [...(current.features || []), feature] });
  };

  useEffect(() => {
    if (!container.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: container.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [54.3773, 24.4539],
      zoom: 10,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.on('load', () => {
      map.addSource('drawings', { type: 'geojson', data: EMPTY });
      map.addLayer({ id: 'draw-fill', type: 'fill', source: 'drawings', filter: ['==', '$type', 'Polygon'], paint: { 'fill-color': '#22d3ee', 'fill-opacity': 0.14 } });
      map.addLayer({ id: 'draw-line', type: 'line', source: 'drawings', paint: { 'line-color': '#67e8f9', 'line-width': 3 } });
      map.addLayer({ id: 'draw-point', type: 'circle', source: 'drawings', filter: ['==', '$type', 'Point'], paint: { 'circle-radius': 7, 'circle-color': '#fde047', 'circle-stroke-color': '#071421', 'circle-stroke-width': 2 } });
    });
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const click = (e: maplibregl.MapMouseEvent) => {
      const p: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      if (tool === 'point') addFeature(turf.point(p));
      if (tool === 'fixed-box') {
        const kmW = unit === 'meters' ? width / 1000 : width;
        const kmH = unit === 'meters' ? height / 1000 : height;
        const north = turf.destination(p, kmH / 2, 0, { units: 'kilometers' });
        const south = turf.destination(p, kmH / 2, 180, { units: 'kilometers' });
        const nw = turf.destination(north, kmW / 2, 270, { units: 'kilometers' }).geometry.coordinates;
        const ne = turf.destination(north, kmW / 2, 90, { units: 'kilometers' }).geometry.coordinates;
        const se = turf.destination(south, kmW / 2, 90, { units: 'kilometers' }).geometry.coordinates;
        const sw = turf.destination(south, kmW / 2, 270, { units: 'kilometers' }).geometry.coordinates;
        addFeature(turf.polygon([[nw, ne, se, sw, nw]], { kind: 'fixed-size-box', width, height, unit }));
      }
      if (tool === 'buffer') addFeature(turf.buffer(turf.point(p), bufferRadius, { units: 'kilometers' })!);
      if (tool === 'line' || tool === 'polygon') setPoints(prev => [...prev, p]);
    };
    const dbl = (e: maplibregl.MapMouseEvent) => {
      e.preventDefault();
      if (tool === 'line' && points.length >= 1) addFeature(turf.lineString([...points, [e.lngLat.lng, e.lngLat.lat]]));
      if (tool === 'polygon' && points.length >= 2) {
        const ring = [...points, [e.lngLat.lng, e.lngLat.lat] as [number, number]];
        addFeature(turf.polygon([[...ring, ring[0]]]));
      }
      setPoints([]);
    };
    map.on('click', click);
    map.on('dblclick', dbl);
    return () => { map.off('click', click); map.off('dblclick', dbl); };
  }, [tool, points, width, height, unit, bufferRadius]);

  const clear = () => {
    const source = mapRef.current?.getSource('drawings') as GeoJSONSource | undefined;
    source?.setData(EMPTY);
    setPoints([]);
  };

  return <div className="real-map-wrap">
    <div className="map-toolbar">
      {(['select','point','line','polygon','buffer','fixed-box'] as Tool[]).map(t => <button key={t} className={tool === t ? 'selected' : ''} onClick={() => { setTool(t); setPoints([]); }}>{t}</button>)}
      <button onClick={clear}>Clear</button>
    </div>
    <div className="map-options">
      {tool === 'fixed-box' && <><label>W <input type="number" value={width} onChange={e => setWidth(+e.target.value)}/></label><label>H <input type="number" value={height} onChange={e => setHeight(+e.target.value)}/></label><select value={unit} onChange={e => setUnit(e.target.value as 'kilometers'|'meters')}><option value="kilometers">km</option><option value="meters">m</option></select><span>Click map center</span></>}
      {tool === 'buffer' && <label>Buffer km <input type="number" value={bufferRadius} onChange={e => setBufferRadius(+e.target.value)}/></label>}
      {(tool === 'line' || tool === 'polygon') && <span>Click vertices · Double-click to finish</span>}
    </div>
    <div ref={container} className="real-map" />
  </div>;
}
