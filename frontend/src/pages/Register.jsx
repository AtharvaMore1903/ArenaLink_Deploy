import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('ROLE_PLAYER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Player fields
  const [username, setUsername] = useState('');
  const [ign, setIgn] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');

  // Organizer fields
  const [organizationName, setOrganizationName] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (role === 'ROLE_PLAYER') {
        await api.post('/player/register', {
          fullName,
          email,
          password,
          phone,
          username,
          ign,
          age: parseInt(age, 10),
          country
        });
      } else {
        await api.post('/organizer/register', {
          fullName,
          email,
          password,
          phone,
          organizationName,
          website,
          description
        });
      }
      toast.success('Registration successful!');
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.details || err.response?.data?.message || 'Registration failed. Please try again.';
      const finalMsg = typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg;
      setError(finalMsg);
      toast.error(finalMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <nav className="landing-nav">
        <img src="/logo.png" alt="ArenaLink" className="landing-logo" onClick={() => navigate('/')} />
        <div className="landing-nav-actions">
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </nav>
      <div className="card auth-card" style={{ width: '100%', maxWidth: '520px', padding: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--header-primary)', textAlign: 'center', marginBottom: '24px' }}>
          Create an account
        </h2>

        <div className="tab-bar" style={{ marginBottom: '24px' }}>
          <button 
            type="button"
            className={`tab-item ${role === 'ROLE_PLAYER' ? 'active' : ''}`}
            onClick={() => setRole('ROLE_PLAYER')}
            style={{ flex: 1 }}
          >
            Player
          </button>
          <button 
            type="button"
            className={`tab-item ${role === 'ROLE_ORGANIZER' ? 'active' : ''}`}
            onClick={() => setRole('ROLE_ORGANIZER')}
            style={{ flex: 1 }}
          >
            Organizer
          </button>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">FULL NAME</label>
            <input id="fullName" type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">EMAIL</label>
            <input id="email" type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">PASSWORD</label>
            <input id="password" type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">PHONE</label>
            <input id="phone" type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          {role === 'ROLE_PLAYER' && (
            <>
              <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="username">USERNAME</label>
                  <input id="username" type="text" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="ign">IN-GAME NAME (IGN)</label>
                  <input id="ign" type="text" className="form-input" value={ign} onChange={(e) => setIgn(e.target.value)} required />
                </div>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="age">AGE</label>
                  <input id="age" type="number" className="form-input" value={age} onChange={(e) => setAge(e.target.value)} required min="13" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="country">COUNTRY</label>
                  <input id="country" type="text" className="form-input" value={country} onChange={(e) => setCountry(e.target.value)} required />
                </div>
              </div>
            </>
          )}

          {role === 'ROLE_ORGANIZER' && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="organizationName">ORGANIZATION NAME</label>
                <input id="organizationName" type="text" className="form-input" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="website">WEBSITE</label>
                <input id="website" type="url" className="form-input" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="description">DESCRIPTION</label>
                <textarea id="description" className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows="3"></textarea>
              </div>
            </>
          )}

          {error && <div className="form-error" style={{ marginBottom: '16px' }}>{error}</div>}

          <button 
            type="submit" 
            className="btn btn-blurple btn-full btn-lg" 
            disabled={isLoading}
            style={{ marginBottom: '16px' }}
          >
            {isLoading ? 'Registering...' : 'Continue'}
          </button>
          
          <div style={{ marginTop: '8px', fontSize: '14px' }}>
            <Link to="/login" style={{ color: 'var(--blurple)', textDecoration: 'none' }}>
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
