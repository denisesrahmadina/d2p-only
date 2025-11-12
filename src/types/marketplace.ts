// PLN Indonesia Power Marketplace Types

export interface MarketplaceCategory {
  category_id: string;
  category_code: string;
  category_name: string;
  description?: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MarketplaceSupplier {
  supplier_id: string;
  supplier_code: string;
  supplier_name: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  certifications?: string[];
  performance_rating: number;
  is_pln_approved: boolean;
  is_active: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MarketplaceItem {
  item_id: string;
  item_code: string;
  item_name: string;
  item_description?: string;
  category_id: string;
  category?: MarketplaceCategory;
  supplier_id: string;
  supplier?: MarketplaceSupplier;
  unit_price: number;
  currency: string;
  stock_quantity: number;
  lead_time_days: number;
  unit_of_measure: string;
  technical_specifications?: Record<string, any>;
  compliance_certifications?: string[];
  warranty_info?: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MarketplaceCartItem {
  cart_item_id?: number;
  user_id: string;
  item_id: string;
  item?: MarketplaceItem;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  added_at?: string;
  updated_at?: string;
}

export interface PLNFacility {
  facility_id: string;
  facility_code: string;
  facility_name: string;
  facility_type?: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MarketplacePRHeader {
  pr_id?: number;
  pr_number: string;
  pr_date: string;
  requestor_id: string;
  requestor_name: string;
  department?: string;
  delivery_facility_id?: string;
  delivery_facility?: PLNFacility;
  total_value: number;
  currency: string;
  pr_status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MarketplacePRLine {
  pr_line_id?: number;
  pr_id: number;
  line_number: number;
  item_id: string;
  item?: MarketplaceItem;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  created_at?: string;
}

export interface MarketplacePRApproval {
  approval_id?: number;
  pr_id: number;
  approval_level: number;
  approver_id: string;
  approver_name: string;
  approver_role: string;
  approval_status: 'Pending' | 'Approved' | 'Rejected' | 'Requested Revision';
  action_date?: string;
  comments?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MarketplacePRWithDetails extends MarketplacePRHeader {
  lines?: MarketplacePRLine[];
  approvals?: MarketplacePRApproval[];
}

export type OrderStatus = 'ORDER_PLACED' | 'PROCESSING_ORDER' | 'SHIPPED' | 'DELIVERY' | 'ARRIVED_AT_DESTINATION';

export interface MarketplaceOrder {
  order_id?: number;
  po_number: string;
  pr_id?: number;
  supplier_id: string;
  supplier?: MarketplaceSupplier;
  delivery_facility_id?: string;
  delivery_facility?: PLNFacility;
  total_value: number;
  currency: string;
  current_status: OrderStatus;
  current_step: number;
  order_placed_date: string;
  processing_date?: string;
  shipped_date?: string;
  delivery_date?: string;
  arrived_date?: string;
  tracking_number?: string;
  carrier?: string;
  expected_delivery_date?: string;
  is_delayed: boolean;
  delay_reason?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MarketplaceOrderLine {
  order_line_id?: number;
  order_id: number;
  line_number: number;
  item_id: string;
  item?: MarketplaceItem;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
}

export interface MarketplaceOrderTracking {
  tracking_id?: number;
  order_id: number;
  status: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  notes?: string;
  photo_urls?: string[];
  created_at?: string;
}

export interface MarketplaceOrderWithDetails extends MarketplaceOrder {
  lines?: MarketplaceOrderLine[];
  tracking?: MarketplaceOrderTracking[];
}

export interface MarketplaceItemDocument {
  document_id?: number;
  item_id: string;
  document_type: 'Technical Manual' | 'Safety Certificate' | 'Compliance Certificate' | 'Warranty Document' | 'Installation Guide' | 'Datasheet' | 'Other';
  document_name: string;
  document_url: string;
  file_size?: number;
  uploaded_by?: string;
  uploaded_at?: string;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  currency: string;
  item_count: number;
}

export interface MarketplaceFilters {
  category_id?: string;
  supplier_id?: string;
  price_min?: number;
  price_max?: number;
  lead_time_max?: number;
  in_stock_only?: boolean;
  search_query?: string;
  sort_by?: 'name' | 'price_asc' | 'price_desc' | 'supplier' | 'lead_time';
}

export interface PRFilters {
  pr_status?: string;
  date_from?: string;
  date_to?: string;
  requestor_id?: string;
  supplier_id?: string;
}

export interface OrderFilters {
  current_status?: OrderStatus;
  supplier_id?: string;
  date_from?: string;
  date_to?: string;
  is_delayed?: boolean;
}

export interface PRStatusSummary {
  total: number;
  pending_approval: number;
  approved: number;
  rejected: number;
  completed: number;
  cancelled: number;
}

export interface OrderStatusSummary {
  total: number;
  order_placed: number;
  processing: number;
  shipped: number;
  delivery: number;
  arrived: number;
  delayed: number;
}

export const ORDER_STATUS_STEPS: Array<{
  status: OrderStatus;
  step: number;
  label: string;
  description: string;
}> = [
  { status: 'ORDER_PLACED', step: 1, label: 'Order Placed', description: 'Order has been placed with supplier' },
  { status: 'PROCESSING_ORDER', step: 2, label: 'Processing', description: 'Supplier is processing the order' },
  { status: 'SHIPPED', step: 3, label: 'Shipped', description: 'Order has been shipped' },
  { status: 'DELIVERY', step: 4, label: 'In Delivery', description: 'Order is being delivered' },
  { status: 'ARRIVED_AT_DESTINATION', step: 5, label: 'Arrived', description: 'Order has arrived at destination' }
];
