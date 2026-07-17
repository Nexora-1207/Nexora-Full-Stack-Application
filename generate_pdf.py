import sys
from fpdf import FPDF
from fpdf.enums import XPos, YPos

class NexoraDocPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            # Header text
            self.set_font("Helvetica", "B", 8)
            self.set_text_color(100, 100, 100)
            self.cell(0, 10, "NEXORA FULL-STACK APPLICATION - TECHNICAL MANUAL", new_x=XPos.LMARGIN, new_y=YPos.LAST, align="L")
            self.set_font("Helvetica", "", 8)
            self.cell(0, 10, f"Page {self.page_no()}", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="R")
            self.ln(2)
            # Line separator
            self.set_draw_color(220, 220, 220)
            self.set_line_width(0.5)
            self.line(15, 16, 195, 16)
            self.ln(4)

    def footer(self):
        if self.page_no() > 1:
            self.set_y(-15)
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(150, 150, 150)
            self.cell(0, 10, "CONFIDENTIAL - FOR INTERNAL TEAM USE ONLY", align="C")

def create_cover_page(pdf):
    pdf.add_page()
    
    # Top color bands
    pdf.set_fill_color(10, 30, 80) # Deep Navy
    pdf.rect(0, 0, 210, 30, "F")
    
    pdf.set_fill_color(0, 240, 255) # Neon Cyan
    pdf.rect(0, 30, 210, 4, "F")
    
    pdf.ln(50)
    
    # Brand title
    pdf.set_font("Helvetica", "B", 32)
    pdf.set_text_color(10, 30, 80)
    pdf.cell(0, 15, "NEXORA SYSTEM", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.cell(0, 15, "ARCHITECTURE MANUAL", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    
    pdf.ln(5)
    
    # Subtitle
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 10, "Complete Analysis of the Live Full-Stack Student Hub Application", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    
    pdf.ln(35)
    
    # Decorative line
    pdf.set_draw_color(200, 200, 200)
    pdf.set_line_width(0.5)
    pdf.line(40, pdf.get_y(), 170, pdf.get_y())
    
    pdf.ln(35)
    
    # Metadata info
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 6, "Author: Antigravity AI Engineer", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.cell(0, 6, "Client: Nexora Development Team", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.cell(0, 6, "Tech Stack: React Native, Expo Web, Supabase", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.cell(0, 6, "Release State: Production Ready (v1.0)", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.cell(0, 6, "Date of Generation: July 2, 2026", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    
    # Bottom color bands
    pdf.set_fill_color(10, 30, 80)
    pdf.rect(0, 267, 210, 30, "F")
    
    pdf.set_fill_color(255, 0, 138) # Neon Magenta
    pdf.rect(0, 263, 210, 4, "F")

def add_heading(pdf, title):
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(10, 30, 80)
    pdf.ln(6)
    pdf.cell(0, 10, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_draw_color(10, 30, 80)
    pdf.set_line_width(0.8)
    pdf.line(15, pdf.get_y(), 195, pdf.get_y())
    pdf.ln(5)

def add_subheading(pdf, title):
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(255, 0, 138) # Magenta
    pdf.ln(3)
    pdf.cell(0, 8, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(2)

def add_paragraph(pdf, text):
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(60, 60, 60)
    pdf.multi_cell(0, 5, text)
    pdf.ln(4)

def add_bullet(pdf, label, desc):
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(40, 40, 40)
    pdf.write(5, "- " + label + ": ")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(60, 60, 60)
    pdf.multi_cell(0, 5, desc)
    pdf.ln(3)

def generate_nexora_pdf(output_path):
    pdf = NexoraDocPDF(orientation="P", unit="mm", format="A4")
    pdf.set_margins(15, 15, 15)
    pdf.set_auto_page_break(auto=True, margin=20)
    
    # Page 1: Cover Page
    create_cover_page(pdf)
    
    # Page 2: Executive Summary & Technical Stack
    pdf.add_page()
    add_heading(pdf, "1. Executive Summary & Project Overview")
    add_paragraph(pdf, 
        "Nexora is a modern full-stack academic and career launching pad application built to guide "
        "students through the discovery of vocational and professional pathways. By linking local educational "
        "structures with industrial trades and elite universities, Nexora offers a personalized hub for career "
        "development. The application leverages a hybrid online/offline dataset architecture, allowing seamless "
        "connectivity via Supabase Cloud, and is optimized for cross-platform deployment on Android, iOS, "
        "and Web targets."
    )
    add_paragraph(pdf, 
        "The system has been engineered with a futuristic 'cyberpunk-neon' style design system, offering dark "
        "and light mode adaptivity, interactive animations, and robust verification steps designed to impress "
        "the modern student demographic. Key achievements include automated OAuth credential resolution, an "
        "interactive career selection matrix, and an automated match-scoring algorithm that matches college campus "
        "missions directly against user-curated skill dossiers."
    )
    
    add_heading(pdf, "2. Core Technology Stack & Architecture")
    add_paragraph(pdf, 
        "The application leverages modern web and mobile standards to provide absolute flexibility, "
        "speed, and reliability. Below are the core technological layers and dependencies utilized in this project:"
    )
    
    add_bullet(pdf, "Frontend Framework", "React Native built on top of Expo SDK 54, enabling shared TypeScript codebases across web, Android, and iOS devices.")
    add_bullet(pdf, "Web Deployment Engine", "React Native Web (react-native-web) integrating Vercel hosting configurations for high-speed instant preview and deployment.")
    add_bullet(pdf, "Navigation Router", "React Navigation including Native Stack Router and Bottom Tab Navigation engines configured with custom animated interfaces.")
    add_bullet(pdf, "Backend Database & Auth Service", "Supabase Platform (@supabase/supabase-js) providing secure database storage, User Profile Dossiers, Mock/Real College catalogs, and email/Google OAuth authentication services.")
    add_bullet(pdf, "Aesthetics & Graphics", "Expo Linear Gradient backgrounds, Ionicons iconography packs, and customized React Native Animated library modules (spring animations, rotation tracers, and pulse overlays).")
    
    # Page 3: Student Onboarding & Navigation Flow
    pdf.add_page()
    add_heading(pdf, "3. Student Onboarding & Navigation Flow")
    add_paragraph(pdf, 
        "To ensure a structured and engaging user experience, the application utilizes a specific state-driven "
        "onboarding and routing lifecycle. Below is the step-by-step progression of how a student navigates "
        "from initial authorization to the main dashboard:"
    )
    
    add_bullet(pdf, "1. Session Verification", 
        "On launch, App.tsx queries Supabase auth.getSession() and listens to onAuthStateChange(). If no session "
        "is found, the user is restricted to the AuthStack. On successful authentication, the authenticated Stack.Group "
        "is mounted, rendering the Sector Selection screen first.")
        
    add_bullet(pdf, "2. Command Hub Entry", 
        "SectorSelectionScreen.tsx plays a typewriter intro ('NEXORA' -> 'CHOOSE PATH'). The user is then presented "
        "with 14 interactive career pods. Selecting any sector other than 'ENGINEERING' triggers a direct "
        "navigation.replace('Home') routing them straight to the main Dashboard.")
        
    add_bullet(pdf, "3. Guided Engineering Branching", 
        "If the user selects 'ENGINEERING', the screen navigates to EngineeringPathScreen.tsx. The student is guided "
        "through a sequence of career choices (e.g. Intermediate, Diploma, ITI -> Science, Commerce, Arts -> MPC, "
        "Mechanical Engineering, Turner, etc.).")
        
    add_bullet(pdf, "4. Pathway Synchronization & Dashboard Landing", 
        "Once a student reaches a terminal option in the career tree, a status check displays 'Pathway Synchronized'. "
        "After a 2000ms delay, the router executes navigation.replace('Home'), landing the student on the bottom-tab "
        "navigation hub (TabNavigator) which defaults to the Home screen dashboard.")
    
    # Page 4: Screen Matrix (Part 1)
    pdf.add_page()
    add_heading(pdf, "4. Screen-by-Screen Feature Specifications")
    add_paragraph(pdf, 
        "The Nexora application has been fully modularized into discrete screens, each serving a core requirement "
        "in the student's journey. Below is the detailed specification of the implemented screens:"
    )
    
    add_subheading(pdf, "A. Authentication Gate (AuthScreen.tsx)")
    add_paragraph(pdf, 
        "The security hub implements multiple security entry vectors. It provides traditional email and "
        "password authentication, password recovery hubs, security key updates, and quick One-Time Password "
        "(OTP) logins. Additionally, it integrates a Google OAuth gateway that handles redirects on the web "
        "and links back via deep linking (Linking.createURL) in Expo Go environments. The screen features a "
        "dynamic tracer animation that spins around the gateway card and a breathing brand logo animation."
    )
    
    add_subheading(pdf, "B. Sector Selection Screen (SectorSelectionScreen.tsx)")
    add_paragraph(pdf, 
        "This serves as the initial landing screen after authorization. It triggers a typewriter intro "
        "animation sequence ('NEXORA' and 'CHOOSE PATH') and renders a grid of 14 core industrial sectors "
        "(e.g., Engineering, Skilled Trades, Computers, Hospitality, fashion). Each item is represented as a "
        "pod with circular color borders, spring scaling effects upon user touch/hover, and neon-themed glow halos. "
        "Selecting Engineering redirects the user to the Career Tree, while other sectors navigate to the main Hub."
    )
    
    add_subheading(pdf, "C. Career Decision Tree (EngineeringPathScreen.tsx)")
    add_paragraph(pdf, 
        "This interactive module maps a student's educational background to potential industrial targets. "
        "It acts as a decision tree guiding students from foundation choices (Intermediate, Diploma, or ITI) "
        "through streams (Science, Commerce, Arts) to precise branches (Civil, Mechanical, Computer Engineering, "
        "Electrician, Machinist). The screen incorporates sliding card animations, a pulsing progress bar, and "
        "descriptive panels clarifying the nature and scope of each career path before final synchronization."
    )
    
    # Page 5: Screen Matrix (Part 2)
    pdf.add_page()
    add_subheading(pdf, "D. Student Hub Dashboard (HomeScreen.tsx)")
    add_paragraph(pdf, 
        "The central hub contains the student dashboard. Its primary element is the animated Career "
        "Launchpad card which pulses dynamically to show the student's current matching percentage (e.g. 84% matched). "
        "The screen includes horizontal scrolling cards featuring scholarship applications (e.g. Global STEM, "
        "Google Pro), an interactive 4-tile grid (Scholarships, Resume Lab, Community, Career Quiz) with customized "
        "divider layouts, an exit gate (sign-out button linked to Supabase), and a calendar row showing upcoming events."
    )
    
    add_subheading(pdf, "E. College Hub Screen (CollegeScreen.tsx)")
    add_paragraph(pdf, 
        "This comprehensive university search and application module queries the Supabase database. "
        "It indicates live connectivity status with an online/offline cache sync badge. Students can search via "
        "text queries or filter by sector tabs. Each college card features a customized matching badge. Clicking "
        "on a college card displays the Mission Brief Modal with core directives, tuition waiver information, "
        "and specific entry requirements. The application gateway lets students apply directly, creating a unique "
        "Admissions Token (e.g. NEX-723049) and upserting the application to the database."
    )
    
    add_subheading(pdf, "F. Student Profile Dossier (ProfileScreen.tsx)")
    add_paragraph(pdf, 
        "A LinkedIn-style profile manager enabling users to edit their biographical details, educational "
        "matrix (high school and college trade details), contact information, and social links (LinkedIn URL). "
        "It features an interactive Skill Tag Manager allowing students to add/remove custom skill badges in "
        "real time. The Dossier is synchronized directly with the Supabase profiles database table. The updated skill "
        "portfolio dynamically feeds into the matching algorithms of the College Hub."
    )
    
    add_subheading(pdf, "G. Secondary Modules (AIScreen.tsx, NotificationScreen.tsx)")
    add_paragraph(pdf, 
        "- Nexora AI Screen: Houses the chatbot S-Node interface allowing users to record or type academic doubt queries.\n"
        "- Notification Screen: Logs system notifications confirming database sync, profile status updates, and admissions activity."
    )
    
    # Page 6: Custom Tech Highlights
    pdf.add_page()
    add_heading(pdf, "5. Key Technical Highlights & Custom Algorithms")
    add_paragraph(pdf, 
        "Beyond standard forms and screens, the Nexora application implements several specialized logical "
        "systems that enhance data integrity, user experience, and personalized intelligence:"
    )
    
    add_subheading(pdf, "I. Skill-to-College Match Rate Algorithm")
    add_paragraph(pdf, 
        "Each college card displays a personalized match rate. If the user's Profile Dossier contains skills "
        "(e.g., Python, CAD), the College screen loops through the college's campus mission, Perks, and Description "
        "arrays. For each skill keyword found in these text descriptions, the baseline match rate is boosted "
        "by 3%, capped at a maximum of 100%. This provides students with immediate visual reinforcement "
        "about which institutes match their active skillset. If no custom skills are present, the algorithm "
        "reverts to the baseline institutional match rate."
    )
    
    add_subheading(pdf, "II. Offline Cache & Supabase Network Resiliency")
    add_paragraph(pdf, 
        "The application implements a robust hybrid data retrieval pattern. When fetching college "
        "information, the client first attempts to establish a connection with the remote Supabase 'colleges' "
        "table. If the database is unreachable or offline, the system catches the error, transitions the sync badge "
        "from 'ONLINE SYNCED' to 'CACHE SYNCED', and seamlessly loads a robust mock database from the offline client memory. "
        "This ensures zero service disruption for students operating in low-bandwidth environments."
    )
    
    add_subheading(pdf, "III. Dynamic Animated Feedback Engine")
    add_paragraph(pdf, 
        "To achieve a premium, futuristic aesthetic, several animations are ran concurrently: "
        "1. Glowing Halo effects that calculate positioning dynamically to expand outwards when a card is focused. "
        "2. Interleaved spring animations that control icon scaling, text slides, and opacity triggers in the tab navigation bar. "
        "3. A constant rotating linear gradient trace border wrapping around the login gateway card, creating a secure shield aesthetic."
    )
    
    add_heading(pdf, "6. Conclusion & Verification Summary")
    add_paragraph(pdf, 
        "The Nexora application has been verified across Web and Mobile formats. The TypeScript codebase is clean, "
        "modular, and type-safe. Environment variables, database connection strings, and deep-link schemes "
        "are safely configured. This document outlines the complete scope of features developed, providing the Nexora "
        "development team with a comprehensive blueprint of the application state as of July 2, 2026."
    )
    
    # Save PDF
    pdf.output(output_path)
    print(f"Success: PDF documentation generated at {output_path}")

if __name__ == "__main__":
    out_path = "c:\\Users\\user\\Desktop\\Nexora Main Folder\\Nexora_App_Documentation.pdf"
    if len(sys.argv) > 1:
        out_path = sys.argv[1]
    generate_nexora_pdf(out_path)
