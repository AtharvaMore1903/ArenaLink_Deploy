package com.app.controllers;

import com.app.dto.ApiResponseDTO;
import com.app.dto.GameCreateRequestDTO;
import com.app.dto.GameResponseDTO;
import com.app.services.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO> addGame(@Valid @RequestBody GameCreateRequestDTO request) {
        String msg = gameService.createGame(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO(msg, "SUCCESS"));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<GameResponseDTO>> getAllGames(Pageable pageable) {
        return ResponseEntity.ok(gameService.getAllGames(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameResponseDTO> getGameById(@PathVariable Long id) {
        return ResponseEntity.ok(gameService.getGameById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO> updateGame(@PathVariable Long id, @Valid @RequestBody GameCreateRequestDTO request) {
        String msg = gameService.updateGame(id, request);
        return ResponseEntity.ok(new ApiResponseDTO(msg, "SUCCESS"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO> deleteGame(@PathVariable Long id) {
        String msg = gameService.deleteGame(id);
        return ResponseEntity.ok(new ApiResponseDTO(msg, "SUCCESS"));
    }
}
