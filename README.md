# 🚀 AdditiveCurriculum — Smarter Dashboards. Seamless Automation.

**Welcome to AdditiveCurriculum!**
An interactive, automation‑powered curriculum management & visualization system designed to help you build dashboards, transform data, and integrate Power BI with ease.

Whether you're creating real‑time dashboards, converting Excel into dynamic JSON, or generating presentations automatically — this project is built to feel effortless, clean, and technically powerful.

---

## Table of Contents

* [Features](#features)
* [Tech stack](#tech-stack)
* [Repository structure](#repository-structure)
* [Prerequisites](#prerequisites)
* [Quick start](#quick-start)
* [Power BI integration](#power-bi-integration)
* [Scripts & utilities](#scripts--utilities)
* [Development notes](#development-notes)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## ✨ Features

* Next.js + React dashboard UI
* Live / embedded Power BI reports integration options
* Utilities for converting Excel files to JSON
* PPT generation utilities (PowerPoint slides from paper/report)
* Helpful dev scripts for linting, building and local testing

## 🧰 Tech Stack

* Node.js (>= 16.x)
* Next.js (React)
* TypeScript (if present) / JavaScript
* Power BI embedded reports (iframe / Power BI JS SDK)
* Optional: Python scripts for data transforms (if present)

## 📁 Repository Structure (suggested / typical)

```
AdditiveCurriculum/
├─ src/                 # Next.js app source (components, pages, app)
│  ├─ app/
│  └─ components/
├─ scripts/             # Excel-to-JSON, PPT generation, helpers
├─ public/              # static assets
├─ .env.local           # local environment variables (not committed)
├─ package.json
└─ README.md            # <- you are here
```

> If your project uses `src/app/dashboard/page.tsx` (Next.js app router), the dashboard pages and Power BI embeds live under `src/app/dashboard`.

## ⚙️ Prerequisites

* Node.js and npm (or yarn) installed
* Optional: Python 3.x if repo includes Python utilities
* Power BI Pro / Embedded access if you plan to integrate protected reports

## 🚀 Quick Start (development)

1. Clone the repo

```bash
git clone https://github.com/yyyuvvvraj/AdditiveCurriculum.git
cd AdditiveCurriculum
```

2. Install dependencies

```bash
npm install
# or
# yarn install
```

3. Create local environment file

```bash
cp .env.example .env.local
# open .env.local and fill values (API keys, Power BI embed tokens, etc.)
```

4. Run dev server

```bash
npm run dev
# or
# yarn dev
```

5. Open `http://localhost:3000` in your browser.

## Common npm scripts (example)

* `npm run dev` - start development server
* `npm run build` - build for production
* `npm run start` - start production server after build
* `npm run lint` - run linter
* `npm run format` - format code

If these scripts are missing in `package.json`, add or adapt as needed.

## 📊 Power BI Integration

There are a few common patterns to integrate Power BI into a web app. Choose the one that fits your hosting and licensing:

### 1) Publish to web (public)

* Quickest option: use Power BI's "Publish to web" and embed the iframe. **Not recommended** for sensitive data.

### 2) Power BI Embedded / Secure embed (recommended for private data)

* Use an embed token obtained from a backend service (using the Power BI REST API or Azure AD).
* Backend generates short-lived tokens and the client uses `powerbi-client` to render.
* Typical flow:

  1. User requests page → client asks backend for embed token
  2. Backend calls Power BI REST (with service principal or master user) and returns token
  3. Client uses `powerbi-client` to embed the report with the token

For local development you can temporarily use an exported report or a publicly published report.

> NOTE: In your repo there's a comment `No option publish to web` — if you cannot publish publicly, implement the secure/embed flow above and host the backend on EC2 (or any server) to mint tokens.

## 🛠️ Scripts & Utilities

### Excel → JSON converter

If the repo contains a utility (e.g. `scripts/excel-to-json.js` or a Python script), run it like:

```bash
# Node.js example
node scripts/excel-to-json.js --input data/sheet.xlsx --output data/sheet.json

# Python example
python scripts/excel_to_json.py data/sheet.xlsx data/sheet.json
```

### PPT generator

If you have a PowerPoint generator script, usage is typically:

```bash
node scripts/generate-ppt.js --input report.json --output presentation.pptx
```

Adapt commands to the actual filenames in your repo.

## 🧪 Development Notes & troubleshooting

* Hydration mismatch in Next.js: if you see errors such as `Hydration failed because the server rendered text didn't match the client`, check for `Date.now()`, `Math.random()` or `window` usage in server-rendered components. Move such logic to client components or use `useEffect`.
* Environment variables: keep secrets out of git. Use `.env.local` and add `.env.local` to `.gitignore`.
* For Vercel / EC2 deployment differences: Vercel is optimized for Next.js; on EC2 you'll need to run the Node server (`npm run build` + `npm run start`) behind a reverse proxy (nginx).

## 🚢 Deployment

### Vercel (easy for Next.js)

* Connect your GitHub repository to Vercel and deploy. Supply environment variables in Vercel dashboard.

### EC2 (manual)

* Build: `npm run build`
* Start: `npm run start` (use a process manager like `pm2`)
* Configure nginx to reverse-proxy port 3000 to 80/443
* Handle SSL using Certbot (Let's Encrypt)

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes and push
4. Open a PR describing what you changed and why

Please open issues for bugs or feature requests.


```
MIT License

Copyright (c) 2025 Yuvraj Rajni Sachin Deshmukh

Permission is hereby granted...
```

