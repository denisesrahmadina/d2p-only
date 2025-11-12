// Indonesian Procurement Categories Types

export interface ProcurementCategory {
  id: string;
  main_category_code: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  main_category_name_id: string;
  main_category_description_id: string | null;
  subcategory_code: string;
  subcategory_name_id: string;
  subcategory_description_id: string | null;
  target_sourcing_days: number;
  target_otif_percentage: number;
  target_savings_percentage: number;
  is_active: boolean;
  display_order: number;
}

export interface CategorySummary {
  main_category_code: string;
  main_category_name_id: string;
  main_category_description_id: string | null;
  display_order: number;

  // Savings metrics
  savings_contract_count: number;
  total_savings_amount: number;
  avg_savings_percentage: number;
  target_savings_percentage: number;

  // Sourcing speed metrics
  sourcing_contract_count: number;
  avg_sourcing_days: number;
  sourcing_within_target: number;
  sourcing_beyond_target: number;
  target_sourcing_days: number;

  // OTIF metrics
  otif_supplier_count: number;
  total_deliveries: number;
  otif_percentage: number;
  suppliers_meeting_otif: number;
  suppliers_below_otif: number;
  target_otif_percentage: number;

  // Combined metrics
  total_value_savings: number;
  total_value_sourcing: number;
  total_value_otif: number;

  // Performance status
  savings_performance_status: 'On Target' | 'Near Target' | 'Below Target';
  sourcing_performance_status: 'On Target' | 'Near Target' | 'Below Target';
  otif_performance_status: 'On Target' | 'Near Target' | 'Below Target';
}

export interface CategorySavingsDetail {
  main_category_code: string;
  main_category_name_id: string;
  subcategory_code: string;
  subcategory_name_id: string;
  contract_count: number;
  total_contract_value: number;
  total_owner_estimate: number;
  total_actual_savings: number;
  avg_savings_percentage: number;
  earliest_award_date: string;
  latest_award_date: string;
  supplier_count: number;
  target_savings_percentage: number;
}

export interface CategorySourcingDetail {
  main_category_code: string;
  main_category_name_id: string;
  subcategory_code: string;
  subcategory_name_id: string;
  contract_count: number;
  avg_sourcing_days: number;
  min_sourcing_days: number;
  max_sourcing_days: number;
  stddev_sourcing_days: number | null;
  within_target_count: number;
  beyond_target_count: number;
  avg_within_target: number | null;
  avg_beyond_target: number | null;
  target_sourcing_days: number;
  total_contract_value_idr: number;
  supplier_count: number;
}

export interface CategoryOTIFDetail {
  main_category_code: string;
  main_category_name_id: string;
  subcategory_code: string;
  subcategory_name_id: string;
  supplier_count: number;
  total_deliveries: number;
  otif_deliveries: number;
  on_time_deliveries: number;
  in_full_deliveries: number;
  otif_percentage: number;
  on_time_percentage: number;
  in_full_percentage: number;
  avg_delay_days: number | null;
  total_contract_value: number;
  target_otif_percentage: number;
  suppliers_meeting_target: number;
  suppliers_below_target: number;
}

export interface ContractWithCategory {
  contract_id: string;
  contract_name: string;
  contract_description: string;
  supplier_name: string;
  contract_value: number;
  main_category_code: string;
  main_category_name_id: string;
  subcategory_code: string;
  subcategory_name_id: string;
}

export interface SavingsContractDetail extends ContractWithCategory {
  planned_award_date: string | null;
  actual_award_date: string;
  planned_savings: number;
  actual_savings: number;
  savings_percentage: number;
  owner_estimate: number;
  business_unit: string;
}

export interface SourcingContractDetail extends ContractWithCategory {
  sourcing_speed: number;
  request_date: string;
  award_date: string | null;
  status: string;
  current_process_step: string | null;
  expected_completion_date: string | null;
  target_sourcing_days: number;
  variance_from_target: number;
}

export interface DeliveryRecord extends ContractWithCategory {
  delivery_id: string;
  purchase_order_id: string;
  delivery_count: number;
  otif_tag: boolean;
  on_time_tag: boolean;
  in_full_tag: boolean;
  delivery_date: string | null;
  expected_date: string;
  delay_days: number | null;
  quantity_ordered: number;
  quantity_delivered: number;
  quantity_shortage: number | null;
  delivery_status: string;
  failure_reason: string | null;
}

export interface SupplierOTIFSummary {
  supplier_id: string;
  supplier_name: string;
  main_category_code: string;
  contract_count: number;
  delivery_count: number;
  otif_percentage: number;
  on_time_percentage: number;
  in_full_percentage: number;
  avg_delay_days: number | null;
  total_contract_value: number;
  supplier_tier: string;
  latest_delivery_date: string;
}

export interface MonthlyTrendData {
  year: number;
  month: number;
  month_name: string;
  actual_value: number;
  planned_value: number;
  main_category_code?: string;
}

export interface PipelineContract {
  contract_reference: string;
  contract_name: string;
  contract_description: string;
  main_category_code: string;
  estimated_value: number;
  pipeline_status: string;
  expected_award_date: string | null;
  current_process_step: string | null;
  projected_savings: number;
  probability_percentage: number;
}

// The 6 main Indonesian procurement categories
export const INDONESIAN_CATEGORIES = [
  {
    code: 'A',
    name: 'Energi Primer dan Jasa Penunjangnya',
    description: 'Pengadaan bahan bakar, energi primer, dan jasa pendukung operasional pembangkit',
    color: 'from-indigo-500 to-purple-500',
    icon: 'Flame'
  },
  {
    code: 'B',
    name: 'Peralatan Penunjang dan Sistem Mechanical/Electrical',
    description: 'Pengadaan peralatan mekanikal, elektrikal, dan sistem penunjang',
    color: 'from-blue-500 to-cyan-500',
    icon: 'Cpu'
  },
  {
    code: 'C',
    name: 'Material, Consumable, dan General Supply',
    description: 'Pengadaan material habis pakai, spare part, dan supplies umum',
    color: 'from-green-500 to-emerald-500',
    icon: 'Package'
  },
  {
    code: 'D',
    name: 'Asset Non-Operasional dan Penunjang Manajemen',
    description: 'Pengadaan aset pendukung operasional dan manajemen perusahaan',
    color: 'from-purple-500 to-pink-500',
    icon: 'Building2'
  },
  {
    code: 'E',
    name: 'Jasa dan Kontrak Pendukung',
    description: 'Pengadaan jasa konsultansi, maintenance, dan layanan pendukung',
    color: 'from-amber-500 to-yellow-500',
    icon: 'Users'
  },
  {
    code: 'F',
    name: 'Peralatan Utama Pembangkit dan Project EPC',
    description: 'Pengadaan peralatan utama dan proyek konstruksi pembangkit listrik',
    color: 'from-teal-500 to-blue-600',
    icon: 'Zap'
  }
] as const;

export type CategoryCode = typeof INDONESIAN_CATEGORIES[number]['code'];
