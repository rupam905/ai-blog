# AI Blog

AI Blog is an AI-powered blogging platform that helps writers create, edit, and publish high-quality content with the assistance of generative AI and image services. It combines a modern React frontend with an Express + Node backend and MongoDB for persistence, using Google Gemini API for content generation and ImageKit for image uploads and optimization.

## Key Features
- AI-assisted content generation and editing (Gemini API)
- Image upload and optimization (ImageKit)
- User authentication and role-based access for authors and admins
- Rich text editor for composing posts
- CRUD operations for posts, categories, and tags
- Responsive React frontend and RESTful Express API

## Tech Stack
- Frontend: React (hooks, context)
- Backend: Node.js, Express
- Database: MongoDB (mongoose)
- AI: Google Gemini API
- Images: ImageKit
- Dev tooling: npm / yarn, nodemon (backend), Vite or Create React App (frontend)

## Architecture Overview
The project follows a two-tier architecture: a React single-page application (client) that communicates with an Express REST API (server). The server handles business logic, database access, authentication, and integrations with third-party APIs (Gemini and ImageKit).

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or Atlas)
- Google Gemini API key
- ImageKit account and credentials

### Environment Variables
Create a `.env` file in the server root with the following variables (example names):

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/ai-blog?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/
```

> Keep your API keys and secrets out of version control. Use a secrets manager for production deployments.

### Install and Run (example)
From the project root, if the repository is split into `client` and `server` folders: 

```bash
# Server
cd server
npm install
npm run dev

# Client
cd ../client
npm install
npm run dev
```

Adjust commands to match your chosen tooling (e.g., `npm start`, `vite`, or `react-scripts`).

## Usage
- Sign up or login as an author
- Use the editor to draft a post; use AI features to generate or expand content snippets
- Upload images via ImageKit integration for fast, optimized delivery
- Publish posts and manage them from the dashboard

## Gemini & ImageKit Integration Notes
- Gemini (Google) powers the content generation endpoints. The server forwards prompts to the Gemini API and returns generated text to the client. Handle rate limits and retries as required.
- ImageKit is used for uploading and transforming images. Keep public keys only on the client for uploads; use private keys on the server for secured operations if necessary.

## Deployment
- Build the frontend and serve the static files from the Express server or deploy frontend and backend separately (e.g., Vercel/Netlify for client, Heroku/Render/AWS/GCP for server).
- Use environment variables in your hosting platform to store secrets.

## Contributing
Contributions are welcome. Typical workflow: fork the repo, create a feature branch, open a pull request with a clear description of changes and testing notes. Add tests where possible.

## Security
- Do not commit `.env` or credentials to the repository.
- Validate and sanitize user input to the API.
- Rate-limit endpoints that call external APIs to avoid unexpected bills.

## License
Specify your license here (e.g., MIT).

## Acknowledgements
- Built with React, Node, Express, MongoDB, Google Gemini, and ImageKit.

## Contact
For questions or help, contact the maintainers at the repository or open an issue.
