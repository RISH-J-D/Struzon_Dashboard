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

const content = [
  // HOME
  { key: 'home_hero_title', page: 'Home', type: 'textarea', value: 'Precision\nStructural\nDetailing' },
  { key: 'home_hero_subtitle', page: 'Home', type: 'textarea', value: 'Delivering structural excellence with unparalleled accuracy. We are your trusted partner in high-precision structural steel detailing and engineering solutions.' },
  { key: 'home_mission_title', page: 'Home', type: 'text', value: 'Who We Are' },
  { key: 'home_mission_text', page: 'Home', type: 'textarea', value: 'We leverage industry-leading software, construction expertise and automated workflows to deliver superior results.' },
  { key: 'home_how_who_title', page: 'Home', type: 'text', value: 'How + Who' },
  { key: 'home_how_who_text', page: 'Home', type: 'textarea', value: 'We leverage industry-leading software, construction expertise and automated workflows to deliver superior results.' },
  { key: 'home_why_title', page: 'Home', type: 'text', value: 'Why' },
  { key: 'home_why_text', page: 'Home', type: 'textarea', value: 'We minimize risk and add value to every project.' },
  { key: 'home_about_title', page: 'Home', type: 'text', value: 'Who We Are' },
  { key: 'home_about_text_1', page: 'Home', type: 'textarea', value: 'Struzon, a trusted structural steel detailing/engineering service partner to the construction industry — market pioneers of engineering, design, and research.' },
  { key: 'home_about_text_2', page: 'Home', type: 'textarea', value: 'Our work integrates with steel detailing, connection design/stamping for structural, miscellaneous detailing, and BIM (Building Information Modeling) services. We help with the structure, expansion, alteration, and revamp of new and existing constructions.' },
  { key: 'home_about_text_3', page: 'Home', type: 'textarea', value: 'Our team of fully qualified engineers has a wealth of experience in all aspects of structural design, detailing, and steelwork fabrication requirements. With an ongoing commitment to invest in our staff, we are well positioned to detail every project.' },
  { key: 'home_about_text_4', page: 'Home', type: 'textarea', value: 'With our strong international presence in key sectors, Struzon drives the evolution of digital information modeling. Our brand is recognized as a global leader within the structural steel detailing industry.' },
  { key: 'home_about_text_5', page: 'Home', type: 'textarea', value: 'A diverse company with an outstanding reputation for detailing complex, time-sensitive projects while delivering superior quality and a cost-effective solution.' },
  { key: 'home_about_text_6', page: 'Home', type: 'textarea', value: 'We have been increasing current standards in the matter of transmission of impeccable building structures. Our simple, and very solid administrations have figured out how to win numerous hearts.' },
  { key: 'home_why_choose_title', page: 'Home', type: 'text', value: 'Why Choose Struzon' },
  { key: 'home_selected_work_title', page: 'Home', type: 'text', value: 'Selected Work' },
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
  { key: 'contact_address', page: 'Contact', type: 'textarea', value: '302, 3rd Floor, Shrishti Complex, Kothari Layout, Trichy Road, Coimbatore - 641005' },
  { key: 'contact_phone', page: 'Contact', type: 'text', value: '+91 90420 69557' },
  { key: 'contact_email', page: 'Contact', type: 'text', value: 'info@struzon.com' },

  // CAREERS
  { key: 'careers_hero_title', page: 'Careers', type: 'text', value: 'Build Your Future' },
  { key: 'careers_hero_subtitle', page: 'Careers', type: 'textarea', value: "Join a team of elite structural engineers and detailers. We don't just build structures; we build careers." },
  
  // SERVICES
  { key: 'services_hero_title', page: 'Services', type: 'text', value: 'Core Expertise' },
  { key: 'services_hero_subtitle', page: 'Services', type: 'textarea', value: 'From intricate connection design to large-scale structural detailing, we provide end-to-end engineering excellence.' },

  // TEAM
  { key: 'team_hero_title', page: 'Team', type: 'text', value: 'The Engineers' },
  { key: 'team_hero_subtitle', page: 'Team', type: 'textarea', value: 'Meet the experts driving precision and innovation at Struzon Technologies.' },

  // WORLD CLOCK
  { key: 'worldclock_hero_title', page: 'World Clock', type: 'text', value: 'Global Operations' },
  { key: 'worldclock_hero_subtitle', page: 'World Clock', type: 'textarea', value: 'Syncing precision across time zones. We operate 24/7 to meet global project deadlines.' },
];

async function seed() {
  try {
    await client.connect();
    console.log('Connected to DB');
    
    for (const item of content) {
      console.log(`Upserting: ${item.key}`);
      await client.query(
        'INSERT INTO site_content (key, value, page, type) VALUES ($1, $2, $3, $4) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, page = EXCLUDED.page, type = EXCLUDED.type',
        [item.key, JSON.stringify(item.value), item.page, item.type]
      );
    }
    
    console.log('Seeding finished.');
  } catch (err) {
    console.error('Error seeding content', err);
  } finally {
    await client.end();
  }
}

seed();
