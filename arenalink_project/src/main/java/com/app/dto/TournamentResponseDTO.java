package com.app.dto;

import java.time.LocalDate;

import com.app.entities.TournamentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TournamentResponseDTO {
    private Long tournamentId;
    private String tournamentName;
    private Long organizerId;
    private String organizerName;
    private Long gameId;
    private String gameName;
    private LocalDate registrationDeadline;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double prizePool;
    private Integer maxTeams;
    private String rules;
    private TournamentStatus status;
}
