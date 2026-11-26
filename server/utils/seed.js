import Admin from '../models/Admin.js';
import Profile from '../models/Profile.js';
import WebsiteSettings, { DEFAULT_SECTION_ORDER } from '../models/WebsiteSettings.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Achievement from '../models/Achievement.js';
import Certificate from '../models/Certificate.js';
import Gallery from '../models/Gallery.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Blog from '../models/Blog.js';
import Analytics from '../models/Analytics.js';
import { connectDB } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Ensures at least one Admin user, Profile, and WebsiteSettings exist on startup.
 * Also seeds sample portfolio records if the database has zero projects & skills
 * so a fresh deployment immediately demonstrates every dynamic section.
 */
export const ensureInitialSetup = async () => {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const email = process.env.ADMIN_EMAIL || 'admin@portfolio.dev';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const name = process.env.ADMIN_NAME || 'Gurpreet Verma';
    const passwordHash = await Admin.hashPassword(password);

    await Admin.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'superadmin',
    });
    console.log(`Default admin created: ${email}`);
  }

  const profileCount = await Profile.countDocuments();
  if (profileCount === 0) {
    await Profile.create({
      name: 'Gurpreet Verma',
      headline: 'Full-Stack Developer, UI/UX Designer & Security Engineer',
      heroBadge: 'Available for Full-Stack & Security Engineering Roles',
      shortBio:
        'Building resilient, high-performance web applications, intuitive interfaces, and security-first cloud architectures.',
      fullBio:
        'I am a full-stack software engineer and security enthusiast focused on crafting scalable MERN and cloud-native applications. I combine clean system design, expressive user experiences, and defensive security practices—from hardened REST APIs and JWT cookie auth to automated CI/CD pipelines.',
      careerGoals:
        'Architecting secure, high-throughput developer platforms and AI-assisted web products with uncompromising UX quality.',
      interests: [
        'Distributed Systems',
        'Application Security',
        'UI/UX Engineering',
        'Cloud Infrastructure',
        'Open Source',
      ],
      email: process.env.ADMIN_EMAIL || 'vermagurpreet991@gmail.com',
      location: 'India',
      availabilityStatus: 'open',
      yearsOfExperience: '2+',
      profileImage:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      socialLinks: {
        github: 'https://github.com/Gurpreetverma0',
        linkedin: 'https://linkedin.com',
        website: 'https://github.com/Gurpreetverma0/portfolio',
      },
      highlights: [
        { label: 'Projects Shipped', value: '15+' },
        { label: 'Security Audits', value: '10+' },
        { label: 'Certifications', value: '8+' },
      ],
    });
  }

  const settingsCount = await WebsiteSettings.countDocuments();
  if (settingsCount === 0) {
    await WebsiteSettings.create({
      siteTitle: 'Gurpreet Verma — Full-Stack & Security Engineer',
      siteTagline: 'Full-Stack Developer, UI/UX Designer & Security Engineer',
      logoText: 'GV.',
      accentColor: '#6366f1',
      defaultTheme: 'dark',
      sectionOrder: DEFAULT_SECTION_ORDER,
    });
  }

  const [skillCount, projectCount] = await Promise.all([
    Skill.countDocuments(),
    Project.countDocuments(),
  ]);

  // Only auto-seed sample records on the very first fresh database run
  // when no admin existed previously. Never resurrect dummy records if the admin
  // intentionally deleted or managed them.
  if (adminCount === 0 && skillCount === 0 && projectCount === 0) {
    await Promise.all([
      Skill.insertMany([
        { name: 'JavaScript / TypeScript', category: 'Languages', level: 92, icon: 'Code2', yearsOfExperience: '3 yrs', displayOrder: 1 },
        { name: 'Python', category: 'Languages', level: 85, icon: 'Terminal', yearsOfExperience: '2 yrs', displayOrder: 2 },
        { name: 'React.js & Vite', category: 'Frontend', level: 94, icon: 'Layers', yearsOfExperience: '3 yrs', displayOrder: 3 },
        { name: 'Tailwind CSS & Framer Motion', category: 'Frontend', level: 90, icon: 'Palette', yearsOfExperience: '2.5 yrs', displayOrder: 4 },
        { name: 'Node.js & Express.js', category: 'Backend', level: 91, icon: 'Server', yearsOfExperience: '3 yrs', displayOrder: 5 },
        { name: 'REST APIs & JWT Auth', category: 'Backend', level: 89, icon: 'KeyRound', yearsOfExperience: '2.5 yrs', displayOrder: 6 },
        { name: 'MongoDB & Mongoose', category: 'Databases', level: 88, icon: 'Database', yearsOfExperience: '2.5 yrs', displayOrder: 7 },
        { name: 'PostgreSQL & Redis', category: 'Databases', level: 78, icon: 'HardDrive', yearsOfExperience: '1.5 yrs', displayOrder: 8 },
        { name: 'OWASP Top 10 & AppSec', category: 'Cybersecurity', level: 86, icon: 'ShieldCheck', yearsOfExperience: '2 yrs', displayOrder: 9 },
        { name: 'Docker, Git & Cloud Deploy', category: 'Tools & DevOps', level: 84, icon: 'Wrench', yearsOfExperience: '2 yrs', displayOrder: 10 },
      ]),
      Project.insertMany([
        {
          title: 'SentinelCMS — Security-Hardened Portfolio & CMS',
          slug: 'sentinelcms-security-hardened-portfolio',
          shortDescription:
            'Full-stack dynamic portfolio platform with HTTP-only JWT authentication, RBAC, Cloudinary media pipelines, and real-time analytics.',
          fullDescription:
            'Built an enterprise-grade CMS-powered personal portfolio using React, Vite, Tailwind CSS, Node.js, Express, and MongoDB. Features Helmet security headers, rate-limited endpoints, Zod request validation, Cloudinary asset management, dynamic section ordering, and Recharts analytics.',
          thumbnail:
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
          techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Cloudinary'],
          category: 'Full-Stack',
          githubUrl: 'https://github.com/Gurpreetverma0/portfolio',
          liveDemoUrl: 'https://github.com/Gurpreetverma0/portfolio',
          isFeatured: true,
          displayOrder: 1,
          status: 'published',
        },
        {
          title: 'AegisScan — Automated Web Vulnerability Scanner',
          slug: 'aegisscan-web-vulnerability-scanner',
          shortDescription:
            'Security auditing tool that inspects HTTP headers, CORS misconfigurations, TLS posture, and exposed endpoints with PDF reporting.',
          fullDescription:
            'Designed an extensible security diagnostics suite in Node.js and React that checks security headers (CSP, HSTS, X-Frame-Options), cookie flags, and common OWASP misconfigurations, visualizing risk severity on an interactive dashboard.',
          thumbnail:
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
          techStack: ['TypeScript', 'React', 'Node.js', 'Express', 'Zod'],
          category: 'Cybersecurity',
          githubUrl: 'https://github.com/Gurpreetverma0',
          isFeatured: true,
          displayOrder: 2,
          status: 'published',
        },
        {
          title: 'PulseFlow — Real-Time Developer Analytics',
          slug: 'pulseflow-realtime-developer-analytics',
          shortDescription:
            'Privacy-first telemetry dashboard tracking API latency, error rates, and daily visitor trends without invasive cookies.',
          fullDescription:
            'Implemented a lightweight telemetry ingestion pipeline with SHA-256 salted daily visitor hashing, aggregated MongoDB buckets, and interactive Recharts visualizations.',
          thumbnail:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          techStack: ['React', 'Recharts', 'MongoDB', 'Tailwind CSS'],
          category: 'Frontend',
          githubUrl: 'https://github.com/Gurpreetverma0',
          isFeatured: false,
          displayOrder: 3,
          status: 'published',
        },
      ]),
      Experience.insertMany([
        {
          company: 'CloudScale Labs',
          position: 'Full-Stack Developer Intern',
          employmentType: 'Internship',
          location: 'Remote',
          startDate: new Date('2025-05-01'),
          endDate: new Date('2025-11-01'),
          description:
            'Built and hardened customer-facing SaaS modules using React, Node.js, and MongoDB.',
          responsibilities: [
            'Engineered modular REST APIs with Zod validation and rate limiting, cutting invalid payload errors by 40%.',
            'Implemented responsive UI components with Tailwind CSS and Framer Motion.',
            'Integrated Cloudinary signed media uploads and automated image optimization.',
          ],
          achievements: ['Delivered admin analytics module 2 weeks ahead of schedule'],
          techUsed: ['React', 'Express', 'MongoDB', 'Tailwind CSS'],
          displayOrder: 1,
        },
      ]),
      Education.insertMany([
        {
          institution: 'Institute of Engineering & Technology',
          degree: 'Bachelor of Technology (B.Tech)',
          fieldOfStudy: 'Computer Science & Engineering',
          startYear: 2022,
          endYear: 2026,
          isCurrent: true,
          grade: '8.7 CGPA',
          location: 'India',
          description:
            'Focused on Software Architecture, Database Management Systems, Computer Networks, and Cybersecurity.',
          achievements: ['Hackathon Finalist', 'Coding Club Technical Lead'],
          displayOrder: 1,
        },
      ]),
      Achievement.insertMany([
        {
          title: 'National Cyber & Full-Stack Hackathon Finalist',
          description:
            'Ranked in the top 5 out of 180+ teams for building a zero-trust API gateway and monitoring console in 36 hours.',
          image:
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
          date: new Date('2025-09-15'),
          organization: 'TechSprint National Hackathon',
          category: 'Hackathon',
          isFeatured: true,
          displayOrder: 1,
        },
      ]),
      Certificate.insertMany([
        {
          title: 'Full-Stack Web Engineering & Cloud Architecture',
          issuingOrganization: 'Coursera / Meta',
          issueDate: new Date('2025-04-10'),
          credentialId: 'FSWE-2025-9821',
          verificationUrl: 'https://coursera.org',
          fileUrl:
            'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=1000&q=80',
          fileType: 'image',
          category: 'Full-Stack',
          description: 'Comprehensive specialization covering React, Node.js, REST security, and MongoDB.',
          isFeatured: true,
          displayOrder: 1,
        },
      ]),
      Gallery.insertMany([
        {
          title: 'Hackathon Sprint Night',
          caption: 'Building architecture diagrams during finals',
          description: 'Late-night backend & security hardening session with the team.',
          imageUrl:
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
          category: 'Coding & Work',
          altText: 'Laptop showing code during hackathon sprint',
          isFeatured: true,
          displayOrder: 1,
          status: 'published',
        },
        {
          title: 'Developer Summit Keynote',
          caption: 'Attending cloud security & modern web engineering talks',
          description: 'Sharing notes on OWASP API security and serverless scaling.',
          imageUrl:
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
          category: 'Events',
          altText: 'Tech conference stage and audience',
          displayOrder: 2,
          status: 'published',
        },
      ]),
      Service.insertMany([
        {
          title: 'Full-Stack Web Applications',
          shortDescription:
            'End-to-end MERN applications engineered for speed, maintainability, and clean architecture.',
          icon: 'Layers',
          features: ['React + Vite SPA', 'REST APIs & MongoDB', 'Role-based Admin CMS'],
          deliveryTime: '2–4 weeks',
          isFeatured: true,
          displayOrder: 1,
        },
        {
          title: 'Security Audits & API Hardening',
          shortDescription:
            'Comprehensive review of authentication, authorization, CORS, rate limits, and input validation.',
          icon: 'ShieldCheck',
          features: ['JWT & HTTP-only Cookies', 'OWASP Top 10 Mitigation', 'Zod Schema Validation'],
          deliveryTime: '1 week',
          isFeatured: true,
          displayOrder: 2,
        },
        {
          title: 'UI/UX & Frontend Systems',
          shortDescription:
            'High-craft dark/light interfaces with Tailwind CSS, Framer Motion, and accessible components.',
          icon: 'Sparkles',
          features: ['Responsive Design Systems', 'Motion Choreography', 'Performance Tuning'],
          deliveryTime: '1–2 weeks',
          displayOrder: 3,
        },
      ]),
      Testimonial.insertMany([
        {
          name: 'Aarav Mehta',
          role: 'Senior Engineering Lead',
          company: 'CloudScale Labs',
          feedback:
            'Gurpreet brings rare clarity across both UI craftsmanship and backend security. His ability to turn complex requirements into clean, production-ready code stands out immediately.',
          rating: 5,
          isFeatured: true,
          displayOrder: 1,
        },
      ]),
      Blog.insertMany([
        {
          title: 'Hardening Express & MongoDB APIs with HTTP-Only Cookies and Zod',
          slug: 'hardening-express-mongodb-apis-http-only-cookies-zod',
          excerpt:
            'A practical guide to securing MERN applications against XSS token theft, injection payloads, and brute-force attacks.',
          content: `## Why HTTP-Only Cookies Beat localStorage\n\nStoring JWTs in \`localStorage\` leaves session tokens exposed to any third-party script or XSS vulnerability. By issuing signed JWTs inside \`httpOnly\`, \`Secure\`, \`SameSite\` cookies, browser scripts cannot read the token directly.\n\n### Defense-in-Depth Checklist\n\n1. **Strict Input Validation**: Validate every request body with Zod schemas before touching Mongoose.\n2. **Rate Limiting**: Protect authentication and contact endpoints with sliding-window limiters.\n3. **Helmet & CORS**: Enforce explicit origin allowlists and modern security headers.\n4. **Cloudinary Server-Side Signing**: Validate file MIME types and byte limits in memory before streaming to object storage.`,
          coverImage:
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
          category: 'Security',
          tags: ['Node.js', 'Security', 'JWT', 'MongoDB'],
          readTimeMinutes: 5,
          publishedAt: new Date(),
          status: 'published',
          isFeatured: true,
        },
      ]),
      Analytics.insertMany(
        Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return {
            dateKey: d.toISOString().slice(0, 10),
            pageViews: 45 + i * 14,
            uniqueVisitors: 22 + i * 7,
            visitorHashes: [],
          };
        })
      ),
    ]);
    console.log('Seeded initial portfolio content.');
  }
};

// Allow running `npm run seed` directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  connectDB()
    .then(() => ensureInitialSetup())
    .then(() => {
      console.log('Seed complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}
