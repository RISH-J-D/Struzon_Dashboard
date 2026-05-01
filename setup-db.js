import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'db.lkagqmvqpvqixgvqchpr.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'Girish@9042069557',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

const sql = `
CREATE TABLE IF NOT EXISTS site_content (
  key text PRIMARY KEY,
  value jsonb,
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vacancies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  type text NOT NULL,
  location text NOT NULL,
  experience text NOT NULL,
  status text NOT NULL,
  spots integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Public can view site content" ON site_content;
DROP POLICY IF EXISTS "Public can view vacancies" ON vacancies;
DROP POLICY IF EXISTS "Authenticated users can manage site content" ON site_content;
DROP POLICY IF EXISTS "Authenticated users can manage vacancies" ON vacancies;

-- RLS Setup
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view site content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public can view vacancies" ON vacancies FOR SELECT USING (true);

-- Allow authenticated users to manage
CREATE POLICY "Authenticated users can manage site content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage vacancies" ON vacancies FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial content so the table isn't empty
INSERT INTO site_content (key, value)
VALUES 
('hero_title', '"We make business Simple & Reliable."'),
('hero_subtitle', '"Struzon works with the world’s leading manufacturers to give you reliable automation."')
ON CONFLICT (key) DO NOTHING;
`;

async function setup() {
  try {
    await client.connect();
    console.log('Connected to DB');
    await client.query(sql);
    console.log('Schema created successfully');
  } catch (err) {
    console.error('Error creating schema', err);
  } finally {
    await client.end();
  }
}

setup();
