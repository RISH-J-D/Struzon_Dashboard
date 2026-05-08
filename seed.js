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

const vacancies = [
  { title: "Sr.Checker/TL", type: "Full-time", location: "Remote", experience: "4-12 years", status: "Open", spots: 5 },
  { title: "Checker", type: "Full-time", location: "Remote", experience: "1-5 years", status: "Open", spots: 5 },
  { title: "Modeler", type: "Full-time", location: "Remote", experience: "2-7 years", status: "Open", spots: 3 },
  { title: "Estimator", type: "Full-time", location: "Remote", experience: "Varies", status: "Closed", spots: 0 },
  { title: "Draftsman", type: "Full-time", location: "Remote", experience: "Varies", status: "Open", spots: 7 },
  { title: "Front Office Executive", type: "Full-time", location: "Remote", experience: "Varies", status: "Open", spots: 1 }
];

async function seed() {
  await client.connect();
  console.log('Connected');
  
  // Clear existing
  await client.query('DELETE FROM vacancies;');
  
  for (const v of vacancies) {
    await client.query(
      'INSERT INTO vacancies (title, type, location, experience, status, spots) VALUES ($1, $2, $3, $4, $5, $6)',
      [v.title, v.type, v.location, v.experience, v.status, v.spots]
    );
  }
  
  console.log('Vacancies seeded');
  await client.end();
}

seed();
