package com.matchservice.dto;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TeamStatsDTO {
    private Long teamId;
    private int matchesPlayed;
    private int wins;
    private int losses;
    private int draws;
    private double winRate;
}
