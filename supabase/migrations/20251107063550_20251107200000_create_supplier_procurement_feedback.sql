/*
  # Supplier Procurement Process Feedback

  1. New Table
    - `fact_supplier_procurement_feedback`
      - Stores feedback from suppliers about our company's procurement processes
      - Feedback covers: Supplier Qualification, Sourcing & Contracting, Order & Receipt, Payment
      - Uses a 1-5 rating scale for each process stage
      - Calculates average score across all stages
      - Links to specific categories and suppliers
  
  2. Security
    - Enable RLS on the table
    - Add policies for authenticated and anonymous users to read data

  3. Sample Data
    - Populate with mock feedback data for demonstration purposes
*/

-- Create Supplier Procurement Feedback Table
CREATE TABLE IF NOT EXISTS fact_supplier_procurement_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL,
  supplier_id text NOT NULL,
  supplier_name text NOT NULL,
  
  -- Feedback Period
  feedback_period text NOT NULL,
  feedback_date date NOT NULL,
  
  -- Process Stage Scores (1-5 scale)
  supplier_qualification_score int CHECK (supplier_qualification_score BETWEEN 1 AND 5),
  sourcing_contracting_score int CHECK (sourcing_contracting_score BETWEEN 1 AND 5),
  order_receipt_score int CHECK (order_receipt_score BETWEEN 1 AND 5),
  payment_score int CHECK (payment_score BETWEEN 1 AND 5),
  
  -- Overall Assessment
  average_score decimal(3,2),
  overall_comment text,
  satisfaction_level text CHECK (satisfaction_level IN ('Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied')),
  
  -- Detailed Feedback
  qualification_comment text,
  sourcing_comment text,
  order_comment text,
  payment_comment text,
  
  -- Improvement Suggestions
  suggested_improvements text,
  would_recommend boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE fact_supplier_procurement_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow anonymous read access to supplier procurement feedback"
  ON fact_supplier_procurement_feedback
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to supplier procurement feedback"
  ON fact_supplier_procurement_feedback
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_supplier_procurement_feedback_category ON fact_supplier_procurement_feedback(category_code);
CREATE INDEX IF NOT EXISTS idx_supplier_procurement_feedback_supplier ON fact_supplier_procurement_feedback(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_procurement_feedback_date ON fact_supplier_procurement_feedback(feedback_date);

-- Populate with mock data for Renewable Energy Materials (CAT001)
INSERT INTO fact_supplier_procurement_feedback (
  category_code,
  supplier_id,
  supplier_name,
  feedback_period,
  feedback_date,
  supplier_qualification_score,
  sourcing_contracting_score,
  order_receipt_score,
  payment_score,
  average_score,
  overall_comment,
  satisfaction_level,
  qualification_comment,
  sourcing_comment,
  order_comment,
  payment_comment,
  suggested_improvements,
  would_recommend
) VALUES
  ('CAT001', 'SUP001', 'GreenTech Solutions', 'Q3 2024', '2024-09-30', 4, 3, 5, 4, 4.00, 
   'Overall positive experience with your procurement process. The qualification process was thorough and professional. Payment processing is reliable.', 
   'Satisfied',
   'The qualification process was comprehensive and well-structured. Clear requirements and timely communication.',
   'Contract negotiations took longer than expected. More flexibility in terms would be appreciated.',
   'Order management is excellent. Receipt confirmation and tracking are smooth and transparent.',
   'Payment terms are fair and payments are always on time. This is a strong point of your organization.',
   'Consider streamlining the contract negotiation process and providing more flexibility in payment terms for long-term suppliers.',
   true),
  
  ('CAT001', 'SUP002', 'SolarMax Industries', 'Q3 2024', '2024-09-30', 3, 4, 4, 3, 3.50, 
   'Good experience overall, but the qualification process could be more efficient. Payment processing could be faster.', 
   'Satisfied',
   'Qualification requirements are clear but the process is lengthy. Consider implementing a fast-track for established suppliers.',
   'Contracting process is professional and fair. Good balance between company needs and supplier concerns.',
   'Order processing is smooth. Receipt procedures are clear and well-communicated.',
   'Payment processing is slower than industry standard. A 45-day payment term is challenging for our cash flow.',
   'Implement faster payment processing, especially for repeat orders. Consider early payment discounts.',
   true),
  
  ('CAT001', 'SUP003', 'WindPower Components Ltd', 'Q3 2024', '2024-09-30', 5, 5, 5, 5, 5.00, 
   'Excellent procurement process across all stages. Your organization sets the standard for professional procurement practices.', 
   'Very Satisfied',
   'Outstanding qualification process. Clear, fair, and efficient. The online portal makes document submission easy.',
   'Best-in-class contracting process. Balanced terms, transparent negotiations, and professional team.',
   'Seamless order management. Real-time tracking, clear communication, and efficient receipt procedures.',
   'Prompt payment processing. Consistent adherence to payment terms. Electronic payment options are convenient.',
   'No major improvements needed. Continue current practices and consider sharing best practices with industry peers.',
   true),
  
  ('CAT001', 'SUP004', 'EcoEnergy Materials', 'Q3 2024', '2024-09-30', 2, 2, 3, 2, 2.25, 
   'Significant challenges with your procurement process. Multiple stages need improvement to match industry standards.', 
   'Dissatisfied',
   'Qualification process is overly complex and time-consuming. Documentation requirements are excessive and unclear.',
   'Contract terms are rigid with little room for negotiation. The process lacks flexibility for different supplier situations.',
   'Order management is acceptable but could benefit from better communication and more transparent tracking.',
   'Payment delays are frequent. The 60-day payment term combined with processing delays creates cash flow challenges.',
   'Simplify qualification requirements, provide clearer guidelines, improve payment processing speed, and increase contract flexibility.',
   false),
  
  ('CAT001', 'SUP005', 'Renewable Systems Corp', 'Q3 2024', '2024-09-30', 4, 5, 4, 5, 4.50, 
   'Very good experience with your procurement team. Professional, responsive, and fair processes throughout.', 
   'Very Satisfied',
   'Qualification was thorough but efficient. The team was helpful in clarifying requirements and providing guidance.',
   'Excellent contracting process. Fair terms, transparent pricing discussions, and collaborative approach.',
   'Order processing is well-managed. Good communication and efficient handling of any issues that arise.',
   'Payment processing is excellent. Consistent, reliable, and often ahead of schedule. Sets a good example.',
   'Consider digital signatures for contracts to speed up the final approval process.',
   true);

-- Populate with mock data for Industrial Equipment (CAT002)
INSERT INTO fact_supplier_procurement_feedback (
  category_code,
  supplier_id,
  supplier_name,
  feedback_period,
  feedback_date,
  supplier_qualification_score,
  sourcing_contracting_score,
  order_receipt_score,
  payment_score,
  average_score,
  overall_comment,
  satisfaction_level,
  qualification_comment,
  sourcing_comment,
  order_comment,
  payment_comment,
  suggested_improvements,
  would_recommend
) VALUES
  ('CAT002', 'SUP006', 'HeavyMach Industries', 'Q3 2024', '2024-09-30', 4, 4, 3, 4, 3.75, 
   'Professional procurement process with room for improvement in order management coordination.', 
   'Satisfied',
   'Clear qualification criteria and efficient review process. Technical evaluation was thorough.',
   'Fair contracting process with reasonable terms for the industrial equipment sector.',
   'Order coordination could be better. Lead times are sometimes not accurately reflected in the system.',
   'Payment terms are fair and consistently honored. Appreciate the prompt processing.',
   'Improve coordination between procurement and operations for better order tracking and delivery scheduling.',
   true),
  
  ('CAT002', 'SUP007', 'Precision Tools Co', 'Q3 2024', '2024-09-30', 5, 4, 5, 5, 4.75, 
   'Excellent working relationship with your procurement team. Professional and efficient across all stages.', 
   'Very Satisfied',
   'Fast and efficient qualification process. Technical requirements are clearly defined.',
   'Good contracting process, though occasionally lengthy for standard equipment orders.',
   'Outstanding order management. Excellent communication and tracking throughout the delivery process.',
   'Exemplary payment processing. Always on time and transparent. One of the best clients to work with.',
   'Consider simplified contracts for repeat standard orders to speed up the process.',
   true),
  
  ('CAT002', 'SUP008', 'Industrial Solutions Group', 'Q3 2024', '2024-09-30', 3, 3, 4, 3, 3.25, 
   'Adequate procurement process but could benefit from modernization and improved communication.', 
   'Neutral',
   'Qualification process is traditional and paper-heavy. Would benefit from digital transformation.',
   'Contract negotiations are fair but slow. More standardized templates would help.',
   'Order management works well. Good coordination between procurement and receiving departments.',
   'Payment processing is reliable but follows a strict schedule. More flexibility would be helpful.',
   'Invest in digital procurement systems and provide more online self-service options for suppliers.',
   true);

-- Populate with mock data for Construction Materials (CAT003)
INSERT INTO fact_supplier_procurement_feedback (
  category_code,
  supplier_id,
  supplier_name,
  feedback_period,
  feedback_date,
  supplier_qualification_score,
  sourcing_contracting_score,
  order_receipt_score,
  payment_score,
  average_score,
  overall_comment,
  satisfaction_level,
  qualification_comment,
  sourcing_comment,
  order_comment,
  payment_comment,
  suggested_improvements,
  would_recommend
) VALUES
  ('CAT003', 'SUP009', 'BuildRight Materials', 'Q3 2024', '2024-09-30', 4, 4, 4, 4, 4.00, 
   'Consistent and reliable procurement process. Good balance between requirements and efficiency.', 
   'Satisfied',
   'Qualification process is well-structured with clear safety and quality requirements.',
   'Fair and transparent contracting. Pricing negotiations are conducted professionally.',
   'Order management is efficient with good coordination for delivery scheduling.',
   'Payment terms are standard for the industry and consistently honored.',
   'Consider volume discounts for regular high-volume orders and seasonal demand.',
   true),
  
  ('CAT003', 'SUP010', 'Concrete Solutions Ltd', 'Q3 2024', '2024-09-30', 3, 4, 3, 3, 3.25, 
   'Reasonable procurement process with some areas needing attention, particularly in qualification and receipt procedures.', 
   'Neutral',
   'Qualification requirements are extensive. Some requirements seem redundant for established suppliers.',
   'Contracting is professional and terms are generally fair. Good negotiation atmosphere.',
   'Receipt procedures at site level are inconsistent. Better training for site personnel needed.',
   'Payment processing is acceptable but sometimes delayed due to documentation issues at site level.',
   'Streamline qualification renewals, standardize receipt procedures across sites, improve document flow.',
   true);
