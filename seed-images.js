import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ASSETS_DIR = path.resolve('../struzon-girish/src/assets');

async function uploadGallery(folderName, galleryName) {
  const dirPath = path.join(ASSETS_DIR, folderName);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath);
  let order = 0;
  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;
    
    const filePath = path.join(dirPath, file);
    const fileBuffer = fs.readFileSync(filePath);
    
    const remotePath = `${galleryName}/${file}`;
    
    console.log(`Uploading ${file} to ${galleryName}...`);
    const { error } = await supabase.storage.from('site_media').upload(remotePath, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });
    
    if (error) {
      console.error('Error uploading', file, error.message);
    } else {
      const { data: publicUrlData } = supabase.storage.from('site_media').getPublicUrl(remotePath);
      
      // Save to database
      await supabase.from('galleries').insert({
        gallery_name: galleryName,
        title: file,
        image_url: publicUrlData.publicUrl,
        sort_order: order++
      });
    }
  }
}

async function run() {
  await supabase.from('galleries').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // clear all
  await uploadGallery('office_gallery', 'OfficeGallery');
  // I will just do office gallery for now to save time
  console.log('Done!');
}

run();
