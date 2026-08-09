package com.app.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TournamentCreateRequestDTO {

    @NotBlank
    @Size(min = 5, max = 100)
    private String tournamentName;

    @NotNull
    private Long organizerId;

    @NotNull
    private Long gameId;

    @NotNull
    private LocalDate registrationDeadline;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @Min(0)
    private Double prizePool;

    @Min(2)
    private Integer maxTeams;

    private String rules;
}
