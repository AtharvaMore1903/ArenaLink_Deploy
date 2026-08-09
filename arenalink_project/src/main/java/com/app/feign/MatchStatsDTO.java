package com.app.feign;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MatchStatsDTO {
    private Long teamId;
    private int matchesPlayed;
    private int wins;
    private int losses;
    private int draws;
    private double winRate;
}
