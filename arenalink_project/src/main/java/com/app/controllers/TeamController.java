package com.app.controllers;

import com.app.dto.*;
import com.app.services.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<ApiResponseDTO> createTeam(@RequestBody TeamCreateRequestDTO request) {
        String message = teamService.createTeam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO(message, "SUCCESS"));
    }

    @PostMapping("/add-member")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<ApiResponseDTO> addMemberToTeam(@RequestBody TeamMemberAddRequestDTO request) {
        String message = teamService.addMemberToTeam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO(message, "SUCCESS"));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<TeamResponseDTO>> getAllTeams(Pageable pageable) {
        return ResponseEntity.ok(teamService.getAllTeams(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamResponseDTO> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<TeamResponseDTO> getTeamByPlayer(@PathVariable Long playerId) {
        return ResponseEntity.ok(teamService.getTeamByPlayerId(playerId));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<Page<TeamMemberResponseDTO>> getTeamMembers(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(teamService.getTeamMembers(id, pageable));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<ApiResponseDTO> updateTeam(@PathVariable Long id, @RequestBody TeamUpdateRequestDTO request) {
        String message = teamService.updateTeam(id, request);
        return ResponseEntity.ok(new ApiResponseDTO(message, "SUCCESS"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<ApiResponseDTO> deleteTeam(@PathVariable Long id) {
        String message = teamService.deleteTeam(id);
        return ResponseEntity.ok(new ApiResponseDTO(message, "SUCCESS"));
    }

    @DeleteMapping("/{teamId}/member/{playerId}")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<ApiResponseDTO> removeMember(@PathVariable Long teamId, @PathVariable Long playerId) {
        String message = teamService.removeMember(teamId, playerId);
        return ResponseEntity.ok(new ApiResponseDTO(message, "SUCCESS"));
    }
}
