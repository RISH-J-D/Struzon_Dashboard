import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'db.hrsxmnknvxtpdjofynta.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'Struzon@2026#',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

const sql = `
-- 1. Create the Galleries Table
CREATE TABLE IF NOT EXISTS galleries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_name text NOT NULL,
  title text,
  description text,
  image_url text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS for Galleries
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view galleries" ON galleries;
DROP POLICY IF EXISTS "Authenticated users can manage galleries" ON galleries;

CREATE POLICY "Public can view galleries" ON galleries FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage galleries" ON galleries FOR ALL USING (auth.role() = 'authenticated');

-- 2. Setup Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('site_media', 'site_media', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage
DROP POLICY IF EXISTS "Public can view site_media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage site_media" ON storage.objects;
DROP POLICY IF EXISTS "Public can insert site_media" ON storage.objects;

CREATE POLICY "Public can view site_media" ON storage.objects FOR SELECT USING (bucket_id = 'site_media');
CREATE POLICY "Authenticated users can manage site_media" ON storage.objects FOR ALL USING (bucket_id = 'site_media' AND auth.role() = 'authenticated');
CREATE POLICY "Public can insert site_media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site_media');
CREATE POLICY "Public can update site_media" ON storage.objects FOR UPDATE USING (bucket_id = 'site_media');

DROP POLICY IF EXISTS "Public can insert galleries" ON galleries;
CREATE POLICY "Public can insert galleries" ON galleries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can delete galleries" ON galleries FOR DELETE USING (true);

`;

async function setup() {
  try {
    await client.connect();
    console.log('Connected to DB');
    await client.query(sql);
    console.log('Media schema and storage created successfully');
  } catch (err) {
    console.error('Error creating schema', err);
  } finally {
    await client.end();
  }
}

setup();
