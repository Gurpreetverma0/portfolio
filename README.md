# Dynamic Personal Portfolio & Admin CMS

A full-stack, security-hardened personal portfolio website with a complete Admin Dashboard (CMS). Every public section—Hero, About, Skills, Projects, Experience, Education, Achievements, Certifications, Professional Gallery, Services, Testimonials, Blog, Resume, Contact, and Website Settings—fetches its data live from MongoDB via Express REST APIs.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Recharts, Zod, React Hot Toast, Axios
- **Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT + HTTP-Only Cookies, bcryptjs, Multer, Cloudinary, Zod, Helmet, CORS, Express Rate Limit, Compression, Nodemailer

---

## Project Structure

```
.
├── client/                  # React + Vite frontend
│   └── src/
│       ├── admin/           # Protected Admin Dashboard & CRUD managers
│       ├── components/      # Public portfolio sections & reusable UI
│       ├── context/         # AuthContext, PortfolioContext, ThemeContext
│       ├── pages/           # HomePage, ProjectDetailPage, BlogDetailPage
│       ├── services/        # Axios API client & endpoint wrappers
│       └── utils/           # Formatters & icon resolvers
├── server/                  # Express + Mongoose backend
│   ├── config/              # Env loader, MongoDB connection, Cloudinary helper
│   ├── controllers/         # Auth, CRUD factory, Profile, Settings, Upload, Analytics
│   ├── middleware/          # JWT cookie auth, Zod validation, Multer, rate limits
│   ├── models/              # 16 Mongoose schemas
│   ├── routes/              # /api/auth, /api/admin, /api (public)
│   ├── services/            # Optional SMTP email notifications
│   ├── utils/               # Seed script, slugify, activity logger
│   └── validators/          # Zod schemas for all modules
└── render.yaml              # Render Blueprint (Backend Web Service + Frontend Static Site)
```

---

## Local Development Setup

### 1. Install Dependencies

```bash
npm --prefix server install
npm --prefix client install
```

### 2. Configure Environment Variables

Copy the example files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env`:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Strong random string (32+ chars)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`: Initial seeded admin credentials
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: From your Cloudinary Dashboard

> **Security Note:** Never commit `.env` files to Git. `.gitignore` excludes all `.env` files.

### 3. Seed Initial Admin & Sample Portfolio Data

```bash
npm --prefix server run seed
```

### 4. Run Development Servers

Open two terminals:

```bash
# Terminal 1: Backend API (http://localhost:5000)
npm --prefix server run dev

# Terminal 2: Frontend Vite Dev Server (http://localhost:5173)
npm --prefix client run dev
```

Vite automatically proxies `/api/*` requests to `http://localhost:5000`.

### 5. Production Build Check

```bash
npm --prefix client run build
```

---

## API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate admin & set HTTP-only JWT cookie
- `POST /api/auth/logout` — Clear session cookie
- `GET /api/auth/me` — Get current authenticated admin
- `PUT /api/auth/password` — Change admin password

### Public Portfolio (`/api`)
- `GET /api/portfolio/bootstrap` — Aggregated published portfolio data + profile + settings
- `GET /api/projects` & `GET /api/projects/:idOrSlug`
- `GET /api/blogs` & `GET /api/blogs/:idOrSlug`
- `GET /api/achievements`, `/api/certificates`, `/api/gallery`, `/api/skills`, `/api/experience`, `/api/education`, `/api/services`, `/api/testimonials`
- `GET /api/profile`, `GET /api/settings`
- `POST /api/contact` — Submit contact message (rate-limited + Zod validated)
- `POST /api/analytics/track` — Privacy-friendly page view tracking
- `GET /sitemap.xml` & `GET /robots.txt`

### Protected Admin CMS (`/api/admin/*`)
Requires valid HTTP-only `portfolio_admin_token` cookie:
- `GET /api/admin/dashboard` — Counts, visitor charts, breakdown, recent messages & activity
- `GET/POST/PUT/DELETE /api/admin/:module` for `projects`, `achievements`, `certificates`, `gallery`, `skills`, `experience`, `education`, `services`, `testimonials`, `blogs`
- `PATCH /api/admin/:module/:id/status` — Publish / unpublish toggle
- `PATCH /api/admin/:module/:id/featured` — Featured toggle
- `PUT /api/admin/:module/reorder` — Persist custom display order
- `PUT /api/admin/profile` & `PUT /api/admin/settings`
- `GET /api/admin/export` — Download full JSON portfolio backup
- `GET/PATCH/DELETE /api/admin/messages`
- `GET /api/admin/upload/status`, `POST /api/admin/upload/single`, `POST /api/admin/upload/multiple`, `POST /api/admin/upload/delete`

---

## Deploying Backend & Frontend on Render

### Step 1: Push Repository to GitHub
Make sure `.env` is NOT tracked (`git status` should never show `server/.env`), then push to `https://github.com/Gurpreetverma0/portfolio.git`.

### Step 2: Deploy Backend (Render Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com) → **New +** → **Web Service**.
2. Connect your GitHub repo `Gurpreetverma0/portfolio`.
3. Configure:
   - **Name:** `portfolio-api`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
4. Add **Environment Variables** in Render:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = strong random 64-char secret
   - `JWT_EXPIRES_IN` = `7d`
   - `ADMIN_EMAIL` = your admin email
   - `ADMIN_PASSWORD` = strong password
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `CLIENT_URL` = *(set after Step 3 once you have your Frontend URL, e.g. `https://gurpreet-portfolio.onrender.com`)*
5. Click **Create Web Service** and copy your backend URL (e.g. `https://portfolio-api-xxxx.onrender.com`).

> **MongoDB Atlas Network Access:** In MongoDB Atlas → **Network Access**, allow `0.0.0.0/0` so Render servers can connect.

### Step 3: Deploy Frontend (Render Static Site)
1. In Render Dashboard → **New +** → **Static Site**.
2. Connect the same GitHub repo.
3. Configure:
   - **Name:** `portfolio-web`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add **Environment Variable**:
   - `VITE_API_URL` = `https://portfolio-api-xxxx.onrender.com` *(your backend URL from Step 2, without trailing slash)*
5. Under **Redirects/Rewrites**, add a Rewrite rule for React Router SPA routes:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`
6. Click **Create Static Site** and copy your frontend URL (e.g. `https://portfolio-web.onrender.com`).

### Step 4: Link CORS & Cookies
1. Go back to your Render Backend service → **Environment** → set `CLIENT_URL` = `https://portfolio-web.onrender.com` (exact origin, no trailing slash).
2. Save changes (Render restarts the backend automatically).
3. Because `NODE_ENV=production`, Express sets `trust proxy: 1` and issues `SameSite=None; Secure; HttpOnly` cookies so Admin Login works seamlessly across the Render frontend and backend URLs.

> **Alternative:** You can also deploy both services in one click using the included `render.yaml` via **New + → Blueprint** in Render.
