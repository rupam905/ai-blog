# QuickBlog

QuickBlog is a full-stack blogging platform. Anyone can register, write and publish posts — with optional AI-assisted drafting — follow other authors, like and bookmark posts, and comment. An admin panel handles moderation, publish/unpublish control, and granting verified badges.

---

## Features

- Open publishing — any registered user can write and publish a post instantly, no approval queue
- AI-assisted drafting via Google Gemini
- Likes, bookmarks, and following other authors
- Comments (requires login, auto-approved)
- Verified badges, granted by an admin
- Admin panel — dashboard, manage all blogs/comments/users, publish/unpublish, delete
- Image uploads via ImageKit with on-the-fly optimization

---

## Tech Stack

- **Client**: React 19, React Router, Tailwind CSS, Vite
- **Server**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT (separate admin and user auth flows)
- **AI**: Google Gemini
- **Images**: ImageKit
