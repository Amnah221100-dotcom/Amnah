const API = process.env.NEXT_PUBLIC_TACTICA_API ?? 'http://localhost:8000/api/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  if (!response.ok) throw new Error(`TACTICA API ${response.status}: ${await response.text()}`);
  return response.json();
}

export type GeoJSONGeometry = { type: string; coordinates: unknown };

export const tacticaApi = {
  cases: {
    list: () => request<any[]>('/cases'),
    create: (body: { title: string; classification?: string }) => request('/cases', { method: 'POST', body: JSON.stringify(body) }),
  },
  aois: {
    list: (caseId?: string) => request<any[]>(`/aois${caseId ? `?case_id=${caseId}` : ''}`),
    create: (body: { case_id?: string; name: string; geometry: GeoJSONGeometry; properties?: Record<string, unknown> }) => request('/aois', { method: 'POST', body: JSON.stringify(body) }),
  },
  evidence: {
    create: (body: { case_id: string; title: string; evidence_type?: string; geometry?: GeoJSONGeometry; metadata?: Record<string, unknown> }) => request('/evidence', { method: 'POST', body: JSON.stringify(body) }),
  },
  alerts: { list: (caseId?: string) => request<any[]>(`/alerts${caseId ? `?case_id=${caseId}` : ''}`) },
  qc: { get: (productId: string) => request(`/qc/${productId}`) },
};
