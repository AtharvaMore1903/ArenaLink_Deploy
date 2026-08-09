package com.app.repositories;

import com.app.entities.RegistrationStatus;
import com.app.entities.TeamJoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeamJoinRequestRepository extends JpaRepository<TeamJoinRequest, Long> {
    List<TeamJoinRequest> findByTeam_TeamId(Long teamId);
    List<TeamJoinRequest> findByTeam_TeamIdAndStatus(Long teamId, RegistrationStatus status);
    List<TeamJoinRequest> findByPlayer_Id(Long playerId);
    Optional<TeamJoinRequest> findByTeam_TeamIdAndPlayer_Id(Long teamId, Long playerId);
    void deleteByTeam_TeamId(Long teamId);
}
