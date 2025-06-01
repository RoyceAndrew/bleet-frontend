# Bleet Frontend

🔗 Live Demo: https://bleet-frontend-4bk4.vercel.app  
📂 Repo: https://github.com/RoyceAndrew/bleet-frontend

---

## Table of Contents

- [Overview](#overview)  
- [Tech Stack](#tech-stack)  
- [Features](#features)  

---

## Overview

Bleet Frontend is the React/TypeScript client application for the Bleet (Twitter clone) project. It implements:

- Authentication flows (Google OAuth via Supabase → custom backend JWT)  
- Profile editing  
- Creating, editing, deleting, liking, commenting, reporting, and following/unfollowing posts  
- Real-time “Recent Posts” updates via Server-Sent Events (SSE)  
- Global state management with Zustand  
- Form handling & validation with Formik + Yup  
- Tailwind CSS for styling  
- Axios for HTTP requests  

---

## Tech Stack

- **Framework & Libraries:**  
  - React (TypeScript)  
  - Formik & Yup (form state + validation)  
  - Zustand (state management)  
  - Tailwind CSS (utility-first styling)  
  - Axios (HTTP client)  
  - Server-Sent Events (native browser EventSource)  

- **Build & Tooling:**  
  - Vite (dev server & bundler)  
  - PostCSS + Autoprefixer (via Tailwind)  
  - ESLint + Prettier (linting & formatting)  

---

## Features

1. **Authentication & Authorization**  
   - Google OAuth via Supabase Auth → upon successful sign‐in, backend issues a custom JWT stored as an HttpOnly cookie.  
   - Login & registration forms use Formik + Yup for schema validation.  

2. **User Profile**  
   - Edit profile (display name, bio, website).  
   - Upload profile picture & banner (separate backend endpoints handle storage and URL).  

3. **Posts & Feed**  
   - Create, edit, delete posts (text + optional image).  
   - Like, comment, report posts.  
   - Follow/unfollow other users.  

4. **Real-Time Updates**  
   - SSE connection to `/api/post/sse/recent` shows new posts as they arrive in the navigation bar.  

5. **State Management**  
   - Zustand stores global slices for:  
     - `authStore` (user session, token)  
     - `postStore` (list of posts, actions for like/unlike, comment, report, delete)  
     - `userStore` (current user data, followers/following)  

6. **Forms & Validation**  
   - Formik forms for login, registration, post creation/edit, profile editing.  
   - Yup schemas enforce:  
     - Valid email format  
     - Password strength (min length, uppercase, lowercase, number, special character)  
     - Display name length constraints  

7. **Responsive Design**  
   - Desktop-first layout using Tailwind CSS.  
   - Mobile‐optimized breakpoints for all key pages (login, register, home feed, profile).  

---
