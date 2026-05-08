import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const vacancies = [
  { title: "Sr.Checker/TL", type: "Full-time", location: "Remote", experience: "4-12 years", status: "Open", spots: 5 },
  { title: "Checker", type: "Full-time", location: "Remote", experience: "1-5 years", status: "Open", spots: 5 },
  { title: "Modeler", type: "Full-time", location: "Remote", experience: "2-7 years", status: "Open", spots: 3 },
  { title: "Estimator", type: "Full-time", location: "Remote", experience: "Varies", status: "Closed", spots: 0 },
  { title: "Draftsman", type: "Full-time", location: "Remote", experience: "Varies", status: "Open", spots: 7 },
  { title: "Front Office Executive", type: "Full-time", location: "Remote", experience: "Varies", status: "Open", spots: 1 }
];

async function seed() {
  console.log('Seeding vacancies...');
  
  // Delete existing
  const { error: deleteError } = await supabase
    .from('vacancies')
    .delete()
    .neq('title', ''); // Delete all
    
  if (deleteError) {
    console.error('Error clearing vacancies:', deleteError.message);
  }

  const { error } = await supabase
    .from('vacancies')
    .insert(vacancies);
    
  if (error) {
    console.error('Error seeding vacancies:', error.message);
  } else {
    console.log('Vacancies seeded successfully');
  }
}

seed();
