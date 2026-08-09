package com.app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberAddRequestDTO {

    @NotNull
    private Long teamId;

    @NotNull
    private Long playerId;
}
