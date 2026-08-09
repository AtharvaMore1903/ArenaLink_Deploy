package com.app.controllers;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.dto.*;
import com.app.services.PlayerService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/player")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO> registerPlayer(@Valid @RequestBody PlayerRegistrationRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDTO(playerService.registerPlayer(request), "SUCCESS"));
    }

    @PostMapping("/login")
    public ResponseEntity<PlayerLoginResponseDTO> loginPlayer(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(playerService.loginPlayer(request));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<PlayerResponseDTO>> getAllPlayers(Pageable pageable) {
        return ResponseEntity.ok(playerService.getAllPlayers(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerResponseDTO> getPlayerById(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.getPlayerById(id));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<ApiResponseDTO> updatePlayer(@PathVariable Long id, @Valid @RequestBody PlayerUpdateRequestDTO request) {
        return ResponseEntity.ok(new ApiResponseDTO(playerService.updatePlayer(id, request), "SUCCESS"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO> deletePlayer(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponseDTO(playerService.deletePlayer(id), "SUCCESS"));
    }
}