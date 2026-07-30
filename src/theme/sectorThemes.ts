// src/theme/sectorThemes.ts

export interface FeatureCardData {
  title: string;
  sub: string;
  color: string;
  icon: string;
}

export interface ModuleBoxData {
  title: string;
  icon: string;
  color: string;
  desc: string;
}

export interface EventData {
  dateNum: string;
  dateMon: string;
  title: string;
  sub: string;
}

export interface SectorTheme {
  name: string;
  primary: string;
 secondary: string;
  gradientDark: [string, string];
  gradientLight: [string, string];
  welcomeTitle: string;
  welcomeSub: string;
  statusText: string;
  matchedPerc: string;
  features: FeatureCardData[];
  modules: ModuleBoxData[];
  events: EventData[];
}

export const SECTOR_THEMES: Record<string, SectorTheme> = {
  ENGINEERING: {
    name: 'Engineering',
    primary: '#00F0FF', // Cyan
    secondary: '#FF4D00', // Orange
    gradientDark: ['#040D1A', '#02050A'],
    gradientLight: ['#F0F8FF', '#E6EEF8'],
    welcomeTitle: 'Engineering Command',
    welcomeSub: 'Welcome to the Engineering Hub, Architect!',
    statusText: 'TECH READY',
    matchedPerc: '88%',
    features: [
      { title: 'Global STEM 2026', sub: 'Open for Juniors', color: '#FF4D00', icon: 'star' },
      { title: 'L&T Technical Apprentice', sub: 'New Openings', color: '#00F0FF', icon: 'briefcase' },
      { title: 'CAD Modeling Challenge', sub: 'Win prizes', color: '#AF52DE', icon: 'construct' },
      { title: 'GATE Preparation Kit', sub: 'Free Mock Tests', color: '#FFD700', icon: 'school' }
    ],
    modules: [
      { title: 'Lab Simulators', icon: 'hardware-chip', color: '#00F0FF', desc: 'Virtual circuit & mechanical testing labs' },
      { title: 'Formula Student', icon: 'car-sport', color: '#FF4D00', desc: 'Join international racing design clubs' },
      { title: 'CAD Workspace', icon: 'cube', color: '#AF52DE', desc: '3D printing and styling playground' },
      { title: 'Core Patents', icon: 'ribbon', color: '#FFD700', desc: 'Browse latest industrial standards' }
    ],
    events: [
      { dateNum: '12', dateMon: 'AUG', title: 'Robotics Design Hackathon', sub: 'Build autonomous warehouse bots' },
      { dateNum: '25', dateMon: 'AUG', title: 'Civil Infra Summit 2026', sub: 'Smart cities construction panel' }
    ]
  },
  'MERCHANT NAVY': {
    name: 'Merchant Navy',
    primary: '#0077FF', // Blue
    secondary: '#38EF7D', // Seafoam Green
    gradientDark: ['#020A1A', '#01030B'],
    gradientLight: ['#EBF4FA', '#D9E8F3'],
    welcomeTitle: 'Maritime Fleet Deck',
    welcomeSub: 'Welcome to the Bridge, Future Officer!',
    statusText: 'FIT FOR SEA',
    matchedPerc: '95%',
    features: [
      { title: 'DG Shipping Exam Prep', sub: 'All India Online Prep', color: '#0077FF', icon: 'journal' },
      { title: 'Maersk Cadet Program', sub: 'Sponsorship Open', color: '#38EF7D', icon: 'boat' },
      { title: 'STCW Basic Safety', sub: 'Mandatory Certifications', color: '#AF52DE', icon: 'shield-checkmark' },
      { title: 'CDC Application Guide', sub: 'Get Seaman Book', color: '#FFD700', icon: 'document-text' }
    ],
    modules: [
      { title: 'Chart Navigation', icon: 'compass', color: '#0077FF', desc: 'Celestial watch and radar plot exercises' },
      { title: 'Engine Operations', icon: 'build', color: '#38EF7D', desc: 'Auxiliary plant and main generator status' },
      { title: 'STCW Training', icon: 'shield-half', color: '#AF52DE', desc: 'Firefighting and sea survival walkthroughs' },
      { title: 'Port Information', icon: 'earth', color: '#FFD700', desc: 'International maritime borders & customs' }
    ],
    events: [
      { dateNum: '05', dateMon: 'SEP', title: 'IMU-CET Strategy Webinar', sub: 'Clear entrance exam with top ranks' },
      { dateNum: '19', dateMon: 'SEP', title: 'Anglo-Eastern Sponsorship Interview', sub: 'Online screening for new cohort' }
    ]
  },
  COMPUTERS: {
    name: 'Computers',
    primary: '#00FF88', // Green
    secondary: '#00F0FF', // Cyan
    gradientDark: ['#020A05', '#000000'],
    gradientLight: ['#EDFBF3', '#DEF5E5'],
    welcomeTitle: 'Silicon Command Center',
    welcomeSub: 'Welcome to the Mainframe, Software Dev!',
    statusText: 'COMPILE SUCCESS',
    matchedPerc: '92%',
    features: [
      { title: 'Google Hash Code', sub: 'Register Now', color: '#00FF88', icon: 'logo-google' },
      { title: 'Vite React Native', sub: 'Learn App Dev', color: '#00F0FF', icon: 'phone-portrait' },
      { title: 'Open Source Quest', sub: '20+ Active Projects', color: '#AF52DE', icon: 'git-branch' },
      { title: 'AI Hackathon 2026', sub: 'Win GPU Credits', color: '#FFD700', icon: 'hardware-chip' }
    ],
    modules: [
      { title: 'Code Sandbox', icon: 'code-slash', color: '#00FF88', desc: 'Write and compile algorithms instantly' },
      { title: 'API Terminal', icon: 'terminal', color: '#00F0FF', desc: 'Test mock endpoints and server responses' },
      { title: 'Database Visualizer', icon: 'server', color: '#AF52DE', desc: 'Design tables, relationships, and queries' },
      { title: 'Git Dashboard', icon: 'git-compare', color: '#FFD700', desc: 'Track repository stats and commits' }
    ],
    events: [
      { dateNum: '10', dateMon: 'AUG', title: 'AWS Cloud Architecture', sub: 'Scaling microservices to millions' },
      { dateNum: '22', dateMon: 'AUG', title: 'Rust Systems Programming', sub: 'High-speed memory safe code' }
    ]
  },
  'MEDICAL SUPPORT': {
    name: 'Medical Support',
    primary: '#FF0055', // Magenta
    secondary: '#00E5FF', // Aqua
    gradientDark: ['#1A020B', '#0A0105'],
    gradientLight: ['#FFF0F5', '#FFE0EA'],
    welcomeTitle: 'Care & Diagnostics',
    welcomeSub: 'Welcome to the Medical Wing, Caregiver!',
    statusText: 'CLINICAL READY',
    matchedPerc: '90%',
    features: [
      { title: 'Nursing Excellence 2026', sub: 'AIIMS Openings', color: '#FF0055', icon: 'heart' },
      { title: 'Red Cross First Aid', sub: 'Free Certification', color: '#00E5FF', icon: 'medkit' },
      { title: 'Lab Tech Internship', sub: 'Apollo Diagnostics', color: '#AF52DE', icon: 'flask' },
      { title: 'WHO Global Seminar', sub: 'E-health Protocols', color: '#FFD700', icon: 'globe' }
    ],
    modules: [
      { title: 'Anatomy Lab', icon: 'body', color: '#FF0055', desc: 'Interactive 3D skeletal & muscular systems' },
      { title: 'Dosage Calc', icon: 'calculator', color: '#00E5FF', desc: 'Verify medical fluid concentrations' },
      { title: 'First Aid Manual', icon: 'book', color: '#AF52DE', desc: 'CPR and shock management quick reference' },
      { title: 'Diagnostic Aids', icon: 'pulse', color: '#FFD700', desc: 'Pulse oximetry and ECG pattern tutorials' }
    ],
    events: [
      { dateNum: '15', dateMon: 'AUG', title: 'Cardiopulmonary Workshop', sub: 'Live simulation of airway management' },
      { dateNum: '30', dateMon: 'AUG', title: 'Radiology Trends 2026', sub: 'Modern MRI and CT scan technologies' }
    ]
  },
  'SKILLED TRADES': {
    name: 'Skilled Trades',
    primary: '#FFAA00', // Warning Orange
    secondary: '#E5E7EB', // Steel Gray
    gradientDark: ['#100A02', '#050301'],
    gradientLight: ['#FFF8EB', '#FFF0D4'],
    welcomeTitle: 'Industrial Workshop',
    welcomeSub: 'Welcome to the Shop Floor, Craftsman!',
    statusText: 'SAFETY PASSED',
    matchedPerc: '85%',
    features: [
      { title: 'Apprenticeship Scheme', sub: 'Under NAPS Scheme', color: '#FFAA00', icon: 'construct' },
      { title: 'Railways Trade Vacancies', sub: '12k Open Posts', color: '#9CA3AF', icon: 'train' },
      { title: 'Welding Championship', sub: 'State Skill India', color: '#AF52DE', icon: 'flame' },
      { title: 'OSHA Safety Guide', sub: 'Industrial Handbook', color: '#FFD700', icon: 'shield-alert' }
    ],
    modules: [
      { title: 'Tool Encyclopedia', icon: 'build', color: '#FFAA00', desc: 'Proper usage of micrometers, lathes & drills' },
      { title: 'Wiring Schematics', icon: 'flash', color: '#9CA3AF', desc: 'Industrial panels & domestic wiring plans' },
      { title: 'Metal Fabrication', icon: 'hammer', color: '#AF52DE', desc: 'Arc welding joint specifications' },
      { title: 'Safety Gear Check', icon: 'checkmark-circle', color: '#FFD700', desc: 'PPEs and high-voltage insulating standards' }
    ],
    events: [
      { dateNum: '08', dateMon: 'AUG', title: 'CNC Programming Demo', sub: 'Creating precision G-code operations' },
      { dateNum: '20', dateMon: 'AUG', title: 'Power Grid Safety Fair', sub: 'High voltage substation inspections' }
    ]
  },
  HOSPITALITY: {
    name: 'Hospitality',
    primary: '#D4AF37', // Gold
    secondary: '#FFCC00', // Warm Yellow
    gradientDark: ['#140D02', '#0A0601'],
    gradientLight: ['#FFFDF6', '#FAF6E5'],
    welcomeTitle: 'Grand Palace Hub',
    welcomeSub: 'Welcome to Front Desk, Guest Specialist!',
    statusText: 'SERVICE FIRST',
    matchedPerc: '87%',
    features: [
      { title: 'Taj Management Program', sub: 'Trainee Applications', color: '#D4AF37', icon: 'business' },
      { title: 'Culinary Masterclass', sub: 'Led by Star Chefs', color: '#FFCC00', icon: 'restaurant' },
      { title: 'Event Planning Expo', sub: 'MICE Sector Guide', color: '#AF52DE', icon: 'party-popper' },
      { title: 'IHG Global Internships', sub: 'Apply Now', color: '#FFD700', icon: 'briefcase' }
    ],
    modules: [
      { title: 'Front Office Simulator', icon: 'desktop', color: '#D4AF37', desc: 'Guest booking and room allocation systems' },
      { title: 'F&B Operations', icon: 'wine', color: '#FFCC00', desc: 'Fine dining setup and table etiquettes' },
      { title: 'Menu Planner', icon: 'journal', color: '#AF52DE', desc: 'Recipe costing and kitchen brigade structure' },
      { title: 'Language Lab', icon: 'chatbubbles', color: '#FFD700', desc: 'Practice English and conversational foreign phrases' }
    ],
    events: [
      { dateNum: '14', dateMon: 'AUG', title: 'Luxury Wine & Dine Seminar', sub: 'F&B management standards' },
      { dateNum: '28', dateMon: 'AUG', title: 'Cruise Line Placements', sub: 'Interviewing with Royal Caribbean' }
    ]
  },
  'FASHION & DESIGN': {
    name: 'Fashion & Design',
    primary: '#FF00FF', // Magenta
    secondary: '#8A2BE2', // Violet
    gradientDark: ['#1A021A', '#0D010D'],
    gradientLight: ['#FFF0FF', '#FFE6FF'],
    welcomeTitle: 'Creative Atelier',
    welcomeSub: 'Welcome to the Studio, Designer!',
    statusText: 'STYLE READY',
    matchedPerc: '86%',
    features: [
      { title: 'NIFT Portfolio Prep', sub: 'Top Rank Guide', color: '#FF00FF', icon: 'color-palette' },
      { title: 'Fashion Week Internship', sub: 'Backstage Access', color: '#8A2BE2', icon: 'shirt' },
      { title: 'Sustainable Apparel Quest', sub: 'Eco Design Contest', color: '#AF52DE', icon: 'leaf' },
      { title: 'Digital Sketching Kit', sub: 'Free Procreate Brushes', color: '#FFD700', icon: 'brush' }
    ],
    modules: [
      { title: 'Pattern Maker', icon: 'scissors', color: '#FF00FF', desc: 'Draft blueprints for blouses, jackets, and trousers' },
      { title: 'Textile Library', icon: 'apps', color: '#8A2BE2', desc: 'Explore weave patterns, silk, cotton, and linen' },
      { title: 'Visual Board', icon: 'images', color: '#AF52DE', desc: 'Assemble seasonal palettes and styling details' },
      { title: 'Fashion History', icon: 'book', color: '#FFD700', desc: 'Timeline of international couture icons' }
    ],
    events: [
      { dateNum: '18', dateMon: 'AUG', title: 'Haute Couture Showcase', sub: 'Indian bridal styles presentation' },
      { dateNum: '29', dateMon: 'AUG', title: 'Eco-Weaving Interactive', sub: 'Weaving styles using organic yarn' }
    ]
  },
  MEDIA: {
    name: 'Media',
    primary: '#FF5E36', // Orange-Red
    secondary: '#FF008A', // Pink
    gradientDark: ['#1A0A02', '#0A0401'],
    gradientLight: ['#FFF3F0', '#FFE6E0'],
    welcomeTitle: 'Broadcast Studio',
    welcomeSub: 'Welcome to the Control Room, Producer!',
    statusText: 'ON AIR',
    matchedPerc: '89%',
    features: [
      { title: 'Netflix Creative Labs', sub: 'Writing Internships', color: '#FF5E36', icon: 'play' },
      { title: 'Podcast Academy 2026', sub: 'Audio Engineering', color: '#FF008A', icon: 'mic' },
      { title: 'Photography Contest', sub: 'Win DSLR Kits', color: '#AF52DE', icon: 'camera' },
      { title: 'Scriptwriting Boot', sub: 'Write a Short Film', color: '#FFD700', icon: 'create' }
    ],
    modules: [
      { title: 'Audio Mixer', icon: 'musical-notes', color: '#FF5E36', desc: 'Multi-track levels and noise reduction tools' },
      { title: 'Video Cutter', icon: 'videocam', color: '#FF008A', desc: 'Timeline editing, overlays, and transitions' },
      { title: 'Press Desk', icon: 'newspaper', color: '#AF52DE', desc: 'Copywriting headlines and fact-checking' },
      { title: 'Streaming Room', icon: 'tv', color: '#FFD700', desc: 'Manage encoding settings and bitrates' }
    ],
    events: [
      { dateNum: '11', dateMon: 'AUG', title: 'Documentary Film Forum', sub: 'Telling stories with zero budget' },
      { dateNum: '24', dateMon: 'AUG', title: 'Mobile Journalism Boot', sub: 'Shoot, edit, and broadcast from your phone' }
    ]
  },
  AGRICULTURE: {
    name: 'Agriculture',
    primary: '#88FF00', // Lime Green
    secondary: '#8B5A2B', // Brown
    gradientDark: ['#071402', '#030A01'],
    gradientLight: ['#F5FFF0', '#E5FAD7'],
    welcomeTitle: 'Agritech Farm',
    welcomeSub: 'Welcome to the Greenhouse, Agronomist!',
    statusText: 'GROWTH ACTIVE',
    matchedPerc: '84%',
    features: [
      { title: 'Organic Farm Incubation', sub: 'Govt Grants Open', color: '#88FF00', icon: 'leaf' },
      { title: 'Drip Irrigation Setup', sub: 'Water Conservation', color: '#8B5A2B', icon: 'water' },
      { title: 'IARI Soil Research', sub: 'Seed Quality Tests', color: '#AF52DE', icon: 'flask' },
      { title: 'Drone Farming Workshop', sub: 'Precision Spraying', color: '#FFD700', icon: 'airplane' }
    ],
    modules: [
      { title: 'Soil Analyzer', icon: 'barcode', color: '#88FF00', desc: 'Calculate NPK ratios and soil moisture thresholds' },
      { title: 'Crop Scheduler', icon: 'calendar', color: '#8B5A2B', desc: 'Optimize harvest times for wheat, paddy, & corn' },
      { title: 'Pest Control Hub', icon: 'bug', color: '#AF52DE', desc: 'Identify organic bio-pesticides and remedies' },
      { title: 'Agri-Business Pricing', icon: 'trending-up', color: '#FFD700', desc: 'Daily market rates and pricing strategies' }
    ],
    events: [
      { dateNum: '07', dateMon: 'AUG', title: 'Smart Greenhouse Webinar', sub: 'Hydroponics and vertical farming systems' },
      { dateNum: '21', dateMon: 'AUG', title: 'Organic Certification Info', sub: 'Get certified for export markets' }
    ]
  },
  'BEAUTY & WELLNESS': {
    name: 'Beauty & Wellness',
    primary: '#FF99AA', // Soft Pink
    secondary: '#E0B0FF', // Lavender
    gradientDark: ['#1A0C12', '#0D0609'],
    gradientLight: ['#FFF4F6', '#FFEBEF'],
    welcomeTitle: 'Wellness Sanctuary',
    welcomeSub: 'Welcome to the Spa Lounge, Esthetician!',
    statusText: 'GLOW READY',
    matchedPerc: '83%',
    features: [
      { title: 'Lakme Academy Program', sub: 'Advanced Hair Styling', color: '#FF99AA', icon: 'sparkles' },
      { title: 'Aromatherapy Cert', sub: 'Natural Oils Science', color: '#E0B0FF', icon: 'flower' },
      { title: 'Salon Management 101', sub: 'Client Retention Tips', color: '#AF52DE', icon: 'cut' },
      { title: 'Nutritional Care Guide', sub: 'Skin Glow Diets', color: '#FFD700', icon: 'nutrition' }
    ],
    modules: [
      { title: 'Color Matching', icon: 'color-palette', color: '#FF99AA', desc: 'Skin undertone analysis and makeup shades' },
      { title: 'Hair Therapy Lab', icon: 'cut', color: '#E0B0FF', desc: 'Scalp diagnostics and deep conditioning rules' },
      { title: 'Spa Anatomy', icon: 'body', color: '#AF52DE', desc: 'Pressure points for Swedish and Thai massage' },
      { title: 'Ingredient Check', icon: 'search', color: '#FFD700', desc: 'Identify parabens, sulfates, and toxic additives' }
    ],
    events: [
      { dateNum: '09', dateMon: 'AUG', title: 'Bridal Airbrush Artistry', sub: 'High-definition bridal makeup demo' },
      { dateNum: '23', dateMon: 'AUG', title: 'Wellness Center Startups', sub: 'Business licenses and shop setups' }
    ]
  },
  AUTOMOBILE: {
    name: 'Automobile',
    primary: '#FF1E27', // Red
    secondary: '#8888FF', // Blue-Gray
    gradientDark: ['#140203', '#0A0102'],
    gradientLight: ['#FFF0F0', '#FFE2E2'],
    welcomeTitle: 'Pit Lane Garage',
    welcomeSub: 'Welcome to the Assembly Line, Tuner!',
    statusText: 'IGNITION READY',
    matchedPerc: '86%',
    features: [
      { title: 'Formula E Dyno Lab', sub: 'EV Testing Protocols', color: '#FF1E27', icon: 'flash' },
      { title: 'Bosch Fuel Diagnostics', sub: 'CRDI Engine Study', color: '#8888FF', icon: 'construct' },
      { title: 'Car Styling Challenge', sub: 'CAD Aero Modelling', color: '#AF52DE', icon: 'trending-up' },
      { title: 'F1 Telemetry Course', sub: 'Analyze Live Race Data', color: '#FFD700', icon: 'speedometer' }
    ],
    modules: [
      { title: 'Engine Diagnostics', icon: 'speedometer', color: '#FF1E27', desc: 'Read diagnostic trouble codes (DTCs)' },
      { title: 'EV Battery Status', icon: 'battery-charging', color: '#8888FF', desc: 'Cell temperature, voltage, and health status' },
      { title: 'Gearbox Assembly', icon: 'settings', color: '#AF52DE', desc: 'Manual vs planetary automatic assemblies' },
      { title: 'Brake Tuning Lab', icon: 'disc', color: '#FFD700', desc: 'Hydraulic bleeding and rotor inspections' }
    ],
    events: [
      { dateNum: '13', dateMon: 'AUG', title: 'Hydrogen Combustion Engines', sub: 'Future of carbon-neutral transport' },
      { dateNum: '27', dateMon: 'AUG', title: 'Autobody Denting & Paint', sub: 'Practical panel restoration session' }
    ]
  },
  CONSTRUCTION: {
    name: 'Construction',
    primary: '#FF9F1C', // Orange
    secondary: '#FFE715', // Yellow
    gradientDark: ['#100B02', '#050301'],
    gradientLight: ['#FFF9F0', '#FFF3DE'],
    welcomeTitle: 'Scaffold Hub',
    welcomeSub: 'Welcome to the Site Office, Surveyor!',
    statusText: 'FOUNDATION OK',
    matchedPerc: '82%',
    features: [
      { title: 'Rebar Inspection 2026', sub: 'IS Code Guidelines', color: '#FF9F1C', icon: 'construct' },
      { title: 'Autodesk Civil Lab', sub: 'Drafting Foundations', color: '#FFE715', icon: 'create' },
      { title: 'Safety Supervisor Cert', sub: 'Free Safety Induction', color: '#AF52DE', icon: 'shield-checkmark' },
      { title: 'Estimating & Costing', sub: 'BIM Quantities Sheet', color: '#FFD700', icon: 'calculator' }
    ],
    modules: [
      { title: 'Concrete Mix design', icon: 'flask', color: '#FF9F1C', desc: 'Calculate cement, sand, and aggregate ratios' },
      { title: 'Survey Planner', icon: 'compass', color: '#FFE715', desc: 'Total station leveling and map plotting' },
      { title: 'BIM CAD View', icon: 'cube', color: '#AF52DE', desc: '3D structural view of columns & beam slabs' },
      { title: 'Labor Logbook', icon: 'people', color: '#FFD700', desc: 'Site attendance and daily wage management' }
    ],
    events: [
      { dateNum: '06', dateMon: 'AUG', title: 'Precast Concrete Methods', sub: 'Fast-track modular home construction' },
      { dateNum: '20', dateMon: 'AUG', title: 'Soil Compaction Testing', sub: 'Dynamic cone penetrometer session' }
    ]
  },
  ELECTRICAL: {
    name: 'Electrical',
    primary: '#FFEE00', // Yellow
    secondary: '#00FFFF', // Aqua
    gradientDark: ['#0A0A02', '#000000'],
    gradientLight: ['#FFFFF0', '#FFFFE0'],
    welcomeTitle: 'Substation Deck',
    welcomeSub: 'Welcome to the Generator Bay, Electrician!',
    statusText: 'GRID SYNCED',
    matchedPerc: '87%',
    features: [
      { title: 'ABB High Voltage Lab', sub: 'Arc Flash Safety', color: '#FFEE00', icon: 'flash' },
      { title: 'Solar Grid Inverters', sub: 'Design Green Energy', color: '#00FFFF', icon: 'sunny' },
      { title: 'Electrician AITT Prep', sub: 'Free Mock Exam', color: '#AF52DE', icon: 'school' },
      { title: 'PLC Automation Core', sub: 'Ladder Logic Basics', color: '#FFD700', icon: 'hardware-chip' }
    ],
    modules: [
      { title: 'Circuit Solver', icon: 'pulse', color: '#FFEE00', desc: 'Apply Ohm\'s & Kirchhoff\'s laws' },
      { title: 'Transformer Lab', icon: 'sync', color: '#00FFFF', desc: 'Turns ratio and insulation resistance tests' },
      { title: 'Wiring Blueprint', icon: 'document-text', color: '#AF52DE', desc: 'Residential distribution boards and 3-phase lines' },
      { title: 'Electrical Codes', icon: 'shield-alert', color: '#FFD700', desc: 'Indian Electricity Rules (1956) reference' }
    ],
    events: [
      { dateNum: '16', dateMon: 'AUG', title: 'Smart Meter Installations', sub: 'Configuring IoT grid transceivers' },
      { dateNum: '30', dateMon: 'AUG', title: 'Li-Ion Battery Storage', sub: 'Designing grid-scale solar batteries' }
    ]
  },
  'RETAIL & LOGISTICS': {
    name: 'Retail & Logistics',
    primary: '#3300FF', // Purple-Blue
    secondary: '#00FFFF', // Cyan
    gradientDark: ['#05021A', '#02010D'],
    gradientLight: ['#F2F0FF', '#E4E0FF'],
    welcomeTitle: 'Fulfillment Terminal',
    welcomeSub: 'Welcome to the Depot, Logistics Lead!',
    statusText: 'CARGO LOADED',
    matchedPerc: '83%',
    features: [
      { title: 'Amazon Warehouse Ops', sub: 'Supply Chain Interns', color: '#3300FF', icon: 'cube' },
      { title: 'Inventory Analytics', sub: 'Learn ABC Analysis', color: '#00FFFF', icon: 'bar-chart' },
      { title: 'FedEx Fleet Tracker', sub: 'Route Optimization', color: '#AF52DE', icon: 'airplane' },
      { title: 'Barcoding Systems', sub: 'RFID & QR Scanner Tech', color: '#FFD700', icon: 'barcode' }
    ],
    modules: [
      { title: 'Inventory Manager', icon: 'archive', color: '#3300FF', desc: 'Track stock ins, outs, and reorder levels' },
      { title: 'Freight Calculator', icon: 'calculator', color: '#00FFFF', desc: 'Volumetric weight and ocean freight pricing' },
      { title: 'Route Optimizer', icon: 'map', color: '#AF52DE', desc: 'Calculate shortest shipping paths' },
      { title: 'Customs Handbook', icon: 'globe', color: '#FFD700', desc: 'Harmonized System (HS) code classification reference' }
    ],
    events: [
      { dateNum: '17', dateMon: 'AUG', title: 'Cold Chain Shipping', sub: 'Logistics for vaccines & food storage' },
      { dateNum: '31', dateMon: 'AUG', title: 'E-Commerce Last Mile', sub: 'Drone delivery and routing innovations' }
    ]
  }
};
