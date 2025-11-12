/*
  # Contract Workspace Mock Data

  Populates the contract workspace tables with realistic demo data:
  - 5 sample contracts at different review stages
  - 7 vendor feedback items across different contracts
  - 7 AI suggested changes with varying confidence scores
  - 4 stakeholder approvals showing approval workflow
*/

INSERT INTO contract_reviews (id, contract_id, vendor_name, contract_type, contract_value, deadline, status, stage, original_content) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'CNT-2025-001', 'PT Sumber Energi Indonesia', 'Power Purchase Agreement', 5000000000, '2025-02-15', 'in_review', 'stage_2_ai_review', '{"total_pages": 45, "sections": ["Terms", "Pricing", "Delivery", "Quality Standards"]}'),
  ('c2222222-2222-2222-2222-222222222222', 'CNT-2025-002', 'PT Green Energy Solutions', 'Equipment Supply Contract', 3200000000, '2025-02-20', 'pending_review', 'stage_1_selection', '{"total_pages": 32, "sections": ["Scope", "Payment Terms", "Warranties"]}'),
  ('c3333333-3333-3333-3333-333333333333', 'CNT-2025-003', 'PT Renewable Power Corp', 'Maintenance Service Agreement', 1800000000, '2025-02-10', 'in_review', 'stage_3_approval', '{"total_pages": 28, "sections": ["Service Level", "Response Time", "Compensation"]}'),
  ('c4444444-4444-4444-4444-444444444444', 'CNT-2025-004', 'PT Solar Tech Industries', 'Technology Transfer Agreement', 4500000000, '2025-03-01', 'pending_review', 'stage_1_selection', '{"total_pages": 56, "sections": ["Intellectual Property", "Training", "Support"]}'),
  ('c5555555-5555-5555-5555-555555555555', 'CNT-2025-005', 'PT Wind Energy Systems', 'Joint Venture Agreement', 8000000000, '2025-02-25', 'in_review', 'stage_2_ai_review', '{"total_pages": 67, "sections": ["Equity Structure", "Governance", "Profit Sharing", "Exit Clauses"]}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO vendor_feedback (id, contract_review_id, section_name, feedback_type, feedback_text, sentiment, priority, submitted_at) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Pricing Terms', 'modification_request', 'We request an adjustment to the pricing escalation clause to use the Consumer Price Index (CPI) instead of a fixed 5% annual increase. This better reflects actual market conditions.', 'neutral', 'high', '2025-01-15 10:30:00'),
  ('f2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Delivery Schedule', 'concern', 'The proposed delivery timeline of 90 days is too aggressive given current supply chain constraints. We recommend extending to 120 days.', 'negative', 'high', '2025-01-15 11:45:00'),
  ('f3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Quality Standards', 'clarification', 'Please clarify the testing methodology for the quality acceptance criteria. We want to ensure alignment with international standards.', 'neutral', 'medium', '2025-01-15 14:20:00'),
  ('f4444444-4444-4444-4444-444444444444', 'c5555555-5555-5555-5555-555555555555', 'Equity Structure', 'modification_request', 'We propose adjusting the equity split from 60-40 to 55-45 to better reflect our technology contribution and operational responsibilities.', 'neutral', 'high', '2025-01-18 09:15:00'),
  ('f5555555-5555-5555-5555-555555555555', 'c5555555-5555-5555-5555-555555555555', 'Governance', 'suggestion', 'We suggest adding a technical advisory board with equal representation to facilitate joint decision-making on technical matters.', 'positive', 'medium', '2025-01-18 10:30:00'),
  ('f6666666-6666-6666-6666-666666666666', 'c5555555-5555-5555-5555-555555555555', 'Exit Clauses', 'concern', 'The current exit clause heavily favors one party. We need more balanced terms for both parties in case of dissolution.', 'negative', 'high', '2025-01-18 13:00:00'),
  ('f7777777-7777-7777-7777-777777777777', 'c3333333-3333-3333-3333-333333333333', 'Response Time', 'modification_request', 'Request to reduce emergency response time from 4 hours to 2 hours for critical failures to minimize production downtime.', 'neutral', 'high', '2025-01-12 15:45:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ai_suggested_changes (id, contract_review_id, vendor_feedback_id, section_name, change_type, original_text, suggested_text, reasoning, confidence_score, accepted, created_at) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'Pricing Terms - Escalation Clause', 'text_modification',
   'The Contract Price shall be increased by 5% annually on each anniversary of the Effective Date.',
   'The Contract Price shall be adjusted annually on each anniversary of the Effective Date based on the change in the Consumer Price Index (CPI) as published by the Central Statistics Agency, with a minimum adjustment of 2% and maximum of 8%.',
   'Adopting CPI-based escalation provides market-reflective pricing while including reasonable caps. This addresses vendor concerns about rigid fixed increases and aligns with industry best practices for long-term contracts.',
   0.92, true, '2025-01-16 08:00:00'),

  ('a2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'f2222222-2222-2222-2222-222222222222', 'Delivery Schedule - Timeline', 'text_modification',
   'The Vendor shall deliver all equipment within 90 calendar days from the Purchase Order date.',
   'The Vendor shall deliver all equipment within 120 calendar days from the Purchase Order date, with progress updates provided at 30-day intervals.',
   'Extended timeline accommodates realistic supply chain conditions while adding milestone reporting for better visibility. This reduces delivery risk and improves vendor capability to meet commitments.',
   0.88, true, '2025-01-16 08:15:00'),

  ('a3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'f3333333-3333-3333-3333-333333333333', 'Quality Standards - Testing Protocol', 'clause_addition',
   '',
   'All quality testing shall be conducted in accordance with ISO 9001:2015 standards and IEC 61000-4 series for electromagnetic compatibility. Test procedures shall be mutually agreed upon in writing prior to final acceptance testing.',
   'Adds specific international standard references requested by vendor, providing clear testing framework while maintaining quality requirements. Includes mutual agreement provision for procedural clarity.',
   0.85, true, '2025-01-16 08:30:00'),

  ('a4444444-4444-4444-4444-444444444444', 'c5555555-5555-5555-5555-555555555555', 'f4444444-4444-4444-4444-444444444444', 'Equity Structure - Ownership Split', 'text_modification',
   'Party A shall hold 60% equity interest and Party B shall hold 40% equity interest in the Joint Venture.',
   'Party A shall hold 55% equity interest and Party B shall hold 45% equity interest in the Joint Venture, recognizing Party B\'s technology contribution and operational management responsibilities.',
   'Adjusted equity split better reflects actual contribution balance including technology IP and operational burden. Maintains majority control while improving fairness perception.',
   0.78, false, '2025-01-19 09:00:00'),

  ('a5555555-5555-5555-5555-555555555555', 'c5555555-5555-5555-5555-555555555555', 'f5555555-5555-5555-5555-555555555555', 'Governance - Technical Advisory Board', 'clause_addition',
   '',
   'A Technical Advisory Board shall be established consisting of three representatives from each Party. The Board shall provide recommendations on technical strategy, technology selection, and operational optimization. Decisions require simple majority approval.',
   'Creates collaborative technical governance structure as suggested by vendor. Equal representation ensures balanced input while simple majority enables decision-making efficiency.',
   0.82, true, '2025-01-19 09:15:00'),

  ('a6666666-6666-6666-6666-666666666666', 'c5555555-5555-5555-5555-555555555555', 'f6666666-6666-6666-6666-666666666666', 'Exit Clauses - Dissolution Terms', 'text_modification',
   'In the event of dissolution, Party A shall have the first right to purchase Party B\'s equity interest at book value.',
   'In the event of dissolution, either Party shall have the right to purchase the other Party\'s equity interest at fair market value as determined by an independent valuation. If both parties wish to purchase, the purchasing party shall be determined by sealed bid auction.',
   'Balances exit rights between parties and ensures fair valuation methodology. Auction mechanism provides clear resolution for competing purchase interests.',
   0.86, true, '2025-01-19 09:30:00'),

  ('a7777777-7777-7777-7777-777777777777', 'c3333333-3333-3333-3333-333333333333', 'f7777777-7777-7777-7777-777777777777', 'Response Time - Emergency Service', 'text_modification',
   'For critical system failures, the Vendor shall respond within 4 hours of notification.',
   'For critical system failures, the Vendor shall respond within 2 hours of notification. A dedicated emergency response team shall be available 24/7 with direct contact numbers provided.',
   'Reduced response time addresses vendor concern about production downtime. Adding dedicated team ensures capability to meet commitment.',
   0.90, true, '2025-01-13 10:00:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO stakeholder_approvals (id, contract_review_id, stakeholder_type, approval_status, approved_by, approved_at, comments) VALUES
  ('s1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'procurement', 'approved', 'Sarah Johnson - Procurement Manager', '2025-01-14 14:30:00', 'Commercial terms are acceptable. The revised response time commitment significantly improves our operational risk profile.'),
  ('s2222222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333', 'legal', 'pending', NULL, NULL, NULL),
  ('s3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'procurement', 'pending', NULL, NULL, NULL),
  ('s4444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111', 'legal', 'pending', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;
