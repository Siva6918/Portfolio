# Portfolio Audit

## Existing State
- **Frontend**: Vite + React, TailwindCSS, Framer Motion, Lucide React, React Router.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Cloudinary for uploads.
- **Routing**: Multi-page routing is already partially set up in `App.jsx` (Home, About, Projects, Experience, Skills, Certifications, Achievements, Blog, Contact, Resume, Admin).
- **Authentication**: JWT-based or custom password-based admin auth.
- **Content**: Most data is fetched from the backend (Profile, Projects, Skills, Education, Experience, Certifications, Achievements, Resume).

## What is Broken / Suboptimal
- Free-tier backend sleep issue (Render spinning down after 15 minutes of inactivity).
- The public site waits for the backend to load data, causing slow Initial Load/Blank screens when waking up.
- Blog/Articles are currently hard-coded placeholder arrays on the frontend because there's no `Notes`/`Posts` endpoint.
- Redundant components and animations that don't fit a unified design system.
- Some content might still be hardcoded or missing proper fallback handling.
- Admin UI might not match the public site's aesthetic.

## What Will Be Kept
- Auth mechanism for Admin.
- Cloudinary upload integration.
- Database connection strings and Mongoose models (though some schema updates may be needed).
- AdSense verification code (`index.html`).
- Vercel/Render deployment configs.

## Action Plan for Rebuild
1. Establish a strict design system (Dark editorial).
2. Implement caching (localStorage + stale-while-revalidate) in frontend API layer.
3. Add a `/api/health` endpoint for wake-up pings.
4. Add a `Note` model for the Blog section.
5. Apply the new design system strictly to public site and admin.
