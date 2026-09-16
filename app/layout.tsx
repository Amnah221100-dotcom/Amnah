import './globals.css';
import './map.css';

export const metadata = {
  title: 'TACTICA AI',
  description: 'Intelligent Geospatial Reconnaissance & Analysis Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
