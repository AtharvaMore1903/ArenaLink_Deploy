package com.app.dto;

import com.app.entities.RegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamJoinRequestResponseDTO {
    private Long id;
    private Long teamId;
    private String teamName;
    private Long playerId;
    private String playerName;
    private String playerUsername;
    private RegistrationStatus status;
    private LocalDateTime requestDate;
}
