import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Swords, Trophy, Users, ShieldHalf, 
  LayoutDashboard, PlusCircle, LogIn, LogOut, BarChart3 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => `sidebar-icon ${isActive ? 'active' : ''}`;

  return (
    <div className="sidebar flex flex-col h-full items-center">
      {/* Top: Logo icon */}
      <NavLink to="/" className="sidebar-logo mt-4" title="ArenaLink Home">
        <Swords size={28} />
      </NavLink>

      <div className="sidebar-divider my-2"></div>

      {/* Nav icons */}
      <div className="flex flex-col gap-4 flex-1">
        {isAuthenticated && (
          <NavLink to="/dashboard" className={navLinkClass} title="Dashboard">
            <LayoutDashboard size={24} />
          </NavLink>
        )}

        <NavLink to="/tournaments" className={navLinkClass} title="Tournaments">
          <Trophy size={24} />
        </NavLink>

        {isAuthenticated && user?.role === 'ROLE_PLAYER' && (
          <>
            <NavLink to="/teams" className={navLinkClass} title="Teams">
              <Users size={24} />
            </NavLink>
            <NavLink to="/my-team" className={navLinkClass} title="My Team">
              <ShieldHalf size={24} />
            </NavLink>
          </>
        )}

        {isAuthenticated && user?.role === 'ROLE_ORGANIZER' && (
          <NavLink to="/tournaments/new" className={navLinkClass} title="Host Tournament">
            <PlusCircle size={24} />
          </NavLink>
        )}

        <NavLink to="/leaderboard" className={navLinkClass} title="Leaderboard">
          <BarChart3 size={24} />
        </NavLink>
      </div>

      {/* Bottom */}
      <div className="sidebar-bottom mb-4">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="sidebar-icon" title="Logout">
            <LogOut size={24} />
          </button>
        ) : (
          <NavLink to="/login" className="sidebar-icon" title="Login">
            <LogIn size={24} />
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
