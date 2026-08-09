import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Trophy, Calendar, Users, DollarSign, Check, X, Play, Info, XCircle, Unlock, Clock, ShieldCheck } from 'lucide-react';

export default function ManageTournament() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending Requests');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Match edit state
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [matchScores, setMatchScores] = useState({ team1Score: 0, team2Score: 0, winnerId: '' });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tourneyRes, regRes, matchRes] = await Promise.all([
        api.get(`/tournament/${id}`),
        api.get(`/tournament-registration/tournament/${id}?size=100`),
        api.get(`/match/tournament/${id}`)
      ]);
      setTournament(tourneyRes.data);
      setRegistrations(Array.isArray(regRes.data) ? regRes.data : regRes.data.content || []);
      setMatches(Array.isArray(matchRes.data) ? matchRes.data : matchRes.data.content || []);
    } catch (err) {
      console.error('Error fetching tournament details', err);
      toast.error('Failed to load tournament management data.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.put(`/tournament/update/${id}`, { status: newStatus });
      setTournament({ ...tournament, status: newStatus });
      toast.success(`Tournament status updated to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      console.error('Failed to update tournament status', err);
      toast.error('Failed to update status');
    }
  };

  const handleRegistrationAction = async (registrationId, newStatus) => {
    try {
      await api.put(`/tournament-registration/${registrationId}/status`, { status: newStatus });
      setRegistrations(registrations.map(r => r.registrationId === registrationId ? { ...r, status: newStatus } : r));
      toast.success(`Registration ${newStatus.toLowerCase()} successfully`);
    } catch (err) {
      console.error(`Failed to ${newStatus.toLowerCase()} registration`, err);
      toast.error(`Failed to ${newStatus.toLowerCase()} registration`);
    }
  };

  const handleGenerateBracket = async () => {
    try {
      await api.post(`/match/tournament/${id}/generate-bracket`);
      const matchRes = await api.get(`/match/tournament/${id}`);
      setMatches(Array.isArray(matchRes.data) ? matchRes.data : matchRes.data.content || []);
      toast.success('Bracket generated successfully!');
    } catch (err) {
      console.error('Failed to generate bracket', err);
      toast.error('Failed to generate bracket. Ensure tournament has enough approved teams.');
    }
  };

  const startEditingMatch = (match) => {
    setEditingMatchId(match.matchId);
    setMatchScores({
      team1Score: match.team1Score || 0,
      team2Score: match.team2Score || 0,
      winnerId: match.winnerId || ''
    });
  };

  const cancelEditingMatch = () => setEditingMatchId(null);

  const saveMatchResult = async (matchId) => {
    try {
      await api.put(`/match/${matchId}/result`, {
        team1Score: parseInt(matchScores.team1Score),
        team2Score: parseInt(matchScores.team2Score),
        winnerId: matchScores.winnerId ? parseInt(matchScores.winnerId) : null,
        status: 'COMPLETED'
      });
      setEditingMatchId(null);
      const matchRes = await api.get(`/match/tournament/${id}`);
      setMatches(Array.isArray(matchRes.data) ? matchRes.data : matchRes.data.content || []);
      toast.success('Match result saved successfully');
    } catch (err) {
      console.error('Failed to update match result', err);
      toast.error('Failed to save match result');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'UPCOMING': case 'PENDING': case 'SCHEDULED': return 'badge-yellow';
      case 'REGISTRATION_OPEN': case 'APPROVED': case 'ONGOING': return 'badge-green';
      case 'COMPLETED': return 'badge-blue';
      case 'CANCELLED': case 'REJECTED': return 'badge-red';
      default: return 'badge-muted';
    }
  };

  // Split registrations
  const approvedTeams = registrations.filter(r => r.status === 'APPROVED');
  const pendingRequests = registrations.filter(r => r.status === 'PENDING');
  const rejectedTeams = registrations.filter(r => r.status === 'REJECTED');

  if (loading) {
    return <div className="loading-center"><div className="spinner"></div></div>;
  }

  if (error && !tournament) {
    return (
      <div className="flex items-center justify-center">
        <div className="empty-state text-center">
          <Info size={48} className="text-red mb-16" style={{ margin: '0 auto' }} />
          <h2 className="text-header-primary font-bold">Error</h2>
          <p className="text-muted">{error || 'Tournament not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-view manage-tournament-page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <button className="btn btn-secondary btn-sm mb-16" onClick={() => navigate('/tournaments')}>
        &larr; Back to Tournaments
      </button>

      {/* Tournament Info Card */}
      <div className="card mb-24">
        <div className="flex justify-between items-start mb-24 flex-wrap gap-24">
          <div>
            <h1 className="text-header-primary font-bold mb-8" style={{ fontSize: '2rem', textTransform: 'uppercase' }}>
              {tournament.tournamentName}
            </h1>
            <div className="flex items-center gap-12">
              <span className={`badge ${getStatusBadgeClass(tournament.status)}`}>
                {tournament.status?.replace('_', ' ')}
              </span>
              <span className="text-muted text-sm flex items-center gap-4">
                <Users size={14} /> Organized by {tournament.organizerName || 'Unknown'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-12 flex-wrap">
            {tournament.status === 'UPCOMING' && (
              <button className="btn btn-blurple" onClick={() => updateStatus('REGISTRATION_OPEN')}>
                <Unlock size={18} /> Open Registration
              </button>
            )}
            {tournament.status === 'REGISTRATION_OPEN' && (
              <button className="btn btn-green" onClick={() => updateStatus('ONGOING')}>
                <Play size={18} /> Start Tournament
              </button>
            )}
            {tournament.status === 'ONGOING' && (
              <button className="btn btn-blurple" onClick={() => updateStatus('COMPLETED')}>
                <Check size={18} /> Mark Completed
              </button>
            )}
            {tournament.status !== 'CANCELLED' && tournament.status !== 'COMPLETED' && (
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this tournament? This cannot be undone.')) {
                    updateStatus('CANCELLED');
                  }
                }}
              >
                <XCircle size={18} /> Cancel Tournament
              </button>
            )}
          </div>
        </div>

        <div className="grid-cards mb-24" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '16px' }}>
            <span className="text-muted text-sm uppercase font-semibold flex items-center gap-4 mb-8"><Info size={14}/> Game</span>
            <span className="text-header-primary font-bold text-lg">{tournament.game?.gameName || tournament.gameName || `Game #${tournament.gameId}`}</span>
          </div>
          <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '16px' }}>
            <span className="text-muted text-sm uppercase font-semibold flex items-center gap-4 mb-8"><Calendar size={14}/> Dates</span>
            <span className="text-header-primary font-bold text-lg">{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</span>
          </div>
          <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '16px' }}>
            <span className="text-muted text-sm uppercase font-semibold flex items-center gap-4 mb-8"><DollarSign size={14}/> Prize Pool</span>
            <span className="text-green font-bold text-lg">${tournament.prizePool ? tournament.prizePool.toLocaleString() : '0'}</span>
          </div>
          <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '16px' }}>
            <span className="text-muted text-sm uppercase font-semibold flex items-center gap-4 mb-8"><Users size={14}/> Teams</span>
            <span className="text-header-primary font-bold text-lg">{approvedTeams.length} / {tournament.maxTeams || 'Uncapped'}</span>
          </div>
        </div>

        {/* Rules */}
        {tournament.rules && (
          <div>
            <h3 className="text-header-primary font-bold mb-8 flex items-center gap-8">
              <Info size={18} className="text-blurple" /> Tournament Rules
            </h3>
            <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', whiteSpace: 'pre-wrap', color: 'var(--text-normal)' }}>
              {tournament.rules}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tab-bar mb-24">
        {['Pending Requests', 'Approved Teams', 'Matches'].map(tab => (
          <button
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === 'Pending Requests' && pendingRequests.length > 0 && (
              <span className="badge badge-yellow" style={{ marginLeft: '8px', fontSize: '11px', padding: '2px 6px' }}>
                {pendingRequests.length}
              </span>
            )}
            {tab === 'Approved Teams' && (
              <span className="badge badge-green" style={{ marginLeft: '8px', fontSize: '11px', padding: '2px 6px' }}>
                {approvedTeams.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pending Requests Tab */}
      {activeTab === 'Pending Requests' && (
        <div className="card">
          <h3 className="font-bold text-header-primary mb-16 flex items-center gap-8">
            <Clock size={18} /> Pending Registration Requests
          </h3>
          {pendingRequests.length === 0 ? (
            <div className="empty-state text-center p-24 text-muted">No pending requests.</div>
          ) : (
            <table className="data-table w-full text-left">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Requested On</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map(reg => (
                  <tr key={reg.registrationId}>
                    <td className="font-semibold">{reg.teamName || `Team #${reg.teamId}`}</td>
                    <td>{new Date(reg.registrationDate).toLocaleDateString()}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-8">
                        <button
                          className="btn btn-sm btn-green flex items-center gap-4"
                          onClick={() => handleRegistrationAction(reg.registrationId, 'APPROVED')}
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          className="btn btn-sm btn-red flex items-center gap-4"
                          onClick={() => handleRegistrationAction(reg.registrationId, 'REJECTED')}
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Approved Teams Tab */}
      {activeTab === 'Approved Teams' && (
        <div className="card">
          <h3 className="font-bold text-header-primary mb-16 flex items-center gap-8">
            <ShieldCheck size={18} /> Approved Teams
          </h3>
          {approvedTeams.length === 0 ? (
            <div className="empty-state text-center p-24 text-muted">No approved teams yet.</div>
          ) : (
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {approvedTeams.map(reg => (
                <div key={reg.registrationId} className="card card-hover" style={{ padding: '16px' }}>
                  <div className="flex items-center gap-12">
                    <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '14px', background: 'var(--blurple)' }}>
                      {(reg.teamName || 'T').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-header-primary">{reg.teamName || `Team #${reg.teamId}`}</div>
                      <div className="text-xs text-muted">Joined {new Date(reg.registrationDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {rejectedTeams.length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <h4 className="text-muted font-semibold mb-12">Rejected ({rejectedTeams.length})</h4>
              <div className="flex flex-wrap gap-8">
                {rejectedTeams.map(reg => (
                  <span key={reg.registrationId} className="badge badge-red">{reg.teamName || `Team #${reg.teamId}`}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'Matches' && (
        <div className="card">
          <div className="flex justify-between items-center mb-16">
            <h3 className="font-bold text-header-primary flex items-center gap-8">
              <Trophy size={18} /> Tournament Matches
            </h3>
            <button className="btn btn-blurple btn-sm flex items-center gap-8" onClick={handleGenerateBracket}>
              <Play size={16} /> Generate Bracket
            </button>
          </div>

          {matches.length === 0 ? (
            <div className="empty-state text-center p-24 text-muted">No matches generated yet. Approve teams and generate a bracket to begin.</div>
          ) : (
            <table className="data-table w-full text-left">
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Matchup</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(match => (
                  <tr key={match.matchId}>
                    <td>{match.round ? `Round ${match.round}` : (match.roundNumber ? `Round ${match.roundNumber}` : 'N/A')}</td>
                    <td>
                      <span className="font-semibold">{match.team1Name || `Team ${match.team1Id}`}</span>
                      <span className="text-muted mx-8">vs</span>
                      <span className="font-semibold">{match.team2Name || `Team ${match.team2Id}`}</span>
                    </td>

                    {editingMatchId === match.matchId ? (
                      <td colSpan="2">
                        <div className="flex items-center gap-8">
                          <input
                            type="number"
                            className="form-input text-sm"
                            style={{ width: '60px' }}
                            value={matchScores.team1Score}
                            onChange={(e) => setMatchScores({...matchScores, team1Score: e.target.value})}
                          />
                          <span>-</span>
                          <input
                            type="number"
                            className="form-input text-sm"
                            style={{ width: '60px' }}
                            value={matchScores.team2Score}
                            onChange={(e) => setMatchScores({...matchScores, team2Score: e.target.value})}
                          />
                          <select
                            className="form-input text-sm"
                            style={{ marginLeft: '8px' }}
                            value={matchScores.winnerId}
                            onChange={(e) => setMatchScores({...matchScores, winnerId: e.target.value})}
                          >
                            <option value="">Winner...</option>
                            <option value={match.team1Id}>{match.team1Name || `Team ${match.team1Id}`}</option>
                            <option value={match.team2Id}>{match.team2Name || `Team ${match.team2Id}`}</option>
                          </select>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="font-semibold">
                          {match.status === 'COMPLETED' ? `${match.team1Score} - ${match.team2Score}` : '-'}
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(match.status)}`}>{match.status}</span>
                          {match.status === 'COMPLETED' && match.winnerId && (
                            <div className="text-xs text-green mt-4 flex items-center gap-4">
                              <Trophy size={12}/> {match.winnerId === match.team1Id ? match.team1Name : match.team2Name} Won
                            </div>
                          )}
                        </td>
                      </>
                    )}

                    <td>
                      {editingMatchId === match.matchId ? (
                        <div className="flex gap-8">
                          <button className="btn btn-sm btn-green" onClick={() => saveMatchResult(match.matchId)}>Save</button>
                          <button className="btn btn-sm btn-secondary" onClick={cancelEditingMatch}>Cancel</button>
                        </div>
                      ) : (
                        match.status === 'SCHEDULED' && (
                          <button className="btn btn-sm btn-blurple" onClick={() => startEditingMatch(match)}>Enter Result</button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
