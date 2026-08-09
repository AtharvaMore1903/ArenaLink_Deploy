package com.matchservice.dto;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MatchCreateRequestDTO {
    private Long tournamentId;
    private Long team1Id;
    private Long team2Id;
    private Integer roundNumber;
    private LocalDateTime startTime;
}
