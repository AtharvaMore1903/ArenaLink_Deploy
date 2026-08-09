import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trophy, Medal } from 'lucide-react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/stats/leaderboard');
        setLeaderboard(response.data || []);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
        setError('Failed to load leaderboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankStyling = (rank) => {
    switch (rank) {
      case 1: return { color: '#f1c40f', bg: 'rgba(241, 196, 15, 0.1)' }; // Gold
      case 2: return { color: '#bdc3c7', bg: 'rgba(189, 195, 199, 0.1)' }; // Silver
      case 3: return { color: '#cd7f32', bg: 'rgba(205, 127, 50, 0.1)' }; // Bronze
      default: return { color: 'var(--text-muted)', bg: 'transparent' };
    }
  };

  return (
    <div className="page-view leaderboard-page">
      <div className="page-intro">
        <div><p className="page-kicker">Season rankings</p><h1>Leaderboard</h1><p>Track the teams setting the pace across the arena.</p></div>
        <div className="page-intro-icon"><Trophy size={26} /></div>
      </div>
      {loading ? (
        <div className="loading-center mt-24"><div className="spinner"></div></div>
      ) : error ? (
        <div className="empty-state text-center mt-24 text-red">
          <p>{error}</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="empty-state text-center mt-24">
          <Trophy size={48} className="text-muted mx-auto mb-16 opacity-50" />
          <h3 className="font-semibold text-header-primary mb-8">No Data Yet</h3>
          <p className="text-muted">Leaderboard will update once tournaments are completed.</p>
        </div>
      ) : (
        <div className="card w-full max-w-4xl" style={{ margin: '0 auto' }}>
          <div className="table-container">
            <table className="data-table w-full text-left">
              <thead>
                <tr>
                  <th className="text-center w-16">Rank</th>
                  <th>Team</th>
                  <th className="text-center">Wins</th>
                  <th className="text-center">Losses</th>
                  <th className="text-center">Win Rate</th>
                  <th className="text-center">Tournaments Won</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => {
                  const style = getRankStyling(entry.rank);
                  return (
                    <tr key={entry.teamId} style={{ backgroundColor: style.bg }}>
                      <td className="text-center font-bold" style={{ color: style.color }}>
                        {entry.rank <= 3 ? (
                          <div className="flex items-center justify-center gap-4">
                            <Medal size={16} /> {entry.rank}
                          </div>
                        ) : (
                          `#${entry.rank}`
                        )}
                      </td>
                      <td className="font-semibold text-header-primary">{entry.teamName || `Team #${entry.teamId}`}</td>
                      <td className="text-center text-green font-semibold">{entry.wins}</td>
                      <td className="text-center text-red font-semibold">{entry.losses}</td>
                      <td className="text-center font-semibold">
                        {entry.winRate != null ? `${(entry.winRate).toFixed(1)}%` : '0%'}
                      </td>
                      <td className="text-center text-yellow font-semibold">{entry.tournamentsWon}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
