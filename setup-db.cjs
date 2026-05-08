const { Client } = require('pg');

const client = new Client({
  host: 'db.hrsxmnknvxtpdjofynta.supabase.co',
  port: 6543,
  user: 'postgres.hrsxmnknvxtpdjofynta',
  password: 'Struzon@2026#',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function setup() {
  try {
    await client.connect();
    console.log('Connected to DB');

    // site_content
    console.log('Creating site_content table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        page TEXT,
        type TEXT DEFAULT 'text',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public Read" ON site_content;
      CREATE POLICY "Public Read" ON site_content FOR SELECT USING (true);
    `);

    // vacancies
    console.log('Creating vacancies table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS vacancies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        location TEXT NOT NULL,
        experience TEXT NOT NULL,
        status TEXT DEFAULT 'Open',
        spots INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public Read" ON vacancies;
      CREATE POLICY "Public Read" ON vacancies FOR SELECT USING (true);
    `);

    // projects
    console.log('Creating projects table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        tag TEXT,
        details TEXT,
        location TEXT,
        engineer TEXT,
        main_image TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public Read" ON projects;
      CREATE POLICY "Public Read" ON projects FOR SELECT USING (true);
    `);

    // project_images
    console.log('Creating project_images table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_images (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public Read" ON project_images;
      CREATE POLICY "Public Read" ON project_images FOR SELECT USING (true);
    `);

    // team_members
    console.log('Creating team_members table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT UNIQUE,
        linkedin TEXT,
        image_url TEXT,
        bio JSONB,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public Read" ON team_members;
      CREATE POLICY "Public Read" ON team_members FOR SELECT USING (true);
      DROP POLICY IF EXISTS "Admin All" ON team_members;
      CREATE POLICY "Admin All" ON team_members FOR ALL USING (true) WITH CHECK (true);
    `);

    console.log('Database setup complete.');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await client.end();
  }
}

setup();
