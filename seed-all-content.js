import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const content = [
  // HOME
  { key: 'home_hero_title', page: 'Home', type: 'textarea', value: 'Precision\nStructural\nDetailing' },
  { key: 'home_hero_subtitle', page: 'Home', type: 'textarea', value: 'Delivering structural excellence with unparalleled accuracy. We are your trusted partner in high-precision structural steel detailing and engineering solutions.' },
  { key: 'home_mission_title', page: 'Home', type: 'text', value: 'Who We Are' },
  { key: 'home_mission_text', page: 'Home', type: 'textarea', value: 'We leverage industry-leading software, construction expertise and automated workflows to deliver superior results.' },
  { key: 'home_about_title', page: 'Home', type: 'text', value: 'Who We Are' },
  { key: 'home_about_text_1', page: 'Home', type: 'textarea', value: 'Struzon, a trusted structural steel detailing/engineering service partner to the construction industry — market pioneers of engineering, design, and research.' },
  { key: 'home_about_text_2', page: 'Home', type: 'textarea', value: 'Our work integrates with steel detailing, connection design/stamping for structural, miscellaneous detailing, and BIM (Building Information Modeling) services. We help with the structure, expansion, alteration, and revamp of new and existing constructions.' },
  { key: 'home_about_text_3', page: 'Home', type: 'textarea', value: 'Our team of fully qualified engineers has a wealth of experience in all aspects of structural design, detailing, and steelwork fabrication requirements. With an ongoing commitment to invest in our staff, we are well positioned to detail every project.' },
  { key: 'home_footer_cta_title', page: 'Home', type: 'textarea', value: 'Seeking a better\ndetailing solution?' },
  { key: 'home_footer_cta_subtitle', page: 'Home', type: 'textarea', value: 'Contact the experts at Struzon to explore how we can help you deliver your next project on schedule, with quality and absolute efficiency.' },

  // ABOUT
  { key: 'about_hero_title', page: 'About', type: 'text', value: 'Our Heritage' },
  { key: 'about_hero_subtitle', page: 'About', type: 'textarea', value: 'Precision engineered, globally delivered. Our journey from specialized detailing to a multidisciplinary engineering powerhouse.' },
  { key: 'about_who_title', page: 'About', type: 'textarea', value: 'Specialized Detailing\nExcellence' },
  { key: 'about_who_text_1', page: 'About', type: 'textarea', value: 'We are a team of highly qualified engineers and detailers specializing in Structural Steel Detailing, Connection Design, Piping Detailing, and Miscellaneous Steel Detailing, including stairs, ladders, and handrails. We also deliver expertise in specialty metal works such as aluminum and stainless steel, positioning us as a prominent service provider for clients across the US, Canada, and India.' },
  { key: 'about_who_text_2', page: 'About', type: 'textarea', value: 'We are driven by a commitment to excellence, consistently meeting and exceeding customer expectations. Our focus on delivering high-quality project outcomes, combined with fast turnaround times and exceptional accuracy, has made Struzon a trusted choice for fabricators and industry professionals.' },
  { key: 'about_who_text_3', page: 'About', type: 'textarea', value: 'Our strength lies in our ability to identify the core of any project challenge and provide practical, reliable solutions. We are committed to being a dependable partner in the construction industry by delivering accurate, timely, and cost-effective structural services. Simply put, we bring your steel structures to life—guided by our belief: “We build what you envision.”' },
  { key: 'about_success_title', page: 'About', type: 'text', value: 'Visualizing Success' },
  { key: 'about_gallery_title', page: 'About', type: 'text', value: 'Office Gallery' },
  { key: 'about_gallery_subtitle', page: 'About', type: 'textarea', value: 'Step inside our precision-driven workspace where structural visions come to life through advanced technology and engineering excellence.' },

  // CONTACT
  { key: 'contact_hero_title', page: 'Contact', type: 'text', value: "Let's Connect" },
  { key: 'contact_hero_subtitle', page: 'Contact', type: 'textarea', value: 'Have a project in mind? Our team is ready to provide high-precision structural detailing and engineering solutions.' },
  { key: 'contact_intro_text_1', page: 'Contact', type: 'textarea', value: 'Every enquiry is an opportunity to create value, and at Struzon, we approach it with the attention it deserves. Our team carefully evaluates each requirement to provide well-structured, competitive quotations that align with your project goals. We strongly believe that "a competitive quote will make our customer competitive among others."' },
  { key: 'contact_intro_text_2', page: 'Contact', type: 'textarea', value: 'Whether you are planning a new project, require detailing support, or are exploring our range of services, we are here to assist you at every step. Simply share your requirements through the contact form, and our team will respond with clarity, precision, and promptness.' },
  { key: 'contact_intro_text_3', page: 'Contact', type: 'textarea', value: 'For immediate assistance, feel free to connect with us directly. At Struzon, we are always ready to support your needs and build lasting partnerships through reliable service and professional excellence.' },
  { key: 'contact_email', page: 'Contact', type: 'text', value: 'info@struzon.com' },

  // CAREERS
  { key: 'careers_hero_title', page: 'Careers', type: 'text', value: 'Build Your Future' },
  { key: 'careers_hero_subtitle', page: 'Careers', type: 'textarea', value: "Join a team of elite structural engineers and detailers. We don't just build structures; we build careers." },
  { key: 'careers_intro_title', page: 'Careers', type: 'text', value: 'Our Current' },
  { key: 'careers_intro_subtitle', page: 'Careers', type: 'text', value: 'Openings' },
  { key: 'careers_intro_text', page: 'Careers', type: 'textarea', value: 'Join a team of elite engineers and detailers shaping the global infrastructure.' },
  
  // SERVICES
  { key: 'services_hero_title', page: 'Services', type: 'text', value: 'Core Expertise' },
  { key: 'services_hero_subtitle', page: 'Services', type: 'textarea', value: "Providing the technical backbone for North America's most ambitious structures through precision-driven steel detailing and BIM integration." },
  { key: 'services_cta_title', page: 'Services', type: 'text', value: 'Ready to start your next project?' },
  { key: 'services_cta_subtitle', page: 'Services', type: 'textarea', value: 'Send us your drawings — a senior engineer will respond within one business day with a comprehensive quote.' },

  // TEAM
  { key: 'team_hero_title', page: 'Team', type: 'text', value: 'The Visionaries' },
  { key: 'team_hero_subtitle', page: 'Team', type: 'textarea', value: "Meet the leadership team driving Struzon's global presence and engineering excellence." },
  { key: 'team_cta_title', page: 'Team', type: 'text', value: 'Want to work with our experts?' },
  { key: 'team_cta_subtitle', page: 'Team', type: 'textarea', value: "Our leadership team ensures every project meets Struzon's high standards of accuracy and efficiency." },

  // WORLD CLOCK
  { key: 'worldclock_hero_title', page: 'World Clock', type: 'text', value: 'Global Operations' },
  { key: 'worldclock_hero_subtitle', page: 'World Clock', type: 'textarea', value: 'Syncing precision across time zones. We operate 24/7 to meet global project deadlines.' },
];

async function seed() {
  console.log('Seeding site content...');
  for (const item of content) {
    console.log(`Upserting: ${item.key}`);
    const { error } = await supabase
      .from('site_content')
      .upsert({ 
        key: item.key, 
        value: item.value, 
        page: item.page, 
        type: item.type 
      });
    
    if (error) {
      console.error(`Error upserting ${item.key}:`, error.message);
    }
  }
  console.log('Seeding finished.');
}

seed();
