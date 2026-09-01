export interface DecisionNode {
  question: string;
  subtitle: string;
  type?: 'options' | 'info' | 'success';
  text?: string;
  next?: string;
  options?: {
    id: string;
    label: string;
    sub: string;
    brief: string;
    next: string;
  }[];
}

export interface SectorTree {
  id: string;
  name: string;
  colorPalette: {
    primary: string;
    secondary: string;
    bgGradient: string;
    glowColor: string;
    textMuted: string;
    accent: string;
  };
  tree: Record<string, DecisionNode>;
  awareness: {
    salaryRange: string;
    demand: 'CRITICAL' | 'HIGH' | 'STABLE';
    roles: string[];
    description: string;
    marketInsight: string;
  };
  dashboard: {
    stats: { label: string; value: string; color: string }[];
    tools: { id: string; name: string; desc: string; icon: string }[];
    opportunities: { id: string; title: string; date: string; tag: string; desc: string; badgeColor: string }[];
  };
}

export const SECTOR_TREES: Record<string, SectorTree> = {
  "engineering": {
    id: "ENGINEERING",
    name: "Engineering & Tech",
    colorPalette: {
      primary: "#00F0FF",
      secondary: "#3B82F6",
      bgGradient: "from-cyber-cyan/10 to-transparent",
      glowColor: "rgba(0, 240, 255, 0.4)",
      textMuted: "text-cyber-cyan",
      accent: "border-cyber-cyan/40 text-cyber-cyan bg-cyber-cyan/10"
    },
    tree: {
      root: {
        question: "ACADEMIC FOUNDATION",
        subtitle: "Select your entry path after 10th grade",
        options: [
          { id: 'diploma', label: "3-YEAR POLYTECHNIC DIPLOMA", sub: "Direct Engineering Pathway", next: 'diploma_branches', brief: "A direct practical engineering program. Allows lateral entry into the 2nd year of B.Tech later." },
          { id: 'inter', label: "INTERMEDIATE MPC (10+2)", sub: "Academic Science Stream", next: 'inter_branches', brief: "Theoretical route. Prepares you for competitive exams like JEE Main/Advanced and standard B.Tech entry." },
          { id: 'iti', label: "ITI VOCATIONAL TRADES", sub: "2-Year Technical Craftsman", next: 'iti_branches', brief: "Hands-on industrial craftsman vocational program. Quick entry into technical jobs." }
        ]
      },
      diploma_branches: {
        question: "DIPLOMA BRANCH",
        subtitle: "Select your primary engineering specialization",
        options: [
          { id: 'diploma_mech', label: "Mechanical Engineering", sub: "Robotics & Heavy Tooling", next: 'success', brief: "Focus on mechatronics, CAD drawing, CNC programming, and automated robotics systems." },
          { id: 'diploma_ece', label: "Electronics & Communication", sub: "Embedded Systems & IoT", next: 'success', brief: "Focus on circuit design, IoT systems, telemetry, and smart sensor nodes." },
          { id: 'diploma_civil', label: "Civil Engineering", sub: "Structural Drafting & BIM", next: 'success', brief: "Focus on smart city structures, urban design, and material stress calculation." },
          { id: 'diploma_cse', label: "Computer Engineering", sub: "Software, Networks & OS", next: 'success', brief: "Master operating systems, computer hardware, local networks, and database administration." },
          { id: 'diploma_eee', label: "Electrical & Electronics", sub: "Power Grids & Machinery", next: 'success', brief: "Focus on generator stations, electric sub-stations, high-voltage grids, and motor drives." }
        ]
      },
      inter_branches: {
        question: "PREPARATORY TARGET",
        subtitle: "Identify your target entrance benchmark",
        options: [
          { id: 'inter_iit', label: "Elite B.Tech Route (JEE)", sub: "JEE Advanced/NIT Target", next: 'success', brief: "Prepare for Indian Institutes of Technology (IITs) and National Institutes of Technology (NITs)." },
          { id: 'inter_state', label: "State B.Tech Route", sub: "State Entrance (CET) Target", next: 'success', brief: "Prepare for premier state university and government engineering colleges." }
        ]
      },
      iti_branches: {
        question: "VOCATIONAL TRADE",
        subtitle: "Select your active manufacturing trade",
        options: [
          { id: 'iti_fitter', label: "ITI Fitter / Turner", sub: "Precision Lathe & Machining", next: 'success', brief: "Focus on industrial assembly, mechatronics calibration, and heavy-tool operations." },
          { id: 'iti_electrician', label: "ITI Electrician", sub: "Industrial Grids & Cabling", next: 'success', brief: "Focus on power grids, sub-station wiring, solar panel setups, and electrical diagnostics." },
          { id: 'iti_welder', label: "ITI Welder / Machinist", sub: "Fabrication & Precision Crafting", next: 'success', brief: "Master gas/arc welding, structural steel assembly, and milling machines." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹3.5 LPA - ₹12.0 LPA (Starting)",
      demand: "CRITICAL",
      roles: ["Systems Calibration Associate", "CAD Draftsman", "Automation Engineer", "Junior Telecom Engineer"],
      description: "Engineering & Technology remains the foundational core of global industrial automation. Post-10th paths such as Polytechnic Diplomas give you a massive hands-on laboratory edge over traditional 10+2 students.",
      marketInsight: "With the rise of semiconductor manufacturing nodes and local EV grids, skilled ECE and Mechanical diploma holders are experiencing a 35% year-on-year surge in starting packages."
    },
    dashboard: {
      stats: [
        { label: "Placement Index", value: "96%", color: "text-cyber-cyan" },
        { label: "Active Jobs", value: "1,240+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹4.8 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "eng_scanner", name: "ATS Resume & CAD Project Scanner", desc: "Scans engineering resumes, CAD drawings, and technical skill sets against B.Tech benchmarks.", icon: "FileText" },
        { id: "eng_interview", name: "Technical & Mechatronics Interviewer", desc: "Simulates core technical rounds for mechanical, electrical, ECE, and civil engineering.", icon: "Mic" },
        { id: "eng_explainer", name: "Engineering Theorems Explainer", desc: "Step-by-step breakdowns of calculus, physics, circuit schematics, and CAD logic.", icon: "Lightbulb" },
        { id: "eng_notepad", name: "Engineering Lab & Lecture Notepad", desc: "Draft lab observations, circuit specs, and save directly to Document Vault.", icon: "BookOpen" }
      ],
      opportunities: [
        { id: "o1", title: "JEE Main Portal Active", date: "Aug 25, 2026", tag: "CRITICAL", desc: "Joint Entrance Examination is open. Apply for elite IIT and NIT blocks.", badgeColor: "bg-red-500/10 text-red-500 border-red-500/30" },
        { id: "o2", title: "Tata Robotics Apprentice Scheme", date: "Sep 05, 2026", tag: "DIPLOMA ONLY", desc: "Apprenticeship drive for mechanical and ECE diploma holders. Direct conversion.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "medical-support": {
    id: "MEDICAL SUPPORT",
    name: "Medical & Bio-Research",
    colorPalette: {
      primary: "#EC4899",
      secondary: "#FF008A",
      bgGradient: "from-cyber-pink/10 to-transparent",
      glowColor: "rgba(236, 72, 153, 0.4)",
      textMuted: "text-cyber-pink",
      accent: "border-cyber-pink/40 text-cyber-pink bg-cyber-pink/10"
    },
    tree: {
      root: {
        question: "HEALTHCARE LAUNCHPAD",
        subtitle: "Select your entry path after 10th grade",
        options: [
          { id: 'diploma', label: "PARAMEDICAL DIPLOMA", sub: "Allied Health Sciences (2-3 Yrs)", next: 'diploma_branches', brief: "Hands-on medical assistance. Direct entry into clinical labs, imaging facilities, or pharmacies." },
          { id: 'inter', label: "INTERMEDIATE BIPC (10+2)", sub: "Pre-Medical Science Stream", next: 'inter_branches', brief: "Traditional pre-medical route leading to MBBS, BDS, Vet Science, or Bio-Research." }
        ]
      },
      diploma_branches: {
        question: "PARAMEDICAL SPECIALIZATION",
        subtitle: "Select your clinical laboratory specialization",
        options: [
          { id: 'dmlt', label: "DMLT (Medical Lab Tech)", sub: "Pathology & Pathogen Screening", next: 'success', brief: "Analyze blood samples, screen pathogens, and run genetic diagnostic sequences." },
          { id: 'drt', label: "DRT (Radiology Tech)", sub: "X-Ray, MRI & CT Scan Controls", next: 'success', brief: "Master radiographic scanners, oncology imaging, and bio-telemetry controls." },
          { id: 'dpharm', label: "D.Pharm (Pharmacy Diploma)", sub: "Pharmacology & Dispensing Node", next: 'success', brief: "Learn drug chemistry, dispensing control, and pharmaceutical inventory management." },
          { id: 'dhg', label: "Dental Hygiene Assistant", sub: "Clinical Dental Care", next: 'success', brief: "Focus on dental diagnostics, sterilization, radiography, and patient sanitization protocols." }
        ]
      },
      inter_branches: {
        question: "CLINICAL PATHWAY",
        subtitle: "Select your primary medicine/research target",
        options: [
          { id: 'neet_mbbs', label: "Clinical Surgery (MBBS/BDS)", sub: "Doctor of Medicine Pathway", next: 'success', brief: "Prepare for national medical entrance (NEET-UG) to secure clinical medical college seats." },
          { id: 'biotech', label: "Bio-Tech & Medical Genomics", sub: "Gene Editing & Bioinformatics", next: 'success', brief: "Dive into molecular sciences, CRISPR systems, and biochemical research lines." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹2.8 LPA - ₹9.0 LPA (Starting)",
      demand: "HIGH",
      roles: ["Lab Diagnostic Technician", "Radiological Safety Analyst", "Pharmacist Assistant", "Clinical Scripter"],
      description: "Healthcare and Bio-Research rely heavily on diagnostic experts. Paramedical courses after 10th equip you with highly specific clinical lab procedures, placing you in active hospital sectors faster than theoretical paths.",
      marketInsight: "Post-pandemic automation of medical labs has created an 80% higher demand for certified DMLT professionals capable of running digital diagnostic arrays."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "89%", color: "text-cyber-pink" },
        { label: "Lab Jobs", value: "890+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹3.8 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "med_scanner", name: "Pathology & Clinical Lab Inspector", desc: "Simulates blood diagnostic screening, cell pathogen tracking, and DMLT lab protocols.", icon: "Activity" },
        { id: "med_interview", name: "NEET & Clinical Viva Simulator", desc: "Simulates clinical viva questions, NEET prep scenarios, and lab assistant rounds.", icon: "HeartPulse" },
        { id: "med_explainer", name: "Pharmacology & Dosage Validator", desc: "Calculates pharmaceutical dosages, drug safety levels, and biochemistry formulas.", icon: "Sparkles" },
        { id: "med_notepad", name: "Clinical Notes & Patient Record Log", desc: "Record clinical lab notes, patient diagnostic logs, and sync to Document Vault.", icon: "FileText" }
      ],
      opportunities: [
        { id: "m1", title: "NEET Prep Mock Drive", date: "Sep 12, 2026", tag: "INTERMEDIATE", desc: "All-India mock test series for BiPC students targeting government medical blocks.", badgeColor: "bg-cyber-pink/10 text-cyber-pink border-cyber-pink/30" },
        { id: "m2", title: "Apollo Lab Assistant Openings", date: "Aug 29, 2026", tag: "DMLT REQUIRED", desc: "Direct screening interview for junior lab technicians in regional diagnostics labs.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "computers": {
    id: "COMPUTERS",
    name: "Computer Science",
    colorPalette: {
      primary: "#10B981",
      secondary: "#059669",
      bgGradient: "from-cyber-emerald/10 to-transparent",
      glowColor: "rgba(16, 185, 129, 0.4)",
      textMuted: "text-cyber-emerald",
      accent: "border-cyber-emerald/40 text-cyber-emerald bg-cyber-emerald/10"
    },
    tree: {
      root: {
        question: "SOFTWARE ENTRANCE",
        subtitle: "Select your entry path after 10th grade",
        options: [
          { id: 'diploma', label: "DIPLOMA IN CS / IT", sub: "3-Year Software Engineering", next: 'diploma_branches', brief: "Master computer networks, web programming, algorithms, and system administration directly after 10th." },
          { id: 'copa', label: "ITI COPA / IT TRADE", sub: "Computer Operator (1-2 Yrs)", next: 'success', brief: "Hands-on data structures, office automation, database management, and network troubleshooting." },
          { id: 'inter', label: "INTERMEDIATE MEC / MPC", sub: "Commerce/Maths with Computers", next: 'success', brief: "Acquire secondary education with computer science electives. Prepares for BCA / MCA / B.Sc CS." }
        ]
      },
      diploma_branches: {
        question: "SOFTWARE DOMAIN",
        subtitle: "Select your development target",
        options: [
          { id: 'web_dev', label: "Web & App Architecture", sub: "Full-Stack Software Nodes", next: 'success', brief: "Learn frontend UI nodes, database APIs, backend servers, and web design modules." },
          { id: 'cyber_security', label: "Cyber Security & Networks", sub: "System Defense & Routing", next: 'success', brief: "Focus on network security parameters, database firewalls, and encryption algorithms." },
          { id: 'cloud', label: "Cloud & Devops Systems", sub: "AWS, Linux & Containers", next: 'success', brief: "Learn linux environments, cloud server scaling, routing tables, and automated deploy lines." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹4.0 LPA - ₹15.0 LPA (Starting)",
      demand: "CRITICAL",
      roles: ["Junior Web Developer", "IT Network Executive", "Data Entry Security Associate", "Cloud Setup Assistant"],
      description: "Computer Science after 10th bypasses secondary school general science to focus entirely on software stack development. A CS Diploma bridges database configuration, scripting, and system engineering.",
      marketInsight: "Full-Stack node developers with responsive app creation skills are selected for junior startup roles even before graduating from technical colleges."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "95%", color: "text-cyber-emerald" },
        { label: "Active Nodes", value: "3,410+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹5.2 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "cs_scanner", name: "Code Review & Algorithm Optimizer", desc: "Analyzes Python, C++, Java snippets, DSA logic, and full-stack web code syntax.", icon: "Terminal" },
        { id: "cs_interview", name: "Software Engineer & System Design Interviewer", desc: "Simulates live coding interviews, DSA problem solving, and full-stack web rounds.", icon: "Code" },
        { id: "cs_explainer", name: "Cyber Security & Cloud Explainer", desc: "Explains cloud infrastructure, IP subnets, firewalls, and encryption protocols.", icon: "Cpu" },
        { id: "cs_notepad", name: "Dev Snippets & Architecture Notepad", desc: "Draft code snippets, REST API endpoints, and save directly to Document Vault.", icon: "FileCode" }
      ],
      opportunities: [
        { id: "c1", title: "Google Cloud Sandbox Apprentice", date: "Sep 20, 2026", tag: "OPEN INGRESS", desc: "Earn virtual credits and complete network training programs directly.", badgeColor: "bg-cyber-emerald/10 text-cyber-emerald border-cyber-emerald/30" },
        { id: "c2", title: "Zeta Web Studio Hiring Drive", date: "Aug 31, 2026", tag: "PORTFOLIO TARGET", desc: "Screening based on practical HTML/React portfolios. Junior Dev role.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "skilled-trades": {
    id: "SKILLED TRADES",
    name: "Skilled Trades (ITI)",
    colorPalette: {
      primary: "#F59E0B",
      secondary: "#D97706",
      bgGradient: "from-cyber-amber/10 to-transparent",
      glowColor: "rgba(245, 158, 11, 0.4)",
      textMuted: "text-cyber-amber",
      accent: "border-cyber-amber/40 text-cyber-amber bg-cyber-amber/10"
    },
    tree: {
      root: {
        question: "VOCATIONAL TRACK",
        subtitle: "Select your industrial trade class after 10th",
        options: [
          { id: 'iti_engg', label: "ITI ENGINEERING TRADES", sub: "Mechanical, Electrical & Tooling", next: 'engg_trades', brief: "Focus on active mechanical drafting, grid wiring, CNC milling, and precision metal shaping." },
          { id: 'iti_nonengg', label: "ITI NON-ENGINEERING TRADES", sub: "Computers, Stenography & Crafts", next: 'nonengg_trades', brief: "Focus on office automation, commercial stenography, pattern design, and digital drafting." }
        ]
      },
      engg_trades: {
        question: "ENGINEERING TRADE SELECT",
        subtitle: "Choose your hands-on craft specialization",
        options: [
          { id: 'electrician', label: "ITI Electrician", sub: "Grid Setup & Smart Circuits", next: 'success', brief: "Specialized trade focusing on heavy machinery diagnostics, home automated boards, and solar installation." },
          { id: 'fitter', label: "ITI Fitter", sub: "Machinery Piping & Structures", next: 'success', brief: "Specialized trade focusing on mechanical lathe operations, structural plumbing, and CAD tooling blueprints." },
          { id: 'diesel_mech', label: "ITI Diesel Mechanic", sub: "Heavy IC & EV Engines", next: 'success', brief: "Master diesel engine tuning, piston calibrations, fuel pumps, and cooling grids." },
          { id: 'machinist', label: "ITI Machinist / Welder", sub: "Precision Manufacturing & Welding", next: 'success', brief: "Master CNC milling machines, precision grinders, and arc/TIG welding operations." }
        ]
      },
      nonengg_trades: {
        question: "NON-ENGINEERING SELECT",
        subtitle: "Choose your operational trade specialization",
        options: [
          { id: 'copa', label: "ITI COPA", sub: "Computer Operations & coding", next: 'success', brief: "Master database records, digital inventory control, basic accounting, and desktop configuration." },
          { id: 'stenographer', label: "ITI Stenographer", sub: "Secretary & Admin Desk", next: 'success', brief: "Learn high-speed stenography shorthand, corporate documentation, dictation, and record systems." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹2.2 LPA - ₹6.5 LPA (Starting)",
      demand: "STABLE",
      roles: ["Industrial Fitter", "Power Grid Operator", "Diesel Plant Assistant", "Office Database Administrator"],
      description: "Skilled Trades (ITI) are the backbone of active manufacturing hubs. These 1-2 year technical courses provide instant industry placement and direct apprenticeships at heavy engineering companies.",
      marketInsight: "Under the national apprentice promotion scheme, PSU corporations are mandated to hire certified ITI fitters and electricians with a 25% vacancy reservation."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "92%", color: "text-cyber-amber" },
        { label: "Active Jobs", value: "2,110+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹3.0 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "trade_scanner", name: "CNC & Wiring Diagram Inspector", desc: "Evaluates ITI fitter blueprints, electrical schematics, and lathe specifications.", icon: "Wrench" },
        { id: "trade_interview", name: "Industrial NCVT Trade Viva Simulator", desc: "Simulates NCVT trade test viva, railway apprentice rounds, and technician interviews.", icon: "Hammer" },
        { id: "trade_explainer", name: "Industrial Automation & Safety Explainer", desc: "Explains PLC programming, transformer maintenance, arc welding, and OSHA safety.", icon: "Shield" },
        { id: "trade_notepad", name: "Workshop Calibration & Tooling Log", desc: "Record machine calibration details, tool inventory, and store in Vault.", icon: "BookOpen" }
      ],
      opportunities: [
        { id: "t1", title: "Railways Apprentice Board", date: "Sep 15, 2026", tag: "GOVT SECTOR", desc: "National apprenticeship drive. Open for ITI Fitter and Electrician nodes.", badgeColor: "bg-cyber-amber/10 text-cyber-amber border-cyber-amber/30" },
        { id: "t2", title: "BHEL Trainee Walk-in", date: "Aug 28, 2026", tag: "IMMEDIATE", desc: "Direct interview recruitment for electrical trade certification holders.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "merchant-navy": {
    id: "MERCHANT NAVY",
    name: "Merchant Navy",
    colorPalette: {
      primary: "#06B6D4",
      secondary: "#0284C7",
      bgGradient: "from-cyber-cyan/10 to-transparent",
      glowColor: "rgba(6, 182, 212, 0.4)",
      textMuted: "text-cyber-cyan",
      accent: "border-cyber-cyan/40 text-cyber-cyan bg-cyber-cyan/10"
    },
    tree: {
      root: {
        question: "MARITIME INGRESS",
        subtitle: "Select your entry path after 10th grade",
        options: [
          { id: 'gp_rating', label: "GP RATING COURSE", sub: "General Purpose Rating (6 Months)", next: 'gp_rating_options', brief: "Fastest route. 6-month residential deck/engine crew training approved by DG Shipping." },
          { id: 'ccmc', label: "CCMC CERTIFICATION", sub: "Saloon Rating Crew (6 Months)", next: 'success', brief: "Hospitality crew route. 6-month culinary, guest control, and maritime steward certification." },
          { id: 'dme_dns', label: "OFFICER CADET PATH", sub: "Officer Ingress Pathways", next: 'dns_dme_options', brief: "Technical officer cadet route. 3-year polytechnic marine engineering or 1-year DNS deck officer path." }
        ]
      },
      gp_rating_options: {
        question: "GP RATING SPECIALIZATION",
        subtitle: "Select your shipboard crew node",
        options: [
          { id: 'deck_rating', label: "Deck Rating Crew", sub: "Bridge Controls & Cargo Watch", next: 'success', brief: "Assist deck officers in steering, mooring cargo operations, and maintaining hull structures." },
          { id: 'engine_rating', label: "Engine Rating Crew", sub: "Propulsion & Generator Watch", next: 'success', brief: "Assist marine engineers in boiler monitoring, fuel pumping systems, and diesel engine servicing." }
        ]
      },
      dns_dme_options: {
        question: "OFFICER SPECIALIZATION",
        subtitle: "Choose officer line cadetship",
        options: [
          { id: 'dme_cadet', label: "Diploma Marine Engineering", sub: "3-Year Engineering Cadet", next: 'success', brief: "Direct 3-year technical cadetship leading to Class 4 Marine Engineer Officer certification." },
          { id: 'dns_cadet', label: "DNS (Diploma Nautical Science)", sub: "1-Year Deck Cadet", next: 'success', brief: "Pre-sea training cadet program leading to Second Mate deck officer entry." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹4.5 LPA - ₹18.0 LPA (Starting, Tax-Free)",
      demand: "HIGH",
      roles: ["Deck Rating Cadet", "Engine Rating Associate", "Marine Cook / Steward", "Junior Trainee Officer"],
      description: "Merchant Navy cargo transport operates global logistics. A GP Rating course after 10th gets you directly onboard merchant cargo vessels, handling deck equipment and machinery controls.",
      marketInsight: "International merchant shipping requires a massive influx of rating crews. Ratings with active CDC booklets can earn tax-free wages paid in US Dollars.",
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "88%", color: "text-cyber-cyan" },
        { label: "Sea Jobs", value: "540+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹7.2 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "mar_scanner", name: "Nautical Navigation & COLREGs Assessor", desc: "Evaluates maritime chart reading, COLREGs navigation rules, and marine safety.", icon: "Anchor" },
        { id: "mar_interview", name: "Merchant Navy & IMU-CET Oral Simulator", desc: "Simulates maritime sponsorship interviews, IMU-CET oral exams, and seamanship viva.", icon: "Ship" },
        { id: "mar_explainer", name: "Marine Engine & Weather Dynamics Explainer", desc: "Explains 2-stroke diesel engines, ballast systems, oceanography, and storm navigation.", icon: "Compass" },
        { id: "mar_notepad", name: "Seafarer Logbook & Watchkeeping Notes", desc: "Draft watchkeeping logs, vessel engine hours, and sync to Document Vault.", icon: "BookOpen" }
      ],
      opportunities: [
        { id: "n1", title: "DG Shipping Rating Examination", date: "Sep 01, 2026", tag: "MANDATORY", desc: "Direct enrollment gate for GP Rating theoretical and practical testing.", badgeColor: "bg-red-500/10 text-red-500 border-red-500/30" },
        { id: "n2", title: "Synergy Maritime Cadet Drive", date: "Oct 10, 2026", tag: "APPRENTICESHIP", desc: "Sponsorship drive for rating trainees. Direct ship placement.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "fashion-design": {
    id: "FASHION & DESIGN",
    name: "Fashion & Design",
    colorPalette: {
      primary: "#A855F7",
      secondary: "#9333EA",
      bgGradient: "from-cyber-violet/10 to-transparent",
      glowColor: "rgba(168, 85, 247, 0.4)",
      textMuted: "text-cyber-violet",
      accent: "border-cyber-violet/40 text-cyber-violet bg-cyber-violet/10"
    },
    tree: {
      root: {
        question: "CREATIVE FOUNDATION",
        subtitle: "Select your design path after 10th grade",
        options: [
          { id: 'diploma_fashion', label: "DIPLOMA IN FASHION TECH", sub: "3-Year Apparel Design", next: 'diploma_options', brief: "Learn pattern drafting, apparel manufacturing, smart textiles, and computer-aided design (CAD)." },
          { id: 'iti_tailor', label: "ITI DESIGN & SEWING", sub: "Sewing & Styling (1-2 Yrs)", next: 'iti_options', brief: "Hands-on tailoring, industrial stitching, draping, and dressmaking operations." },
          { id: 'diploma_interior', label: "DIPLOMA IN INTERIOR DESIGN", sub: "3-Year Spatial Layouts", next: 'success', brief: "CAD design, material analysis, floor layouts, spatial styling, and building visual models." }
        ]
      },
      diploma_options: {
        question: "FASHION TECH SPECIALIZATION",
        subtitle: "Select your corporate design node",
        options: [
          { id: 'fashion_design', label: "Apparel Designing", sub: "Garment design & Sketching", next: 'success', brief: "Focus on custom dress sketches, color palettes, textile design, and ramp collection management." },
          { id: 'garment_tech', label: "Garment Technology", sub: "Industrial Apparel Manufacture", next: 'success', brief: "Focus on factory production lines, fabric quality check matrices, and bulk pattern scaling." }
        ]
      },
      iti_options: {
        question: "ITI VOCATIONAL SEWING",
        subtitle: "Select your tailoring trade specialization",
        options: [
          { id: 'sewing_tech', label: "ITI Sewing Technology", sub: "Industrial Stitching & Pattern Maker", next: 'success', brief: "Hands-on calibration of double-needle stitching machines, collar assemblies, and pocket fitments." },
          { id: 'dressmaking', label: "ITI Dressmaking", sub: "Custom Bridal & Boutique Care", next: 'success', brief: "Master custom measurement profiling, body contour draping, and boutique cutting designs." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹2.5 LPA - ₹7.0 LPA (Starting)",
      demand: "STABLE",
      roles: ["Apparel Assistant", "Pattern Coordinator", "Visual Merchandiser", "CAD Pattern Draftsman"],
      description: "Fashion & Design is evolving with smart fabrics and visual mechatronics. Diploma streams directly after 10th emphasize manufacturing setups, design studios, and retail management.",
      marketInsight: "E-Commerce custom apparel is driving a 40% higher need for automated pattern makers skilled in digital CAD design software."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "84%", color: "text-cyber-violet" },
        { label: "Design Jobs", value: "320+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹3.2 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "des_scanner", name: "Apparel Pattern & Fabric Inspector", desc: "Evaluates apparel sketches, fiber tensile ratings, pattern drafting, and CAD specs.", icon: "Palette" },
        { id: "des_interview", name: "NIFT & Design Studio Viva Simulator", desc: "Simulates NIFT studio test viva, fashion portfolio reviews, and brand coordinator interviews.", icon: "Layout" },
        { id: "des_explainer", name: "Garment Technology & Draping Explainer", desc: "Explains fabric weaving physics, double-needle stitching, garment scaling, and color theory.", icon: "Layers" },
        { id: "des_notepad", name: "Fashion Storyboard & Sketch Pad", desc: "Draft garment collections, client measurement profiles, and save to Vault.", icon: "PenTool" }
      ],
      opportunities: [
        { id: "f1", title: "NIFT Diploma Admission Portal", date: "Aug 30, 2026", tag: "ACADEMIC GATE", desc: "Apply for certificate and diploma programs in fashion technology blocks.", badgeColor: "bg-cyber-violet/10 text-cyber-violet border-cyber-violet/30" },
        { id: "f2", title: "Myntra Visual Merchandising Interns", date: "Sep 18, 2026", tag: "CREATIVE DRIVE", desc: "Internship positions for fashion diploma holders. Direct project credits.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "business": {
    id: "BUSINESS",
    name: "Business & FinTech",
    colorPalette: {
      primary: "#EAB308",
      secondary: "#CA8A04",
      bgGradient: "from-cyber-amber/10 to-transparent",
      glowColor: "rgba(234, 179, 8, 0.4)",
      textMuted: "text-cyber-amber",
      accent: "border-cyber-amber/40 text-cyber-amber bg-cyber-amber/10"
    },
    tree: {
      root: {
        question: "COMMERCIAL ENTRY",
        subtitle: "Select your financial/admin path after 10th",
        options: [
          { id: 'inter_cec', label: "INTERMEDIATE CEC (10+2)", sub: "Standard Business & Econ", next: 'success', brief: "Commerce, Economics, Civics. Gateway to professional paths like CA, CS, B.Com, or Finance." },
          { id: 'inter_mec', label: "INTERMEDIATE MEC (10+2)", sub: "Quantitative & FinTech Ingress", next: 'success', brief: "Quant route. Bedrock for FinTech, statistical economics, and financial modeling." },
          { id: 'diploma_dbm', label: "DIPLOMA IN BUSINESS MGMT", sub: "3-Year Business Administration", next: 'diploma_options', brief: "Direct business administration, retail operations, basic accounts, and corporate communication." }
        ]
      },
      diploma_options: {
        question: "BUSINESS DIPLOMA SPECIALIZATION",
        subtitle: "Choose your corporate operational node",
        options: [
          { id: 'dbm_retail', label: "Retail Operations", sub: "Store & Brand Administration", next: 'success', brief: "Focus on supply chain nodes, POS system management, display planning, and stock audits." },
          { id: 'dbm_accounts', label: "Financial Bookkeeping", sub: "Corporate Accounts Assistant", next: 'success', brief: "Focus on double-entry books, billing tallies, tax calculations, and basic spreadsheets." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹3.0 LPA - ₹10.0 LPA (Starting)",
      demand: "HIGH",
      roles: ["Account Analyst Assistant", "Venture Analyst Trainee", "Retail Assistant Manager", "FinTech Operations Assistant"],
      description: "Business & FinTech coordinate global banking transactions and commerce. Entering early via MEC or a business diploma gives you quantitative arithmetic skills needed for financial analysis.",
      marketInsight: "Digital payments and mobile wallet systems have triggered a 50% year-on-year demand increase for junior analysts who understand basic SQL database scripts and ledger records."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "91%", color: "text-cyber-amber" },
        { label: "FinTech Nodes", value: "1,120+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹4.5 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "comm_scanner", name: "Balance Sheet & FinTech Auditor", desc: "Analyzes accounting entries, GST calculations, P&L statements, and audit ledgers.", icon: "BarChart3" },
        { id: "comm_interview", name: "Corporate Finance & Pitch Interviewer", desc: "Simulates CA/CS viva rounds, venture capital pitches, and MBA case interviews.", icon: "Briefcase" },
        { id: "comm_explainer", name: "Taxation & Economic Model Explainer", desc: "Explains macroeconomics, corporate tax structures, stock markets, and banking laws.", icon: "TrendingUp" },
        { id: "comm_notepad", name: "Business Ledger & Venture Notes", desc: "Draft business models, financial projections, and store in Document Vault.", icon: "FileSpreadsheet" }
      ],
      opportunities: [
        { id: "b1", title: "CA Foundation Registration Gate", date: "Sep 10, 2026", tag: "PROFESSIONAL", desc: "Direct enrollment for intermediate commerce graduates to begin accounting path.", badgeColor: "bg-cyber-amber/10 text-cyber-amber border-cyber-amber/30" },
        { id: "b2", title: "Zerodha Tech Apprenticeship", date: "Oct 05, 2026", tag: "FINTECH TRACK", desc: "Special program for MEC students with database skills. Direct training.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "media": {
    id: "MEDIA",
    name: "Media & Communications",
    colorPalette: {
      primary: "#F43F5E",
      secondary: "#E11D48",
      bgGradient: "from-cyber-red/10 to-transparent",
      glowColor: "rgba(244, 63, 94, 0.4)",
      textMuted: "text-cyber-red",
      accent: "border-cyber-red/40 text-cyber-red bg-cyber-red/10"
    },
    tree: {
      root: {
        question: "MEDIA GATEWAY",
        subtitle: "Select your communications path after 10th",
        options: [
          { id: 'diploma_animation', label: "DIPLOMA IN ANIMATION / VFX", sub: "3-Year 3D & Graphics Tech", next: 'success', brief: "Learn 3D rendering, video editing, game environment designs, and audio production." },
          { id: 'cert_journalism', label: "CERT IN BROADCASTING", sub: "Digital Mass Media (1-2 Yrs)", next: 'success', brief: "Hands-on course in news reporting, digital content scripting, podcasting, and camera handling." },
          { id: 'diploma_sound', label: "DIPLOMA IN SOUND ENG.", sub: "2-Year Acoustic Recording", next: 'success', brief: "Master soundboards, audio frequency filtering, noise isolation, and dynamic track mixing." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹2.5 LPA - ₹8.0 LPA (Starting)",
      demand: "HIGH",
      roles: ["Video Editor Associate", "VFX Roto Artist", "Digital Script Writer", "Social Media Coordinator"],
      description: "Digital broadcasting and gaming VFX require skilled technical artists. Creative diplomas after 10th focus heavily on practical tools like Adobe Suite and Blender, skipping theoretical general studies.",
      marketInsight: "Mobile video content production has grown by 150%, making junior video editors and VFX asset creators highly sought after by local creative houses."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "82%", color: "text-cyber-red" },
        { label: "Creative Jobs", value: "620+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹3.5 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "media_scanner", name: "VFX Frame & Headline Inspector", desc: "Evaluates video editing timelines, render layers, SEO headlines, and media scripts.", icon: "Radio" },
        { id: "media_interview", name: "Journalism & Media Viva Simulator", desc: "Simulates news reporting viva, digital content interviews, and audio editing rounds.", icon: "Mic" },
        { id: "media_explainer", name: "Broadcast Tech & Audio Engine Explainer", desc: "Explains soundboard frequencies, camera lighting ratios, noise gating, and video codecs.", icon: "Sparkles" },
        { id: "media_notepad", name: "Broadcast Script & Content Pad", desc: "Draft video scripts, podcast outlines, and save to Document Vault.", icon: "Feather" }
      ],
      opportunities: [
        { id: "me1", title: "Prasad Labs VFX Trainee Program", date: "Sep 08, 2026", tag: "VFX REQUIRED", desc: "6-month on-site lab training on heavy visual effects rendering. Direct hiring path.", badgeColor: "bg-cyber-red/10 text-cyber-red border-cyber-red/30" },
        { id: "me2", title: "WebNews Scriptwriter Openings", date: "Aug 29, 2026", tag: "INTERMEDIATE OR DIPLOMA", desc: "Submit digital writing samples. Junior Content Creator role.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "hospitality": {
    id: "HOSPITALITY",
    name: "Hospitality & Tourism",
    colorPalette: {
      primary: "#FB923C",
      secondary: "#EA580C",
      bgGradient: "from-cyber-orange/10 to-transparent",
      glowColor: "rgba(251, 146, 60, 0.4)",
      textMuted: "text-cyber-orange",
      accent: "border-cyber-orange/40 text-cyber-orange bg-cyber-orange/10"
    },
    tree: {
      root: {
        question: "SERVICE DIRECTIVE",
        subtitle: "Select your hospitality path after 10th",
        options: [
          { id: 'diploma_hm', label: "DIPLOMA IN HOTEL MANAGEMENT", sub: "3-Year Corporate Hospitality", next: 'success', brief: "Master kitchen operations, front office controls, event catering, and guest house relations." },
          { id: 'cert_aviation', label: "CERTIFICATE IN CABIN CREW", sub: "1-2 Year Aviation Services", next: 'success', brief: "Focus on airport logistics, air safety procedures, passenger management, and basic ticketing." },
          { id: 'diploma_tourism', label: "DIPLOMA IN TRAVEL & TOURISM", sub: "2-Year Tour Operations", next: 'success', brief: "Master ticketing GDS software, package pricing formulas, historical site guidance, and visas." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹2.4 LPA - ₹7.5 LPA (Starting)",
      demand: "STABLE",
      roles: ["Front Office Executive", "Aviation Lounge Associate", "Junior Commis Chef", "Event Operations Assistant"],
      description: "Hospitality coordinates luxury tourism and business travel. Diploma training directly after 10th focuses on guest relations and culinary arts, leading to placements in international hotel chains.",
      marketInsight: "Luxury boutique resorts are expanding rapidly, resulting in a 45% increase in immediate recruitment drives for front office staff."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "85%", color: "text-cyber-orange" },
        { label: "Service Jobs", value: "790+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹3.1 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "hot_scanner", name: "Front Office & PMS Occupancy Inspector", desc: "Evaluates hotel occupancy ratios, PMS software ops, and guest service standards.", icon: "Hotel" },
        { id: "hot_interview", name: "Hotel Manager & Culinary Viva Simulator", desc: "Simulates NCHMCT JEE interviews, resort management rounds, and culinary viva.", icon: "Utensils" },
        { id: "hot_explainer", name: "Culinary Arts & FSSAI Safety Explainer", desc: "Explains FSSAI food safety, wine pairing, banquet ops, and kitchen hygiene.", icon: "Coffee" },
        { id: "hot_notepad", name: "Hospitality Event & Service Notes", desc: "Record event plans, menu designs, and save to Document Vault.", icon: "Clipboard" }
      ],
      opportunities: [
        { id: "h1", title: "Taj Hotels Trainee Intake", date: "Sep 14, 2026", tag: "DIPLOMA TARGET", desc: "Hiring drive for front office and kitchen trainees. Direct interviews.", badgeColor: "bg-cyber-orange/10 text-cyber-orange border-cyber-orange/30" },
        { id: "h2", title: "IndiGo Ground Crew Recruitment", date: "Oct 01, 2026", tag: "CERTIFICATE OPEN", desc: "Direct recruitment walk-in at regional airport hubs.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "agriculture": {
    id: "AGRICULTURE",
    name: "Agri-Tech & Bio-Farming",
    colorPalette: {
      primary: "#84CC16",
      secondary: "#65A30D",
      bgGradient: "from-cyber-lime/10 to-transparent",
      glowColor: "rgba(132, 204, 22, 0.4)",
      textMuted: "text-cyber-lime",
      accent: "border-cyber-lime/40 text-cyber-lime bg-cyber-lime/10"
    },
    tree: {
      root: {
        question: "AGRI-SYSTEM GATE",
        subtitle: "Select your agricultural path after 10th",
        options: [
          { id: 'diploma_agri', label: "DIPLOMA IN AGRICULTURE", sub: "3-Year Farm Technology", next: 'success', brief: "Learn smart soil nutrients, drone field scanning, automated irrigation, and pest management." },
          { id: 'diploma_horti', label: "DIPLOMA IN HORTICULTURE", sub: "3-Year Crop & Nursery Tech", next: 'success', brief: "Focus on greenhouse operations, fruit breeding, botanical design, and floriculture nodes." },
          { id: 'diploma_organic', label: "DIPLOMA IN ORGANIC FARMING", sub: "2-Year Sustainable Agro", next: 'success', brief: "Learn composting science, biological pest control, organic certifications, and crop rotation." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹2.2 LPA - ₹6.0 LPA (Starting)",
      demand: "STABLE",
      roles: ["Soil Testing Technician", "Greenhouse Coordinator", "Precision Farm Assistant", "Drone Surveyor Trainee"],
      description: "Agri-Tech integrates automation with bio-farming. Post-10th diplomas prepare students for government testing labs, private seed companies, and greenhouse management.",
      marketInsight: "Drip-irrigation and precision farming automation have created a high demand for technicians who understand soil humidity metrics and drone scanning."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "87%", color: "text-cyber-lime" },
        { label: "Agri Jobs", value: "480+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹2.9 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "agri_scanner", name: "Agronomy & Soil Diagnostics Assessor", desc: "Analyzes soil NPK levels, crop pathology, irrigation telemetry, and fertilizer ratios.", icon: "Sprout" },
        { id: "agri_interview", name: "Agri-Business & ICAR Viva Simulator", desc: "Simulates ICAR entrance viva, Agri-Officer interviews, and organic farm management.", icon: "Sun" },
        { id: "agri_explainer", name: "Hydroponics & Drone Flight Explainer", desc: "Explains crop genetics, pest management, hydroponic setups, and drone spraying.", icon: "Leaf" },
        { id: "agri_notepad", name: "Crop Yield & Harvest Log Pad", desc: "Record field observations, soil test results, and sync to Vault.", icon: "FileSpreadsheet" }
      ],
      opportunities: [
        { id: "a1", title: "State Soil Testing Labs Intake", date: "Sep 22, 2026", tag: "GOVT JOBS", desc: "Direct recruitment for Junior Soil Analysts. Written test details.", badgeColor: "bg-cyber-lime/10 text-cyber-lime border-cyber-lime/30" },
        { id: "a2", title: "AgriDrone Apprenticeship Program", date: "Aug 29, 2026", tag: "TECH TRACK", desc: "Learn crop telemetry and drone piloting at top agro-tech startups.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "automobile": {
    id: "AUTOMOBILE",
    name: "Automobile & EV Tech",
    colorPalette: {
      primary: "#EF4444",
      secondary: "#DC2626",
      bgGradient: "from-cyber-red/10 to-transparent",
      glowColor: "rgba(239, 68, 68, 0.4)",
      textMuted: "text-cyber-red",
      accent: "border-cyber-red/40 text-cyber-red bg-cyber-red/10"
    },
    tree: {
      root: {
        question: "POWERTRAIN DIRECTIVE",
        subtitle: "Select your automotive path after 10th",
        options: [
          { id: 'diploma_auto', label: "DIPLOMA IN AUTOMOBILE ENG.", sub: "3-Year Vehicle Technology", next: 'success', brief: "Master internal combustion engines, EV chassis systems, battery diagnostics, and crash safety." },
          { id: 'iti_mechanic', label: "ITI MOTOR VEHICLE MECHANIC", sub: "Hands-on Servicing (1-2 Yrs)", next: 'success', brief: "Focus on workshop repairs, engine tune-ups, tire alignment, and hydraulic brakes." },
          { id: 'cert_ev', label: "CERTIFICATE IN EV SYSTEMS", sub: "1-Year EV Tech Specialist", next: 'success', brief: "Focus on battery management cells, EV wiring, safety fuses, and mechatronic dashboard alerts." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹3.0 LPA - ₹8.5 LPA (Starting)",
      demand: "HIGH",
      roles: ["EV Battery Technician", "Chassis Assembler", "Automobile Service Executive", "Junior CAD Modeler"],
      description: "Automobile technology is shifting to Electric Vehicles. Diploma training directly after 10th provides immediate entry into EV assembly lines, charging node setups, and automotive workshops.",
      marketInsight: "State policies promoting local EV assembly have generated a 60% increase in job opportunities for mechanics who understand battery thermal runaways."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "90%", color: "text-cyber-red" },
        { label: "Auto Jobs", value: "980+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹3.6 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "auto_scanner", name: "EV Battery & Chassis Inspector", desc: "Evaluates battery cell thermal management, ICE engines, and brake hydraulics.", icon: "Car" },
        { id: "auto_interview", name: "Automotive & EV Tech Viva Simulator", desc: "Simulates OEM service technician interviews, EV assembly viva, and CAD modeling rounds.", icon: "Wrench" },
        { id: "auto_explainer", name: "Powertrain & Torque Vectoring Explainer", desc: "Explains combustion stoichiometry, battery management systems (BMS), and transmission.", icon: "Sparkles" },
        { id: "auto_notepad", name: "Vehicle Diagnostics & Tune-up Notes", desc: "Record engine diagnostic codes, battery voltages, and save to Vault.", icon: "BookOpen" }
      ],
      opportunities: [
        { id: "au1", title: "Maruti Suzuki Technical Trainees", date: "Sep 09, 2026", tag: "DIPLOMA ONLY", desc: "Recruitment drive for automobile and mechanical diploma students. Direct onboarding.", badgeColor: "bg-cyber-red/10 text-cyber-red border-cyber-red/30" },
        { id: "au2", title: "Ola Electric Assembly Openings", date: "Oct 12, 2026", tag: "ITI MECHANIC REQUIRED", desc: "Walk-in drive for EV battery installation operators at Ola Gigafactory.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "construction": {
    id: "CONSTRUCTION",
    name: "Construction & Civil",
    colorPalette: {
      primary: "#14B8A6",
      secondary: "#0D9488",
      bgGradient: "from-cyber-teal/10 to-transparent",
      glowColor: "rgba(20, 184, 166, 0.4)",
      textMuted: "text-cyber-teal",
      accent: "border-cyber-teal/40 text-cyber-teal bg-cyber-teal/10"
    },
    tree: {
      root: {
        question: "STRUCTURAL DIRECTIVE",
        subtitle: "Select your civil path after 10th",
        options: [
          { id: 'diploma_civil', label: "DIPLOMA IN CIVIL ENG.", sub: "3-Year Structural Layouts", next: 'success', brief: "Learn concrete mix design, structural drawing, surveying, and basic BIM modeling." },
          { id: 'iti_draftsman', label: "ITI DRAFTSMAN CIVIL / SURVEY", sub: "CAD Drafting & Plan (2 Yrs)", next: 'success', brief: "Focus on AutoCAD layout plans, blueprint trace techniques, leveling math, and site mapping." },
          { id: 'cert_supervisor', label: "CERT SITE SUPERVISOR", sub: "1-Year Construction Site Ops", next: 'success', brief: "Learn concrete testing ratios, site safety records, labor logistics, and stock management." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹2.6 LPA - ₹7.0 LPA (Starting)",
      demand: "STABLE",
      roles: ["Site Supervisor Assistant", "CAD Draftsman Civil", "Land Surveyor Trainee", "Quality Lab Assistant"],
      description: "Construction and Civil pathways implement infrastructure plans. Entering via a 3-year diploma provides site training, concrete quality control, and GPS-based land surveying.",
      marketInsight: "Smart city initiatives have created a steady demand for drafting specialists who can render 3D modeling plans using AutoCAD."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "86%", color: "text-cyber-teal" },
        { label: "Site Jobs", value: "710+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹3.3 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "con_scanner", name: "Concrete Mix & Survey Plotter", desc: "Evaluates concrete slump tests, structural CAD blueprints, and GPS surveying.", icon: "Building2" },
        { id: "con_interview", name: "Civil Site Supervisor Viva Simulator", desc: "Simulates site engineering interviews, L&T trainee viva, and surveyor rounds.", icon: "HardHat" },
        { id: "con_explainer", name: "Structural Stress & BIM Explainer", desc: "Explains beam load capacities, soil bearing pressure, BIM 3D models, and RCC ratios.", icon: "Compass" },
        { id: "con_notepad", name: "Construction Site & Material Log", desc: "Record site material stock, concrete pour ratios, and save to Vault.", icon: "Clipboard" }
      ],
      opportunities: [
        { id: "co1", title: "L&T Construction Site Trainees", date: "Sep 28, 2026", tag: "DIPLOMA CIVIL", desc: "On-site apprenticeship program for civil diploma students. Direct project credits.", badgeColor: "bg-cyber-teal/10 text-cyber-teal border-cyber-teal/30" },
        { id: "co2", title: "Municipal Corporation Survey Drive", date: "Aug 31, 2026", tag: "GOVT INTERN", desc: "Assist in metro survey lines. Open for ITI Draftsman certificate holders.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "beauty-wellness": {
    id: "BEAUTY & WELLNESS",
    name: "Beauty & Wellness",
    colorPalette: {
      primary: "#F472B6",
      secondary: "#DB2777",
      bgGradient: "from-cyber-pink/10 to-transparent",
      glowColor: "rgba(244, 114, 182, 0.4)",
      textMuted: "text-cyber-pink",
      accent: "border-cyber-pink/40 text-cyber-pink bg-cyber-pink/10"
    },
    tree: {
      root: {
        question: "WELLNESS GATEWAY",
        subtitle: "Select your wellness path after 10th",
        options: [
          { id: 'diploma_cosmetology', label: "DIPLOMA IN COSMETOLOGY", sub: "Aesthetics & Skincare (1-2 Yrs)", next: 'success', brief: "Learn chemical skin treatments, hair styling, bridal aesthetics, and salon management." },
          { id: 'cert_nutrition', label: "CERTIFICATE IN DIETETICS", sub: "Holistic Health & Diet (1 Yr)", next: 'success', brief: "Focus on calorie metrics, therapeutic diet setups, organic nutrition, and gym consultations." },
          { id: 'diploma_spa', label: "DIPLOMA IN SPA THERAPY", sub: "1-Year Body Therapy & Massage", next: 'success', brief: "Learn body muscular anatomy, essential oil blends, therapy methods, and resort spa operations." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹2.0 LPA - ₹6.0 LPA (Starting)",
      demand: "STABLE",
      roles: ["Beauty Therapist", "Hair Stylist Associate", "Diet Assistant", "Salon Operations Coordinator"],
      description: "Beauty & Cosmetology operate in retail and personal services. Short-term certifications after 10th provide direct hands-on workshop hours and options to start your own studio.",
      marketInsight: "The premium bridal styling market is growing at a compound rate of 25%, resulting in a high demand for certified cosmetologists."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "80%", color: "text-cyber-pink" },
        { label: "Salon Jobs", value: "410+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹2.6 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "beauty_scanner", name: "Cosmetology & Skin Diagnostics Inspector", desc: "Analyzes dermal pH levels, skin hydration, hair chemistry, and aesthetic formulas.", icon: "Sparkles" },
        { id: "beauty_interview", name: "Wellness Specialist & Diet Viva Simulator", desc: "Simulates salon franchise interviews, nutritionist viva, and spa therapist rounds.", icon: "UserCheck" },
        { id: "beauty_explainer", name: "Macronutrients & Dermal Science Explainer", desc: "Explains skin barrier repair, essential oils, calorie balance, and salon hygiene.", icon: "Heart" },
        { id: "beauty_notepad", name: "Client Wellness & Dietetic Notes", desc: "Record client skin profiles, diet recommendations, and store in Vault.", icon: "BookOpen" }
      ],
      opportunities: [
        { id: "w1", title: "Lakme Academy Apprenticeship", date: "Sep 07, 2026", tag: "CERTIFICATE OPEN", desc: "Hands-on junior therapist training under Lakme franchise mentors.", badgeColor: "bg-cyber-pink/10 text-cyber-pink border-cyber-pink/30" },
        { id: "w2", title: "VLCC Nutritionist Trainees", date: "Aug 29, 2026", tag: "NUTRITION TARGET", desc: "Openings for basic dietetic certificate holders. Direct customer coaching.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  },
  "retail-logistics": {
    id: "RETAIL & LOGISTICS",
    name: "Retail & Global Logistics",
    colorPalette: {
      primary: "#6366F1",
      secondary: "#4F46E5",
      bgGradient: "from-cyber-indigo/10 to-transparent",
      glowColor: "rgba(99, 102, 241, 0.4)",
      textMuted: "text-cyber-indigo",
      accent: "border-cyber-indigo/40 text-cyber-indigo bg-cyber-indigo/10"
    },
    tree: {
      root: {
        question: "SUPPLY CHAIN GATE",
        subtitle: "Select your logistics path after 10th",
        options: [
          { id: 'diploma_scm', label: "DIPLOMA IN SUPPLY CHAIN", sub: "3-Year Warehousing Tech", next: 'success', brief: "Learn automated sorting, barcode ledger operations, stock replenishment, and delivery routing." },
          { id: 'cert_retail', label: "CERTIFICATE IN RETAIL SALES", sub: "E-Commerce & Store Ops (1 Yr)", next: 'success', brief: "Focus on product invoicing, customer relations, visual store boards, and checkout POS nodes." }
        ]
      }
    },
    awareness: {
      salaryRange: "₹2.5 LPA - ₹6.8 LPA (Starting)",
      demand: "HIGH",
      roles: ["Inventory Controller", "Warehouse Dispatch Trainee", "POS Invoicing Associate", "Logistics Coordinator Assistant"],
      description: "Supply Chain & Retail operate global product transit nodes. A logistics diploma after 10th bypasses general theory to focus on inventory records, cargo tracking, and e-commerce distribution.",
      marketInsight: "E-commerce warehousing networks are expanding rapidly, resulting in a 75% rise in recruitment for certified cargo dispatch coordinators."
    },
    dashboard: {
      stats: [
        { label: "Sync Index", value: "89%", color: "text-cyber-indigo" },
        { label: "Dispatch Jobs", value: "1,030+", color: "text-cyber-blue" },
        { label: "Avg Package", value: "₹3.4 LPA", color: "text-cyber-magenta" }
      ],
      tools: [
        { id: "retail_scanner", name: "Warehouse Stock & Barcode Auditor", desc: "Analyzes package transit weights, barcode ledgers, and e-commerce inventory.", icon: "Truck" },
        { id: "retail_interview", name: "Supply Chain & Retail Viva Simulator", desc: "Simulates warehouse operations interviews, Amazon logi-tech viva, and POS sales rounds.", icon: "Package" },
        { id: "retail_explainer", name: "Delivery Routing & SCM Explainer", desc: "Explains automated sorting nodes, fleet fuel optimization, POS invoicing, and GDS.", icon: "MapPin" },
        { id: "retail_notepad", name: "Inventory Dispatch & Cargo Notes", desc: "Draft shipment manifests, warehouse stock logs, and sync to Vault.", icon: "FileSpreadsheet" }
      ],
      opportunities: [
        { id: "r1", title: "Amazon Logi-Tech Internship", date: "Sep 18, 2026", tag: "SCM REQUIRED", desc: "Trainee program in automated sort centers. Learn barcode and scanner setups.", badgeColor: "bg-cyber-indigo/10 text-cyber-indigo border-cyber-indigo/30" },
        { id: "r2", title: "Reliance Retail Store Walk-in", date: "Aug 30, 2026", tag: "SALES TARGET", desc: "Hiring drive for customer-facing billing operations at major outlets.", badgeColor: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40" }
      ]
    }
  }
};
