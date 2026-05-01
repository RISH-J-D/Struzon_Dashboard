import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

async function seed() {
  // We need public insert for this script to work with anon key if RLS is on.
  // But wait, I didn't enable public insert in setup-projects.js for projects table.
  // I should have. Let me fix that if it fails.
  
  for (const p of projectList) {
    console.log(`Seeding project: ${p.title}`);
    const { data, error } = await supabase.from('projects').insert([
      {
        title: p.title,
        tag: p.tag,
        details: p.details,
        location: p.location,
        engineer: p.engineer,
        main_image: p.img
      }
    ]).select();

    if (error) {
      console.error(`Error seeding project ${p.title}:`, error.message);
      continue;
    }

    const projectId = data[0].id;

    if (p.gallery && p.gallery.length > 0) {
      const images = p.gallery.map(img => ({
        project_id: projectId,
        image_url: img
      }));
      const { error: imgError } = await supabase.from('project_images').insert(images);
      if (imgError) {
        console.error(`Error seeding images for project ${p.title}:`, imgError.message);
      }
    }
  }
  console.log('Seeding finished.');
}

seed();
