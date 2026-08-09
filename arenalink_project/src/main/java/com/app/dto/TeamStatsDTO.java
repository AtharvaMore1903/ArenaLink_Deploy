package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamStatsDTO {
    private Long teamId;
    private String teamName;
    private int matchesPlayed;
    private int wins;
    private int losses;
    private int draws;
    private double winRate;
    private int tournamentsParticipated;
}
