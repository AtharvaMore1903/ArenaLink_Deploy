package com.app.controllers;

import com.app.dto.TeamJoinRequestResponseDTO;
import com.app.services.TeamJoinRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/team-requests")
@RequiredArgsConstructor
public class TeamJoinRequestController {

    private final TeamJoinRequestService joinRequestService;

    // Player requests to join a team
    @PostMapping("/team/{teamId}/player/{playerId}")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<TeamJoinRequestResponseDTO> createRequest(
            @PathVariable Long teamId,
            @PathVariable Long playerId) {
        return ResponseEntity.ok(joinRequestService.createJoinRequest(teamId, playerId));
    }

    // Captain views requests for their team
    @GetMapping("/team/{teamId}")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<List<TeamJoinRequestResponseDTO>> getTeamRequests(@PathVariable Long teamId) {
        return ResponseEntity.ok(joinRequestService.getRequestsForTeam(teamId));
    }

    // Player views their own requests
    @GetMapping("/player/{playerId}")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<List<TeamJoinRequestResponseDTO>> getPlayerRequests(@PathVariable Long playerId) {
        return ResponseEntity.ok(joinRequestService.getRequestsForPlayer(playerId));
    }

    // Captain responds to a request
    @PutMapping("/{requestId}/respond")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<TeamJoinRequestResponseDTO> respondToRequest(
            @PathVariable Long requestId,
            @RequestParam Long captainId,
            @RequestParam boolean approve) {
        return ResponseEntity.ok(joinRequestService.respondToRequest(requestId, captainId, approve));
    }
}
