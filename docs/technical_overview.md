# ApnaCloud Technical Overview

This document provides a technical breakdown of the ApnaCloud NAS project, designed for use with AI coding assistants (like ChatGPT/Claude).

## 📊 Overview
ApnaCloud is a self-hosted NAS (Network Attached Storage) management system optimized for Raspberry Pi. it features a premium React frontend and a robust Node.js backend.

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion (animations), Lucide React (icons).
- **Backend**: Node.js, Express, SQLite (via `better-sqlite3`), JWT (auth).
- **Monitoring**: `systeminformation` (hardware stats), `check-disk-space`.
- **Deployment**: PM2 (process management).

## 🚀 Key Features
1. **Real-time Hardware Monitoring**: 
   - CPU Load, RAM Usage, and CPU Temperature tracking.
   - Live updates every 5 seconds on the Dashboard.
2. **File Management**:
   - Secure uploading/downloading of files.
   - Grid/List view toggle.
   - File deletion and preview system.
3. **Advanced UI/UX**:
   - "Ultra-Premium" design with glassmorphism and dark mode support.
   - Responsive layout for mobile/desktop.
4. **Security**:
   - JWT-based authentication.
   - Admin-only activity logging.

## 📁 Project Structure
- `/frontend`: React application (Vite-based).
  - `/src/pages`: Dashboard, FileManager, Login.
  - `/src/services/api.js`: Centralized API calls using Axios.
- `/backend`: Express server.
  - `server.js`: Main entry point.
  - `/routes/system.js`: Hardware stats and activity logs.
  - `/routes/files.js`: File upload/download logic.
  - `config/db.js`: SQLite database configuration.

## 🔌 API Endpoints (Backend)
- `GET /api/system/stats`: Returns JSON with CPU, Memory, Storage, and Temp info.
- `GET /api/system/activity`: Returns last 10 system actions (Admin).
- `GET /files`: Lists all owner-specific files.
- `POST /upload`: Handles file transmissions.
- `DELETE /delete/:name`: Removes files from node storage.

## 💡 Note for AI Assistants
The project is configured for a Raspberry Pi node at `10.150.250.115` but uses `localhost` for local development. File storage defaults to `/home/sakshi/apnacloud-storage`.
