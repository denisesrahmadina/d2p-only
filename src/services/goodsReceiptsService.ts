import goodsReceiptsData from '../data/goodsReceipts.json';

export interface GoodsReceipt {
  id: string;
  poNumber: string;
  vendor: string;
  items: string;
  quantity: string;
  status: 'Received' | 'Pending Inspection' | 'Inspected';
  receivedBy: string;
  receivedDate: string;
  inspectionStatus: 'Passed' | 'Pending' | 'Approved';
}

export class GoodsReceiptsService {
  /**
   * Get all goods receipts
   */
  static async getGoodsReceipts(): Promise<GoodsReceipt[]> {
    return goodsReceiptsData as GoodsReceipt[];
  }

  /**
   * Get goods receipt by ID
   */
  static async getGoodsReceiptById(id: string): Promise<GoodsReceipt | undefined> {
    const receipts = await this.getGoodsReceipts();
    return receipts.find(receipt => receipt.id === id);
  }

  /**
   * Get goods receipts by status
   */
  static async getGoodsReceiptsByStatus(status: string): Promise<GoodsReceipt[]> {
    const receipts = await this.getGoodsReceipts();
    return receipts.filter(receipt => receipt.status === status);
  }

  /**
   * Get goods receipts by PO number
   */
  static async getGoodsReceiptsByPO(poNumber: string): Promise<GoodsReceipt[]> {
    const receipts = await this.getGoodsReceipts();
    return receipts.filter(receipt => 
      receipt.poNumber.toLowerCase().includes(poNumber.toLowerCase())
    );
  }

  /**
   * Get goods receipts by vendor
   */
  static async getGoodsReceiptsByVendor(vendor: string): Promise<GoodsReceipt[]> {
    const receipts = await this.getGoodsReceipts();
    return receipts.filter(receipt => 
      receipt.vendor.toLowerCase().includes(vendor.toLowerCase())
    );
  }

  /**
   * Get goods receipts by inspection status
   */
  static async getGoodsReceiptsByInspectionStatus(inspectionStatus: string): Promise<GoodsReceipt[]> {
    const receipts = await this.getGoodsReceipts();
    return receipts.filter(receipt => receipt.inspectionStatus === inspectionStatus);
  }

  /**
   * Search goods receipts
   */
  static async searchGoodsReceipts(query: string): Promise<GoodsReceipt[]> {
    const receipts = await this.getGoodsReceipts();
    const lowerQuery = query.toLowerCase();
    return receipts.filter(receipt => 
      receipt.vendor.toLowerCase().includes(lowerQuery) ||
      receipt.items.toLowerCase().includes(lowerQuery) ||
      receipt.poNumber.toLowerCase().includes(lowerQuery) ||
      receipt.receivedBy.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get goods receipts summary
   */
  static async getGoodsReceiptsSummary(): Promise<{
    total: number;
    received: number;
    pendingInspection: number;
    inspected: number;
    byInspectionStatus: { [status: string]: number };
  }> {
    const receipts = await this.getGoodsReceipts();
    
    const byInspectionStatus: { [status: string]: number } = {};
    receipts.forEach(receipt => {
      byInspectionStatus[receipt.inspectionStatus] = (byInspectionStatus[receipt.inspectionStatus] || 0) + 1;
    });

    return {
      total: receipts.length,
      received: receipts.filter(r => r.status === 'Received').length,
      pendingInspection: receipts.filter(r => r.status === 'Pending Inspection').length,
      inspected: receipts.filter(r => r.status === 'Inspected').length,
      byInspectionStatus
    };
  }
}