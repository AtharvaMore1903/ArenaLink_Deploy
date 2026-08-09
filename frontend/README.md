# ArenaLink - Frontend

ArenaLink is a comprehensive esports tournament and team management platform. This repository contains the modern, responsive web application built with React and Vite.

## 🚀 Technologies Used
- **Vite** for blazing fast builds and hot module replacement (HMR).
- **React.js** for building the interactive user interface.
- **Tailwind CSS** for rapid, utility-first styling.
- **Axios** for making HTTP requests to the ArenaLink backend.
- **React Router** for seamless client-side routing.
- **Lucide React** for beautiful, scalable SVG icons.
- **Framer Motion** for fluid animations and page transitions.

## ✨ Core Features
- **Dynamic Dashboard:** A central hub showing ongoing tournaments, team invitations, and player statistics based on the authenticated role.
- **Role-based Views:** Tailored UI experiences for `Players`, `Organizers`, and `Admins`.
- **My Team Hub:** Manage team rosters, view team-specific match schedules, handle join requests, and browse tournament history.
- **Tournament Browser:** Explore upcoming tournaments, view prize pools and deadlines, and register your team seamlessly.
- **Match Brackets:** View tournament brackets, track match scores, and see the progression of winners.
- **Dark-Themed Aesthetic:** A highly polished, neon-accented dark mode UI designed specifically for the gaming and esports community.

## 🛠️ Prerequisites
- Node.js (v18+)
- npm or yarn

## ⚙️ Setup Instructions
1. **Install Dependencies:**
   Navigate into the frontend directory and install the necessary packages.
   ```bash
   npm install
   ```
2. **Configure Environment:**
   If you have specific API endpoints, you can configure them via `.env` files (e.g., setting the API base URL to match your Spring Boot backend port). By default, Axios is configured to point to `http://localhost:8080`.
3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
4. **Access the App:**
   Open your browser and navigate to `http://localhost:5173` (or the port Vite specifies in your terminal).

## 📁 Project Structure
- `/src/components/`: Reusable UI components (Navbars, Modals, Buttons).
- `/src/pages/`: Main route views (Dashboard, Tournaments, MyTeam, Landing).
- `/src/services/`: API integration layer using Axios.
- `/src/utils/`: Utility functions (e.g., JWT decoding, date formatting).

## 🌐 Connecting to the Backend
Ensure the **ArenaLink Spring Boot Backend** is running simultaneously on `http://localhost:8080` to authenticate, fetch data, and perform actions. Cross-Origin Resource Sharing (CORS) is configured on the backend to accept requests from the frontend client.
