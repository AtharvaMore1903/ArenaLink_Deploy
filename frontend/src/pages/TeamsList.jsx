import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Users, Calendar, Shield, ArrowLeft, UserPlus, Info, Search } from 'lucide-react';

const TeamsList = () => {
    const { user } = useAuth();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestingIds, setRequestingIds] = useState(new Set());
    const [sentRequests, setSentRequests] = useState(new Set());
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const response = await api.get('/team/all');
            setTeams(response.data.content || []);
        } catch (err) {
            console.error('Error fetching teams:', err);
            toast.error('Failed to load teams. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRequest = async (teamId) => {
        if (!user) {
            toast.error('You must be logged in to request to join a team.');
            return;
        }

        setRequestingIds(prev => new Set(prev).add(teamId));

        try {
            await api.post(`/team-requests/team/${teamId}/player/${user.id}`);
            toast.success('Successfully sent join request to team!');
            setSentRequests(prev => new Set(prev).add(teamId));
        } catch (err) {
            console.error('Error requesting to join:', err);
            toast.error(err.response?.data?.message || 'Failed to send request. You may have already requested or are in a team.');
        } finally {
            setRequestingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(teamId);
                return newSet;
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        return new Date(dateString).toLocaleDateString();
    };

    const filteredTeams = teams.filter((team) =>
        [team.teamName, team.leaderUsername, team.description]
            .some((value) => value?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (selectedTeam) {
        return (
            <div className="page-view teams-page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <button className="btn btn-secondary btn-sm mb-16" onClick={() => setSelectedTeam(null)}>
                    &larr; Back to Teams
                </button>

                <div className="card mb-24" style={{ padding: '32px' }}>
                    <div className="flex justify-between items-start mb-24">
                        <div>
                            <h1 className="text-header-primary font-bold mb-8" style={{ fontSize: '2rem', textTransform: 'uppercase' }}>
                                {selectedTeam.teamName}
                            </h1>
                            <div className="flex items-center gap-12">
                                <span className="badge badge-green">RECRUITING</span>
                                <span className="text-muted text-sm flex items-center gap-4">
                                    <Shield size={14} /> Captain: {selectedTeam.leaderUsername}
                                </span>
                            </div>
                        </div>
                        
                        {user?.role === 'ROLE_PLAYER' && user.id !== selectedTeam.leaderId && !sentRequests.has(selectedTeam.teamId) && (
                            <button 
                                className="btn btn-blurple flex items-center gap-8"
                                style={{ padding: '12px 24px', fontSize: '1rem' }}
                                onClick={(e) => { e.stopPropagation(); handleJoinRequest(selectedTeam.teamId); }}
                                disabled={requestingIds.has(selectedTeam.teamId)}
                            >
                                <UserPlus size={20} />
                                {requestingIds.has(selectedTeam.teamId) ? 'Sending Request...' : 'Request to Join'}
                            </button>
                        )}
                        {user?.role === 'ROLE_PLAYER' && user.id !== selectedTeam.leaderId && sentRequests.has(selectedTeam.teamId) && (
                            <button 
                                className="btn btn-secondary flex items-center gap-8"
                                style={{ padding: '12px 24px', fontSize: '1rem', cursor: 'not-allowed' }}
                                disabled
                            >
                                <Shield size={20} className="text-green" />
                                Request Sent
                            </button>
                        )}
                    </div>

                    <div className="grid-cards mb-24" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '16px' }}>
                            <span className="text-muted text-sm uppercase font-semibold flex items-center gap-4 mb-8">
                                <Shield size={14} /> Captain
                            </span>
                            <span className="text-header-primary font-bold text-lg">{selectedTeam.leaderUsername}</span>
                        </div>
                        <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '16px' }}>
                            <span className="text-muted text-sm uppercase font-semibold flex items-center gap-4 mb-8">
                                <Calendar size={14} /> Formed On
                            </span>
                            <span className="text-header-primary font-bold text-lg">{formatDate(selectedTeam.createdDate)}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-header-primary font-bold mb-8 flex items-center gap-8">
                            <Info size={18} className="text-blurple" /> About the Team
                        </h3>
                        <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', whiteSpace: 'pre-wrap', color: 'var(--text-normal)' }}>
                            {selectedTeam.description || 'No description provided.'}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-view teams-page">
            <div className="page-intro page-intro-compact">
                <div>
                    <p className="page-kicker">Find your squad</p>
                    <h1 className="text-header-primary mb-4" style={{ margin: 0 }}>Discover Teams</h1>
                    <p className="text-muted" style={{ margin: 0 }}>Find and join the perfect team for your next tournament.</p>
                </div>
                <div className="page-intro-icon"><Users size={26} /></div>
            </div>
            <div className="search-toolbar mb-24">
                <Search size={18} />
                <input
                    className="search-input"
                    type="search"
                    placeholder="Search teams, captains, or descriptions"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search teams"
                />
                <span className="search-count">{filteredTeams.length} teams</span>
            </div>

            {loading ? (
                <div className="loading-center">
                    <div className="spinner"></div>
                </div>
            ) : teams.length === 0 ? (
                <div className="empty-state">
                    <Users size={48} className="text-muted mb-8" />
                    <h3>No Teams Found</h3>
                    <p className="text-muted">There are currently no teams registered.</p>
                </div>
            ) : (
                filteredTeams.length === 0 ? (
                    <div className="empty-state"><Search size={40} className="text-muted" /><h3>No matching teams</h3><p>Try a different team name, captain, or keyword.</p></div>
                ) : <div className="grid-cards">
                    {filteredTeams.map((team) => (
                        <div 
                            key={team.teamId} 
                            className="card card-hover flex-col justify-between"
                            onClick={() => setSelectedTeam(team)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div>
                                <div className="team-card-top flex justify-between items-start mb-12">
                                    <h3 className="team-card-title font-bold text-header-primary">
                                        {team.teamName}
                                    </h3>
                                </div>
                                
                                <div className="flex-col gap-8 mb-16">
                                    <div className="flex items-center gap-8 text-sm text-text-normal">
                                        <Shield size={16} className="text-text-muted" />
                                        <span>Captain: {team.leaderUsername}</span>
                                    </div>
                                    <div className="flex items-center gap-8 text-sm text-text-normal">
                                        <Calendar size={16} className="text-text-muted" />
                                        <span>Created: {formatDate(team.createdDate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeamsList;
