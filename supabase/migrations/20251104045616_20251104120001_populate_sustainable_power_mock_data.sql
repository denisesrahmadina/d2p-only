/*
  # Populate Sustainable Power Generation Mock Data

  1. Clause Library
    - Environmental compliance clauses
    - Renewable energy certifications
    - Carbon offset and ESG clauses
    - Performance guarantees
    - Local content requirements

  2. Contract Templates
    - Solar Panel Supply Agreement
    - Wind Turbine Maintenance SLA
    - Battery Storage Procurement
    - And more renewable energy contracts

  3. Template Recommendations
    - Linked to sourcing events with confidence scores

  4. Personnel
    - Procurement, Legal, Technical roles
    - Expertise in renewable energy

  5. Approval Workflows
    - Serial and parallel configurations
*/

-- Insert Clause Library for Sustainable Power Generation
INSERT INTO ref_clause_library (clause_category, clause_title, clause_content, contract_type, is_mandatory, is_critical, applicable_to_solar, applicable_to_wind, applicable_to_battery, tags, created_by) VALUES

-- Environmental Compliance Clauses
('Environmental Compliance', 'Emissions Monitoring Requirement', 'The Supplier shall maintain continuous monitoring of all emissions during manufacturing and installation phases. All emissions data shall be reported monthly to the Buyer and comply with Indonesian Environmental Law No. 32/2009.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, true, true, true, true, ARRAY['emissions', 'monitoring', 'compliance'], 'System'),

('Environmental Compliance', 'Waste Management Protocol', 'All waste generated during manufacturing, transportation, and installation must be managed according to ISO 14001 standards. The Supplier shall provide quarterly waste management reports including recycling rates and disposal methods.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, false, true, true, true, ARRAY['waste', 'ISO14001', 'recycling'], 'System'),

('Environmental Compliance', 'Water Usage Compliance', 'For manufacturing processes, the Supplier agrees to limit water consumption to industry best practices and comply with local water usage regulations. Water recycling systems must achieve minimum 60% efficiency.', ARRAY['Solar Panel Supply', 'Battery Storage'], true, false, true, false, true, ARRAY['water', 'sustainability'], 'System'),

-- Renewable Energy Certification Clauses
('Renewable Energy Certification', 'ISO 50001 Energy Management', 'The Supplier must maintain valid ISO 50001:2018 certification for energy management systems. Annual audits and certification renewals must be provided to the Buyer within 30 days of completion.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, true, true, true, true, ARRAY['ISO50001', 'certification', 'energy'], 'System'),

('Renewable Energy Certification', 'LEED Green Building Compliance', 'All equipment and materials supplied must meet LEED (Leadership in Energy and Environmental Design) certification requirements. Documentation proving LEED compliance shall be submitted with each delivery.', ARRAY['Solar Panel Supply', 'Wind Turbine'], false, false, true, true, false, ARRAY['LEED', 'green building'], 'System'),

('Renewable Energy Certification', 'IEC 61215 Solar Panel Certification', 'All solar panels must be certified to IEC 61215 standards for crystalline silicon terrestrial photovoltaic modules. Test certificates from accredited laboratories must accompany each shipment.', ARRAY['Solar Panel Supply'], true, true, true, false, false, ARRAY['IEC61215', 'solar', 'PV modules'], 'System'),

('Renewable Energy Certification', 'IEC 61400 Wind Turbine Standards', 'Wind turbines must comply with IEC 61400 series standards including design requirements, power performance, and acoustic noise measurement. Full certification documentation required.', ARRAY['Wind Turbine'], true, true, false, true, false, ARRAY['IEC61400', 'wind', 'turbine'], 'System'),

-- Carbon Offset Clauses
('Carbon Offset', 'Carbon Neutrality Commitment', 'The Supplier commits to achieving carbon neutrality across all operations related to this contract within 24 months. A detailed carbon reduction plan with quarterly milestones must be submitted within 60 days of contract execution.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], false, false, true, true, true, ARRAY['carbon neutral', 'climate'], 'System'),

('Carbon Offset', 'Verified Carbon Credit Purchase', 'For unavoidable emissions, the Supplier shall purchase verified carbon credits from Gold Standard or Verified Carbon Standard (VCS) certified projects. Annual carbon credit purchase reports required.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], false, false, true, true, true, ARRAY['carbon credits', 'offset'], 'System'),

('Carbon Offset', 'Lifecycle Carbon Assessment', 'The Supplier must provide a comprehensive lifecycle carbon assessment for all delivered equipment, from raw material extraction through end-of-life disposal. Assessment must follow ISO 14040 standards.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, true, true, true, true, ARRAY['lifecycle', 'carbon assessment', 'ISO14040'], 'System'),

-- Performance Guarantee Clauses
('Performance Guarantee', 'Solar Panel Efficiency Guarantee', 'Solar panels shall maintain minimum 80% of rated power output after 25 years of operation. Performance degradation shall not exceed 0.7% annually. Performance testing conducted per IEC 61853 standards.', ARRAY['Solar Panel Supply'], true, true, true, false, false, ARRAY['efficiency', 'solar', '25-year warranty'], 'System'),

('Performance Guarantee', 'Wind Turbine Availability Guarantee', 'Wind turbines shall achieve minimum 97% availability annually, excluding scheduled maintenance and force majeure events. Availability calculated per IEC 61400-26-1 methodology.', ARRAY['Wind Turbine'], true, true, false, true, false, ARRAY['availability', 'wind', '97%'], 'System'),

('Performance Guarantee', 'Battery Storage Capacity Retention', 'Battery energy storage systems shall retain minimum 80% of rated capacity after 10 years or 3,650 equivalent full cycles, whichever occurs first. Testing per IEC 61427 standards.', ARRAY['Battery Storage'], true, true, false, false, true, ARRAY['battery', 'capacity', 'retention'], 'System'),

('Performance Guarantee', 'Capacity Factor Achievement', 'For wind farm installations, the Supplier guarantees minimum capacity factor of 35% annually based on 10-year wind resource assessment. Shortfalls compensated per liquidated damages schedule.', ARRAY['Wind Turbine'], true, true, false, true, false, ARRAY['capacity factor', 'wind farm'], 'System'),

-- ESG Reporting Clauses
('ESG Reporting', 'Quarterly ESG Performance Report', 'The Supplier shall submit quarterly ESG (Environmental, Social, Governance) performance reports covering carbon emissions, water usage, waste management, labor practices, and community engagement activities.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, false, true, true, true, ARRAY['ESG', 'reporting', 'quarterly'], 'System'),

('ESG Reporting', 'Sustainability Dashboard Access', 'The Supplier must provide real-time access to a sustainability dashboard showing key environmental and social metrics including energy consumption, renewable energy usage, and safety incident rates.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], false, false, true, true, true, ARRAY['dashboard', 'sustainability', 'metrics'], 'System'),

('ESG Reporting', 'Supply Chain Transparency', 'The Supplier shall maintain full transparency of supply chain including disclosure of all tier-1 and tier-2 suppliers. Annual supply chain sustainability audits required with published results.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, true, true, true, true, ARRAY['supply chain', 'transparency', 'audit'], 'System'),

-- Local Content Clauses
('Local Content', 'Indonesian Manufacturing Requirement', 'Minimum 40% of component value must be manufactured in Indonesia using local materials and labor. Documentation proving local content percentage required with each invoice.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, true, true, true, true, ARRAY['local content', 'TKDN', 'Indonesia'], 'System'),

('Local Content', 'Local Workforce Development', 'The Supplier commits to hiring and training minimum 75% Indonesian nationals for project implementation. Skills transfer programs for specialized technical roles must be established.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, false, true, true, true, ARRAY['workforce', 'training', 'local hire'], 'System'),

('Local Content', 'Technology Transfer Agreement', 'The Supplier shall establish technology transfer programs enabling local Indonesian partners to manufacture key components within 3 years. Detailed technology transfer roadmap required.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], false, true, true, true, true, ARRAY['technology transfer', 'localization'], 'System'),

-- Grid Interconnection Clauses
('Grid Interconnection', 'PLN Grid Code Compliance', 'All equipment must comply with PLN (Perusahaan Listrik Negara) Grid Code requirements including voltage regulation, frequency response, and fault ride-through capabilities.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, true, true, true, true, ARRAY['PLN', 'grid code', 'interconnection'], 'System'),

('Grid Interconnection', 'Reactive Power Capability', 'Power generation equipment shall provide reactive power support with power factor range of 0.95 leading to 0.95 lagging at full output. Dynamic reactive power response within 100ms.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, true, true, true, true, ARRAY['reactive power', 'power factor'], 'System'),

-- Warranty Clauses
('Warranty', 'Solar Panel Product Warranty', 'Solar panels covered by 12-year product warranty against manufacturing defects including materials and workmanship. Warranty includes free replacement and installation of defective panels.', ARRAY['Solar Panel Supply'], true, true, true, false, false, ARRAY['warranty', '12-year', 'solar'], 'System'),

('Warranty', 'Wind Turbine Blade Warranty', 'Wind turbine blades warranted for 7 years against structural failure, delamination, and lightning damage. Warranty period begins from final commissioning date. Emergency blade replacement within 30 days.', ARRAY['Wind Turbine'], true, true, false, true, false, ARRAY['warranty', 'blade', '7-year'], 'System'),

('Warranty', 'Battery Management System Warranty', 'Battery Management System (BMS) warranted for 10 years covering all electronic components, firmware, and communication interfaces. Software updates provided free during warranty period.', ARRAY['Battery Storage'], true, true, false, false, true, ARRAY['warranty', 'BMS', '10-year'], 'System'),

-- Payment Terms
('Payment Terms', 'Milestone-Based Payment Schedule', 'Payments released upon achievement of project milestones: 10% advance, 30% upon equipment delivery, 40% upon installation completion, 15% upon successful commissioning, 5% retention for 12 months.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, false, true, true, true, ARRAY['payment', 'milestones'], 'System'),

('Payment Terms', 'Performance-Linked Payment', 'Final 20% of contract value contingent upon achievement of guaranteed performance parameters during first 6 months of operation. Performance testing per agreed protocols.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], false, true, true, true, true, ARRAY['payment', 'performance-linked'], 'System'),

-- Force Majeure
('Force Majeure', 'Climate Event Force Majeure', 'Force majeure includes extreme weather events exceeding 1-in-100-year return period: typhoons, floods, earthquakes, tsunamis. Climate events must be certified by Indonesian Meteorology Agency (BMKG).', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, false, true, true, true, ARRAY['force majeure', 'climate', 'BMKG'], 'System'),

('Force Majeure', 'Pandemic Response Protocol', 'In event of pandemic or health emergency declared by WHO or Indonesian government, contract timelines extended automatically. Alternative delivery and installation protocols to be mutually agreed.', ARRAY['Solar Panel Supply', 'Wind Turbine', 'Battery Storage'], true, false, true, true, true, ARRAY['force majeure', 'pandemic'], 'System');

-- Insert Contract Templates for Sustainable Power Generation
INSERT INTO fact_contract_template (sourcing_event_id, template_name, template_content, template_sections, status, version, created_by, approved_by, approval_status, approval_date) VALUES

('SE-2025-SOLAR-001', 'Solar Panel Supply Agreement - Standard Template', 
'{"header":{"title":"Solar Panel Supply Agreement","contractType":"Supply Agreement","sector":"Renewable Energy - Solar"},"parties":{"buyer":"PT Indonesia Power","supplier":"To be determined","buyerAddress":"Jl. Jend. Gatot Subroto, Jakarta","supplierAddress":"To be determined"},"scopeOfWork":{"description":"Supply of high-efficiency monocrystalline solar panels for utility-scale solar farm development","totalCapacity":"100 MW DC","panelSpecifications":"Monocrystalline, min 540Wp per panel, efficiency >21%","quantity":"Approximately 185,000 panels","deliveryLocation":"Solar farm site, East Java"},"technicalRequirements":{"panelType":"Monocrystalline PERC","minimumEfficiency":"21%","powerTolerance":"-0/+5W","temperatureCoefficient":"<-0.35%/°C","certifications":["IEC 61215","IEC 61730","ISO 9001"]},"performanceGuarantee":{"powerOutput":"Min 80% after 25 years","annualDegradation":"Max 0.7% per year","performanceTesting":"Per IEC 61853 standards","warrantyPeriod":"25 years performance, 12 years product"},"pricing":{"totalValue":"IDR 1,250,000,000,000","pricePerWatt":"IDR 12,500","currency":"IDR","priceValidity":"90 days"},"paymentTerms":{"advancePayment":"10% upon contract signing","deliveryPayment":"40% upon delivery to site","installationPayment":"30% upon installation completion","commissioningPayment":"15% upon successful commissioning","retention":"5% for 12 months post-commissioning"},"deliverySchedule":{"totalDuration":"12 months","monthlyDelivery":"8.3 MW per month","firstDelivery":"Month 2 from contract effective date","finalDelivery":"Month 12","incoterms":"DDP (Delivered Duty Paid) to site"},"qualityStandards":{"manufacturingStandard":"ISO 9001:2015","environmental":"ISO 14001:2015","energyManagement":"ISO 50001:2018","inspectionRights":"Buyer may inspect at factory","acceptanceCriteria":"Visual inspection + electrical testing per IEC standards"},"environmentalCompliance":{"emissionsMonitoring":"Monthly reporting required","wasteManagement":"Per ISO 14001 standards","carbonNeutrality":"Commitment within 24 months","lifecycleAssessment":"Per ISO 14040"},"localContent":{"minimumPercentage":"40% Indonesian content","workforceDevelopment":"75% local hiring","technologyTransfer":"3-year localization plan"},"terminationClauses":{"noticePeriod":"60 days written notice","forCause":"Material breach allows immediate termination","consequences":"Refund of payments, return of equipment","disputeResolution":"Arbitration in Jakarta under BANI rules"},"legalTerms":{"governingLaw":"Republic of Indonesia","jurisdiction":"District Court of South Jakarta","confidentiality":"5-year confidentiality period","liability":"Limited to contract value","forceMajeure":"Climate events per BMKG certification"}}',
'{"header":true,"parties":true,"scopeOfWork":true,"technicalRequirements":true,"performanceGuarantee":true,"pricing":true,"paymentTerms":true,"deliverySchedule":true,"qualityStandards":true,"environmentalCompliance":true,"localContent":true,"terminationClauses":true,"legalTerms":true}',
'Approved', 1, 'Intan Pratiwi', 'Siti Nurhaliza', 'Approved', '2025-01-15 10:30:00+07'),

('SE-2025-WIND-001', 'Wind Turbine Maintenance SLA - Standard Template',
'{"header":{"title":"Wind Turbine Maintenance Service Level Agreement","contractType":"Service Agreement","sector":"Renewable Energy - Wind"},"parties":{"buyer":"PT Indonesia Power","supplier":"To be determined","buyerAddress":"Jl. Jend. Gatot Subroto, Jakarta","supplierAddress":"To be determined"},"scopeOfWork":{"description":"Comprehensive operations and maintenance services for offshore wind farm","windFarmCapacity":"150 MW","numberOfTurbines":"30 turbines x 5MW each","location":"Offshore Nusa Tenggara","servicePeriod":"5 years with 3-year extension option"},"maintenanceServices":{"preventiveMaintenance":"Scheduled every 6 months per OEM specifications","correctiveMaintenance":"24/7 emergency response within 12 hours","predictiveMaintenance":"Condition monitoring with quarterly SCADA analysis","majorOverhauls":"Complete nacelle inspection every 5 years"},"performanceGuarantee":{"availability":"Minimum 97% annual availability","capacityFactor":"Minimum 40% annual capacity factor","responseTime":"Emergency response within 12 hours, on-site within 24 hours","sparePartsStocking":"Critical spares maintained at local warehouse"},"pricing":{"annualServiceFee":"IDR 75,000,000,000 per year","escalation":"3% annually","totalContractValue":"IDR 375,000,000,000 for 5 years","performanceBonus":"Up to 10% bonus for exceeding availability targets"},"paymentTerms":{"invoicingCycle":"Quarterly in advance","paymentDue":"30 days from invoice date","performancePayment":"Quarterly reconciliation based on actual availability","retention":"No retention for service contracts"},"serviceStandards":{"personnelQualification":"GWO certified technicians, minimum 5 years experience","safetyStandards":"Zero LTI target, full compliance with HSE regulations","reportingRequirements":"Monthly performance reports, quarterly asset condition reports","trainingProgram":"Annual training for Indonesia Power staff"},"environmentalCompliance":{"marineProtection":"Compliance with marine environmental regulations","birdProtection":"Bird migration monitoring and turbine shutdown protocols","wasteDisposal":"Proper disposal of lubricants and hazardous materials"},"localContent":{"localTechnicians":"Minimum 60% Indonesian technicians by Year 2","skillsTransfer":"Comprehensive training program for local workforce","localSuppliers":"Prioritize Indonesian suppliers for non-critical spares"},"terminationClauses":{"noticePeriod":"180 days for termination without cause","forCause":"30 days for material breach","transitionSupport":"6-month handover period to new contractor","equipmentHandover":"All documentation and SCADA data transferred"},"legalTerms":{"governingLaw":"Republic of Indonesia","jurisdiction":"District Court of South Jakarta","liability":"Professional indemnity insurance min IDR 50 billion","insurance":"Comprehensive marine and liability coverage"}}',
'{"header":true,"parties":true,"scopeOfWork":true,"maintenanceServices":true,"performanceGuarantee":true,"pricing":true,"paymentTerms":true,"serviceStandards":true,"environmentalCompliance":true,"localContent":true,"terminationClauses":true,"legalTerms":true}',
'Approved', 1, 'Jefferson Soesetyo', 'Siti Nurhaliza', 'Approved', '2025-01-20 14:15:00+07'),

('SE-2025-BESS-001', 'Battery Storage Procurement Terms - Standard Template',
'{"header":{"title":"Battery Energy Storage System Procurement Agreement","contractType":"Equipment Procurement","sector":"Renewable Energy - Energy Storage"},"parties":{"buyer":"PT Indonesia Power","supplier":"To be determined","buyerAddress":"Jl. Jend. Gatot Subroto, Jakarta","supplierAddress":"To be determined"},"scopeOfWork":{"description":"Supply and installation of lithium-ion battery energy storage system","storageCapacity":"50 MWh","powerRating":"25 MW (2-hour discharge)","technology":"Lithium Iron Phosphate (LFP)","location":"Grid substation, Central Java"},"technicalSpecifications":{"batteryTechnology":"LFP (LiFePO4)","ratedVoltage":"1,500 VDC","efficiency":"Round-trip efficiency >90%","cycleLife":"Minimum 6,000 equivalent full cycles at 80% DoD","ambientTemp":"-10°C to +45°C operation"},"performanceGuarantee":{"capacityRetention":"Min 80% after 10 years or 3,650 cycles","responseTime":"<100ms for frequency response","efficiency":"90% round-trip efficiency guaranteed","warranty":"10 years performance warranty"},"pricing":{"totalValue":"IDR 625,000,000,000","pricePerKWh":"IDR 12,500,000","currency":"IDR","priceIncludes":"Equipment, BMS, PCS, installation, commissioning"},"paymentTerms":{"advancePayment":"15% upon contract signing","equipmentPayment":"35% upon delivery of batteries","installationPayment":"30% upon installation completion","commissioningPayment":"15% upon successful commissioning","retention":"5% for 18 months"},"deliverySchedule":{"fabrication":"4 months","shipping":"1 month","installation":"2 months","commissioning":"1 month","totalDuration":"8 months from contract effective"},"safetyRequirements":{"fireSupression":"Automatic fire suppression system with FM200","batteryManagement":"Advanced BMS with cell-level monitoring","emergencyShutdown":"Manual and automatic emergency shutdown","thermalManagement":"Liquid cooling system with redundancy"},"environmentalCompliance":{"recycling":"End-of-life battery recycling plan required","hazardousMaterials":"Compliance with Indonesian hazmat regulations","carbonFootprint":"Lifecycle carbon assessment per ISO 14040"},"gridCompliance":{"gridCode":"Full compliance with PLN Grid Code","frequencyResponse":"Primary frequency response capability","voltageSupport":"Reactive power range 0.95 leading to 0.95 lagging","islanding":"Anti-islanding protection per IEEE 1547"},"localContent":{"containerization":"BESS containers manufactured in Indonesia","laborForce":"70% Indonesian workforce for installation","maintenanceTraining":"Comprehensive training for local technicians"},"terminationClauses":{"noticePeriod":"90 days written notice","forCause":"Material breach or safety violations","performanceFailure":"Right to terminate if guaranteed specs not met","disputeResolution":"Arbitration under BANI rules"},"legalTerms":{"governingLaw":"Republic of Indonesia","jurisdiction":"District Court of Central Jakarta","liability":"Product liability insurance min IDR 100 billion","warranties":"10-year equipment warranty, 2-year workmanship"}}',
'{"header":true,"parties":true,"scopeOfWork":true,"technicalSpecifications":true,"performanceGuarantee":true,"pricing":true,"paymentTerms":true,"deliverySchedule":true,"safetyRequirements":true,"environmentalCompliance":true,"gridCompliance":true,"localContent":true,"terminationClauses":true,"legalTerms":true}',
'Approved', 1, 'Dimas Prastio', 'Siti Nurhaliza', 'Approved', '2025-01-25 09:45:00+07'),

('SE-2025-OFFSHORE-001', 'Offshore Wind Installation Contract Template',
'{"header":{"title":"Offshore Wind Turbine Installation Agreement","contractType":"Engineering, Procurement, Construction (EPC)","sector":"Renewable Energy - Offshore Wind"},"parties":{"buyer":"PT Indonesia Power","contractor":"To be determined"},"scope":{"projectName":"Nusa Tenggara Offshore Wind Farm","capacity":"200 MW","turbineCount":"40 x 5MW turbines","location":"30km offshore from Kupang"},"performanceGuarantee":{"availability":"98% for first year","capacityFactor":"Minimum 45%","warranty":"5 years comprehensive"}}',
'{"header":true,"parties":true,"scope":true,"performanceGuarantee":true}',
'Draft', 1, 'Jefferson Soesetyo', null, 'Pending', null),

('SE-2025-HYDRO-001', 'Hydroelectric Equipment Supply Template',
'{"header":{"title":"Hydroelectric Turbine and Generator Supply Agreement","contractType":"Equipment Supply","sector":"Renewable Energy - Hydropower"},"parties":{"buyer":"PT Indonesia Power","supplier":"To be determined"},"equipment":{"turbineType":"Francis turbine","capacity":"25 MW","generator":"Synchronous generator, 11kV","location":"Sumatra hydropower plant"},"warranty":{"turbineWarranty":"10 years","generatorWarranty":"5 years","performanceGuarantee":"Efficiency >92%"}}',
'{"header":true,"parties":true,"equipment":true,"warranty":true}',
'Draft', 1, 'Dimas Prastio', null, 'Pending', null),

('SE-2025-SOLAR-002', 'Solar Farm O&M Agreement Template',
'{"header":{"title":"Solar Farm Operations and Maintenance Agreement","contractType":"O&M Service Agreement","sector":"Renewable Energy - Solar"},"scope":{"facilityName":"Java Solar Farm - Phase 1","capacity":"75 MW","location":"East Java","servicePeriod":"10 years"},"services":{"operations":"24/7 monitoring and control","maintenance":"Preventive and corrective maintenance","performance":"Performance ratio guarantee >80%"},"pricing":{"annualFee":"IDR 18,750,000,000","escalation":"CPI-linked annual adjustment"}}',
'{"header":true,"scope":true,"services":true,"pricing":true}',
'Pending Approval', 1, 'Bambang Sutrisno', null, 'Pending', null),

('SE-2025-GRID-001', 'Grid Interconnection Contract Template',
'{"header":{"title":"Grid Interconnection and Power Purchase Agreement","contractType":"PPA + Grid Connection","sector":"Renewable Energy - Grid Integration"},"interconnection":{"voltage":"150 kV","substationUpgrade":"Required at Buyer cost","connectionPoint":"Kupang substation"},"powerPurchase":{"ppaRate":"USD 0.065 per kWh","term":"25 years","energyPayment":"Monthly based on actual generation"},"gridCompliance":{"technicalStandards":"PLN Grid Code 2023","meteringStandard":"Bidirectional, revenue-grade meters","communicationProtocol":"IEC 61850"}}',
'{"header":true,"interconnection":true,"powerPurchase":true,"gridCompliance":true}',
'Pending Approval', 1, 'Intan Pratiwi', null, 'Pending', null),

('SE-2025-REC-001', 'Renewable Energy Certificate Purchase Template',
'{"header":{"title":"Renewable Energy Certificate Purchase Agreement","contractType":"Commodity Purchase","sector":"Renewable Energy - RECs"},"certificates":{"type":"International REC (I-REC)","volume":"500,000 MWh annually","sources":"Solar and wind generation in Indonesia","verificationStandard":"I-REC Standard"},"pricing":{"pricePerCertificate":"USD 1.50 per MWh","paymentTerms":"Quarterly settlement","priceReview":"Annual adjustment based on market"},"delivery":{"transferMechanism":"I-REC registry","vintage":"Current year certificates only","retirementAccount":"Buyer designated account"}}',
'{"header":true,"certificates":true,"pricing":true,"delivery":true}',
'Draft', 1, 'Siti Nurhaliza', null, 'Pending', null),

('SE-2025-CARBON-001', 'Carbon Credit Trading Agreement Template',
'{"header":{"title":"Voluntary Carbon Credit Purchase Agreement","contractType":"Carbon Credit Purchase","sector":"Environmental - Carbon Markets"},"carbonCredits":{"type":"Verified Carbon Standard (VCS)","projectType":"Renewable energy projects in Indonesia","volume":"100,000 tonnes CO2e annually","vintage":"2024-2025"},"pricing":{"pricePerTonne":"USD 12.00 per tCO2e","totalAnnualValue":"USD 1,200,000","escalation":"5% annually"},"verification":{"standard":"VCS + CCB Standards","registry":"Verra Registry","retirement":"Immediate upon transfer"}}',
'{"header":true,"carbonCredits":true,"pricing":true,"verification":true}',
'Draft', 1, 'Intan Pratiwi', null, 'Pending', null),

('SE-2025-LEASE-001', 'Energy Storage System Lease Template',
'{"header":{"title":"Battery Energy Storage System Lease Agreement","contractType":"Equipment Lease","sector":"Renewable Energy - Storage"},"leasedEquipment":{"description":"Containerized BESS units","capacity":"20 MWh total","power":"10 MW","technology":"LFP batteries"},"leaseTerms":{"leasePeriod":"7 years","monthlyPayment":"IDR 1,875,000,000","maintenanceIncluded":"Full maintenance by lessor","purchaseOption":"Fair market value at end of term"},"performance":{"availability":"95% guaranteed","responseTime":"Lessor responsible for repairs within 48 hours","replacement":"Equipment replaced if availability <90% for 2 consecutive months"}}',
'{"header":true,"leasedEquipment":true,"leaseTerms":true,"performance":true}',
'Rejected', 1, 'Dimas Prastio', 'Siti Nurhaliza', 'Rejected', '2025-02-01 11:20:00+07');

-- Insert Approval Workflow Configurations
INSERT INTO ref_approval_workflow_config (workflow_name, contract_type, min_value, max_value, workflow_type, approval_steps, sla_hours, escalation_path, is_active) VALUES

('Standard Serial Workflow', 'Solar Panel Supply', 0, 500000000000, 'Serial',
'[{"step":1,"role":"Legal Counsel","approver":"Intan Pratiwi"},{"step":2,"role":"Procurement Manager","approver":"Dimas Prastio"},{"step":3,"role":"Finance Director","approver":"Siti Nurhaliza"}]'::jsonb,
72,
'[{"level":1,"escalateTo":"Head of Procurement","afterHours":48},{"level":2,"escalateTo":"Vice President Operations","afterHours":96}]'::jsonb,
true),

('High-Value Serial Workflow', 'Wind Turbine', 500000000000, 2000000000000, 'Serial',
'[{"step":1,"role":"Technical Reviewer","approver":"Jefferson Soesetyo"},{"step":2,"role":"Legal Director","approver":"Intan Pratiwi"},{"step":3,"role":"Procurement Head","approver":"Dimas Prastio"},{"step":4,"role":"CFO","approver":"Siti Nurhaliza"},{"step":5,"role":"CEO","approver":"Board Approval Required"}]'::jsonb,
120,
'[{"level":1,"escalateTo":"VP Engineering","afterHours":72},{"level":2,"escalateTo":"COO","afterHours":144}]'::jsonb,
true),

('Parallel Technical-Legal Review', 'Battery Storage', 0, 1000000000000, 'Parallel',
'[{"step":1,"parallelGroup":"A","role":"Technical Reviewer","approver":"Jefferson Soesetyo"},{"step":1,"parallelGroup":"A","role":"Legal Counsel","approver":"Intan Pratiwi"},{"step":2,"role":"Procurement Manager","approver":"Dimas Prastio"},{"step":3,"role":"Finance Manager","approver":"Siti Nurhaliza"}]'::jsonb,
96,
'[{"level":1,"escalateTo":"Head of Engineering","afterHours":60}]'::jsonb,
true),

('Fast-Track Low-Value', 'Solar Farm O&M', 0, 100000000000, 'Parallel',
'[{"step":1,"parallelGroup":"A","role":"Legal Counsel","approver":"Intan Pratiwi"},{"step":1,"parallelGroup":"A","role":"Procurement Lead","approver":"Dimas Prastio"}]'::jsonb,
48,
'[{"level":1,"escalateTo":"Procurement Manager","afterHours":36}]'::jsonb,
true),

('Complex Hybrid Workflow', 'Grid Interconnection', 100000000000, null, 'Hybrid',
'[{"step":1,"parallelGroup":"A","role":"Grid Technical Expert","approver":"Jefferson Soesetyo"},{"step":1,"parallelGroup":"A","role":"Legal Counsel","approver":"Intan Pratiwi"},{"step":2,"role":"PLN Coordination","approver":"External PLN Approval"},{"step":3,"role":"Procurement Head","approver":"Dimas Prastio"},{"step":4,"role":"Finance Director","approver":"Siti Nurhaliza"}]'::jsonb,
168,
'[{"level":1,"escalateTo":"VP Grid Operations","afterHours":96},{"level":2,"escalateTo":"COO","afterHours":168}]'::jsonb,
true);

-- Continue in next part due to length...