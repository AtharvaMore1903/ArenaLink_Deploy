package com.app.controllers;

import com.app.dto.*;
import com.app.services.TournamentRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/tournament-registration")
@RequiredArgsConstructor
public class TournamentRegistrationController {

    private final TournamentRegistrationService registrationService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<ApiResponseDTO> registerTeam(@RequestBody TournamentTeamRegistrationRequestDTO request) {
        String message = registrationService.registerTeamForTournament(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO(message, "SUCCESS"));
    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<Page<TournamentRegistrationResponseDTO>> getRegistrationsByTournament(@PathVariable Long tournamentId, Pageable pageable) {
        return ResponseEntity.ok(registrationService.getRegistrationsByTournament(tournamentId, pageable));
    }

    @GetMapping("/team/{teamId}")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<List<TournamentRegistrationResponseDTO>> getRegistrationsByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByTeam(teamId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponseDTO> updateRegistrationStatus(@PathVariable Long id, @RequestBody RegistrationStatusUpdateDTO request) {
        String message = registrationService.updateRegistrationStatus(id, request);
        return ResponseEntity.ok(new ApiResponseDTO(message, "SUCCESS"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO> deleteRegistration(@PathVariable Long id) {
        String message = registrationService.deleteRegistration(id);
        return ResponseEntity.ok(new ApiResponseDTO(message, "SUCCESS"));
    }
}
