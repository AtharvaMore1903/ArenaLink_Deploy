package com.app.dto;

import java.time.LocalDate;

import com.app.entities.TeamRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberResponseDTO {
    private Long memberId;
    private Long playerId;
    private String playerUsername;
    private String playerIgn;
    private TeamRole role;
    private LocalDate joinedOn;
}
