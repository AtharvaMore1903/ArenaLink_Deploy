package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameResponseDTO {
    private Long gameId;
    private String gameName;
    private String genre;
    private Integer maxPlayersPerTeam;
}
