package com.matchservice.dto;
import com.matchservice.entity.MatchStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MatchUpdateRequestDTO {
    private Integer team1Score;
    private Integer team2Score;
    private Long winnerId;
    private MatchStatus status;
    private LocalDateTime endTime;
}
