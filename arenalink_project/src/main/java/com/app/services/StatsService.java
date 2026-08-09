package com.app.services;

import com.app.dto.TeamStatsDTO;
import com.app.dto.LeaderboardEntryDTO;
import java.util.List;

public interface StatsService {
    TeamStatsDTO getTeamStats(Long teamId);
    List<LeaderboardEntryDTO> getLeaderboard();
}
