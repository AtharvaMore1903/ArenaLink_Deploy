package com.app.services;

import com.app.dto.GameCreateRequestDTO;
import com.app.dto.GameResponseDTO;
import com.app.entities.Game;
import com.app.exceptions.DuplicateResourceException;
import com.app.exceptions.ResourceNotFoundException;
import com.app.repositories.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;

    @Override
    public String createGame(GameCreateRequestDTO request) {
        if (gameRepository.existsByGameName(request.getGameName())) {
            throw new DuplicateResourceException("Game with name " + request.getGameName() + " already exists");
        }
        Game game = new Game();
        game.setGameName(request.getGameName());
        game.setGenre(request.getGenre());
        game.setMaxPlayersPerTeam(request.getMaxPlayersPerTeam());
        gameRepository.save(game);
        return "Game created successfully";
    }

    @Override
    public Page<GameResponseDTO> getAllGames(Pageable pageable) {
        return gameRepository.findAll(pageable)
                .map(this::mapToGameResponseDTO);
    }

    @Override
    public GameResponseDTO getGameById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found with id: " + id));
        return mapToGameResponseDTO(game);
    }

    @Override
    public String updateGame(Long id, GameCreateRequestDTO request) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found with id: " + id));
        
        if (request.getGameName() != null && !request.getGameName().equals(game.getGameName())) {
            if (gameRepository.existsByGameName(request.getGameName())) {
                throw new DuplicateResourceException("Game with name " + request.getGameName() + " already exists");
            }
            game.setGameName(request.getGameName());
        }
        if (request.getGenre() != null) {
            game.setGenre(request.getGenre());
        }
        if (request.getMaxPlayersPerTeam() != null) {
            game.setMaxPlayersPerTeam(request.getMaxPlayersPerTeam());
        }
        gameRepository.save(game);
        return "Game updated successfully";
    }

    @Override
    public String deleteGame(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found with id: " + id));
        gameRepository.delete(game);
        return "Game deleted successfully";
    }

    private GameResponseDTO mapToGameResponseDTO(Game game) {
        return new GameResponseDTO(
                game.getGameId(),
                game.getGameName(),
                game.getGenre(),
                game.getMaxPlayersPerTeam()
        );
    }
}
