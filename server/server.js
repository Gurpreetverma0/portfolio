import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { ensureInitialSetup } from './utils/seed.js';
import Project from './models/Project.js';
import Blog from './models/Blog.js';

const app = express();

// Trust reverse proxy (required on Render / Vercel / Nginx for secure cookies & rate limiting)
app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Support comma-separated CLIENT_URLs (e.g. local + production Render URL)
const allowedOrigins = env.clientUrl
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(normalized) ||
        env.nodeEnv === 'development' ||
        normalized.endsWith('.onrender.com') ||
        normalized.endsWith('.netlify.app') ||
        normalized.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Dynamic SEO Sitemap & Robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = allowedOrigins[0] || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${baseUrl}/sitemap.xml\n`
  );
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = allowedOrigins[0] || `${req.protocol}://${req.get('host')}`;
    const [projects, blogs] = await Promise.all([
      Project.find({ status: 'published' }).select('slug updatedAt').lean(),
      Blog.find({ status: 'published' }).select('slug updatedAt').lean(),
    ]);

    const urls = [
      { loc: `${baseUrl}/`, priority: '1.0' },
      ...projects.map((p) => ({
        loc: `${baseUrl}/projects/${p.slug}`,
        lastmod: p.updatedAt?.toISOString(),
        priority: '0.8',
      })),
      ...blogs.map((b) => ({
        loc: `${baseUrl}/blog/${b.slug}`,
        lastmod: b.updatedAt?.toISOString(),
        priority: '0.8',
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.type('application/xml').send(xml);
  } catch (err) {
    res.status(500).type('text/plain').send('Error generating sitemap');
  }
});

// API Routes
app.use('/api', apiRateLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await ensureInitialSetup();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port} (${env.nodeEnv})`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
