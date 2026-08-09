package com.app.services;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.app.dto.GameCreateRequestDTO;
import com.app.dto.GameResponseDTO;

public interface GameService {
    String createGame(GameCreateRequestDTO request);
    Page<GameResponseDTO> getAllGames(Pageable pageable);
    GameResponseDTO getGameById(Long id);
    String updateGame(Long id, GameCreateRequestDTO request);
    String deleteGame(Long id);
}
