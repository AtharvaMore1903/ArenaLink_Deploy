import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Swords } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, id, fullName, email: resEmail, phone, role, roleDetails } = res.data;
      
      login(token, { 
        id, 
        fullName, 
        email: resEmail, 
        phone, 
        role, 
        ...roleDetails 
      });
      
      navigate('/dashboard');
      toast.success('Logged in successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
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
      <div className="card auth-card" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Swords size={48} style={{ color: 'var(--blurple)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--header-primary)', marginBottom: '8px' }}>
            Welcome back!
          </h2>
          <p className="text-muted">
            We're excited to see you again!
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">EMAIL</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="form-error" style={{ marginBottom: '16px' }}>{error}</div>}

          <button 
            type="submit" 
            className="btn btn-blurple btn-full btn-lg" 
            disabled={isLoading}
            style={{ marginBottom: '16px' }}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
          
          <div style={{ marginTop: '8px', fontSize: '14px' }}>
            <span className="text-muted">Need an account? </span>
            <Link to="/register" style={{ color: 'var(--blurple)', textDecoration: 'none' }}>
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
