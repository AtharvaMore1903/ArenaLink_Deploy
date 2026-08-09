package com.matchservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Match {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long matchId;

    @Column(name = "tournament_id", nullable = false)
    private Long tournamentId;

    @Column(name = "team1_id")
    private Long team1Id;

    @Column(name = "team2_id")
    private Long team2Id;

    @Column(name = "winner_id")
    private Long winnerId;

    private Integer roundNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer team1Score;
    private Integer team2Score;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;
}
