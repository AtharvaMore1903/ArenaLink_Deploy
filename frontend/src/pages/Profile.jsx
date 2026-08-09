import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Globe, Gamepad2, Shield, Calendar, Save } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const isPlayer = user?.role === 'ROLE_PLAYER';
  const isOrganizer = user?.role === 'ROLE_ORGANIZER';

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Player fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [ign, setIgn] = useState('');
  const [age, setAge] = useState('');
  const [rank, setRank] = useState('');
  const [country, setCountry] = useState('');

  // Organizer fields
  const [organizationName, setOrganizationName] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const endpoint = isPlayer ? `/player/${user.id}` : `/organizer/${user.id}`;
      const res = await api.get(endpoint);
      const data = res.data;
      setProfile(data);

      setFullName(data.fullName || '');
      setPhone(data.phone || '');

      if (isPlayer) {
        setUsername(data.username || '');
        setIgn(data.ign || '');
        setAge(data.age || '');
        setRank(data.rank || '');
        setCountry(data.country || '');
      } else if (isOrganizer) {
        setOrganizationName(data.organizationName || '');
        setWebsite(data.website || '');
        setDescription(data.description || '');
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let body;
      let endpoint;

      if (isPlayer) {
        endpoint = `/player/update/${user.id}`;
        body = { fullName, phone, username, ign, age: age ? parseInt(age) : null, rank, country };
      } else {
        endpoint = `/organizer/update/${user.id}`;
        body = { fullName, phone, organizationName, website, description };
      }

      await api.put(endpoint, body);
      toast.success('Profile updated successfully!');
      fetchProfile();
    } catch (err) {
      console.error('Failed to update profile', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-center"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-view profile-page" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-intro page-intro-compact">
        <h2 className="text-header-primary font-bold" style={{ fontSize: '1.5rem', margin: 0 }}>
          Profile & Settings
        </h2>
        <p className="text-muted" style={{ margin: '4px 0 0' }}>Manage your personal details</p>
      </div>

      <div className="profile-layout">
        {/* Left: Edit Form */}
        <div className="card">
          <h3 className="font-bold text-header-primary mb-16 flex items-center gap-8">
            <User size={18} /> Edit Personal Information
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>

            {isPlayer && (
              <>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">In-Game Name (IGN)</label>
                  <input
                    className="form-input"
                    type="text"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    placeholder="Your IGN"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      className="form-input"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rank</label>
                    <input
                      className="form-input"
                      type="text"
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      placeholder="Your rank"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    className="form-input"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </>
            )}

            {isOrganizer && (
              <>
                <div className="form-group">
                  <label className="form-label">Organization Name</label>
                  <input
                    className="form-input"
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Organization name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    className="form-input"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="About your organization"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-blurple" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right: Account Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 className="font-bold text-header-primary mb-16 flex items-center gap-8">
              <Shield size={18} style={{ color: 'var(--green)' }} /> Account Meta & Role
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex items-center gap-8">
                <span className="text-muted" style={{ minWidth: '100px' }}>Account ID:</span>
                <span className="font-bold text-header-primary">#{user?.id}</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-muted" style={{ minWidth: '100px' }}>Email:</span>
                <span className="text-text-normal">{profile?.email || user?.email}</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-muted" style={{ minWidth: '100px' }}>Role:</span>
                <span className="badge badge-green">{user?.role?.replace('ROLE_', '')}</span>
              </div>
              {isPlayer && profile?.username && (
                <div className="flex items-center gap-8">
                  <span className="text-muted" style={{ minWidth: '100px' }}>Username:</span>
                  <span className="text-text-normal">@{profile.username}</span>
                </div>
              )}
              {isOrganizer && profile?.organizationName && (
                <div className="flex items-center gap-8">
                  <span className="text-muted" style={{ minWidth: '100px' }}>Organization:</span>
                  <span className="text-text-normal">{profile.organizationName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ borderLeft: '3px solid var(--red)' }}>
            <h3 className="font-bold mb-12" style={{ color: 'var(--red)' }}>Account Session Actions</h3>
            <p className="text-muted text-sm mb-16">
              Sign out of your session on this device. You will need to sign in again to access your account.
            </p>
            <button
              className="btn btn-danger"
              style={{ width: '100%' }}
              onClick={() => {
                if (window.confirm('Are you sure you want to sign out?')) {
                  window.location.href = '/login';
                }
              }}
            >
              <User size={16} /> Sign out of ArenaLink
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
