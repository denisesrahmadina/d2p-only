/*
  # Create Document Management Tables

  1. New Tables
    - `document_categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name
      - `description` (text) - Category description
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `document_types`
      - `id` (text, primary key) - Type identifier (rtm, template)
      - `name` (text) - Type display name
      - `description` (text) - Type description
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `document_authors`
      - `id` (uuid, primary key)
      - `name` (text) - Author name
      - `role` (text) - Author role
      - `email` (text) - Author email
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `documents`
      - `id` (text, primary key)
      - `name` (text) - Document name
      - `description` (text) - Document description
      - `document_type` (text) - Reference to document_types
      - `category_id` (uuid) - Reference to document_categories
      - `version` (text) - Document version
      - `status` (text) - Document status (approved, review, draft, outdated, active, deprecated)
      - `file_type` (text) - File type (xlsx, docx, pptx, pdf)
      - `size` (text) - File size
      - `author_id` (uuid) - Reference to document_authors
      - `download_url` (text) - S3 download URL
      - `preview_url` (text) - S3 preview URL
      - `s3_bucket` (text) - S3 bucket name
      - `s3_key` (text) - S3 object key
      - `s3_region` (text) - S3 region
      - `functional_id` (text) - Functional area ID (for RTM docs)
      - `functional_name` (text) - Functional area name
      - `business_process` (text) - Business process name
      - `module_code` (text) - SAP module code
      - `module_name` (text) - SAP module name
      - `sub_module_code` (text) - SAP sub-module code
      - `sub_module_name` (text) - SAP sub-module name
      - `requirement_count` (integer) - Number of requirements (for RTM docs)
      - `tags` (text[]) - Document tags for search
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous read access
    - Add policies for authenticated full access

  3. Indexes
    - Create indexes for frequently queried columns
    - Full text search indexes on name and description
*/

-- Create document_types table
CREATE TABLE IF NOT EXISTS document_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create document_categories table
CREATE TABLE IF NOT EXISTS document_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create document_authors table
CREATE TABLE IF NOT EXISTS document_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL REFERENCES document_types(id),
  category_id UUID REFERENCES document_categories(id),
  version TEXT DEFAULT 'v1.0',
  status TEXT DEFAULT 'draft' CHECK (status IN ('approved', 'review', 'draft', 'outdated', 'active', 'deprecated')),
  file_type TEXT CHECK (file_type IN ('xlsx', 'docx', 'pptx', 'pdf')),
  size TEXT,
  author_id UUID REFERENCES document_authors(id),
  download_url TEXT NOT NULL,
  preview_url TEXT,
  s3_bucket TEXT,
  s3_key TEXT,
  s3_region TEXT DEFAULT 'us-east-1',
  functional_id TEXT,
  functional_name TEXT,
  business_process TEXT,
  module_code TEXT,
  module_name TEXT,
  sub_module_code TEXT,
  sub_module_name TEXT,
  requirement_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_author ON documents(author_id);
CREATE INDEX IF NOT EXISTS idx_documents_module ON documents(module_code);
CREATE INDEX IF NOT EXISTS idx_documents_business_process ON documents(business_process);
CREATE INDEX IF NOT EXISTS idx_documents_file_type ON documents(file_type);
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN (tags);

-- Create full text search index
CREATE INDEX IF NOT EXISTS idx_documents_search ON documents USING GIN (
  to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
);

-- Enable Row Level Security
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies for document_types
CREATE POLICY "Allow anonymous read access to document_types"
  ON document_types FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to document_types"
  ON document_types FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for document_categories
CREATE POLICY "Allow anonymous read access to document_categories"
  ON document_categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to document_categories"
  ON document_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for document_authors
CREATE POLICY "Allow anonymous read access to document_authors"
  ON document_authors FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to document_authors"
  ON document_authors FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for documents
CREATE POLICY "Allow anonymous read access to documents"
  ON documents FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access to documents"
  ON documents FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert document types
INSERT INTO document_types (id, name, description) VALUES
('rtm', 'Requirements Traceability Matrix', 'Documents that track requirements from business needs to implementation'),
('template', 'Template Document', 'Standardized document templates for various purposes')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Insert document categories
INSERT INTO document_categories (name, description) VALUES
('Financial Management & Reporting', 'Finance and accounting related documents'),
('Asset & Equipment Management', 'Asset and maintenance management documents'),
('Procurement & Supply Chain', 'Procurement and supply chain documents'),
('Sales & Distribution', 'Sales and distribution related documents'),
('Human Capital Management', 'HR and personnel management documents'),
('Security & Authorization Management', 'Security and access control documents'),
('Master Data Management', 'Master data governance documents'),
('Data Migration & Integration', 'Data migration and system integration documents'),
('Technical Documentation', 'Technical design and architecture documents'),
('Functional Documentation', 'Business process and functional specification documents'),
('Deployment Documentation', 'Deployment and go-live documents'),
('Go-Live Documentation', 'Go-live checklist and procedures'),
('Testing Documentation', 'Test plans, test cases, and UAT documents'),
('Training Documentation', 'Training materials and user guides'),
('Integration Documentation', 'System integration specifications'),
('Data Migration Documentation', 'Data migration mapping and procedures'),
('Change Management Documentation', 'Change management and communication plans'),
('Security Documentation', 'Security and compliance documents'),
('Project Management Documentation', 'Project status and management reports'),
('User Documentation', 'End user guides and quick references')
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  updated_at = NOW();

-- Insert document authors
INSERT INTO document_authors (name, role, email) VALUES
('Michael Anderson', 'SAP Migration Project Lead', 'michael.anderson@company.com'),
('Ravi Sharma', 'SAP Module Lead - Finance (FI/CO)', 'ravi.sharma@company.com'),
('Jennifer Liu', 'SAP Module Lead - Sales & Distribution (SD)', 'jennifer.liu@company.com'),
('David Kim', 'SAP ABAP Development Lead', 'david.kim@company.com'),
('Sarah Chen', 'SAP Deployment Lead', 'sarah.chen@company.com'),
('Priya Patel', 'SAP Test Lead', 'priya.patel@company.com'),
('James Wilson', 'SAP Security Lead', 'james.wilson@company.com'),
('Maria Rodriguez', 'SAP Integration Lead', 'maria.rodriguez@company.com')
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_document_types_updated_at ON document_types;
CREATE TRIGGER trigger_update_document_types_updated_at
  BEFORE UPDATE ON document_types
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();

DROP TRIGGER IF EXISTS trigger_update_document_categories_updated_at ON document_categories;
CREATE TRIGGER trigger_update_document_categories_updated_at
  BEFORE UPDATE ON document_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();

DROP TRIGGER IF EXISTS trigger_update_document_authors_updated_at ON document_authors;
CREATE TRIGGER trigger_update_document_authors_updated_at
  BEFORE UPDATE ON document_authors
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();

DROP TRIGGER IF EXISTS trigger_update_documents_updated_at ON documents;
CREATE TRIGGER trigger_update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();
