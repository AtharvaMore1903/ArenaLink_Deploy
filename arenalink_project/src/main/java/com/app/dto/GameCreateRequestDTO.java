package com.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameCreateRequestDTO {
    @NotBlank
    private String gameName;
    
    private String genre;
    
    private Integer maxPlayersPerTeam;
}
