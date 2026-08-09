import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Trophy, Users, ShieldHalf, PlusCircle, BarChart3, LogOut, LogIn, User, ChevronDown, Radio, Swords } from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `header-nav-link ${isActive ? 'active' : ''}`;

  return (
    <header className="top-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="header-left">
        <NavLink to={isAuthenticated ? "/dashboard" : "/"} className="header-brand" aria-label="ArenaLink home" style={{ display: 'flex', alignItems: 'center', padding: '0 10px 0 0' }}>
          <img src="/logo.png" alt="ArenaLink" style={{ width: '100%', maxWidth: '140px', height: 'auto', maxHeight: '56px', filter: 'drop-shadow(0 4px 10px rgba(118,77,244,.2))', objectFit: 'contain' }} />
        </NavLink>

        <div className="header-divider" />

        <nav className="header-nav" aria-label="Primary navigation">
          {isAuthenticated && (
            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
          )}

          <NavLink to="/tournaments" className={linkClass}>
            <Trophy size={16} /> Tournaments
          </NavLink>

          {isAuthenticated && user?.role === 'ROLE_PLAYER' && (
            <>
              <NavLink to="/teams" className={linkClass}>
                <Users size={16} /> Teams
              </NavLink>
              <NavLink to="/my-team" className={linkClass}>
                <ShieldHalf size={16} /> My Team
              </NavLink>
            </>
          )}

          {isAuthenticated && user?.role === 'ROLE_ORGANIZER' && (
            <NavLink to="/tournaments/new" className={linkClass}>
              <PlusCircle size={16} /> Host
            </NavLink>
          )}

          <NavLink to="/leaderboard" className={linkClass}>
            <BarChart3 size={16} /> Leaderboard
          </NavLink>
        </nav>
      </div>

      <div className="header-right">
        <div className="header-live-status" aria-label="Platform status: arena live"><Radio size={13} /> Arena live</div>
        {isAuthenticated ? (
          <div className="header-profile-wrapper" ref={dropdownRef}>
            <button
              className="header-profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
            >
              <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="header-user-info">
                <span className="header-user-name">{user?.fullName}</span>
                <span className="header-user-role">{user?.role?.replace('ROLE_', '')}</span>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {dropdownOpen && (
              <div className="header-dropdown" role="menu">
                <div className="header-dropdown-header">
                  <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-header-primary">{user?.fullName}</div>
                    <div className="text-xs text-muted">{user?.email}</div>
                  </div>
                </div>
                <div className="header-dropdown-divider" />
                <button
                  className="header-dropdown-item"
                  onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                >
                  <User size={16} /> Profile & Settings
                </button>
                <div className="header-dropdown-divider" />
                <button className="header-dropdown-item header-dropdown-danger" onClick={handleLogout}>
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-blurple btn-sm">
            <LogIn size={16} /> Log In
          </NavLink>
        )}
      </div>
    </header>
  );
}
