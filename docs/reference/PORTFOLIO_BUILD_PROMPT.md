# Claude Code CLI Prompt: Personal Portfolio Site

> Copy everything below the line into Claude Code CLI as your first message in an empty project folder.

---

## 1. CONTEXT

I am Kavishka Deshan, a Software Engineering undergraduate at the National Institute of Business Management (NIBM), Sri Lanka. I am applying for software engineering internships.

I want a personal portfolio website that shows my projects and skills to recruiters and engineering leads. The site is my main link on my CV, LinkedIn, and GitHub profile.

My development machine is a MacBook Pro (Intel) running macOS with zsh, Node.js, npm, and Homebrew already installed.

This is a brand new project. There is no existing code to preserve.

---

## 2. GOAL

Build a fast, static, single-page portfolio website that:

1. Loads in under two seconds on a normal mobile connection.
2. Works on mobile, tablet, and desktop.
3. Can be deployed to GitHub Pages for free at a custom domain.
4. Is easy for me to update later by editing one content file, not by hunting through components.
5. Makes it obvious within five seconds who I am, what I build, and how to contact me.

---

## 3. LOCKED TECHNICAL DECISIONS

Do not change these. Do not propose alternatives.

| Item | Decision |
|---|---|
| Framework | Next.js (App Router) with static export (`output: 'export'`) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion, used sparingly (see section 6) |
| Icons | lucide-react |
| Hosting | GitHub Pages, deployed by GitHub Actions |
| Package manager | npm |
| Node version | Whatever `node --version` reports on this machine; pin it in the workflow |

Static export rules that must be respected:

- No API routes, no server components that fetch at request time, no middleware, no ISR. GitHub Pages serves static files only.
- Set `images: { unoptimized: true }` in `next.config.ts`, because the Next.js image optimizer needs a server.
- Add a `.nojekyll` file to the output so GitHub Pages does not strip folders starting with an underscore.
- The site will live at the root of a custom domain, so `basePath` stays empty. Do not add a `basePath`.

Before installing anything, run `node --version` and `npm --version` and tell me the results. If Node is older than the version Next.js requires, stop and tell me instead of upgrading anything yourself.

---

## 4. DESIGN DIRECTION

Follow this design system exactly. It is the brief, not a suggestion.

### Colours

```
Background          #181818
Background (cards)  #202020
Background (alt)    #151515
Text primary        #f5f5f5
Text muted          #999999
Border              #202020
Accent              #14b8a6
Accent hover        #19c6b3
```

Rules:

- Dark canvas throughout. Never introduce a white or light background section.
- Teal is the only accent. Do not add a second accent colour.
- Never use pure black `#000000` for text. Use `#f5f5f5`.
- Do not add colours outside this palette.

### Typography

- One typeface for everything: **Outfit**, loaded through `next/font/google` so it self-hosts in the static build.
- Headings: weight 800, tight letter spacing (around -0.03em on large sizes).
- Body: weight 400.
- The hero name is the largest element on the page. Make it genuinely large, clamped responsively, and let it dominate the first screen.
- Do not put tracked-out all-caps eyebrow labels above every section heading. Use at most one such label in the whole site, or none.

### Spacing and shape

- Base spacing unit is 17px. Use multiples: 17, 34, 51, 68, 85. Configure these as Tailwind spacing tokens so the grid is enforced, not remembered.
- Border radius: 8px on buttons and small elements, larger radius only on the profile photo (full circle).
- Elevation uses tinted shadows, not flat black. Use `rgba(25, 198, 179, 0.4) 0px 0px 14px 0px` for the accent glow on focused or hovered interactive elements, and `rgba(0, 0, 0, 0.133) 0px 12px 32px 0px` for deep layers.

### Components

Primary button: background `#19c6b3`, text `#111111`, radius 8px, padding 14px vertical and 24px horizontal, weight 600.

Outline button: transparent background, white text, radius 8px, 0.8px border at `rgba(255,255,255,0.094)`, padding 8px vertical and 12px horizontal.

Card: background `#202020`, radius 8px, padding 17px.

### What NOT to do

- Do not copy the layout, section order, wording, or code of any existing portfolio site. Use the tokens above for the visual language and design an original layout for my content.
- No fake statistics. I am a student. Do not add "years of experience", "happy clients", or "projects delivered" counters.
- No decorative badges, ribbons, or ornaments.
- No fade-and-slide-up entrance animation on every section. That reads as generated.
- No "→" arrow appended to every button label.

---

## 5. SITE STRUCTURE

Single page with anchor navigation. Sections in this order:

1. **Hero.** My name, my title, one short line about what I build, a link to projects and a link to contact. Profile photo as a circle. A small "Open to internships" status marker is fine.
2. **About.** Two short paragraphs in my own voice, plus my current education line.
3. **Skills.** Grouped by category, laid out so a recruiter can scan it in a few seconds. Do not use skill percentage bars or star ratings. They are meaningless and everybody can tell.
4. **Projects.** The main section. Each project gets a card with title, project type, tech stack, a short description, key features, and a link to its GitHub repository. Navora goes first and should read as the flagship.
5. **Education.** Programme, institution, coursework, expected graduation.
6. **Contact.** Email, phone, LinkedIn, GitHub, and a short line saying I am open to internship opportunities.
7. **Footer.** Name, current year, and a note that the site is built with Next.js and hosted on GitHub Pages.

A sticky top navigation bar with smooth scroll to each section. It must collapse into a working mobile menu.

---

## 6. MOTION

Keep motion disciplined.

- One orchestrated entrance on page load for the hero only.
- Interaction feedback on hover and focus for links, buttons, and project cards.
- Respect `prefers-reduced-motion` and disable non-essential motion when it is set.
- Nothing that loops forever or moves without the user doing something, apart from the hero load.

---

## 7. CONTENT

Put all of this in a single typed file, `src/content/portfolio.ts`, exported as typed objects. Every component reads from that file. I must be able to add a project by editing only that file.

### Identity

```
Name:      Kavishka Deshan
Title:     Software Engineering Undergraduate
Location:  Sri Lanka
Email:     deshank962@gmail.com
Phone:     +94 701218929
GitHub:    https://github.com/Kavishka-Deshan
LinkedIn:  https://linkedin.com/in/kavishka-deshan2001
Photo:     public/profile.jpg  (I will add this file myself. Use a graceful fallback if it is missing.)
```

### About

Software Engineering undergraduate at NIBM, Sri Lanka, looking for a software engineering internship. I build mobile and web applications end to end, from database design and API integration through to the user interface. I work with Flutter, Kotlin, React, Next.js, Firebase, and Supabase, and I am comfortable in Git-based team workflows.

### Skills

- **Programming Languages:** Java, Python, C, C++, C#, JavaScript, Dart, Kotlin, SQL
- **Frontend and UI:** React, Next.js, Flutter, Jetpack Compose, HTML5, CSS3, Tailwind CSS, Bootstrap
- **Backend and APIs:** REST APIs, API Integration, Node.js, TypeScript, Firebase Cloud Services
- **Cloud and Platforms:** Firebase, Supabase, Google Maps, Google Places, GitHub Pages, GitHub Actions
- **Databases:** Cloud Firestore, Firebase Realtime Database, PostgreSQL, MySQL, SQLite
- **Mobile Development:** Flutter, Android, Kotlin, Jetpack Compose, Google Maps, CameraX, Room
- **IoT and Embedded:** Arduino, ESP32, Embedded C/C++, RFID, Sensor Integration, I2C/SPI
- **Tools and Development:** Git, GitHub, VS Code, IntelliJ IDEA, Visual Studio, Arduino IDE, Testing
- **Core Concepts:** Object-Oriented Programming, Data Structures and Algorithms, RESTful API Design

### Projects

**1. Navora — Intelligent Travel Guide to Sri Lanka**
Type: HND Final Project
Stack: Flutter, Dart, Firebase, Supabase, Gemini
Repo: https://github.com/Kavishka-Deshan/Navora
Summary: A cross-platform travel application that plans trips across Sri Lanka using real routing and place data, so each itinerary follows an actual travel route instead of an unordered list of locations.
Features: Route-based trip planning from live routing and place data; Gemini narration through Firebase AI Logic; maps, saved trips, and offline caching; AR-style navigation; trip sharing, encrypted chat, and blockchain-verified reviews.

**2. Fixora — Device Repair and Service Management App**
Type: Group Project
Stack: Kotlin, Android, Jetpack Compose, Firebase, Supabase, Room
Repo: https://github.com/Kavishka-Deshan/fixora-mobile-app
Summary: A role-based Android application covering the full device repair lifecycle for customers, technicians, branch managers, and administrators.
Features: Booking and repair tracking; technician assignment and workflows; parts inventory management; role-aware navigation; real-time Firestore updates with Room for offline-ready local data.

**3. Smart Mining Helmet — IoT Safety Monitoring**
Type: Group Project
Stack: ESP32, Arduino C++, React, TypeScript, Firebase
Repo: https://github.com/Kavishka-Deshan/IoT-Based-Mining-Worker-Safety-Helmet-with-RFID-Zone-Tracking-and-SOS-Alerts
Summary: An IoT worker-safety platform built on ESP32 firmware, reading environmental and motion sensors mounted on a helmet unit.
Features: RFID zone tracking to record which section of the site a worker is in; telemetry streamed to Firebase Realtime Database; live React and TypeScript supervisor dashboard; SOS alerting and incident logging.

**4. Aarya Tea — Brand and Product Website**
Type: Personal Project
Stack: Next.js, React, TypeScript, Tailwind CSS, GSAP
Repo: https://github.com/Kavishka-Deshan/Aarya-tea
Summary: A bilingual product-marketing website for a tea brand, built on the Next.js App Router and deployed as a static site.
Features: Responsive theme-aware layouts; scroll-linked animation with GSAP; structured bilingual product content; automated GitHub Pages deployment through GitHub Actions.

**5. SafeClean — Secure Windows Disk Cleaner**
Type: Personal Project
Stack: Python, Tkinter, unittest
Repo: https://github.com/Kavishka-Deshan/SafeClean
Summary: A Windows desktop utility that finds removable system, browser, and developer cache data while protecting credentials and personal files from deletion.
Features: Layered allowlist and denylist protection; path validation; dry-run preview; administrator elevation; audit logging; automated safety tests.

**6. Library Management System**
Type: Academic Project
Stack: Java, Swing, JDBC, MySQL, JasperReports
Repo: https://github.com/Kavishka-Deshan/EAD-1-Library-Management
Summary: A desktop library-management application for cataloguing books, managing student records, and handling issues and returns.
Features: Database-backed authentication; book search and stock tracking; due-date monitoring; JDBC with the DAO pattern; printable PDF reports through JasperReports.

### Education

Higher National Diploma in Software Engineering (HND), National Institute of Business Management (NIBM), Sri Lanka. Currently following.
Relevant coursework: Software Engineering, Object-Oriented Programming, Database Management Systems, Computer Networks and Security, Data Structures and Algorithms, Machine Learning, Deep Learning, Artificial Intelligence.
Expected graduation: 2028.

### Languages

Sinhala (native), English (working proficiency).

---

## 8. CONTACT FORM

Do not build a backend. GitHub Pages cannot run one.

Use a `mailto:` link as the primary contact action, and copy-to-clipboard buttons for the email address and phone number.

If you think a real form is worth adding, propose Web3Forms or Formspree as a **recommendation only**, state the free-tier submission limit, and wait for my answer. Do not add it without asking.

---

## 9. QUALITY REQUIREMENTS

- Semantic HTML: one `h1`, correct heading order, `nav`, `main`, `section`, `footer`.
- Visible keyboard focus styles on every interactive element. Use the teal glow shadow for focus.
- All images have meaningful `alt` text. Decorative images get `alt=""`.
- Colour contrast meets WCAG AA for body text. Check `#999999` on `#181818` and darken or lighten it if it fails.
- SEO: page title, meta description, Open Graph and Twitter card tags, an og image, `robots.txt`, and `sitemap.xml`.
- A favicon.
- No console errors and no hydration warnings.
- No unused dependencies in `package.json`.

---

## 10. BUILD ORDER

Work in these phases. Stop at the end of each phase, tell me what you did, and wait for me to say continue.

**Phase 1 — Plan.** Before writing code, give me a short design plan: the layout concept for each section as one sentence plus an ASCII wireframe, the type scale, and the Tailwind token setup. Review your own plan and tell me which parts look like a generic default and what you changed. Do not write code in this phase.

**Phase 2 — Scaffold.** Next.js app, TypeScript, Tailwind with the palette and 17px spacing scale as tokens, Outfit font wired up, static export config, the content file with all data from section 7. Confirm `npm run build` succeeds.

**Phase 3 — Sections.** Build the sections in the order listed in section 5. After each one, run the dev server and confirm it renders.

**Phase 4 — Responsive and accessibility.** Mobile menu, breakpoint checks at 375px, 768px, 1280px, and 1600px. Keyboard navigation pass. Reduced-motion pass.

**Phase 5 — Deploy.** Covered in section 11.

---

## 11. DEPLOYMENT

I have the GitHub Student Developer Pack, which includes a free domain from Namecheap for one year. Confirm the current offer and TLD by checking the Education Pack page before you write instructions, because this changes.

Set up:

1. A GitHub Actions workflow that builds the site and publishes to GitHub Pages on every push to `main`. Use the official `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages` actions rather than a third-party one.
2. A `CNAME` file in `public/` containing my domain, so the custom domain survives every deploy.
3. A `.nojekyll` file in the output.

Then write me a file called `DEPLOY.md` with the exact steps I do by hand:

- Which repository name to use and why.
- The DNS records to add at the registrar for both the apex domain and the `www` subdomain. Look up GitHub's current Pages IP addresses rather than writing them from memory, and say where you got them.
- Where to set the custom domain in the repository settings.
- How to turn on "Enforce HTTPS" and roughly how long the certificate takes.
- How to verify the deployment worked.

Do not run `git init`, do not commit, and do not push anything. I will handle Git myself.

---

## 12. WORKING RULES

- Verify before claiming. Do not tell me something builds, renders, or passes unless you actually ran it. If you did not verify something, say so plainly.
- When something fails, find the root cause before changing code. Show me the actual error.
- Do not add dependencies beyond the ones listed in section 3 without asking first and telling me why.
- Do not invent content, project features, dates, or achievements. Everything on the site comes from section 7. If something is missing, ask me.
- Keep components small and readable. No abstractions that exist only to look clever.
- Free-tier awareness: GitHub Pages is static only, has a soft 1GB repository limit and a 100GB per month bandwidth limit. Keep the built site small and tell me the final build size.
- If any instruction here conflicts with something you would normally prefer, follow this document.

Start with Phase 1 now.
