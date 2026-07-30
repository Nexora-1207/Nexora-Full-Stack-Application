// src/data/roadmaps.ts
/**
 * Comprehensive roadmap data for all career categories.
 * Each entry follows the same structure as the Engineering roadmap.
 * The data is based on current Indian education and industry standards.
 */
export const ROADMAPS = {
  skilledTrades: {
    overview: "Skilled Trades encompass a wide range of technical occupations that require hands‑on expertise, often acquired through ITI, diploma, apprenticeship or certification programs.",
    eligibility: "10th pass for ITI, 12th (PCM/PCB) for diploma, age 16‑30 years.",
    academicPath: {
      foundation: "ITI (3‑year courses) or Diploma (3‑year) in relevant trade.",
      intermediate: "After 10th, join ITI (NCVT/SCVT) or diploma.",
      diploma: "Diploma in Electrical, Mechanical, Civil etc.",
      apprenticeship: "Apprenticeship schemes under PMKVY, Skill India.",
    },
    entranceExams: {
      itis: "JNVIT, State ITI entrance (if applicable)",
      diplomas: "State diploma entrance exams",
    },
    requiredSkills: ["Technical aptitude", "Manual dexterity", "Safety awareness", "Basic maths"],
    technicalSkills: {
      electrician: ["Wiring", "Installation", "Maintenance"],
      fitter: ["Machinery assembly", "Precision fitting"],
      welder: ["MIG/TIG welding", "Safety protocols"],
      mechanic: ["Engine diagnostics", "Repair"],
      cncOperator: ["CNC programming", "Machine operation"],
      plumber: ["Pipe fitting", "Sanitation systems"],
      carpenter: ["Woodworking", "Joinery"],
      automobileTechnician: ["Vehicle maintenance", "Diagnostics"]
    },
    softSkills: ["Communication", "Teamwork", "Problem solving", "Time management"],
    certifications: [
      "NCVT", "SCVT", "PMKVY certification", "NSDC skill certification"
    ],
    internships: "Apprenticeship with PSU/ private workshops (e.g., BHEL, L&T, Tata Motors).",
    projects: "Create a functional device: e.g., a solar inverter, a CNC‑cut prototype, or a plumbing system design.",
    portfolio: "Document all projects with photos, schematics and performance metrics.",
    licensing: "Trade license where required (e.g., electrician registration).",
    governmentExams: "SSC Trade exams, Railway Technical posts.",
    privateJobs: "Industrial maintenances, OEMs, construction firms, automotive service centers.",
    higherEducation: "B.Tech (Mechanical, Electrical) after diploma via lateral entry.",
    salaryRange: {
      entry: "₹2.5‑4 LPA",
      mid: "₹5‑8 LPA",
      senior: "₹9‑15 LPA"
    },
    careerGrowth: "Progress to senior technician, supervisor, foreman, then manager.",
    futureDemand: "High demand due to infrastructure push, renewable energy, automation.",
    topRecruiters: ["L&T", "BHEL", "Tata Motors", "Mahindra & Mahindra", "Siemens", "JSW Steel"],
    studyResources: [
      "NCVT syllabus PDF", "SkillIndia portal", "YouTube channels: Technical Guruji (Trade), Edurev ITI"],
    recommendedWebsites: ["https://skillindia.gov.in", "https://www.ncert.nic.in", "https://www.nptel.ac.in"],
    roadmapTimeline: {
      beginner: "Complete ITI/Diploma (3 yrs)",
      intermediate: "Apprenticeship + 1 yr experience",
      advanced: "Specialization certification (e.g., CNC) and 2‑3 yrs experience",
      expert: "Lead projects, become trainer or supervisor"
    },
    finalSuccessChecklist: [
      "Completed ITI/Diploma", "Obtained relevant certification", "2 yrs hands‑on experience", "Portfolio of 3+ projects", "Secured a job with growth path"
    ]
  },
  computers: {
    overview: "Computer science offers multiple pathways from foundational programming to advanced AI and cloud engineering.",
    eligibility: "10th pass → 12th (PCM/PCB) → entrance exams for degree/diploma.",
    academicPath: {
      foundation: "Intermediate (MPC) or 12th science.",
      diploma: "Diploma in Computer Engineering (3 yrs).",
      degree: "B.Tech/B.Sc Computer Science (4 yrs) – lateral entry possible after diploma.",
      iti: "ITI COPA (Computer Operator and Programming Assistant) – 1 yr.",
      directCoding: "Online coding bootcamps, certifications (e.g., Coursera, Udacity)."
    },
    entranceExams: {
      engineering: "JEE Main, JEE Advanced, state engineering exams.",
      diploma: "State diploma entrance, NIMCET.",
      ITI: "JBPR (Jawahar Navodaya) ITI entrance where applicable."
    },
    requiredSkills: ["Logical thinking", "Problem solving", "Mathematics", "Algorithmic mindset"],
    technicalSkills: {
      softwareDev: ["JavaScript/TypeScript", "React/React‑Native", "Node.js", "Version control (Git)"],
      ai: ["Python", "TensorFlow/PyTorch", "Data preprocessing"],
      ml: ["Scikit‑learn", "Statistical modeling"],
      cybersecurity: ["Network security", "Ethical hacking", "CISSP basics"],
      cloud: ["AWS, Azure, GCP services", "Docker, Kubernetes"],
      networking: ["CCNA concepts", "TCP/IP"],
      dataScience: ["Python/R", "Pandas, NumPy", "Visualization (Tableau)"],
      uiux: ["Figma", "Adobe XD", "User research"],
      gameDev: ["Unity, Unreal Engine", "C#", "Graphics programming"]
    },
    softSkills: ["Collaboration", "Communication", "Agile mindset", "Time management"],
    certifications: [
      "AWS Certified Solutions Architect", "Microsoft Certified: Azure Fundamentals", "Cisco CCNA", "CompTIA Security+", "Google Professional Data Engineer", "Oracle Certified Java Programmer", "Meta Front‑End Developer"
    ],
    internships: "Software companies, startups, research labs – 3‑6 months.",
    projects: "Build a full‑stack app, contribute to open‑source, develop ML model, create a game prototype.",
    portfolio: "GitHub repos, live demos, tech blog, LinkedIn showcase.",
    licensing: null,
    governmentExams: "UPSC IT officer, Indian Navy IT & Network, ISRO technical posts.",
    privateJobs: "Software developer, data analyst, cloud engineer, cybersecurity analyst.",
    higherEducation: "M.Tech, MS, MBA (Tech), PhD in CS/AI.",
    salaryRange: {
      entry: "₹4‑6 LPA",
      mid: "₹9‑15 LPA",
      senior: "₹20‑35 LPA"
    },
    careerGrowth: "Junior Developer → Senior → Lead → Architect → CTO.",
    futureDemand: "Very high due to digital transformation, AI, cloud adoption.",
    topRecruiters: ["Google", "Microsoft", "Amazon", "Infosys", "TCS", "Accenture", "Flipkart", "Zomato", "Paytm", "Reliance Jio"],
    studyResources: ["NPTEL courses", "GeeksforGeeks", "LeetCode", "Coursera", "Udemy", "EdX"],
    recommendedWebsites: ["https://www.hackerrank.com", "https://www.freecodecamp.org", "https://github.com"],
    roadmapTimeline: {
      beginner: "Complete diploma/online bootcamp (6‑12 mo)",
      intermediate: "Earn certifications + 1‑2 yr experience",
      advanced: "Specialize (AI, Cloud, Cyber) + 3‑5 yr experience",
      expert: "Lead teams, architect solutions, mentor"
    },
    finalSuccessChecklist: [
      "B.Tech or equivalent diploma", "2‑3 yr relevant project experience", "Portfolio with 3+ live projects", "Relevant certifications", "Job offer in chosen domain"
    ]
  },
  medicalSupport: {
    overview: "Medical support includes nursing, paramedical, lab technology, physiotherapy, radiology and related fields that assist patient care.",
    eligibility: "10th pass → 12th (PCB) → entrance exams for diploma/degree.",
    academicPath: {
      foundation: "Intermediate (BiPC) or 12th science.",
      diploma: "Diploma in Nursing, Paramedical, Lab Technology (3 yrs).",
      degree: "B.Sc Nursing, BPT (Physiotherapy), B.Pharm, BMLT (Medical Lab Technology) – 4 yrs.",
      certification: "Short‑term certifications (e.g., ECG, Phlebotomy)."
    },
    entranceExams: {
      nursing: "NEET UG (for B.Sc Nursing) & state nursing entrance.",
      paramedical: "AIIMS PG (for advanced) & state level exams.",
      labTech: "State diploma entrance"
    },
    requiredSkills: ["Attention to detail", "Empathy", "Manual dexterity", "Basic medical terminology"],
    technicalSkills: {
      nursing: ["Patient care", "Medication administration", "Vital signs monitoring"],
      physiotherapy: ["Therapeutic exercises", "Rehabilitation protocols"],
      labTech: ["Sample collection", "Microscopy", "Biochemistry assays"],
      radiology: ["X‑ray operation", "Imaging safety"],
      optometry: ["Visual acuity tests", "Lens fitting"]
    },
    softSkills: ["Communication", "Teamwork", "Stress management", "Ethical practice"],
    certifications: ["Basic Life Support (BLS)", "Advanced Cardiac Life Support (ACLS)", "ECG technician", "Phlebotomy certification"],
    internships: "Hospital rotations (6‑12 mo) for nursing and paramedical students.",
    projects: "Community health camp organization, research poster on a medical topic.",
    portfolio: "Logbook of clinical procedures, certificates, case study write‑ups.",
    licensing: "State nursing registration, Medical Lab Technologist license where applicable.",
    governmentExams: "State health service exams, ASHA recruitment, AIIMS nursing exams.",
    privateJobs: "Private hospitals, diagnostic labs, physiotherapy clinics, NGOs.",
    higherEducation: "M.Sc Nursing, MPT, M.Sc Lab Technology, MD (specialty), MPH.",
    salaryRange: {
      entry: "₹2‑3.5 LPA",
      mid: "₹4‑7 LPA",
      senior: "₹8‑12 LPA"
    },
    careerGrowth: "Staff Nurse → Senior Nurse → Nurse Manager → Hospital Administrator.",
    futureDemand: "Growing due to aging population and expanding healthcare infrastructure.",
    topRecruiters: ["Apollo Hospitals", "AIIMS", "Fortis", "Manipal", "Narayana Health", "Sun Pharma"],
    studyResources: ["Nursing Council of India", "NPTEL health courses", "YouTube: Dr. Niroj’s Nursing tutorials"],
    recommendedWebsites: ["https://www.nursingcouncilofindia.org", "https://www.aiims.edu", "https://www.ncbi.nlm.nih.gov"],
    roadmapTimeline: {
      beginner: "Complete diploma/ nursing certificate (3 yrs)",
      intermediate: "Gain 1‑2 yr clinical experience + certification",
      advanced: "Pursue degree & specialization (4‑5 yr)",
      expert: "Leadership roles, advanced clinical practice"
    },
    finalSuccessChecklist: [
      "Registered nurse or certified paramedical tech", "2 yr clinical experience", "Relevant certifications", "Portfolio of case studies"
    ]
  },
  merchantNavy: {
    overview: "Merchant navy careers involve navigation, engineering, and logistics on commercial vessels.",
    eligibility: "10th pass → 12th (MPC) → pass maritime entrance exams.",
    academicPath: {
      foundation: "Intermediate (MPC)",
      diploma: "B.Sc Nautical Science (3 yrs) or B.Tech Marine Engineering (4 yrs)",
      cadetTraining: "Pre‑seagoing training (30 days) + onboard training (12‑months)."
    },
    entranceExams: {
      nautScience: "IMU CET (Indian Maritime University)", 
      marineEng: "DG Shipping approved institutes entrance"
    },
    requiredSkills: ["Mathematics", "Physics", "Navigation basics", "Mechanical aptitude"],
    technicalSkills: {
      deckCadet: ["Celestial navigation", "Radar operation", "Ship handling"],
      engineCadet: ["Marine propulsion", "Engine maintenance", "Safety drills"]
    },
    softSkills: ["Discipline", "Teamwork", "Adaptability", "Communication"],
    certifications: ["STCW Basic Safety Training", "GMDSS License", "Radar Endorsement"],
    internships: "Onboard training with shipping companies (12 months).",
    projects: "Navigation simulation project, engine performance analysis.",
    portfolio: "Logbook of sea time, certificates, navigation charts.",
    licensing: "DG Shipping seafarer’s continuous discharge certificate (CDB).",
    governmentExams: "DG Shipping exams for officer ranks.",
    privateJobs: "Commercial vessels, tankers, container ships, cruise liners.",
    higherEducation: "M.Sc Marine Navigation, M.Tech Marine Engineering.",
    salaryRange: {
      entry: "₹3‑5 LPA (cadet)",
      mid: "₹7‑12 LPA (3rd/4th officer)",
      senior: "₹15‑30 LPA (Chief Officer/Chief Engineer)"
    },
    careerGrowth: "Cadet → 3rd Officer → 2nd Officer → Chief Officer → Captain (Deck) / Engine Cadet → 4th Engineer → 3rd Engineer → Chief Engineer.",
    futureDemand: "Steady demand due to global trade growth and containerization.",
    topRecruiters: ["Maersk", "CMA CGM", "MSC", "NYK Line", "Shipping India Ltd.", "Bernard Drew"],
    studyResources: ["IMU syllabus", "Marine Engineering textbooks", "Navigation simulation software"],
    recommendedWebsites: ["https://www.imuglobal.ac.in", "https://www.dgshipping.gov.in"],
    roadmapTimeline: {
      beginner: "Complete B.Sc Nautical Science (3 yrs)",
      intermediate: "Pre‑seagoing training + 12 mo onboard", 
      advanced: "Promote to officer ranks (3‑5 yrs)",
      expert: "Achieve Captain/Chief Engineer status"
    },
    finalSuccessChecklist: ["Degree in Nautical Science/Marine Eng", "STCW certification", "12 mo sea time", "Officer rank appointment"]
  },
  hospitality: {
    overview: "Hospitality covers hotel, tourism, travel, event and cruise management.",
    eligibility: "10th pass → 12th (any stream) → diploma/degree.",
    academicPath: {
      foundation: "Intermediate (any)",
      diploma: "Diploma in Hospitality Management (3 yrs)",
      degree: "B.Sc Hospitality & Hotel Management (3‑4 yrs)"
    },
    entranceExams: {
      hospitalityDegree: "State university entrance, AICTE approved colleges",
      hotelDiploma: "JEE Main (for some institutes)"
    },
    requiredSkills: ["Customer service", "Multilingual ability", "Organizational skills", "Attention to detail"],
    technicalSkills: {
      frontOffice: ["Reservation systems (Opera)", "Check‑in/out procedures"],
      foodProduction: ["Kitchen operations", "Food safety (FSSAI)"],
      housekeeping: ["Room maintenance", "Inventory management"],
      eventMgmt: ["Event planning", "Vendor coordination"]
    },
    softSkills: ["Communication", "Problem solving", "Cultural sensitivity"],
    certifications: ["Hotel Management Certificate (IHM)", "Culinary Arts Diploma", "Certified Hospitality Trainer (CHT)"],
    internships: "Hotel or resort internships (3‑6 months).",
    projects: "Design a boutique hotel concept, organize a mock event.",
    portfolio: "Photos of event setups, SOP documents, guest feedback analysis.",
    licensing: null,
    governmentExams: "All India Services – Tourism Officer, State tourism exams.",
    privateJobs: "Hotel chains, boutique hotels, cruise ships, travel agencies.",
    higherEducation: "MBA Hospitality, M.Sc Tourism Management.",
    salaryRange: {
      entry: "₹2‑3.5 LPA",
      mid: "₹5‑9 LPA",
      senior: "₹12‑20 LPA"
    },
    careerGrowth: "Supervisor → Manager → Operations Manager → Director.",
    futureDemand: "Growth driven by tourism, MICE (meetings, incentives, conferences) sector.",
    topRecruiters: ["Taj Hotels", "Oberoi", "Marriott", "Hyatt", "ITC Hotels", "Airlines – IndiGo, Air India"],
    studyResources: ["IHM curriculum", "Hotel Management MOOCs", "Hospitality textbooks"],
    recommendedWebsites: ["https://www.ihm.net.in", "https://www.hospitalitynet.org"],
    roadmapTimeline: {
      beginner: "Complete diploma (3 yrs) or degree (3‑4 yrs)",
      intermediate: "Internship + 1‑2 yr entry‑level role",
      advanced: "Management certification + 3‑5 yr experience",
      expert: "Director/General Manager role"
    },
    finalSuccessChecklist: ["Degree/diploma", "3 yr hospitality experience", "Management certification", "Portfolio of projects"]
  },
  fashionDesign: {
    overview: "Fashion & design includes apparel, graphic, textile, interior, jewellery and UI design.",
    eligibility: "10th pass → 12th (any) → design school/diploma.",
    academicPath: {
      foundation: "Intermediate (any)",
      diploma: "Diploma in Fashion Designing (2‑3 yrs)",
      degree: "B.Des Fashion & Design (4 yrs)"
    },
    entranceExams: {
      designDegree: "NIFT/ NID entrance, UCEED, state art college exams"
    },
    requiredSkills: ["Creativity", "Sketching", "Trend awareness", "Attention to detail"],
    technicalSkills: {
      fashionDesign: ["Pattern making", "Garment construction", "Fabric knowledge"],
      graphicDesign: ["Adobe Photoshop", "Illustrator", "Brand identity"],
      textileDesign: ["Weave patterns", "Print design"],
      interiorDesign: ["AutoCAD", "3D rendering (SketchUp)"],
      uiDesign: ["Figma", "Wireframing", "User research"]
    },
    softSkills: ["Communication", "Client handling", "Time management"],
    certifications: ["Adobe Certified Expert (ACE)", "Fashion Designing Certificate (IIFT)"],
    internships: "Design studios, fashion houses, advertising agencies (3‑6 mo).",
    projects: "Create a seasonal collection, brand identity package, UI kit.",
    portfolio: "Physical and digital portfolio (Behance, Dribbble).",
    licensing: null,
    governmentExams: "National Design Exams (NID), UCEED.",
    privateJobs: "Design firms, apparel brands, media houses, freelance.",
    higherEducation: "M.Des, MBA (Design Management).",
    salaryRange: {
      entry: "₹2‑4 LPA",
      mid: "₹6‑12 LPA",
      senior: "₹15‑25 LPA"
    },
    careerGrowth: "Junior Designer → Senior Designer → Art Director → Creative Director.",
    futureDemand: "High demand for digital design, sustainable fashion, UI/UX.",
    topRecruiters: ["Lakmé Fashion Week", "FabIndia", "Tata Motors (design)", "Adobe", "Google (UI)"],
    studyResources: ["NIFT syllabus", "Design blogs", "YouTube: Satori Graphics"],
    recommendedWebsites: ["https://www.nift.ac.in", "https://www.behance.net"],
    roadmapTimeline: {
      beginner: "Diploma or foundation course (2‑3 yrs)",
      intermediate: "Internship + portfolio building",
      advanced: "Degree + specialization (4 yrs)",
      expert: "Lead design team, launch own brand"
    },
    finalSuccessChecklist: ["Portfolio with 10+ projects", "Relevant degree/cert", "Internship experience", "Job offer in design"]
  },
  media: {
    overview: "Media careers span journalism, film, photography, video, content creation and digital marketing.",
    eligibility: "10th pass → 12th (any) → diploma/degree in mass communication.",
    academicPath: {
      foundation: "Intermediate (any)",
      diploma: "Diploma in Mass Communication (2‑3 yrs)",
      degree: "B.A./B.Sc Media & Communication (3‑4 yrs)"
    },
    entranceExams: {
      mediaDegree: "State university entrance, JIPMER for medical journalism, AICTE approved colleges"
    },
    requiredSkills: ["Storytelling", "Research", "Editing", "Multimedia handling"],
    technicalSkills: {
      journalism: ["News writing", "Interview techniques", "Investigative reporting"],
      filmmaking: ["Camera work", "Lighting", "Video editing (Premiere Pro)"],
      photography: ["DSLR operation", "Composition", "Post‑processing (Lightroom)"],
      digitalMarketing: ["SEO", "Social media strategy", "Analytics"],
      contentCreation: ["YouTube production", "Podcasting", "Live streaming"]
    },
    softSkills: ["Communication", "Creativity", "Time management", "Adaptability"],
    certifications: ["Google Analytics", "YouTube Creator Academy", "Adobe Certified Expert", "HubSpot Content Marketing"],
    internships: "Newsrooms, production houses, digital agencies (3‑6 mo).",
    projects: "Produce a short documentary, run a blog/vlog series, create a podcast.",
    portfolio: "Showreel, published articles, social media analytics.",
    licensing: null,
    governmentExams: "All India Radio/Doordarshan journalist exams, IAS (Media Management).",
    privateJobs: "News channels, OTT platforms, advertising agencies, freelance.",
    higherEducation: "M.A. Journalism, MFA Film, MBA Marketing.",
    salaryRange: {
      entry: "₹2‑3.5 LPA",
      mid: "₹5‑9 LPA",
      senior: "₹12‑20 LPA"
    },
    careerGrowth: "Reporter → Senior Reporter → Editor → News Director / Content Head.",
    futureDemand: "Growth in OTT, digital content, podcasts, social media.",
    topRecruiters: ["Times of India", "NDTV", "Star India", "Netflix India", "YouTube", "Zoho (content)"],
    studyResources: ["BBC Journalism tutorials", "Film School courses (FIAP), NTT", "YouTube Creator Academy"],
    recommendedWebsites: ["https://www.journalism.org", "https://www.creativebloq.com"],
    roadmapTimeline: {
      beginner: "Diploma or online courses (6‑12 mo)",
      intermediate: "Internship + 1‑2 yr role",
      advanced: "Degree + specialization (3‑4 yrs)",
      expert: "Lead content teams, launch own media venture"
    },
    finalSuccessChecklist: ["Portfolio of published work", "Relevant degree/cert", "Internship completion", "Job offer in media"]
  },
  agriculture: {
    overview: "Agriculture covers farming, horticulture, forestry, dairy, fisheries and agribusiness.",
    eligibility: "10th pass → 12th (PCM/PCB) → diploma/degree.",
    academicPath: {
      foundation: "Intermediate (PCM/PCB)",
      diploma: "Diploma in Agriculture (3 yrs)",
      degree: "B.Sc Agriculture (3‑4 yrs)",
      specialization: "M.Sc Horticulture, MSc Forestry, MBA Agribusiness"
    },
    entranceExams: {
      agriDegree: "ICAR AIEEA, state agricultural university exams"
    },
    requiredSkills: ["Scientific mindset", "Knowledge of crops/livestock", "Data analysis", "Sustainable practices"],
    technicalSkills: {
      cropScience: ["Soil testing", "Crop rotation", "Pest management"],
      horticulture: ["Greenhouse management", "Propagation techniques"],
      dairyTech: ["Milking technology", "Feed formulation"],
      agriEng: ["Irrigation design", "Farm mechanization"],
      agribusiness: ["Supply chain", "Marketing", "Financial planning"]
    },
    softSkills: ["Problem solving", "Communication", "Leadership", "Entrepreneurial mindset"],
    certifications: ["ICAR Certificate Courses", "Organic Farming Certification", "GIS for Agriculture"],
    internships: "Farm internships with ICAR institutes, agribusiness firms (3‑6 mo).",
    projects: "Develop a pilot organic farm, conduct a soil health study, design a drip irrigation system.",
    portfolio: "Research reports, farm layout plans, yield data charts.",
    licensing: "Land ownership registration, FSSAI for food processing.",
    governmentExams: "ICAR entry exams, state agricultural officer exams.",
    privateJobs: "Agri‑tech startups, food processing units, FMCG, NGOs.",
    higherEducation: "M.Sc Agriculture, PhD, MBA Agribusiness.",
    salaryRange: {
      entry: "₹2‑3.5 LPA",
      mid: "₹5‑9 LPA",
      senior: "₹12‑20 LPA"
    },
    careerGrowth: "Field Officer → Senior Agronomist → Farm Manager → Agribusiness Director.",
    futureDemand: "Increasing focus on sustainable farming, smart agriculture, food security.",
    topRecruiters: ["Mahindra Agribusiness", "Nutrien", "AgriTech startups", "FAO India", "ICAR institutions"],
    studyResources: ["ICAR textbooks", "NPTEL agriculture courses", "Govt. Krishi Vigyan Kendra resources"],
    recommendedWebsites: ["https://www.icar.org.in", "https://www.fertilizer.org", "https://www.agriwatch.com"],
    roadmapTimeline: {
      beginner: "Diploma or B.Sc (3‑4 yrs)",
      intermediate: "Internship + 1‑2 yr field experience",
      advanced: "Post‑grad specialization (2‑3 yrs)",
      expert: "Lead agribusiness or research projects"
    },
    finalSuccessChecklist: ["Relevant degree/cert", "Internship experience", "Portfolio of farm projects", "Job offer in agri‑sector"]
  }
};
