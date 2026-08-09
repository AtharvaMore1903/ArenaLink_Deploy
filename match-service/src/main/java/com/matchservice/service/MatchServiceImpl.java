package com.matchservice.service;

import com.matchservice.dto.*;
import com.matchservice.entity.Match;
import com.matchservice.entity.MatchStatus;
import com.matchservice.exception.ResourceNotFoundException;
import com.matchservice.feign.TeamClient;
import com.matchservice.feign.TeamDTO;
import com.matchservice.feign.TournamentClient;
import com.matchservice.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final TournamentClient tournamentClient;
    private final TeamClient teamClient;

    @Override
    public String scheduleMatch(MatchCreateRequestDTO request) {
        // Verify tournament exists via Feign
        try {
            tournamentClient.getTournamentById(request.getTournamentId());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Tournament not found with id: " + request.getTournamentId());
        }

        Match match = new Match();
        match.setTournamentId(request.getTournamentId());
        match.setTeam1Id(request.getTeam1Id());
        match.setTeam2Id(request.getTeam2Id());
        match.setRoundNumber(request.getRoundNumber());
        match.setStartTime(request.getStartTime());
        match.setStatus(MatchStatus.SCHEDULED);
        matchRepository.save(match);
        return "Match scheduled successfully";
    }

    @Override
    public Page<MatchResponseDTO> getMatchesByTournament(Long tournamentId, Pageable pageable) {
        return matchRepository.findByTournamentId(tournamentId, pageable).map(this::mapToDTO);
    }

    @Override
    public MatchResponseDTO getMatchById(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));
        return mapToDTO(match);
    }

    @Override
    public String updateMatchResult(Long matchId, MatchUpdateRequestDTO request) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));

        if (request.getTeam1Score() != null) match.setTeam1Score(request.getTeam1Score());
        if (request.getTeam2Score() != null) match.setTeam2Score(request.getTeam2Score());
        if (request.getEndTime() != null) match.setEndTime(request.getEndTime());
        if (request.getStatus() != null) match.setStatus(request.getStatus());
        if (request.getWinnerId() != null) match.setWinnerId(request.getWinnerId());

        matchRepository.save(match);

        if (match.getStatus() == MatchStatus.COMPLETED && match.getWinnerId() != null) {
            Long tournamentId = match.getTournamentId();
            Integer roundNumber = match.getRoundNumber();
            List<Match> roundMatches = matchRepository.findByTournamentIdAndRoundNumber(tournamentId, roundNumber);
            boolean allCompleted = roundMatches.stream().allMatch(m -> m.getStatus() == MatchStatus.COMPLETED && m.getWinnerId() != null);

            if (allCompleted) {
                List<Long> winnerIds = roundMatches.stream().map(Match::getWinnerId).collect(Collectors.toList());
                if (winnerIds.size() == 1) {
                    String winnerName = getTeamNameSafe(winnerIds.get(0));
                    return "Match updated. Tournament completed! Winner: " + winnerName;
                } else {
                    Collections.shuffle(winnerIds);
                    int nextRound = roundNumber + 1;
                    int matchesCreated = generateMatchesForRound(winnerIds, tournamentId, nextRound);
                    return "Match updated. Next round generated with " + matchesCreated + " matches";
                }
            }
        }
        return "Match updated successfully";
    }

    @Override
    public String generateBracket(Long tournamentId) {
        // Verify tournament exists
        try {
            tournamentClient.getTournamentById(tournamentId);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Tournament not found with id: " + tournamentId);
        }

        if (matchRepository.countByTournamentId(tournamentId) > 0) {
            throw new IllegalStateException("Bracket already generated for this tournament");
        }

        // Get approved team IDs from monolith
        List<Long> teamIds;
        try {
            teamIds = tournamentClient.getApprovedTeamIds(tournamentId);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to fetch approved teams: " + e.getMessage());
        }

        if (teamIds == null || teamIds.size() < 2) {
            throw new IllegalStateException("Need at least 2 approved teams to generate a bracket");
        }

        Collections.shuffle(teamIds);
        int matchesCreated = generateMatchesForRound(teamIds, tournamentId, 1);
        return "Bracket generated: " + matchesCreated + " matches created for round 1";
    }

    @Override
    public Page<MatchResponseDTO> getMatchesByTeam(Long teamId, Pageable pageable) {
        return matchRepository.findByTeam1IdOrTeam2Id(teamId, teamId, pageable).map(this::mapToDTO);
    }

    @Override
    public TeamStatsDTO getTeamMatchStats(Long teamId) {
        List<Match> matches = matchRepository.findByTeam1IdOrTeam2Id(teamId, teamId);
        int wins = 0, losses = 0, draws = 0;
        for (Match match : matches) {
            if (match.getStatus() == MatchStatus.COMPLETED) {
                if (match.getWinnerId() == null) {
                    draws++;
                } else if (match.getWinnerId().equals(teamId)) {
                    wins++;
                } else {
                    losses++;
                }
            }
        }
        int matchesPlayed = wins + losses + draws;
        double winRate = matchesPlayed > 0 ? Math.round(((double) wins / matchesPlayed * 100.0) * 10.0) / 10.0 : 0.0;
        TeamStatsDTO dto = new TeamStatsDTO();
        dto.setTeamId(teamId);
        dto.setMatchesPlayed(matchesPlayed);
        dto.setWins(wins);
        dto.setLosses(losses);
        dto.setDraws(draws);
        dto.setWinRate(winRate);
        return dto;
    }

    private int generateMatchesForRound(List<Long> teamIds, Long tournamentId, int roundNumber) {
        int matchCount = 0;
        for (int i = 0; i < teamIds.size(); i += 2) {
            Match newMatch = new Match();
            newMatch.setTournamentId(tournamentId);
            newMatch.setRoundNumber(roundNumber);
            newMatch.setTeam1Id(teamIds.get(i));
            if (i + 1 < teamIds.size()) {
                newMatch.setTeam2Id(teamIds.get(i + 1));
                newMatch.setStatus(MatchStatus.SCHEDULED);
            } else {
                newMatch.setTeam2Id(null);
                newMatch.setWinnerId(teamIds.get(i));
                newMatch.setStatus(MatchStatus.COMPLETED);
            }
            matchRepository.save(newMatch);
            matchCount++;
        }
        return matchCount;
    }

    private MatchResponseDTO mapToDTO(Match match) {
        MatchResponseDTO dto = new MatchResponseDTO();
        dto.setMatchId(match.getMatchId());
        dto.setTournamentId(match.getTournamentId());
        dto.setTeam1Id(match.getTeam1Id());
        dto.setTeam1Name(getTeamNameSafe(match.getTeam1Id()));
        dto.setTeam2Id(match.getTeam2Id());
        dto.setTeam2Name(getTeamNameSafe(match.getTeam2Id()));
        dto.setWinnerId(match.getWinnerId());
        dto.setWinnerName(getTeamNameSafe(match.getWinnerId()));
        dto.setRoundNumber(match.getRoundNumber());
        dto.setStartTime(match.getStartTime());
        dto.setEndTime(match.getEndTime());
        dto.setTeam1Score(match.getTeam1Score());
        dto.setTeam2Score(match.getTeam2Score());
        dto.setStatus(match.getStatus());
        return dto;
    }

    private String getTeamNameSafe(Long teamId) {
        if (teamId == null) return null;
        try {
            TeamDTO team = teamClient.getTeamById(teamId);
            return team != null ? team.getTeamName() : null;
        } catch (Exception e) {
            log.warn("Could not fetch team name for teamId={}: {}", teamId, e.getMessage());
            return "Team #" + teamId;
        }
    }
}
