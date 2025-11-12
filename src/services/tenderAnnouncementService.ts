import mockData from '../data/eprocurementMockData.json';

export interface TenderAnnouncement {
  id: string;
  sourcing_event_id: string;
  title: string;
  header?: string;
  opener?: string;
  body?: string;
  closing?: string;
  publication_date?: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Published' | 'Closed';
  target_vendors: string[];
  approved_by?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export class TenderAnnouncementService {
  private static getMockAnnouncements(): TenderAnnouncement[] {
    return mockData.tenderAnnouncements as TenderAnnouncement[];
  }

  static async getAllAnnouncements(organizationId: string): Promise<TenderAnnouncement[]> {
    const announcements = this.getMockAnnouncements();
    return announcements.filter(a => a.organization_id === organizationId);
  }

  static async getAnnouncementById(id: string): Promise<TenderAnnouncement | null> {
    const announcements = this.getMockAnnouncements();
    return announcements.find(a => a.id === id) || null;
  }

  static async getAnnouncementBySourcingEvent(sourcingEventId: string): Promise<TenderAnnouncement | null> {
    const announcements = this.getMockAnnouncements();
    return announcements.find(a => a.sourcing_event_id === sourcingEventId) || null;
  }

  static async getPublishedAnnouncements(organizationId: string): Promise<TenderAnnouncement[]> {
    const announcements = await this.getAllAnnouncements(organizationId);
    return announcements.filter(a => a.status === 'Published');
  }

  static async createAnnouncement(
    announcement: Omit<TenderAnnouncement, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TenderAnnouncement> {
    const newAnnouncement: TenderAnnouncement = {
      ...announcement,
      id: `TA-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newAnnouncement;
  }

  static async updateAnnouncement(
    id: string,
    updates: Partial<TenderAnnouncement>
  ): Promise<TenderAnnouncement> {
    const existing = await this.getAnnouncementById(id);
    if (!existing) throw new Error('Announcement not found');
    return { ...existing, ...updates, updated_at: new Date().toISOString() };
  }

  static async deleteAnnouncement(id: string): Promise<void> {
    return;
  }

  static async publishAnnouncement(id: string, approvedBy: string): Promise<TenderAnnouncement> {
    return this.updateAnnouncement(id, {
      status: 'Published',
      approved_by: approvedBy,
      publication_date: new Date().toISOString().split('T')[0]
    });
  }

  static async getAnnouncementsByDateRange(
    organizationId: string,
    startDate: string,
    endDate: string
  ): Promise<TenderAnnouncement[]> {
    const announcements = await this.getAllAnnouncements(organizationId);
    return announcements.filter(a => {
      if (!a.publication_date) return false;
      return a.publication_date >= startDate && a.publication_date <= endDate;
    });
  }
}
