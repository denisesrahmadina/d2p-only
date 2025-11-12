export interface InventoryTolerance {
  id: string;
  unit_id: string;
  tolerance_percentage: number;
  materials_out_of_tolerance: number;
  total_materials: number;
  measurement_date: string;
  status: ToleranceStatus;
  created_at: string;
  updated_at: string;
}

export interface MaterialToleranceDetail {
  id: string;
  unit_id: string;
  material_id: string;
  material_name: string;
  actual_quantity: number;
  planned_quantity: number;
  tolerance_percentage: number;
  is_compliant: boolean;
  measurement_date: string;
  created_at: string;
  updated_at: string;
}

export type ToleranceStatus = 'excellent' | 'good' | 'needs-attention';

export interface ToleranceStats {
  total: number;
  excellent: number;
  good: number;
  needsAttention: number;
}

export interface ToleranceStatusInfo {
  status: ToleranceStatus;
  label: string;
  color: string;
  markerColor: string;
  range: string;
}

export interface UnitLocationWithTolerance {
  id: string;
  unit_id: string;
  name: string;
  type: string;
  full_name: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  region: string | null;
  latitude: number;
  longitude: number;
  capacity_mw: number | null;
  plant_type: string | null;
  commission_year: number | null;
  tolerance_percentage: number;
  materials_out_of_tolerance: number;
  total_materials: number;
  tolerance_status: ToleranceStatus;
  incompliant_materials: MaterialToleranceDetail[];
}
