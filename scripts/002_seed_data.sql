-- Insert sample clients
INSERT INTO clients (name, email, company, phone, status) VALUES
  ('John Smith', 'john@techcorp.com', 'TechCorp Inc', '+1-555-0101', 'active'),
  ('Sarah Johnson', 'sarah@designstudio.com', 'Design Studio', '+1-555-0102', 'active'),
  ('Michael Brown', 'michael@startupco.com', 'StartupCo', '+1-555-0103', 'active'),
  ('Emily Davis', 'emily@retailbiz.com', 'Retail Biz', '+1-555-0104', 'inactive')
ON CONFLICT DO NOTHING;

-- Insert sample projects
INSERT INTO projects (name, client_id, status, budget, deadline, description)
SELECT 
  'Website Redesign',
  (SELECT id FROM clients WHERE email = 'john@techcorp.com'),
  'in-progress',
  15000.00,
  CURRENT_DATE + INTERVAL '30 days',
  'Complete redesign of corporate website with modern UI/UX'
WHERE EXISTS (SELECT 1 FROM clients WHERE email = 'john@techcorp.com');

INSERT INTO projects (name, client_id, status, budget, deadline, description)
SELECT 
  'Brand Identity',
  (SELECT id FROM clients WHERE email = 'sarah@designstudio.com'),
  'planning',
  8000.00,
  CURRENT_DATE + INTERVAL '45 days',
  'New brand identity including logo, colors, and style guide'
WHERE EXISTS (SELECT 1 FROM clients WHERE email = 'sarah@designstudio.com');

INSERT INTO projects (name, client_id, status, budget, deadline, description)
SELECT 
  'Mobile App Development',
  (SELECT id FROM clients WHERE email = 'michael@startupco.com'),
  'in-progress',
  50000.00,
  CURRENT_DATE + INTERVAL '90 days',
  'iOS and Android app for customer engagement'
WHERE EXISTS (SELECT 1 FROM clients WHERE email = 'michael@startupco.com');

INSERT INTO projects (name, client_id, status, budget, deadline, description)
SELECT 
  'SEO Optimization',
  (SELECT id FROM clients WHERE email = 'john@techcorp.com'),
  'completed',
  5000.00,
  CURRENT_DATE - INTERVAL '10 days',
  'Complete SEO audit and optimization'
WHERE EXISTS (SELECT 1 FROM clients WHERE email = 'john@techcorp.com');
