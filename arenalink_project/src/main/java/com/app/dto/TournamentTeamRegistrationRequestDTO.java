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
public class TournamentTeamRegistrationRequestDTO {

    @NotNull
    private Long tournamentId;

    @NotNull
    private Long teamId;
}
