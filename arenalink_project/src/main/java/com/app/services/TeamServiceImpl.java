package com.app.services;

import com.app.dto.*;
import com.app.entities.*;
import com.app.exceptions.DuplicateResourceException;
import com.app.exceptions.ResourceNotFoundException;
import com.app.repositories.PlayerRepository;
import com.app.repositories.TeamJoinRequestRepository;
import com.app.repositories.TeamMemberRepository;
import com.app.repositories.TeamRepository;
import com.app.repositories.TournamentRegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamJoinRequestRepository teamJoinRequestRepository;
    private final TournamentRegistrationRepository tournamentRegistrationRepository;

    @Override
    public String createTeam(TeamCreateRequestDTO request) {
        if (teamRepository.existsByTeamName(request.getTeamName())) {
            throw new DuplicateResourceException("Team name already exists!");
        }

        Player leader = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new ResourceNotFoundException("Player not found!"));

        Team team = new Team();
        team.setTeamName(request.getTeamName());
        team.setLogo(request.getLogo());
        team.setDescription(request.getDescription());
        team.setCreatedDate(LocalDate.now());
        team.setLeader(leader);

        Team savedTeam = teamRepository.save(team);

        TeamMember leaderMember = new TeamMember();
        leaderMember.setTeam(savedTeam);
        leaderMember.setPlayer(leader);
        leaderMember.setRole(TeamRole.CAPTAIN);
        leaderMember.setJoinedOn(LocalDate.now());
        teamMemberRepository.save(leaderMember);

        return "Team created successfully with ID: " + savedTeam.getTeamId();
    }

    @Override
    public String addMemberToTeam(TeamMemberAddRequestDTO request) {
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found!"));

        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new ResourceNotFoundException("Player not found!"));

        if (teamMemberRepository.findByTeamAndPlayer(team, player).isPresent()) {
            throw new DuplicateResourceException("Player is already in this team!");
        }

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setPlayer(player);
        member.setRole(TeamRole.MEMBER);
        member.setJoinedOn(LocalDate.now());

        teamMemberRepository.save(member);
        return "Member added successfully to team!";
    }

    @Override
    public Page<TeamResponseDTO> getAllTeams(Pageable pageable) {
        return teamRepository.findAll(pageable).map(this::mapToTeamResponseDTO);
    }

    @Override
    public TeamResponseDTO getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + id));
        return mapToTeamResponseDTO(team);
    }

    @Override
    public Page<TeamMemberResponseDTO> getTeamMembers(Long teamId, Pageable pageable) {
        if (!teamRepository.findById(teamId).isPresent()) {
            throw new ResourceNotFoundException("Team not found with ID: " + teamId);
        }
        return teamMemberRepository.findByTeam_TeamId(teamId, pageable).map(tm -> new TeamMemberResponseDTO(
                tm.getMemberId(),
                tm.getPlayer().getId(),
                tm.getPlayer().getUsername(),
                tm.getPlayer().getIgn(),
                tm.getRole(),
                tm.getJoinedOn()
        ));
    }

    @Override
    public String updateTeam(Long id, TeamUpdateRequestDTO request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + id));

        if (request.getTeamName() != null && !request.getTeamName().equals(team.getTeamName())) {
            if (teamRepository.existsByTeamName(request.getTeamName())) {
                throw new DuplicateResourceException("Team name already exists!");
            }
            team.setTeamName(request.getTeamName());
        }
        if (request.getLogo() != null) {
            team.setLogo(request.getLogo());
        }
        if (request.getDescription() != null) {
            team.setDescription(request.getDescription());
        }

        teamRepository.save(team);
        return "Team updated successfully!";
    }

    @Override
    public String deleteTeam(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + id));
        
        teamJoinRequestRepository.deleteByTeam_TeamId(id);
        tournamentRegistrationRepository.deleteByTeam_TeamId(id);
        teamMemberRepository.deleteByTeam_TeamId(id);
        teamRepository.deleteById(id);
        return "Team deleted successfully!";
    }

    @Override
    public String removeMember(Long teamId, Long playerId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with ID: " + playerId));

        TeamMember tm = teamMemberRepository.findByTeamAndPlayer(team, player)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found!"));
        
        teamMemberRepository.delete(tm);
        return "Member removed successfully!";
    }

    @Override
    public TeamResponseDTO getTeamByPlayerId(Long playerId) {
        TeamMember tm = teamMemberRepository.findFirstByPlayer_Id(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player is not in any team"));
        return mapToTeamResponseDTO(tm.getTeam());
    }

    private TeamResponseDTO mapToTeamResponseDTO(Team team) {
        return new TeamResponseDTO(
                team.getTeamId(),
                team.getTeamName(),
                team.getLogo(),
                team.getDescription(),
                team.getCreatedDate(),
                team.getLeader().getId(),
                team.getLeader().getUsername()
        );
    }
}
