package com.app.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entities.Team;
import com.app.entities.TeamMember;
import com.app.entities.Player;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    Optional<TeamMember> findByTeamAndPlayer(Team team, Player player);
    
    Page<TeamMember> findByTeam_TeamId(Long teamId, Pageable pageable);
    
    void deleteByTeam_TeamId(Long teamId);
    
    Optional<TeamMember> findFirstByPlayer_Id(Long playerId);
}
