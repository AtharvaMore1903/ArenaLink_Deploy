package com.app.services;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.app.dto.*;

public interface TournamentService {
    String createTournament(TournamentCreateRequestDTO request);
    Page<TournamentResponseDTO> getAllTournaments(Pageable pageable);
    Page<TournamentResponseDTO> getTournamentsByOrganizer(Long organizerId, Pageable pageable);
    TournamentResponseDTO getTournamentById(Long id);
    String updateTournament(Long id, TournamentUpdateRequestDTO request);
    String deleteTournament(Long id);
}
