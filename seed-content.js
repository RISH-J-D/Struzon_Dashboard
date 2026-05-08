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

const contentSeed = [
  { key: 'home_hero_title', page: 'Home', type: 'text', value: 'Structural\nSteel\nDetailing &\nEngineering\nService Partner' },
  { key: 'home_hero_subtitle', page: 'Home', type: 'textarea', value: 'A trusted partner to the construction industry — pioneers of structural detailing, engineering, design and research, delivering complex, time-sensitive projects worldwide.' },
  { key: 'home_about_title', page: 'Home', type: 'text', value: 'Who We Are' },
  { key: 'home_about_text_1', page: 'Home', type: 'textarea', value: 'Struzon, a trusted structural steel detailing/engineering service partner to the construction industry — market pioneers of engineering, design, and research.' },
  { key: 'home_about_text_2', page: 'Home', type: 'textarea', value: 'Our work integrates with steel detailing, connection design/stamping for structural, miscellaneous detailing, and BIM (Building Information Modeling) services. We help with the structure, expansion, alteration, and revamp of new and existing constructions.' },
  
  { key: 'about_hero_title', page: 'About', type: 'text', value: 'We Build What You Envision' },
  { key: 'about_hero_subtitle', page: 'About', type: 'textarea', value: 'A global leader in structural steel detailing, connection design, and engineering excellence.' },
  { key: 'about_who_title', page: 'About', type: 'text', value: 'Specialized Detailing Excellence' },
  { key: 'about_who_text_1', page: 'About', type: 'textarea', value: 'We are a team of highly qualified engineers and detailers specializing in Structural Steel Detailing, Connection Design, Piping Detailing, and Miscellaneous Steel Detailing...' },
  
  { key: 'services_hero_title', page: 'Services', type: 'text', value: 'Our Services' },
  { key: 'services_hero_subtitle', page: 'Services', type: 'textarea', value: 'Providing the technical backbone for North America\'s most ambitious structures through precision-driven steel detailing and BIM integration.' },
  
  { key: 'contact_hero_title', page: 'Contact', type: 'text', value: 'Let\'s build something great.' },
  { key: 'contact_hero_subtitle', page: 'Contact', type: 'textarea', value: 'Ready to elevate your structural detailing process? We\'re here to provide precision-driven solutions for your next project.' },
  { key: 'contact_address', page: 'Contact', type: 'textarea', value: '123 Steel Structure Avenue,\nIndustrial Tech Park,\nChennai, India - 600001' },
  { key: 'contact_email', page: 'Contact', type: 'text', value: 'info@struzon.com' },
  { key: 'contact_phone', page: 'Contact', type: 'text', value: '+91 98765 43210' },

  { key: 'footer_cta_title', page: 'Global', type: 'text', value: 'Seeking a better detailing solution?' },
  { key: 'footer_cta_subtitle', page: 'Global', type: 'textarea', value: 'Contact the experts at Struzon to explore how we can help you deliver your next project on schedule, with quality and absolute efficiency.' },
];

async function seed() {
  await client.connect();
  console.log('Connected');
  
  // Alter table
  try {
    await client.query("ALTER TABLE site_content ADD COLUMN IF NOT EXISTS page text DEFAULT 'Global';");
    await client.query("ALTER TABLE site_content ADD COLUMN IF NOT EXISTS type text DEFAULT 'text';");
    console.log('Added columns');
  } catch (err) {
    console.error('Alter error', err.message);
  }

  // Clear old rows
  await client.query("DELETE FROM site_content;");

  // Insert new rows
  for (const c of contentSeed) {
    await client.query(
      'INSERT INTO site_content (key, value, page, type) VALUES ($1, $2, $3, $4)',
      [c.key, JSON.stringify(c.value), c.page, c.type]
    );
  }
  
  console.log('Content seeded');
  await client.end();
}

seed();
