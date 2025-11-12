export interface ProcurementRequest {
  id: string;
  requestId: string;
  unit: string;
  material: string;
  category: string;
  vendor: string;
  value: number;
  deliveryDate: string;
  type: 'CAPEX' | 'OPEX';
  priority: 'High' | 'Medium' | 'Low';
  specifications?: string;
  region?: string;
  projectId?: string;
}

export interface BundleGroup {
  id: string;
  name: string;
  criteria: string[];
  requests: ProcurementRequest[];
  totalValue: number;
  responsiblePlanner: string;
  status: 'Draft' | 'Finalized' | 'Converted to Sourcing Event';
  aiInsight: string;
  estimatedEfficiency: number;
  sourcingEventId?: string;
}

export class AIBundlingService {
  static generateMockProcurementRequests(): ProcurementRequest[] {
    return [
      {
        id: 'pr-001',
        requestId: 'PR-001',
        unit: 'Plant A - Suralaya',
        material: 'Gas Turbine Blade Set',
        category: 'Mechanical Equipment',
        vendor: 'Siemens Energy',
        value: 12.5,
        deliveryDate: '2025-06-20',
        type: 'CAPEX',
        priority: 'High',
        specifications: 'SGT-800 series, heat-resistant alloy',
        region: 'West Java',
        projectId: 'PRJ-2025-001'
      },
      {
        id: 'pr-002',
        requestId: 'PR-002',
        unit: 'Plant B - Saguling',
        material: 'Feedwater Pump',
        category: 'Mechanical Equipment',
        vendor: 'KSB Indonesia',
        value: 5.3,
        deliveryDate: '2025-07-10',
        type: 'CAPEX',
        priority: 'Medium',
        specifications: 'Multi-stage centrifugal, 350m3/h',
        region: 'West Java'
      },
      {
        id: 'pr-003',
        requestId: 'PR-003',
        unit: 'Plant A - Suralaya',
        material: 'Generator Rotor Assembly',
        category: 'Mechanical Equipment',
        vendor: 'Siemens Energy',
        value: 7.3,
        deliveryDate: '2025-06-25',
        type: 'CAPEX',
        priority: 'High',
        specifications: 'Air-cooled, 150 MW capacity',
        region: 'West Java',
        projectId: 'PRJ-2025-001'
      },
      {
        id: 'pr-004',
        requestId: 'PR-004',
        unit: 'Plant C - Kamojang',
        material: 'Medium Voltage Switchgear',
        category: 'Electrical Equipment',
        vendor: 'ABB Indonesia',
        value: 3.4,
        deliveryDate: '2025-08-05',
        type: 'CAPEX',
        priority: 'Medium',
        specifications: '20kV, metal-enclosed, arc-resistant',
        region: 'West Java'
      },
      {
        id: 'pr-005',
        requestId: 'PR-005',
        unit: 'Plant D - Cirata',
        material: 'DCS Control Panel',
        category: 'Electrical Equipment',
        vendor: 'ABB Indonesia',
        value: 2.8,
        deliveryDate: '2025-07-25',
        type: 'CAPEX',
        priority: 'High',
        specifications: 'Symphony Plus platform, redundant controllers',
        region: 'West Java'
      },
      {
        id: 'pr-006',
        requestId: 'PR-006',
        unit: 'Plant E - Priok',
        material: 'Heat Recovery Steam Generator',
        category: 'Mechanical Equipment',
        vendor: 'Siemens Energy',
        value: 18.2,
        deliveryDate: '2025-06-18',
        type: 'CAPEX',
        priority: 'High',
        specifications: 'Triple pressure, horizontal design',
        region: 'Jakarta',
        projectId: 'PRJ-2025-001'
      },
      {
        id: 'pr-007',
        requestId: 'PR-007',
        unit: 'Plant F - Muara Karang',
        material: 'Solar PV Inverters',
        category: 'Renewable Equipment',
        vendor: 'Huawei Technologies',
        value: 4.7,
        deliveryDate: '2025-09-15',
        type: 'CAPEX',
        priority: 'Medium',
        specifications: '1500V string inverters, 98.6% efficiency',
        region: 'Jakarta'
      },
      {
        id: 'pr-008',
        requestId: 'PR-008',
        unit: 'Plant G - Cilegon',
        material: 'Variable Frequency Drives',
        category: 'Electrical Equipment',
        vendor: 'ABB Indonesia',
        value: 1.9,
        deliveryDate: '2025-08-10',
        type: 'CAPEX',
        priority: 'Low',
        specifications: 'ACS880, 690V, IP54 enclosure',
        region: 'Banten'
      },
      {
        id: 'pr-009',
        requestId: 'PR-009',
        unit: 'Plant H - Labuan',
        material: 'Cooling Tower Replacement',
        category: 'Mechanical Equipment',
        vendor: 'SPX Cooling Technologies',
        value: 6.8,
        deliveryDate: '2025-10-05',
        type: 'CAPEX',
        priority: 'Medium',
        specifications: 'Induced draft, 50,000 GPM capacity',
        region: 'Banten'
      },
      {
        id: 'pr-010',
        requestId: 'PR-010',
        unit: 'Plant I - Lontar',
        material: 'Battery Energy Storage System',
        category: 'Renewable Equipment',
        vendor: 'BYD Energy',
        value: 15.6,
        deliveryDate: '2025-09-20',
        type: 'CAPEX',
        priority: 'High',
        specifications: 'Lithium Iron Phosphate, 50MWh capacity',
        region: 'Banten'
      },
      {
        id: 'pr-011',
        requestId: 'PR-011',
        unit: 'Plant J - Gresik',
        material: 'Emergency Diesel Generator',
        category: 'Mechanical Equipment',
        vendor: 'Caterpillar',
        value: 3.2,
        deliveryDate: '2025-08-30',
        type: 'CAPEX',
        priority: 'High',
        specifications: '2000 kVA, diesel engine, ATS included',
        region: 'East Java'
      },
      {
        id: 'pr-012',
        requestId: 'PR-012',
        unit: 'Plant K - Paiton',
        material: 'Electrostatic Precipitator',
        category: 'Environmental Equipment',
        vendor: 'GE Power',
        value: 8.9,
        deliveryDate: '2025-11-10',
        type: 'CAPEX',
        priority: 'High',
        specifications: '99.9% efficiency, dry type',
        region: 'East Java'
      },
      {
        id: 'pr-013',
        requestId: 'PR-013',
        unit: 'Plant L - Grati',
        material: 'Wind Turbine Components',
        category: 'Renewable Equipment',
        vendor: 'Vestas Indonesia',
        value: 22.4,
        deliveryDate: '2025-09-10',
        type: 'CAPEX',
        priority: 'High',
        specifications: 'V150-4.2MW, blade and nacelle assembly',
        region: 'East Java'
      },
      {
        id: 'pr-014',
        requestId: 'PR-014',
        unit: 'Plant M - Lombok',
        material: 'Transformer 150 MVA',
        category: 'Electrical Equipment',
        vendor: 'Schneider Electric',
        value: 4.5,
        deliveryDate: '2025-10-20',
        type: 'CAPEX',
        priority: 'Medium',
        specifications: '150/20kV, ONAN/ONAF cooling',
        region: 'Nusa Tenggara'
      },
      {
        id: 'pr-015',
        requestId: 'PR-015',
        unit: 'Plant N - Makassar',
        material: 'Steam Turbine Upgrade Kit',
        category: 'Mechanical Equipment',
        vendor: 'Siemens Energy',
        value: 9.7,
        deliveryDate: '2025-06-30',
        type: 'CAPEX',
        priority: 'High',
        specifications: 'Advanced blade design, efficiency improvement package',
        region: 'Sulawesi',
        projectId: 'PRJ-2025-001'
      }
    ];
  }

  static analyzeBundlingOpportunities(requests: ProcurementRequest[]): BundleGroup[] {
    const bundles: BundleGroup[] = [];

    // Criterion 1: Group by same vendor
    const vendorGroups = this.groupByVendor(requests);

    // Criterion 2: Group by category and delivery window
    const categoryTimeGroups = this.groupByCategoryAndTime(requests);

    // Criterion 3: Group by project ID
    const projectGroups = this.groupByProject(requests);

    // Criterion 4: Group by region and type
    const regionTypeGroups = this.groupByRegionAndType(requests);

    // Merge and prioritize bundles
    const allGroups = [
      ...vendorGroups,
      ...projectGroups,
      ...categoryTimeGroups,
      ...regionTypeGroups
    ];

    // Remove duplicates and keep best bundles
    const processedBundles = this.consolidateBundles(allGroups);

    return processedBundles;
  }

  private static groupByVendor(requests: ProcurementRequest[]): BundleGroup[] {
    const vendorMap = new Map<string, ProcurementRequest[]>();

    requests.forEach(req => {
      if (!vendorMap.has(req.vendor)) {
        vendorMap.set(req.vendor, []);
      }
      vendorMap.get(req.vendor)!.push(req);
    });

    const bundles: BundleGroup[] = [];
    vendorMap.forEach((reqs, vendor) => {
      if (reqs.length >= 2) {
        const totalValue = reqs.reduce((sum, r) => sum + r.value, 0);
        const efficiency = this.calculateEfficiency(reqs.length, totalValue);

        bundles.push({
          id: `bundle-vendor-${vendor.replace(/\s+/g, '-').toLowerCase()}`,
          name: `${vendor} Equipment Package`,
          criteria: ['Same Vendor', 'Volume Discount Potential'],
          requests: reqs,
          totalValue,
          responsiblePlanner: 'Auto-assigned',
          status: 'Draft',
          aiInsight: `AI grouped ${reqs.length} items from ${vendor} to leverage volume pricing. Combined procurement enables ${efficiency}% cost efficiency through vendor consolidation and reduced administrative overhead. Delivery schedules align within ${this.calculateDateRange(reqs)} days.`,
          estimatedEfficiency: efficiency
        });
      }
    });

    return bundles;
  }

  private static groupByProject(requests: ProcurementRequest[]): BundleGroup[] {
    const projectMap = new Map<string, ProcurementRequest[]>();

    requests.forEach(req => {
      if (req.projectId) {
        if (!projectMap.has(req.projectId)) {
          projectMap.set(req.projectId, []);
        }
        projectMap.get(req.projectId)!.push(req);
      }
    });

    const bundles: BundleGroup[] = [];
    projectMap.forEach((reqs, projectId) => {
      if (reqs.length >= 2) {
        const totalValue = reqs.reduce((sum, r) => sum + r.value, 0);
        const efficiency = this.calculateEfficiency(reqs.length, totalValue);

        bundles.push({
          id: `bundle-project-${projectId}`,
          name: `${projectId} Integrated Package`,
          criteria: ['Same Project', 'Funding Source Alignment'],
          requests: reqs,
          totalValue,
          responsiblePlanner: 'Auto-assigned',
          status: 'Draft',
          aiInsight: `AI identified ${reqs.length} items under ${projectId} with shared funding source and timeline. Bundling reduces project coordination complexity and enables ${efficiency}% efficiency through unified procurement management and synchronized delivery schedules.`,
          estimatedEfficiency: efficiency
        });
      }
    });

    return bundles;
  }

  private static groupByCategoryAndTime(requests: ProcurementRequest[]): BundleGroup[] {
    const categoryGroups = new Map<string, ProcurementRequest[]>();

    requests.forEach(req => {
      const key = `${req.category}-${req.type}`;
      if (!categoryGroups.has(key)) {
        categoryGroups.set(key, []);
      }
      categoryGroups.get(key)!.push(req);
    });

    const bundles: BundleGroup[] = [];
    categoryGroups.forEach((reqs, key) => {
      const [category, type] = key.split('-');

      // Further filter by delivery window (within 60 days)
      const timeGroups = this.groupByTimeWindow(reqs, 60);

      timeGroups.forEach(group => {
        if (group.length >= 2) {
          const totalValue = group.reduce((sum, r) => sum + r.value, 0);
          const efficiency = this.calculateEfficiency(group.length, totalValue);

          bundles.push({
            id: `bundle-category-${key}-${Date.now()}`,
            name: `${category} - ${type} Bundle`,
            criteria: ['Same Category', 'Similar Delivery Period', 'Procurement Type Match'],
            requests: group,
            totalValue,
            responsiblePlanner: 'Auto-assigned',
            status: 'Draft',
            aiInsight: `AI bundled ${group.length} ${category} items with ${type} classification. Delivery dates align within ${this.calculateDateRange(group)} days enabling ${efficiency}% efficiency through standardized technical specifications and consolidated evaluation process.`,
            estimatedEfficiency: efficiency
          });
        }
      });
    });

    return bundles;
  }

  private static groupByRegionAndType(requests: ProcurementRequest[]): BundleGroup[] {
    const regionMap = new Map<string, ProcurementRequest[]>();

    requests.forEach(req => {
      if (req.region) {
        const key = `${req.region}-${req.category}`;
        if (!regionMap.has(key)) {
          regionMap.set(key, []);
        }
        regionMap.get(key)!.push(req);
      }
    });

    const bundles: BundleGroup[] = [];
    regionMap.forEach((reqs, key) => {
      if (reqs.length >= 2) {
        const [region, category] = key.split('-');
        const totalValue = reqs.reduce((sum, r) => sum + r.value, 0);
        const efficiency = this.calculateEfficiency(reqs.length, totalValue);

        bundles.push({
          id: `bundle-region-${key}`,
          name: `${region} ${category} Package`,
          criteria: ['Same Region', 'Logistics Optimization', 'Category Match'],
          requests: reqs,
          totalValue,
          responsiblePlanner: 'Auto-assigned',
          status: 'Draft',
          aiInsight: `AI grouped ${reqs.length} items in ${region} region for ${category}. Geographic bundling enables ${efficiency}% efficiency through optimized logistics, reduced shipping costs, and unified installation planning across ${reqs.length} units.`,
          estimatedEfficiency: efficiency
        });
      }
    });

    return bundles;
  }

  private static groupByTimeWindow(requests: ProcurementRequest[], windowDays: number): ProcurementRequest[][] {
    const sorted = [...requests].sort((a, b) =>
      new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()
    );

    const groups: ProcurementRequest[][] = [];
    let currentGroup: ProcurementRequest[] = [];

    sorted.forEach(req => {
      if (currentGroup.length === 0) {
        currentGroup.push(req);
      } else {
        const firstDate = new Date(currentGroup[0].deliveryDate).getTime();
        const reqDate = new Date(req.deliveryDate).getTime();
        const daysDiff = Math.abs(reqDate - firstDate) / (1000 * 60 * 60 * 24);

        if (daysDiff <= windowDays) {
          currentGroup.push(req);
        } else {
          if (currentGroup.length >= 2) {
            groups.push([...currentGroup]);
          }
          currentGroup = [req];
        }
      }
    });

    if (currentGroup.length >= 2) {
      groups.push(currentGroup);
    }

    return groups;
  }

  private static consolidateBundles(allBundles: BundleGroup[]): BundleGroup[] {
    const usedRequestIds = new Set<string>();
    const finalBundles: BundleGroup[] = [];

    // Sort by efficiency and value
    const sorted = allBundles.sort((a, b) => {
      const scoreA = a.estimatedEfficiency * a.totalValue;
      const scoreB = b.estimatedEfficiency * b.totalValue;
      return scoreB - scoreA;
    });

    sorted.forEach(bundle => {
      const hasOverlap = bundle.requests.some(req => usedRequestIds.has(req.id));

      if (!hasOverlap) {
        bundle.requests.forEach(req => usedRequestIds.add(req.id));
        finalBundles.push(bundle);
      }
    });

    return finalBundles;
  }

  private static calculateEfficiency(itemCount: number, totalValue: number): number {
    let efficiency = 0;

    // Base efficiency from consolidation
    efficiency += Math.min(itemCount * 2, 10);

    // Additional efficiency for high-value bundles
    if (totalValue > 20) {
      efficiency += 5;
    } else if (totalValue > 10) {
      efficiency += 3;
    }

    // Bonus for larger bundles
    if (itemCount >= 4) {
      efficiency += 4;
    } else if (itemCount >= 3) {
      efficiency += 2;
    }

    return Math.min(Math.round(efficiency), 25);
  }

  private static calculateDateRange(requests: ProcurementRequest[]): number {
    const dates = requests.map(r => new Date(r.deliveryDate).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    return Math.round((maxDate - minDate) / (1000 * 60 * 60 * 24));
  }

  static getUnbundledRequests(
    allRequests: ProcurementRequest[],
    bundles: BundleGroup[]
  ): ProcurementRequest[] {
    const bundledIds = new Set<string>();
    bundles.forEach(bundle => {
      bundle.requests.forEach(req => bundledIds.add(req.id));
    });

    return allRequests.filter(req => !bundledIds.has(req.id));
  }

  static generateSourcingEventId(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `SRC-${year}-${randomNum}`;
  }

  static generateBundlingInsight(requests: ProcurementRequest[]): string {
    if (requests.length === 0) {
      return 'No requests in bundle';
    }

    const totalValue = requests.reduce((sum, r) => sum + r.value, 0);
    const categories = [...new Set(requests.map(r => r.category))];
    const vendors = [...new Set(requests.map(r => r.vendor))];
    const dateRange = this.calculateDateRange(requests);
    const efficiency = this.calculateEfficiency(requests.length, totalValue);

    if (vendors.length === 1) {
      return `Bundle contains ${requests.length} items from ${vendors[0]} with combined value of ${totalValue.toFixed(1)} Bn IDR. Single-vendor consolidation enables ${efficiency}% cost efficiency through volume pricing and reduced administrative overhead. Delivery schedules align within ${dateRange} days.`;
    } else if (categories.length === 1) {
      return `Bundle groups ${requests.length} ${categories[0]} items from ${vendors.length} vendors. Category-based bundling enables ${efficiency}% efficiency through standardized specifications and consolidated technical evaluation. Total value: ${totalValue.toFixed(1)} Bn IDR, delivery window: ${dateRange} days.`;
    } else {
      return `Mixed bundle of ${requests.length} items across ${categories.length} categories with ${efficiency}% estimated efficiency. Total value: ${totalValue.toFixed(1)} Bn IDR. Bundling reduces procurement cycles and enables consolidated vendor management across ${vendors.length} suppliers.`;
    }
  }

  static createManualBundle(requests: ProcurementRequest[], bundleName: string): BundleGroup {
    const totalValue = requests.reduce((sum, r) => sum + r.value, 0);
    const efficiency = this.calculateEfficiency(requests.length, totalValue);
    const insight = this.generateBundlingInsight(requests);

    const categories = [...new Set(requests.map(r => r.category))];
    const vendors = [...new Set(requests.map(r => r.vendor))];

    const criteria: string[] = ['Manual Bundle'];
    if (vendors.length === 1) {
      criteria.push('Same Vendor');
    }
    if (categories.length === 1) {
      criteria.push('Same Category');
    }

    return {
      id: `bundle-manual-${Date.now()}`,
      name: bundleName,
      criteria,
      requests,
      totalValue,
      responsiblePlanner: 'Auto-assigned',
      status: 'Draft',
      aiInsight: insight,
      estimatedEfficiency: efficiency
    };
  }
}
