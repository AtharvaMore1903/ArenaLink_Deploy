package com.matchservice.dto;
import com.matchservice.entity.MatchStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MatchResponseDTO {
    private Long matchId;
    private Long tournamentId;
    private Long team1Id;
    private String team1Name;
    private Long team2Id;
    private String team2Name;
    private Long winnerId;
    private String winnerName;
    private Integer roundNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer team1Score;
    private Integer team2Score;
    private MatchStatus status;
}
