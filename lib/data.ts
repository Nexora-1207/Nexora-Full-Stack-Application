export interface College {
  id: string;
  name: string;
  shortName: string;
  sector: string;
  stream: 'MPC' | 'BiPC' | 'Polytechnic' | 'ITI';
  rating: number;
  location: string;
  matchRate: number;
  mission: string;
  perks: string[];
  requirements: string;
  description: string;
  established?: string;
  acceptanceRate?: string;
}

export interface Sector {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  secondaryColor: string;
  description: string;
  stats: string;
}

export const SECTORS: Sector[] = [
  {
    id: 'ENGINEERING',
    name: 'Engineering & Tech',
    category: 'STEM Core',
    icon: 'Cpu',
    color: '#00F0FF',
    secondaryColor: '#3B82F6',
    description: 'Robotics, Quantum Telemetry, AI Systems & Smart Grids',
    stats: '96% Placement Match'
  },
  {
    id: 'MEDICAL SUPPORT',
    name: 'Medical & Bio-Research',
    category: 'Healthcare',
    icon: 'HeartPulse',
    color: '#EC4899',
    secondaryColor: '#FF008A',
    description: 'Robotic Surgery, Bioinformatics & Clinical Diagnostics',
    stats: '89% Placement Match'
  },
  {
    id: 'COMPUTERS',
    name: 'Computer Science',
    category: 'Software',
    icon: 'Terminal',
    color: '#10B981',
    secondaryColor: '#059669',
    description: 'Full-Stack, Cloud Architecture & Decentralized Ledgers',
    stats: '95% Placement Match'
  },
  {
    id: 'SKILLED TRADES',
    name: 'Skilled Trades (ITI)',
    category: 'Vocational',
    icon: 'Wrench',
    color: '#F59E0B',
    secondaryColor: '#D97706',
    description: 'Precision CNC Machining, Electrical Grids & Fitting',
    stats: '92% Placement Match'
  },
  {
    id: 'MERCHANT NAVY',
    name: 'Merchant Navy',
    category: 'Maritime',
    icon: 'Anchor',
    color: '#06B6D4',
    secondaryColor: '#0284C7',
    description: 'Nautical Science, Marine Engineering & Cargo Logistics',
    stats: '88% Placement Match'
  },
  {
    id: 'FASHION & DESIGN',
    name: 'Fashion & Design',
    category: 'Creative',
    icon: 'Palette',
    color: '#A855F7',
    secondaryColor: '#9333EA',
    description: 'Biomorphic Wearables, Smart Fabrics & Industrial Styling',
    stats: '84% Placement Match'
  },
  {
    id: 'BUSINESS',
    name: 'Business & FinTech',
    category: 'Commerce',
    icon: 'TrendingUp',
    color: '#EAB308',
    secondaryColor: '#CA8A04',
    description: 'Algorithmic Trading, Venture Growth & Global Supply',
    stats: '91% Placement Match'
  },
  {
    id: 'MEDIA',
    name: 'Media & Communications',
    category: 'Creative',
    icon: 'Radio',
    color: '#F43F5E',
    secondaryColor: '#E11D48',
    description: 'Digital Broadcasting, Interactive XR & Journalism',
    stats: '82% Placement Match'
  },
  {
    id: 'HOSPITALITY',
    name: 'Hospitality & Tourism',
    category: 'Services',
    icon: 'Coffee',
    color: '#FB923C',
    secondaryColor: '#EA580C',
    description: 'Global Hotelier Operations, Aviation & Luxury Culinary',
    stats: '85% Placement Match'
  },
  {
    id: 'AGRICULTURE',
    name: 'Agri-Tech & Bio-Farming',
    category: 'Bio-Systems',
    icon: 'Sprout',
    color: '#84CC16',
    secondaryColor: '#65A30D',
    description: 'Hydroponics, Automated Drone Farming & Soil Science',
    stats: '87% Placement Match'
  },
  {
    id: 'AUTOMOBILE',
    name: 'Automobile & EV Tech',
    category: 'Mechanical',
    icon: 'Car',
    color: '#EF4444',
    secondaryColor: '#DC2626',
    description: 'Electric Vehicles, Powertrain Dynamics & Battery Storage',
    stats: '90% Placement Match'
  },
  {
    id: 'CONSTRUCTION',
    name: 'Construction & Civil',
    category: 'Infrastructure',
    icon: 'Building2',
    color: '#14B8A6',
    secondaryColor: '#0D9488',
    description: 'Smart Megastructures, Urban Planning & BIM Modeling',
    stats: '86% Placement Match'
  },
  {
    id: 'BEAUTY & WELLNESS',
    name: 'Beauty & Wellness',
    category: 'Wellness',
    icon: 'Sparkles',
    color: '#F472B6',
    secondaryColor: '#DB2777',
    description: 'Dermatological Therapeutics, Cosmetology & Holistic Health',
    stats: '80% Placement Match'
  },
  {
    id: 'RETAIL & LOGISTICS',
    name: 'Retail & Global Logistics',
    category: 'Supply Chain',
    icon: 'Truck',
    color: '#6366F1',
    secondaryColor: '#4F46E5',
    description: 'Automated Warehousing, Cold Chain & E-Commerce Nodes',
    stats: '89% Placement Match'
  }
];

export const MOCK_COLLEGES: College[] = [
  {
    id: 'narayana-mpc',
    name: 'Narayana Junior College (MPC Academic Block)',
    shortName: 'Narayana MPC',
    sector: 'ENGINEERING',
    stream: 'MPC',
    rating: 4.8,
    location: 'Hyderabad Tech Corridor',
    matchRate: 94,
    established: '1979',
    acceptanceRate: '28%',
    mission: 'High-intensity scientific foundation and JEE Advanced training.',
    perks: ['Direct IIT/NIT Coaching Sandbox', '100% Merit Fee Waiver for 95%+', 'AI-Driven Test Analysis'],
    requirements: 'Min 85% in Class 10 Board exam with Mathematics distinction',
    description: 'Renowned for rigorous Intermediate science preparation, Narayana MPC block equips students with superior analytical mathematics and physics problem-solving skills for premier engineering admissions.'
  },
  {
    id: 'chaitanya-bipc',
    name: 'Sri Chaitanya Pre-Medical Academy (BiPC)',
    shortName: 'Chaitanya BiPC',
    sector: 'MEDICAL SUPPORT',
    stream: 'BiPC',
    rating: 4.8,
    location: 'Vizag Bio-Hub',
    matchRate: 91,
    established: '1986',
    acceptanceRate: '22%',
    mission: 'Nurturing surgeons, clinical researchers, and biotech leaders.',
    perks: ['NEET High-Yield Simulation Lab', 'Top 100 Ranker Grant', 'Integrated Bio-Research Wing'],
    requirements: 'Min 88% in Class 10 Science & Mathematics',
    description: 'A structured Intermediate institution focusing on Biology, Physics, and Chemistry (BiPC) designed to navigate students into premier medical schools, AIIMS gates, and nanobiology labs.'
  },
  {
    id: 'govt-poly',
    name: 'Government Polytechnic Institute of Technology',
    shortName: 'Govt Polytechnic',
    sector: 'ENGINEERING',
    stream: 'Polytechnic',
    rating: 4.7,
    location: 'Bangalore Industrial Corridor',
    matchRate: 96,
    established: '1954',
    acceptanceRate: '35%',
    mission: 'Practical technical mastery, CNC tooling, and direct engineering lateral entry.',
    perks: ['100% Government Stipend Cover', 'Industrial Automation Lab', 'Direct Lateral Entry to 2nd Year B.Tech'],
    requirements: 'Class 10 Pass + State POLYCET Merit Rank',
    description: 'State premier technical institution offering 3-year diplomas in Computer Engineering, ECE, Mechanical, and Civil Engineering with guaranteed lateral entry into accredited B.Tech degree programs.'
  },
  {
    id: 'centauri-poly',
    name: 'Centauri Polytechnic & Software Academy',
    shortName: 'Centauri Poly',
    sector: 'COMPUTERS',
    stream: 'Polytechnic',
    rating: 4.9,
    location: 'Hyderabad Tech-Spur',
    matchRate: 95,
    established: '2012',
    acceptanceRate: '18%',
    mission: 'Developing self-healing compiler nets and kernel architecture.',
    perks: ['100% Developer Fellowship', 'High-Performance Grid Access', 'Web3 Global Accelerator Lab'],
    requirements: 'Class 10 or equivalent, POLYCET rank, Code Diagnostic Test',
    description: 'Centauri focuses on practical computing diplomas: low-level systems, kernel development, neural net architecture, and hardware-software integration, feeding directly into top-tier tech universities.'
  },
  {
    id: 'nit-lateral',
    name: 'Nexora Institute of Technology (NIT - Lateral Entry)',
    shortName: 'Nexora Tech',
    sector: 'ENGINEERING',
    stream: 'Polytechnic',
    rating: 4.9,
    location: 'Bangalore Cyber-Nexus',
    matchRate: 98,
    established: '2020',
    acceptanceRate: '12%',
    mission: 'Designing next-generation orbital telemetry & autonomous neural robotics.',
    perks: ['Elite Lateral Fellowship (100% Tuition)', 'Interactive Neural AI Sandbox', 'Direct ISRO/SpaceX Placement'],
    requirements: 'Diploma in Engineering with min 70% aggregate marks',
    description: 'The flagship university hub of Nexora. NIT provides a direct 2nd-year lateral entry gateway for Polytechnic diploma graduates into cutting-edge Computer, Electronics, and Mechanical branches.'
  },
  {
    id: 'apex-iti',
    name: 'Apex Industrial Training Institute (ITI Trades)',
    shortName: 'Apex ITI',
    sector: 'SKILLED TRADES',
    stream: 'ITI',
    rating: 4.6,
    location: 'Chennai Industrial Cluster',
    matchRate: 88,
    established: '1998',
    acceptanceRate: '45%',
    mission: 'Mastering mechanical automation, CNC tooling, and electric smart grids.',
    perks: ['Industry-Ready Stipend (100% Paid)', 'Advanced CNC Tooling Lab', 'Global Industrial Trade Certification'],
    requirements: 'Class 10 Pass, Manual Agility Test',
    description: 'Providing vocational expertise in industrial electrician trades, precision fitting, and CNC lathe machining with direct placement contracts into automotive and aerospace assembly lines.'
  }
];

export const INITIAL_EVENTS = [
  {
    id: 'e1',
    title: 'JEE Main Phase 3 Registration Open',
    category: 'ADMISSIONS',
    dateNum: '25',
    dateMon: 'AUG',
    badge: 'CRITICAL',
    badgeColor: '#FF008A',
    description: 'National Testing Agency gateway portal is active for Phase 3 engineering aspirants. Target elite NIT and IIT engineering blocks.',
    linkText: 'Admissions Gateway'
  },
  {
    id: 'e2',
    title: 'Nexora National Hackathon 2026',
    category: 'COMPETITION',
    dateNum: '10',
    dateMon: 'SEP',
    badge: 'PRIZE: 2 LAKH',
    badgeColor: '#00F0FF',
    description: '48-hour virtual engineering challenge in AI, Robotics, and Smart Grid software. Open for Intermediate and Polytechnic diploma teams.',
    linkText: 'Register Team'
  },
  {
    id: 'e3',
    title: 'Silicon Valley Founders Fellowship',
    category: 'SCHOLARSHIP',
    dateNum: '02',
    dateMon: 'OCT',
    badge: '100% FUNDED',
    badgeColor: '#F59E0B',
    description: 'Vanguard Business School scholarship grant. Pitch your technical prototype to top tier angel networks.',
    linkText: 'Submit Pitch'
  }
];

export const INITIAL_VAULT_FILES = [
  {
    id: '1',
    name: 'NIT_Computer_Engineering_Syllabus.pdf',
    category: 'ACADEMIC',
    size: '2.4 MB',
    date: '2026-08-01',
    content: 'Full academic curriculum including Data Structures, Algorithms, Microprocessors, and System Design.'
  },
  {
    id: '2',
    name: 'Weekly_Timetable_Diploma_Semester3.pdf',
    category: 'TIMETABLE',
    size: '1.1 MB',
    date: '2026-08-04',
    content: 'Updated Semester 3 timetable containing Labs, Machine Workshops, and Project hours.'
  },
  {
    id: '3',
    name: 'Admissions_Token_NEX-771823.txt',
    category: 'ADMISSIONS',
    size: '14 KB',
    date: '2026-08-07',
    content: 'GATEWAY TOKEN: NEX-771823\nCollege: Nexora Institute of Technology\nVerification: Verified Online Synced Node\nDate: 2026-08-07'
  }
];

export const AI_SUGGESTIONS = [
  "What is Polytechnic lateral entry?",
  "What careers open with intermediate MPC?",
  "Explain BiPC medical research path",
  "How does the College Document Vault work?"
];

export const AI_RESPONSES: Record<string, string> = {
  "what is polytechnic lateral entry?": `### 🚀 Polytechnic Lateral Entry Overview

Polytechnic Lateral Entry allows students who have completed a **3-Year Technical Diploma** (or equivalent vocational course) to enter directly into the **2nd Year (3rd Semester)** of a 4-year Bachelor of Engineering (B.E.) or Bachelor of Technology (B.Tech) program.

#### 🔑 Key Advantages:
- **Zero Academic Year Loss**: Complete your B.Tech in 3 years instead of 4.
- **Direct Eligibility**: Open for Diploma branches (Computer Engineering, Mechanical, Civil, ECE, Electrical).
- **Practical Edge**: Diploma students enter university with 3 years of hands-on lab and workshop experience over theoretical students.

#### 📋 Admission Gateway:
- Requires min 50-60% aggregate in Technical Diploma.
- Admission via state-level lateral entrance examinations (e.g., ECET / JELET).`,

  "what careers open with intermediate mpc?": `### 🔬 Careers with Intermediate MPC (Math, Physics, Chemistry)

Intermediate MPC is the foundational launchpad for technical, engineering, and numerical professions.

#### 🏛️ 1. Premier Engineering Lines (B.Tech / B.E.):
- **Computer Science & AI**: Neural Systems Architect, Cloud Engineer, Full-Stack Developer.
- **Aerospace & Avionics**: Orbital Telemetry Engineer, Propulsion Specialist at ISRO/DRDO.
- **Robotics & Mechatronics**: Industrial Automation, Autonomous Vehicles.

#### 📊 2. High-Growth Technical Domains:
- **Data Science & Algorithmic FinTech**: Quantitative Analyst, Financial Risk Modeler.
- **Pure Research**: Quantum Physics, Material Science, Applied Mathematics.
- **National Defense**: Technical Officer Entry in Indian Air Force and Navy via NDA/TES.`,

  "explain bipc medical research path": `### 🧬 Intermediate BiPC (Biology, Physics, Chemistry) Pathways

Intermediate BiPC opens doors to clinical medicine, genomic research, and bio-technological engineering.

#### 🏥 Core Career Paths:
1. **Clinical Medicine (MBBS / BDS / AYUSH)**: Traditional physician and dental pathways.
2. **Biotechnology & Genetic Engineering**: CRISPR gene editing, mRNA vaccine design, synthetic biology.
3. **Bioinformatics & Medical AI**: Merging computer algorithms with biological data for drug discovery.
4. **Allied Health Sciences**: Neuro-technician, Perfusionist, Nuclear Medicine Technologist.`,

  "how does the college document vault work?": `### 🛡️ Nexora Document Vault Architecture

The **Nexora Document Vault** is a localized, encrypted academic locker designed to store and manage critical documents during admissions and college terms.

#### 🌟 Key Capabilities:
- **Admissions Token Vault**: Store unique gateway tokens generated when applying to colleges (e.g. \`NEX-771823\`).
- **Timetable & Syllabus Storage**: Keep PDF timetables and revision guides handy.
- **WhatsApp Export Node**: 1-Click transfer of timetable updates or tokens directly to WhatsApp contacts.
- **Locker Capacity Gauge**: Live meter tracking storage space against a 512 MB allocation.`
};
