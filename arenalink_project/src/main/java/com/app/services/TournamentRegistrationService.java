package com.app.services;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.app.dto.*;
public interface TournamentRegistrationService {
    String registerTeamForTournament(TournamentTeamRegistrationRequestDTO request);
    Page<TournamentRegistrationResponseDTO> getRegistrationsByTournament(Long tournamentId, Pageable pageable);
    List<TournamentRegistrationResponseDTO> getRegistrationsByTeam(Long teamId);
    String updateRegistrationStatus(Long registrationId, RegistrationStatusUpdateDTO request);
    String deleteRegistration(Long registrationId);
}
