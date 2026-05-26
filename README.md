# 🧬 GeneTrace — DNA Pattern Search & Mutation Detection

A research-grade, full-stack bioinformatics platform that uses the **Horspool string-matching algorithm** to search DNA sequences, detect mutations, and visualize the algorithm in real time. Built as a Design and Analysis of Algorithms (DAA) showcase.

![Stack](https://img.shields.io/badge/stack-React%2018%20%2B%20Vite%20%2B%20Tailwind%20%2B%20Node%20%2B%20Express%20%2B%20MongoDB-06b6d4)

---

## ✨ Features

- **Horspool string matching** with full step-trace, shift table, and naive-algorithm comparison
- **Live algorithm visualizer** — play / pause / speed-controlled walk-through with right-to-left highlights
- **Mutation detection** with aligned comparison view, position list, and density heatmap
- **Disease-marker library** (BRCA1, TP53, sickle-cell, CFTR, HTT)
- **Analytics dashboard** with daily activity, base composition, top patterns, and algorithm-efficiency radar
- **JWT authentication** with per-user history persistence in MongoDB
- **Futuristic biotech UI** — dark theme, glassmorphism, neon glow, animated DNA helix, particle field
- **Fully responsive** — works on desktop, tablet, and mobile

---

## 📁 Project Structure

```
genetrace/
├── preview.html          ← Standalone single-file demo (open directly in a browser)
├── frontend/             ← React + Vite + Tailwind + Framer Motion
│   ├── src/
│   │   ├── components/   ← Navbar, Footer, ui primitives
│   │   ├── pages/        ← 7 pages
│   │   ├── services/     ← axios API client
│   │   ├── utils/        ← Horspool implementation
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── backend/              ← Express + MongoDB + JWT
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── utils/
    └── server.js
```

---

## 🚀 Quick Start

### 0. Instant preview (no install needed)

Open `preview.html` directly in any modern browser. It's a self-contained single-file build of the entire app using CDN React.

### 1. Backend

```bash
cd backend
cp .env.example .env       # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # http://localhost:5000
```

`.env` keys:

| Key             | Description                                            |
|-----------------|--------------------------------------------------------|
| `PORT`          | API port (default `5000`)                              |
| `MONGO_URI`     | MongoDB Atlas connection string                        |
| `JWT_SECRET`    | Long random string used to sign tokens                 |
| `CLIENT_ORIGIN` | Frontend origin for CORS (default `http://localhost:5173`) |

> Don't have MongoDB yet? Get a free Atlas cluster at <https://www.mongodb.com/atlas>. Pick the M0 free tier, allow your IP, create a database user, and paste the connection string into `MONGO_URI`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # default points at http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

---

## 🔌 API Reference

| Method | Endpoint            | Auth     | Description                                |
|--------|---------------------|----------|--------------------------------------------|
| POST   | `/api/auth/register`| —        | Create an account                          |
| POST   | `/api/auth/login`   | —        | Sign in, returns `{ token, user }`         |
| GET    | `/api/auth/me`      | Required | Current user                               |
| POST   | `/api/search`       | Optional | Run Horspool (and naive when `compare:true`) |
| POST   | `/api/mutation`     | Optional | Detect mutations between two sequences     |
| POST   | `/api/compare`      | —        | Similarity check                           |
| GET    | `/api/history`      | Required | Saved searches & mutations for the user    |
| GET    | `/api/analytics`    | Optional | Aggregated platform statistics             |

Example `POST /api/search` body:

```json
{ "dna": "ATGCGTAGCTAGCTA", "pattern": "TAGC", "compare": true }
```

---

## 🧠 The Horspool Algorithm

Horspool (1980) is a simplified variant of Boyer-Moore that uses only a *bad-character* shift table.

- **Worst case:** `O(n·m)`
- **Average case:** `O(n / m)` — substantially faster than naive `O(n·m)` matching
- **Space:** `O(k)` where `k` is the alphabet size (4 for DNA)

Steps:

1. **Build shift table** from the pattern (every character except the last).
2. **Align right-to-left.** Compare the pattern to the text starting from the rightmost character.
3. **Smart shift.** On mismatch, jump forward by the shift-table value of the text character that caused the mismatch.
4. **Record match** when all `m` characters of the pattern align; continue.

---

## ☁️ Deploying to Vercel

**Frontend** — deploy the `frontend/` directory as a static Vite app. Set the env var `VITE_API_URL` to your deployed API origin (e.g. `https://genetrace-api.onrender.com/api`).

**Backend** — Vercel serverless functions are stateless and short-lived, so a long-running Express + MongoDB API is a better fit for **Render**, **Railway**, or **Fly.io**. Deploy `backend/` there and set the same env vars from `.env.example`. Whitelist the host's IP range in MongoDB Atlas.

---

## 🧪 Tech Stack

**Frontend:** React 18, Vite 5, Tailwind CSS 3, Framer Motion 11, Recharts 2, React Router 6, Axios

**Backend:** Node.js, Express 4, Mongoose 8, JSON Web Tokens, bcryptjs, Helmet, CORS

**Database:** MongoDB Atlas

---

## 📚 Sample Data for Demos

| DNA                                                                | Pattern  | Notes                          |
|--------------------------------------------------------------------|----------|--------------------------------|
| `ATGCGTAGCTAGCTAGCATGCGTAGCAATGCTAGCTAGCTAGCATGCAGCTAGCGTATGCGT`   | `TAGC`   | Two matches, demonstrates skipping |
| `AGCTAGGCAGTCGGCAGTC`                                              | `GGCAG`  | BRCA1-style marker             |
| `CTGAGGTCAGGAGTTCGAGACCAGCCTGGCC`                                  | `AGGT`   | TP53-style region              |
| `GAGCTGCTGCTGCTGCTGCTGGGCGAG`                                      | `CTGCTG` | Huntington CAG-repeat analog   |

---

## 📜 License

MIT — built for the course **Design and Analysis of Algorithms**.
