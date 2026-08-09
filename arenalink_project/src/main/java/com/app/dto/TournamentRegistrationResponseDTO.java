package com.app.dto;

import java.time.LocalDateTime;

import com.app.entities.RegistrationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TournamentRegistrationResponseDTO {
    private Long registrationId;
    private Long tournamentId;
    private String tournamentName;
    private Long teamId;
    private String teamName;
    private LocalDateTime registrationDate;
    private RegistrationStatus status;
}
