export type ModuleStatus = 'live' | 'foundation' | 'planned';

export interface PlatformModule {
  id: string;
  ar: string;
  en: string;
  status: ModuleStatus;
}

export const platformModules: PlatformModule[] = [
  { id: 'command', ar: 'مركز القيادة', en: 'Command Center', status: 'foundation' },
  { id: 'map', ar: 'الخريطة والاستكشاف', en: 'Map & Explore', status: 'live' },
  { id: 'recon', ar: 'الاستطلاع', en: 'Reconnaissance', status: 'foundation' },
  { id: 'twin', ar: 'التوأم الرقمي', en: 'Digital Twin', status: 'planned' },
  { id: 'analysis', ar: 'التحليل الاستخباري', en: 'Intelligence Analysis', status: 'foundation' },
  { id: 'fusion', ar: 'دمج المصادر', en: 'Multi-source Fusion', status: 'planned' },
  { id: 'gnss', ar: 'سلامة GNSS', en: 'GNSS Integrity', status: 'foundation' },
  { id: 'missions', ar: 'المهام', en: 'Missions', status: 'foundation' },
  { id: 'evidence', ar: 'التحقيق والأدلة', en: 'Investigation & Evidence', status: 'foundation' },
  { id: 'production', ar: 'الإنتاج', en: 'Production', status: 'foundation' },
  { id: 'reports', ar: 'التقارير', en: 'Reports', status: 'foundation' },
  { id: 'qc', ar: 'فحص الجودة', en: 'Quality Check', status: 'foundation' },
  { id: 'data', ar: 'إدارة البيانات', en: 'Data Management', status: 'foundation' },
  { id: 'library', ar: 'المكتبة', en: 'Library', status: 'planned' },
  { id: 'admin', ar: 'الإدارة', en: 'Administration', status: 'planned' },
];

export const reportTemplates = [
  'Quick Intelligence Brief', 'Intelligence Report', 'Change Detection Report',
  'SAR Report', 'Maritime Intelligence Report', 'GNSS Integrity Report',
  'Incident Report', 'Daily Intelligence Summary', 'Before/After Report', 'Custom Report'
];

export const qcDomains = ['Data', 'Imagery', 'Map', 'Analysis', 'Evidence', 'Report'];
