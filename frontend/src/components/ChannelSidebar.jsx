import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ChannelSidebar = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const getCategory = () => {
    if (path.startsWith('/tournaments')) return 'TOURNAMENTS';
    if (path.startsWith('/teams') || path.startsWith('/my-team')) return 'TEAMS';
    return 'NAVIGATION';
  };

  const category = getCategory();
  const navLinkClass = ({ isActive }) => `channel-item ${isActive ? 'active' : ''}`;

  return (
    <div className="channel-sidebar">
      <div className="channel-header">ArenaLink</div>
      
      <div className="channel-list">
        <div className="channel-category">{category}</div>
        
        {category === 'NAVIGATION' && (
          <>
            <NavLink to="/dashboard" className={navLinkClass}>
              <span className="text-muted">#</span> Dashboard
            </NavLink>
            <NavLink to="/tournaments" className={navLinkClass}>
              <span className="text-muted">#</span> Tournaments
            </NavLink>
            <NavLink to="/leaderboard" className={navLinkClass}>
              <span className="text-muted">#</span> Leaderboard
            </NavLink>
          </>
        )}

        {category === 'TOURNAMENTS' && (
          <>
            <NavLink to="/tournaments" end className={navLinkClass}>
              <span className="text-muted">#</span> Browse Tournaments
            </NavLink>
            {isAuthenticated && user?.role === 'ROLE_ORGANIZER' && (
              <NavLink to="/tournaments/new" className={navLinkClass}>
                <span className="text-muted">#</span> Host Tournament
              </NavLink>
            )}
          </>
        )}

        {category === 'TEAMS' && (
          <>
            <NavLink to="/teams" className={navLinkClass}>
              <span className="text-muted">#</span> Browse Teams
            </NavLink>
            <NavLink to="/my-team" className={navLinkClass}>
              <span className="text-muted">#</span> My Team
            </NavLink>
          </>
        )}
      </div>

      <div className="channel-user-panel">
        <div className="avatar">
          {isAuthenticated ? user?.fullName?.charAt(0).toUpperCase() || 'U' : '?'}
        </div>
        <div className="channel-user-info">
          <div className="channel-user-name">
            {isAuthenticated ? user?.fullName || user?.email : 'Guest'}
          </div>
          <div className="channel-user-role">
            {isAuthenticated ? user?.role?.replace('ROLE_', '') : 'Not logged in'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelSidebar;
