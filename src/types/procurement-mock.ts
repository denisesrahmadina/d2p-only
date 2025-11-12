export interface ItemMaster {
  item_id: string;
  item_name: string;
  material_id: string | null;
  material_desc: string;
  category: string;
  uom: string;
  unit_price: number;
  stock_qty: number;
  image_url: string | null;
  contract_id: string | null;
  is_active: boolean;
  created_date?: string;
  modified_date?: string;
}

export interface PRHeader {
  pr_id?: number;
  pr_number: string;
  requestor_name: string;
  requestor_id: string | null;
  department: string;
  pr_date: string;
  total_value: number;
  currency: string;
  pr_status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'In Procurement' | 'Completed';
  approver_name: string | null;
  approver_id: string | null;
  approval_date: string | null;
  created_from_contract: string | null;
  notes: string | null;
  created_date?: string;
  modified_date?: string;
}

export interface PRLine {
  pr_line_id?: number;
  pr_id: number;
  pr_number: string;
  line_number: number;
  item_id: string | null;
  material_id: string | null;
  quantity: number;
  uom: string;
  unit_price: number;
  subtotal: number;
  notes: string | null;
  created_date?: string;
}

export interface POHeader {
  po_line_id?: number;
  po_number: string;
  po_line_number: number;
  vendor_id: string;
  pr_id: number | null;
  pr_number: string | null;
  contract_id: string | null;
  material_id: string | null;
  po_date: string;
  delivery_date: string | null;
  expected_delivery_date: string | null;
  po_value: number;
  currency: string;
  po_status: 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Inspected' | 'GR Posted' | 'Cancelled';
  qty_ordered: number;
  qty_received: number;
  uom: string;
  po_description: string | null;
  receiving_unit_id: string | null;
  created_date?: string;
  modified_date?: string;
}

export interface POStatusLog {
  log_id?: number;
  po_number: string;
  po_line_id: number | null;
  step: number;
  step_name: string;
  step_timestamp: string;
  location: string | null;
  remarks: string | null;
  created_date?: string;
}

export interface BAPemeriksaan {
  ba_pemeriksaan_id?: number;
  ba_number: string;
  po_number: string;
  po_line_id: number | null;
  contract_id: string;
  vendor_id: string;
  material_id: string | null;
  inspection_date: string;
  qty_checked: number;
  qty_approved: number;
  qty_rejected: number;
  uom: string;
  document_status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  maker_pln: string;
  maker_vendor: string;
  checker_pln: string | null;
  approver_pln: string | null;
  approval_date: string | null;
  inspection_notes: string | null;
  created_date?: string;
  modified_date?: string;
}

export interface BASerahTerima {
  ba_serah_terima_id?: number;
  ba_number: string;
  linked_ba_pemeriksaan: string | null;
  linked_ba_pemeriksaan_id: number | null;
  po_number: string;
  po_line_id: number | null;
  contract_id: string;
  vendor_id: string;
  material_id: string | null;
  handover_date: string;
  qty_handover: number;
  uom: string;
  document_status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  maker_pln: string;
  maker_vendor: string;
  approver_pln: string | null;
  approval_date: string | null;
  handover_notes: string | null;
  created_date?: string;
  modified_date?: string;
}

export interface GRHeader {
  gr_id?: number;
  gr_number: string;
  ba_serah_terima: string | null;
  ba_serah_terima_id: number | null;
  po_number: string;
  po_line_id: number | null;
  contract_id: string;
  vendor_id: string;
  material_id: string | null;
  gr_date: string;
  qty_received: number;
  qty_rejected: number;
  uom: string;
  gr_value: number;
  currency: string;
  gr_status: 'Posted' | 'Failed' | 'Cancelled';
  gr_notes: string | null;
  created_by: string | null;
  created_date?: string;
  modified_date?: string;
}

export interface MockDataGenerationResult {
  vendors: number;
  contracts: number;
  items: number;
  prHeaders: number;
  prLines: number;
  poHeaders: number;
  poStatusLogs: number;
  baPemeriksaan: number;
  baSerahTerima: number;
  grHeaders: number;
  totalRecords: number;
  errors: string[];
}
