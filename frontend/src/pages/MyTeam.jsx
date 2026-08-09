import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Users, Calendar, Shield, X, Check, LogOut } from 'lucide-react';

const MyTeam = () => {
    const { user } = useAuth();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState({ teamName: '', description: '' });
    const [creating, setCreating] = useState(false);

    // Tab state
    const [activeTab, setActiveTab] = useState('members');
    
    // Data state
    const [members, setMembers] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [matches, setMatches] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchMyTeam();
        }
    }, [user?.id]);

    useEffect(() => {
        if (team) {
            if (activeTab === 'members') fetchMembers();
            if (activeTab === 'requests') fetchJoinRequests();
            if (activeTab === 'matches') fetchMatches();
        }
    }, [team, activeTab]);

    const fetchMyTeam = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/team/player/${user.id}`);
            setTeam(response.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setTeam(null);
            } else {
                console.error('Error fetching team:', err);
                toast.error('Failed to load team information.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        if (!team) return;
        try {
            setDataLoading(true);
            const response = await api.get(`/team/${team.teamId}/members`);
            setMembers(response.data.content || []);
        } catch (err) {
            console.error('Error fetching members:', err);
        } finally {
            setDataLoading(false);
        }
    };

    const fetchJoinRequests = async () => {
        if (!team) return;
        try {
            setDataLoading(true);
            const response = await api.get(`/team-requests/team/${team.teamId}`);
            // Filter only PENDING requests
            const pendingRequests = (response.data || []).filter(req => req.status === 'PENDING');
            setJoinRequests(pendingRequests);
        } catch (err) {
            console.error('Error fetching join requests:', err);
        } finally {
            setDataLoading(false);
        }
    };

    const fetchMatches = async () => {
        if (!team) return;
        try {
            setDataLoading(true);
            const response = await api.get(`/match/team/${team.teamId}`);
            setMatches(response.data.content || []);
        } catch (err) {
            console.error('Error fetching matches:', err);
        } finally {
            setDataLoading(false);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            setCreating(true);
            await api.post('/team/create', { 
                teamName: createForm.teamName, 
                description: createForm.description, 
                playerId: user.id 
            });
            setShowCreateModal(false);
            toast.success('Team created successfully!');
            fetchMyTeam();
        } catch (err) {
            console.error('Error creating team:', err);
            toast.error(err.response?.data?.message || 'Failed to create team.');
        } finally {
            setCreating(false);
        }
    };

    const handleRemoveMember = async (playerId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;
        try {
            await api.delete(`/team/${team.teamId}/member/${playerId}`);
            toast.success('Member removed successfully.');
            fetchMembers();
        } catch (err) {
            console.error('Error removing member:', err);
            toast.error(err.response?.data?.message || 'Failed to remove member.');
        }
    };

    const handleDisbandTeam = async () => {
        if (!window.confirm('Are you sure you want to disband your team? This cannot be undone and all members will be removed.')) return;
        try {
            await api.delete(`/team/${team.teamId}`);
            toast.success('Team disbanded successfully.');
            setTeam(null);
        } catch (err) {
            console.error('Error disbanding team:', err);
            toast.error(err.response?.data?.message || 'Failed to disband team.');
        }
    };

    const handleLeaveTeam = async () => {
        if (!window.confirm('Are you sure you want to leave the team?')) return;
        try {
            await api.delete(`/team/${team.teamId}/member/${user.id}`);
            toast.success('You have left the team.');
            setTeam(null);
        } catch (err) {
            console.error('Error leaving team:', err);
            toast.error(err.response?.data?.message || 'Failed to leave team.');
        }
    };

    const handleRequestAction = async (requestId, approve) => {
        try {
            await api.put(`/team-requests/${requestId}/respond?captainId=${user.id}&approve=${approve}`);
            toast.success(approve ? 'Request approved.' : 'Request rejected.');
            fetchJoinRequests();
            if (approve) {
                fetchMembers();
            }
        } catch (err) {
            console.error('Error responding to request:', err);
            toast.error(err.response?.data?.message || 'Failed to process request.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    const isCaptain = team?.leaderId === user?.id;

    if (loading) {
        return (
            <>
                <div className="loading-center">
                    <div className="spinner"></div>
                </div>
            </>
        );
    }

    if (!team) {
        return (
            <>
                <div className="empty-state team-empty-state mt-24">
                    <Users size={48} className="text-muted mb-16" />
                    <h3 className="text-header-primary font-bold mb-8">You are not in a team</h3>
                    <p className="text-muted mb-24">Join an existing team or create your own to participate in tournaments.</p>
                    <button className="btn btn-blurple" onClick={() => setShowCreateModal(true)}>
                        Create Team
                    </button>
                </div>

                {showCreateModal && (
                    <div className="modal-overlay">
                        <div className="modal" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', overflow: 'hidden' }}>
                            <div className="modal-header flex justify-between items-center p-16" style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                                <h3 className="font-bold text-header-primary">Create New Team</h3>
                                <button className="btn btn-ghost btn-sm p-4" onClick={() => setShowCreateModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateTeam}>
                                <div className="p-16">
                                    <div className="form-group mb-16 flex flex-col gap-8">
                                        <label className="form-label font-bold text-text-normal text-xs uppercase">Team Name</label>
                                        <input 
                                            type="text" 
                                            className="form-input p-8" 
                                            style={{ backgroundColor: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-normal)', borderRadius: '4px' }}
                                            value={createForm.teamName}
                                            onChange={(e) => setCreateForm({...createForm, teamName: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group flex flex-col gap-8">
                                        <label className="form-label font-bold text-text-normal text-xs uppercase">Description</label>
                                        <textarea 
                                            className="form-textarea p-8" 
                                            style={{ backgroundColor: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-normal)', borderRadius: '4px', resize: 'vertical' }}
                                            value={createForm.description}
                                            onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer flex justify-end gap-12 p-16 bg-bg-secondary" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-blurple" disabled={creating}>
                                        {creating ? 'Creating...' : 'Create Team'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            {/* Team Header Card */}
            <div className="card team-hero mb-24 flex items-start gap-24 p-24" style={{ borderRadius: '8px' }}>
                <div className="avatar avatar-xl flex items-center justify-center font-bold bg-blurple text-header-primary" style={{ fontSize: '2.5rem', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--blurple)', color: 'white' }}>
                    {team.teamName ? team.teamName.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-header-primary font-bold mb-8" style={{ fontSize: '1.75rem' }}>{team.teamName}</h2>
                            <p className="text-text-normal mb-16">{team.description || 'No description provided.'}</p>
                        </div>
                        {isCaptain && (
                            <button 
                                className="btn btn-danger flex items-center gap-4" 
                                style={{ padding: '6px 12px', fontSize: '0.85rem', height: 'fit-content' }}
                                onClick={handleDisbandTeam}
                            >
                                <X size={14} /> Disband Team
                            </button>
                        )}
                        {!isCaptain && (
                            <button 
                                className="btn btn-danger flex items-center gap-4" 
                                style={{ padding: '6px 12px', fontSize: '0.85rem', height: 'fit-content' }}
                                onClick={handleLeaveTeam}
                            >
                                <LogOut size={14} /> Leave Team
                            </button>
                        )}
                    </div>
                    
                    <div className="flex gap-24">
                        <div className="flex items-center gap-8 text-sm text-text-normal">
                            <Shield size={16} className="text-blurple" style={{ color: 'var(--blurple)' }} />
                            <span>Captain: <span className="font-semibold text-header-primary">{team.leaderUsername}</span></span>
                        </div>
                        <div className="flex items-center gap-8 text-sm text-text-normal">
                            <Calendar size={16} className="text-muted" style={{ color: 'var(--text-muted)' }} />
                            <span>Created: {formatDate(team.createdDate)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tab-bar mb-24 flex gap-16" style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                <button 
                    className={`tab-item pb-8 font-semibold ${activeTab === 'members' ? 'text-header-primary' : 'text-muted'}`}
                    style={{ borderBottom: activeTab === 'members' ? '2px solid var(--blurple)' : 'none', background: 'transparent' }}
                    onClick={() => setActiveTab('members')}
                >
                    Members
                </button>
                {isCaptain && (
                    <button 
                        className={`tab-item pb-8 font-semibold ${activeTab === 'requests' ? 'text-header-primary' : 'text-muted'}`}
                        style={{ borderBottom: activeTab === 'requests' ? '2px solid var(--blurple)' : 'none', background: 'transparent' }}
                        onClick={() => setActiveTab('requests')}
                    >
                        Join Requests
                    </button>
                )}
                <button 
                    className={`tab-item pb-8 font-semibold ${activeTab === 'matches' ? 'text-header-primary' : 'text-muted'}`}
                    style={{ borderBottom: activeTab === 'matches' ? '2px solid var(--blurple)' : 'none', background: 'transparent' }}
                    onClick={() => setActiveTab('matches')}
                >
                    Matches
                </button>
            </div>

            {/* Tab Content */}
            <div className="card p-0" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden' }}>
                {dataLoading ? (
                    <div className="loading-center py-24 flex justify-center">
                        <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--bg-tertiary)', borderTopColor: 'var(--blurple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                ) : activeTab === 'members' ? (
                    <div className="table-container">
                        <table className="data-table w-full text-left" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                                <tr>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Player</th>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">IGN</th>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Role</th>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Joined</th>
                                    {isCaptain && <th className="p-16 font-semibold text-muted text-sm uppercase text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {members.length === 0 ? (
                                    <tr>
                                        <td colSpan={isCaptain ? 5 : 4} className="text-center py-24 text-muted p-16">No members found.</td>
                                    </tr>
                                ) : (
                                    members.map((member) => (
                                        <tr key={member.memberId} style={{ borderBottom: '1px solid var(--bg-tertiary)' }} className="hover:bg-bg-tertiary">
                                            <td className="p-16 font-semibold text-header-primary">{member.playerUsername}</td>
                                            <td className="p-16 text-text-normal">{member.playerIgn || '-'}</td>
                                            <td className="p-16">
                                                <span className={`badge px-8 py-4 rounded text-xs font-bold ${member.role === 'CAPTAIN' ? 'bg-blurple text-white' : 'bg-bg-tertiary text-text-normal'}`} style={{ backgroundColor: member.role === 'CAPTAIN' ? 'var(--blurple)' : 'var(--bg-tertiary)', color: member.role === 'CAPTAIN' ? 'white' : 'var(--text-normal)' }}>
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="p-16 text-text-normal">{formatDate(member.joinedOn)}</td>
                                            {isCaptain && (
                                                <td className="p-16 text-right">
                                                    {member.playerId !== user.id && (
                                                        <button 
                                                            className="btn btn-red btn-sm px-12 py-6 rounded font-semibold text-white bg-red"
                                                            style={{ backgroundColor: 'var(--red)', border: 'none', cursor: 'pointer' }}
                                                            onClick={() => handleRemoveMember(member.playerId)}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'requests' ? (
                    <div className="table-container">
                        <table className="data-table w-full text-left" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                                <tr>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Player</th>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Username</th>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Date</th>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {joinRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-24 text-muted p-16">No pending join requests.</td>
                                    </tr>
                                ) : (
                                    joinRequests.map((req) => (
                                        <tr key={req.id} style={{ borderBottom: '1px solid var(--bg-tertiary)' }} className="hover:bg-bg-tertiary">
                                            <td className="p-16 font-semibold text-header-primary">{req.playerName}</td>
                                            <td className="p-16 text-text-normal">{req.playerUsername}</td>
                                            <td className="p-16 text-text-normal">{formatDate(req.requestDate)}</td>
                                            <td className="p-16 text-right flex justify-end gap-8">
                                                <button 
                                                    className="btn btn-green btn-sm flex items-center justify-center p-8 rounded text-white bg-green"
                                                    style={{ backgroundColor: 'var(--green)', border: 'none', cursor: 'pointer' }}
                                                    title="Approve"
                                                    onClick={() => handleRequestAction(req.id, true)}
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button 
                                                    className="btn btn-red btn-sm flex items-center justify-center p-8 rounded text-white bg-red"
                                                    style={{ backgroundColor: 'var(--red)', border: 'none', cursor: 'pointer' }}
                                                    title="Reject"
                                                    onClick={() => handleRequestAction(req.id, false)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'matches' ? (
                    <div className="table-container">
                        <table className="data-table w-full text-left" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                                <tr>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Round</th>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Team 1</th>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Team 2</th>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Status</th>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Score</th>
                                    <th className="p-16 font-semibold text-muted text-sm uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-24 text-muted p-16">No scheduled matches.</td>
                                    </tr>
                                ) : (
                                    matches.map((match) => (
                                        <tr key={match.matchId} style={{ borderBottom: '1px solid var(--bg-tertiary)' }} className="hover:bg-bg-tertiary">
                                            <td className="p-16 font-semibold text-header-primary">Round {match.roundNumber}</td>
                                            <td className="p-16 text-text-normal font-semibold" style={{ color: match.team1Id === team.teamId ? 'var(--blurple)' : 'var(--text-normal)' }}>{match.team1Name || 'TBD'}</td>
                                            <td className="p-16 text-text-normal font-semibold" style={{ color: match.team2Id === team.teamId ? 'var(--blurple)' : 'var(--text-normal)' }}>{match.team2Name || 'TBD'}</td>
                                            <td className="p-16">
                                                <span className={`badge px-8 py-4 rounded text-xs font-bold ${match.status === 'COMPLETED' ? 'bg-green text-white' : match.status === 'ONGOING' ? 'bg-blurple text-white' : 'bg-bg-tertiary text-text-normal'}`} style={{ backgroundColor: match.status === 'COMPLETED' ? 'var(--green)' : match.status === 'ONGOING' ? 'var(--blurple)' : 'var(--bg-tertiary)', color: match.status === 'SCHEDULED' ? 'var(--text-normal)' : 'white' }}>
                                                    {match.status}
                                                </span>
                                            </td>
                                            <td className="p-16 text-text-normal font-bold">
                                                {match.status === 'COMPLETED' ? `${match.team1Score} - ${match.team2Score}` : '-'}
                                            </td>
                                            <td className="p-16 text-text-normal text-sm">{formatDate(match.startTime)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </div>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </>
    );
};

export default MyTeam;
