import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Trophy, Users, Shield, Calendar, Sword, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchStats = async () => {
        try {
          const res = await api.get('/stats/leaderboard');
          setStats(res.data);
        } catch (error) {
          console.error("Failed to load stats", error);
          // Fallback stats
          setStats({
            topTeams: [
              { id: 1, name: "Alpha Legion", score: 1500 },
              { id: 2, name: "Beta Squad", score: 1200 },
              { id: 3, name: "Gamma Ray", score: 1050 }
            ]
          });
        } finally {
          setLoadingStats(false);
        }
      };
      
      fetchStats();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="page-view dashboard-page">
        <div className="empty-state flex flex-col items-center justify-center text-center mt-24">
          <Sword size={64} color="var(--blurple)" className="mb-16" />
          <h2 className="font-bold text-lg mb-8">Ready to jump in?</h2>
          <p className="text-muted mb-24 max-w-md">
            Join the ultimate esports platform. Compete in tournaments, manage teams, or host your own events.
          </p>
          <div className="flex gap-16">
            <Link to="/login" className="btn btn-secondary btn-lg">Log In</Link>
            <Link to="/register" className="btn btn-blurple btn-lg">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  const isPlayer = user.role === 'ROLE_PLAYER';
  const isOrganizer = user.role === 'ROLE_ORGANIZER';
  const isAdmin = user.role === 'ROLE_ADMIN';

  return (
    <div className="page-view dashboard-page">
        <div className="page-intro page-intro-compact"><div><p className="page-kicker">Command center</p><h1>Your dashboard</h1><p>Stay on top of your competition, rankings, and next move.</p></div><div className="page-intro-icon"><LayoutDashboard size={26} /></div></div>
        <div className="card dashboard-welcome mb-24" style={{ color: 'white' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg mb-4">Welcome back, {user.fullName}!</h2>
              <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {isPlayer ? 'Player' : isOrganizer ? 'Organizer' : isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
            {isPlayer && user.ign && (
              <div className="text-right">
                <div className="text-sm" style={{ opacity: 0.8 }}>IGN</div>
                <div className="font-bold">{user.ign}</div>
              </div>
            )}
          </div>
        </div>

        <h3 className="font-bold mb-16 text-muted">LEADERBOARD TOP 3</h3>
        <div className="grid-stats mb-24" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {loadingStats ? (
            <div className="text-muted">Loading stats...</div>
          ) : stats?.topTeams?.length > 0 ? (
            stats.topTeams.map((team, idx) => (
              <div key={team.id || idx} className="card flex items-center justify-between">
                <div className="flex items-center gap-12">
                  <span className={`font-bold ${idx === 0 ? 'text-yellow' : 'text-muted'}`}>#{idx + 1}</span>
                  <span className="font-semibold">{team.name}</span>
                </div>
                <span className="badge badge-blurple">{team.score} pts</span>
              </div>
            ))
          ) : (
            <div className="text-muted">No stats available yet.</div>
          )}
        </div>

        <h3 className="font-bold mb-16 text-muted">QUICK ACTIONS</h3>
        <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          
          {isPlayer && (
            <>
              <Link to="/tournaments" className="card card-hover flex flex-col items-center text-center p-24" style={{ textDecoration: 'none' }}>
                <Trophy size={40} color="var(--yellow)" className="mb-16" />
                <h4 className="font-bold mb-8 text-normal">Browse Tournaments</h4>
                <p className="text-sm text-muted">Find and join upcoming events</p>
              </Link>
              
              <Link to="/teams" className="card card-hover flex flex-col items-center text-center p-24" style={{ textDecoration: 'none' }}>
                <Users size={40} color="var(--blurple)" className="mb-16" />
                <h4 className="font-bold mb-8 text-normal">Browse Teams</h4>
                <p className="text-sm text-muted">Discover teams looking for players</p>
              </Link>

              <Link to="/my-team" className="card card-hover flex flex-col items-center text-center p-24" style={{ textDecoration: 'none' }}>
                <Shield size={40} color="var(--green)" className="mb-16" />
                <h4 className="font-bold mb-8 text-normal">My Team</h4>
                <p className="text-sm text-muted">Manage your team and roster</p>
              </Link>

              <Link to="/leaderboard" className="card card-hover flex flex-col items-center text-center p-24" style={{ textDecoration: 'none' }}>
                <Calendar size={40} color="var(--red)" className="mb-16" />
                <h4 className="font-bold mb-8 text-normal">Leaderboard</h4>
                <p className="text-sm text-muted">Check global rankings</p>
              </Link>
            </>
          )}

          {isOrganizer && (
            <>
              <Link to="/tournaments/new" className="card card-hover flex flex-col items-center text-center p-24" style={{ textDecoration: 'none' }}>
                <Trophy size={40} color="var(--yellow)" className="mb-16" />
                <h4 className="font-bold mb-8 text-normal">Host Tournament</h4>
                <p className="text-sm text-muted">Create a new tournament event</p>
              </Link>
              
              <Link to="/tournaments" className="card card-hover flex flex-col items-center text-center p-24" style={{ textDecoration: 'none' }}>
                <Calendar size={40} color="var(--blurple)" className="mb-16" />
                <h4 className="font-bold mb-8 text-normal">My Tournaments</h4>
                <p className="text-sm text-muted">Manage your hosted events</p>
              </Link>

              <Link to="/leaderboard" className="card card-hover flex flex-col items-center text-center p-24" style={{ textDecoration: 'none' }}>
                <Users size={40} color="var(--green)" className="mb-16" />
                <h4 className="font-bold mb-8 text-normal">Leaderboard</h4>
                <p className="text-sm text-muted">Check global rankings</p>
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/users" className="card card-hover flex flex-col items-center text-center p-24" style={{ textDecoration: 'none' }}>
                <Users size={40} color="var(--red)" className="mb-16" />
                <h4 className="font-bold mb-8 text-normal">Manage Users</h4>
                <p className="text-sm text-muted">View and manage all users</p>
              </Link>
            </>
          )}

        </div>
    </div>
  );
};

export default Dashboard;
