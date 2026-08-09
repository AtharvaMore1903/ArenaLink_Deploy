package com.app.services;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dto.*;
import com.app.entities.Player;
import com.app.entities.User;
import com.app.entities.UserRole;
import com.app.exceptions.DuplicateResourceException;
import com.app.exceptions.InvalidCredentialsException;
import com.app.exceptions.ResourceNotFoundException;
import com.app.exceptions.UnauthorizedException;
import com.app.repositories.PlayerRepository;
import com.app.repositories.UserRepository;
import com.app.security.JwtUtils;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PlayerServiceImpl implements PlayerService {

    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public String registerPlayer(PlayerRegistrationRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered!");
        }
        if (playerRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already taken!");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(UserRole.ROLE_PLAYER);

        Player player = new Player();
        player.setUser(user);
        player.setUsername(request.getUsername());
        player.setIgn(request.getIgn());
        player.setAge(request.getAge());
        player.setRank(request.getRank());
        player.setCountry(request.getCountry());

        playerRepository.save(player);
        return "Player registered successfully!";
    }

    @Override
    public PlayerLoginResponseDTO loginPlayer(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password!");
        }

        if (user.getRole() != UserRole.ROLE_PLAYER) {
            throw new UnauthorizedException("Unauthorized access: User is not a player!");
        }

        Player player = playerRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Player details not found!"));

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return new PlayerLoginResponseDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                player.getUsername(),
                player.getIgn(),
                player.getAge(),
                player.getRank(),
                player.getCountry(),
                "Login successful!",
                token
        );
    }

    @Override
    public Page<PlayerResponseDTO> getAllPlayers(Pageable pageable) {
        return playerRepository.findAll(pageable)
                .map(this::mapToPlayerResponseDTO);
    }

    @Override
    public PlayerResponseDTO getPlayerById(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + id));
        return mapToPlayerResponseDTO(player);
    }

    @Override
    public String updatePlayer(Long id, PlayerUpdateRequestDTO request) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + id));
        
        User user = player.getUser();

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        
        if (request.getUsername() != null && !request.getUsername().equals(player.getUsername())) {
            if (playerRepository.existsByUsername(request.getUsername())) {
                throw new DuplicateResourceException("Username already taken!");
            }
            player.setUsername(request.getUsername());
        }
        
        if (request.getIgn() != null) player.setIgn(request.getIgn());
        if (request.getAge() != null) player.setAge(request.getAge());
        if (request.getRank() != null) player.setRank(request.getRank());
        if (request.getCountry() != null) player.setCountry(request.getCountry());

        playerRepository.save(player);
        return "Player updated successfully!";
    }

    @Override
    public String deletePlayer(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + id));
        playerRepository.delete(player);
        userRepository.delete(player.getUser());
        return "Player deleted successfully!";
    }

    private PlayerResponseDTO mapToPlayerResponseDTO(Player player) {
        User user = player.getUser();
        PlayerResponseDTO dto = new PlayerResponseDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setUsername(player.getUsername());
        dto.setIgn(player.getIgn());
        dto.setAge(player.getAge());
        dto.setRank(player.getRank());
        dto.setCountry(player.getCountry());
        return dto;
    }
}