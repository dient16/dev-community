# Dev Community

A full-stack social platform for developers — write posts in Markdown, follow tags, discuss in threaded comments, and get real-time notifications. Inspired by [dev.to](https://dev.to), built with the MERN stack.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Seeding Sample Data](#seeding-sample-data)
- [API Reference](#api-reference)
- [Deployment Notes](#deployment-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Features

| Area | What you can do |
| --- | --- |
| **Authentication** | Register, log in, log out, refresh tokens (JWT + bcrypt) |
| **Posts** | Create, edit, delete posts with a full Markdown editor and image upload |
| **Feeds** | Browse by **For you** (followed tags), **Top** (most liked), or **Latest** |
| **Tags** | Follow/unfollow tags; each tag has its own colour theme and detail page |
| **Interactions** | Like posts, bookmark to a personal Reading list |
| **Comments** | Threaded comments with replies |
| **Social graph** | Follow/unfollow other users, view public profiles |
| **Profile** | Edit bio, avatar, skills, work, location and links |
| **Notifications** | Real-time push over Socket.IO for likes, comments and new followers |
| **Search** | Search posts from the header, with a quick-result modal |

---

## Tech Stack

**Frontend**

- React 18 + Vite
- React Router v6
- TanStack Query (server state & caching)
- Ant Design, SCSS (BEM naming)
- `@uiw/react-md-editor` for the Markdown editor
- Socket.IO client, Axios, React Hook Form

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT access/refresh tokens, bcrypt password hashing
- Cloudinary + Multer for image uploads
- Socket.IO for real-time notifications
- Swagger (`swagger-autogen`) for API docs

---

## Project Structure

```
dev-community/
├── Backend/
│   ├── scripts/            # Data seeding utilities (see below)
│   └── src/
│       ├── config/         # DB & Cloudinary configuration
│       ├── controllers/    # Route handlers
│       ├── middlewares/    # Auth, validation, uploads, error handling
│       ├── models/         # Mongoose schemas
│       ├── routes/         # Express routers, mounted under /api
│       ├── socket/         # Socket.IO event handlers
│       └── index.js        # App entry point
└── Frontend/
    └── src/
        ├── apiServices/    # Axios instance + API calls
        ├── components/     # Reusable UI components
        ├── hooks/          # Custom hooks (useAuth, useWindowSize, …)
        ├── pages/          # Route-level pages (public / user)
        ├── routers/        # Route definitions
        ├── styles/         # SCSS variables, breakpoints, mixins
        └── utils/          # Constants, icons, helpers
```

---

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)
- A Cloudinary account (for image uploads)

Clone the repository:

```bash
git clone https://github.com/dient16/dev-community.git
cd dev-community
```

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file (copy from `.env.example`):

| Variable | Description |
| --- | --- |
| `SERVER_PORT` | Port the API listens on (default `6006`) |
| `SERVER_URI` | Public URL of the API, e.g. `http://localhost:6006` |
| `CLIENT_URI` | Frontend origin — **must match exactly**, it is the CORS allow-list |
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `JWT_ACCESS_KEY` | Secret for signing access tokens |
| `JWT_REFRESH_KEY` | Secret for signing refresh tokens |

Start the server:

```bash
npm run dev     # nodemon, auto-reload
npm start       # production
```

The API is available at `http://localhost:6006/api`.

### Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file:

```env
VITE_SERVER_URL=http://localhost:6006
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:9000`.

> **Important:** the dev server port must match `CLIENT_URI` in the backend `.env`. The API sends credentialed requests, so a mismatched origin is rejected by CORS and every request will fail silently.

---

## Seeding Sample Data

`Backend/scripts/` contains utilities to fill an empty database with realistic content pulled from the public dev.to API. Author names, usernames, avatars and bios are **generated locally** — no personal data from dev.to is stored.

```bash
cd Backend

# Add 30 new posts (default)
node scripts/seed-devto.js

# Add 100 new posts
node scripts/seed-devto.js 100
```

The argument is the number of **new** posts to add. Articles already in the database (matched by slug) are skipped and do not count toward the target, so the script is safe to run repeatedly.

Every seeded post gets a cover image, Markdown body, up to 4 tags, an author, and its original publish date. Seed accounts use the email pattern `<username>@devcommunity.local` with the password `Devto@123`.

| Script | Purpose |
| --- | --- |
| `seed-devto.js` | Import posts, tags and authors |
| `fake-identity.js` | Deterministic generator for names, usernames, avatars and bios |
| `fix-seed-users.js` | One-off migration to re-generate identities for already-seeded users |

---

## API Reference

Interactive Swagger docs are served by the backend at:

```
http://localhost:6006/api-docs
```

Regenerate the spec after changing routes:

```bash
cd Backend
npm run swagger
```

Base routes:

| Prefix | Resource |
| --- | --- |
| `/api/auth` | Register, login, logout, refresh token |
| `/api/user` | Current user, public profiles, edit profile, follow/unfollow |
| `/api/post` | Posts CRUD, likes, bookmarks, image upload, search, feeds |
| `/api/comment` | Comments and replies |
| `/api/tag` | All tags, popular tags, followed tags, follow/unfollow |

---

## Deployment Notes

- **CORS**: set `CLIENT_URI` to the deployed frontend URL. It must be an exact origin match, with no trailing slash.
- **MongoDB Atlas**: add the hosting provider's outbound IPs to *Network Access*. Platforms with dynamic IPs (e.g. Render's free tier) generally require `0.0.0.0/0`.
- **Database connection**: `src/config/db.config.js` retries every 5 seconds instead of crashing the process, so a temporary outage will not put the service into a restart loop.
- **Frontend build**: `npm run build` outputs to `Frontend/dist`. `vercel.json` is included for SPA routing on Vercel.

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

Run `npm run lint` in `Frontend/` before submitting.

---

## License

ISC — see the `license` field in `package.json`.

## Contact

Issues and feature requests: [github.com/dient16/dev-community/issues](https://github.com/dient16/dev-community/issues)
