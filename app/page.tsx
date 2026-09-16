'use client';

import { useState } from 'react';

const tools = ['Select / تحديد', 'Point / نقطة', 'Line / خط', 'Polyline', 'Polygon / مضلع', 'Rectangle', 'Circle', 'Buffer', 'Fixed-Size Box', 'Measure / قياس'];

export default function Home() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [activeTool, setActiveTool] = useState('Select / تحديد');

  return (
    <main className="shell" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="topbar">
        <div className="brand"><span className="mark">T</span><div><b>TACTICA AI</b><small>GEOSPATIAL INTELLIGENCE</small></div></div>
        <nav>
          <button className="active">{lang === 'ar' ? 'الخريطة والاستكشاف' : 'Map & Explore'}</button>
          <button>{lang === 'ar' ? 'الاستطلاع' : 'Reconnaissance'}</button>
          <button>{lang === 'ar' ? 'التحليل' : 'Analysis'}</button>
          <button>{lang === 'ar' ? 'الإنتاج' : 'Production'}</button>
          <button>QC</button>
        </nav>
        <div className="top-actions">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>{lang === 'ar' ? 'English' : 'العربية'}</button>
          <button>✦ {lang === 'ar' ? 'المرشد الذكي' : 'Smart Guide'}</button>
          <button>🔔</button>
        </div>
      </header>

      <section className="workspace">
        <aside className="panel tools">
          <h3>{lang === 'ar' ? 'الرسم والقياس' : 'Drawing & Measurement'}</h3>
          <div className="toolgrid">
            {tools.map(tool => <button key={tool} className={activeTool === tool ? 'selected' : ''} onClick={() => setActiveTool(tool)}>{tool}</button>)}
          </div>
          <div className="card">
            <b>Fixed-Size Box</b>
            <label>{lang === 'ar' ? 'العرض' : 'Width'}<input defaultValue="10"/><select><option>km</option><option>m</option></select></label>
            <label>{lang === 'ar' ? 'الارتفاع' : 'Height'}<input defaultValue="10"/><select><option>km</option><option>m</option></select></label>
            <label>{lang === 'ar' ? 'الدوران' : 'Rotation'}<input defaultValue="0°"/></label>
            <button className="primary">{lang === 'ar' ? 'إنشاء المنطقة' : 'Create Box'}</button>
          </div>
        </aside>

        <div className="map">
          <div className="map-title"><b>{lang === 'ar' ? 'مساحة العمل الجغرافية' : 'Geospatial Workspace'}</b><span>2D | 3D | 2D+3D</span></div>
          <div className="gridmap">
            <div className="aoi"><span>AOI-01</span></div>
            <div className="target">◎<small>Target-01</small></div>
            <div className="buffer">5 km BUFFER</div>
            <div className="fixed"><b>10 km</b><span>10 km</span></div>
          </div>
          <footer className="status">WGS84 · EPSG:4326 · Zoom 12.4 · TACTICA V1</footer>
        </div>

        <aside className="panel layers">
          <h3>{lang === 'ar' ? 'الطبقات' : 'Layers'}</h3>
          {['Satellite Imagery','AOI-01','Drawing Layer','Buffer','Fixed-Size Box','Detections'].map(x => <label key={x}><input type="checkbox" defaultChecked/> {x}</label>)}
          <div className="card"><b>{lang === 'ar' ? 'الأداة النشطة' : 'Active Tool'}</b><p>{activeTool}</p></div>
          <div className="card"><b>TACTICA Copilot</b><p>{lang === 'ar' ? 'سيتم ربط المساعد بالبيانات والتحليل في المرحلة التالية.' : 'The copilot will be connected to platform data and analysis in the next phase.'}</p></div>
        </aside>
      </section>
    </main>
  );
}
