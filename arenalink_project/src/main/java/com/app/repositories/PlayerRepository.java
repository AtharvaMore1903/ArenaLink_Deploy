package com.app.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entities.Player;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    boolean existsByUsername(String username);

    Optional<Player> findByUser_Id(Long userId);
}