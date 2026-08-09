package com.app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.app.entities.Tournament;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {

    boolean existsByTournamentName(String tournamentName);
    Page<Tournament> findByOrganizer_Id(Long organizerId, Pageable pageable);
}
