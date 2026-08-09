import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import LandingLayout from './layouts/LandingLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TournamentsList from './pages/TournamentsList';
import TournamentDetail from './pages/TournamentDetail';
import TeamsList from './pages/TeamsList';
import MyTeam from './pages/MyTeam';
import HostTournament from './pages/HostTournament';
import ManageTournament from './pages/ManageTournament';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

function App() {
  return (
    <>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/tournaments" element={<TournamentsList />} />
          <Route path="/tournaments/:id" element={<TournamentDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Any authenticated user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Player Routes */}
          <Route element={<ProtectedRoute roles={['ROLE_PLAYER']} />}>
            <Route path="/teams" element={<TeamsList />} />
            <Route path="/my-team" element={<MyTeam />} />
          </Route>

          {/* Organizer Routes */}
          <Route element={<ProtectedRoute roles={['ROLE_ORGANIZER']} />}>
            <Route path="/tournaments/new" element={<HostTournament />} />
            <Route path="/tournaments/:id/manage" element={<ManageTournament />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#2b2d31', color: '#dbdee1', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter, sans-serif' }, success: { iconTheme: { primary: '#23a559', secondary: '#fff' } }, error: { iconTheme: { primary: '#f23f43', secondary: '#fff' } } }} />
    </>
  );
}

export default App;
