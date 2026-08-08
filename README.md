# 🚀 Venkata Siva Reddy - Full-Stack MERN Personal Portfolio & Public Admin CMS System

A production-grade, full-stack personal portfolio and publicly viewable Admin CMS application built for **Venkata Siva Reddy** (B.Tech Computer Science and Engineering, 2023–2027).

---

## 🌟 Key Highlights & Philosophy

- **Public Viewable Admin Space (`/admin`)**: The `/admin` CMS page is completely viewable by anyone! Visitors can inspect managed fields, database entries, statistics, and UI forms.
- **Password-Protected Mutations**: All mutation operations (**ADD, UPDATE, DELETE, REPLACE, UPLOAD, REORDER**) strictly require entering the `ADMIN_PASSWORD`. Password verification happens exclusively on the backend.
- **Render & Cloud-Ready**: Fully configured with environment variables (`MONGODB_URI`, `ADMIN_PASSWORD`, `JWT_SECRET`, `CLOUDINARY_*`) for direct Render/Vercel deployment.
- **Futuristic Visual Design**: Midnight slate dark mode with sky blue (`#38BDF8`) & purple (`#A855F7`) electric glow, glassmorphism surfaces, and micro-animations. Day/Night theme switcher persisted in `localStorage`.
- **Database Seeding**: Included `npm run seed` script populated with Venkata Siva Reddy's complete academic background, projects, certifications, and achievements.

---

## 🏗 Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Framer Motion, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose ODM), bcryptjs, JWT, Helmet, CORS, express-rate-limit, Multer.
- **Storage**: Cloudinary / Local Multer fallback.

---

## 📁 Project Architecture

```
Portfolio/
├── client/                     # Vite + React Frontend Application
│   ├── public/                 # Static Assets (Avatar.png, Resume PDF)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # PasswordModal, Toast, SkeletonLoader
│   │   │   ├── layout/         # Navbar, Footer, ElectricBackground
│   │   │   └── sections/       # Hero, About, Skills, Projects, Experience, Certifications, etc.
│   │   ├── context/            # ThemeContext, AuthContext
│   │   ├── pages/              # HomePage, ProjectDetailPage, AdminSpacePage, NotFoundPage
│   │   ├── services/           # Axios API Client
│   │   └── styles/             # Tailwind & Glassmorphism CSS
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                     # Node.js + Express REST API Backend
    ├── config/                 # MongoDB (db.js) & Cloudinary (cloudinary.js)
    ├── controllers/            # Portfolio & Admin Controllers
    ├── middleware/             # Auth, Rate Limiter, Multer Upload
    ├── models/                 # Mongoose Schemas (Profile, Skill, Project, Certification, etc.)
    ├── routes/                 # Express API Routes
    ├── seed/                   # Database Seeder (seed.js)
    ├── .env.example            # Environment variables template
    ├── app.js
    └── server.js
```

---

## ⚡ Quick Start & Local Setup

### 1. Backend Setup
```bash
cd server
npm install

# Copy .env.example to .env
cp .env.example .env
```

Set your `.env` variables:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/portfolio
ADMIN_PASSWORD=SivaReddyAdmin2027!
JWT_SECRET=super_secret_jwt_key
PORT=5000
```

### 2. Seed Database
```bash
npm run seed
```

### 3. Start Backend Server
```bash
npm run dev
# Running on http://localhost:5000/api
```

### 4. Frontend Setup
```bash
cd ../client
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 🔒 Security Architecture

1. **Backend Verification**: Passwords are never verified on the frontend. The client sends the password to `POST /api/admin/verify` or in the `X-Admin-Password` header.
2. **Brute-Force Protection**: Password verification endpoints are rate-limited with `express-rate-limit` (10 attempts per 15 minutes).
3. **No Password Exposure**: Plaintext passwords and API secrets are never returned in client bundles, responses, or stored in localStorage.

---

## 🚀 Deployment Instructions

### Deploy Backend to Render:
1. Create a **Web Service** on Render pointing to the `server/` directory.
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Add Environment Variables on Render dashboard:
   - `MONGODB_URI`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Deploy Frontend to Vercel / Netlify:
1. Import `client/` folder.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Add Environment Variable: `VITE_API_URL=https://your-render-backend-url.onrender.com/api`

---

## 👨‍💻 Developed For

**Venkata Siva Reddy**  
B.Tech – Computer Science and Engineering (2023–2027)  
Rajeev Gandhi Memorial College of Engineering and Technology  
CGPA: 8.1
