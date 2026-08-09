package com.matchservice.service;

import com.matchservice.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MatchService {
    String scheduleMatch(MatchCreateRequestDTO request);
    Page<MatchResponseDTO> getMatchesByTournament(Long tournamentId, Pageable pageable);
    MatchResponseDTO getMatchById(Long matchId);
    String updateMatchResult(Long matchId, MatchUpdateRequestDTO request);
    String generateBracket(Long tournamentId);
    Page<MatchResponseDTO> getMatchesByTeam(Long teamId, Pageable pageable);
    TeamStatsDTO getTeamMatchStats(Long teamId);
}
