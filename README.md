## VaultX 🔐
VaultX 🔐 is a web-based gallery platform for managing and sharing event photos and videos (Wedding, Pre‑Wedding, Birthday, Mehandi, Sagai, etc.).
Admins can securely upload media, while users can browse, like, and download content with a smooth, responsive experience.

## Core Features
- **Role-based access**
  - **Admin**: can upload images/videos and manage content.
  - **User**: can view, like, and download media.

- **Secure authentication**
  - Email/password login and registration.
  - JWT-based auth with roles (`admin`, `user`), checked on the backend.

- **Media upload & storage**
  - Upload images or videos to **Cloudinary** via a secure signed upload flow.
  - Each upload stores URLs, category, type, timestamps, and (optionally) uploader user.

- **Category-based browsing**
  - Media items are tagged with categories (e.g. `wedding`, `birthday`, `engagement`, etc.).
  - Home screen gallery displays all media grouped by category.

- **Optimized viewing**
  - Videos use HTML5 `<video>` player with `preload="metadata"` for faster load.
  - Images support responsive sizes and lazy loading for better performance.

- **Protected downloads**
  - Logged-in users see a **Download** button on media cards to download the original file.
  - Non-logged-in visitors can only preview images/videos (no download controls).

## New Social & UX Features
- **Likes (per user, per media)**
  - Logged-in users can click a **heart button** on each media card to like/unlike.
  - Like count is stored in MongoDB (`likesCount`) and updated in real time.
  - Backend ensures one like per user and supports **unlike** by toggling:
    - `POST /api/upload/:id/like` → returns `{ liked, likesCount }`.
  - After refresh, the API returns `isLikedByCurrentUser` so the heart state is preserved.

- **Favorite media (per user) – backend ready**
  - `User` schema includes a `favorites: ObjectId[]` field referencing uploads.
  - Endpoints:
    - `POST /api/upload/:id/favorite` → toggle favorite for current user.
    - `GET /api/upload/me/favorites` → list of the user’s favorite media.
  - Frontend can use these APIs to build a “My Favorites” page.

- **Comments – backend ready**
  - `Comment` model stores `{ media, user, text, createdAt }`.
  - Endpoints:
    - `POST /api/upload/:id/comments` → add a comment (auth required).
    - `GET /api/upload/:id/comments` → fetch comments for a media item.
  - Designed for showing threaded comments under media or in a detail modal.

## Gallery & Filtering
- **Paginated gallery API**
  - `GET /api/upload?category=&type=&page=&limit=&sort=`
  - Supports filters:
    - **category**: `wedding`, `birthday`, etc. or `all`.
    - **type**: `image`, `video`, or `all`.
    - **sort**: `newest` (by created date) or `popular` (by likes).
  - Response includes both **data** and **pagination** (page, total, totalPages).

- **Frontend gallery**
  - `Home` uses `MediaGallery` with a grid of `ImageCard` components.
  - Each card shows:
    - Thumbnail or video preview.
    - Category label.
    - **View Large** overlay for full-screen preview.
    - **Heart button** with like count (auth only).
    - **Download button** (auth only).

## Performance Improvements
- **Low-quality preview support (backend-ready)**
  - Backend and upload flow are structured so Cloudinary-derived low‑quality URLs can be stored alongside the main URL (for LQIP-style loading).

- **Lazy loading & batching**
  - Images are loaded lazily using the `loading="lazy"` attribute.
  - Gallery supports pagination on the backend so you can add “Load more” or infinite scroll easily.

## Analytics & Views (backend-ready)
- **View tracking**
  - `viewsCount` on each upload, with `POST /api/upload/:id/view` incrementing views.
  - Intended to be called when a user opens the full-screen View Large modal.

- **Admin analytics endpoint**
  - `GET /api/upload/admin/analytics` (admin only):
    - Aggregated stats by category: total uploads, total likes, total views.
    - Top-most liked media items.

## Tech Stack
- **Frontend**: React, React Router, Tailwind CSS, lucide-react icons.
- **Backend**: Node.js, Express.
- **Database**: MongoDB with Mongoose models (`User`, `Upload`, `Comment`, `Album`).
- **Storage**: Cloudinary for image/video hosting.
- **Auth**: JWT with role-based middleware.

## How to Run (high level)
- **Server**
  - Configure environment variables for MongoDB, JWT, and Cloudinary.
  - Run: `npm install` then `npm run dev` (or `npm start`) in the `Server` folder.
- **Client**
  - Configure `VITE_REACT_BACKEND_APP_API_URL`, Cloudinary keys.
  - Run: `npm install` then `npm run dev` in the `Client` folder, and open the given URL.
