package com.app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entities.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {

    boolean existsByTeamName(String teamName);
}
