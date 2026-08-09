package com.app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entities.Game;

public interface GameRepository extends JpaRepository<Game, Long> {
    boolean existsByGameName(String gameName);
}
