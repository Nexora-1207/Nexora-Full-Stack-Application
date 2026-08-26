export const OFFICIAL_NEXORA_EMAIL = 'nexoraofficial1207@gmail.com';
export const OFFICIAL_NEXORA_DOMAIN = 'nexoraedu.co.in';
export const OFFICIAL_NEXORA_URL = 'https://nexoraedu.co.in';

export interface LeaderProfile {
  name: string;
  titles: string[];
  roleDescription: string;
  responsibilities: { role: string; details: string }[];
  linkedinUrl: string;
  email: string;
  avatarGradient: string;
}

export const LEADERSHIP_TEAM: LeaderProfile[] = [
  {
    name: 'Shaik. Nadeem Ahmed',
    titles: ['Chief Executive Officer (CEO)', 'Chief Technology Officer (CTO)'],
    roleDescription: "Executive visionary directing Nexora's overall corporate strategy, product innovation, system architecture, and core technological engineering.",
    responsibilities: [
      {
        role: 'Chief Executive Officer (CEO)',
        details: 'Drives overall strategic vision, corporate roadmap, investor relations, institutional partnerships, and company-wide execution to scale Nexora across India and worldwide.'
      },
      {
        role: 'Chief Technology Officer (CTO)',
        details: 'Architects the full-stack cloud ecosystem, AI-driven career recommendation engines, encrypted Document Vault, and high-performance serverless infrastructure.'
      }
    ],
    linkedinUrl: 'https://www.linkedin.com/in/nadeem-shaik-458981343',
    email: 'nexoraofficial1207@gmail.com',
    avatarGradient: 'from-cyber-cyan via-blue-500 to-cyber-violet'
  },
  {
    name: 'Gudipalli. Rakesh Varma',
    titles: ['Chief Marketing Officer (CMO)', 'Chief Financial Officer (CFO)'],
    roleDescription: 'Strategic growth leader overseeing brand marketing, institutional outreach, financial stewardship, capital management, and partnership monetization.',
    responsibilities: [
      {
        role: 'Chief Marketing Officer (CMO)',
        details: 'Leads student community growth, college campus partnerships, brand storytelling, digital campaigns, and educational outreach to reach millions of students.'
      },
      {
        role: 'Chief Financial Officer (CFO)',
        details: 'Directs fiscal planning, revenue operations, financial modeling, budgeting, compliance, and long-term sustainable capital allocation for Nexora.'
      }
    ],
    linkedinUrl: 'https://www.linkedin.com/in/rakesh-varma-gudipalli-88b417343',
    email: 'nexoraofficial1207@gmail.com',
    avatarGradient: 'from-cyber-magenta via-pink-500 to-cyber-amber'
  }
];

export interface FeeStructure {
  tuitionFeePerYear: string;
  hostelFeePerYear: string;
  admissionFee: string;
  scholarships: string[];
}

export interface PlacementDossier {
  placementRate: number;
  avgPackage: string;
  highestPackage: string;
  topRecruiters: string[];
}

export interface CollegeBranch {
  name: string;
  code: string;
  seats: number;
  durationYears: number;
}

export interface CollegeBrochure {
  title: string;
  filename: string;
  academicYear: string;
  highlights: string[];
  pages: {
    pageNumber: number;
    title: string;
    content: string;
  }[];
}

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
  officialEmail: string;
  isPartner?: boolean;
  feeStructure: FeeStructure;
  placements: PlacementDossier;
  facilities: string[];
  branches: CollegeBranch[];
  brochure: CollegeBrochure;
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
    officialEmail: 'admissions.hyderabad@narayanagroup.com',
    isPartner: true,
    mission: 'High-intensity scientific foundation and JEE Advanced training.',
    perks: ['Direct IIT/NIT Coaching Sandbox', '100% Merit Fee Waiver for 95%+', 'AI-Driven Test Analysis'],
    requirements: 'Min 85% in Class 10 Board exam with Mathematics distinction',
    description: 'Renowned for rigorous Intermediate science preparation, Narayana MPC block equips students with superior analytical mathematics and physics problem-solving skills for premier engineering admissions.',
    feeStructure: {
      tuitionFeePerYear: '₹68,000 / year',
      hostelFeePerYear: '₹75,000 / year (Optional)',
      admissionFee: '₹5,000 (One-time)',
      scholarships: [
        '100% Tuition Fee Waiver for 10th GPA 10.0 / 95%+',
        '50% Merit Subsidy for State Rankers',
        'Jagananna Vidya Deevena (JVD) State Scheme Eligible'
      ]
    },
    placements: {
      placementRate: 96,
      avgPackage: '₹8.5 LPA (Target B.Tech Level)',
      highestPackage: '₹42 LPA (IIT/NIT Lateral Track)',
      topRecruiters: ['IIT Hyderabad Sandbox', 'BITS Pilani Node', 'TCS Cyber', 'L&T Technology Services']
    },
    facilities: [
      'JEE Simulation AI Computer Lab',
      'Advanced Physics & Mechanics Workshop',
      'Air-Conditioned Digital Study Pods',
      '24/7 Academic Mentor Support',
      'Hostel & Nutritious Dining Hall'
    ],
    branches: [
      { name: 'Intermediate MPC (Maths, Physics, Chemistry) - IIT Special', code: 'MPC-IIT', seats: 180, durationYears: 2 },
      { name: 'Intermediate MPC - Olympiad & AI Foundation', code: 'MPC-AI', seats: 120, durationYears: 2 },
      { name: 'MPC Technical Lateral Prep Track', code: 'MPC-LAT', seats: 90, durationYears: 2 }
    ],
    brochure: {
      title: 'Narayana MPC Official Prospectus 2026-2027',
      filename: 'Narayana_MPC_Official_Prospectus_2026.pdf',
      academicYear: '2026 - 2027',
      highlights: [
        'Over 4,500+ Selections in Premier Engineering Universities',
        'Personalized AI Weakness Tracking Matrix',
        'State-of-the-Art Science & Computing Laboratories'
      ],
      pages: [
        {
          pageNumber: 1,
          title: 'Welcome & Executive Directive',
          content: 'At Narayana MPC Academic Block, our mission is clear: forge the next generation of engineers, data scientists, and technological visionaries through structured problem solving and top-tier JEE coaching.'
        },
        {
          pageNumber: 2,
          title: 'Curriculum & Pedagogy',
          content: 'Dual-pathway curriculum covering Board syllabus alongside advanced competitive entrance patterns (JEE Main, JEE Advanced, TS/AP EAPCET). Includes weekly diagnostic mock tests.'
        },
        {
          pageNumber: 3,
          title: 'Infrastructure & Hostels',
          content: 'Spacious modern campuses equipped with high-speed Wi-Fi, biometric safety, dedicated doubt-clarification centers, and hygienic residential hostels.'
        }
      ]
    }
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
    officialEmail: 'admissions.medical@srichaitanya.net',
    isPartner: true,
    mission: 'Nurturing surgeons, clinical researchers, and biotech leaders.',
    perks: ['NEET High-Yield Simulation Lab', 'Top 100 Ranker Grant', 'Integrated Bio-Research Wing'],
    requirements: 'Min 88% in Class 10 Science & Mathematics',
    description: 'A structured Intermediate institution focusing on Biology, Physics, and Chemistry (BiPC) designed to navigate students into premier medical schools, AIIMS gates, and nanobiology labs.',
    feeStructure: {
      tuitionFeePerYear: '₹72,000 / year',
      hostelFeePerYear: '₹80,000 / year',
      admissionFee: '₹6,000 (One-time)',
      scholarships: [
        '100% Scholarship for NEET Mock Top 50 Rankers',
        'Post-Matric Govt Fellowship Eligible',
        'Women in Bio-Tech Special Grant'
      ]
    },
    placements: {
      placementRate: 94,
      avgPackage: '₹9.2 LPA (Pre-Med & Bio-Research Sync)',
      highestPackage: '₹38 LPA (AIIMS / Global Bio-Lab Entry)',
      topRecruiters: ['AIIMS New Delhi Network', 'Apollo Healthcare Labs', 'Dr. Reddys Biotech', 'Bharat Biotech']
    },
    facilities: [
      'High-Yield Micro-Biology & Cadaveric Dissection Simulators',
      'Botanical Research Greenhouse',
      'Digital Library with 50,000+ Medical Journals',
      'Residential Health Center'
    ],
    branches: [
      { name: 'Intermediate BiPC (Biology, Physics, Chemistry) - NEET Elite', code: 'BIPC-NEET', seats: 150, durationYears: 2 },
      { name: 'BiPC Bio-Informatics & AI Genetics Track', code: 'BIPC-GEN', seats: 80, durationYears: 2 }
    ],
    brochure: {
      title: 'Sri Chaitanya BiPC Academy Prospectus 2026',
      filename: 'Chaitanya_BiPC_Prospectus_2026.pdf',
      academicYear: '2026 - 2027',
      highlights: [
        '#1 Ranked Pre-Medical Academy in South India',
        'Proven Record of AIIMS & JIPMER Top Selections',
        'Integrated Clinical Research & Diagnostic Labs'
      ],
      pages: [
        {
          pageNumber: 1,
          title: 'Pioneering Healthcare Education',
          content: 'Sri Chaitanya BiPC Academy empowers future doctors, geneticists, and clinical researchers with rigorous conceptual clarity and diagnostic intuition.'
        },
        {
          pageNumber: 2,
          title: 'NEET Specialization Matrix',
          content: 'Daily 3-hour dedicated NEET problem solving sessions, micro-level error analysis, and 3D human anatomy simulations.'
        }
      ]
    }
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
    officialEmail: 'principal.gptb@karnataka.gov.in',
    isPartner: true,
    mission: 'Practical technical mastery, CNC tooling, and direct engineering lateral entry.',
    perks: ['100% Government Stipend Cover', 'Industrial Automation Lab', 'Direct Lateral Entry to 2nd Year B.Tech'],
    requirements: 'Class 10 Pass + State POLYCET Merit Rank',
    description: 'State premier technical institution offering 3-year diplomas in Computer Engineering, ECE, Mechanical, and Civil Engineering with guaranteed lateral entry into accredited B.Tech degree programs.',
    feeStructure: {
      tuitionFeePerYear: '₹14,500 / year (Govt Subsidized)',
      hostelFeePerYear: '₹22,000 / year (Mess Included)',
      admissionFee: '₹1,200',
      scholarships: [
        '100% Fee Reimbursement for SC/ST/BC Merit Candidates',
        'Pragati Scholarship for Girl Technical Students (₹50,000/yr)',
        'State POLYCET Rank 1-1000 Free Laptop Scheme'
      ]
    },
    placements: {
      placementRate: 92,
      avgPackage: '₹4.8 LPA (Diploma Lateral Placement)',
      highestPackage: '₹14 LPA (Bosch & Siemens Tooling)',
      topRecruiters: ['Bosch India', 'Siemens Automation', 'L&T Construction', 'Toyota Kirloskar', 'HAL Bangalore']
    },
    facilities: [
      'Heavy Industrial Lathe & CNC Machine Shop',
      'Electrical Power Grid & Relays Lab',
      'CAD / CAM Design Workstation Room',
      'Govt Apprenticeship & Career Placement Cell'
    ],
    branches: [
      { name: 'Diploma in Computer Engineering (DCME)', code: 'DCME', seats: 120, durationYears: 3 },
      { name: 'Diploma in Mechanical Engineering (DME)', code: 'DME', seats: 120, durationYears: 3 },
      { name: 'Diploma in Electronics & Comm. (DECE)', code: 'DECE', seats: 90, durationYears: 3 },
      { name: 'Diploma in Civil Engineering (DCE)', code: 'DCE', seats: 60, durationYears: 3 }
    ],
    brochure: {
      title: 'Govt Polytechnic Bangalore Institutional Prospectus',
      filename: 'Govt_Polytechnic_Bangalore_2026.pdf',
      academicYear: '2026 - 2027',
      highlights: [
        'AICTE Approved & NBA Accredited State Polytechnic',
        'Guaranteed Lateral Entry (ECET) into 2nd Year Engineering Degree',
        'Direct Campus Recruitment Contracts with Tier-1 Heavy Industries'
      ],
      pages: [
        {
          pageNumber: 1,
          title: 'Legacy of Technical Excellence',
          content: 'Established in 1954, Govt Polytechnic Bangalore is Karnataka premier technical diploma hub, training hands-on engineers for global manufacturing and software leadership.'
        },
        {
          pageNumber: 2,
          title: 'Diploma Branches & Lateral Pathways',
          content: 'Detailed breakdown of 3-year diploma courses, workshop credit hours, industrial internship semesters, and B.Tech lateral entry seat quotas.'
        }
      ]
    }
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
    officialEmail: 'admissions@centauripolytechnic.edu',
    isPartner: true,
    mission: 'Developing self-healing compiler nets and kernel architecture.',
    perks: ['100% Developer Fellowship', 'High-Performance Grid Access', 'Web3 Global Accelerator Lab'],
    requirements: 'Class 10 or equivalent, POLYCET rank, Code Diagnostic Test',
    description: 'Centauri focuses on practical computing diplomas: low-level systems, kernel development, neural net architecture, and hardware-software integration, feeding directly into top-tier tech universities.',
    feeStructure: {
      tuitionFeePerYear: '₹85,000 / year',
      hostelFeePerYear: '₹60,000 / year',
      admissionFee: '₹8,000',
      scholarships: [
        'Nexora Developer Grant (Up to ₹50,000 Waiver)',
        'Open Source Contributor Merit Fellowship',
        'Full Tuition Reimbursement for Top 5% Coders'
      ]
    },
    placements: {
      placementRate: 98,
      avgPackage: '₹11.4 LPA',
      highestPackage: '₹32 LPA (Silicon Valley Offsite)',
      topRecruiters: ['Microsoft India', 'Qualcomm Tech', 'AMD Hyderabad', 'Red Hat Software', 'Atlassian']
    },
    facilities: [
      'High-Performance NVIDIA H100 GPU AI Cluster',
      'Hardware Oscilloscope & Embedded IoT Testing Lab',
      'Hackathon Cyber Arena & 24/7 Hacker Lodge',
      'Gigabit Fiber Mesh Network'
    ],
    branches: [
      { name: 'Diploma in Artificial Intelligence & Software Nets', code: 'D-AI', seats: 90, durationYears: 3 },
      { name: 'Diploma in Cloud Infrastructure & Cyber Security', code: 'D-CYBER', seats: 60, durationYears: 3 },
      { name: 'Diploma in Embedded Systems & Robotics', code: 'D-EMBED', seats: 60, durationYears: 3 }
    ],
    brochure: {
      title: 'Centauri Software Academy Official Handbook 2026',
      filename: 'Centauri_Polytechnic_Prospectus_2026.pdf',
      academicYear: '2026 - 2027',
      highlights: [
        'Pioneering Project-First Computer Engineering Diploma',
        'Direct Tech Accelerator Grants for Student Startups',
        'Industry Mentorship from Senior Engineers at Silicon Valley Giants'
      ],
      pages: [
        {
          pageNumber: 1,
          title: 'Re-inventing Technical Education',
          content: 'Centauri Polytechnic discards outdated theoretical rote learning. Students build compilers, deploy cloud clusters, and write production code from Day 1.'
        }
      ]
    }
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
    officialEmail: 'admissions@nit.nexora.edu',
    isPartner: true,
    mission: 'Designing next-generation orbital telemetry & autonomous neural robotics.',
    perks: ['Elite Lateral Fellowship (100% Tuition)', 'Interactive Neural AI Sandbox', 'Direct ISRO/SpaceX Placement'],
    requirements: 'Diploma in Engineering with min 70% aggregate marks',
    description: 'The flagship university hub of Nexora. NIT provides a direct 2nd-year lateral entry gateway for Polytechnic diploma graduates into cutting-edge Computer, Electronics, and Mechanical branches.',
    feeStructure: {
      tuitionFeePerYear: '₹1,25,000 / year',
      hostelFeePerYear: '₹90,000 / year (Executive Single/Twin)',
      admissionFee: '₹10,000',
      scholarships: [
        'Nexora Institutional Gold Medal Fellowship (100% Tuition + Hostel)',
        'Polytechnic Lateral Entry Merit Scholarship (50% Waiver)',
        'Research Grant for Autonomous Robotics Projects'
      ]
    },
    placements: {
      placementRate: 99,
      avgPackage: '₹16.8 LPA',
      highestPackage: '₹54 LPA (Global Telemetry / Aerospace)',
      topRecruiters: ['ISRO Bangalore', 'SpaceX Aerospace Partner', 'Google Research India', 'Tesla Energy', 'NVIDIA Systems']
    },
    facilities: [
      'Quantum Computing & Neural Telemetry Lab',
      'Aerospace Wind Tunnel & Satellite Assembly Cleanroom',
      'Autonomous Vehicle Test Track',
      'International Scholar Residence & Executive Dining'
    ],
    branches: [
      { name: 'B.Tech Computer Science & Autonomous AI (Lateral 2nd Year)', code: 'BTECH-CSE-LAT', seats: 60, durationYears: 3 },
      { name: 'B.Tech Robotics & Aerospace Avionics (Lateral 2nd Year)', code: 'BTECH-AERO-LAT', seats: 45, durationYears: 3 },
      { name: 'B.Tech Electronics & Quantum Communication (Lateral 2nd Year)', code: 'BTECH-ECE-LAT', seats: 45, durationYears: 3 }
    ],
    brochure: {
      title: 'Nexora Institute of Technology Flagship Prospectus 2026',
      filename: 'NIT_Flagship_Prospectus_2026.pdf',
      academicYear: '2026 - 2027',
      highlights: [
        'The #1 Rated Lateral Entry Engineering Campus in Asia',
        'Direct Orbital Payload Projects with Space Agencies',
        '100% Guaranteed High-Impact Placement Match'
      ],
      pages: [
        {
          pageNumber: 1,
          title: 'The Frontier of Engineering',
          content: 'Nexora Institute of Technology (NIT) stands as the beacon of innovation for diploma graduates seeking direct lateral entry into world-class B.Tech engineering disciplines.'
        },
        {
          pageNumber: 2,
          title: 'Lateral Entry Admissions Policy',
          content: 'State ECET rankers and Polytechnic diploma holders with 70%+ aggregate are eligible for direct 2nd-year admission into our honors B.Tech degrees.'
        }
      ]
    }
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
    officialEmail: 'admissions@apexiti.org',
    isPartner: true,
    mission: 'Mastering mechanical automation, CNC tooling, and electric smart grids.',
    perks: ['Industry-Ready Stipend (100% Paid)', 'Advanced CNC Tooling Lab', 'Global Industrial Trade Certification'],
    requirements: 'Class 10 Pass, Manual Agility Test',
    description: 'Providing vocational expertise in industrial electrician trades, precision fitting, and CNC lathe machining with direct placement contracts into automotive and aerospace assembly lines.',
    feeStructure: {
      tuitionFeePerYear: '₹18,000 / year (Fully Reimbursed)',
      hostelFeePerYear: '₹24,000 / year',
      admissionFee: '₹1,000',
      scholarships: [
        'National Apprenticeship Training Scheme Stipend (₹8,000/month)',
        '100% Fee Subsidy for Skilled Trade Aspirants',
        'Free Industrial Safety Toolkit & Protective Gear'
      ]
    },
    placements: {
      placementRate: 95,
      avgPackage: '₹3.8 LPA + Monthly Production Incentives',
      highestPackage: '₹8.5 LPA (Overseas Industrial Operations)',
      topRecruiters: ['Hyundai Motors India', 'Royal Enfield', 'TVS Motors', 'L&T Heavy Engineering', 'Schindler Elevators']
    },
    facilities: [
      'German Standard CNC Lathe & Milling Workshop',
      'HVAC & Industrial Refrigeration Lab',
      'High-Voltage Electrical Relay & Wiring Station',
      'Apprenticeship & Direct Factory Placement Cell'
    ],
    branches: [
      { name: 'ITI Electrician (2-Year Trade)', code: 'ITI-ELEC', seats: 100, durationYears: 2 },
      { name: 'ITI Fitter & Precision Machinist (2-Year Trade)', code: 'ITI-FIT', seats: 100, durationYears: 2 },
      { name: 'ITI COPA (Computer Operator & Programming Asst - 1 Year)', code: 'ITI-COPA', seats: 80, durationYears: 1 }
    ],
    brochure: {
      title: 'Apex Industrial Training Institute Official Trade Prospectus',
      filename: 'Apex_ITI_Trades_Prospectus_2026.pdf',
      academicYear: '2026 - 2027',
      highlights: [
        'NCVT / SCVT Recognized Government Grade Vocational Hub',
        'Direct On-the-Job Paid Apprenticeships in Manufacturing Plants',
        '100% Trade Qualification & Job Assurance'
      ],
      pages: [
        {
          pageNumber: 1,
          title: 'Powering Industrial Growth',
          content: 'Apex ITI transforms Class 10 graduates into certified master craftsmen, electricians, and CNC machinists powering India manufacturing revolution.'
        }
      ]
    }
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
