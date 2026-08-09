import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Trophy, AlertCircle, Calendar, Users, DollarSign, FileText } from 'lucide-react';

export default function HostTournament() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tournamentName: '',
    gameId: '',
    prizePool: '',
    maxTeams: '',
    registrationDeadline: '',
    startDate: '',
    endDate: '',
    rules: ''
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/game/all');
        setGames(response.data.content || []);
      } catch (err) {
        console.error('Failed to fetch games', err);
        toast.error('Failed to load games. Please try again later.');
      }
    };
    fetchGames();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        tournamentName: formData.tournamentName,
        organizerId: user?.id,
        gameId: parseInt(formData.gameId),
        registrationDeadline: formData.registrationDeadline,
        startDate: formData.startDate,
        endDate: formData.endDate,
        prizePool: parseFloat(formData.prizePool),
        maxTeams: parseInt(formData.maxTeams),
        rules: formData.rules
      };

      await api.post('/tournament/host', payload);
      toast.success('Tournament created successfully!');
      navigate('/tournaments');
    } catch (err) {
      console.error('Failed to create tournament', err);
      toast.error(err.response?.data?.message || 'Failed to create tournament. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-view form-page">
      <div className="page-intro page-intro-compact form-intro">
        <div><p className="page-kicker">Organizer console</p><h1>Host a tournament</h1><p>Set the stage for your next competitive event.</p></div>
        <div className="page-intro-icon"><Trophy size={26} /></div>
      </div>
      <div className="card form-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-16">
          <div className="form-group">
            <label className="form-label">Tournament Name</label>
            <input
              type="text"
              name="tournamentName"
              className="form-input w-full"
              value={formData.tournamentName}
              onChange={handleChange}
              required
              placeholder="e.g. Summer Championship 2026"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Game</label>
            <select
              name="gameId"
              className="form-select w-full"
              value={formData.gameId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a game...</option>
              {games.map(game => (
                <option key={game.gameId} value={game.gameId}>
                  {game.gameName} ({game.maxPlayersPerTeam}v{game.maxPlayersPerTeam})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row flex gap-16">
            <div className="form-group w-full">
              <label className="form-label flex items-center gap-4"><DollarSign size={16}/> Prize Pool ($)</label>
              <input
                type="number"
                name="prizePool"
                className="form-input w-full"
                value={formData.prizePool}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group w-full">
              <label className="form-label flex items-center gap-4"><Users size={16}/> Max Teams</label>
              <input
                type="number"
                name="maxTeams"
                className="form-input w-full"
                value={formData.maxTeams}
                onChange={handleChange}
                required
                min="2"
              />
            </div>
          </div>

          <div className="form-row flex gap-16">
            <div className="form-group w-full">
              <label className="form-label flex items-center gap-4"><Calendar size={16}/> Registration Deadline</label>
              <input
                type="date"
                name="registrationDeadline"
                className="form-input w-full"
                value={formData.registrationDeadline}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group w-full">
              <label className="form-label flex items-center gap-4"><Calendar size={16}/> Start Date</label>
              <input
                type="date"
                name="startDate"
                className="form-input w-full"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group w-full">
              <label className="form-label flex items-center gap-4"><Calendar size={16}/> End Date</label>
              <input
                type="date"
                name="endDate"
                className="form-input w-full"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label flex items-center gap-4"><FileText size={16}/> Rules</label>
            <textarea
              name="rules"
              className="form-textarea w-full"
              value={formData.rules}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Tournament format, eligibility, conduct rules, etc."
            />
          </div>

          <div className="flex justify-between mt-16">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-blurple" disabled={loading}>
              {loading ? 'Creating...' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
