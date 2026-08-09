package com.app.services;

import com.app.dto.LeaderboardEntryDTO;
import com.app.dto.TeamStatsDTO;
import com.app.entities.RegistrationStatus;
import com.app.entities.Team;
import com.app.exceptions.ResourceNotFoundException;
import com.app.feign.MatchServiceClient;
import com.app.feign.MatchStatsDTO;
import com.app.repositories.TeamRepository;
import com.app.repositories.TournamentRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class StatsServiceImpl implements StatsService {

    private final TeamRepository teamRepository;
    private final MatchServiceClient matchServiceClient;
    private final TournamentRegistrationRepository registrationRepository;

    @Override
    public TeamStatsDTO getTeamStats(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));
        return calculateTeamStats(team);
    }

    @Override
    public List<LeaderboardEntryDTO> getLeaderboard() {
        List<Team> allTeams = teamRepository.findAll();
        List<LeaderboardEntryDTO> leaderboard = new ArrayList<>();

        for (Team team : allTeams) {
            TeamStatsDTO stats = calculateTeamStats(team);
            if (stats.getMatchesPlayed() > 0) {
                LeaderboardEntryDTO entry = new LeaderboardEntryDTO();
                entry.setTeamId(stats.getTeamId());
                entry.setTeamName(stats.getTeamName());
                entry.setWins(stats.getWins());
                entry.setLosses(stats.getLosses());
                entry.setWinRate(stats.getWinRate());
                entry.setTournamentsWon(0);
                leaderboard.add(entry);
            }
        }

        leaderboard.sort(Comparator.comparing(LeaderboardEntryDTO::getWins).reversed()
                .thenComparing(Comparator.comparing(LeaderboardEntryDTO::getWinRate).reversed()));

        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }

        return leaderboard;
    }

    private TeamStatsDTO calculateTeamStats(Team team) {
        Long teamId = team.getTeamId();
        
        int wins = 0, losses = 0, draws = 0, matchesPlayed = 0;
        double winRate = 0.0;
        
        try {
            MatchStatsDTO matchStats = matchServiceClient.getTeamMatchStats(teamId);
            wins = matchStats.getWins();
            losses = matchStats.getLosses();
            draws = matchStats.getDraws();
            matchesPlayed = matchStats.getMatchesPlayed();
            winRate = matchStats.getWinRate();
        } catch (Exception e) {
            log.warn("Could not fetch match stats for team {}: {}", teamId, e.getMessage());
        }

        int tournamentsParticipated = (int) registrationRepository.countByTeam_TeamIdAndStatus(teamId, RegistrationStatus.APPROVED);

        TeamStatsDTO dto = new TeamStatsDTO();
        dto.setTeamId(teamId);
        dto.setTeamName(team.getTeamName());
        dto.setMatchesPlayed(matchesPlayed);
        dto.setWins(wins);
        dto.setLosses(losses);
        dto.setDraws(draws);
        dto.setWinRate(winRate);
        dto.setTournamentsParticipated(tournamentsParticipated);
        return dto;
    }
}
