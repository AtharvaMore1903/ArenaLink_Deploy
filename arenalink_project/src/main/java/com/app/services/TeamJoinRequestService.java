package com.app.services;

import com.app.dto.TeamJoinRequestResponseDTO;
import java.util.List;

public interface TeamJoinRequestService {
    TeamJoinRequestResponseDTO createJoinRequest(Long teamId, Long playerId);
    List<TeamJoinRequestResponseDTO> getRequestsForTeam(Long teamId);
    List<TeamJoinRequestResponseDTO> getRequestsForPlayer(Long playerId);
    TeamJoinRequestResponseDTO respondToRequest(Long requestId, Long captainId, boolean approve);
}
