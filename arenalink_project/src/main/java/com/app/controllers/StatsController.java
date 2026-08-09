package com.app.controllers;

import com.app.dto.TeamStatsDTO;
import com.app.dto.LeaderboardEntryDTO;
import com.app.services.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/team/{teamId}")
    public ResponseEntity<TeamStatsDTO> getTeamStats(@PathVariable Long teamId) {
        return ResponseEntity.ok(statsService.getTeamStats(teamId));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard() {
        return ResponseEntity.ok(statsService.getLeaderboard());
    }
}
