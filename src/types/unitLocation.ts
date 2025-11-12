export interface UnitLocation {
  id: string;
  unit_id: string;
  name: string;
  type: string;
  full_name: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  region: string | null;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  health_index: number;
  category: string;
  capacity_mw: number | null;
  plant_type: string | null;
  commission_year: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UnitLocationFilter {
  search?: string;
  healthStatus?: 'excellent' | 'good' | 'needs-attention' | 'all';
  region?: string;
  province?: string;
  type?: string;
}

export type HealthStatus = 'excellent' | 'good' | 'needs-attention';

export interface HealthStatusInfo {
  status: HealthStatus;
  label: string;
  color: string;
  markerColor: string;
  range: string;
}
