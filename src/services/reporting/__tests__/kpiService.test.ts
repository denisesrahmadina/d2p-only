/**
 * KPI Service Tests
 * Testing KPI data operations and calculations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KPIService } from '../kpiService';
import type { KPI } from '../kpiService';

// Mock Supabase client
vi.mock('../../supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => Promise.resolve({ data: mockKPI, error: null }))
        })),
        order: vi.fn(() => Promise.resolve({ data: [mockKPI], error: null }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: mockKPI, error: null }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    }))
  }
}));

const mockKPI: KPI = {
  kpi_id: 'test-kpi-1',
  kpi_code: 'KPI-TEST-001',
  kpi_name: 'Test KPI',
  kpi_category: 'Performance',
  initiative_category: 'Cost Efficiency',
  unit_of_measure: 'Percentage',
  target_value: 100,
  actual_value: 85,
  achievement_percentage: 85,
  threshold_critical: 50,
  threshold_warning: 75,
  threshold_target: 100,
  timeline_start: '2024-01-01',
  timeline_end: '2024-12-31',
  frequency: 'Monthly',
  kpi_status: 'Active'
};

describe('KPIService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getKPIById', () => {
    it('should retrieve a KPI by ID', async () => {
      const kpi = await KPIService.getKPIById('test-kpi-1');
      expect(kpi).toBeDefined();
      expect(kpi?.kpi_code).toBe('KPI-TEST-001');
    });
  });

  describe('getKPISummary', () => {
    it('should calculate KPI summary statistics correctly', async () => {
      const summary = await KPIService.getKPISummary();
      expect(summary).toHaveProperty('total_kpis');
      expect(summary).toHaveProperty('on_track');
      expect(summary).toHaveProperty('at_risk');
      expect(summary).toHaveProperty('critical');
      expect(summary).toHaveProperty('avg_achievement');
    });
  });

  describe('exportKPIsToCSV', () => {
    it('should generate CSV output with headers', async () => {
      const csv = await KPIService.exportKPIsToCSV();
      expect(csv).toContain('KPI Code');
      expect(csv).toContain('KPI Name');
      expect(csv).toContain('Achievement');
    });
  });
});
