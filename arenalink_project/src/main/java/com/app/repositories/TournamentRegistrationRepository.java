package com.app.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.app.entities.Team;
import com.app.entities.Tournament;
import com.app.entities.TournamentRegistration;
import com.app.entities.RegistrationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TournamentRegistrationRepository extends JpaRepository<TournamentRegistration, Long> {
    Optional<TournamentRegistration> findByTournamentAndTeam(Tournament tournament, Team team);
    List<TournamentRegistration> findByTeam_TeamId(Long teamId);
    Page<TournamentRegistration> findByTournament_TournamentId(Long tournamentId, Pageable pageable);
    void deleteByTournament_TournamentId(Long tournamentId);
    
    List<TournamentRegistration> findByTournament_TournamentIdAndStatus(Long tournamentId, RegistrationStatus status);
    long countByTournament_TournamentIdAndStatusIn(Long tournamentId, java.util.Collection<RegistrationStatus> statuses);
    long countByTeam_TeamIdAndStatus(Long teamId, RegistrationStatus status);
    void deleteByTeam_TeamId(Long teamId);
}
