package com.matchservice.controller;

import com.matchservice.dto.*;
import com.matchservice.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/match")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;

    @PostMapping("/schedule")
    @PreAuthorize("hasRole('ORGANIZER')")
    public String scheduleMatch(@RequestBody MatchCreateRequestDTO request) {
        return matchService.scheduleMatch(request);
    }

    @GetMapping("/tournament/{tournamentId}")
    public Page<MatchResponseDTO> getMatchesByTournament(@PathVariable Long tournamentId, Pageable pageable) {
        return matchService.getMatchesByTournament(tournamentId, pageable);
    }

    @GetMapping("/{id}")
    public MatchResponseDTO getMatchById(@PathVariable Long id) {
        return matchService.getMatchById(id);
    }

    @GetMapping("/team/{teamId}")
    public Page<MatchResponseDTO> getMatchesByTeam(@PathVariable Long teamId, Pageable pageable) {
        return matchService.getMatchesByTeam(teamId, pageable);
    }

    @PutMapping("/{id}/result")
    @PreAuthorize("hasRole('ORGANIZER')")
    public String updateMatchResult(@PathVariable Long id, @RequestBody MatchUpdateRequestDTO request) {
        return matchService.updateMatchResult(id, request);
    }

    @PostMapping("/tournament/{tournamentId}/generate-bracket")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponseDTO> generateBracket(@PathVariable Long tournamentId) {
        String message = matchService.generateBracket(tournamentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO(message, "SUCCESS"));
    }

    @GetMapping("/stats/team/{teamId}")
    public TeamStatsDTO getTeamMatchStats(@PathVariable Long teamId) {
        return matchService.getTeamMatchStats(teamId);
    }
}
