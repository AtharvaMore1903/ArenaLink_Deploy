package com.app.controllers;

import com.app.dto.*;
import com.app.services.TournamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.app.entities.TournamentRegistration;
import com.app.entities.RegistrationStatus;
import com.app.repositories.TournamentRegistrationRepository;

@RestController
@RequestMapping("/tournament")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;
    private final TournamentRegistrationRepository tournamentRegistrationRepository;

    @PostMapping("/host")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponseDTO> createTournament(@RequestBody TournamentCreateRequestDTO request) {
        String message = tournamentService.createTournament(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO(message, "SUCCESS"));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<TournamentResponseDTO>> getAllTournaments(Pageable pageable) {
        return ResponseEntity.ok(tournamentService.getAllTournaments(pageable));
    }

    @GetMapping("/organizer/{organizerId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Page<TournamentResponseDTO>> getTournamentsByOrganizer(
            @PathVariable Long organizerId, Pageable pageable) {
        return ResponseEntity.ok(tournamentService.getTournamentsByOrganizer(organizerId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TournamentResponseDTO> getTournamentById(@PathVariable Long id) {
        return ResponseEntity.ok(tournamentService.getTournamentById(id));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponseDTO> updateTournament(@PathVariable Long id, @RequestBody TournamentUpdateRequestDTO request) {
        String message = tournamentService.updateTournament(id, request);
        return ResponseEntity.ok(new ApiResponseDTO(message, "SUCCESS"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponseDTO> deleteTournament(@PathVariable Long id) {
        String message = tournamentService.deleteTournament(id);
        return ResponseEntity.ok(new ApiResponseDTO(message, "SUCCESS"));
    }

    @GetMapping("/{id}/approved-teams")
    public ResponseEntity<List<Long>> getApprovedTeamIds(@PathVariable Long id) {
        // Get tournament to verify it exists
        tournamentService.getTournamentById(id); 
        // Query registrations
        List<TournamentRegistration> regs = tournamentRegistrationRepository
                .findByTournament_TournamentIdAndStatus(id, RegistrationStatus.APPROVED);
        List<Long> teamIds = regs.stream()
                .map(r -> r.getTeam().getTeamId())
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(teamIds);
    }
}
