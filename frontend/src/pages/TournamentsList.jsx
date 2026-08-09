import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Trophy, Calendar, Users, DollarSign, Clock, Settings, PlusCircle, Search } from 'lucide-react';

const TournamentsList = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [registeredTournaments, setRegisteredTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterGame, setFilterGame] = useState('ALL');
    const [sortBy, setSortBy] = useState('DATE_DESC');

    const isOrganizer = isAuthenticated && user?.role === 'ROLE_ORGANIZER';
    const isPlayer = isAuthenticated && user?.role === 'ROLE_PLAYER';

    useEffect(() => {
        fetchTournaments();
    }, [user]);

    const fetchTournaments = async () => {
        try {
            setLoading(true);
            let response;
            if (isOrganizer) {
                // Organizer sees only their own tournaments
                response = await api.get(`/tournament/organizer/${user.id}?size=100`);
            } else {
                response = await api.get('/tournament/all?size=100');
            }
            const data = response.data;
            let allTournaments = Array.isArray(data) ? data : data.content || [];

            if (isPlayer) {
                try {
                    const teamRes = await api.get(`/team/player/${user.id}`);
                    if (teamRes.data && teamRes.data.teamId) {
                        const regRes = await api.get(`/tournament-registration/team/${teamRes.data.teamId}`);
                        const regs = regRes.data || [];
                        const regTourneyIds = new Set(regs.map(r => r.tournamentId));
                        
                        const registered = [];
                        const available = [];
                        allTournaments.forEach(t => {
                            if (regTourneyIds.has(t.tournamentId)) {
                                const reg = regs.find(r => r.tournamentId === t.tournamentId);
                                registered.push({ ...t, registrationStatus: reg.status });
                            } else {
                                available.push(t);
                            }
                        });
                        setRegisteredTournaments(registered);
                        setTournaments(available);
                        return;
                    }
                } catch (e) {
                    console.error("Player has no team or error fetching registrations", e);
                }
            }
            
            setTournaments(allTournaments);
        } catch (err) {
            console.error('Error fetching tournaments:', err);
            toast.error('Failed to load tournaments. Please try again later.');
        } finally {
            setLoading(false);
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



    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString();
    };

    const getFilteredAndSorted = (list) => {
        let result = list;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(t => 
                t.tournamentName?.toLowerCase().includes(lowerTerm) || 
                t.gameName?.toLowerCase().includes(lowerTerm) || 
                t.organizerName?.toLowerCase().includes(lowerTerm)
            );
        }
        if (filterStatus !== 'ALL') {
            result = result.filter(t => t.status === filterStatus);
        }
        if (filterGame !== 'ALL') {
            result = result.filter(t => t.gameName === filterGame);
        }
        
        result.sort((a, b) => {
            if (sortBy === 'DATE_ASC') {
                return new Date(a.startDate || 0) - new Date(b.startDate || 0);
            } else if (sortBy === 'DATE_DESC') {
                return new Date(b.startDate || 0) - new Date(a.startDate || 0);
            } else if (sortBy === 'PRIZE_DESC') {
                return (b.prizePool || 0) - (a.prizePool || 0);
            }
            return 0;
        });
        return result;
    };

    const filteredTournaments = getFilteredAndSorted(tournaments);
    const filteredRegisteredTournaments = getFilteredAndSorted(registeredTournaments);
    const uniqueGames = [...new Set([...tournaments, ...registeredTournaments].map(t => t.gameName).filter(Boolean))];

    return (
        <div className="page-view tournaments-page">
            {!isOrganizer && <div className="page-intro page-intro-compact"><div><p className="page-kicker">Live competition</p><h1>Explore tournaments</h1><p>Discover upcoming brackets and put your team to the test.</p></div><div className="page-intro-icon"><Trophy size={26} /></div></div>}
            {isOrganizer && (
                <div className="page-intro page-intro-compact organizer-tournament-intro">
                    <div>
                        <p className="page-kicker">Organizer console</p>
                        <h1 style={{ color: 'var(--header-primary)', margin: 0 }}>My Tournaments</h1>
                        <p className="text-muted" style={{ margin: '4px 0 0' }}>Tournaments you are hosting</p>
                    </div>
                    <button className="btn btn-blurple" onClick={() => navigate('/tournaments/new')}>
                        <PlusCircle size={16} /> Host New Tournament
                    </button>
                </div>
            )}
            <div className="search-toolbar mb-16">
                <Search size={18} />
                <input className="search-input" type="search" placeholder="Search tournaments, games, or organizers" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search tournaments" />
                <span className="search-count">{filteredTournaments.length + filteredRegisteredTournaments.length} events</span>
            </div>
            
            <div className="flex flex-wrap gap-12 mb-24 items-center">
                <select className="form-select w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px 30px 8px 12px', width: 'fit-content' }}>
                    <option value="ALL">All Statuses</option>
                    <option value="UPCOMING">Upcoming</option>
                    <option value="REGISTRATION_OPEN">Registration Open</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
                <select className="form-select w-auto" value={filterGame} onChange={e => setFilterGame(e.target.value)} style={{ padding: '8px 30px 8px 12px', width: 'fit-content' }}>
                    <option value="ALL">All Games</option>
                    {uniqueGames.map(game => (
                        <option key={game} value={game}>{game}</option>
                    ))}
                </select>
                <select className="form-select w-auto" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 30px 8px 12px', width: 'fit-content', marginLeft: 'auto' }}>
                    <option value="DATE_DESC">Latest First</option>
                    <option value="DATE_ASC">Earliest First</option>
                    <option value="PRIZE_DESC">Highest Prize Pool</option>
                </select>
            </div>

            {loading ? (
                <div className="loading-center">
                    <div className="spinner"></div>
                </div>
            ) : tournaments.length === 0 && registeredTournaments.length === 0 ? (
                <div className="empty-state">
                    <Trophy size={48} className="text-muted mb-8" />
                    <h3>{isOrganizer ? 'No Tournaments Hosted Yet' : 'No Tournaments Found'}</h3>
                    <p className="text-muted">
                        {isOrganizer
                            ? 'You haven\'t hosted any tournaments yet. Click "Host New Tournament" to get started.'
                            : 'There are no tournaments available at the moment.'}
                    </p>
                    {isOrganizer && (
                        <button className="btn btn-blurple mt-16" onClick={() => navigate('/tournaments/new')}>
                            <PlusCircle size={16} /> Host Tournament
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Registered Tournaments Section for Players */}
                    {isPlayer && filteredRegisteredTournaments.length > 0 && (
                        <div className="mb-32">
                            <h2 className="text-header-primary font-bold mb-16 flex items-center gap-8" style={{ fontSize: '1.25rem' }}>
                                <Trophy size={20} className="text-blurple" /> My Registered Tournaments
                            </h2>
                            <div className="grid-cards">
                                {filteredRegisteredTournaments.map(t => (
                                    <div 
                                        key={t.tournamentId} 
                                        className="card card-hover flex-col justify-between"
                                        onClick={() => navigate(`/tournaments/${t.tournamentId}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <div className="tournament-card-top flex justify-between items-start mb-16">
                                                <h3 className="tournament-card-title font-bold text-header-primary">
                                                    {t.tournamentName}
                                                </h3>
                                                <div className="tournament-card-status flex gap-8 items-center">
                                                    {getStatusBadge(t.status)}
                                                    {t.status !== 'CANCELLED' && (
                                                        <span className={`badge ${
                                                            t.registrationStatus === 'APPROVED' ? 'badge-green' : 
                                                            t.registrationStatus === 'REJECTED' ? 'badge-red' : 
                                                            'badge-yellow'
                                                        }`}>
                                                            {t.registrationStatus === 'APPROVED' ? 'Registered' : 
                                                             t.registrationStatus === 'REJECTED' ? 'Rejected' : 
                                                             'Pending'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-col gap-12 mb-24 mt-16">
                                                <div className="flex items-center gap-12 text-sm text-text-normal">
                                                    <Trophy size={16} className="text-blurple" />
                                                    <span>Game: {t.gameName || 'Unknown'}</span>
                                                </div>
                                                <div className="flex items-center gap-12 text-sm text-text-normal">
                                                    <DollarSign size={16} className="text-green" />
                                                    <span>Prize Pool: ${t.prizePool ? t.prizePool.toLocaleString() : '0'}</span>
                                                </div>
                                                <div className="flex items-center gap-12 text-sm text-text-normal">
                                                    <Users size={16} className="text-text-muted" />
                                                    <span>Organizer: {t.organizerName}</span>
                                                </div>
                                                <div className="flex items-center gap-12 text-sm text-text-normal">
                                                    <Calendar size={16} className="text-text-muted" />
                                                    <span>{formatDate(t.startDate)} - {formatDate(t.endDate)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Available Tournaments Section */}
                    {isPlayer && filteredRegisteredTournaments.length > 0 && filteredTournaments.length > 0 && (
                        <h2 className="text-header-primary font-bold mb-16 flex items-center gap-8" style={{ fontSize: '1.25rem' }}>
                            <PlusCircle size={20} className="text-muted" /> Available Tournaments
                        </h2>
                    )}
                    
                    {filteredTournaments.length > 0 && (
                        <div className="grid-cards">
                            {filteredTournaments.map((t) => (
                                <div 
                                    key={t.tournamentId} 
                                    className="card card-hover flex-col justify-between"
                                    onClick={() => navigate(isOrganizer ? `/tournaments/${t.tournamentId}/manage` : `/tournaments/${t.tournamentId}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div>
                                        <div className="tournament-card-top flex justify-between items-start mb-16">
                                            <h3 className="tournament-card-title font-bold text-header-primary">
                                                {t.tournamentName}
                                            </h3>
                                            <div className="tournament-card-status">{getStatusBadge(t.status)}</div>
                                        </div>

                                        <div className="flex-col gap-12 mb-24 mt-16">
                                            <div className="flex items-center gap-12 text-sm text-text-normal">
                                                <Trophy size={16} className="text-blurple" />
                                                <span>Game: {t.gameName || 'Unknown'}</span>
                                            </div>
                                            <div className="flex items-center gap-12 text-sm text-text-normal">
                                                <DollarSign size={16} className="text-green" />
                                                <span>Prize Pool: ${t.prizePool ? t.prizePool.toLocaleString() : '0'}</span>
                                            </div>
                                            {!isOrganizer && (
                                                <div className="flex items-center gap-12 text-sm text-text-normal">
                                                    <Users size={16} className="text-text-muted" />
                                                    <span>Organizer: {t.organizerName}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-12 text-sm text-text-normal">
                                                <Calendar size={16} className="text-text-muted" />
                                                <span>{formatDate(t.startDate)} - {formatDate(t.endDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-12 text-sm text-text-normal">
                                                <Clock size={16} className="text-text-muted" />
                                                <span>Max Teams: {t.maxTeams || 'Uncapped'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!loading && (tournaments.length > 0 || registeredTournaments.length > 0) && filteredTournaments.length === 0 && filteredRegisteredTournaments.length === 0 && (
                        <div className="empty-state"><Search size={40} className="text-muted" /><h3>No matching tournaments</h3><p>Try searching by tournament name, game, or organizer.</p></div>
                    )}
                </>
            )}
        </div>
    );
};

export default TournamentsList;
