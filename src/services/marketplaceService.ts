import { supabase } from './supabaseClient';
import {
  MarketplaceCategory,
  MarketplaceSupplier,
  MarketplaceItem,
  MarketplaceCartItem,
  PLNFacility,
  MarketplacePRHeader,
  MarketplacePRLine,
  MarketplacePRApproval,
  MarketplaceOrder,
  MarketplaceFilters,
  CartSummary,
  PRStatusSummary,
  OrderStatusSummary
} from '../types/marketplace';
import {
  mockCategories,
  mockSuppliers,
  mockPLNFacilities,
  mockMarketplaceItems,
  mockCartItems,
  mockPRHeaders,
  mockOrders,
  mockPRStatusSummary,
  mockOrderStatusSummary,
  getItemsWithDetails,
  getCartWithDetails,
  getPRsWithDetails,
  getOrdersWithDetails,
  addLocalPR,
  getLocalPRs,
  getNextPRId
} from '../data/marketplaceMockData';

// Flag to use mock data instead of database
const USE_MOCK_DATA = true;

export class MarketplaceService {
  // ============================================================================
  // CATEGORIES
  // ============================================================================

  static async getCategories(): Promise<MarketplaceCategory[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve([...mockCategories]);
    }

    const { data, error } = await supabase
      .from('marketplace_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    return data || [];
  }

  // ============================================================================
  // SUPPLIERS
  // ============================================================================

  static async getSuppliers(): Promise<MarketplaceSupplier[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve([...mockSuppliers]);
    }

    const { data, error } = await supabase
      .from('marketplace_suppliers')
      .select('*')
      .eq('is_active', true)
      .order('supplier_name');

    if (error) throw error;
    return data || [];
  }

  static async getSupplierById(supplierId: string): Promise<MarketplaceSupplier | null> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockSuppliers.find(s => s.supplier_id === supplierId) || null);
    }

    const { data, error } = await supabase
      .from('marketplace_suppliers')
      .select('*')
      .eq('supplier_id', supplierId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // ============================================================================
  // ITEMS
  // ============================================================================

  static async getItems(filters?: MarketplaceFilters): Promise<MarketplaceItem[]> {
    if (USE_MOCK_DATA) {
      let items = getItemsWithDetails();

      // Apply filters
      if (filters?.category_id) {
        items = items.filter(item => item.category_id === filters.category_id);
      }

      if (filters?.supplier_id) {
        items = items.filter(item => item.supplier_id === filters.supplier_id);
      }

      if (filters?.price_min) {
        items = items.filter(item => item.unit_price >= filters.price_min!);
      }

      if (filters?.price_max) {
        items = items.filter(item => item.unit_price <= filters.price_max!);
      }

      if (filters?.lead_time_max) {
        items = items.filter(item => item.lead_time_days <= filters.lead_time_max!);
      }

      if (filters?.in_stock_only) {
        items = items.filter(item => item.stock_quantity > 0);
      }

      if (filters?.search_query) {
        const query = filters.search_query.toLowerCase();
        items = items.filter(item =>
          item.item_name.toLowerCase().includes(query) ||
          item.item_code.toLowerCase().includes(query) ||
          item.item_description?.toLowerCase().includes(query)
        );
      }

      // Sorting
      if (filters?.sort_by === 'price_asc') {
        items.sort((a, b) => a.unit_price - b.unit_price);
      } else if (filters?.sort_by === 'price_desc') {
        items.sort((a, b) => b.unit_price - a.unit_price);
      } else if (filters?.sort_by === 'lead_time') {
        items.sort((a, b) => a.lead_time_days - b.lead_time_days);
      } else {
        items.sort((a, b) => a.item_name.localeCompare(b.item_name));
      }

      return Promise.resolve(items);
    }

    let query = supabase
      .from('marketplace_items')
      .select(`
        *,
        category:marketplace_categories(*),
        supplier:marketplace_suppliers(*)
      `)
      .eq('is_active', true);

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters?.supplier_id) {
      query = query.eq('supplier_id', filters.supplier_id);
    }

    if (filters?.price_min) {
      query = query.gte('unit_price', filters.price_min);
    }

    if (filters?.price_max) {
      query = query.lte('unit_price', filters.price_max);
    }

    if (filters?.lead_time_max) {
      query = query.lte('lead_time_days', filters.lead_time_max);
    }

    if (filters?.in_stock_only) {
      query = query.gt('stock_quantity', 0);
    }

    if (filters?.search_query) {
      query = query.or(`item_name.ilike.%${filters.search_query}%,item_code.ilike.%${filters.search_query}%,item_description.ilike.%${filters.search_query}%`);
    }

    // Sorting
    if (filters?.sort_by === 'price_asc') {
      query = query.order('unit_price', { ascending: true });
    } else if (filters?.sort_by === 'price_desc') {
      query = query.order('unit_price', { ascending: false });
    } else if (filters?.sort_by === 'lead_time') {
      query = query.order('lead_time_days', { ascending: true });
    } else {
      query = query.order('item_name');
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getItemById(itemId: string): Promise<MarketplaceItem | null> {
    if (USE_MOCK_DATA) {
      const items = getItemsWithDetails();
      return Promise.resolve(items.find(i => i.item_id === itemId) || null);
    }

    const { data, error } = await supabase
      .from('marketplace_items')
      .select(`
        *,
        category:marketplace_categories(*),
        supplier:marketplace_suppliers(*)
      `)
      .eq('item_id', itemId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // ============================================================================
  // SHOPPING CART
  // ============================================================================

  static async getCart(userId: string): Promise<MarketplaceCartItem[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(getCartWithDetails(userId));
    }

    const { data, error } = await supabase
      .from('marketplace_cart_items')
      .select(`
        *,
        item:marketplace_items(
          *,
          category:marketplace_categories(*),
          supplier:marketplace_suppliers(*)
        )
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async addToCart(userId: string, itemId: string, quantity: number): Promise<MarketplaceCartItem> {
    if (USE_MOCK_DATA) {
      // For mock data, simulate adding to cart
      const items = getItemsWithDetails();
      const item = items.find(i => i.item_id === itemId);
      if (!item) throw new Error('Item not found');

      const unitPrice = item.unit_price;
      const totalPrice = unitPrice * quantity;

      const newCartItem: MarketplaceCartItem = {
        cart_item_id: mockCartItems.length + 1,
        user_id: userId,
        item_id: itemId,
        item,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        added_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add to mock data (in-memory only)
      mockCartItems.push(newCartItem);

      return Promise.resolve(newCartItem);
    }

    const item = await this.getItemById(itemId);
    if (!item) throw new Error('Item not found');

    const unitPrice = item.unit_price;
    const totalPrice = unitPrice * quantity;

    const { data, error } = await supabase
      .from('marketplace_cart_items')
      .upsert({
        user_id: userId,
        item_id: itemId,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice
      }, {
        onConflict: 'user_id,item_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCartItem(cartItemId: number, quantity: number): Promise<void> {
    if (USE_MOCK_DATA) {
      // Update mock cart item
      const cartItem = mockCartItems.find(item => item.cart_item_id === cartItemId);
      if (cartItem) {
        cartItem.quantity = quantity;
        cartItem.total_price = cartItem.unit_price * quantity;
        cartItem.updated_at = new Date().toISOString();
      }
      return Promise.resolve();
    }

    const { data: cartItem, error: fetchError } = await supabase
      .from('marketplace_cart_items')
      .select('unit_price')
      .eq('cart_item_id', cartItemId)
      .single();

    if (fetchError) throw fetchError;

    const totalPrice = cartItem.unit_price * quantity;

    const { error } = await supabase
      .from('marketplace_cart_items')
      .update({
        quantity,
        total_price: totalPrice,
        updated_at: new Date().toISOString()
      })
      .eq('cart_item_id', cartItemId);

    if (error) throw error;
  }

  static async removeFromCart(cartItemId: number): Promise<void> {
    if (USE_MOCK_DATA) {
      // Remove from mock cart items array
      const index = mockCartItems.findIndex(item => item.cart_item_id === cartItemId);
      if (index > -1) {
        mockCartItems.splice(index, 1);
      }
      return Promise.resolve();
    }

    const { error } = await supabase
      .from('marketplace_cart_items')
      .delete()
      .eq('cart_item_id', cartItemId);

    if (error) throw error;
  }

  static async clearCart(userId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      // Remove all cart items for this user from mock data
      const userCartIndices: number[] = [];
      mockCartItems.forEach((item, index) => {
        if (item.user_id === userId) {
          userCartIndices.push(index);
        }
      });
      
      // Remove in reverse order to maintain correct indices
      for (let i = userCartIndices.length - 1; i >= 0; i--) {
        mockCartItems.splice(userCartIndices[i], 1);
      }
      
      return Promise.resolve();
    }

    const { error } = await supabase
      .from('marketplace_cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }

  static calculateCartSummary(cartItems: MarketplaceCartItem[]): CartSummary {
    const subtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);
    const tax = subtotal * 0.11; // 11% VAT
    const deliveryFee = 0; // Free delivery for now
    const total = subtotal + tax + deliveryFee;

    return {
      subtotal,
      tax,
      delivery_fee: deliveryFee,
      total,
      currency: 'IDR',
      item_count: cartItems.length
    };
  }

  // ============================================================================
  // PLN FACILITIES
  // ============================================================================

  static async getFacilities(): Promise<PLNFacility[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve([...mockPLNFacilities]);
    }

    const { data, error } = await supabase
      .from('marketplace_pln_facilities')
      .select('*')
      .eq('is_active', true)
      .order('facility_name');

    if (error) throw error;
    return data || [];
  }

  // ============================================================================
  // PURCHASE REQUESTS
  // ============================================================================

  static async createPR(
    userId: string,
    userName: string,
    department: string,
    facilityId: string,
    cartItems: MarketplaceCartItem[]
  ): Promise<{ pr_number: string; pr_id: number }> {
    if (USE_MOCK_DATA) {
      // Save PR locally without database
      const totalValue = cartItems.reduce((sum, item) => sum + item.total_price, 0);
      const prNumber = `PR-${Date.now()}`;
      const prId = getNextPRId();
      const now = new Date().toISOString();

      // Create PR header object
      const newPR: MarketplacePRHeader = {
        pr_id: prId,
        pr_number: prNumber,
        pr_date: now,
        requestor_id: userId,
        requestor_name: userName,
        department,
        delivery_facility_id: facilityId,
        total_value: totalValue,
        currency: 'IDR',
        pr_status: 'Draft', // Start as Draft for locally created PRs
        notes: 'Created from shopping cart',
        created_at: now,
        updated_at: now
      };

      // Add to local storage
      addLocalPR(newPR);

      return Promise.resolve({
        pr_number: prNumber,
        pr_id: prId
      });
    }

    const totalValue = cartItems.reduce((sum, item) => sum + item.total_price, 0);
    const prNumber = `PR-${Date.now()}`;

    // Create PR header with Pending Approval status
    const { data: prHeader, error: headerError } = await supabase
      .from('marketplace_pr_header')
      .insert({
        pr_number: prNumber,
        requestor_id: userId,
        requestor_name: userName,
        department,
        delivery_facility_id: facilityId,
        total_value: totalValue,
        pr_status: 'Pending Approval'
      })
      .select()
      .single();

    if (headerError) throw headerError;

    // Create PR lines
    const prLines = cartItems.map((item, index) => ({
      pr_id: prHeader.pr_id,
      line_number: index + 1,
      item_id: item.item_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price
    }));

    const { error: linesError } = await supabase
      .from('marketplace_pr_lines')
      .insert(prLines);

    if (linesError) throw linesError;

    // Initialize approval workflow based on PR value
    await this.initializeApprovalWorkflow(prHeader.pr_id!, totalValue, userName);

    return {
      pr_number: prNumber,
      pr_id: prHeader.pr_id!
    };
  }

  static async initializeApprovalWorkflow(prId: number, totalValue: number, userName: string): Promise<void> {
    // Define approval chain based on PR value
    let approvalChain: Array<{ level: number; role: string; approver_name: string }> = [];

    if (totalValue < 50000000) {
      // Less than 50M IDR: Department Head only
      approvalChain = [
        { level: 1, role: 'Department Head', approver_name: 'Budi Santoso' }
      ];
    } else if (totalValue < 100000000) {
      // 50M - 100M IDR: Department Head + Procurement Manager
      approvalChain = [
        { level: 1, role: 'Department Head', approver_name: 'Budi Santoso' },
        { level: 2, role: 'Procurement Manager', approver_name: 'Siti Rahayu' }
      ];
    } else if (totalValue < 500000000) {
      // 100M - 500M IDR: Department Head + Procurement Manager + Finance Director
      approvalChain = [
        { level: 1, role: 'Department Head', approver_name: 'Budi Santoso' },
        { level: 2, role: 'Procurement Manager', approver_name: 'Siti Rahayu' },
        { level: 3, role: 'Finance Director', approver_name: 'Ahmad Wijaya' }
      ];
    } else {
      // More than 500M IDR: Full approval chain
      approvalChain = [
        { level: 1, role: 'Department Head', approver_name: 'Budi Santoso' },
        { level: 2, role: 'Procurement Manager', approver_name: 'Siti Rahayu' },
        { level: 3, role: 'Finance Director', approver_name: 'Ahmad Wijaya' },
        { level: 4, role: 'Managing Director', approver_name: 'Ir. Rudi Hermawan' }
      ];
    }

    // Create approval records
    const approvalRecords = approvalChain.map(approver => ({
      pr_id: prId,
      approval_level: approver.level,
      approver_id: `user_${approver.role.toLowerCase().replace(/\s+/g, '_')}`,
      approver_name: approver.approver_name,
      approver_role: approver.role,
      approval_status: 'Pending'
    }));

    const { error: approvalError } = await supabase
      .from('marketplace_pr_approvals')
      .insert(approvalRecords);

    if (approvalError) throw approvalError;
  }

  static async getPRs(userId?: string): Promise<MarketplacePRHeader[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(getPRsWithDetails(userId));
    }

    let query = supabase
      .from('marketplace_pr_header')
      .select(`
        *,
        delivery_facility:marketplace_pln_facilities(*)
      `)
      .order('pr_date', { ascending: false });

    if (userId) {
      query = query.eq('requestor_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getPRById(prId: number): Promise<any> {
    if (USE_MOCK_DATA) {
      // Get all PRs with details
      const allPRs = getPRsWithDetails();

      // Find the PR by ID
      const pr = allPRs.find(p => p.pr_id === prId);

      if (!pr) {
        return null;
      }

      // Return the PR with all details already populated
      return Promise.resolve(pr);
    }

    const { data, error } = await supabase
      .from('marketplace_pr_header')
      .select(`
        *,
        delivery_facility:marketplace_pln_facilities(*),
        lines:marketplace_pr_lines(
          *,
          item:marketplace_items(
            *,
            category:marketplace_categories(*),
            supplier:marketplace_suppliers(*)
          )
        ),
        approvals:marketplace_pr_approvals(*)
      `)
      .eq('pr_id', prId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getPRWithApprovals(prId: number): Promise<any> {
    const pr = await this.getPRById(prId);

    if (pr && pr.approvals) {
      pr.approvals.sort((a: any, b: any) => a.approval_level - b.approval_level);

      const currentApproval = pr.approvals.find((a: any) => a.approval_status === 'Pending');
      pr.current_approval_level = currentApproval?.approval_level || null;
      pr.current_approver = currentApproval?.approver_name || null;
      pr.current_approver_role = currentApproval?.approver_role || null;
    }

    return pr;
  }

  static async getPRStatusSummary(userId?: string): Promise<PRStatusSummary> {
    if (USE_MOCK_DATA) {
      // Combine predefined mock PRs with locally created PRs
      const allPRs = [...mockPRHeaders, ...getLocalPRs()];
      
      // If userId provided, filter the data
      const filteredPRs = userId 
        ? allPRs.filter(pr => pr.requestor_id === userId)
        : allPRs;
      
      const summary: PRStatusSummary = {
        total: filteredPRs.length,
        draft: filteredPRs.filter(pr => pr.pr_status === 'Draft').length,
        pending_approval: filteredPRs.filter(pr => pr.pr_status === 'Pending Approval').length,
        approved: filteredPRs.filter(pr => pr.pr_status === 'Approved').length,
        rejected: filteredPRs.filter(pr => pr.pr_status === 'Rejected').length,
        in_procurement: filteredPRs.filter(pr => pr.pr_status === 'In Procurement').length,
        completed: filteredPRs.filter(pr => pr.pr_status === 'Completed').length,
        cancelled: filteredPRs.filter(pr => pr.pr_status === 'Cancelled').length
      };
      return Promise.resolve(summary);
    }

    let query = supabase
      .from('marketplace_pr_header')
      .select('pr_status');

    if (userId) {
      query = query.eq('requestor_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const summary: PRStatusSummary = {
      total: data?.length || 0,
      draft: 0,
      pending_approval: 0,
      approved: 0,
      rejected: 0,
      in_procurement: 0,
      completed: 0,
      cancelled: 0
    };

    data?.forEach(pr => {
      switch (pr.pr_status) {
        case 'Draft':
          summary.draft++;
          break;
        case 'Pending Approval':
          summary.pending_approval++;
          break;
        case 'Approved':
          summary.approved++;
          break;
        case 'Rejected':
          summary.rejected++;
          break;
        case 'In Procurement':
          summary.in_procurement++;
          break;
        case 'Completed':
          summary.completed++;
          break;
        case 'Cancelled':
          summary.cancelled++;
          break;
      }
    });

    return summary;
  }

  // ============================================================================
  // ORDERS
  // ============================================================================

  static async getOrders(userId?: string): Promise<MarketplaceOrder[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(getOrdersWithDetails());
    }

    const { data, error } = await supabase
      .from('marketplace_orders')
      .select(`
        *,
        supplier:marketplace_suppliers(*),
        delivery_facility:marketplace_pln_facilities(*)
      `)
      .order('order_placed_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getOrderStatusSummary(): Promise<OrderStatusSummary> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockOrderStatusSummary);
    }

    const { data, error } = await supabase
      .from('marketplace_orders')
      .select('current_status, is_delayed');

    if (error) throw error;

    const summary: OrderStatusSummary = {
      total: data?.length || 0,
      order_placed: 0,
      processing: 0,
      shipped: 0,
      delivery: 0,
      arrived: 0,
      delayed: 0
    };

    data?.forEach(order => {
      if (order.is_delayed) summary.delayed++;

      switch (order.current_status) {
        case 'ORDER_PLACED':
          summary.order_placed++;
          break;
        case 'PROCESSING_ORDER':
          summary.processing++;
          break;
        case 'SHIPPED':
          summary.shipped++;
          break;
        case 'DELIVERY':
          summary.delivery++;
          break;
        case 'ARRIVED_AT_DESTINATION':
          summary.arrived++;
          break;
      }
    });

    return summary;
  }
}
