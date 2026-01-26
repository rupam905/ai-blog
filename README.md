# AI Blog

AI Blog is a modern, AI-powered blogging platform that helps writers create and publish high-quality posts quickly. It combines a responsive React frontend with an Express + Node backend and MongoDB for persistence, and integrates Google Gemini for content generation and ImageKit for image uploading and optimization.

---

## Features

- AI-assisted content generation (Google Gemini)
- Image upload and transformation using ImageKit
- Rich text editor with draft, preview, and publish workflows
- CRUD for posts, categories, and tags
- Responsive UI with client-side routing and server-backed REST API
- Secure token-based authentication (JWT)
- File and media management with optimized delivery

---

## Tech Stack

- Frontend: React (hooks, context) — Vite or Create React App
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- AI: Google Gemini API
- Images: ImageKit
- Dev tools: npm, nodemon, ESLint, Prettier

---

## Architecture Overview

This repository follows a two-tier architecture:

- Client (React SPA): handles UI, routing, local state, and public client-side integrations (e.g., ImageKit uploads).
- Server (Express): handles authentication, authorization, database access, business logic, and proxies requests to third-party services (Gemini, ImageKit private operations).

The client communicates with the server over a RESTful API. The server stores application data in MongoDB and uses environment variables for secrets and API keys.

---

## Quick Start (Local Development)

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key
- ImageKit account (public & private keys)

### Install & Run

If the project uses `client` and `server` folders:

```bash
# Server
cd server
npm install
npm run dev   # or `npm start` depending on scripts

# Client
cd ../client
npm install
npm run dev   # or `npm start` for CRA
```

Adjust commands if your repository structure or scripts differ.

---

## Gemini (AI) Integration

- The server is responsible for interacting with the Google Gemini API to generate, expand, or rewrite content.
- Keep the Gemini API key on the server side. The client should send prompts or generation requests to authenticated endpoints on your server which then forwards them to Gemini.
- Implement rate limiting and error handling around AI calls to avoid excessive cost and to provide a smooth user experience.

Best practices:
- Batch or throttle requests when possible.
- Record usage metrics and monitor quota/limits.
- Sanitize and validate prompts when necessary.

---

## ImageKit Integration

- Use ImageKit for direct uploads and on-the-fly image transformations.
- For client-side direct uploads, you can use the ImageKit public key and upload endpoints.
- For secured server-side operations (signed URLs, private key actions), keep the private key on the server and expose only necessary endpoints to the client.

Tips:
- Store file references (URLs / fileIds) in MongoDB, not binary blobs.
- Use ImageKit transformation parameters to serve appropriately sized images per viewport.

---

## Authentication & Authorization

- Typical flow: user registers / logs in → server returns JWT → client stores token (in memory or secure cookie) → token used for subsequent API calls.
- Implement role checks server-side (e.g., author, admin) for content creation, moderation, and management endpoints.
- Protect sensitive endpoints with authentication middleware.

---

## Deployment

Options:
- Deploy client separately (Vercel / Netlify) and server on Heroku / Render / AWS / GCP / DigitalOcean.
- Or build the React app and serve stable static files from the Express server.

Considerations:
- Use environment variables in hosting platform for secrets.
- Enable HTTPS and set secure cookie flags.
- Configure CORS to allow client origin only.
- Set up automatic backups for MongoDB (Atlas provides this).

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch (git checkout -b feat/your-feature)
3. Add tests where applicable
4. Open a PR with a clear summary and testing notes

Please follow coding style (Prettier / ESLint) and write descriptive commit messages.

---

## Troubleshooting & Tips

- If AI generation fails, check Gemini API quotas and network errors.
- If image uploads fail, verify ImageKit keys and CORS settings.
- For DB connection issues, validate your MongoDB URI and IP/network access rules.
