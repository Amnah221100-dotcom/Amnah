'use client';

import { useState } from 'react';
import MapWorkspace from '../components/MapWorkspace';

export default function Home() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  return (
    <main className="shell" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="topbar">
        <div className="brand"><span className="mark">T</span><div><b>TACTICA AI</b><small>GEOSPATIAL INTELLIGENCE</small></div></div>
        <nav><button className="active">{lang === 'ar' ? 'الخريطة والاستكشاف' : 'Map & Explore'}</button><button>{lang === 'ar' ? 'الاستطلاع' : 'Reconnaissance'}</button><button>{lang === 'ar' ? 'التحليل' : 'Analysis'}</button><button>{lang === 'ar' ? 'الإنتاج' : 'Production'}</button><button>QC</button></nav>
        <div className="top-actions"><button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>{lang === 'ar' ? 'English' : 'العربية'}</button><button>✦ {lang === 'ar' ? 'المرشد الذكي' : 'Smart Guide'}</button><button>🔔</button></div>
      </header>
      <section className="workspace live-workspace">
        <aside className="panel tools"><h3>{lang === 'ar' ? 'أدوات الخريطة' : 'Map Tools'}</h3><p>{lang === 'ar' ? 'اختر أداة من الشريط أعلى الخريطة. Fixed-Size Box ينشئ منطقة دقيقة حول النقطة التي تحددها.' : 'Choose a tool above the map. Fixed-Size Box creates an exact area around the selected center point.'}</p><div className="card"><b>Drawing & Measurement</b><p>Point · Line · Polygon · Buffer · Fixed-Size Box</p></div></aside>
        <div className="map"><div className="map-title"><b>{lang === 'ar' ? 'مساحة العمل الجغرافية الحية' : 'Live Geospatial Workspace'}</b><span>2D · WGS84</span></div><MapWorkspace/><footer className="status">MapLibre · Turf.js · WGS84 · EPSG:4326 · TACTICA V1</footer></div>
        <aside className="panel layers"><h3>{lang === 'ar' ? 'الطبقات' : 'Layers'}</h3>{['Base Map','Drawing Layer','AOI','Buffer','Fixed-Size Box'].map(x => <label key={x}><input type="checkbox" defaultChecked/> {x}</label>)}<div className="card"><b>TACTICA Copilot</b><p>{lang === 'ar' ? 'سيتم ربط المساعد بالقضايا والأدلة والتحليل في المرحلة التالية.' : 'Copilot will connect to cases, evidence and analysis in the next phase.'}</p></div></aside>
      </section>
    </main>
  );
}
