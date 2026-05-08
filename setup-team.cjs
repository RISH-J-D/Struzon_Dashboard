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
  await client.connect();
  console.log('Connected to DB');

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
    )
  `);

  await client.query('ALTER TABLE team_members ENABLE ROW LEVEL SECURITY');
  await client.query('DROP POLICY IF EXISTS "Public Read" ON team_members');
  await client.query('CREATE POLICY "Public Read" ON team_members FOR SELECT USING (true)');
  await client.query('DROP POLICY IF EXISTS "Admin All" ON team_members');
  await client.query('CREATE POLICY "Admin All" ON team_members FOR ALL USING (true) WITH CHECK (true)');

  const members = [
    {
      name: 'Rajadurai',
      role: 'CEO',
      email: 'rajadurai@struzon.com',
      linkedin: 'https://www.linkedin.com/in/rajadurai-nallasamy-253543133/',
      image_url: 'https://lkagqmvqpvqixgvqchpr.supabase.co/storage/v1/object/public/site_media/team/rajadurai.png',
      bio: [
        'A visionary by nature and passionate about structures, Rajadurai has 15+ years experience in construction industries with a specialization in steel detailing.',
        'His undergraduate degree in engineering is from Anna University and he also has a Master’s degree in Business Management. He is NPCIL-trained in weld techniques and is NDT qualified, which plays a vital and dynamic role in his career, along with his profound knowledge on the steel fabrication and erection process.',
        'His organizational focus is about developing and expanding Struzon’s strong presence in the international business field.',
        'Rajadurai is a passionate leader, bringing a wealth of engineering, business, and management expertise to the Struzon team by successfully delivering projects on-time & on-budget across a wide range of sectors, and constantly earning the respect of our major clients.'
      ]
    },
    {
      name: 'Balasaravana',
      role: 'President',
      email: 'balasaravana@struzon.com',
      linkedin: 'https://www.linkedin.com/in/balasaravana-kumar-t-826248172/',
      image_url: 'https://lkagqmvqpvqixgvqchpr.supabase.co/storage/v1/object/public/site_media/team/balasaravana.png',
      bio: [
        'Balasaravana is a recognized expert with more than 15+ years of experience centered around Steel Detailing, Engineering, Business Management, Technology, and Digital Project Delivery, along with being a Mechanical Engineer with an honors B.E. from Anna University.',
        'His vast experience, ability to meet and exceed his steadily increasing responsibilities, and client-centric viewpoint have made him the right person to lead engineering at Struzon and achieve our goals of technical excellence across multiple engineering skills and disciplines.',
        'He has a solid understanding of the entire steel detailing field, including administration, business strategy, and project management, which enables him to communicate effectively with clients across all aspects of the projects and offer the most cost-effective solutions tailored to the client’s specific requirements.'
      ]
    },
    {
      name: 'Saravanan',
      role: 'COO',
      email: 'saravanan@struzon.com',
      linkedin: 'https://www.linkedin.com/in/saravanan-soundara-rajan-206a7a67/',
      image_url: 'https://lkagqmvqpvqixgvqchpr.supabase.co/storage/v1/object/public/site_media/team/saravanan.png',
      bio: [
        'An entrepreneur and emerging business leader with 15+ years of progressive experience in the structural steel detailing industry, Saravanan is the visionary behind the company’s strategies and operations.',
        'Saravanan is excellent at analyzing team strengths and leveraging individual employee traits to reach business goals efficiently.',
        'His dedication to helping employees improve their skills and techniques is the secret that allows him to engage employees in order to reach company objectives and ensure client satisfaction.',
        'His engineering background was strengthened with a Bachelor’s Degree from IGNOU and strongly developed by the PSG Tech Institution. Additionally, he has gained NDT skills, QA/QC, and extensive fabrication knowledge from his work in the Oil and Gas Machinery Manufacturing Sectors.'
      ]
    },
    {
      name: 'Anand',
      role: 'Vice President-Business Development',
      email: 'anand@struzon.com',
      linkedin: 'https://www.linkedin.com/in/anand-m-s-671390154/',
      image_url: 'https://lkagqmvqpvqixgvqchpr.supabase.co/storage/v1/object/public/site_media/team/anand.png',
      bio: [
        'Bringing over 16 years of diverse experience from the construction and IT fields, along with excellent socialization skills and charisma, Anand specializes in establishing a personal connection with clients.',
        'He completed his CS graduation in 2004 at Bharathiyar University and then enhanced his career by joining hands with Struzon.',
        'Anand’s functional objectives are to achieve the optimum utilization of the engineering team’s production capacity, as well as grow the company\'s global client base. Anand is a people-oriented person who shares an excellent chemistry with all.',
        'His core focus is on sustainable business practices, and he has been very successful in establishing long-term relationships with key account clients.'
      ]
    },
    {
      name: 'Alan (P.E)',
      role: 'Vice President - USA Operations',
      email: 'alan@struzon.com',
      linkedin: 'https://www.linkedin.com/in/alan-bagatourian-pe-29391059/',
      image_url: 'https://lkagqmvqpvqixgvqchpr.supabase.co/storage/v1/object/public/site_media/team/alan.png',
      bio: [
        'A California-Licensed Professional Civil Engineer with over 10 years of experience in the field, including owning his Structural Engineering company and co-owning a Commercial Steel Fabrication and Erection company, Alan is the perfect fit to run the US operations of Struzon.',
        'As the VP of US operations, Alan is the initial point of contact with US Clients, discussing client\'s ideas and visions; consolidating them into practical solutions; and bringing them to reality.',
        'Along with his expertise in Civil Engineering, gained his Bachelor’s in Civil Engineering (Cal-Poly Pomona); his Master’s in Structural Engineering (USC); and his California Professional Civil Engineer License (State of CA), Alan also brings his multiple years of practical experience in the shop, field, and running his businesses to facilitate efficient and cost-effective solutions that work in the real world.',
        'His diverse areas of professional expertise and ability to bring people to work together to reach a common goal efficiently and successfully are his strongest assets to both Sturzon and the clients.'
      ]
    }
  ];

  for (const [i, m] of members.entries()) {
    await client.query(
      'INSERT INTO team_members (name, role, email, linkedin, image_url, bio, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, linkedin = EXCLUDED.linkedin, image_url = EXCLUDED.image_url, bio = EXCLUDED.bio, sort_order = EXCLUDED.sort_order',
      [m.name, m.role, m.email, m.linkedin, m.image_url, JSON.stringify(m.bio), i]
    );
  }

  await client.query(`
    INSERT INTO site_content (key, value, page, type) 
    VALUES ('team_cta_title', $1, 'Team', 'text'),
           ('team_cta_subtitle', $2, 'Team', 'textarea')
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `, [JSON.stringify('Want to work with our experts?'), JSON.stringify("Our leadership team ensures every project meets Struzon's high standards of accuracy and efficiency.")]);

  console.log('Setup complete');
  await client.end();
}

setup().catch(console.error);
