package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDTO {
    private int rank;
    private Long teamId;
    private String teamName;
    private int wins;
    private int losses;
    private double winRate;
    private int tournamentsWon;
}
