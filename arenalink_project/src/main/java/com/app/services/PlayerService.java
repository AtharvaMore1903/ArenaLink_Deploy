package com.app.services;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.app.dto.*;

public interface PlayerService {
    String registerPlayer(PlayerRegistrationRequestDTO request);
    PlayerLoginResponseDTO loginPlayer(LoginRequestDTO request);
    Page<PlayerResponseDTO> getAllPlayers(Pageable pageable);
    PlayerResponseDTO getPlayerById(Long id);
    String updatePlayer(Long id, PlayerUpdateRequestDTO request);
    String deletePlayer(Long id);
}