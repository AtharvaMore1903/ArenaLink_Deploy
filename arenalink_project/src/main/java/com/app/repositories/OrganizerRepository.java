package com.app.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entities.Organizer;

public interface OrganizerRepository extends JpaRepository<Organizer, Long> {

    Optional<Organizer> findByUser_Id(Long userId);
}