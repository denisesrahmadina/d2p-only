// APBA Mock Data for PLN Indonesia Power
// Comprehensive mock data for POs with "Arrived at Destination", BAPB, and BASTB documents

export interface APBAPurchaseOrder {
  po_id: string;
  po_number: string;
  contract_number: string;
  vendor_name: string;
  vendor_contact: string;
  order_date: string;
  arrived_date: string;
  delivery_location: string;
  status: 'ARRIVED_AT_DESTINATION';
  items: APBAPOItem[];
  total_value: number;
}

export interface APBAPOItem {
  item_id: string;
  item_name: string;
  item_description: string;
  ordered_quantity: number;
  received_quantity: number;
  unit_of_measure: string;
  unit_price: number;
  total_price: number;
}

export interface BAPBDocument {
  bapb_id: string;
  bapb_number: string;
  po_id: string;
  po_number: string;
  contract_number: string;
  inspection_date: string;
  inspection_location: string;
  vendor_name: string;
  vendor_representative: string;
  vendor_representative_position: string;
  pln_inspector: string;
  pln_inspector_position: string;
  items: BAPBItem[];
  status: 'DRAFT' | 'STEP_1' | 'STEP_2' | 'STEP_3' | 'STEP_4' | 'COMPLETED';
  current_step: number;
  rejection_notes?: string;
  inspection_notes?: string;
  supporting_documents: BAPBDocument_File[];
  signatures: BAPBSignatures;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface BAPBItem {
  item_id: string;
  item_name: string;
  item_description: string;
  ordered_quantity: number;
  received_quantity: number;
  inspected_quantity: number;
  approved_quantity: number;
  rejected_quantity: number;
  rejection_reason?: string;
  unit_of_measure: string;
  inspection_result: 'PASS' | 'PARTIAL' | 'FAIL' | 'PENDING';
  notes?: string;
}

export interface BAPBDocument_File {
  file_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface BAPBSignatures {
  vendor_maker?: SignatureData;
  pln_checker?: SignatureData;
  pln_approver?: SignatureData;
}

export interface SignatureData {
  name: string;
  position: string;
  signature_data: string;
  signed_at: string;
  user_id: string;
}

export interface BASTBDocument {
  bastb_id: string;
  bastb_number: string;
  bapb_id: string;
  bapb_number: string;
  po_id: string;
  po_number: string;
  contract_number: string;
  handover_date: string;
  handover_location: string;
  vendor_name: string;
  vendor_representative: string;
  vendor_representative_position: string;
  pln_receiver: string;
  pln_receiver_position: string;
  items: BASTBItem[];
  status: 'DRAFT' | 'PENDING_SIGNATURES' | 'COMPLETED';
  handover_notes?: string;
  supporting_documents: BAPBDocument_File[];
  signatures: BASTBSignatures;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface BASTBItem {
  item_id: string;
  item_name: string;
  item_description: string;
  approved_quantity: number;
  delivered_quantity: number;
  accepted_quantity: number;
  unit_of_measure: string;
  condition_notes?: string;
}

export interface BASTBSignatures {
  vendor_maker?: SignatureData;
  pln_receiver?: SignatureData;
  pln_approver?: SignatureData;
}

export interface BAPDocument {
  bap_id: string;
  bap_number: string;
  bastb_id: string;
  bastb_number: string;
  po_id: string;
  po_number: string;
  contract_number: string;
  payment_request_date: string;
  vendor_name: string;
  invoice_number: string;
  invoice_date: string;
  payment_amount: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PAID';
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Mock POs with "Arrived at Destination" status
let mockArrivedPOs: APBAPurchaseOrder[] = [
  // NEW Picture 1: BAPB Approved, ready for BASTB - Transformer Equipment
  {
    po_id: 'PO-2025-NEW-001',
    po_number: 'PO-PLN-2025-101',
    contract_number: 'CTR-PLN-2025-201',
    vendor_name: 'PT Schneider Electric Indonesia',
    vendor_contact: 'Wira Kusuma - 0811-2233-4455',
    order_date: '2025-02-01',
    arrived_date: '2025-02-10',
    delivery_location: 'PLN Indonesia Power - PLTU Suralaya Unit 8',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 8500000000,
    items: [
      {
        item_id: 'ITEM-TRANS-NEW-001',
        item_name: 'Power Transformer 150 MVA 150/20 kV',
        item_description: 'Oil-immersed power transformer, 150 MVA capacity, voltage ratio 150/20 kV, with on-load tap changer, ONAN/ONAF cooling',
        ordered_quantity: 2,
        received_quantity: 2,
        unit_of_measure: 'units',
        unit_price: 3500000000,
        total_price: 7000000000
      },
      {
        item_id: 'ITEM-BUSHING-NEW-001',
        item_name: 'Transformer Bushing 150 kV 1250A',
        item_description: 'Oil-to-air transformer bushing, 150 kV rated voltage, 1250A current rating, porcelain insulator',
        ordered_quantity: 12,
        received_quantity: 12,
        unit_of_measure: 'pieces',
        unit_price: 125000000,
        total_price: 1500000000
      }
    ]
  },
  // NEW Picture 2: BASTB Approved, ready for BAP - Cooling System
  {
    po_id: 'PO-2025-NEW-002',
    po_number: 'PO-PLN-2025-102',
    contract_number: 'CTR-PLN-2025-202',
    vendor_name: 'PT Mitsubishi Heavy Industries Indonesia',
    vendor_contact: 'Darmawan Susilo - 0856-7788-9900',
    order_date: '2025-02-03',
    arrived_date: '2025-02-12',
    delivery_location: 'PLN Indonesia Power - PLTGU Priok',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 15800000000,
    items: [
      {
        item_id: 'ITEM-COOL-NEW-001',
        item_name: 'Cooling Tower Fill Media Replacement',
        item_description: 'High-efficiency PVC cooling tower fill media, cross-flow design, fire retardant, UV stabilized, complete replacement kit',
        ordered_quantity: 4500,
        received_quantity: 4500,
        unit_of_measure: 'square meters',
        unit_price: 2800000,
        total_price: 12600000000
      },
      {
        item_id: 'ITEM-PUMP-NEW-001',
        item_name: 'Cooling Water Circulation Pump 5000 GPM',
        item_description: 'Horizontal centrifugal pump, 5000 GPM flow rate, 80 meter head, cast iron casing, stainless steel impeller',
        ordered_quantity: 4,
        received_quantity: 4,
        unit_of_measure: 'units',
        unit_price: 800000000,
        total_price: 3200000000
      }
    ]
  },
  // NEW Picture 3: BAP Approved, ready for Payment - Control System
  {
    po_id: 'PO-2025-NEW-003',
    po_number: 'PO-PLN-2025-103',
    contract_number: 'CTR-PLN-2025-203',
    vendor_name: 'PT Siemens Indonesia',
    vendor_contact: 'Hendro Wijaya - 0878-5566-7788',
    order_date: '2025-02-05',
    arrived_date: '2025-02-14',
    delivery_location: 'PLN Indonesia Power - PLTU Paiton Unit 7',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 22500000000,
    items: [
      {
        item_id: 'ITEM-DCS-NEW-001',
        item_name: 'Distributed Control System (DCS) Upgrade Package',
        item_description: 'Complete DCS system upgrade including controllers, I/O modules, operator stations, engineering stations, redundant network, and migration services',
        ordered_quantity: 1,
        received_quantity: 1,
        unit_of_measure: 'system',
        unit_price: 18500000000,
        total_price: 18500000000
      },
      {
        item_id: 'ITEM-HMI-NEW-001',
        item_name: 'Human Machine Interface (HMI) Workstation',
        item_description: 'Industrial HMI workstation with dual 27-inch monitors, redundant power supply, industrial grade PC, SCADA software license',
        ordered_quantity: 8,
        received_quantity: 8,
        unit_of_measure: 'sets',
        unit_price: 500000000,
        total_price: 4000000000
      }
    ]
  },
  // OLD DEMO DATA BELOW
  {
    po_id: 'PO-2025-DEMO-001',
    po_number: 'PO-PLN-2025-007',
    contract_number: 'CTR-PLN-2024-108',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_contact: 'Siti Aminah - 0813-9876-5432',
    order_date: '2025-01-08',
    arrived_date: '2025-01-18',
    delivery_location: 'PLN Indonesia Power - PLTU Paiton Unit 9',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 7000000000,
    items: [
      {
        item_id: 'ITEM-003-DEMO2',
        item_name: 'Generator Excitation System',
        item_description: 'Complete excitation system for 500MW generator',
        ordered_quantity: 2,
        received_quantity: 2,
        unit_of_measure: 'sets',
        unit_price: 3500000000,
        total_price: 7000000000
      }
    ]
  },
  {
    po_id: 'PO-2025-001',
    po_number: 'PO-PLN-2025-001',
    contract_number: 'CTR-PLN-2024-089',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_contact: 'Budi Santoso - 0812-3456-7890',
    order_date: '2025-01-05',
    arrived_date: '2025-01-15',
    delivery_location: 'PLN Indonesia Power - PLTU Suralaya Unit 7',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 12500000000,
    items: [
      {
        item_id: 'ITEM-001',
        item_name: 'Gas Turbine Blade Set - High Temperature Alloy',
        item_description: 'Complete set of high-temperature alloy turbine blades for gas turbine maintenance',
        ordered_quantity: 50,
        received_quantity: 50,
        unit_of_measure: 'pieces',
        unit_price: 250000000,
        total_price: 12500000000
      }
    ]
  },
  {
    po_id: 'PO-2025-002',
    po_number: 'PO-PLN-2025-002',
    contract_number: 'CTR-PLN-2024-091',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_contact: 'Siti Aminah - 0813-9876-5432',
    order_date: '2025-01-08',
    arrived_date: '2025-01-18',
    delivery_location: 'PLN Indonesia Power - PLTU Paiton Unit 9',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 7000000000,
    items: [
      {
        item_id: 'ITEM-003',
        item_name: 'Generator Excitation System',
        item_description: 'Complete excitation system for 500MW generator',
        ordered_quantity: 2,
        received_quantity: 2,
        unit_of_measure: 'sets',
        unit_price: 3500000000,
        total_price: 7000000000
      }
    ]
  },
  {
    po_id: 'PO-2025-003',
    po_number: 'PO-PLN-2025-003',
    contract_number: 'CTR-PLN-2024-095',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_contact: 'Ahmad Hidayat - 0821-5555-6666',
    order_date: '2025-01-10',
    arrived_date: '2025-01-20',
    delivery_location: 'PLN Indonesia Power - PLTGU Muara Karang',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 4200000000,
    items: [
      {
        item_id: 'ITEM-005',
        item_name: 'SCADA Monitoring System',
        item_description: 'Supervisory Control and Data Acquisition system for plant monitoring',
        ordered_quantity: 1,
        received_quantity: 1,
        unit_of_measure: 'system',
        unit_price: 4200000000,
        total_price: 4200000000
      }
    ]
  },
  {
    po_id: 'PO-2025-007',
    po_number: 'PO-PLN-2025-007',
    contract_number: 'CTR-PLN-2024-108',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_contact: 'Agus Setiawan - 0813-6666-7890',
    order_date: '2025-01-18',
    arrived_date: '2025-01-28',
    delivery_location: 'PLN Indonesia Power - PLTU Paiton Unit 9',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 875000000,
    items: [
      {
        item_id: 'ITEM-VALV-001',
        item_name: 'AUTOMATIC PROTECTION VALVE - Safety Relief Valve 10 bar',
        item_description: 'Spring-loaded safety relief valve with automatic operation, set pressure 10 bar, ASME Section VIII certified',
        ordered_quantity: 25,
        received_quantity: 25,
        unit_of_measure: 'pieces',
        unit_price: 4850000,
        total_price: 121250000
      },
      {
        item_id: 'ITEM-VALV-002',
        item_name: 'BALL VALVE 2-Piece Full Bore DN100',
        item_description: '2-piece full bore ball valve DN100, stainless steel 316 body and ball, PN40 rating',
        ordered_quantity: 50,
        received_quantity: 50,
        unit_of_measure: 'pieces',
        unit_price: 3250000,
        total_price: 162500000
      },
      {
        item_id: 'ITEM-VALV-003',
        item_name: 'BUTTERFLY VALVE Wafer Type DN200',
        item_description: 'Wafer-type butterfly valve DN200, cast iron body, stainless steel disc, EPDM seat, gear operated',
        ordered_quantity: 30,
        received_quantity: 30,
        unit_of_measure: 'pieces',
        unit_price: 4500000,
        total_price: 135000000
      },
      {
        item_id: 'ITM-VALV-CHECK-001',
        item_name: 'CHECK VALVE Swing Type DN80',
        item_description: 'Swing check valve DN80, cast iron body with bronze disc, prevents backflow, PN16 rating',
        ordered_quantity: 60,
        received_quantity: 60,
        unit_of_measure: 'pieces',
        unit_price: 1850000,
        total_price: 111000000
      },
      {
        item_id: 'ITM-VALV-GATE-001',
        item_name: 'GATE VALVE Rising Stem DN150',
        item_description: 'Rising stem gate valve DN150, cast steel body, bolted bonnet, handwheel operated, PN25 rating',
        ordered_quantity: 15,
        received_quantity: 15,
        unit_of_measure: 'pieces',
        unit_price: 8750000,
        total_price: 131250000
      },
      {
        item_id: 'ITM-VALV-GLOBE-001',
        item_name: 'GLOBE VALVE Y-Pattern DN50',
        item_description: 'Y-pattern globe valve DN50, stainless steel 316 body, suitable for throttling service, PN40 rating',
        ordered_quantity: 25,
        received_quantity: 25,
        unit_of_measure: 'pieces',
        unit_price: 4250000,
        total_price: 106250000
      },
      {
        item_id: 'ITM-VALV-NEEDLE-001',
        item_name: 'NEEDLE VALVE Stainless Steel 15mm',
        item_description: 'Precision needle valve 15mm, stainless steel 316, fine flow control, 6000 psi rating',
        ordered_quantity: 80,
        received_quantity: 80,
        unit_of_measure: 'pieces',
        unit_price: 975000,
        total_price: 78000000
      },
      {
        item_id: 'ITM-VALV-TRAP-001',
        item_name: 'TRAP - Float Steam Trap DN25',
        item_description: 'Mechanical float-type steam trap DN25, cast iron body with stainless steel internals',
        ordered_quantity: 12,
        received_quantity: 12,
        unit_of_measure: 'pieces',
        unit_price: 2450000,
        total_price: 29400000
      }
    ]
  },
  {
    po_id: 'PO-2025-011',
    po_number: 'PO-PLN-2025-011',
    contract_number: 'CTR-PLN-2024-112',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_contact: 'Rina Susanti - 0856-7890-1234',
    order_date: '2025-01-12',
    arrived_date: '2025-01-22',
    delivery_location: 'PLN Indonesia Power - PLTU Lontar Unit 3',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 5800000000,
    items: [
      {
        item_id: 'ITEM-011-001',
        item_name: 'PLC Control System Siemens S7-1500',
        item_description: 'Complete PLC control system with redundancy for plant automation',
        ordered_quantity: 1,
        received_quantity: 1,
        unit_of_measure: 'set',
        unit_price: 5800000000,
        total_price: 5800000000
      }
    ]
  },
  {
    po_id: 'PO-2025-012',
    po_number: 'PO-PLN-2025-012',
    contract_number: 'CTR-PLN-2024-115',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_contact: 'Dewi Kartika - 0877-4321-9876',
    order_date: '2025-01-14',
    arrived_date: '2025-01-24',
    delivery_location: 'PLN Indonesia Power - PLTU Suralaya Unit 5',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 3200000000,
    items: [
      {
        item_id: 'ITEM-SENS-001',
        item_name: 'Temperature Sensor RTD Pt100 Industrial Grade',
        item_description: 'High-accuracy RTD temperature sensors with HART protocol',
        ordered_quantity: 150,
        received_quantity: 150,
        unit_of_measure: 'pieces',
        unit_price: 12000000,
        total_price: 1800000000
      },
      {
        item_id: 'ITEM-SENS-002',
        item_name: 'Pressure Transmitter 0-200 bar Smart',
        item_description: 'Smart pressure transmitters with digital display and 4-20mA output',
        ordered_quantity: 80,
        received_quantity: 80,
        unit_of_measure: 'pieces',
        unit_price: 17500000,
        total_price: 1400000000
      }
    ]
  },
  {
    po_id: 'PO-2025-013',
    po_number: 'PO-PLN-2025-013',
    contract_number: 'CTR-PLN-2024-118',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_contact: 'Bambang Sutrisno - 0811-2468-3579',
    order_date: '2025-01-15',
    arrived_date: '2025-01-25',
    delivery_location: 'PLN Indonesia Power - PLTGU Priok',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 8500000000,
    items: [
      {
        item_id: 'ITEM-TRANS-001',
        item_name: 'Power Transformer 150 MVA 150/20 kV',
        item_description: 'Oil-immersed power transformer with OLTC, complete accessories',
        ordered_quantity: 1,
        received_quantity: 1,
        unit_of_measure: 'unit',
        unit_price: 8500000000,
        total_price: 8500000000
      }
    ]
  },
  {
    po_id: 'PO-2025-014',
    po_number: 'PO-PLN-2025-014',
    contract_number: 'CTR-PLN-2024-121',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_contact: 'Hadi Prabowo - 0822-9876-5432',
    order_date: '2025-01-16',
    arrived_date: '2025-01-26',
    delivery_location: 'PLN Indonesia Power - PLTU Paiton Unit 7',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 2100000000,
    items: [
      {
        item_id: 'ITEM-BRG-001',
        item_name: 'Roller Bearing SKF 23256 CA/W33',
        item_description: 'Spherical roller bearing for heavy-duty turbine applications',
        ordered_quantity: 20,
        received_quantity: 20,
        unit_of_measure: 'pieces',
        unit_price: 75000000,
        total_price: 1500000000
      },
      {
        item_id: 'ITEM-BRG-002',
        item_name: 'Thrust Bearing FAG 51330-MP',
        item_description: 'Single direction thrust ball bearing for axial loads',
        ordered_quantity: 15,
        received_quantity: 15,
        unit_of_measure: 'pieces',
        unit_price: 40000000,
        total_price: 600000000
      }
    ]
  },
  {
    po_id: 'PO-2025-015',
    po_number: 'PO-PLN-2025-015',
    contract_number: 'CTR-PLN-2024-124',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_contact: 'Santi Wijayanti - 0813-5432-7890',
    order_date: '2025-01-17',
    arrived_date: '2025-01-27',
    delivery_location: 'PLN Indonesia Power - PLTGU Muara Tawar',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 6400000000,
    items: [
      {
        item_id: 'ITEM-CAB-001',
        item_name: 'High Voltage Cable 20kV XLPE 3x240mm2',
        item_description: 'Cross-linked polyethylene insulated power cable with copper conductor',
        ordered_quantity: 5000,
        received_quantity: 5000,
        unit_of_measure: 'meters',
        unit_price: 950000,
        total_price: 4750000000
      },
      {
        item_id: 'ITEM-CAB-002',
        item_name: 'Control Cable 1kV 37x1.5mm2 Armoured',
        item_description: 'Multi-core control cable with steel wire armour for industrial use',
        ordered_quantity: 3000,
        received_quantity: 3000,
        unit_of_measure: 'meters',
        unit_price: 550000,
        total_price: 1650000000
      }
    ]
  },
  {
    po_id: 'PO-2025-016',
    po_number: 'PO-PLN-2025-016',
    contract_number: 'CTR-PLN-2024-127',
    vendor_name: 'PT Mechanical Parts Indonesia',
    vendor_contact: 'Yusuf Rahman - 0815-3344-5566',
    order_date: '2025-01-19',
    arrived_date: '2025-01-29',
    delivery_location: 'PLN Indonesia Power - PLTU Suralaya Unit 8',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 4850000000,
    items: [
      {
        item_id: 'ITEM-PUMP-001',
        item_name: 'Centrifugal Pump Horizontal 500m3/h',
        item_description: 'Heavy-duty centrifugal pump with cast iron casing, suitable for cooling water service',
        ordered_quantity: 4,
        received_quantity: 4,
        unit_of_measure: 'units',
        unit_price: 875000000,
        total_price: 3500000000
      },
      {
        item_id: 'ITEM-PUMP-002',
        item_name: 'Boiler Feed Pump Multistage 150m3/h',
        item_description: 'High-pressure multistage pump for boiler feed water, 180 bar discharge',
        ordered_quantity: 2,
        received_quantity: 2,
        unit_of_measure: 'units',
        unit_price: 675000000,
        total_price: 1350000000
      }
    ]
  },
  {
    po_id: 'PO-2025-017',
    po_number: 'PO-PLN-2025-017',
    contract_number: 'CTR-PLN-2024-130',
    vendor_name: 'PT Industrial Equipment Supplier',
    vendor_contact: 'Linda Kusuma - 0878-9999-1111',
    order_date: '2025-01-20',
    arrived_date: '2025-01-30',
    delivery_location: 'PLN Indonesia Power - PLTU Paiton Unit 9',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 3750000000,
    items: [
      {
        item_id: 'ITEM-FILT-001',
        item_name: 'Fuel Oil Filter Heavy Duty - Duplex System',
        item_description: 'Complete duplex fuel oil filter system with automatic changeover for heavy fuel oil service',
        ordered_quantity: 8,
        received_quantity: 8,
        unit_of_measure: 'sets',
        unit_price: 285000000,
        total_price: 2280000000
      },
      {
        item_id: 'ITEM-FILT-002',
        item_name: 'Hydraulic Oil Filter Cartridge 25 Micron',
        item_description: 'High-efficiency hydraulic oil filter cartridges with 25 micron rating',
        ordered_quantity: 120,
        received_quantity: 120,
        unit_of_measure: 'pieces',
        unit_price: 8500000,
        total_price: 1020000000
      },
      {
        item_id: 'ITEM-FILT-003',
        item_name: 'Air Intake Filter HEPA Industrial Grade',
        item_description: 'HEPA air intake filters for gas turbine applications',
        ordered_quantity: 75,
        received_quantity: 75,
        unit_of_measure: 'pieces',
        unit_price: 6000000,
        total_price: 450000000
      }
    ]
  },
  {
    po_id: 'PO-2025-018',
    po_number: 'PO-PLN-2025-018',
    contract_number: 'CTR-PLN-2024-133',
    vendor_name: 'PT Thermal Insulation Systems',
    vendor_contact: 'Rudi Hartono - 0821-7788-9900',
    order_date: '2025-01-21',
    arrived_date: '2025-01-31',
    delivery_location: 'PLN Indonesia Power - PLTGU Muara Karang',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 2950000000,
    items: [
      {
        item_id: 'ITEM-INSUL-001',
        item_name: 'Rockwool Insulation Blanket High Temperature 1200°C',
        item_description: 'High-temperature ceramic fiber blanket for boiler and duct insulation',
        ordered_quantity: 500,
        received_quantity: 500,
        unit_of_measure: 'rolls',
        unit_price: 3800000,
        total_price: 1900000000
      },
      {
        item_id: 'ITEM-INSUL-002',
        item_name: 'Fiberglass Pipe Insulation DN150 50mm Thickness',
        item_description: 'Pre-formed fiberglass pipe insulation with aluminum jacket',
        ordered_quantity: 800,
        received_quantity: 800,
        unit_of_measure: 'meters',
        unit_price: 850000,
        total_price: 680000000
      },
      {
        item_id: 'ITEM-INSUL-003',
        item_name: 'Ceramic Fiber Module 300x300x200mm',
        item_description: 'Anchor-mounted ceramic fiber modules for furnace lining',
        ordered_quantity: 250,
        received_quantity: 250,
        unit_of_measure: 'pieces',
        unit_price: 1480000,
        total_price: 370000000
      }
    ]
  },
  {
    po_id: 'PO-2025-019',
    po_number: 'PO-PLN-2025-019',
    contract_number: 'CTR-PLN-2024-136',
    vendor_name: 'PT Electrical Components Indonesia',
    vendor_contact: 'Dian Permatasari - 0856-1122-3344',
    order_date: '2025-01-22',
    arrived_date: '2025-02-01',
    delivery_location: 'PLN Indonesia Power - PLTU Lontar Unit 3',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 5200000000,
    items: [
      {
        item_id: 'ITEM-ELEC-001',
        item_name: 'Circuit Breaker Air 3200A ACB Schneider',
        item_description: 'Air circuit breaker 3200A with electronic trip unit and earth fault protection',
        ordered_quantity: 6,
        received_quantity: 6,
        unit_of_measure: 'units',
        unit_price: 425000000,
        total_price: 2550000000
      },
      {
        item_id: 'ITEM-ELEC-002',
        item_name: 'Motor Contactor 630A with Overload Relay',
        item_description: 'Heavy-duty motor contactor with thermal overload protection',
        ordered_quantity: 15,
        received_quantity: 15,
        unit_of_measure: 'sets',
        unit_price: 85000000,
        total_price: 1275000000
      },
      {
        item_id: 'ITEM-ELEC-003',
        item_name: 'Variable Frequency Drive 400kW ABB',
        item_description: 'Industrial VFD for motor speed control with bypass option',
        ordered_quantity: 3,
        received_quantity: 3,
        unit_of_measure: 'units',
        unit_price: 458333333,
        total_price: 1375000000
      }
    ]
  },
  {
    po_id: 'PO-2025-020',
    po_number: 'PO-PLN-2025-020',
    contract_number: 'CTR-PLN-2024-139',
    vendor_name: 'PT Mechanical Seals & Gaskets',
    vendor_contact: 'Hendra Gunawan - 0813-4455-6677',
    order_date: '2025-01-23',
    arrived_date: '2025-02-02',
    delivery_location: 'PLN Indonesia Power - PLTU Suralaya Unit 5',
    status: 'ARRIVED_AT_DESTINATION',
    total_value: 1890000000,
    items: [
      {
        item_id: 'ITEM-GSKT-001',
        item_name: 'Spiral Wound Gasket 316SS DN300 PN40',
        item_description: 'Spiral wound gasket with 316 stainless steel and graphite filler',
        ordered_quantity: 200,
        received_quantity: 200,
        unit_of_measure: 'pieces',
        unit_price: 4250000,
        total_price: 850000000
      },
      {
        item_id: 'ITEM-GSKT-002',
        item_name: 'Mechanical Seal Burgmann MG1 Cartridge Type',
        item_description: 'Cartridge mechanical seal for centrifugal pump applications',
        ordered_quantity: 40,
        received_quantity: 40,
        unit_of_measure: 'sets',
        unit_price: 18500000,
        total_price: 740000000
      },
      {
        item_id: 'ITEM-GSKT-003',
        item_name: 'O-Ring Viton FKM High Temperature Set',
        item_description: 'Complete set of Viton O-rings in various sizes for high-temperature service',
        ordered_quantity: 25,
        received_quantity: 25,
        unit_of_measure: 'sets',
        unit_price: 12000000,
        total_price: 300000000
      }
    ]
  }
];

// Mock BAPB Documents
let mockBAPBDocuments: BAPBDocument[] = [
  // NEW Picture 1: BAPB Approved (Green) - Ready to proceed to BASTB - Transformer
  {
    bapb_id: 'BAPB-NEW-001',
    bapb_number: 'BAPB/PLN-IP/2025/NEW-101',
    po_id: 'PO-2025-NEW-001',
    po_number: 'PO-PLN-2025-101',
    contract_number: 'CTR-PLN-2025-201',
    inspection_date: '2025-02-11',
    inspection_location: 'PLN Indonesia Power - PLTU Suralaya Unit 8',
    vendor_name: 'PT Schneider Electric Indonesia',
    vendor_representative: 'Wira Kusuma',
    vendor_representative_position: 'Technical Project Manager',
    pln_inspector: 'Ir. Yudistira Pratama, ST, MT',
    pln_inspector_position: 'Chief Electrical Inspector',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'Power transformers and bushings thoroughly inspected. All equipment meets IEC standards and specifications.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Wira Kusuma',
        position: 'Technical Project Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-11T14:30:00',
        user_id: 'wira.kusuma@schneider.com'
      },
      pln_checker: {
        name: 'Ir. Yudistira Pratama, ST, MT',
        position: 'Chief Electrical Inspector',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-11T16:00:00',
        user_id: 'yudistira.pratama@pln.co.id'
      },
      pln_approver: {
        name: 'Dr. Hartono Wijaya, MBA',
        position: 'Electrical Department Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-11T17:15:00',
        user_id: 'hartono.wijaya@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-TRANS-NEW-001',
        item_name: 'Power Transformer 150 MVA 150/20 kV',
        item_description: 'Oil-immersed power transformer, 150 MVA capacity, voltage ratio 150/20 kV, with on-load tap changer, ONAN/ONAF cooling',
        ordered_quantity: 2,
        received_quantity: 2,
        inspected_quantity: 2,
        approved_quantity: 2,
        rejected_quantity: 0,
        unit_of_measure: 'units',
        inspection_result: 'PASS',
        notes: 'Both transformers passed all electrical and mechanical tests'
      },
      {
        item_id: 'ITEM-BUSHING-NEW-001',
        item_name: 'Transformer Bushing 150 kV 1250A',
        item_description: 'Oil-to-air transformer bushing, 150 kV rated voltage, 1250A current rating, porcelain insulator',
        ordered_quantity: 12,
        received_quantity: 12,
        inspected_quantity: 12,
        approved_quantity: 12,
        rejected_quantity: 0,
        unit_of_measure: 'pieces',
        inspection_result: 'PASS',
        notes: 'All bushings meet voltage withstand and insulation resistance requirements'
      }
    ],
    created_at: '2025-02-11T09:00:00',
    updated_at: '2025-02-11T17:15:00',
    created_by: 'yudistira.pratama@pln.co.id'
  },
  // NEW Picture 2: BAPB Approved for Cooling System
  {
    bapb_id: 'BAPB-NEW-002',
    bapb_number: 'BAPB/PLN-IP/2025/NEW-102',
    po_id: 'PO-2025-NEW-002',
    po_number: 'PO-PLN-2025-102',
    contract_number: 'CTR-PLN-2025-202',
    inspection_date: '2025-02-13',
    inspection_location: 'PLN Indonesia Power - PLTGU Priok',
    vendor_name: 'PT Mitsubishi Heavy Industries Indonesia',
    vendor_representative: 'Darmawan Susilo',
    vendor_representative_position: 'Senior Project Manager',
    pln_inspector: 'Ir. Rahmat Hidayat, ST',
    pln_inspector_position: 'Mechanical Inspector',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'Cooling tower fill media and circulation pumps inspected. All equipment meets specifications and quality standards.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Darmawan Susilo',
        position: 'Senior Project Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-13T15:00:00',
        user_id: 'darmawan.susilo@mhi.com'
      },
      pln_checker: {
        name: 'Ir. Rahmat Hidayat, ST',
        position: 'Mechanical Inspector',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-13T16:30:00',
        user_id: 'rahmat.hidayat@pln.co.id'
      },
      pln_approver: {
        name: 'Dr. Bambang Hermanto, MM',
        position: 'Mechanical Engineering Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-13T17:45:00',
        user_id: 'bambang.hermanto@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-COOL-NEW-001',
        item_name: 'Cooling Tower Fill Media Replacement',
        item_description: 'High-efficiency PVC cooling tower fill media, cross-flow design, fire retardant, UV stabilized, complete replacement kit',
        ordered_quantity: 4500,
        received_quantity: 4500,
        inspected_quantity: 4500,
        approved_quantity: 4500,
        rejected_quantity: 0,
        unit_of_measure: 'square meters',
        inspection_result: 'PASS',
        notes: 'All fill media sheets inspected for quality and dimensions'
      },
      {
        item_id: 'ITEM-PUMP-NEW-001',
        item_name: 'Cooling Water Circulation Pump 5000 GPM',
        item_description: 'Horizontal centrifugal pump, 5000 GPM flow rate, 80 meter head, cast iron casing, stainless steel impeller',
        ordered_quantity: 4,
        received_quantity: 4,
        inspected_quantity: 4,
        approved_quantity: 4,
        rejected_quantity: 0,
        unit_of_measure: 'units',
        inspection_result: 'PASS',
        notes: 'All pumps tested for performance and vibration levels'
      }
    ],
    created_at: '2025-02-13T09:00:00',
    updated_at: '2025-02-13T17:45:00',
    created_by: 'rahmat.hidayat@pln.co.id'
  },
  // NEW Picture 3: BAPB Approved for Control System
  {
    bapb_id: 'BAPB-NEW-003',
    bapb_number: 'BAPB/PLN-IP/2025/NEW-103',
    po_id: 'PO-2025-NEW-003',
    po_number: 'PO-PLN-2025-103',
    contract_number: 'CTR-PLN-2025-203',
    inspection_date: '2025-02-15',
    inspection_location: 'PLN Indonesia Power - PLTU Paiton Unit 7',
    vendor_name: 'PT Siemens Indonesia',
    vendor_representative: 'Hendro Wijaya',
    vendor_representative_position: 'DCS Project Manager',
    pln_inspector: 'Ir. Agung Prasetyo, ST, MT',
    pln_inspector_position: 'Instrumentation & Control Inspector',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'DCS system and HMI workstations inspected. All equipment tested and verified functional. System integration tests passed.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Hendro Wijaya',
        position: 'DCS Project Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-15T15:30:00',
        user_id: 'hendro.wijaya@siemens.com'
      },
      pln_checker: {
        name: 'Ir. Agung Prasetyo, ST, MT',
        position: 'Instrumentation & Control Inspector',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-15T17:00:00',
        user_id: 'agung.prasetyo@pln.co.id'
      },
      pln_approver: {
        name: 'Dr. Ir. Sutrisno Hadi, MBA',
        position: 'I&C Department Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-15T18:15:00',
        user_id: 'sutrisno.hadi@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-DCS-NEW-001',
        item_name: 'Distributed Control System (DCS) Upgrade Package',
        item_description: 'Complete DCS system upgrade including controllers, I/O modules, operator stations, engineering stations, redundant network, and migration services',
        ordered_quantity: 1,
        received_quantity: 1,
        inspected_quantity: 1,
        approved_quantity: 1,
        rejected_quantity: 0,
        unit_of_measure: 'system',
        inspection_result: 'PASS',
        notes: 'DCS system fully tested, all controllers and I/O modules verified functional'
      },
      {
        item_id: 'ITEM-HMI-NEW-001',
        item_name: 'Human Machine Interface (HMI) Workstation',
        item_description: 'Industrial HMI workstation with dual 27-inch monitors, redundant power supply, industrial grade PC, SCADA software license',
        ordered_quantity: 8,
        received_quantity: 8,
        inspected_quantity: 8,
        approved_quantity: 8,
        rejected_quantity: 0,
        unit_of_measure: 'sets',
        inspection_result: 'PASS',
        notes: 'All HMI workstations tested, displays and software verified working'
      }
    ],
    created_at: '2025-02-15T09:00:00',
    updated_at: '2025-02-15T18:15:00',
    created_by: 'agung.prasetyo@pln.co.id'
  },
  {
    bapb_id: 'BAPB-DEMO-004',
    bapb_number: 'BAPB/PLN-IP/2025/DEMO-004',
    po_id: 'PO-2025-DEMO-004',
    po_number: 'PO-PLN-2025-002',
    contract_number: 'CTR-PLN-2024-091',
    inspection_date: '2025-01-19',
    inspection_location: 'PLN Indonesia Power - PLTU Paiton Unit 9',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Siti Aminah',
    vendor_representative_position: 'Technical Director',
    pln_inspector: 'Ir. Bambang Wijaya, ST',
    pln_inspector_position: 'Chief Electrical Inspector',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'Generator excitation system approved',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Siti Aminah',
        position: 'Technical Director',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-19T15:00:00',
        user_id: 'siti.aminah@airfilter.com'
      },
      pln_checker: {
        name: 'Ir. Bambang Wijaya, ST',
        position: 'Chief Electrical Inspector',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-19T16:30:00',
        user_id: 'bambang.wijaya@pln.co.id'
      },
      pln_approver: {
        name: 'Dr. Siti Rahmawati',
        position: 'Quality Assurance Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-19T17:45:00',
        user_id: 'siti.rahmawati@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-003-DEMO2',
        item_name: 'Generator Excitation System',
        item_description: 'Complete excitation system for 500MW generator',
        ordered_quantity: 2,
        received_quantity: 2,
        inspected_quantity: 2,
        approved_quantity: 2,
        rejected_quantity: 0,
        unit_of_measure: 'sets',
        inspection_result: 'PASS',
        notes: 'Excitation system fully tested and approved'
      }
    ],
    created_at: '2025-01-19T10:00:00',
    updated_at: '2025-01-19T17:45:00',
    created_by: 'bambang.wijaya@pln.co.id'
  },
  {
    bapb_id: 'BAPB-2025-001',
    bapb_number: 'BAPB/PLN-IP/2025/001',
    po_id: 'PO-2025-001',
    po_number: 'PO-PLN-2025-001',
    contract_number: 'CTR-PLN-2024-089',
    inspection_date: '2025-01-16',
    inspection_location: 'PLN Indonesia Power - PLTU Suralaya Unit 7',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Budi Santoso',
    vendor_representative_position: 'Project Manager',
    pln_inspector: 'Ir. Ahmad Surya, MT',
    pln_inspector_position: 'Senior Quality Inspector',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'All items inspected and verified according to specifications. Two turbine blades rejected due to surface defects.',
    supporting_documents: [
      {
        file_id: 'DOC-001',
        file_name: 'inspection_report_bapb_001.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bapb/inspection_report_bapb_001.pdf',
        uploaded_at: '2025-01-16T14:30:00',
        uploaded_by: 'ahmad.surya@pln.co.id'
      }
    ],
    signatures: {
      vendor_maker: {
        name: 'Budi Santoso',
        position: 'Project Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-16T15:00:00',
        user_id: 'budi.santoso@turbinnusantara.com'
      },
      pln_checker: {
        name: 'Ir. Ahmad Surya, MT',
        position: 'Senior Quality Inspector',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-16T16:30:00',
        user_id: 'ahmad.surya@pln.co.id'
      },
      pln_approver: {
        name: 'Dr. Siti Rahmawati',
        position: 'Quality Assurance Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-16T17:45:00',
        user_id: 'siti.rahmawati@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-001',
        item_name: 'Gas Turbine Blade Set - High Temperature Alloy',
        item_description: 'Complete set of high-temperature alloy turbine blades for gas turbine maintenance',
        ordered_quantity: 50,
        received_quantity: 50,
        inspected_quantity: 50,
        approved_quantity: 48,
        rejected_quantity: 2,
        rejection_reason: 'Surface defects detected on 2 blades - scratches beyond acceptable tolerance',
        unit_of_measure: 'pieces',
        inspection_result: 'PARTIAL',
        notes: 'Vendor will replace rejected items within 7 days'
      }
    ],
    created_at: '2025-01-16T10:00:00',
    updated_at: '2025-01-16T17:45:00',
    created_by: 'ahmad.surya@pln.co.id'
  },
  {
    bapb_id: 'BAPB-2025-002',
    bapb_number: 'BAPB/PLN-IP/2025/002',
    po_id: 'PO-2025-002',
    po_number: 'PO-PLN-2025-002',
    contract_number: 'CTR-PLN-2024-091',
    inspection_date: '2025-01-19',
    inspection_location: 'PLN Indonesia Power - PLTU Paiton Unit 9',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Siti Aminah',
    vendor_representative_position: 'Technical Director',
    pln_inspector: 'Ir. Bambang Wijaya, ST',
    pln_inspector_position: 'Chief Electrical Inspector',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'Generator excitation system inspected thoroughly. All components meet specifications and technical requirements.',
    supporting_documents: [
      {
        file_id: 'DOC-002',
        file_name: 'inspection_report_bapb_002.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bapb/inspection_report_bapb_002.pdf',
        uploaded_at: '2025-01-19T15:30:00',
        uploaded_by: 'bambang.wijaya@pln.co.id'
      }
    ],
    signatures: {
      vendor_maker: {
        name: 'Siti Aminah',
        position: 'Technical Director',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-19T16:00:00',
        user_id: 'siti.aminah@energisistem.com'
      },
      pln_checker: {
        name: 'Ir. Bambang Wijaya, ST',
        position: 'Chief Electrical Inspector',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-19T17:15:00',
        user_id: 'bambang.wijaya@pln.co.id'
      },
      pln_approver: {
        name: 'Dr. Siti Rahmawati',
        position: 'Quality Assurance Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-19T18:00:00',
        user_id: 'siti.rahmawati@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-003',
        item_name: 'Generator Excitation System',
        item_description: 'Complete excitation system for 500MW generator',
        ordered_quantity: 2,
        received_quantity: 2,
        inspected_quantity: 2,
        approved_quantity: 2,
        rejected_quantity: 0,
        unit_of_measure: 'sets',
        inspection_result: 'PASS',
        notes: 'All systems tested and operational, documentation complete'
      }
    ],
    created_at: '2025-01-19T10:00:00',
    updated_at: '2025-01-19T18:00:00',
    created_by: 'bambang.wijaya@pln.co.id'
  },
  {
    bapb_id: 'BAPB-2025-004',
    bapb_number: 'BAPB/PLN-IP/2025/004',
    po_id: 'PO-2025-011',
    po_number: 'PO-PLN-2025-011',
    contract_number: 'CTR-PLN-2024-112',
    inspection_date: '2025-01-23',
    inspection_location: 'PLN Indonesia Power - PLTU Lontar Unit 3',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Rina Susanti',
    vendor_representative_position: 'Technical Manager',
    pln_inspector: 'Ir. Hendra Gunawan, ST',
    pln_inspector_position: 'Control Systems Engineer',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'PLC system inspection completed. All modules tested and functional. Configuration verified.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Rina Susanti',
        position: 'Technical Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-23T14:00:00',
        user_id: 'rina.susanti@sistemkontrol.com'
      },
      pln_checker: {
        name: 'Ir. Hendra Gunawan, ST',
        position: 'Control Systems Engineer',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-23T15:00:00',
        user_id: 'hendra.gunawan@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Priyono Widodo, MBA',
        position: 'Technical Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-23T16:00:00',
        user_id: 'priyono.widodo@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-011-001',
        item_name: 'PLC Control System Siemens S7-1500',
        item_description: 'Complete PLC control system with redundancy for plant automation',
        ordered_quantity: 1,
        received_quantity: 1,
        inspected_quantity: 1,
        approved_quantity: 1,
        rejected_quantity: 0,
        unit_of_measure: 'set',
        inspection_result: 'PASS',
        notes: 'System fully tested, redundancy functional, all I/O modules operational'
      }
    ],
    created_at: '2025-01-23T09:00:00',
    updated_at: '2025-01-23T16:30:00',
    created_by: 'hendra.gunawan@pln.co.id'
  },
  {
    bapb_id: 'BAPB-2025-005',
    bapb_number: 'BAPB/PLN-IP/2025/005',
    po_id: 'PO-2025-012',
    po_number: 'PO-PLN-2025-012',
    contract_number: 'CTR-PLN-2024-115',
    inspection_date: '2025-01-25',
    inspection_location: 'PLN Indonesia Power - PLTU Suralaya Unit 5',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Dewi Kartika',
    vendor_representative_position: 'Sales Engineer',
    pln_inspector: 'Ir. Agus Setiawan, MT',
    pln_inspector_position: 'Instrumentation Specialist',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'All sensors and transmitters inspected and calibrated. Test certificates verified.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Dewi Kartika',
        position: 'Sales Engineer',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-25T13:00:00',
        user_id: 'dewi.kartika@instrumenakurasi.com'
      },
      pln_checker: {
        name: 'Ir. Agus Setiawan, MT',
        position: 'Instrumentation Specialist',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-25T14:30:00',
        user_id: 'agus.setiawan@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Rudi Hartono, ST',
        position: 'Electrical Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-25T15:30:00',
        user_id: 'rudi.hartono@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-SENS-001',
        item_name: 'Temperature Sensor RTD Pt100 Industrial Grade',
        item_description: 'High-accuracy RTD temperature sensors with HART protocol',
        ordered_quantity: 150,
        received_quantity: 150,
        inspected_quantity: 150,
        approved_quantity: 148,
        rejected_quantity: 2,
        rejection_reason: '2 units failed calibration test, out of tolerance',
        unit_of_measure: 'pieces',
        inspection_result: 'PARTIAL',
        notes: 'Minor rejection due to calibration, vendor will replace'
      },
      {
        item_id: 'ITEM-SENS-002',
        item_name: 'Pressure Transmitter 0-200 bar Smart',
        item_description: 'Smart pressure transmitters with digital display and 4-20mA output',
        ordered_quantity: 80,
        received_quantity: 80,
        inspected_quantity: 80,
        approved_quantity: 80,
        rejected_quantity: 0,
        unit_of_measure: 'pieces',
        inspection_result: 'PASS',
        notes: 'All transmitters passed inspection and accuracy tests'
      }
    ],
    created_at: '2025-01-25T08:00:00',
    updated_at: '2025-01-25T16:00:00',
    created_by: 'agus.setiawan@pln.co.id'
  },
  {
    bapb_id: 'BAPB-2025-006',
    bapb_number: 'BAPB/PLN-IP/2025/006',
    po_id: 'PO-2025-013',
    po_number: 'PO-PLN-2025-013',
    contract_number: 'CTR-PLN-2024-118',
    inspection_date: '2025-01-26',
    inspection_location: 'PLN Indonesia Power - PLTGU Priok',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Bambang Sutrisno',
    vendor_representative_position: 'Project Director',
    pln_inspector: 'Ir. Yanto Prasetyo, MEng',
    pln_inspector_position: 'Senior Electrical Engineer',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'Power transformer thoroughly inspected. All electrical and mechanical tests passed. Oil analysis satisfactory.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Bambang Sutrisno',
        position: 'Project Director',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-26T16:00:00',
        user_id: 'bambang.sutrisno@transformasi.com'
      },
      pln_checker: {
        name: 'Ir. Yanto Prasetyo, MEng',
        position: 'Senior Electrical Engineer',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-26T17:00:00',
        user_id: 'yanto.prasetyo@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Darmawan Kusuma, MBA',
        position: 'Plant Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-26T17:30:00',
        user_id: 'darmawan.kusuma@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-TRANS-001',
        item_name: 'Power Transformer 150 MVA 150/20 kV',
        item_description: 'Oil-immersed power transformer with OLTC, complete accessories',
        ordered_quantity: 1,
        received_quantity: 1,
        inspected_quantity: 1,
        approved_quantity: 1,
        rejected_quantity: 0,
        unit_of_measure: 'unit',
        inspection_result: 'PASS',
        notes: 'Factory acceptance test reports verified, insulation resistance excellent, OLTC operation smooth'
      }
    ],
    created_at: '2025-01-26T09:00:00',
    updated_at: '2025-01-26T18:00:00',
    created_by: 'yanto.prasetyo@pln.co.id'
  },
  {
    bapb_id: 'BAPB-2025-007',
    bapb_number: 'BAPB/PLN-IP/2025/007',
    po_id: 'PO-2025-014',
    po_number: 'PO-PLN-2025-014',
    contract_number: 'CTR-PLN-2024-121',
    inspection_date: '2025-01-27',
    inspection_location: 'PLN Indonesia Power - PLTU Paiton Unit 7',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Hadi Prabowo',
    vendor_representative_position: 'Technical Sales Manager',
    pln_inspector: 'Ir. Sugiarto Wibowo, ST',
    pln_inspector_position: 'Mechanical Maintenance Engineer',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'All bearings inspected for dimensional accuracy and finish quality. Certificates of origin verified.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Hadi Prabowo',
        position: 'Technical Sales Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-27T13:30:00',
        user_id: 'hadi.prabowo@bearingpresisi.com'
      },
      pln_checker: {
        name: 'Ir. Sugiarto Wibowo, ST',
        position: 'Mechanical Maintenance Engineer',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-27T14:30:00',
        user_id: 'sugiarto.wibowo@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Tono Suprapto, MM',
        position: 'Maintenance Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-27T15:00:00',
        user_id: 'tono.suprapto@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-BRG-001',
        item_name: 'Roller Bearing SKF 23256 CA/W33',
        item_description: 'Spherical roller bearing for heavy-duty turbine applications',
        ordered_quantity: 20,
        received_quantity: 20,
        inspected_quantity: 20,
        approved_quantity: 20,
        rejected_quantity: 0,
        unit_of_measure: 'pieces',
        inspection_result: 'PASS',
        notes: 'All bearings genuine SKF, proper packaging and storage'
      },
      {
        item_id: 'ITEM-BRG-002',
        item_name: 'Thrust Bearing FAG 51330-MP',
        item_description: 'Single direction thrust ball bearing for axial loads',
        ordered_quantity: 15,
        received_quantity: 15,
        inspected_quantity: 15,
        approved_quantity: 15,
        rejected_quantity: 0,
        unit_of_measure: 'pieces',
        inspection_result: 'PASS',
        notes: 'Authentic FAG bearings, certificates verified'
      }
    ],
    created_at: '2025-01-27T10:00:00',
    updated_at: '2025-01-27T15:30:00',
    created_by: 'sugiarto.wibowo@pln.co.id'
  },
  {
    bapb_id: 'BAPB-2025-003',
    bapb_number: 'BAPB/PLN-IP/2025/003',
    po_id: 'PO-2025-002',
    po_number: 'PO-PLN-2025-002',
    contract_number: 'CTR-PLN-2024-092',
    inspection_date: '2025-01-29',
    inspection_location: 'PLN Indonesia Power - PLTU Paiton Unit 9',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Eko Prasetyo',
    vendor_representative_position: 'Project Manager',
    pln_inspector: 'Ir. Hadi Santoso, ST',
    pln_inspector_position: 'Mechanical Engineer',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'All centrifugal pumps inspected and tested. Performance tests passed successfully.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Eko Prasetyo',
        position: 'Project Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-29T14:00:00',
        user_id: 'eko.prasetyo@pompasentral.com'
      },
      pln_checker: {
        name: 'Ir. Hadi Santoso, ST',
        position: 'Mechanical Engineer',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-29T15:00:00',
        user_id: 'hadi.santoso@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Gunawan Wibowo, MBA',
        position: 'Plant Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-29T15:30:00',
        user_id: 'gunawan.wibowo@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-003',
        item_name: 'Centrifugal Pump - High Capacity 500 m3/h',
        item_description: 'Industrial centrifugal pump for cooling water system',
        ordered_quantity: 4,
        received_quantity: 4,
        inspected_quantity: 4,
        approved_quantity: 4,
        rejected_quantity: 0,
        unit_of_measure: 'units',
        inspection_result: 'PASS',
        notes: 'All pumps tested at rated capacity, vibration levels within acceptable limits'
      }
    ],
    created_at: '2025-01-29T09:00:00',
    updated_at: '2025-01-29T16:00:00',
    created_by: 'hadi.santoso@pln.co.id'
  },
  {
    bapb_id: 'BAPB-2025-008',
    bapb_number: 'BAPB/PLN-IP/2025/008',
    po_id: 'PO-2025-015',
    po_number: 'PO-PLN-2025-015',
    contract_number: 'CTR-PLN-2024-124',
    inspection_date: '2025-01-30',
    inspection_location: 'PLN Indonesia Power - PLTGU Muara Tawar',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Santi Wijayanti',
    vendor_representative_position: 'Technical Director',
    pln_inspector: 'Ir. Fajar Nugraha, MEng',
    pln_inspector_position: 'Senior Electrical Engineer',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'All power cables and control cables inspected. Insulation resistance tests and conductor continuity tests passed.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Santi Wijayanti',
        position: 'Technical Director',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-30T16:00:00',
        user_id: 'santi.wijayanti@kabelnusantara.com'
      },
      pln_checker: {
        name: 'Ir. Fajar Nugraha, MEng',
        position: 'Senior Electrical Engineer',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-30T17:00:00',
        user_id: 'fajar.nugraha@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Rizki Pratama, MBA',
        position: 'Operations Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-30T17:30:00',
        user_id: 'rizki.pratama@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-CAB-001',
        item_name: 'High Voltage Cable 20kV XLPE 3x240mm2',
        item_description: 'Cross-linked polyethylene insulated power cable with copper conductor',
        ordered_quantity: 5000,
        received_quantity: 5000,
        inspected_quantity: 5000,
        approved_quantity: 5000,
        rejected_quantity: 0,
        unit_of_measure: 'meters',
        inspection_result: 'PASS',
        notes: 'Cable insulation resistance excellent, conductor resistance within specification'
      },
      {
        item_id: 'ITEM-CAB-002',
        item_name: 'Control Cable 1kV 37x1.5mm2 Armoured',
        item_description: 'Multi-core control cable with steel wire armour for industrial use',
        ordered_quantity: 3000,
        received_quantity: 3000,
        inspected_quantity: 3000,
        approved_quantity: 3000,
        rejected_quantity: 0,
        unit_of_measure: 'meters',
        inspection_result: 'PASS',
        notes: 'All cores tested, continuity and insulation resistance satisfactory'
      }
    ],
    created_at: '2025-01-30T10:00:00',
    updated_at: '2025-01-30T18:00:00',
    created_by: 'fajar.nugraha@pln.co.id'
  },
  {
    bapb_id: 'BAPB-2025-009',
    bapb_number: 'BAPB/PLN-IP/2025/009',
    po_id: 'PO-2025-003',
    po_number: 'PO-PLN-2025-003',
    contract_number: 'CTR-PLN-2024-095',
    inspection_date: '2025-01-21',
    inspection_location: 'PLN Indonesia Power - PLTGU Muara Karang',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Ahmad Hidayat',
    vendor_representative_position: 'Operations Manager',
    pln_inspector: 'Ir. Teguh Wibowo, ST',
    pln_inspector_position: 'SCADA Systems Inspector',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'SCADA system fully inspected and tested. All monitoring points functional.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Ahmad Hidayat',
        position: 'Operations Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-21T15:00:00',
        user_id: 'ahmad.hidayat@scadasystems.com'
      },
      pln_checker: {
        name: 'Ir. Teguh Wibowo, ST',
        position: 'SCADA Systems Inspector',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-21T16:00:00',
        user_id: 'teguh.wibowo@pln.co.id'
      },
      pln_approver: {
        name: 'Dr. Siti Rahmawati',
        position: 'Quality Assurance Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-21T17:00:00',
        user_id: 'siti.rahmawati@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-005',
        item_name: 'SCADA Monitoring System',
        item_description: 'Supervisory Control and Data Acquisition system for plant monitoring',
        ordered_quantity: 1,
        received_quantity: 1,
        inspected_quantity: 1,
        approved_quantity: 1,
        rejected_quantity: 0,
        unit_of_measure: 'system',
        inspection_result: 'PASS',
        notes: 'System tested and verified operational'
      }
    ],
    created_at: '2025-01-21T10:00:00',
    updated_at: '2025-01-21T17:00:00',
    created_by: 'teguh.wibowo@pln.co.id'
  },
  {
    bapb_id: 'BAPB-2025-010',
    bapb_number: 'BAPB/PLN-IP/2025/010',
    po_id: 'PO-2025-007',
    po_number: 'PO-PLN-2025-007',
    contract_number: 'CTR-PLN-2024-108',
    inspection_date: '2025-01-29',
    inspection_location: 'PLN Indonesia Power - PLTU Paiton Unit 9',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Agus Setiawan',
    vendor_representative_position: 'Delivery Manager',
    pln_inspector: 'Ir. Budi Hermawan, MT',
    pln_inspector_position: 'Valve Systems Inspector',
    status: 'COMPLETED',
    current_step: 4,
    inspection_notes: 'All valves inspected and pressure tested. Quality meets specifications.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Agus Setiawan',
        position: 'Delivery Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-29T14:30:00',
        user_id: 'joko.widodo@valveindustry.com'
      },
      pln_checker: {
        name: 'Ir. Budi Hermawan, MT',
        position: 'Valve Systems Inspector',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-29T15:30:00',
        user_id: 'budi.hermawan@pln.co.id'
      },
      pln_approver: {
        name: 'Dr. Siti Rahmawati',
        position: 'Quality Assurance Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-29T16:00:00',
        user_id: 'siti.rahmawati@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-VALV-001',
        item_name: 'AUTOMATIC PROTECTION VALVE - Safety Relief Valve 10 bar',
        item_description: 'Spring-loaded safety relief valve with automatic operation, set pressure 10 bar, ASME Section VIII certified',
        ordered_quantity: 25,
        received_quantity: 25,
        inspected_quantity: 25,
        approved_quantity: 25,
        rejected_quantity: 0,
        unit_of_measure: 'pieces',
        inspection_result: 'PASS',
        notes: 'All valves pressure tested and certified'
      }
    ],
    created_at: '2025-01-29T10:00:00',
    updated_at: '2025-01-29T16:00:00',
    created_by: 'budi.hermawan@pln.co.id'
  },
  // Additional BAPB for testing workflow - In Progress (Yellow)
  {
    bapb_id: 'BAPB-2025-999',
    bapb_number: 'BAPB/PLN-IP/2025/999',
    po_id: 'PO-2025-003',
    po_number: 'PO-PLN-2025-003',
    contract_number: 'CTR-PLN-2024-095',
    inspection_date: '2025-01-21',
    inspection_location: 'PLN Indonesia Power - PLTGU Muara Karang',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Ahmad Hidayat',
    vendor_representative_position: 'Project Manager',
    pln_inspector: 'Ir. Fadli Hassan, MT',
    pln_inspector_position: 'Senior Inspector',
    status: 'STEP_2',
    current_step: 2,
    inspection_notes: 'Inspection in progress, awaiting final approval',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Ahmad Hidayat',
        position: 'Project Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-21T14:00:00',
        user_id: 'ahmad.hidayat@airfilter.com'
      }
    },
    items: [
      {
        item_id: 'ITEM-005',
        item_name: 'SCADA Monitoring System',
        item_description: 'Supervisory Control and Data Acquisition system for plant monitoring',
        ordered_quantity: 1,
        received_quantity: 1,
        inspected_quantity: 1,
        approved_quantity: 1,
        rejected_quantity: 0,
        unit_of_measure: 'system',
        inspection_result: 'PENDING',
        notes: 'System testing in progress'
      }
    ],
    created_at: '2025-01-21T10:00:00',
    updated_at: '2025-01-21T14:00:00',
    created_by: 'fadli.hassan@pln.co.id'
  }
];

// Mock BASTB Documents
let mockBASTBDocuments: BASTBDocument[] = [
  // NEW Picture 2: BASTB Approved (Green) - Ready to proceed to BAP - Cooling System
  {
    bastb_id: 'BASTB-NEW-002',
    bastb_number: 'BASTB/PLN-IP/2025/NEW-102',
    bapb_id: 'BAPB-NEW-002',
    bapb_number: 'BAPB/PLN-IP/2025/NEW-102',
    po_id: 'PO-2025-NEW-002',
    po_number: 'PO-PLN-2025-102',
    contract_number: 'CTR-PLN-2025-202',
    handover_date: '2025-02-14',
    handover_location: 'PLN Indonesia Power - PLTGU Priok - Cooling Tower Area',
    vendor_name: 'PT Mitsubishi Heavy Industries Indonesia',
    vendor_representative: 'Darmawan Susilo',
    vendor_representative_position: 'Senior Project Manager',
    pln_receiver: 'Ir. Supriyanto, ST',
    pln_receiver_position: 'Cooling System Section Head',
    status: 'COMPLETED',
    handover_notes: 'Cooling tower fill media and circulation pumps successfully handed over to PLN operations team. Installation completed and system commissioned.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Darmawan Susilo',
        position: 'Senior Project Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-14T14:00:00',
        user_id: 'darmawan.susilo@mhi.com'
      },
      pln_receiver: {
        name: 'Ir. Supriyanto, ST',
        position: 'Cooling System Section Head',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-14T15:00:00',
        user_id: 'supriyanto@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Wahyudi Kusumah, MBA',
        position: 'Plant Operations Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-14T16:00:00',
        user_id: 'wahyudi.kusumah@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-COOL-NEW-001',
        item_name: 'Cooling Tower Fill Media Replacement',
        item_description: 'High-efficiency PVC cooling tower fill media, cross-flow design, fire retardant, UV stabilized, complete replacement kit',
        approved_quantity: 4500,
        delivered_quantity: 4500,
        accepted_quantity: 4500,
        unit_of_measure: 'square meters',
        condition_notes: 'All fill media installed and cooling efficiency tested'
      },
      {
        item_id: 'ITEM-PUMP-NEW-001',
        item_name: 'Cooling Water Circulation Pump 5000 GPM',
        item_description: 'Horizontal centrifugal pump, 5000 GPM flow rate, 80 meter head, cast iron casing, stainless steel impeller',
        approved_quantity: 4,
        delivered_quantity: 4,
        accepted_quantity: 4,
        unit_of_measure: 'units',
        condition_notes: 'All pumps installed, tested, and commissioned'
      }
    ],
    created_at: '2025-02-14T09:00:00',
    updated_at: '2025-02-14T16:00:00',
    created_by: 'supriyanto@pln.co.id'
  },
  // NEW Picture 3: BASTB Approved for Control System
  {
    bastb_id: 'BASTB-NEW-003',
    bastb_number: 'BASTB/PLN-IP/2025/NEW-103',
    bapb_id: 'BAPB-NEW-003',
    bapb_number: 'BAPB/PLN-IP/2025/NEW-103',
    po_id: 'PO-2025-NEW-003',
    po_number: 'PO-PLN-2025-103',
    contract_number: 'CTR-PLN-2025-203',
    handover_date: '2025-02-16',
    handover_location: 'PLN Indonesia Power - PLTU Paiton Unit 7 - Control Room',
    vendor_name: 'PT Siemens Indonesia',
    vendor_representative: 'Hendro Wijaya',
    vendor_representative_position: 'DCS Project Manager',
    pln_receiver: 'Ir. Kristanto Wibowo, ST',
    pln_receiver_position: 'I&C Operations Manager',
    status: 'COMPLETED',
    handover_notes: 'DCS system and HMI workstations successfully handed over. System fully installed, configured, and commissioned. Operations team trained.',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Hendro Wijaya',
        position: 'DCS Project Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-16T15:00:00',
        user_id: 'hendro.wijaya@siemens.com'
      },
      pln_receiver: {
        name: 'Ir. Kristanto Wibowo, ST',
        position: 'I&C Operations Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-16T16:00:00',
        user_id: 'kristanto.wibowo@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Budi Raharjo, MM',
        position: 'Plant Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-02-16T17:00:00',
        user_id: 'budi.raharjo@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-DCS-NEW-001',
        item_name: 'Distributed Control System (DCS) Upgrade Package',
        item_description: 'Complete DCS system upgrade including controllers, I/O modules, operator stations, engineering stations, redundant network, and migration services',
        approved_quantity: 1,
        delivered_quantity: 1,
        accepted_quantity: 1,
        unit_of_measure: 'system',
        condition_notes: 'DCS system fully installed, commissioned, and accepted by operations'
      },
      {
        item_id: 'ITEM-HMI-NEW-001',
        item_name: 'Human Machine Interface (HMI) Workstation',
        item_description: 'Industrial HMI workstation with dual 27-inch monitors, redundant power supply, industrial grade PC, SCADA software license',
        approved_quantity: 8,
        delivered_quantity: 8,
        accepted_quantity: 8,
        unit_of_measure: 'sets',
        condition_notes: 'All HMI workstations installed and configured in control room'
      }
    ],
    created_at: '2025-02-16T09:00:00',
    updated_at: '2025-02-16T17:00:00',
    created_by: 'kristanto.wibowo@pln.co.id'
  },
  {
    bastb_id: 'BASTB-DEMO-004',
    bastb_number: 'BASTB/PLN-IP/2025/DEMO-004',
    bapb_id: 'BAPB-DEMO-004',
    bapb_number: 'BAPB/PLN-IP/2025/DEMO-004',
    po_id: 'PO-2025-DEMO-004',
    po_number: 'PO-PLN-2025-002',
    contract_number: 'CTR-PLN-2024-091',
    handover_date: '2025-01-20',
    handover_location: 'PLN Indonesia Power - PLTU Paiton Unit 9',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Siti Aminah',
    vendor_representative_position: 'Technical Director',
    pln_receiver: 'Ir. Eko Prasetyo, ST',
    pln_receiver_position: 'Warehouse Supervisor',
    status: 'COMPLETED',
    handover_notes: 'Generator excitation systems handed over',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Siti Aminah',
        position: 'Technical Director',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-20T15:00:00',
        user_id: 'siti.aminah@airfilter.com'
      },
      pln_receiver: {
        name: 'Ir. Eko Prasetyo, ST',
        position: 'Warehouse Supervisor',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-20T15:30:00',
        user_id: 'eko.prasetyo@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Susanto Hartono, MBA',
        position: 'Logistics Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-20T16:00:00',
        user_id: 'susanto.hartono@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-003-DEMO2',
        item_name: 'Generator Excitation System',
        item_description: 'Complete excitation system for 500MW generator',
        approved_quantity: 2,
        delivered_quantity: 2,
        accepted_quantity: 2,
        unit_of_measure: 'sets',
        condition_notes: 'All equipment in excellent condition'
      }
    ],
    created_at: '2025-01-20T10:00:00',
    updated_at: '2025-01-20T16:00:00',
    created_by: 'eko.prasetyo@pln.co.id'
  },
  {
    bastb_id: 'BASTB-2025-001',
    bastb_number: 'BASTB/PLN-IP/2025/001',
    bapb_id: 'BAPB-2025-001',
    bapb_number: 'BAPB/PLN-IP/2025/001',
    po_id: 'PO-2025-001',
    po_number: 'PO-PLN-2025-001',
    contract_number: 'CTR-PLN-2024-089',
    handover_date: '2025-01-17',
    handover_location: 'PLN Indonesia Power - PLTU Suralaya Unit 7 - Warehouse A',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Budi Santoso',
    vendor_representative_position: 'Project Manager',
    pln_receiver: 'Ir. Agus Setiawan, ST',
    pln_receiver_position: 'Warehouse Manager',
    status: 'COMPLETED',
    handover_notes: 'All approved items successfully handed over to PLN warehouse. Items stored in climate-controlled section A-12.',
    supporting_documents: [
      {
        file_id: 'DOC-002',
        file_name: 'handover_confirmation_bastb_001.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bastb/handover_confirmation_bastb_001.pdf',
        uploaded_at: '2025-01-17T11:00:00',
        uploaded_by: 'joko.widodo@pln.co.id'
      },
      {
        file_id: 'DOC-003',
        file_name: 'warehouse_receipt_bastb_001.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bastb/warehouse_receipt_bastb_001.pdf',
        uploaded_at: '2025-01-17T11:30:00',
        uploaded_by: 'joko.widodo@pln.co.id'
      }
    ],
    signatures: {
      vendor_maker: {
        name: 'Budi Santoso',
        position: 'Project Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-17T14:00:00',
        user_id: 'budi.santoso@turbinnusantara.com'
      },
      pln_receiver: {
        name: 'Ir. Agus Setiawan, ST',
        position: 'Warehouse Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-17T14:30:00',
        user_id: 'joko.widodo@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Susanto Hartono, MBA',
        position: 'Logistics Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-17T15:00:00',
        user_id: 'susanto.hartono@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-001',
        item_name: 'Gas Turbine Blade Set - High Temperature Alloy',
        item_description: 'Complete set of high-temperature alloy turbine blades for gas turbine maintenance',
        approved_quantity: 48,
        delivered_quantity: 48,
        accepted_quantity: 48,
        unit_of_measure: 'pieces',
        condition_notes: 'All items in excellent condition, properly packaged'
      },
      {
        item_id: 'ITEM-002',
        item_name: 'Turbine Control System Module',
        item_description: 'Digital control system module for turbine operations',
        approved_quantity: 10,
        delivered_quantity: 10,
        accepted_quantity: 10,
        unit_of_measure: 'units',
        condition_notes: 'All modules properly sealed and verified'
      }
    ],
    created_at: '2025-01-17T10:00:00',
    updated_at: '2025-01-17T15:00:00',
    created_by: 'joko.widodo@pln.co.id'
  },
  {
    bastb_id: 'BASTB-2025-002',
    bastb_number: 'BASTB/PLN-IP/2025/002',
    bapb_id: 'BAPB-2025-004',
    bapb_number: 'BAPB/PLN-IP/2025/004',
    po_id: 'PO-2025-011',
    po_number: 'PO-PLN-2025-011',
    contract_number: 'CTR-PLN-2024-115',
    handover_date: '2025-01-25',
    handover_location: 'PLN Indonesia Power - PLTGU Muara Karang - Control Room Building',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Andreas Schmidt',
    vendor_representative_position: 'Technical Manager',
    pln_receiver: 'Ir. Teguh Santoso, MT',
    pln_receiver_position: 'Automation Section Head',
    status: 'COMPLETED',
    handover_notes: 'All PLC systems and HMI panels handed over successfully. Equipment installed and commissioned in control room.',
    supporting_documents: [
      {
        file_id: 'DOC-BASTB-004',
        file_name: 'installation_completion_bastb_002.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bastb/installation_completion_bastb_002.pdf',
        uploaded_at: '2025-01-25T10:00:00',
        uploaded_by: 'teguh.santoso@pln.co.id'
      },
      {
        file_id: 'DOC-BASTB-005',
        file_name: 'commissioning_report_bastb_002.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bastb/commissioning_report_bastb_002.pdf',
        uploaded_at: '2025-01-25T11:00:00',
        uploaded_by: 'teguh.santoso@pln.co.id'
      }
    ],
    signatures: {
      vendor_maker: {
        name: 'Andreas Schmidt',
        position: 'Technical Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-25T15:00:00',
        user_id: 'andreas.schmidt@siemens.com'
      },
      pln_receiver: {
        name: 'Ir. Teguh Santoso, MT',
        position: 'Automation Section Head',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-25T15:30:00',
        user_id: 'teguh.santoso@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Hendra Gunawan, MM',
        position: 'Operations Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-25T16:00:00',
        user_id: 'hendra.gunawan@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-011-001',
        item_name: 'PLC Control System Siemens S7-1500',
        item_description: 'Complete PLC control system with redundancy for plant automation',
        approved_quantity: 1,
        delivered_quantity: 1,
        accepted_quantity: 1,
        unit_of_measure: 'set',
        condition_notes: 'PLC system installed, configured and commissioned successfully in control room'
      }
    ],
    created_at: '2025-01-25T08:00:00',
    updated_at: '2025-01-25T16:00:00',
    created_by: 'teguh.santoso@pln.co.id'
  },
  {
    bastb_id: 'BASTB-2025-003',
    bastb_number: 'BASTB/PLN-IP/2025/003',
    bapb_id: 'BAPB-2025-005',
    bapb_number: 'BAPB/PLN-IP/2025/005',
    po_id: 'PO-2025-012',
    po_number: 'PO-PLN-2025-012',
    contract_number: 'CTR-PLN-2024-116',
    handover_date: '2025-01-26',
    handover_location: 'PLN Indonesia Power - PLTU Labuan - Instrumentation Workshop',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Rudi Hartono',
    vendor_representative_position: 'Sales Manager',
    pln_receiver: 'Ir. Agus Setiawan, ST',
    pln_receiver_position: 'Instrumentation Engineer',
    status: 'COMPLETED',
    handover_notes: 'Temperature sensors and pressure transmitters handed over. 2 rejected sensors will be replaced by vendor within 2 weeks.',
    supporting_documents: [
      {
        file_id: 'DOC-BASTB-006',
        file_name: 'handover_certificate_bastb_003.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bastb/handover_certificate_bastb_003.pdf',
        uploaded_at: '2025-01-26T09:00:00',
        uploaded_by: 'agus.setiawan@pln.co.id'
      }
    ],
    signatures: {
      vendor_maker: {
        name: 'Rudi Hartono',
        position: 'Sales Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-26T14:00:00',
        user_id: 'rudi.hartono@pln.co.id'
      },
      pln_receiver: {
        name: 'Ir. Agus Setiawan, ST',
        position: 'Instrumentation Engineer',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-26T14:30:00',
        user_id: 'agus.setiawan@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Dedi Kurniawan, MBA',
        position: 'Maintenance Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-26T15:00:00',
        user_id: 'dedi.kurniawan@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-SENS-001',
        item_name: 'Temperature Sensor RTD Pt100 Industrial Grade',
        item_description: 'High-accuracy RTD temperature sensors with HART protocol',
        approved_quantity: 148,
        delivered_quantity: 148,
        accepted_quantity: 148,
        unit_of_measure: 'pieces',
        condition_notes: 'Approved sensors stored in instrumentation workshop, rejection being handled by vendor'
      },
      {
        item_id: 'ITEM-SENS-002',
        item_name: 'Pressure Transmitter 0-200 bar Smart',
        item_description: 'Smart pressure transmitters with digital display and 4-20mA output',
        approved_quantity: 80,
        delivered_quantity: 80,
        accepted_quantity: 80,
        unit_of_measure: 'pieces',
        condition_notes: 'All transmitters stored properly, ready for installation'
      }
    ],
    created_at: '2025-01-26T08:00:00',
    updated_at: '2025-01-26T15:00:00',
    created_by: 'agus.setiawan@pln.co.id'
  },
  {
    bastb_id: 'BASTB-2025-004',
    bastb_number: 'BASTB/PLN-IP/2025/004',
    bapb_id: 'BAPB-2025-006',
    bapb_number: 'BAPB/PLN-IP/2025/006',
    po_id: 'PO-2025-013',
    po_number: 'PO-PLN-2025-013',
    contract_number: 'CTR-PLN-2024-118',
    handover_date: '2025-01-27',
    handover_location: 'PLN Indonesia Power - PLTGU Priok - Transformer Yard',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Bambang Sutrisno',
    vendor_representative_position: 'Project Director',
    pln_receiver: 'Ir. Yanto Prasetyo, MEng',
    pln_receiver_position: 'Senior Electrical Engineer',
    status: 'COMPLETED',
    handover_notes: 'Power transformer 150 MVA handed over and energized. All commissioning tests completed successfully.',
    supporting_documents: [
      {
        file_id: 'DOC-BASTB-007',
        file_name: 'transformer_energization_report_bastb_004.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bastb/transformer_energization_report_bastb_004.pdf',
        uploaded_at: '2025-01-27T10:00:00',
        uploaded_by: 'yanto.prasetyo@pln.co.id'
      },
      {
        file_id: 'DOC-BASTB-008',
        file_name: 'final_acceptance_certificate_bastb_004.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bastb/final_acceptance_certificate_bastb_004.pdf',
        uploaded_at: '2025-01-27T14:00:00',
        uploaded_by: 'yanto.prasetyo@pln.co.id'
      }
    ],
    signatures: {
      vendor_maker: {
        name: 'Bambang Sutrisno',
        position: 'Project Director',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-27T15:00:00',
        user_id: 'bambang.sutrisno@transformasi.com'
      },
      pln_receiver: {
        name: 'Ir. Yanto Prasetyo, MEng',
        position: 'Senior Electrical Engineer',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-27T15:30:00',
        user_id: 'yanto.prasetyo@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Darmawan Kusuma, MBA',
        position: 'Plant Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-27T16:00:00',
        user_id: 'darmawan.kusuma@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-TRANS-001',
        item_name: 'Power Transformer 150 MVA 150/20 kV',
        item_description: 'Oil-immersed power transformer with OLTC, complete accessories',
        approved_quantity: 1,
        delivered_quantity: 1,
        accepted_quantity: 1,
        unit_of_measure: 'unit',
        condition_notes: 'Transformer successfully energized and in operation, all protection systems functional'
      }
    ],
    created_at: '2025-01-27T09:00:00',
    updated_at: '2025-01-27T16:00:00',
    created_by: 'yanto.prasetyo@pln.co.id'
  },
  {
    bastb_id: 'BASTB-2025-005',
    bastb_number: 'BASTB/PLN-IP/2025/005',
    bapb_id: 'BAPB-2025-007',
    bapb_number: 'BAPB/PLN-IP/2025/007',
    po_id: 'PO-2025-014',
    po_number: 'PO-PLN-2025-014',
    contract_number: 'CTR-PLN-2024-119',
    handover_date: '2025-01-28',
    handover_location: 'PLN Indonesia Power - PLTA Saguling - Mechanical Workshop',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Sugiarto Wibowo',
    vendor_representative_position: 'Technical Sales Manager',
    pln_receiver: 'Ir. Bambang Hermanto, ST',
    pln_receiver_position: 'Mechanical Maintenance Head',
    status: 'COMPLETED',
    handover_notes: 'All SKF and FAG bearings handed over to mechanical workshop. Items stored in climate-controlled bearing storage room.',
    supporting_documents: [
      {
        file_id: 'DOC-BASTB-009',
        file_name: 'bearing_storage_confirmation_bastb_005.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bastb/bearing_storage_confirmation_bastb_005.pdf',
        uploaded_at: '2025-01-28T11:00:00',
        uploaded_by: 'bambang.hermanto@pln.co.id'
      }
    ],
    signatures: {
      vendor_maker: {
        name: 'Sugiarto Wibowo',
        position: 'Technical Sales Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-28T14:00:00',
        user_id: 'sugiarto.wibowo@bearing.com'
      },
      pln_receiver: {
        name: 'Ir. Bambang Hermanto, ST',
        position: 'Mechanical Maintenance Head',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-28T14:30:00',
        user_id: 'bambang.hermanto@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Taufik Rahman, MBA',
        position: 'Plant Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-28T15:00:00',
        user_id: 'taufik.rahman@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-BRG-001',
        item_name: 'Deep Groove Ball Bearing SKF 6320-2RS',
        item_description: 'Heavy-duty sealed ball bearing for rotating equipment',
        approved_quantity: 25,
        delivered_quantity: 25,
        accepted_quantity: 25,
        unit_of_measure: 'pieces',
        condition_notes: 'All SKF bearings properly stored, preservation maintained'
      },
      {
        item_id: 'ITEM-BRG-002',
        item_name: 'Thrust Bearing FAG 51330-MP',
        item_description: 'Single direction thrust ball bearing for axial loads',
        approved_quantity: 15,
        delivered_quantity: 15,
        accepted_quantity: 15,
        unit_of_measure: 'pieces',
        condition_notes: 'All FAG bearings stored in optimal conditions'
      }
    ],
    created_at: '2025-01-28T10:00:00',
    updated_at: '2025-01-28T15:00:00',
    created_by: 'bambang.hermanto@pln.co.id'
  },
  {
    bastb_id: 'BASTB-2025-006',
    bastb_number: 'BASTB/PLN-IP/2025/006',
    bapb_id: 'BAPB-2025-003',
    bapb_number: 'BAPB/PLN-IP/2025/003',
    po_id: 'PO-2025-002',
    po_number: 'PO-PLN-2025-002',
    contract_number: 'CTR-PLN-2024-092',
    handover_date: '2025-01-30',
    handover_location: 'PLN Indonesia Power - PLTU Paiton Unit 9 - Pump House',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Eko Prasetyo',
    vendor_representative_position: 'Project Manager',
    pln_receiver: 'Ir. Hadi Santoso, ST',
    pln_receiver_position: 'Mechanical Engineer',
    status: 'COMPLETED',
    handover_notes: 'All centrifugal pumps handed over and installed. Commissioning completed successfully.',
    supporting_documents: [
      {
        file_id: 'DOC-BASTB-010',
        file_name: 'pump_installation_report_bastb_006.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bastb/pump_installation_report_bastb_006.pdf',
        uploaded_at: '2025-01-30T10:00:00',
        uploaded_by: 'hadi.santoso@pln.co.id'
      }
    ],
    signatures: {
      vendor_maker: {
        name: 'Eko Prasetyo',
        position: 'Project Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-30T14:00:00',
        user_id: 'eko.prasetyo@pompasentral.com'
      },
      pln_receiver: {
        name: 'Ir. Hadi Santoso, ST',
        position: 'Mechanical Engineer',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-30T14:30:00',
        user_id: 'hadi.santoso@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Gunawan Wibowo, MBA',
        position: 'Plant Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-30T15:00:00',
        user_id: 'gunawan.wibowo@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-003',
        item_name: 'Centrifugal Pump - High Capacity 500 m3/h',
        item_description: 'Industrial centrifugal pump for cooling water system',
        approved_quantity: 4,
        delivered_quantity: 4,
        accepted_quantity: 4,
        unit_of_measure: 'units',
        condition_notes: 'All pumps installed and commissioned, performance within specifications'
      }
    ],
    created_at: '2025-01-30T09:00:00',
    updated_at: '2025-01-30T15:00:00',
    created_by: 'hadi.santoso@pln.co.id'
  },
  {
    bastb_id: 'BASTB-2025-007',
    bastb_number: 'BASTB/PLN-IP/2025/007',
    bapb_id: 'BAPB-2025-008',
    bapb_number: 'BAPB/PLN-IP/2025/008',
    po_id: 'PO-2025-015',
    po_number: 'PO-PLN-2025-015',
    contract_number: 'CTR-PLN-2024-124',
    handover_date: '2025-01-31',
    handover_location: 'PLN Indonesia Power - PLTGU Muara Tawar - Cable Tunnel',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Santi Wijayanti',
    vendor_representative_position: 'Technical Director',
    pln_receiver: 'Ir. Fajar Nugraha, MEng',
    pln_receiver_position: 'Senior Electrical Engineer',
    status: 'COMPLETED',
    handover_notes: 'All power and control cables handed over and installed in cable tunnels. Terminations completed and tested.',
    supporting_documents: [
      {
        file_id: 'DOC-BASTB-011',
        file_name: 'cable_installation_completion_bastb_007.pdf',
        file_type: 'application/pdf',
        file_url: '/documents/bastb/cable_installation_completion_bastb_007.pdf',
        uploaded_at: '2025-01-31T11:00:00',
        uploaded_by: 'fajar.nugraha@pln.co.id'
      }
    ],
    signatures: {
      vendor_maker: {
        name: 'Santi Wijayanti',
        position: 'Technical Director',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-31T14:00:00',
        user_id: 'santi.wijayanti@kabelnusantara.com'
      },
      pln_receiver: {
        name: 'Ir. Fajar Nugraha, MEng',
        position: 'Senior Electrical Engineer',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-31T14:30:00',
        user_id: 'fajar.nugraha@pln.co.id'
      },
      pln_approver: {
        name: 'Ir. Rizki Pratama, MBA',
        position: 'Operations Manager',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-31T15:00:00',
        user_id: 'rizki.pratama@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-CAB-001',
        item_name: 'High Voltage Cable 20kV XLPE 3x240mm2',
        item_description: 'Cross-linked polyethylene insulated power cable with copper conductor',
        approved_quantity: 5000,
        delivered_quantity: 5000,
        accepted_quantity: 5000,
        unit_of_measure: 'meters',
        condition_notes: 'All cables installed and terminated, tested and energized successfully'
      },
      {
        item_id: 'ITEM-CAB-002',
        item_name: 'Control Cable 1kV 37x1.5mm2 Armoured',
        item_description: 'Multi-core control cable with steel wire armour for industrial use',
        approved_quantity: 3000,
        delivered_quantity: 3000,
        accepted_quantity: 3000,
        unit_of_measure: 'meters',
        condition_notes: 'All control cables installed and terminated, continuity tests passed'
      }
    ],
    created_at: '2025-01-31T10:00:00',
    updated_at: '2025-01-31T15:00:00',
    created_by: 'fajar.nugraha@pln.co.id'
  },
  // Additional BASTB for testing workflow - In Progress (Yellow)
  {
    bastb_id: 'BASTB-2025-998',
    bastb_number: 'BASTB/PLN-IP/2025/998',
    bapb_id: 'BAPB-2025-002',
    bapb_number: 'BAPB/PLN-IP/2025/002',
    po_id: 'PO-2025-002',
    po_number: 'PO-PLN-2025-002',
    contract_number: 'CTR-PLN-2024-091',
    handover_date: '2025-01-20',
    handover_location: 'PLN Indonesia Power - PLTU Paiton Unit 9',
    vendor_name: 'PT Air Filter Indonesia',
    vendor_representative: 'Siti Aminah',
    vendor_representative_position: 'Technical Director',
    pln_receiver: 'Ir. Eko Prasetyo, ST',
    pln_receiver_position: 'Warehouse Supervisor',
    status: 'PENDING_SIGNATURES',
    handover_notes: 'Items received, awaiting final approval signatures',
    supporting_documents: [],
    signatures: {
      vendor_maker: {
        name: 'Siti Aminah',
        position: 'Technical Director',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-20T15:00:00',
        user_id: 'siti.aminah@airfilter.com'
      },
      pln_receiver: {
        name: 'Ir. Eko Prasetyo, ST',
        position: 'Warehouse Supervisor',
        signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signed_at: '2025-01-20T15:30:00',
        user_id: 'eko.prasetyo@pln.co.id'
      }
    },
    items: [
      {
        item_id: 'ITEM-003',
        item_name: 'Generator Excitation System',
        item_description: 'Complete excitation system for 500MW generator',
        approved_quantity: 2,
        delivered_quantity: 2,
        accepted_quantity: 2,
        unit_of_measure: 'sets',
        condition_notes: 'All equipment in excellent condition'
      }
    ],
    created_at: '2025-01-20T10:00:00',
    updated_at: '2025-01-20T15:30:00',
    created_by: 'eko.prasetyo@pln.co.id'
  }
];

// CRUD Operations for POs
export const getArrivedPOs = (): APBAPurchaseOrder[] => {
  return [...mockArrivedPOs];
};

export const getPOById = (poId: string): APBAPurchaseOrder | undefined => {
  return mockArrivedPOs.find(po => po.po_id === poId);
};

// CRUD Operations for BAPB
export const getAllBAPB = (): BAPBDocument[] => {
  return [...mockBAPBDocuments];
};

export const getBAPBById = (bapbId: string): BAPBDocument | undefined => {
  return mockBAPBDocuments.find(bapb => bapb.bapb_id === bapbId);
};

export const getBAPBByPO = (poId: string): BAPBDocument[] => {
  return mockBAPBDocuments.filter(bapb => bapb.po_id === poId);
};

export const createBAPB = (bapb: Omit<BAPBDocument, 'bapb_id' | 'created_at' | 'updated_at'>): BAPBDocument => {
  const newBAPB: BAPBDocument = {
    ...bapb,
    bapb_id: `BAPB-2025-${String(mockBAPBDocuments.length + 1).padStart(3, '0')}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockBAPBDocuments.push(newBAPB);
  return newBAPB;
};

export const updateBAPB = (bapbId: string, updates: Partial<BAPBDocument>): BAPBDocument | null => {
  const index = mockBAPBDocuments.findIndex(bapb => bapb.bapb_id === bapbId);
  if (index === -1) return null;

  mockBAPBDocuments[index] = {
    ...mockBAPBDocuments[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  return mockBAPBDocuments[index];
};

export const deleteBAPB = (bapbId: string): boolean => {
  const index = mockBAPBDocuments.findIndex(bapb => bapb.bapb_id === bapbId);
  if (index === -1) return false;
  mockBAPBDocuments.splice(index, 1);
  return true;
};

// CRUD Operations for BASTB
export const getAllBASTB = (): BASTBDocument[] => {
  return [...mockBASTBDocuments];
};

export const getBASTBById = (bastbId: string): BASTBDocument | undefined => {
  return mockBASTBDocuments.find(bastb => bastb.bastb_id === bastbId);
};

export const getBASTBByBAPB = (bapbId: string): BASTBDocument | undefined => {
  return mockBASTBDocuments.find(bastb => bastb.bapb_id === bapbId);
};

export const getBASTBByPO = (poId: string): BASTBDocument[] => {
  return mockBASTBDocuments.filter(bastb => bastb.po_id === poId);
};

export const createBASTB = (bastb: Omit<BASTBDocument, 'bastb_id' | 'created_at' | 'updated_at'>): BASTBDocument => {
  const newBASTB: BASTBDocument = {
    ...bastb,
    bastb_id: `BASTB-2025-${String(mockBASTBDocuments.length + 1).padStart(3, '0')}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockBASTBDocuments.push(newBASTB);
  return newBASTB;
};

export const updateBASTB = (bastbId: string, updates: Partial<BASTBDocument>): BASTBDocument | null => {
  const index = mockBASTBDocuments.findIndex(bastb => bastb.bastb_id === bastbId);
  if (index === -1) return null;

  mockBASTBDocuments[index] = {
    ...mockBASTBDocuments[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  return mockBASTBDocuments[index];
};

export const deleteBASTB = (bastbId: string): boolean => {
  const index = mockBASTBDocuments.findIndex(bastb => bastb.bastb_id === bastbId);
  if (index === -1) return false;
  mockBASTBDocuments.splice(index, 1);
  return true;
};

// Mock BAP Documents
let mockBAPDocuments: BAPDocument[] = [
  // NEW Picture 3: BAP Approved (Green) - Ready for Payment (White LED Blinking) - Control System
  {
    bap_id: 'BAP-NEW-003',
    bap_number: 'BAP/PLN/2025/NEW-103',
    bastb_id: 'BASTB-NEW-003',
    bastb_number: 'BASTB/PLN-IP/2025/NEW-103',
    po_id: 'PO-2025-NEW-003',
    po_number: 'PO-PLN-2025-103',
    contract_number: 'CTR-PLN-2025-203',
    payment_request_date: '2025-02-17',
    vendor_name: 'PT Siemens Indonesia',
    invoice_number: 'INV-SIEMENS-2025-103',
    invoice_date: '2025-02-16',
    payment_amount: 22500000000,
    status: 'APPROVED',
    created_at: '2025-02-17T08:00:00Z',
    updated_at: '2025-02-17T15:00:00Z',
    created_by: 'Kristanto Wibowo'
  },
  {
    bap_id: 'BAP-2025-001',
    bap_number: 'BAP/PLN/2025/001',
    bastb_id: 'BASTB-2025-001',
    bastb_number: 'BASTB/PLN/2025/001',
    po_id: 'PO-2025-011',
    po_number: 'PO-PLN-2025-011',
    contract_number: 'CTR-PLN-2024-112',
    payment_request_date: '2025-02-05',
    vendor_name: 'PT Air Filter Indonesia',
    invoice_number: 'INV-2025-0234',
    invoice_date: '2025-02-04',
    payment_amount: 5800000000,
    status: 'PAID',
    created_at: '2025-02-05T08:00:00Z',
    updated_at: '2025-02-15T14:30:00Z',
    created_by: 'Ahmad Sutanto'
  },
  {
    bap_id: 'BAP-2025-002',
    bap_number: 'BAP/PLN/2025/002',
    bastb_id: 'BASTB-2025-002',
    bastb_number: 'BASTB/PLN/2025/002',
    po_id: 'PO-2025-012',
    po_number: 'PO-PLN-2025-012',
    contract_number: 'CTR-PLN-2024-115',
    payment_request_date: '2025-02-06',
    vendor_name: 'PT Air Filter Indonesia',
    invoice_number: 'INV-2025-0245',
    invoice_date: '2025-02-05',
    payment_amount: 3200000000,
    status: 'PAID',
    created_at: '2025-02-06T09:00:00Z',
    updated_at: '2025-02-16T10:00:00Z',
    created_by: 'Siti Aminah'
  },
  {
    bap_id: 'BAP-2025-003',
    bap_number: 'BAP/PLN/2025/003',
    bastb_id: 'BASTB-2025-003',
    bastb_number: 'BASTB/PLN/2025/003',
    po_id: 'PO-2025-013',
    po_number: 'PO-PLN-2025-013',
    contract_number: 'CTR-PLN-2024-118',
    payment_request_date: '2025-02-07',
    vendor_name: 'PT Air Filter Indonesia',
    invoice_number: 'INV-2025-0256',
    invoice_date: '2025-02-06',
    payment_amount: 8500000000,
    status: 'APPROVED',
    created_at: '2025-02-07T10:00:00Z',
    updated_at: '2025-02-17T11:00:00Z',
    created_by: 'Budi Santoso'
  },
  // Additional BAP for testing workflow - Pending Approval (Yellow)
  {
    bap_id: 'BAP-2025-997',
    bap_number: 'BAP/PLN/2025/997',
    bastb_id: 'BASTB-DEMO-004',
    bastb_number: 'BASTB/PLN-IP/2025/DEMO-004',
    po_id: 'PO-2025-DEMO-004',
    po_number: 'PO-PLN-2025-002',
    contract_number: 'CTR-PLN-2024-091',
    payment_request_date: '2025-01-21',
    vendor_name: 'PT Air Filter Indonesia',
    invoice_number: 'INV-2025-DEMO-004',
    invoice_date: '2025-01-20',
    payment_amount: 7000000000,
    status: 'PENDING_APPROVAL',
    created_at: '2025-01-21T08:00:00Z',
    updated_at: '2025-01-21T14:30:00Z',
    created_by: 'Siti Aminah'
  }
];

// CRUD Operations for BAP
export const getAllBAP = (): BAPDocument[] => {
  return [...mockBAPDocuments];
};

export const getBAPById = (bapId: string): BAPDocument | undefined => {
  return mockBAPDocuments.find(bap => bap.bap_id === bapId);
};

export const getBAPByBASTB = (bastbId: string): BAPDocument | undefined => {
  return mockBAPDocuments.find(bap => bap.bastb_id === bastbId);
};

export const getBAPByPO = (poId: string): BAPDocument[] => {
  return mockBAPDocuments.filter(bap => bap.po_id === poId);
};

export const createBAP = (bap: Omit<BAPDocument, 'bap_id' | 'created_at' | 'updated_at'>): BAPDocument => {
  const newBAP: BAPDocument = {
    ...bap,
    bap_id: `BAP-2025-${String(mockBAPDocuments.length + 1).padStart(3, '0')}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockBAPDocuments.push(newBAP);
  return newBAP;
};

export const updateBAP = (bapId: string, updates: Partial<BAPDocument>): BAPDocument | null => {
  const index = mockBAPDocuments.findIndex(bap => bap.bap_id === bapId);
  if (index === -1) return null;

  mockBAPDocuments[index] = {
    ...mockBAPDocuments[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  return mockBAPDocuments[index];
};

export const deleteBAP = (bapId: string): boolean => {
  const index = mockBAPDocuments.findIndex(bap => bap.bap_id === bapId);
  if (index === -1) return false;
  mockBAPDocuments.splice(index, 1);
  return true;
};

// Statistics
export interface APBAStatistics {
  total_arrived_pos: number;
  total_bapb: number;
  bapb_draft: number;
  bapb_in_progress: number;
  bapb_completed: number;
  total_bastb: number;
  bastb_draft: number;
  bastb_pending: number;
  bastb_completed: number;
  total_bap: number;
  bap_draft: number;
  bap_pending: number;
  bap_approved: number;
  bap_paid: number;
}

export const getAPBAStatistics = (): APBAStatistics => {
  return {
    total_arrived_pos: mockArrivedPOs.length,
    total_bapb: mockBAPBDocuments.length,
    bapb_draft: mockBAPBDocuments.filter(b => b.status === 'DRAFT').length,
    bapb_in_progress: mockBAPBDocuments.filter(b =>
      ['STEP_1', 'STEP_2', 'STEP_3', 'STEP_4'].includes(b.status)
    ).length,
    bapb_completed: mockBAPBDocuments.filter(b => b.status === 'COMPLETED').length,
    total_bastb: mockBASTBDocuments.length,
    bastb_draft: mockBASTBDocuments.filter(b => b.status === 'DRAFT').length,
    bastb_pending: mockBASTBDocuments.filter(b => b.status === 'PENDING_SIGNATURES').length,
    bastb_completed: mockBASTBDocuments.filter(b => b.status === 'COMPLETED').length,
    total_bap: mockBAPDocuments.length,
    bap_draft: mockBAPDocuments.filter(b => b.status === 'DRAFT').length,
    bap_pending: mockBAPDocuments.filter(b => b.status === 'PENDING_APPROVAL').length,
    bap_approved: mockBAPDocuments.filter(b => b.status === 'APPROVED').length,
    bap_paid: mockBAPDocuments.filter(b => b.status === 'PAID').length
  };
};
