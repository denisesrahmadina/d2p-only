export type BAType = 'BA Pemeriksaan' | 'BA Serah Terima Barang' | 'BA Pembayaran';

export type BAStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'UNDER_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type RoleType =
  | 'Maker Vendor'
  | 'Maker PLN'
  | 'Checker Vendor'
  | 'Checker PLN'
  | 'Approver Vendor'
  | 'Approver PLN';

export type RoleSide = 'Vendor' | 'PLN';

export type ScenarioType = 'Stock' | 'Non-Stock';

export type ActionStatus = 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';

export type ActionType =
  | 'CREATED'
  | 'SAVED_DRAFT'
  | 'SUBMITTED'
  | 'REVIEWED'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED'
  | 'CANCELLED'
  | 'FINALIZED'
  | 'MODIFIED'
  | 'DOCUMENT_UPLOADED'
  | 'COMMENT_ADDED'
  | 'PARTY_ASSIGNED'
  | 'SIGNATURE_ADDED'
  | 'GR_CREATED'
  | 'TIMELINE_SYNCED';

export interface BAMaster {
  ba_id?: number;
  ba_number: string;
  ba_type: BAType;
  ba_status: BAStatus;
  ba_version: number;

  contract_id: string;
  po_number: string;
  vendor_id: string;
  material_document_number?: string;
  linked_ba_pemeriksaan_id?: number;

  work_location?: string;
  delivery_location?: string;
  project_name?: string;

  background_notes?: string;
  inspection_notes?: string;
  handover_notes?: string;

  submitted_date?: string;
  submitted_by?: string;
  review_started_date?: string;
  review_completed_date?: string;
  approval_started_date?: string;
  final_approval_date?: string;
  final_approved_by?: string;
  rejection_date?: string;
  rejection_by?: string;
  cancellation_date?: string;
  cancellation_by?: string;
  cancellation_reason?: string;

  gr_number?: string;
  gr_creation_status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'NOT_APPLICABLE';
  gr_created_date?: string;
  order_monitoring_sync_status?: 'PENDING' | 'SYNCED' | 'FAILED' | 'NOT_APPLICABLE';
  order_monitoring_synced_date?: string;

  has_digital_signature: boolean;
  digital_signature_completed_date?: string;

  sla_due_date?: string;
  is_overdue: boolean;

  autosave_content?: string;
  last_autosave_date?: string;
  is_locked: boolean;
  locked_by?: string;
  lock_acquired_at?: string;

  created_by: string;
  created_date: string;
  modified_by?: string;
  modified_date?: string;
}

export interface BAParty {
  party_id?: number;
  ba_id?: number;
  role_type: RoleType;
  role_side: RoleSide;
  is_primary: boolean;

  party_user_id?: string;
  party_name: string;
  party_position?: string;
  party_unit?: string;
  party_email?: string;
  party_phone?: string;

  assigned_by?: string;
  assigned_date?: string;

  action_required: boolean;
  action_status?: ActionStatus;
  action_date?: string;
  action_comments?: string;

  created_date?: string;
}

export interface BAPemeriksaanDetail {
  inspection_id?: number;
  ba_id?: number;

  scenario_type: ScenarioType;
  material_document_number?: string;
  po_number: string;
  po_line_item?: number;
  material_id?: string;
  material_description: string;

  unit_of_measure?: string;
  qty_ordered: number;
  qty_previously_received: number;
  qty_inspected: number;
  qty_approved: number;
  qty_rejected: number;

  inspection_date: string;
  inspection_location?: string;
  inspection_by_both_parties: boolean;
  inspection_remarks?: string;

  quality_status?: 'Passed' | 'Failed' | 'Conditional';
  defect_description?: string;

  created_date?: string;
}

export interface BASerahTerimaDetail {
  handover_id?: number;
  ba_id?: number;

  material_id?: string;
  material_description: string;
  unit_of_measure?: string;

  qty_ordered: number;
  qty_already_handed_over: number;
  qty_this_handover: number;
  qty_remaining?: number;

  handover_date: string;
  delivery_location: string;
  transporter_name?: string;
  transporter_do_number?: string;
  vehicle_number?: string;

  handover_by_both_parties: boolean;
  direksi_inspection: boolean;
  direksi_inspection_date?: string;
  direksi_inspector_name?: string;

  condition_status?: 'Good' | 'Damaged' | 'Incomplete';
  condition_remarks?: string;
  handover_remarks?: string;

  created_date?: string;
}

export interface BAWorkflowStep {
  workflow_step_id?: number;
  ba_id: number;

  step_type: 'SUBMIT' | 'REVIEW' | 'APPROVE';
  step_role: RoleType;
  step_order: number;

  actor_party_id?: number;
  actor_user_id?: string;
  actor_name: string;
  actor_role?: string;

  action_status: ActionStatus;
  action_date?: string;
  action_comments?: string;
  rejection_reason_id?: number;
  rejection_reason_detail?: string;

  is_parallel: boolean;
  parallel_group_id?: string;
  requires_all_approval: boolean;

  created_date?: string;
}

export interface BADocumentAttachment {
  attachment_id?: number;
  ba_id: number;

  doc_type_id?: number;
  doc_type_code: string;
  doc_category: 'MANDATORY' | 'OPTIONAL' | 'SYSTEM_GENERATED';

  file_name: string;
  file_original_name: string;
  file_url: string;
  file_size_bytes?: number;
  file_type?: string;
  file_extension?: string;

  file_hash?: string;
  virus_scan_status?: 'PENDING' | 'CLEAN' | 'INFECTED' | 'FAILED';
  virus_scan_date?: string;

  uploaded_by: string;
  uploaded_date?: string;

  document_metadata?: any;
  version: number;
  is_active: boolean;
  replaced_by_attachment_id?: number;

  created_date?: string;
}

export interface BAProcessHistory {
  history_id?: number;
  ba_id: number;

  action_type: ActionType;
  action_by_user_id?: string;
  action_by_name: string;
  action_by_role?: string;

  previous_status?: string;
  new_status?: string;

  action_comments?: string;
  rejection_reason_id?: number;
  rejection_reason_category?: string;
  rejection_reason_detail?: string;

  action_metadata?: any;

  ip_address?: string;
  user_agent?: string;
  session_id?: string;

  action_timestamp: string;
  created_date?: string;
}

export interface BARejectionReason {
  reason_id: number;
  reason_category: string;
  reason_code: string;
  reason_description: string;
  applies_to_ba_type?: string[];
  is_active: boolean;
}

export interface BADocumentType {
  doc_type_id: number;
  doc_type_code: string;
  doc_type_name: string;
  doc_type_description?: string;
  is_mandatory: boolean;
  applies_to_ba_type: string;
  file_types_allowed?: string[];
  max_file_size_mb: number;
  display_order?: number;
  is_active: boolean;
}

export interface BATemplate {
  template_id: number;
  template_code: string;
  template_name: string;
  template_type: BAType;
  template_category?: string;
  template_content: string;
  template_variables?: string[];
  template_sections?: any[];
  is_default: boolean;
  is_active: boolean;
  version: number;
}

export interface BADigitalSignature {
  signature_id?: number;
  ba_id: number;

  signer_party_id?: number;
  signer_user_id?: string;
  signer_name: string;
  signer_role: string;
  signer_side: RoleSide;

  signature_type: 'DIGITAL' | 'E_MATERAI' | 'BOTH';
  signature_method?: 'DRAWN' | 'UPLOADED' | 'CERTIFICATE';
  signature_image_url?: string;

  certificate_issuer?: string;
  certificate_serial_number?: string;
  certificate_valid_from?: string;
  certificate_valid_until?: string;
  certificate_thumbprint?: string;

  ematerai_id?: string;
  ematerai_provider?: string;
  ematerai_stamp_url?: string;
  ematerai_verification_code?: string;

  signature_timestamp: string;
  signature_ip_address?: string;
  signature_location_gps?: { lat: number; lon: number };

  is_verified: boolean;
  verification_status?: 'PENDING' | 'VERIFIED' | 'FAILED' | 'EXPIRED';
  verification_date?: string;
  verification_details?: any;
}

export interface BAERPIntegrationLog {
  log_id?: number;
  ba_id: number;

  integration_type: 'GR_CREATION' | 'PO_UPDATE' | 'INVENTORY_UPDATE';
  integration_direction: 'OUTBOUND' | 'INBOUND';

  request_payload: any;
  request_timestamp: string;
  request_url?: string;
  request_method?: string;

  response_payload?: any;
  response_timestamp?: string;
  response_status_code?: number;
  response_message?: string;

  integration_status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'RETRY';
  retry_count: number;
  max_retry: number;
  next_retry_at?: string;

  gr_number?: string;
  erp_document_number?: string;
  error_code?: string;
  error_message?: string;
  error_details?: any;
}

export interface BAOrderMonitoringSync {
  sync_id?: number;
  ba_id: number;

  po_number: string;
  po_line_id?: number;

  previous_status?: string;
  new_status: string;
  timeline_stage: string;

  sync_status: 'PENDING' | 'SYNCED' | 'FAILED' | 'ROLLBACK';
  sync_timestamp?: string;
  sync_request_payload?: any;
  sync_response_payload?: any;

  error_message?: string;
  retry_count: number;
}

export interface BAFormData {
  ba_number: string;
  ba_type: BAType;
  contract_id: string;
  po_number: string;
  vendor_id: string;

  work_location?: string;
  delivery_location?: string;
  project_name?: string;
  background_notes?: string;
  inspection_notes?: string;
  handover_notes?: string;

  parties: BAParty[];
  pemeriksaan_details?: BAPemeriksaanDetail[];
  serah_terima_details?: BASerahTerimaDetail[];
  documents?: File[];
}

export interface BAWithDetails extends BAMaster {
  parties?: BAParty[];
  pemeriksaan_details?: BAPemeriksaanDetail[];
  serah_terima_details?: BASerahTerimaDetail[];
  workflow_steps?: BAWorkflowStep[];
  documents?: BADocumentAttachment[];
  process_history?: BAProcessHistory[];
  linked_ba_pemeriksaan?: BAMaster;
}

export interface BAValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }[];
}

export interface BAKPIStats {
  total: number;
  by_status: {
    draft: number;
    submitted: number;
    under_review: number;
    under_approval: number;
    approved: number;
    rejected: number;
    cancelled: number;
  };
  by_type: {
    pemeriksaan: number;
    serah_terima: number;
  };
  outstanding_reviews: number;
  approvals_needed: number;
  overdue: number;
  completed_this_month: number;
}
