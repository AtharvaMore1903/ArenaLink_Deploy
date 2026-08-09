package com.app.services;

import com.app.dto.*;
import com.app.entities.*;
import com.app.exceptions.DuplicateResourceException;
import com.app.exceptions.ResourceNotFoundException;
import com.app.repositories.TeamRepository;
import com.app.repositories.TournamentRegistrationRepository;
import com.app.repositories.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import com.app.exceptions.BadRequestException;
import com.app.entities.TournamentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
@RequiredArgsConstructor
public class TournamentRegistrationServiceImpl implements TournamentRegistrationService {

    private final TournamentRegistrationRepository registrationRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;

    @Override
    public String registerTeamForTournament(TournamentTeamRegistrationRequestDTO request) {
        Tournament tournament = tournamentRepository.findById(request.getTournamentId())
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found!"));

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found!"));

        // Check 1: Tournament must be in REGISTRATION_OPEN status
        if (tournament.getStatus() != TournamentStatus.REGISTRATION_OPEN) {
            throw new BadRequestException("Tournament is not open for registration. Current status: " + tournament.getStatus());
        }

        // Check 2: Registration deadline must not have passed
        if (tournament.getRegistrationDeadline() != null && LocalDate.now().isAfter(tournament.getRegistrationDeadline())) {
            throw new BadRequestException("Registration deadline has passed: " + tournament.getRegistrationDeadline());
        }

        // Check 3: maxTeams limit must not be reached
        if (tournament.getMaxTeams() != null) {
            long activeRegistrations = registrationRepository.countByTournament_TournamentIdAndStatusIn(
                    tournament.getTournamentId(),
                    java.util.Arrays.asList(RegistrationStatus.PENDING, RegistrationStatus.APPROVED)
            );
            if (activeRegistrations >= tournament.getMaxTeams()) {
                throw new BadRequestException("Tournament has reached maximum team capacity: " + tournament.getMaxTeams());
            }
        }

        if (registrationRepository.findByTournamentAndTeam(tournament, team).isPresent()) {
            throw new DuplicateResourceException("Team is already registered for this tournament!");
        }

        TournamentRegistration registration = new TournamentRegistration();
        registration.setTournament(tournament);
        registration.setTeam(team);
        registration.setRegistrationDate(LocalDateTime.now());
        registration.setStatus(RegistrationStatus.PENDING);

        registrationRepository.save(registration);
        return "Team registered successfully!";
    }

    @Override
    public Page<TournamentRegistrationResponseDTO> getRegistrationsByTournament(Long tournamentId, Pageable pageable) {
        if (!tournamentRepository.findById(tournamentId).isPresent()) {
            throw new ResourceNotFoundException("Tournament not found!");
        }
        return registrationRepository.findByTournament_TournamentId(tournamentId, pageable)
                .map(this::mapToResponseDTO);
    }

    @Override
    public List<TournamentRegistrationResponseDTO> getRegistrationsByTeam(Long teamId) {
        if (!teamRepository.findById(teamId).isPresent()) {
            throw new ResourceNotFoundException("Team not found!");
        }
        return registrationRepository.findByTeam_TeamId(teamId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public String updateRegistrationStatus(Long registrationId, RegistrationStatusUpdateDTO request) {
        TournamentRegistration r = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found!"));
        
        if (request.getStatus() != null) {
            r.setStatus(request.getStatus());
        }
        
        registrationRepository.save(r);
        return "Registration status updated successfully!";
    }

    @Override
    public String deleteRegistration(Long registrationId) {
        if (!registrationRepository.findById(registrationId).isPresent()) {
            throw new ResourceNotFoundException("Registration not found!");
        }
        registrationRepository.deleteById(registrationId);
        return "Registration deleted successfully!";
    }

    private TournamentRegistrationResponseDTO mapToResponseDTO(TournamentRegistration r) {
        return new TournamentRegistrationResponseDTO(
                r.getRegistrationId(),
                r.getTournament().getTournamentId(),
                r.getTournament().getTournamentName(),
                r.getTeam().getTeamId(),
                r.getTeam().getTeamName(),
                r.getRegistrationDate(),
                r.getStatus()
        );
    }
}
