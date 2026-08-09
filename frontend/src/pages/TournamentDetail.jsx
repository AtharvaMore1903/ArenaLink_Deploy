import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Trophy, Calendar, Users, DollarSign, Clock, CheckCircle2, ShieldHalf, Play, Info } from 'lucide-react';

export default function TournamentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const isPlayer = isAuthenticated && user?.role === 'ROLE_PLAYER';

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tourneyRes, regRes] = await Promise.all([
        api.get(`/tournament/${id}`),
        api.get(`/tournament-registration/tournament/${id}?size=100`)
      ]);
      setTournament(tourneyRes.data);
      const fetchedRegistrations = Array.isArray(regRes.data) ? regRes.data : regRes.data.content || [];
      setRegistrations(fetchedRegistrations);

      if (isPlayer) {
        try {
          const teamResponse = await api.get(`/team/player/${user.id}`);
          if (teamResponse.data && teamResponse.data.teamId) {
            const isAlreadyRegistered = fetchedRegistrations.some(r => r.teamId === teamResponse.data.teamId);
            setHasRegistered(isAlreadyRegistered);
          }
        } catch (teamErr) {
          // It's normal for a player to not have a team yet
        }
      }
    } catch (err) {
      console.error('Error fetching tournament details', err);
      toast.error('Failed to load tournament details.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterTeam = async () => {
    setRegistering(true);
    try {
      const teamResponse = await api.get(`/team/player/${user.id}`);
      const teamId = teamResponse.data.teamId;
      await api.post('/tournament-registration/register', { tournamentId: id, teamId });
      toast.success('Team successfully registered for the tournament!');
      setHasRegistered(true);
      fetchData(); // Refresh to show pending status
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.status === 404) {
        toast.error('You do not have a team. Please create or join a team first.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to register team. You might already be registered.');
      }
    } finally {
      setRegistering(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'UPCOMING': return <span className="badge badge-blue">Upcoming</span>;
      case 'REGISTRATION_OPEN': return <span className="badge badge-green">Registration Open</span>;
      case 'ONGOING': return <span className="badge badge-yellow">Ongoing</span>;
      case 'COMPLETED': return <span className="badge badge-muted">Completed</span>;
      case 'CANCELLED': return <span className="badge badge-red">Cancelled</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  if (loading) {
    return <div className="loading-center"><div className="spinner"></div></div>;
  }

  if (!tournament) {
    return (
      <div className="empty-state text-center mt-24">
        <Trophy size={48} className="text-muted mb-16" style={{ margin: '0 auto' }} />
        <h2 className="text-header-primary font-bold">Tournament Not Found</h2>
        <p className="text-muted">The tournament you're looking for does not exist.</p>
        <button className="btn btn-secondary mt-16" onClick={() => navigate('/tournaments')}>Back to Tournaments</button>
      </div>
    );
  }

  const approvedTeams = registrations.filter(r => r.status === 'APPROVED');

  return (
    <div className="page-view tournament-detail-page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <button className="btn btn-secondary btn-sm mb-16" onClick={() => navigate('/tournaments')}>
        &larr; Back to Tournaments
      </button>

      {/* Header Card */}
      <div className="card mb-24" style={{ padding: '32px' }}>
        <div className="flex justify-between items-start mb-24">
          <div>
            <h1 className="text-header-primary font-bold mb-8" style={{ fontSize: '2rem' }}>
              {tournament.tournamentName}
            </h1>
            <div className="flex items-center gap-12">
              {getStatusBadge(tournament.status)}
              <span className="text-muted text-sm flex items-center gap-4">
                <Users size={14} /> Organized by {tournament.organizerName || 'Unknown'}
              </span>
            </div>
          </div>
          
          {/* Register Button for Players */}
          {isPlayer && tournament.status === 'REGISTRATION_OPEN' && !hasRegistered && (
            <button 
              className="btn btn-green" 
              style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={handleRegisterTeam}
              disabled={registering}
            >
              <Play size={18} /> {registering ? 'Registering...' : 'Register Team'}
            </button>
          )}
          {isPlayer && tournament.status === 'REGISTRATION_OPEN' && hasRegistered && (
            <button 
              className="btn btn-secondary" 
              style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'not-allowed' }}
              disabled
            >
              <CheckCircle2 size={18} className="text-green" /> Registered
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="tab-bar mb-24" style={{ width: 'fit-content' }}>
          <button className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab-item ${activeTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveTab('teams')}>Teams ({approvedTeams.length})</button>
          {tournament.rules && (
            <button className={`tab-item ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>Rules</button>
          )}
        </div>

        {activeTab === 'overview' && (
          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '16px' }}>
              <span className="text-muted text-sm uppercase font-semibold flex items-center gap-4 mb-8"><Trophy size={14}/> Game</span>
              <span className="text-header-primary font-bold text-lg">{tournament.game?.gameName || tournament.gameName || 'Unknown'}</span>
            </div>
            <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '16px' }}>
              <span className="text-muted text-sm uppercase font-semibold flex items-center gap-4 mb-8"><Calendar size={14}/> Dates</span>
              <span className="text-header-primary font-bold text-lg">
                {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '16px' }}>
              <span className="text-muted text-sm uppercase font-semibold flex items-center gap-4 mb-8"><DollarSign size={14}/> Prize Pool</span>
              <span className="text-green font-bold text-lg">${tournament.prizePool ? tournament.prizePool.toLocaleString() : '0'}</span>
            </div>
            <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '16px' }}>
              <span className="text-muted text-sm uppercase font-semibold flex items-center gap-4 mb-8"><Users size={14}/> Teams</span>
              <span className="text-header-primary font-bold text-lg">
                {approvedTeams.length} / {tournament.maxTeams || 'Uncapped'}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'rules' && tournament.rules && (
          <div>
            <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', whiteSpace: 'pre-wrap', color: 'var(--text-normal)' }}>
              {tournament.rules}
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            {approvedTeams.length === 0 ? (
              <div className="card text-center p-24 text-muted" style={{ background: 'var(--bg-tertiary)', border: 'none' }}>
                No teams have been approved for this tournament yet.
              </div>
            ) : (
              <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {approvedTeams.map(reg => (
                  <div key={reg.registrationId} className="card flex items-center gap-12" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '16px' }}>
                    <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                      {(reg.teamName || 'T').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-header-primary text-lg">{reg.teamName || `Team #${reg.teamId}`}</div>
                      <div className="text-xs text-muted flex items-center gap-4 mt-4">
                        <CheckCircle2 size={12} className="text-green" /> Approved on {new Date(reg.registrationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
