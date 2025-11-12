import mockData from '../data/eprocurementMockData.json';

export interface ReverseAuction {
  id: string;
  tender_id: string;
  auction_structure?: any;
  bid_fields: any[];
  rules?: any;
  start_date?: string;
  end_date?: string;
  status: 'Draft' | 'Approved' | 'Published' | 'Active' | 'Closed';
  approved_by?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuctionBid {
  id: string;
  auction_id: string;
  vendor_id: string;
  bid_amount: number;
  bid_details?: any;
  bid_time: string;
  rank?: number;
  organization_id: string;
}

export class ReverseAuctionService {
  private static getMockAuctions(): ReverseAuction[] {
    return mockData.reverseAuctions as ReverseAuction[];
  }

  private static getMockBids(): AuctionBid[] {
    return mockData.auctionBids as AuctionBid[];
  }

  static async getAllAuctions(organizationId: string): Promise<ReverseAuction[]> {
    const auctions = this.getMockAuctions();
    return auctions.filter(a => a.organization_id === organizationId);
  }

  static async getAuctionById(id: string): Promise<ReverseAuction | null> {
    const auctions = this.getMockAuctions();
    return auctions.find(a => a.id === id) || null;
  }

  static async getAuctionByTender(tenderId: string): Promise<ReverseAuction | null> {
    const auctions = this.getMockAuctions();
    return auctions.find(a => a.tender_id === tenderId) || null;
  }

  static async getActiveAuctions(organizationId: string): Promise<ReverseAuction[]> {
    const auctions = await this.getAllAuctions(organizationId);
    return auctions.filter(a => a.status === 'Active');
  }

  static async createAuction(
    auction: Omit<ReverseAuction, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ReverseAuction> {
    const newAuction: ReverseAuction = {
      ...auction,
      id: `RA-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newAuction;
  }

  static async updateAuction(
    id: string,
    updates: Partial<ReverseAuction>
  ): Promise<ReverseAuction> {
    const existing = await this.getAuctionById(id);
    if (!existing) throw new Error('Auction not found');
    return { ...existing, ...updates, updated_at: new Date().toISOString() };
  }

  static async deleteAuction(id: string): Promise<void> {
    return;
  }

  static async publishAuction(id: string, approvedBy: string): Promise<ReverseAuction> {
    return this.updateAuction(id, {
      status: 'Active',
      approved_by: approvedBy
    });
  }

  static async closeAuction(id: string): Promise<ReverseAuction> {
    return this.updateAuction(id, {
      status: 'Closed'
    });
  }

  static async getBidsByAuction(auctionId: string): Promise<AuctionBid[]> {
    const bids = this.getMockBids();
    return bids.filter(b => b.auction_id === auctionId).sort((a, b) => a.bid_amount - b.bid_amount);
  }

  static async getBidsByVendor(auctionId: string, vendorId: string): Promise<AuctionBid[]> {
    const bids = await this.getBidsByAuction(auctionId);
    return bids.filter(b => b.vendor_id === vendorId);
  }

  static async getLowestBid(auctionId: string): Promise<AuctionBid | null> {
    const bids = await this.getBidsByAuction(auctionId);
    return bids.length > 0 ? bids[0] : null;
  }

  static async createBid(
    bid: Omit<AuctionBid, 'id' | 'bid_time'>
  ): Promise<AuctionBid> {
    const newBid: AuctionBid = {
      ...bid,
      id: `BID-${Date.now()}`,
      bid_time: new Date().toISOString()
    };

    await this.updateBidRankings(bid.auction_id);
    return newBid;
  }

  static async updateBidRankings(auctionId: string): Promise<void> {
    return;
  }

  static async getAuctionLeaderboard(auctionId: string): Promise<{
    vendor_id: string;
    lowest_bid: number;
    total_bids: number;
    current_rank: number;
  }[]> {
    const bids = await this.getBidsByAuction(auctionId);

    const vendorBidsMap = new Map<string, AuctionBid[]>();
    bids.forEach(bid => {
      if (!vendorBidsMap.has(bid.vendor_id)) {
        vendorBidsMap.set(bid.vendor_id, []);
      }
      vendorBidsMap.get(bid.vendor_id)!.push(bid);
    });

    const leaderboard = Array.from(vendorBidsMap.entries()).map(([vendorId, vendorBids]) => {
      const lowestBid = Math.min(...vendorBids.map(b => b.bid_amount));
      return {
        vendor_id: vendorId,
        lowest_bid: lowestBid,
        total_bids: vendorBids.length,
        current_rank: 0
      };
    });

    leaderboard.sort((a, b) => a.lowest_bid - b.lowest_bid);
    leaderboard.forEach((item, index) => {
      item.current_rank = index + 1;
    });

    return leaderboard;
  }
}
