package com.app.services;

import com.app.dto.TeamJoinRequestResponseDTO;
import com.app.entities.*;
import com.app.exceptions.DuplicateResourceException;
import com.app.exceptions.ResourceNotFoundException;
import com.app.exceptions.UnauthorizedException;
import com.app.repositories.PlayerRepository;
import com.app.repositories.TeamJoinRequestRepository;
import com.app.repositories.TeamMemberRepository;
import com.app.repositories.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TeamJoinRequestServiceImpl implements TeamJoinRequestService {

    private final TeamJoinRequestRepository joinRequestRepository;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final TeamMemberRepository teamMemberRepository;

    @Override
    public TeamJoinRequestResponseDTO createJoinRequest(Long teamId, Long playerId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found"));

        if (joinRequestRepository.findByTeam_TeamIdAndPlayer_Id(teamId, playerId).isPresent()) {
            throw new DuplicateResourceException("Join request already exists");
        }

        if (teamMemberRepository.findFirstByPlayer_Id(playerId).isPresent()) {
            throw new DuplicateResourceException("Player is already in a team!");
        }

        TeamJoinRequest request = new TeamJoinRequest();
        request.setTeam(team);
        request.setPlayer(player);
        request.setStatus(RegistrationStatus.PENDING);

        TeamJoinRequest savedRequest = joinRequestRepository.save(request);
        return mapToDTO(savedRequest);
    }

    @Override
    public List<TeamJoinRequestResponseDTO> getRequestsForTeam(Long teamId) {
        return joinRequestRepository.findByTeam_TeamId(teamId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<TeamJoinRequestResponseDTO> getRequestsForPlayer(Long playerId) {
        return joinRequestRepository.findByPlayer_Id(playerId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public TeamJoinRequestResponseDTO respondToRequest(Long requestId, Long captainId, boolean approve) {
        TeamJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found"));

        Team team = request.getTeam();

        if (!team.getLeader().getId().equals(captainId)) {
            throw new UnauthorizedException("Only the team captain can respond to join requests");
        }

        if (request.getStatus() != RegistrationStatus.PENDING) {
            throw new IllegalStateException("Request is already processed");
        }

        if (approve) {
            request.setStatus(RegistrationStatus.APPROVED);
            
            // Add player to team
            TeamMember newMember = new TeamMember();
            newMember.setTeam(team);
            newMember.setPlayer(request.getPlayer());
            newMember.setRole(TeamRole.MEMBER);
            newMember.setJoinedOn(LocalDate.now());
            teamMemberRepository.save(newMember);

            // Cancel any other pending requests for this player
            List<TeamJoinRequest> otherRequests = joinRequestRepository.findByPlayer_Id(request.getPlayer().getId());
            for (TeamJoinRequest other : otherRequests) {
                if (other.getId().equals(request.getId())) continue;
                if (other.getStatus() == RegistrationStatus.PENDING) {
                    other.setStatus(RegistrationStatus.REJECTED);
                    joinRequestRepository.save(other);
                }
            }
        } else {
            request.setStatus(RegistrationStatus.REJECTED);
        }

        return mapToDTO(joinRequestRepository.save(request));
    }

    private TeamJoinRequestResponseDTO mapToDTO(TeamJoinRequest req) {
        TeamJoinRequestResponseDTO dto = new TeamJoinRequestResponseDTO();
        dto.setId(req.getId());
        dto.setTeamId(req.getTeam().getTeamId());
        dto.setTeamName(req.getTeam().getTeamName());
        dto.setPlayerId(req.getPlayer().getId());
        dto.setPlayerName(req.getPlayer().getUser().getFullName());
        dto.setPlayerUsername(req.getPlayer().getUsername());
        dto.setStatus(req.getStatus());
        dto.setRequestDate(req.getRequestDate());
        return dto;
    }
}
