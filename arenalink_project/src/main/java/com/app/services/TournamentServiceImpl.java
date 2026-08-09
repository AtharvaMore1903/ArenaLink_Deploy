package com.app.services;

import com.app.dto.*;
import com.app.entities.*;
import com.app.exceptions.DuplicateResourceException;
import com.app.exceptions.ResourceNotFoundException;
import com.app.repositories.GameRepository;
import com.app.repositories.OrganizerRepository;
import com.app.repositories.TournamentRegistrationRepository;
import com.app.repositories.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
@RequiredArgsConstructor
public class TournamentServiceImpl implements TournamentService {

    private final TournamentRepository tournamentRepository;
    private final OrganizerRepository organizerRepository;
    private final GameRepository gameRepository;
    private final TournamentRegistrationRepository registrationRepository;

    @Override
    public String createTournament(TournamentCreateRequestDTO request) {
        if (tournamentRepository.existsByTournamentName(request.getTournamentName())) {
            throw new DuplicateResourceException("Tournament name already exists!");
        }

        Organizer organizer = organizerRepository.findById(request.getOrganizerId())
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found!"));

        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new ResourceNotFoundException("Game not found!"));

        Tournament tournament = new Tournament();
        tournament.setTournamentName(request.getTournamentName());
        tournament.setOrganizer(organizer);
        tournament.setGame(game);
        tournament.setRegistrationDeadline(request.getRegistrationDeadline());
        tournament.setStartDate(request.getStartDate());
        tournament.setEndDate(request.getEndDate());
        tournament.setPrizePool(request.getPrizePool());
        tournament.setMaxTeams(request.getMaxTeams());
        tournament.setRules(request.getRules());
        tournament.setStatus(TournamentStatus.UPCOMING);

        tournamentRepository.save(tournament);
        return "Tournament created successfully!";
    }

    @Override
    public Page<TournamentResponseDTO> getAllTournaments(Pageable pageable) {
        return tournamentRepository.findAll(pageable).map(this::mapToTournamentResponseDTO);
    }

    @Override
    public Page<TournamentResponseDTO> getTournamentsByOrganizer(Long organizerId, Pageable pageable) {
        return tournamentRepository.findByOrganizer_Id(organizerId, pageable).map(this::mapToTournamentResponseDTO);
    }

    @Override
    public TournamentResponseDTO getTournamentById(Long id) {
        Tournament t = tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with ID: " + id));
        return mapToTournamentResponseDTO(t);
    }

    @Override
    public String updateTournament(Long id, TournamentUpdateRequestDTO request) {
        Tournament t = tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with ID: " + id));

        if (request.getTournamentName() != null && !request.getTournamentName().equals(t.getTournamentName())) {
            if (tournamentRepository.existsByTournamentName(request.getTournamentName())) {
                throw new DuplicateResourceException("Tournament name already exists!");
            }
            t.setTournamentName(request.getTournamentName());
        }
        if (request.getRegistrationDeadline() != null) t.setRegistrationDeadline(request.getRegistrationDeadline());
        if (request.getStartDate() != null) t.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) t.setEndDate(request.getEndDate());
        if (request.getPrizePool() != null) t.setPrizePool(request.getPrizePool());
        if (request.getMaxTeams() != null) t.setMaxTeams(request.getMaxTeams());
        if (request.getRules() != null) t.setRules(request.getRules());
        if (request.getStatus() != null) t.setStatus(request.getStatus());

        tournamentRepository.save(t);
        return "Tournament updated successfully!";
    }

    @Override
    public String deleteTournament(Long id) {
        if (!tournamentRepository.findById(id).isPresent()) {
            throw new ResourceNotFoundException("Tournament not found with ID: " + id);
        }
        registrationRepository.deleteByTournament_TournamentId(id);
        tournamentRepository.deleteById(id);
        return "Tournament deleted successfully!";
    }

    private TournamentResponseDTO mapToTournamentResponseDTO(Tournament t) {
        return new TournamentResponseDTO(
                t.getTournamentId(),
                t.getTournamentName(),
                t.getOrganizer().getId(),
                t.getOrganizer().getOrganizationName(),
                t.getGame().getGameId(),
                t.getGame().getGameName(),
                t.getRegistrationDeadline(),
                t.getStartDate(),
                t.getEndDate(),
                t.getPrizePool(),
                t.getMaxTeams(),
                t.getRules(),
                t.getStatus()
        );
    }
}
