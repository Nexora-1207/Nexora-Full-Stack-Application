/**
 * Nexora AI Educational & Career Intelligence Engine
 * 
 * Strict Enforcement:
 * - Responds to ALL educational, academic, stream comparison, degree, course, entrance exam, and study queries.
 * - Politely declines non-educational, general knowledge, entertainment, politics, or off-topic queries.
 */

export interface AIResponseResult {
  isEducational: boolean;
  text: string;
}

// Strict list of non-educational intent patterns (General Knowledge Trivia, Politics, Pop Culture, Entertainment, Casual Chat, Silly Questions)
const NON_EDUCATIONAL_PATTERNS = [
  'who is pm', 'who is prime minister', 'who is president', 'who is cm', 'who is chief minister',
  'modi', 'biden', 'trump', 'politician', 'politics', 'government minister', 'prime minister',
  'favorite movie', 'best movie', 'actor', 'actress', 'cinema', 'bollywood', 'hollywood', 'taylor swift', 'srk', 'prabhas',
  'who won the match', 'cricket score', 'ipl', 'messi', 'ronaldo', 'football score',
  'tell me a joke', 'sing a song', 'flirt', 'love me', 'make me laugh', 'who created you',
  'what is 2+2', 'weather today', 'recipe', 'cook food', 'capital of', 'who is the king',
  'girlfriend', 'boyfriend', 'dating', 'marriage', 'game', 'play game', 'funny video', 'meme',
  'silly', 'nonsense', 'gossip', 'dance', 'fashion trend', 'crypto price', 'stock tip'
];

// Complete Dictionary of all 14 Career Domains by Index Number
const DOMAIN_BY_NUMBER: Record<number, { title: string; category: string; icon: string; text: string }> = {
  1: {
    title: "Engineering & Tech",
    category: "STEM Core",
    icon: "⚙️",
    text: `### ⚙️ Domain 1: Engineering & Tech (STEM Core)

**Engineering & Tech** is the foundational core of industrial automation, robotics, AI mechatronics, telemetry, and smart energy grids.

---

#### 📌 Academic Entry Pathways
- **Route A (10th → 3-Year Polytechnic Diploma)**: Direct hands-on lab training in Mechanical, Civil, ECE, EEE, or CS → **ECET Entrance** → **Direct 2nd Year B.Tech**.
- **Route B (10+2 Intermediate MPC)**: Theoretical science stream → **JEE Main / EAMCET Entrance** → **4-Year B.Tech**.
- **Route C (ITI Craftsman Trade)**: ITI Fitter, Electrician, Machinist → Factory Apprenticeship.

---

#### 💼 Key Career Roles & Scope
- Systems Calibration Engineer, Robotics Technician, CAD Design Specialist, Automation Engineer.
- High demand across defense R&D (ISRO, DRDO), automotive manufacturing, and smart power grids.`
  },

  2: {
    title: "Medical & Bio-Research",
    category: "Healthcare",
    icon: "🧬",
    text: `### 🧬 Domain 2: Medical & Bio-Research (Healthcare)

**Medical & Bio-Research** spans clinical surgery, diagnostic lab technology, biotechnology, pharmacology, and genomic research.

---

#### 📌 Academic Entry Pathways
- **Clinical Medicine**: 10+2 BiPC → **NEET-UG Entrance** → **MBBS / BDS / AYUSH**.
- **Allied Paramedical**: 10th or 12th → **DMLT (Diploma in Medical Lab Tech)** / B.Sc Nursing / Radiography.
- **Bio-Research**: 10+2 BiPC → **B.Pharm / Pharm.D / B.Tech Biotechnology**.

---

#### 💼 Key Career Roles & Scope
- Clinical Physician, Pathology Diagnostics Associate, Geneticist, Clinical Research Associate.`
  },

  3: {
    title: "Computer Science",
    category: "Software",
    icon: "💻",
    text: `### 💻 Domain 3: Computer Science (Software)

**Computer Science** is the premier domain for software development, artificial intelligence, cloud architecture, cyber security, and data science.

---

#### 📌 Academic Entry Pathways
- **10+2 Intermediate MPC** → **JEE Main / EAMCET** → **4-Year B.Tech CSE**.
- **10th → 3-Year CS/IT Polytechnic Diploma** → **ECET Entrance** → **Direct 2nd Year B.Tech CSE**.
- **10th → ITI COPA** → Junior Web Assistant / BCA.

---

#### 💼 Key Career Roles & Scope
- Software Development Engineer (SDE), Cloud Architect, AI/ML Engineer, DevOps Specialist.`
  },

  4: {
    title: "Skilled Trades (ITI)",
    category: "Vocational",
    icon: "🛠️",
    text: `### 🛠️ Domain 4: Skilled Trades (ITI Vocational)

**Skilled Trades (ITI)** provides 1 to 2-year practical craftsman training after 10th class for fast-track employment in heavy manufacturing, power grids, and railway units.

---

#### 📌 Core Trades
- **ITI Electrician**: Sub-station wiring, industrial panels, solar grids.
- **ITI Fitter / Turner**: Precision CNC machining, lathe operations.
- **ITI COPA / Welder**: Computer operations, structural steel fabrication.

---

#### 💼 Key Opportunities
- **Railway Assistant Loco Pilot (ALP)**: Direct eligibility for ITI certificate holders.
- **Paid Apprenticeships**: Tata Motors, BHEL, Vizag Steel, L&T.`
  },

  5: {
    title: "Merchant Navy",
    category: "Maritime",
    icon: "⚓",
    text: `### ⚓ Domain 5: Merchant Navy (Maritime)

**Merchant Navy** is a non-combat commercial shipping fleet transporting cargo, crude oil, and container goods across international oceanic routes.

---

#### 📌 Academic Entry Pathways
- **After 10th**: **GP Rating (General Purpose Rating)** – 6-Month residential course approved by DG Shipping.
- **After 10+2 MPC**: **B.Sc Nautical Science** (Deck Officer path) or **B.Tech Marine Engineering** (Engine Officer path).
- **After Polytechnic Diploma**: Direct **Lateral Entry into 2nd Year B.Tech Marine Engineering**.

---

#### 💼 Key Career Roles & Pay
- Deck Officer (Deck Cadet → 3rd Officer → Captain), Marine Engineer (4th Engg → Chief Engg).
- Tax-free USD salaries ($1,000 – $12,000+/month).`
  },

  6: {
    title: "Fashion & Design",
    category: "Creative",
    icon: "🎨",
    text: `### 🎨 Domain 6: Fashion & Design (Creative)

**Fashion & Design** merges apparel aesthetics, biomorphic wearables, smart fabrics, and industrial styling.

---

#### 📌 Academic Entry Pathways
- **10+2 (Any Stream)** → **NIFT / NID Entrance Exams** → **4-Year B.Des (Bachelor of Design)** or **B.F.Tech**.

---

#### 💼 Key Career Roles
- Fashion Designer, Apparel Technologist, Textile Designer, Industrial Stylist.`
  },

  7: {
    title: "Business & FinTech",
    category: "Commerce",
    icon: "📈",
    text: `### 📈 Domain 7: Business & FinTech (Commerce)

**Business & FinTech** forms the gateway to corporate finance, chartered accountancy, venture capital, and quantitative risk modeling.

---

#### 📌 Academic Entry Pathways
- **10+2 MEC / CEC Stream** → **CA Foundation (Chartered Accountancy)** / **BBA** / **B.Com**.
- **Undergraduate Degree** → **CAT / MAT Entrance** → **MBA in Finance / Analytics**.

---

#### 💼 Key Career Roles
- Chartered Accountant (CA), Financial Analyst, Risk Quantitative Analyst, Portfolio Manager.`
  },

  8: {
    title: "Media & Communications",
    category: "Creative Media",
    icon: "📻",
    text: `### 📻 Domain 8: Media & Communications (Creative Media)

**Media & Communications** encompasses digital broadcasting, interactive XR media, journalism, and public relations.

---

#### 📌 Academic Entry Pathways
- **10+2 (Any Stream)** → **BJMC (Bachelor of Journalism & Mass Comm)** / **B.A. Media Studies**.

---

#### 💼 Key Career Roles
- Broadcast Journalist, Digital Media Producer, XR Content Creator, PR Executive.`
  },

  9: {
    title: "Hospitality & Tourism",
    category: "Services",
    icon: "☕",
    text: `### ☕ Domain 9: Hospitality & Tourism (Services)

**Hospitality & Tourism** coordinates luxury hotelier operations, commercial aviation, cabin crew, and culinary arts.

---

#### 📌 Academic Entry Pathways
- **10th / 12th** → **NCHMCT JEE Entrance** → **BHMCT (Bachelor of Hotel Management)** or **Cabin Crew Aviation Diploma**.

---

#### 💼 Key Career Roles
- Executive Chef, Hotel General Manager, Commercial Flight Attendant / Steward, Resort Operations Manager.`
  },

  10: {
    title: "Agri-Tech & Bio-Farming",
    category: "Bio-Systems",
    icon: "🌱",
    text: `### 🌱 Domain 10: Agri-Tech & Bio-Farming (Bio-Systems)

**Agri-Tech & Bio-Farming** merges agricultural science with automated drone farming, hydroponics, soil microbiology, and agribusiness management.

---

#### 📌 Academic Entry Pathways
- **10+2 BiPC / MPC Stream** → **EAMCET / AGRICET / ICAR AIEEA Entrance** → **4-Year B.Sc (Hons) Agriculture** or **B.Tech Agricultural Engineering**.
- **Polytechnic Diploma in Agriculture** → Direct AGRICET Lateral Entry.

---

#### 🛠️ Core Technologies & Scope
- **Precision Drone Farming**: Crop health spectral mapping and automated pesticide spraying.
- **Hydroponics & Vertical Farming**: Climate-controlled soil-less cultivation.
- **Agribusiness & Research**: Agricultural officer roles in Govt banks, ICAR research scientist.`
  },

  11: {
    title: "Automobile & EV Tech",
    category: "Mechanical",
    icon: "🚗",
    text: `### 🚗 Domain 11: Automobile & EV Tech (Mechanical)

**Automobile & EV Tech** focuses on electric vehicles, battery management systems (BMS), motor controllers, and powertrain dynamics.

---

#### 📌 Academic Entry Pathways
- **10th → 3-Year Polytechnic Diploma in Automobile / Mechanical** → **ECET Entrance** → **2nd Year B.Tech**.
- **10+2 MPC** → **JEE Main / EAMCET** → **4-Year B.Tech Automobile / EV Engineering**.

---

#### 💼 Key Career Roles
- EV Battery Specialist, Powertrain Architect, Automotive Electronics Engineer.`
  },

  12: {
    title: "Construction & Civil",
    category: "Infrastructure",
    icon: "🏗️",
    text: `### 🏗️ Domain 12: Construction & Civil (Infrastructure)

**Construction & Civil Engineering** focuses on designing, building, and managing infrastructure like smart megastructures, highways, bridges, and urban transit systems.

---

#### 📌 Academic Entry Pathways
- **10th → 3-Year Civil Polytechnic Diploma** → **ECET Entrance** → **2nd Year B.Tech Civil**.
- **10+2 MPC** → **JEE Main / EAMCET** → **4-Year B.Tech Civil Engineering**.

---

#### 💼 Key Career Roles & Software
- Structural Engineer, Site Project Manager, Govt Assistant Executive Engineer (SSC JE / State PSC AEE).
- Software: AutoCAD, REVIT Architecture, STAAD.Pro, Building Information Modeling (BIM).`
  },

  13: {
    title: "Beauty & Wellness",
    category: "Wellness",
    icon: "✨",
    text: `### ✨ Domain 13: Beauty & Wellness (Wellness)

**Beauty & Wellness** spans dermatological therapeutics, clinical cosmetology, and holistic health science.

---

#### 📌 Academic Entry Pathways
- **10+2 (BiPC or any stream)** → **Diploma / B.Sc in Cosmetology & Aesthetic Science**.

---

#### 💼 Key Career Roles
- Clinical Cosmetologist, Aesthetic Therapist, Wellness Center Operations Manager.`
  },

  14: {
    title: "Retail & Global Logistics",
    category: "Supply Chain",
    icon: "🚚",
    text: `### 🚚 Domain 14: Retail & Global Logistics (Supply Chain)

**Retail & Global Logistics** manages automated warehousing, cold chain management, and global e-commerce supply chain nodes.

---

#### 📌 Academic Entry Pathways
- **10+2 / Graduation** → **B.Sc / BBA / MBA in Supply Chain & Global Logistics Management**.

---

#### 💼 Key Career Roles
- Global Supply Chain Executive, Automated Warehouse Manager, Logistics Operations Analyst.`
  }
};

/**
 * Main AI Query Processing Engine
 */
export function processNexoraAIQuery(query: string): AIResponseResult {
  const cleanQuery = query.trim();
  const lower = cleanQuery.toLowerCase();

  // 1. Greetings Handler
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|namaste)[\s!.]*$/i.test(cleanQuery)) {
    return {
      isEducational: true,
      text: `👋 **Greetings! I am Nexora AI**, your dedicated Academic & Career Guidance Assistant.\n\nI am configured **strictly for educational & career queries**. You can ask me about:\n- 🧭 **Career Pathways** (e.g., *Explain career paths*, *Merchant Navy*, *CSE Roadmap*, *Civil Engineering*)\n- 🔢 **Specific Domains by Number** (e.g., *Explain 10*, *Explain 10, 11, 12*, *Tell about domain 5*)\n- 🎓 **Academic Stream Comparisons** (e.g., *Difference between BiPC and Pharmacy*, *Difference between Inter and Diploma*, *Intermediate MPC vs BiPC*)\n- 🏛️ **Entrance Exams & Admissions** (e.g., *JEE Main*, *NEET*, *ECET*, *POLYCET*, *EAMCET*, *CLAT*)\n\nHow can I assist your educational journey today?`
    };
  }

  // 2. Strict Non-Educational Refusal Check
  const isExplicitNonEducational = NON_EDUCATIONAL_PATTERNS.some((pattern) => lower.includes(pattern));

  if (isExplicitNonEducational) {
    return {
      isEducational: false,
      text: `⚠️ **This question is not related to education and cannot be answered here.**

I am **Nexora AI**, an assistant dedicated strictly to **educational and career guidance only**.

---

#### 💡 Please ask an education or career-related question, such as:
- **"Explain career paths"** (Master Educational Roadmap)
- **"Explain 10"** (Agri-Tech & Bio-Farming)
- **"Explain 10, 11, 12"** (Agri-Tech, Automobile EV, Construction)
- **"What is the difference between BiPC and Pharmacy?"**
- **"Tell the difference between Inter and Diploma"**

Feel free to ask any academic, degree, branch, or entrance exam question!`
    };
  }

  // Resume Building & Preparation Handler
  if (lower.includes('resume') || lower.includes('cv') || lower.includes('curriculum vitae') || lower.includes('ats')) {
    return {
      isEducational: true,
      text: `### 📄 Master Guide: Building an ATS-Optimized Student Resume

A professional resume is your gateway to campus placements, internships, and entry-level corporate/technical roles. Here is the recommended structure for students and fresh graduates:

---

#### 📌 1. Essential Resume Sections (Top to Bottom)
1. **Header & Contact Info**: Full Name, Email, Phone Number, LinkedIn URL, GitHub / Portfolio link.
2. **Professional Summary (2-3 lines)**: Highlight your academic stream (e.g. *B.Tech CSE / Polytechnic Mechanical Diploma*), core technical skills, and career objective.
3. **Education Credentials**: Degree / Diploma title, Institution name, Graduation year, CGPA / Percentage.
4. **Technical Skills & Tools**: Group by category (e.g., *Languages: Java, C++, Python | Software: AutoCAD, REVIT | Core: Circuit Design, Data Structures*).
5. **Projects & Capstone**: Title, Technologies used, 2 bullet points explaining **what you built** and **the result/impact**.
6. **Certifications & Training**: NPTEL, Coursera, Industrial Training, or ITI Trades certifications.

---

#### 💡 ATS Optimization Tips:
- Use standard section titles (*"Education"*, *"Projects"*, *"Skills"*).
- Include strong action verbs (*Developed, Engineered, Optimized, Designed, Analyzed*).
- Keep format to **1 Page** clean single-column layout.`
    };
  }

  // Self-Introduction & Interview Prep Handler
  if (lower.includes('self intro') || lower.includes('introduction') || lower.includes('introduce yourself') || lower.includes('interview') || lower.includes('elevator pitch')) {
    return {
      isEducational: true,
      text: `### 🎙️ Master Framework: 60-Second Self-Introduction for Interviews

Delivering a structured, confident self-introduction creates an outstanding first impression during campus placement HR rounds and technical interviews.

---

#### 📌 4-Part Self-Introduction Structure:

1. **Part 1: Warm Greeting & Identity (10 Seconds)**
   - *"Good morning/afternoon, Sir/Madam. Thank you for this opportunity. My name is [Your Name], and I am currently pursuing my [Degree/Diploma] in [Your Branch] from [Your College/Polytechnic]."*

2. **Part 2: Academic & Technical Focus (20 Seconds)**
   - *"Throughout my academic journey, I have developed a strong foundation in [2-3 core subjects/skills, e.g. Data Structures, Web Development, or Structural Drafting]."*

3. **Part 3: Key Project Highlight (20 Seconds)**
   - *"For my major project, I worked on [Project Name], where I [your specific contribution] using [technology/tool], which improved [result/learning]."*

4. **Part 4: Career Aspiration & Closing (10 Seconds)**
   - *"I am eager to leverage my technical skills in a dynamic environment, and I am excited about this opportunity. Thank you."*

---

#### 🎯 Top Interview Tips:
- Maintain clear eye contact and moderate speaking pace.
- Align your technical skills with the target job profile!`
    };
  }

  // 3. Natural Language Intent Handler for "Explain Career Paths / Options / Roadmaps"
  if (
    lower.includes('career path') || lower.includes('career options') || lower.includes('career choices') || lower.includes('explain path') || lower.includes('career roadmap') || lower.includes('educational path') || lower.includes('what to study') || lower.includes('what can i study') || lower.includes('all paths') || lower.includes('pathways')
  ) {
    return {
      isEducational: true,
      text: `### 🧭 Master Career Roadmap: All Educational Pathways After 10th & 12th

Navigating post-10th and post-12th education shapes your professional trajectory. Here is the master breakdown of all key educational pathways:

---

#### 📐 1. Intermediate (10+2 MPC Stream - Math, Physics, Chemistry)
- **Target Fields**: Engineering, Computer Science, AI, Mechatronics, Architecture, FinTech, Defense.
- **Key Degrees**: B.Tech / B.E. (all branches), B.Arch, B.Sc Data Science.
- **Entrance Exams**: **JEE Main**, **JEE Advanced**, **BITSAT**, **State CETs (EAMCET / TG EAPCET)**.

---

#### 🧬 2. Intermediate (10+2 BiPC Stream - Biology, Physics, Chemistry)
- **Target Fields**: Clinical Medicine, Pharmacy, Diagnostic Lab Technology, Biotechnology, Agriculture.
- **Key Degrees**: MBBS, BDS, B.Pharm, Pharm.D, B.Sc Agriculture, DMLT, B.Sc Nursing.
- **Entrance Exams**: **NEET-UG**, **EAMCET**, **AGRICET**.

---

#### 📈 3. Intermediate (10+2 MEC/CEC Stream - Commerce & Humanities)
- **Target Fields**: Corporate Finance, Chartered Accountancy, Business Administration, Economics, Law.
- **Key Degrees**: B.Com, BBA, Integrated B.A. LL.B, CA Foundation.
- **Professional Exams**: **CA Foundation / IPCC**, **CLAT (Law)**, **CAT / MAT (MBA)**.

---

#### 🚀 4. 3-Year Polytechnic Technical Diploma (Direct Engineering Route)
- **Target Fields**: Direct practical engineering training after 10th class.
- **Key Advantage**: Zero academic year loss + **B.Tech Lateral Entry via ECET** (Direct admission into 2nd Year B.Tech).
- **Early Jobs**: Eligible for **Junior Engineer (JE)** government jobs (Railway RRB JE, State Electricity Boards) directly after 3 years.

---

#### 🛠️ 5. ITI Vocational Craftsman Trades (1-2 Years)
- **Target Fields**: Fast-track technical craftsman training after 10th.
- **Popular Trades**: ITI Electrician, ITI Fitter, ITI Turner, ITI COPA, ITI Welder.
- **Key Advantage**: Direct eligibility for **Railway Assistant Loco Pilot (ALP)** & paid factory apprenticeships (Tata Motors, BHEL, Vizag Steel).

---

#### ⚓ 6. Merchant Navy Commercial Maritime Fleet
- **After 10th**: **GP Rating (General Purpose Rating)** – 6-Month residential course approved by DG Shipping.
- **After 10+2 MPC**: **B.Sc Nautical Science** (Deck Officer) or **B.Tech Marine Engineering** (Engine Officer).
- **Pay Perks**: Tax-Free USD salaries ($1,000 – $12,000+/month).

---

#### 💡 Want to Explore Specific Domains?
- Type **"How many career domains are there"** or **"Explain 10"** to explore specific branch trees!`
    };
  }

  // 4. Domain Number Extraction Handler (e.g. "explain 10", "explain 10, 11, 12", "domain 5", "explain 1, 2, 3")
  const numbersFound = Array.from(lower.matchAll(/\b(1[0-4]|[1-9])(?:th|st|nd|rd)?\b/gi))
    .map((m) => parseInt(m[1], 10))
    .filter((n) => n >= 1 && n <= 14);

  if (numbersFound.length > 0 && (lower.includes('explain') || lower.includes('tell') || lower.includes('about') || lower.includes('domain') || lower.includes('sector') || lower.includes('option') || lower.includes('number') || lower.includes('no') || lower.includes('#') || cleanQuery.length < 15)) {
    const uniqueNums = Array.from(new Set(numbersFound));
    let combinedText = `### 📚 Detailed Career Domain Explanation\n\n`;

    uniqueNums.forEach((n) => {
      if (DOMAIN_BY_NUMBER[n]) {
        combinedText += DOMAIN_BY_NUMBER[n].text + `\n\n---\n\n`;
      }
    });

    return {
      isEducational: true,
      text: combinedText.trim()
    };
  }

  // 5. Dedicated Handler for "How many career domains / sectors are there?"
  if (lower.includes('how many career domains') || lower.includes('how many sectors') || lower.includes('career domains') || lower.includes('all career domains') || lower.includes('list of career domains') || lower.includes('list all sectors') || (lower.includes('how many') && (lower.includes('domain') || lower.includes('sector')))) {
    return {
      isEducational: true,
      text: `### 🌐 Complete Guide: Nexora's 14 Specialized Career Domains

Nexora features **14 Active Career Domains** designed to guide students from 10th class, Intermediate (MPC/BiPC/MEC/CEC), 3-Year Polytechnic Diplomas, and ITI Vocational Trades into high-growth university degrees and employment tracks.

---

#### 📌 Breakdown of All 14 Career Domains:

1. ⚙️ **Engineering & Tech (STEM Core)** – *Scope*: Robotics, Mechatronics, AI Systems, B.Tech & Polytechnic Diplomas.
2. 🧬 **Medical & Bio-Research (Healthcare)** – *Scope*: MBBS/BDS Surgery, Biotechnology, Clinical Diagnostics, DMLT.
3. 💻 **Computer Science (Software)** – *Scope*: Full-Stack Web Architecture, Cloud Systems, Cyber Security, AI/ML.
4. 🛠️ **Skilled Trades (ITI Vocational)** – *Scope*: Precision CNC Machining, Electrical Grids, Fitting, Welding, Railway RRB.
5. ⚓ **Merchant Navy (Maritime)** – *Scope*: B.Sc Nautical Science (Deck Officer), B.Tech Marine Engineering, GP Rating.
6. 🎨 **Fashion & Design (Creative)** – *Scope*: Biomorphic Wearables, Smart Fabrics, NIFT Apparel Design, Industrial Styling.
7. 📈 **Business & FinTech (Commerce)** – *Scope*: Algorithmic Trading, Venture Growth, Chartered Accountancy (CA), BBA/MBA.
8. 📻 **Media & Communications (Creative Media)** – *Scope*: Digital Broadcasting, Interactive XR, Journalism.
9. ☕ **Hospitality & Tourism (Services)** – *Scope*: Global Hotelier Operations, Commercial Aviation, Cabin Crew, Culinary Arts.
10. 🌱 **Agri-Tech & Bio-Farming (Bio-Systems)** – *Scope*: Hydroponics, Automated Drone Farming, Soil Science, B.Sc Agriculture.
11. 🚗 **Automobile & EV Tech (Mechanical)** – *Scope*: Electric Vehicles (EV), Powertrain Dynamics, Battery Management Systems.
12. 🏗️ **Construction & Civil (Infrastructure)** – *Scope*: Smart Megastructures, Urban Planning, BIM Modeling, AutoCAD Drafting.
13. ✨ **Beauty & Wellness (Wellness)** – *Scope*: Dermatological Therapeutics, Cosmetology, Holistic Health Science.
14. 🚚 **Retail & Global Logistics (Supply Chain)** – *Scope*: Automated Warehousing, Cold Chain Logistics, E-Commerce Nodes.

---

#### 💡 How to Explore by Number:
- You can ask **"Explain 10"** for Agri-Tech, **"Explain 11"** for Automobile EV, **"Explain 12"** for Construction & Civil, or **"Explain 1, 2, 3, 5"** to get a combined breakdown!`
    };
  }

  // 6. Comparison Handlers (Evaluated BEFORE single-topic handlers)
  if (lower.includes('difference') || lower.includes('vs') || lower.includes('comparison') || lower.includes('better') || (lower.includes('inter') && lower.includes('diploma'))) {

    // Comparison 1: BiPC vs Pharmacy
    if ((lower.includes('bipc') || lower.includes('biology')) && (lower.includes('pharmacy') || lower.includes('pharm') || lower.includes('b.pharm') || lower.includes('d.pharm'))) {
      return {
        isEducational: true,
        text: `### ⚖️ Comparison Analysis: Intermediate BiPC vs Pharmacy (B.Pharm / D.Pharm)

A common point of confusion for students is comparing **Intermediate BiPC** with **Pharmacy**. Here is the exact distinction:

---

#### 🧬 1. Intermediate BiPC (Biology, Physics, Chemistry)
- **What it is**: A **2-Year 10+2 Higher Secondary Academic Stream** taken directly after 10th class.
- **Academic Level**: Pre-University / High School (11th & 12th Grade).
- **Core Subjects**: Foundational Botany, Zoology, Physics, and Chemistry.
- **Primary Goal**: Serves as the **preparatory foundation & eligibility requirement** for medical, pharmacy, agricultural, and life science university admissions.

---

#### 💊 2. Pharmacy (B.Pharm / D.Pharm / Pharm.D)
- **What it is**: A **Professional Technical College Degree / Diploma** in pharmaceutical sciences, drug design, formulation, and clinical therapeutics.
- **Academic Level**: Higher Education (Undergraduate Degree / Diploma / Doctorate) pursued **AFTER** completing 10+2 (BiPC or MPC).
- **Course Options**:
  - **D.Pharm**: 2-Year Diploma in Pharmacy (Retail Pharmacist).
  - **B.Pharm**: 4-Year Bachelor of Pharmacy (Drug Manufacturing, QC, R&D).
  - **Pharm.D**: 6-Year Doctor of Pharmacy (Clinical Pharmacy, Hospital Rounds).
- **Core Subjects**: Medicinal Chemistry, Pharmacology, Pharmaceutics, Clinical Research.

---

#### 📊 Key Relationship & Distinction Matrix

| Feature | Intermediate BiPC | Pharmacy (B.Pharm / D.Pharm) |
| :--- | :--- | :--- |
| **Category** | 10+2 High School Science Stream | Professional University Degree / Diploma |
| **Stage** | Taken **Before** College (11th & 12th) | Pursued **After** 10+2 (in University/College) |
| **Eligibility** | Requires 10th Class Pass | Requires 10+2 BiPC (or MPC) Pass |
| **Outcome** | Qualifies you for NEET / EAMCET | Licensed Pharmacist, Drug Inspector, QC Analyst |

---

#### 🎯 Key Takeaway:
- **BiPC is the preparatory 10+2 stream**, while **Pharmacy is the professional college degree** you enter *after* completing BiPC!`
      };
    }

    // Comparison 2: Inter (10+2) vs Polytechnic 3-Year Diploma
    if ((lower.includes('inter') || lower.includes('10+2') || lower.includes('intermediate')) && (lower.includes('diploma') || lower.includes('polytechnic'))) {
      return {
        isEducational: true,
        text: `### ⚖️ Comprehensive Comparison: Intermediate (10+2) vs Polytechnic 3-Year Diploma

Both **Intermediate (10+2)** and **Polytechnic 3-Year Diploma** are premier academic options after 10th class, but they lead to engineering through different approaches.

---

#### 🏛️ 1. Intermediate (10+2 Science Stream - MPC / BiPC)
- **Duration**: 2 Years.
- **Focus**: Theoretical science foundation in Mathematics, Physics, Chemistry, or Biology.
- **Primary Goal**: Preparation for competitive national entrance exams like **JEE Main**, **JEE Advanced**, **NEET**, and **State CETs (EAMCET / TG EAPCET)**.
- **B.Tech Timeline**: 2 Years Inter + 4 Years B.Tech = **6 Years Total**.
- **Best For**: Students aiming for top tier national institutes (**IITs, NITs, IIITs**) or Clinical Medical Colleges (**MBBS/BDS**).

---

#### 🚀 2. Polytechnic 3-Year Technical Diploma
- **Duration**: 3 Years.
- **Focus**: Hands-on practical engineering, laboratory experiments, workshop crafting, CAD drafting, and technical software.
- **Primary Goal**: Direct practical technical knowledge + **B.Tech Lateral Entry via ECET**.
- **B.Tech Timeline**: 3 Years Diploma + 3 Years B.Tech (Direct 2nd Year entry via ECET) = **6 Years Total** (*Zero year loss!*).
- **Early Employment**: Eligible for **Junior Engineer (JE)** government jobs (Railway RRB JE, State Electricity Boards, SSC JE) directly after 3 years.
- **Best For**: Students who prefer practical engineering over heavy theoretical books, or who want a secure engineering degree with zero academic year loss.

---

#### 📊 Quick Comparison Matrix

| Feature | Intermediate (10+2 MPC) | Polytechnic 3-Year Diploma |
| :--- | :--- | :--- |
| **Duration** | 2 Years | 3 Years |
| **Learning Style** | High Theory & Entrance Prep | Practical Labs & Workshops |
| **B.Tech Ingress** | 1st Year B.Tech (4 Yrs) | Direct 2nd Year B.Tech (3 Yrs via ECET) |
| **Total B.Tech Time**| 6 Years | 6 Years (No Year Loss) |
| **IIT / NIT Access** | Direct via JEE Main/Advanced | Requires B.Tech completion or GATE |
| **Early Job Access** | None (Requires Degree) | Govt Junior Engineer (JE) eligible after 3 Yrs |

---

#### 🎯 Recommendation Verdict:
- Choose **Intermediate MPC** if you want to crack **JEE Main / Advanced** for IITs/NITs.
- Choose **Polytechnic Diploma** if you want direct practical lab skills, early job security, and direct 2nd-year B.Tech entry!`
      };
    }

    // Comparison 3: MPC vs BiPC
    if (lower.includes('mpc') && lower.includes('bipc')) {
      return {
        isEducational: true,
        text: `### ⚖️ Comparison Analysis: Intermediate MPC vs BiPC

---

#### 📐 1. Intermediate MPC (Math, Physics, Chemistry)
- **Primary Focus**: Engineering, Software Development, Technology, Physical Sciences, Architecture, FinTech, and Defense.
- **Key Degree Paths**: B.Tech / B.E. (all branches), B.Arch, B.Sc Computer Science, Commercial Pilot, NDA Officer.

---

#### 🧬 2. Intermediate BiPC (Biology, Physics, Chemistry)
- **Primary Focus**: Clinical Medicine, Healthcare, Pharmacy, Biotechnology, Paramedical, Agriculture, and Life Sciences.
- **Key Degree Paths**: MBBS, BDS, B.Pharm, Pharm.D, B.Sc Agriculture, DMLT, Biotechnology.`
      };
    }

    // Comparison 4: B.Tech vs B.E.
    if ((lower.includes('btech') || lower.includes('b.tech')) && (lower.includes('be') || lower.includes('b.e'))) {
      return {
        isEducational: true,
        text: `### ⚖️ Comparison Analysis: B.Tech vs B.E.

---

#### 🎓 1. B.Tech (Bachelor of Technology)
- **Focus**: Skill-based, application-driven, modern industry technology curriculum.
- **Institution**: Offered by technology universities, IITs, NITs, and autonomous institutes.

#### 🏛️ 2. B.E. (Bachelor of Engineering)
- **Focus**: Theory-grounded engineering science fundamentals.
- **Institution**: Offered by traditional state universities.

*Verdict*: Both degrees carry 100% equal validity for corporate placements, GATE, higher studies (MS/M.Tech), and Govt exams!`
      };
    }

    // Comparison 5: Navy vs Army (Defense Service Entry & Armed Forces Careers)
    if ((lower.includes('navy') || lower.includes('maritime')) && (lower.includes('army') || lower.includes('military') || lower.includes('defense') || lower.includes('defence'))) {
      return {
        isEducational: true,
        text: `### ⚖️ Defense Career Comparison: Indian Navy vs Indian Army

Both the **Indian Navy** and **Indian Army** are elite wings of the Armed Forces offering prestigious officer & non-officer career entry pathways for students after 10th, 12th (MPC), and Graduation.

---

#### ⚓ 1. Indian Navy (Maritime Defense & Naval Power)
- **Domain & Focus**: Sea-based maritime security, submarine operations, aircraft carriers, naval aviation, and oceanic power projection.
- **Officer Entry Pathways**:
  - **10+2 MPC**: **NDA (Naval Wing)** entrance or **10+2 B.Tech Cadet Entry Scheme** (Executive & Technical Branches).
  - **Graduation (B.Tech / B.Sc)**: **CDS Exam (INA)**, **INET (Indian Navy Entrance Test)**, Short Service Commission (SSC Tech/Logistics/Executive).
- **Non-Officer Entry**: **Agniveer (Navy)** – SSR (Senior Secondary Recruits) & MR (Musician/Steward).
- **Training Academy**: **Indian Naval Academy (INA), Ezhimala, Kerala**.
- **Key Roles**: Submariner, Naval Pilot, Marine Engineer, Gunner Officer, Diving Officer.

---

#### ⚔️ 2. Indian Army (Land Warfare & Territorial Defense)
- **Domain & Focus**: Land-based warfare, infantry operations, armored cavalry, artillery, military engineering, and border defense.
- **Officer Entry Pathways**:
  - **10+2 MPC**: **NDA (Army Wing)** entrance or **TES (Technical Entry Scheme)** 10+2.
  - **Graduation (Any Degree / B.Tech)**: **CDS Exam (IMA/OTA)**, **TGC (Technical Graduate Course)**, **SSC Tech**.
- **Non-Officer Entry**: **Agniveer (Army)** – General Duty (GD), Technical, Tradesman, Clerk.
- **Training Academy**: **National Defence Academy (Khadakwasla)** / **Indian Military Academy (IMA), Dehradun** / **OTA Chennai**.
- **Key Roles**: Infantry Commander, Armored Corps Officer, Signals Specialist, Combat Engineer.

---

#### 📊 Quick Distinction Matrix

| Feature | Indian Navy ⚓ | Indian Army ⚔️ |
| :--- | :--- | :--- |
| **Primary Realm** | Oceans, Seas & Sub-surface | Land, Mountains & Border Frontiers |
| **Technical Focus** | High emphasis on Marine, Elec & Systems Engg | High tactical, infantry, combat & engineering roles |
| **12th MPC Ingress** | NDA (Naval Academy) & 10+2 B.Tech Cadet Scheme | NDA (Army Wing) & Technical Entry Scheme (TES) |
| **Primary Academy** | INA Ezhimala (Kerala) | IMA Dehradun / OTA Chennai |
| **Graduation Entry** | INET / CDS (INA) / SSC Officer | CDS (IMA/OTA) / TGC Entry |

---

#### 🎯 Key Takeaway for Career Planning:
- Choose **Indian Navy** if you have a strong passion for maritime technology, ships, submarine operations, and naval engineering.
- Choose **Indian Army** if you want land-based tactical leadership, infantry command, armored vehicles, and frontier defense!`
      };
    }

    // Dynamic Fallback Comparison Generator for ANY other "X vs Y"
    const cleanCompareQuery = cleanQuery
      .replace(/^(can you|please|could you)?\s*(tell me|explain|what is|give me|compare)?\s*(the)?\s*(difference between|difference of|versus|vs|comparison between|comparison of)?/gi, '')
      .replace(/what is the difference between|tell the difference between|tell me the difference between|tell me difference between|difference between|compare|versus|vs/gi, '')
      .trim();

    const compareTerms = cleanCompareQuery
      .split(/and|vs|\bto\b/i)
      .map(s => s.trim().replace(/^the\s+/i, ''))
      .filter(Boolean);

    const itemA = compareTerms[0] ? compareTerms[0].charAt(0).toUpperCase() + compareTerms[0].slice(1) : 'Option A';
    const itemB = compareTerms[1] ? compareTerms[1].charAt(0).toUpperCase() + compareTerms[1].slice(1) : 'Option B';

    return {
      isEducational: true,
      text: `### ⚖️ Career & Academic Comparison: ${itemA} vs ${itemB}

Here is a structured breakdown comparing **${itemA}** and **${itemB}**:

---

#### 📌 1. Overview of ${itemA}
- **Definition & Domain**: Core field or career path focusing on foundational principles and domain-specific skills.
- **Target Audience**: Students seeking specialization or practical expertise in ${itemA} related sectors.
- **Career Outcome**: Leads to specialized roles, higher studies, professional certifications, or direct employment.

---

#### 📌 2. Overview of ${itemB}
- **Definition & Domain**: Alternative academic stream or professional domain.
- **Target Audience**: Students looking for direct application, technical capabilities, or industry credentials in ${itemB}.
- **Career Outcome**: Prepares candidates for industry entry, licensing, or corporate/government positions.

---

#### 📊 Key Distinction Summary
- **Prerequisites & Eligibility**: Check entry requirements (10th, 10+2 MPC/BiPC/Commerce, or Graduation) before enrolling.
- **Curriculum & Duration**: Review course length, practical lab modules, and certifications in our **Sectors Hub**.
- **Scope & Placements**: Compare career job titles, growth outlook, and entry packages in our **Colleges Hub**!`
    };
  }

  // 7. Domain Specific Text Handlers (by keyword or fuzzy intent)

  // Merchant Navy
  if (lower.includes('merchant navy') || lower.includes('navy') || lower.includes('gp rating') || lower.includes('nautical') || lower.includes('maritime') || lower.includes('ship') || lower.includes('sailing')) {
    return { isEducational: true, text: DOMAIN_BY_NUMBER[5].text };
  }

  // CSE & Software Engineering
  if (lower.includes('cse') || lower.includes('computer science') || (lower.includes('computer') && lower.includes('path')) || lower.includes('software') || lower.includes('coding') || lower.includes('full stack') || lower.includes('programming') || lower.includes('developer')) {
    return { isEducational: true, text: DOMAIN_BY_NUMBER[3].text };
  }

  // Civil Engineering & Construction
  if (lower.includes('civil') || lower.includes('construction') || lower.includes('building') || lower.includes('structural') || lower.includes('bridge') || lower.includes('road')) {
    return { isEducational: true, text: DOMAIN_BY_NUMBER[12].text };
  }

  // Agriculture & Agri-Tech
  if (lower.includes('agri') || lower.includes('agriculture') || lower.includes('bio-farming') || lower.includes('farming') || lower.includes('hydroponics') || lower.includes('crop') || lower.includes('soil')) {
    return { isEducational: true, text: DOMAIN_BY_NUMBER[10].text };
  }

  // Automobile & EV
  if (lower.includes('automobile') || lower.includes('ev') || lower.includes('electric vehicle') || lower.includes('powertrain') || lower.includes('car')) {
    return { isEducational: true, text: DOMAIN_BY_NUMBER[11].text };
  }

  // Aviation & Pilot Training
  if (lower.includes('pilot') || lower.includes('aviation') || lower.includes('cpl') || lower.includes('flying') || lower.includes('flight') || lower.includes('aircraft')) {
    return {
      isEducational: true,
      text: `### ✈️ Complete Career Pathway: Commercial Pilot & Aviation

Becoming a **Commercial Pilot** involves obtaining a **Commercial Pilot License (CPL)** approved by the **DGCA (Directorate General of Civil Aviation)**.

---

#### 📌 Academic Entry Pathways
1. **10+2 Intermediate MPC Stream**: Must pass 12th with Physics & Mathematics (Min 50%).
2. **DGCA Class 1 & Class 2 Medical Exams**: Mandatory medical clearance by DGCA authorized doctors.
3. **Flight Training (Flying School)**: 200 Hours of logged flying time + simulator training (e.g. IGRUDA, NFTI, or overseas flight schools).
4. **DGCA Ground Exams**: Pass Air Navigation, Air Meteorology, Air Regulations, Aviation Meteorology, and Technical General exams.

---

#### 💼 Career & Salary Scope
- **Junior First Officer (Co-Pilot)**: ₹1.5 Lakhs – ₹3.0 Lakhs/month.
- **Captain (Commander)**: ₹6.0 Lakhs – ₹10.0+ Lakhs/month.`
    };
  }

  // Aerospace & Aeronautical Engineering
  if (lower.includes('aerospace') || lower.includes('aeronautical') || lower.includes('isro') || lower.includes('space')) {
    return {
      isEducational: true,
      text: `### 🚀 Complete Career Roadmap: Aerospace & Aeronautical Engineering

**Aerospace Engineering** deals with the design, development, and testing of aircraft, spacecraft, satellites, missiles, and propulsion systems.

---

#### 📌 Academic Entry Pathways
- **10+2 Intermediate MPC** → **JEE Main / Advanced** → **B.Tech Aerospace / Aeronautical Engineering** at IITs (IIT Bombay, IIT Madras, IIT Kanpur) or IIST (Indian Institute of Space Science & Technology).
- **Diploma in Aeronautical/Mechanical** → **ECET** → Direct 2nd Year B.Tech.

---

#### 💼 Premier R&D Employers
- **Indian Space Research Organisation (ISRO)**
- **Defence Research and Development Organisation (DRDO)**
- **Hindustan Aeronautics Limited (HAL)**
- **Boeing, Airbus, Lockheed Martin, SpaceX contractors**.`
    };
  }

  // Mechanical Engineering
  if (lower.includes('mechanical') || lower.includes('mechatronics') || lower.includes('cnc') || lower.includes('robotics')) {
    return { isEducational: true, text: DOMAIN_BY_NUMBER[1].text };
  }

  // ECE & EEE (Electronics & Electrical)
  if (lower.includes('ece') || lower.includes('eee') || lower.includes('electronics') || lower.includes('electrical') || lower.includes('vlsi') || lower.includes('embedded') || lower.includes('iot') || lower.includes('semiconductor')) {
    return {
      isEducational: true,
      text: `### ⚡ Complete Career Roadmap: ECE & EEE Engineering

**Electronics & Communication (ECE)** and **Electrical & Electronics (EEE)** focus on microchips, semiconductor manufacturing, embedded IoT systems, robotics telemetry, and high-voltage power grids.

---

#### 📌 Academic Entry Pathways
- **10th → 3-Year Polytechnic Diploma** (ECE / EEE) → **ECET Exam** → **2nd Year B.Tech**.
- **10th → Intermediate MPC** → **JEE Main / EAMCET** → **4-Year B.Tech ECE/EEE**.

---

#### 🔬 Specialization Branches
- **VLSI & Chip Design**: Semiconductor node architecture, Verilog/VHDL logic design.
- **Embedded Systems & IoT**: Microcontrollers (ARM, ESP32, Arduino), sensor networks.
- **Power Systems & Renewable Energy**: Solar grid telemetry, high-voltage sub-stations, EV chargers.

---

#### 💼 Top Hiring Sectors
- **Semiconductor Firms**: Intel, Qualcomm, AMD, Texas Instruments, Nvidia.
- **Power & Telecom**: PowerGrid, BHEL, ISRO, Reliance Jio, Airtel.`
    };
  }

  // BiPC, Medical & Pharmacy
  if (lower.includes('bipc') || lower.includes('medical') || lower.includes('mbbs') || lower.includes('bds') || lower.includes('neet') || lower.includes('dmlt') || lower.includes('pharmacy') || lower.includes('b.pharm') || lower.includes('d.pharm') || lower.includes('pharm.d') || lower.includes('biotech') || lower.includes('doctor') || lower.includes('hospital')) {
    return { isEducational: true, text: DOMAIN_BY_NUMBER[2].text };
  }

  // Polytechnic & Lateral Entry
  if (lower.includes('polytechnic') || lower.includes('diploma') || lower.includes('lateral entry') || lower.includes('ecet') || lower.includes('polycet')) {
    return {
      isEducational: true,
      text: `### 🚀 Complete Guide: Polytechnic Diplomas & B.Tech Lateral Entry

A **3-Year Polytechnic Diploma** taken directly after 10th class is one of the most efficient, practical pathways to becoming a professional engineer.

---

#### 🔑 Why Choose Polytechnic Diploma?
1. **Direct Practical Edge**: Students complete 3 years of hands-on workshop, laboratory, and drafting modules before stepping into university.
2. **B.Tech Lateral Entry (ECET)**: After diploma, write the state **ECET exam** to gain direct entry into the **2nd Year (3rd Semester)** of B.Tech.
3. **Zero Year Loss**: Total duration (3 Yrs Diploma + 3 Yrs B.Tech = 6 Yrs) is exactly the same as (2 Yrs Inter + 4 Yrs B.Tech = 6 Yrs).
4. **Early Job Eligibility**: Diploma holders can work as Junior Engineers (JE) in Govt (Railway RRB, State PSC) directly after diploma!`
    };
  }

  // ITI & Vocational Trades
  if (lower.includes('iti') || lower.includes('fitter') || lower.includes('electrician') || lower.includes('welder') || lower.includes('copa') || lower.includes('vocational') || lower.includes('trade')) {
    return { isEducational: true, text: DOMAIN_BY_NUMBER[4].text };
  }

  // Business, Commerce & FinTech
  if (lower.includes('business') || lower.includes('commerce') || lower.includes('mec') || lower.includes('cec') || lower.includes('ca') || lower.includes('bba') || lower.includes('mba') || lower.includes('fintech') || lower.includes('finance') || lower.includes('accounting')) {
    return { isEducational: true, text: DOMAIN_BY_NUMBER[7].text };
  }

  // Architecture (B.Arch)
  if (lower.includes('architecture') || lower.includes('b.arch') || lower.includes('nata')) {
    return { isEducational: true, text: DOMAIN_BY_NUMBER[12].text };
  }

  // Law & Legal Studies
  if (lower.includes('law') || lower.includes('clat') || lower.includes('llb') || lower.includes('legal') || lower.includes('lawyer')) {
    return {
      isEducational: true,
      text: `### ⚖️ Complete Career Roadmap: Law & Legal Studies

---

#### 📌 Entry Pathways
1. **5-Year Integrated LL.B (B.A. LL.B / B.B.A. LL.B)**: Directly after 10+2 (any stream) via **CLAT**, **AILET**, or **LAWCET**.
2. **3-Year LL.B**: After completing any 3-year Graduation degree.`
    };
  }

  // 8. Universal Academic Synthesizer for ALL other educational questions
  const topicTitle = cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1);
  const isHowToBecome = lower.includes('how to become') || lower.includes('how can i become') || lower.includes('path to become');
  const isSyllabus = lower.includes('syllabus') || lower.includes('subjects') || lower.includes('course content');
  const isScope = lower.includes('scope') || lower.includes('salary') || lower.includes('jobs');

  let dynamicResponse = `### 📚 Academic & Career Breakdown: ${topicTitle}\n\n`;
  dynamicResponse += `Thank you for your academic query regarding **"${cleanQuery}"**. Here is your detailed educational guidance:\n\n---\n\n`;

  if (isHowToBecome) {
    dynamicResponse += `#### 🧭 Step-by-Step Pathway\n`;
    dynamicResponse += `1. **Foundational Qualification (10th / 10+2)**: Choose the appropriate stream (MPC for Engineering/Math, BiPC for Biological/Medical, MEC/CEC for Commerce).\n`;
    dynamicResponse += `2. **Entrance Exam / Gateway**: Prepare for national or state entrance exams (JEE, NEET, ECET, POLYCET, CETs, CLAT).\n`;
    dynamicResponse += `3. **Degree / Certification**: Complete a recognized 3-4 year Degree or Polytechnic Diploma.\n`;
    dynamicResponse += `4. **Core Skill Mastery**: Focus on practical projects, internships, and industry certifications.\n\n`;
  } else if (isSyllabus) {
    dynamicResponse += `#### 📖 Core Subject Modules & Syllabus Focus\n`;
    dynamicResponse += `- **Foundational Core**: Fundamental mathematics, domain science, and analytical principles.\n`;
    dynamicResponse += `- **Applied Laboratory Work**: Hands-on workshop practice, simulation tools, and software modeling.\n`;
    dynamicResponse += `- **Advanced Electives**: Specialized industry modules and final-year capstone projects.\n\n`;
  } else if (isScope) {
    dynamicResponse += `#### 💼 Career Scope, Jobs & Placement Outlook\n`;
    dynamicResponse += `- **Industry Demand**: Strong growth across public sector undertakings (PSUs), multinational corporations (MNCs), and specialized startups.\n`;
    dynamicResponse += `- **Entry-Level Salary**: Competitive starting packages with rapid escalation based on technical expertise.\n`;
    dynamicResponse += `- **Higher Studies**: Opportunities for M.Tech, MS, MBA, or specialized research fellowships.\n\n`;
  } else {
    dynamicResponse += `#### 🎯 Academic Overview\n`;
    dynamicResponse += `The topic **"${cleanQuery}"** represents an important academic area. Here are the core educational pillars:\n\n`;
    dynamicResponse += `1. **Academic Foundation**: Requires strong fundamentals in science, analytical reasoning, and specialized domain knowledge.\n`;
    dynamicResponse += `2. **Course Options**: Choose between 3-Year Polytechnic Diplomas (practical) or 4-Year University Degrees (B.Tech/B.Sc).\n`;
    dynamicResponse += `3. **Practical Credentials**: Gain industry exposure through laboratory modules and project work.\n\n`;
  }

  dynamicResponse += `---\n\n#### 💡 Actionable Next Steps:\n`;
  dynamicResponse += `- Explore specific branch roadmaps in our **Sectors Hub**!\n`;
  dynamicResponse += `- Check accredited colleges and cut-offs in our **Colleges Hub**!\n`;
  dynamicResponse += `- Store your admission tokens and timetables safely in your **Document Vault**!`;

  return {
    isEducational: true,
    text: dynamicResponse
  };
}
