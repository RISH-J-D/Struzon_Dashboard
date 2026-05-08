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
DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  tag text,
  details text,
  location text,
  engineer text,
  main_image text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE project_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view projects" ON projects;
DROP POLICY IF EXISTS "Public can view project_images" ON project_images;
DROP POLICY IF EXISTS "Admins can manage projects" ON projects;
DROP POLICY IF EXISTS "Admins can manage project_images" ON project_images;

CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can view project_images" ON project_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage project_images" ON project_images FOR ALL USING (auth.role() = 'authenticated');
`;

const projectList = [
  {
    id: 1,
    img: "https://struzon.com/wp-content/uploads/2023/07/MAIN-1.jpg",
    title: "INSPIRE HOLLYWOOD",
    tag: "Modern Development",
    details: "Located in California, this completed project features structural steel detailing for a modern development.",
    location: "California",
    engineer: "Struzon Team",
    gallery: [
      "https://struzon.com/wp-content/uploads/2021/06/1-1.jpg",
      "https://struzon.com/wp-content/uploads/2021/06/3-1.jpg",
      "https://struzon.com/wp-content/uploads/2021/06/4-1.jpg",
      "https://struzon.com/wp-content/uploads/2021/06/MAIN-1.jpg"
    ]
  },
  {
    id: 2,
    img: "https://struzon.com/wp-content/uploads/2021/09/2753-Hampden-Court-Chicago.jpg",
    title: "2753 HAMPDEN COURT",
    tag: "Residential",
    details: "A completed project involving high-precision structural steel detailing located in Chicago.",
    location: "Chicago",
    engineer: "Struzon Team",
    gallery: []
  },
  {
    id: 3,
    img: "https://struzon.com/wp-content/uploads/2023/07/M-4.jpg",
    title: "LEGACY HISTORY DOME",
    tag: "Institutional",
    details: "The Morris Cerullo Legacy History Dome in California features a complex dome structure requiring intricate detailing.",
    location: "California",
    engineer: "Struzon Team",
    gallery: [
      "https://struzon.com/wp-content/uploads/2021/05/M-1.jpg",
      "https://struzon.com/wp-content/uploads/2021/05/M-2.jpg",
      "https://struzon.com/wp-content/uploads/2021/05/M-3.jpg",
      "https://struzon.com/wp-content/uploads/2021/05/M-4.jpg"
    ]
  },
  {
    id: 4,
    img: "https://struzon.com/wp-content/uploads/2023/07/P-3.jpg",
    title: "PISCATAWAY WWTP",
    tag: "Industrial",
    details: "A Waste Water Treatment Plant project located in Maryland, showcasing our expertise in industrial steel detailing.",
    location: "Maryland",
    engineer: "Struzon Team",
    gallery: [
      "https://struzon.com/wp-content/uploads/2021/05/P-3.jpg",
      "https://struzon.com/wp-content/uploads/2021/09/P-1.jpg",
      "https://struzon.com/wp-content/uploads/2021/05/P-2.jpg",
      "https://struzon.com/wp-content/uploads/2021/09/p-4.jpg"
    ]
  },
  {
    id: 5,
    img: "https://struzon.com/wp-content/uploads/2021/09/Steppenwolf-Theatre-Chicago.jpg",
    title: "STEPPENWOLF THEATRE",
    tag: "Institutional",
    details: "A theatrical structure project located in Chicago, involving complex geometric steel connections.",
    location: "Chicago",
    engineer: "Struzon Team",
    gallery: []
  },
  {
    id: 6,
    img: "https://struzon.com/wp-content/uploads/2023/07/C-3s.jpg",
    title: "CANADIAN TIRE EMERALD HILLS",
    tag: "Commercial",
    details: "A large-scale retail structure project located in Alberta, emphasizing fabrication efficiency and structural integrity.",
    location: "Alberta",
    engineer: "Struzon Team",
    gallery: [
      "https://struzon.com/wp-content/uploads/2021/05/C-3.jpg",
      "https://struzon.com/wp-content/uploads/2021/05/C-1.jpg",
      "https://struzon.com/wp-content/uploads/2021/05/C-2.jpg",
      "https://struzon.com/wp-content/uploads/2021/05/C-4.jpg"
    ]
  },
  {
    id: 7,
    img: "https://struzon.com/wp-content/uploads/2023/07/MAIN-2.jpg",
    title: "HOUSE OF PIES",
    tag: "Commercial",
    details: "A commercial project located in California, featuring architecturally exposed structural steel.",
    location: "California",
    engineer: "Struzon Team",
    gallery: [
      "https://struzon.com/wp-content/uploads/2021/06/1-2.jpg",
      "https://struzon.com/wp-content/uploads/2021/06/4-2.jpg",
      "https://struzon.com/wp-content/uploads/2021/06/2-2.jpg",
      "https://struzon.com/wp-content/uploads/2021/06/3-2.jpg"
    ]
  },
  {
    id: 8,
    img: "https://struzon.com/wp-content/uploads/2023/07/L-2.jpg",
    title: "LGA PEDESTRIAN BRIDGE",
    tag: "Infrastructure",
    details: "Miscellaneous steel detailing for the LaGuardia Pedestrian Bridge in New York.",
    location: "New York",
    engineer: "Struzon Team",
    gallery: [
      "https://struzon.com/wp-content/uploads/2021/05/L-1.jpg",
      "https://struzon.com/wp-content/uploads/2021/05/L-2.jpg",
      "https://struzon.com/wp-content/uploads/2021/05/L-3.jpg",
      "https://struzon.com/wp-content/uploads/2021/09/L-4.jpg"
    ]
  },
  {
    id: 9,
    img: "https://struzon.com/wp-content/uploads/2023/07/MAIN-3.jpg",
    title: "ROYAL INLAND HOSPITAL",
    tag: "Institutional",
    details: "A healthcare facility project located in British Columbia, requiring precise medical-grade structural detailing.",
    location: "British Columbia",
    engineer: "Struzon Team",
    gallery: [
      "https://struzon.com/wp-content/uploads/2021/06/1-3.jpg",
      "https://struzon.com/wp-content/uploads/2021/06/MAIN-3.jpg"
    ]
  },
  {
    id: 10,
    img: "https://struzon.com/wp-content/uploads/2023/07/MAIN.jpg",
    title: "AVALON BREA PLACE",
    tag: "Residential",
    details: "A residential/commercial development located in California, featuring modern steel framing.",
    location: "California",
    engineer: "Struzon Team",
    gallery: [
      "https://struzon.com/wp-content/uploads/2021/06/1.jpg",
      "https://struzon.com/wp-content/uploads/2021/06/2.jpg",
      "https://struzon.com/wp-content/uploads/2021/06/3.jpg",
      "https://struzon.com/wp-content/uploads/2021/06/4.jpg"
    ]
  }
];

async function setup() {
  try {
    await client.connect();
    console.log('Connected to DB');
    await client.query(sql);
    console.log('Projects tables created successfully');

    // Seed
    for (const p of projectList) {
      console.log(`Seeding project: ${p.title}`);
      const res = await client.query(
        'INSERT INTO projects (title, tag, details, location, engineer, main_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [p.title, p.tag, p.details, p.location, p.engineer, p.img]
      );
      const projectId = res.rows[0].id;

      for (const img of p.gallery) {
        await client.query(
          'INSERT INTO project_images (project_id, image_url) VALUES ($1, $2)',
          [projectId, img]
        );
      }
    }
    console.log('Seeding finished.');
  } catch (err) {
    console.error('Error creating projects tables', err);
  } finally {
    await client.end();
  }
}

setup();

