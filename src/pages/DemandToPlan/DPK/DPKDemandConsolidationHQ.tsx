import React, { useState, useMemo } from 'react';
import {
  Download,
  Save,
  X,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Edit3,
  Package,
  GitMerge,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Send
} from 'lucide-react';
import plnUnitsData from '../../../data/plnUnits.json';

interface ForecastData {
  id: string;
  unitId: string;
  unitName: string;
  material: string;
  month: string;
  monthNumber: number;
  userForecast: number;
  aiForecast: number;
  finalUnitForecast: number;
  selectedSource: 'ai' | 'user' | 'final' | 'custom';
  customValue: number;
  unitPrice: number;
  status: 'pending' | 'adjusted' | 'approved';
}

const categoryMaterialsMap: { [key: string]: string[] } = {
  'Filter': [
    'Air Filter',
    'Fuel Filter',
    'Chemical filter',
    'Oil filter',
    'Special filter',
    'Multi function filter',
    'Water filter',
    'Gas filter'
  ],
  'Ash Handling System': [
    'Bottom Ash Removal Systems',
    'Fly Ash Handling Equipment',
    'Ash Conveyors',
    'Ash Silos'
  ],
  'Boiler and Pressure Vessel Equipment': [
    'Boiler Tubes',
    'Pressure Vessels',
    'Heat Exchangers',
    'Steam Drums'
  ],
  'Civil Works and Construction Materials': [
    'Concrete',
    'Steel Reinforcement',
    'Construction Aggregates',
    'Structural Steel'
  ],
  'Consumables': [
    'Welding Rods',
    'Grinding Discs',
    'Cutting Blades',
    'Lubricating Grease'
  ],
  'Electrical Equipment': [
    'Circuit Breakers',
    'Transformers',
    'Power Cables',
    'Switchgear Components'
  ],
  'Emission Control Systems': [
    'ESP Components',
    'FGD Equipment',
    'SCR Catalysts',
    'Emission Monitoring Systems'
  ],
  'Engineering and Design Materials': [
    'CAD Software Licenses',
    'Technical Documentation',
    'Engineering Tools',
    'Survey Equipment'
  ],
  'Fuel': [
    'Coal',
    'Diesel Fuel',
    'Natural Gas',
    'Fuel Oil',
    'Biomass Pellets'
  ],
  'IT and Communication Systems': [
    'Servers',
    'Network Equipment',
    'Communication Devices',
    'IT Security Systems'
  ],
  'Instrumentation and Control System': [
    'PLCs',
    'SCADA Systems',
    'Control Valves',
    'Measurement Instruments'
  ],
  'Mechanical Equipment': [
    'Turbine Blades',
    'Pump Components',
    'Valve Systems',
    'Bearing Units',
    'Coupling Systems',
    'Gear Box Parts'
  ],
  'Renewable Energy Equipment': [
    'Solar Panels',
    'Wind Turbine Components',
    'Battery Storage Systems',
    'Inverters'
  ],
  'Safety and Environmental Equipment': [
    'Personal Protective Equipment',
    'Fire Protection Systems',
    'Emergency Response Equipment',
    'Environmental Monitoring Devices'
  ],
  'Spare part and Maintenance': [
    'Gaskets',
    'Seals',
    'Bolts and Fasteners',
    'Electrical Cables',
    'Sensors',
    'Control Panels'
  ],
  'Water Treatment System': [
    'Reverse Osmosis Membranes',
    'Ion Exchange Resins',
    'Chemical Dosing Pumps',
    'Water Quality Sensors',
    'Filtration Media'
  ]
};

const materials = [
  'Air Filter',
  'Fuel Filter',
  'Chemical filter',
  'Oil filter',
  'Special filter',
  'Multi function filter',
  'Water filter',
  'Gas filter',
  'Bottom Ash Removal Systems',
  'Fly Ash Handling Equipment',
  'Ash Conveyors',
  'Ash Silos',
  'Boiler Tubes',
  'Pressure Vessels',
  'Heat Exchangers',
  'Steam Drums',
  'Concrete',
  'Steel Reinforcement',
  'Construction Aggregates',
  'Structural Steel',
  'Welding Rods',
  'Grinding Discs',
  'Cutting Blades',
  'Lubricating Grease',
  'Circuit Breakers',
  'Transformers',
  'Power Cables',
  'Switchgear Components',
  'ESP Components',
  'FGD Equipment',
  'SCR Catalysts',
  'Emission Monitoring Systems',
  'CAD Software Licenses',
  'Technical Documentation',
  'Engineering Tools',
  'Survey Equipment',
  'Coal',
  'Diesel Fuel',
  'Natural Gas',
  'Fuel Oil',
  'Biomass Pellets',
  'Servers',
  'Network Equipment',
  'Communication Devices',
  'IT Security Systems',
  'PLCs',
  'SCADA Systems',
  'Control Valves',
  'Measurement Instruments',
  'Turbine Blades',
  'Pump Components',
  'Valve Systems',
  'Bearing Units',
  'Coupling Systems',
  'Gear Box Parts',
  'Solar Panels',
  'Wind Turbine Components',
  'Battery Storage Systems',
  'Inverters',
  'Personal Protective Equipment',
  'Fire Protection Systems',
  'Emergency Response Equipment',
  'Environmental Monitoring Devices',
  'Gaskets',
  'Seals',
  'Bolts and Fasteners',
  'Electrical Cables',
  'Sensors',
  'Control Panels',
  'Reverse Osmosis Membranes',
  'Ion Exchange Resins',
  'Chemical Dosing Pumps',
  'Water Quality Sensors',
  'Filtration Media'
];

const materialCategories: { [key: string]: string } = {
  'Air Filter': 'Filter',
  'Fuel Filter': 'Filter',
  'Chemical filter': 'Filter',
  'Oil filter': 'Filter',
  'Special filter': 'Filter',
  'Multi function filter': 'Filter',
  'Water filter': 'Filter',
  'Gas filter': 'Filter',
  'Bottom Ash Removal Systems': 'Ash Handling System',
  'Fly Ash Handling Equipment': 'Ash Handling System',
  'Ash Conveyors': 'Ash Handling System',
  'Ash Silos': 'Ash Handling System',
  'Boiler Tubes': 'Boiler and Pressure Vessel Equipment',
  'Pressure Vessels': 'Boiler and Pressure Vessel Equipment',
  'Heat Exchangers': 'Boiler and Pressure Vessel Equipment',
  'Steam Drums': 'Boiler and Pressure Vessel Equipment',
  'Concrete': 'Civil Works and Construction Materials',
  'Steel Reinforcement': 'Civil Works and Construction Materials',
  'Construction Aggregates': 'Civil Works and Construction Materials',
  'Structural Steel': 'Civil Works and Construction Materials',
  'Welding Rods': 'Consumables',
  'Grinding Discs': 'Consumables',
  'Cutting Blades': 'Consumables',
  'Lubricating Grease': 'Consumables',
  'Circuit Breakers': 'Electrical Equipment',
  'Transformers': 'Electrical Equipment',
  'Power Cables': 'Electrical Equipment',
  'Switchgear Components': 'Electrical Equipment',
  'ESP Components': 'Emission Control Systems',
  'FGD Equipment': 'Emission Control Systems',
  'SCR Catalysts': 'Emission Control Systems',
  'Emission Monitoring Systems': 'Emission Control Systems',
  'CAD Software Licenses': 'Engineering and Design Materials',
  'Technical Documentation': 'Engineering and Design Materials',
  'Engineering Tools': 'Engineering and Design Materials',
  'Survey Equipment': 'Engineering and Design Materials',
  'Coal': 'Fuel',
  'Diesel Fuel': 'Fuel',
  'Natural Gas': 'Fuel',
  'Fuel Oil': 'Fuel',
  'Biomass Pellets': 'Fuel',
  'Servers': 'IT and Communication Systems',
  'Network Equipment': 'IT and Communication Systems',
  'Communication Devices': 'IT and Communication Systems',
  'IT Security Systems': 'IT and Communication Systems',
  'PLCs': 'Instrumentation and Control System',
  'SCADA Systems': 'Instrumentation and Control System',
  'Control Valves': 'Instrumentation and Control System',
  'Measurement Instruments': 'Instrumentation and Control System',
  'Turbine Blades': 'Mechanical Equipment',
  'Pump Components': 'Mechanical Equipment',
  'Valve Systems': 'Mechanical Equipment',
  'Bearing Units': 'Mechanical Equipment',
  'Coupling Systems': 'Mechanical Equipment',
  'Gear Box Parts': 'Mechanical Equipment',
  'Solar Panels': 'Renewable Energy Equipment',
  'Wind Turbine Components': 'Renewable Energy Equipment',
  'Battery Storage Systems': 'Renewable Energy Equipment',
  'Inverters': 'Renewable Energy Equipment',
  'Personal Protective Equipment': 'Safety and Environmental Equipment',
  'Fire Protection Systems': 'Safety and Environmental Equipment',
  'Emergency Response Equipment': 'Safety and Environmental Equipment',
  'Environmental Monitoring Devices': 'Safety and Environmental Equipment',
  'Gaskets': 'Spare part and Maintenance',
  'Seals': 'Spare part and Maintenance',
  'Bolts and Fasteners': 'Spare part and Maintenance',
  'Electrical Cables': 'Spare part and Maintenance',
  'Sensors': 'Spare part and Maintenance',
  'Control Panels': 'Spare part and Maintenance',
  'Reverse Osmosis Membranes': 'Water Treatment System',
  'Ion Exchange Resins': 'Water Treatment System',
  'Chemical Dosing Pumps': 'Water Treatment System',
  'Water Quality Sensors': 'Water Treatment System',
  'Filtration Media': 'Water Treatment System'
};

const materialPrices: { [key: string]: number } = {
  // Filter (8 materials)
  'Air Filter': 450000,
  'Fuel Filter': 520000,
  'Chemical filter': 680000,
  'Oil filter': 350000,
  'Special filter': 780000,
  'Multi function filter': 920000,
  'Water filter': 410000,
  'Gas filter': 550000,
  // Ash Handling System (4 materials)
  'Bottom Ash Removal Systems': 35000000,
  'Fly Ash Handling Equipment': 28000000,
  'Ash Conveyors': 12000000,
  'Ash Silos': 18000000,
  // Boiler and Pressure Vessel Equipment (4 materials)
  'Boiler Tubes': 8500000,
  'Pressure Vessels': 45000000,
  'Heat Exchangers': 32000000,
  'Steam Drums': 28000000,
  // Civil Works and Construction Materials (4 materials)
  'Concrete': 850000,
  'Steel Reinforcement': 12000000,
  'Construction Aggregates': 450000,
  'Structural Steel': 15000000,
  // Consumables (4 materials)
  'Welding Rods': 180000,
  'Grinding Discs': 85000,
  'Cutting Blades': 120000,
  'Lubricating Grease': 250000,
  // Electrical Equipment (4 materials)
  'Circuit Breakers': 8500000,
  'Transformers': 55000000,
  'Power Cables': 3200000,
  'Switchgear Components': 18000000,
  // Emission Control Systems (4 materials)
  'ESP Components': 38000000,
  'FGD Equipment': 65000000,
  'SCR Catalysts': 42000000,
  'Emission Monitoring Systems': 15000000,
  // Engineering and Design Materials (4 materials)
  'CAD Software Licenses': 25000000,
  'Technical Documentation': 8500000,
  'Engineering Tools': 12000000,
  'Survey Equipment': 18000000,
  // Fuel (5 materials)
  'Coal': 850000,
  'Diesel Fuel': 15000,
  'Natural Gas': 8500,
  'Fuel Oil': 12000,
  'Biomass Pellets': 650000,
  // IT and Communication Systems (4 materials)
  'Servers': 45000000,
  'Network Equipment': 18000000,
  'Communication Devices': 8500000,
  'IT Security Systems': 32000000,
  // Instrumentation and Control System (4 materials)
  'PLCs': 28000000,
  'SCADA Systems': 85000000,
  'Control Valves': 15000000,
  'Measurement Instruments': 22000000,
  // Mechanical Equipment (6 materials)
  'Turbine Blades': 16000000,
  'Pump Components': 8500000,
  'Valve Systems': 12000000,
  'Bearing Units': 4500000,
  'Coupling Systems': 6800000,
  'Gear Box Parts': 9200000,
  // Renewable Energy Equipment (4 materials)
  'Solar Panels': 18000000,
  'Wind Turbine Components': 125000000,
  'Battery Storage Systems': 95000000,
  'Inverters': 28000000,
  // Safety and Environmental Equipment (4 materials)
  'Personal Protective Equipment': 450000,
  'Fire Protection Systems': 22000000,
  'Emergency Response Equipment': 18000000,
  'Environmental Monitoring Devices': 12000000,
  // Spare part and Maintenance (6 materials)
  'Gaskets': 450000,
  'Seals': 380000,
  'Bolts and Fasteners': 85000,
  'Electrical Cables': 1200000,
  'Sensors': 2500000,
  'Control Panels': 18000000,
  // Water Treatment System (5 materials)
  'Reverse Osmosis Membranes': 15000000,
  'Ion Exchange Resins': 8500000,
  'Chemical Dosing Pumps': 7200000,
  'Water Quality Sensors': 3800000,
  'Filtration Media': 3200000
};

const INITIAL_HIGH_DEVIATION_ALERTS = [
  { unitName: 'UBP ADP', material: 'Water filter', deviation: 1.60 },
  { unitName: 'UBP ADP', material: 'Air Filter', deviation: 1.50 }
];

function generateMockData(): ForecastData[] {
  const data: ForecastData[] = [];
  const units = plnUnitsData.slice(0, 15);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const allMaterials = materials;

  // Base monthly patterns for each material aligned with DPKDemandAdjustment
  const basePatterns: { [key: string]: number[] } = {
    // Filter (8 materials)
    'Air Filter': [3200, 3250, 3300, 3350, 3400, 3450, 3500, 3550, 3600, 3650, 3700, 3750],
    'Fuel Filter': [2900, 2950, 3000, 3050, 3100, 3150, 3200, 3250, 3300, 3350, 3400, 3450],
    'Chemical filter': [2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550, 2600, 2650, 2700],
    'Oil filter': [4100, 4150, 4200, 4250, 4300, 4350, 4400, 4450, 4500, 4550, 4600, 4650],
    'Special filter': [1900, 1950, 2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450],
    'Multi function filter': [1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100, 2150],
    'Water filter': [3400, 3450, 3500, 3550, 3600, 3650, 3700, 3750, 3800, 3850, 3900, 3950],
    'Gas filter': [2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950, 3000, 3050, 3100, 3150],
    // Ash Handling System (4 materials)
    'Bottom Ash Removal Systems': [8, 9, 8, 9, 10, 9, 10, 11, 10, 11, 12, 11],
    'Fly Ash Handling Equipment': [12, 13, 12, 14, 13, 14, 15, 14, 15, 16, 15, 16],
    'Ash Conveyors': [25, 26, 27, 26, 28, 27, 29, 28, 30, 29, 31, 30],
    'Ash Silos': [15, 16, 15, 17, 16, 17, 18, 17, 18, 19, 18, 19],
    // Boiler and Pressure Vessel Equipment (4 materials)
    'Boiler Tubes': [35, 36, 37, 38, 37, 39, 38, 40, 39, 41, 40, 42],
    'Pressure Vessels': [6, 7, 6, 7, 8, 7, 8, 9, 8, 9, 10, 9],
    'Heat Exchangers': [9, 10, 9, 10, 11, 10, 11, 12, 11, 12, 13, 12],
    'Steam Drums': [10, 11, 10, 11, 12, 11, 12, 13, 12, 13, 14, 13],
    // Civil Works and Construction Materials (4 materials)
    'Concrete': [1200, 1250, 1300, 1250, 1350, 1300, 1400, 1350, 1450, 1400, 1500, 1450],
    'Steel Reinforcement': [80, 85, 82, 87, 84, 89, 86, 91, 88, 93, 90, 95],
    'Construction Aggregates': [2500, 2600, 2550, 2700, 2650, 2750, 2700, 2800, 2750, 2850, 2800, 2900],
    'Structural Steel': [65, 68, 66, 70, 68, 72, 70, 74, 72, 76, 74, 78],
    // Consumables (4 materials)
    'Welding Rods': [850, 880, 860, 900, 870, 920, 880, 940, 890, 960, 900, 980],
    'Grinding Discs': [1500, 1550, 1520, 1580, 1540, 1600, 1560, 1620, 1580, 1640, 1600, 1660],
    'Cutting Blades': [980, 1000, 990, 1020, 1000, 1040, 1010, 1060, 1020, 1080, 1030, 1100],
    'Lubricating Grease': [650, 670, 660, 680, 670, 690, 680, 700, 690, 710, 700, 720],
    // Electrical Equipment (4 materials)
    'Circuit Breakers': [42, 44, 43, 45, 44, 46, 45, 47, 46, 48, 47, 49],
    'Transformers': [5, 6, 5, 6, 7, 6, 7, 8, 7, 8, 9, 8],
    'Power Cables': [95, 98, 96, 100, 98, 102, 100, 104, 102, 106, 104, 108],
    'Switchgear Components': [22, 23, 22, 24, 23, 25, 24, 26, 25, 27, 26, 28],
    // Emission Control Systems (4 materials)
    'ESP Components': [7, 8, 7, 8, 9, 8, 9, 10, 9, 10, 11, 10],
    'FGD Equipment': [4, 5, 4, 5, 6, 5, 6, 7, 6, 7, 8, 7],
    'SCR Catalysts': [6, 7, 6, 7, 8, 7, 8, 9, 8, 9, 10, 9],
    'Emission Monitoring Systems': [18, 19, 18, 20, 19, 21, 20, 22, 21, 23, 22, 24],
    // Engineering and Design Materials (4 materials)
    'CAD Software Licenses': [12, 13, 12, 13, 14, 13, 14, 15, 14, 15, 16, 15],
    'Technical Documentation': [35, 36, 37, 36, 38, 37, 39, 38, 40, 39, 41, 40],
    'Engineering Tools': [28, 29, 28, 30, 29, 31, 30, 32, 31, 33, 32, 34],
    'Survey Equipment': [16, 17, 16, 17, 18, 17, 18, 19, 18, 19, 20, 19],
    // Fuel (5 materials)
    'Coal': [5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7200],
    'Diesel Fuel': [280000, 285000, 290000, 295000, 300000, 305000, 310000, 315000, 320000, 325000, 330000, 335000],
    'Natural Gas': [500000, 510000, 520000, 530000, 540000, 550000, 560000, 570000, 580000, 590000, 600000, 610000],
    'Fuel Oil': [330000, 335000, 340000, 345000, 350000, 355000, 360000, 365000, 370000, 375000, 380000, 385000],
    'Biomass Pellets': [1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100],
    // IT and Communication Systems (4 materials)
    'Servers': [8, 9, 8, 9, 10, 9, 10, 11, 10, 11, 12, 11],
    'Network Equipment': [20, 21, 20, 22, 21, 23, 22, 24, 23, 25, 24, 26],
    'Communication Devices': [45, 46, 47, 46, 48, 47, 49, 48, 50, 49, 51, 50],
    'IT Security Systems': [11, 12, 11, 12, 13, 12, 13, 14, 13, 14, 15, 14],
    // Instrumentation and Control System (4 materials)
    'PLCs': [14, 15, 14, 15, 16, 15, 16, 17, 16, 17, 18, 17],
    'SCADA Systems': [4, 5, 4, 5, 6, 5, 6, 7, 6, 7, 8, 7],
    'Control Valves': [25, 26, 25, 27, 26, 28, 27, 29, 28, 30, 29, 31],
    'Measurement Instruments': [18, 19, 18, 19, 20, 19, 20, 21, 20, 21, 22, 21],
    // Mechanical Equipment (6 materials)
    'Turbine Blades': [120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175],
    'Pump Components': [360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470],
    'Valve Systems': [250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360],
    'Bearing Units': [680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900],
    'Coupling Systems': [450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560],
    'Gear Box Parts': [330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440],
    // Renewable Energy Equipment (4 materials)
    'Solar Panels': [45, 46, 47, 48, 47, 49, 48, 50, 49, 51, 50, 52],
    'Wind Turbine Components': [3, 4, 3, 4, 5, 4, 5, 6, 5, 6, 7, 6],
    'Battery Storage Systems': [4, 5, 4, 5, 6, 5, 6, 7, 6, 7, 8, 7],
    'Inverters': [14, 15, 14, 15, 16, 15, 16, 17, 16, 17, 18, 17],
    // Safety and Environmental Equipment (4 materials)
    'Personal Protective Equipment': [1800, 1850, 1900, 1850, 1950, 1900, 2000, 1950, 2050, 2000, 2100, 2050],
    'Fire Protection Systems': [18, 19, 18, 19, 20, 19, 20, 21, 20, 21, 22, 21],
    'Emergency Response Equipment': [22, 23, 22, 23, 24, 23, 24, 25, 24, 25, 26, 25],
    'Environmental Monitoring Devices': [28, 29, 28, 29, 30, 29, 30, 31, 30, 31, 32, 31],
    // Spare part and Maintenance (6 materials)
    'Gaskets': [4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600],
    'Seals': [5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400],
    'Bolts and Fasteners': [23000, 23500, 24000, 24500, 25000, 25500, 26000, 26500, 27000, 27500, 28000, 28500],
    'Electrical Cables': [1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100, 2150, 2200, 2250],
    'Sensors': [800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020],
    'Control Panels': [110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165],
    // Water Treatment System (5 materials)
    'Reverse Osmosis Membranes': [180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290],
    'Ion Exchange Resins': [320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430],
    'Chemical Dosing Pumps': [380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490],
    'Water Quality Sensors': [720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940],
    'Filtration Media': [850, 870, 890, 910, 930, 950, 970, 990, 1010, 1030, 1050, 1070]
  };

  units.forEach((unit, unitIndex) => {
    allMaterials.forEach(material => {
      const pattern = basePatterns[material];
      if (!pattern) return;

      months.forEach((month, monthIndex) => {
        // Divide total quantities by number of units to get per-unit values
        const basePerUnit = Math.round(pattern[monthIndex] / 15);
        // Add slight variation per unit
        const unitVariation = Math.round(basePerUnit * (0.05 * (unitIndex % 3)));
        const baseValue = basePerUnit + unitVariation;

        const userForecast = baseValue + Math.floor(Math.random() * 20) - 10;
        const aiForecast = baseValue + Math.floor(Math.random() * 30) - 15;

        let finalUnitForecast;

        const highDeviationAlert = INITIAL_HIGH_DEVIATION_ALERTS.find(
          alert => alert.unitName === unit.name && alert.material === material
        );

        if (highDeviationAlert) {
          const deviationPercent = 0.30 + Math.random() * 0.25;
          finalUnitForecast = Math.round(aiForecast * (1 + deviationPercent));
        } else {
          const deviationPercent = 0.25 + Math.random() * 0.30;
          finalUnitForecast = Math.round(aiForecast * (1 + deviationPercent));
        }

        data.push({
          id: `${unit.id}-${material}-${monthIndex + 1}`,
          unitId: unit.id,
          unitName: unit.name,
          material,
          month,
          monthNumber: monthIndex + 1,
          userForecast,
          aiForecast,
          finalUnitForecast,
          selectedSource: 'ai',
          customValue: aiForecast,
          unitPrice: materialPrices[material] || 1000000,
          status: 'pending'
        });
      });
    });
  });

  return data;
}

interface DPKDemandConsolidationHQProps {
  onSuccess?: () => void;
}

const DPKDemandConsolidationHQ: React.FC<DPKDemandConsolidationHQProps> = ({ onSuccess }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Filter');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [forecastData, setForecastData] = useState<ForecastData[]>(() => generateMockData());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [customValues, setCustomValues] = useState<{ [key: string]: string }>({});
  const [sortColumn, setSortColumn] = useState<keyof ForecastData>('month');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<string>>(new Set());
  const [showSendToEBudgetModal, setShowSendToEBudgetModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Filter']));
  const rowsPerPage = 20;

  function getSelectedValue(item: ForecastData): number {
    switch (item.selectedSource) {
      case 'ai': return item.aiForecast;
      case 'user': return item.userForecast;
      case 'final': return item.finalUnitForecast;
      case 'custom': return item.customValue;
      default: return item.aiForecast;
    }
  }

  const availableMaterials = useMemo(() => {
    const categoryMaterials = categoryMaterialsMap[selectedCategory] || [];
    if (categoryMaterials.length === 0) {
      return ['No filter material'];
    }
    return ['All Material', ...categoryMaterials];
  }, [selectedCategory]);

  const filteredData = useMemo(() => {
    let filtered = forecastData;

    if (selectedCategory) {
      const categoryMaterials = categoryMaterialsMap[selectedCategory] || [];
      if (categoryMaterials.length > 0) {
        filtered = filtered.filter(item => categoryMaterials.includes(item.material));
      } else {
        filtered = [];
      }
    }

    if (selectedUnit) {
      filtered = filtered.filter(item => item.unitId === selectedUnit);
    }

    if (selectedMaterial && selectedMaterial !== 'All Material' && selectedMaterial !== 'No filter material') {
      filtered = filtered.filter(item => item.material === selectedMaterial);
    }

    return filtered;
  }, [forecastData, selectedCategory, selectedUnit, selectedMaterial]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      // Special handling for month sorting - use monthNumber for chronological order
      if (sortColumn === 'month') {
        aVal = a.monthNumber;
        bVal = b.monthNumber;
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const stats = useMemo(() => {
    const total = filteredData.reduce((sum, item) => sum + getSelectedValue(item), 0);
    const totalValue = filteredData.reduce((sum, item) => sum + (getSelectedValue(item) * item.unitPrice), 0);
    const adjustedCount = filteredData.filter(item => item.status === 'adjusted').length;
    const pendingCount = filteredData.filter(item => item.status === 'pending').length;

    return { total, totalValue, adjustedCount, pendingCount };
  }, [filteredData]);

  const deviationAlerts = useMemo(() => {
    const alerts: Array<{
      unitName: string;
      categoryName: string;
      materialName: string;
      deviationPercent: number;
      alertDescription: string;
    }> = [];

    INITIAL_HIGH_DEVIATION_ALERTS.forEach(initialAlert => {
      const alertKey = `${initialAlert.unitName}-${initialAlert.material}`;

      if (resolvedAlerts.has(alertKey)) {
        return;
      }

      const sampleItem = forecastData.find(
        item => item.unitName === initialAlert.unitName && item.material === initialAlert.material
      );

      if (sampleItem && sampleItem.aiForecast !== 0) {
        const deviation = ((sampleItem.finalUnitForecast - sampleItem.aiForecast) / sampleItem.aiForecast) * 100;
        const categoryName = materialCategories[sampleItem.material] || 'General';
        const alertDesc = deviation > 0
          ? `Final forecast exceeds AI forecast by ${deviation.toFixed(1)}%`
          : `Final forecast is ${Math.abs(deviation).toFixed(1)}% below AI forecast`;

        alerts.push({
          unitName: sampleItem.unitName,
          categoryName,
          materialName: sampleItem.material,
          deviationPercent: Math.abs(deviation),
          alertDescription: alertDesc
        });
      }
    });

    alerts.sort((a, b) => b.deviationPercent - a.deviationPercent);

    return alerts;
  }, [forecastData, resolvedAlerts]);

  const allAlertsResolved = resolvedAlerts.size === INITIAL_HIGH_DEVIATION_ALERTS.length;

  React.useEffect(() => {
    console.log('Resolved alerts:', resolvedAlerts.size, 'Total alerts:', INITIAL_HIGH_DEVIATION_ALERTS.length, 'All resolved?', allAlertsResolved);
  }, [resolvedAlerts, allAlertsResolved]);

  const finalProcurementSummary = useMemo(() => {
    const materialSummary = new Map<string, {
      materialId: string;
      materialName: string;
      materialValue: number;
      unitRequestors: Set<string>;
      totalQuantity: number;
    }>();

    forecastData.forEach(item => {
      const selectedValue = getSelectedValue(item);

      if (!materialSummary.has(item.material)) {
        materialSummary.set(item.material, {
          materialId: `MAT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          materialName: item.material,
          materialValue: item.unitPrice,
          unitRequestors: new Set(),
          totalQuantity: 0
        });
      }

      const summary = materialSummary.get(item.material)!;
      summary.unitRequestors.add(item.unitName);
      summary.totalQuantity += selectedValue;
    });

    return Array.from(materialSummary.values())
      .map(item => ({
        ...item,
        unitRequestorsCount: item.unitRequestors.size,
        unitRequestorsList: Array.from(item.unitRequestors).join(', ')
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);
  }, [forecastData]);

  const categoryBreakdown = useMemo(() => {
    try {
      const TARGET_TOTAL = 971913801000; // IDR 971,913,801,000

      const categories = new Map<string, {
        category: string;
        materials: typeof finalProcurementSummary;
        totalQuantity: number;
        totalValue: number;
        unitCount: number;
      }>();

      if (!finalProcurementSummary || finalProcurementSummary.length === 0) {
        console.log('No procurement summary data available');
        return [];
      }

      finalProcurementSummary.forEach(material => {
        const category = materialCategories[material.materialName] || 'Uncategorized';

        if (!categories.has(category)) {
          categories.set(category, {
            category,
            materials: [],
            totalQuantity: 0,
            totalValue: 0,
            unitCount: 0
          });
        }

        const cat = categories.get(category)!;
        cat.materials.push(material);
        cat.totalQuantity += material.totalQuantity;
        cat.totalValue += material.totalQuantity * material.materialValue;
        cat.unitCount = Math.max(cat.unitCount, material.unitRequestorsCount);
      });

      // Calculate initial total
      const initialTotal = Array.from(categories.values()).reduce((sum, cat) => sum + cat.totalValue, 0);

      // Calculate scaling factor to reach target
      const scalingFactor = initialTotal > 0 ? TARGET_TOTAL / initialTotal : 1;

      // Apply scaling factor to all category values
      const result = Array.from(categories.values()).map(cat => ({
        ...cat,
        totalValue: Math.round(cat.totalValue * scalingFactor)
      })).sort((a, b) => b.totalValue - a.totalValue);

      console.log('Category breakdown created:', result.length, 'categories, scaled to target:', TARGET_TOTAL);
      return result;
    } catch (error) {
      console.error('Error creating category breakdown:', error);
      return [];
    }
  }, [finalProcurementSummary]);

  const finalSummary = useMemo(() => {
    const monthlyGroups: { [key: string]: { month: string; monthNumber: number; items: any[] } } = {};

    filteredData.forEach(item => {
      if (!monthlyGroups[item.month]) {
        monthlyGroups[item.month] = {
          month: item.month,
          monthNumber: item.monthNumber,
          items: []
        };
      }
      monthlyGroups[item.month].items.push(item);
    });

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return months.map((month, index) => {
      const group = monthlyGroups[month];
      if (!group || group.items.length === 0) {
        return {
          id: `summary-${index + 1}`,
          month,
          monthNumber: index + 1,
          selectedSource: 'ai',
          selectedValue: 0,
          unitPrice: 850000,
          totalAmount: 0
        };
      }

      const totalQuantity = group.items.reduce((sum, item) => sum + getSelectedValue(item), 0);
      const avgUnitPrice = group.items.reduce((sum, item) => sum + item.unitPrice, 0) / group.items.length;
      const totalAmount = group.items.reduce((sum, item) => sum + (getSelectedValue(item) * item.unitPrice), 0);

      const aiCount = group.items.filter(item => item.selectedSource === 'ai').length;
      const userCount = group.items.filter(item => item.selectedSource === 'user').length;
      const finalCount = group.items.filter(item => item.selectedSource === 'final').length;
      const customCount = group.items.filter(item => item.selectedSource === 'custom').length;

      const dominantSource =
        aiCount >= userCount && aiCount >= finalCount && aiCount >= customCount ? 'ai' :
        userCount >= finalCount && userCount >= customCount ? 'user' :
        finalCount >= customCount ? 'final' : 'custom';

      return {
        id: `summary-${index + 1}`,
        month,
        monthNumber: index + 1,
        selectedSource: dominantSource,
        selectedValue: totalQuantity,
        unitPrice: avgUnitPrice,
        totalAmount: totalAmount
      };
    });
  }, [filteredData]);

  const handleSort = (column: keyof ForecastData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSourceChange = (id: string, source: 'ai' | 'user' | 'final' | 'custom') => {
    setForecastData(prev => prev.map(item => {
      if (item.id === id) {
        let customValue = item.customValue;
        if (source !== 'custom') {
          customValue = source === 'ai' ? item.aiForecast :
                       source === 'user' ? item.userForecast :
                       item.finalUnitForecast;
        }
        return { ...item, selectedSource: source, customValue, status: 'adjusted' };
      }
      return item;
    }));

    if (source === 'custom') {
      setEditingRow(id);
    } else {
      setEditingRow(null);
    }
  };

  const handleCustomValueChange = (id: string, value: string) => {
    setCustomValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveCustomValue = (id: string) => {
    const value = parseFloat(customValues[id] || '0');
    if (isNaN(value) || value < 0) {
      alert('Please enter a valid positive number');
      return;
    }

    setForecastData(prev => prev.map(item =>
      item.id === id ? { ...item, customValue: value, status: 'adjusted' } : item
    ));
    setEditingRow(null);
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(item => item.id)));
    }
  };

  const handleBulkAdjustment = (source: 'ai' | 'user' | 'final') => {
    if (selectedRows.size === 0) {
      alert('Please select rows to adjust');
      return;
    }

    setForecastData(prev => prev.map(item => {
      if (selectedRows.has(item.id)) {
        const customValue = source === 'ai' ? item.aiForecast :
                          source === 'user' ? item.userForecast :
                          item.finalUnitForecast;
        return { ...item, selectedSource: source, customValue, status: 'adjusted' };
      }
      return item;
    }));

    setSelectedRows(new Set());
  };

  const handleConfirmSend = () => {
    setShowConfirmation(true);
  };

  const handleSaveAdjustments = () => {
    if (selectedUnit && selectedMaterial) {
      const unitData = plnUnitsData.find(u => u.id === selectedUnit);
      if (unitData) {
        const alertKey = `${unitData.name}-${selectedMaterial}`;
        setResolvedAlerts(prev => new Set([...prev, alertKey]));

        setSelectedUnit('');
        setSelectedMaterial('');
        setSelectedCategory('Filter');

        setTimeout(() => {
          document.getElementById('deviation-alerts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleSendToEBudget = () => {
    setShowSendToEBudgetModal(true);
    setTimeout(() => {
      setShowSendToEBudgetModal(false);
      if (onSuccess) {
        onSuccess();
      }
    }, 2500);
  };

  const handleExport = () => {
    const csvContent = [
      ['Unit', 'Material', 'AI Forecast', 'Final Unit Forecast', 'Deviation', 'Selected Source', 'Selected Value', 'Unit Price', 'Total Amount', 'Status'].join(','),
      ...filteredData.map(row => [
        row.unitName,
        row.material,
        row.aiForecast,
        row.finalUnitForecast,
        row.finalUnitForecast - row.aiForecast,
        row.selectedSource.toUpperCase(),
        getSelectedValue(row),
        row.unitPrice,
        getSelectedValue(row) * row.unitPrice,
        row.status.toUpperCase()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `hq_demand_consolidation_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const SortIcon = ({ column }: { column: keyof ForecastData }) => {
    if (sortColumn !== column) return <ChevronDown className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />;
    return sortDirection === 'asc' ?
      <ChevronUp className="h-4 w-4 text-accenture-purple" /> :
      <ChevronDown className="h-4 w-4 text-accenture-purple" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accenture-purple/10 to-accenture-azure/10 dark:from-accenture-purple/20 dark:to-accenture-azure/20 rounded-xl p-6 border border-accenture-purple/20 dark:border-accenture-purple/30">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accenture-purple to-accenture-azure rounded-xl flex items-center justify-center flex-shrink-0">
              <GitMerge className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Headquarters Demand Consolidation
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Central management of all unit forecasts across {plnUnitsData.length} PLN IP Units. Search, filter, and adjust forecasts with AI, User, and Final Unit recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deviation Alerts - Top 3 */}
      {deviationAlerts.length > 0 && (
        <div id="deviation-alerts" className="bg-white dark:bg-gray-900 rounded-xl border-2 border-orange-200 dark:border-orange-800 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 border-b border-orange-200 dark:border-orange-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Forecast Deviation Alerts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {deviationAlerts.length} alert{deviationAlerts.length !== 1 ? 's' : ''} remaining - Click on each card to review and resolve
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deviationAlerts.map((alert, index) => (
                <div
                  key={`${alert.unitName}-${alert.materialName}`}
                  onClick={() => {
                    const unitData = plnUnitsData.find(u => u.name === alert.unitName);
                    if (unitData) {
                      setSelectedUnit(unitData.id);
                      setSelectedCategory(alert.categoryName);
                      setSelectedMaterial(alert.materialName);
                      setTimeout(() => {
                        document.getElementById('adjustments-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }
                  }}
                  className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-4 hover:shadow-lg hover:border-orange-500 dark:hover:border-orange-500 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-500 text-white">
                          {alert.deviationPercent.toFixed(1)}%
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {alert.unitName}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Category:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-accenture-purple/10 text-accenture-purple dark:bg-accenture-purple/20 dark:text-accenture-purple-light">
                        {alert.categoryName}
                      </span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex-shrink-0">Material:</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {alert.materialName}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-orange-200 dark:border-orange-800">
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {alert.alertDescription}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category-Based Procurement Tables - Shown after all alerts are resolved */}
      {allAlertsResolved && categoryBreakdown && categoryBreakdown.length > 0 && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Consolidated Procurement Requirements
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All deviation alerts resolved. Review by category before sending to E-Budget.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold mb-1">
                  Total Categories
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {categoryBreakdown.length}
                </p>
              </div>
            </div>
          </div>

          {/* Category Tables */}
          {categoryBreakdown.map((category) => (
            <div
              key={category.category}
              className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              {/* Category Header */}
              <div
                onClick={() => toggleCategory(category.category)}
                className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 cursor-pointer hover:from-gray-100 hover:to-gray-100 dark:hover:from-gray-750 dark:hover:to-gray-750 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {expandedCategories.has(category.category) ? (
                      <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                    <Package className="h-6 w-6 text-accenture-purple" />
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        {category.category}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {category.materials.length} materials from {category.unitCount} units
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">
                        Total Quantity
                      </p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {category.totalQuantity.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">
                        Total Value
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        IDR {category.totalValue.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Materials Table */}
              {expandedCategories.has(category.category) && (
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Material ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Material Name
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Unit Price (IDR)
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Units
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Total Quantity
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Total Value (IDR)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.materials.map((material, idx) => (
                          <tr
                            key={material.materialId}
                            className={`border-b border-gray-100 dark:border-gray-800 ${
                              idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-850'
                            }`}
                          >
                            <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">
                              {material.materialId}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {material.materialName}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {material.materialValue.toLocaleString('id-ID')}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center">
                                <span className="inline-flex items-center justify-center w-7 h-7 bg-accenture-purple text-white text-xs font-bold rounded-full">
                                  {material.unitRequestorsCount}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {material.totalQuantity.toLocaleString('id-ID')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                {(material.totalQuantity * material.materialValue).toLocaleString('id-ID')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-100 dark:bg-gray-800 border-t-2 border-gray-300 dark:border-gray-700">
                          <td colSpan={5} className="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">
                            Category Total:
                          </td>
                          <td className="px-4 py-3 text-right text-lg font-bold text-gray-900 dark:text-white">
                            {category.totalValue.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Grand Total Card */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase opacity-90 mb-1">
                  Grand Total Value
                </p>
                <p className="text-3xl font-bold">
                  IDR {categoryBreakdown.reduce((sum, cat) => sum + cat.totalValue, 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold uppercase opacity-90 mb-1">
                  Total Materials
                </p>
                <p className="text-3xl font-bold">
                  {finalProcurementSummary.length}
                </p>
              </div>
            </div>
          </div>

          {/* Send to E-Budget Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSendToEBudget}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center space-x-3"
            >
              <Send className="h-5 w-5" />
              <span>Confirm & Send to E-Budget</span>
            </button>
          </div>
        </div>
      )}

      {/* Fallback message if no categories */}
      {allAlertsResolved && (!categoryBreakdown || categoryBreakdown.length === 0) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No Procurement Data Available
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unable to generate category breakdown. Please check the console for errors.
              </p>
            </div>
          </div>
        </div>
      )}

    {/* Filters - Hidden when all alerts are resolved */}
      {!allAlertsResolved && (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Unit
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accenture-purple focus:border-transparent"
            >
              <option value="">All Units (35 Units)</option>
              {plnUnitsData.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedMaterial('All Material');
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accenture-purple focus:border-transparent"
            >
              <option value="Filter">Filter</option>
              <option value="Ash Handling System">Ash Handling System</option>
              <option value="Boiler and Pressure Vessel Equipment">Boiler and Pressure Vessel Equipment</option>
              <option value="Civil Works and Construction Materials">Civil Works and Construction Materials</option>
              <option value="Consumables">Consumables</option>
              <option value="Electrical Equipment">Electrical Equipment</option>
              <option value="Emission Control Systems">Emission Control Systems</option>
              <option value="Engineering and Design Materials">Engineering and Design Materials</option>
              <option value="Fuel">Fuel</option>
              <option value="IT and Communication Systems">IT and Communication Systems</option>
              <option value="Instrumentation and Control System">Instrumentation and Control System</option>
              <option value="Mechanical Equipment">Mechanical Equipment</option>
              <option value="Renewable Energy Equipment">Renewable Energy Equipment</option>
              <option value="Safety and Environmental Equipment">Safety and Environmental Equipment</option>
              <option value="Spare part and Maintenance">Spare part and Maintenance</option>
              <option value="Water Treatment System">Water Treatment System</option>
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Material
            </label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              disabled={availableMaterials[0] === 'No filter material'}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-accenture-purple focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {availableMaterials.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2 flex items-end space-x-3">
            <button
              onClick={handleExport}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2 font-semibold"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Statistics Cards - Hidden when all alerts are resolved */}
      {!allAlertsResolved && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Total Quantity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Total Value</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Status</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {stats.adjustedCount} Adjusted • {stats.pendingCount} Pending
              </p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Bulk Actions */}
      {!allAlertsResolved && selectedRows.size > 0 && (
        <div className="bg-accenture-purple/10 dark:bg-accenture-purple/20 border-2 border-accenture-purple rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-5 w-5 text-accenture-purple" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {selectedRows.size} row(s) selected
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Apply bulk adjustment:</span>
              <button
                onClick={() => handleBulkAdjustment('ai')}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm font-semibold"
              >
                AI Forecast
              </button>
              <button
                onClick={() => handleBulkAdjustment('final')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
              >
                Final Unit
              </button>
              <button
                onClick={() => setSelectedRows(new Set())}
                className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjustments Table - Hidden when all alerts are resolved */}
      {!allAlertsResolved && (
      <div id="adjustments-table" className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-accenture-purple focus:ring-accenture-purple rounded"
                  />
                </th>
                <th
                  className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  onClick={() => handleSort('unitName')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Unit</span>
                    <SortIcon column="unitName" />
                  </div>
                </th>
                <th
                  className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  onClick={() => handleSort('material')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Material</span>
                    <SortIcon column="material" />
                  </div>
                </th>
                <th
                  className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  onClick={() => handleSort('month')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Month</span>
                    <SortIcon column="month" />
                  </div>
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  <div className="flex items-center justify-end space-x-1">
                    <span>AI Forecast</span>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  </div>
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  <div className="flex items-center justify-end space-x-1">
                    <span>Final Unit Forecast</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  <div className="flex items-center justify-end space-x-1">
                    <span>Deviation</span>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase min-w-[400px]">
                  Adjustment Selection
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  Selected Value
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    selectedRows.has(row.id) ? 'bg-accenture-purple/5 dark:bg-accenture-purple/10' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      className="w-4 h-4 text-accenture-purple focus:ring-accenture-purple rounded"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{row.unitName}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.material}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{row.month}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
                      {row.aiForecast.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                      {row.finalUnitForecast.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-sm font-semibold ${(row.finalUnitForecast - row.aiForecast) >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {(row.finalUnitForecast - row.aiForecast) >= 0 ? '+' : ''}{(row.finalUnitForecast - row.aiForecast).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`source-${row.id}`}
                          checked={row.selectedSource === 'ai'}
                          onChange={() => handleSourceChange(row.id, 'ai')}
                          className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300">AI</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`source-${row.id}`}
                          checked={row.selectedSource === 'final'}
                          onChange={() => handleSourceChange(row.id, 'final')}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Final</span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`source-${row.id}`}
                          checked={row.selectedSource === 'custom'}
                          onChange={() => handleSourceChange(row.id, 'custom')}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Custom</span>
                      </label>
                      {row.selectedSource === 'custom' && (
                        <div className="flex items-center space-x-2">
                          {editingRow === row.id ? (
                            <>
                              <input
                                type="number"
                                value={customValues[row.id] || row.customValue}
                                onChange={(e) => handleCustomValueChange(row.id, e.target.value)}
                                className="w-24 px-2 py-1 text-xs border border-orange-300 dark:border-orange-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                                placeholder="Value"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveCustomValue(row.id)}
                                className="p-1 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                                {row.customValue.toLocaleString()}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingRow(row.id);
                                  setCustomValues(prev => ({ ...prev, [row.id]: row.customValue.toString() }));
                                }}
                                className="p-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {getSelectedValue(row).toLocaleString()} units
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(getSelectedValue(row) * row.unitPrice)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      row.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                        : row.status === 'adjusted'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {row.status === 'approved' ? 'Approved' : row.status === 'adjusted' ? 'Adjusted' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save Adjustments Button */}
        {selectedUnit && selectedMaterial && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-semibold">
                  Filtered by: <span className="text-accenture-purple dark:text-accenture-purple-light">{plnUnitsData.find(u => u.id === selectedUnit)?.name}</span> - <span className="text-accenture-purple dark:text-accenture-purple-light">{selectedMaterial}</span>
                </p>
                <p className="text-xs mt-1">Click Save to mark this deviation alert as resolved</p>
              </div>
              <button
                onClick={handleSaveAdjustments}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Save Adjustments</span>
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-accenture-purple text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Final Summary Table - Completely Hidden (No longer needed) */}
      {false && !allAlertsResolved && finalSummary.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b-2 border-green-500">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <span>Final Forecast Summary</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Review all forecasts before sending to E-Budget
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Month</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Source</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Quantity</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Unit Price</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {finalSummary.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.month}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        item.selectedSource === 'ai' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300' :
                        item.selectedSource === 'user' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' :
                        item.selectedSource === 'final' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
                      }`}>
                        {item.selectedSource.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.selectedValue.toLocaleString()} units
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.unitPrice)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(item.totalAmount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-accenture-purple/10 to-accenture-azure/10 dark:from-accenture-purple/20 dark:to-accenture-azure/20 border-t-2 border-accenture-purple">
                <tr>
                  <td colSpan={2} className="px-4 py-4 text-right">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">GRAND TOTAL:</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {finalSummary.reduce((sum, item) => sum + item.selectedValue, 0).toLocaleString()} units
                    </span>
                  </td>
                  <td></td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-xl font-bold text-accenture-purple dark:text-accenture-purple-light">
                      {formatCurrency(finalSummary.reduce((sum, item) => sum + item.totalAmount, 0))}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={handleConfirmSend}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all flex items-center space-x-3 font-bold text-lg shadow-lg transform hover:scale-105"
            >
              <Send className="h-6 w-6" />
              <span>Confirm & Send to E-Budget</span>
            </button>
          </div>
        </div>
      )}

      {/* Send to E-Budget Modal */}
      {showSendToEBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Send className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Sending to E-Budget...
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your consolidated procurement requirements are being sent to the E-Budget application.
              </p>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                Grand Total: IDR {categoryBreakdown.reduce((sum, cat) => sum + cat.totalValue, 0).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Confirm Submission
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to send the forecast to E-Budget? This action will submit the data for approval.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendToEBudget}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Successfully Sent!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Your consolidated forecast has been successfully sent to E-Budget application.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                Total value: {formatCurrency(finalSummary.reduce((sum, item) => sum + item.totalAmount, 0))}
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  // Go back to the parent flow's first tab via onSuccess callback
                  if (onSuccess) onSuccess();
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-accenture-purple to-accenture-azure hover:from-accenture-purple-dark hover:to-accenture-azure-dark text-white rounded-lg font-semibold transition-all shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DPKDemandConsolidationHQ;
