package com.app.services;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.app.dto.*;
public interface TeamService {
    String createTeam(TeamCreateRequestDTO request);
    String addMemberToTeam(TeamMemberAddRequestDTO request);
    Page<TeamResponseDTO> getAllTeams(Pageable pageable);
    TeamResponseDTO getTeamById(Long id);
    Page<TeamMemberResponseDTO> getTeamMembers(Long teamId, Pageable pageable);
    String updateTeam(Long id, TeamUpdateRequestDTO request);
    String deleteTeam(Long id);
    String removeMember(Long teamId, Long playerId);
    
    TeamResponseDTO getTeamByPlayerId(Long playerId);
}
