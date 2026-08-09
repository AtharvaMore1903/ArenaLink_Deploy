package com.app.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponseDTO {
    private Long teamId;
    private String teamName;
    private String logo;
    private String description;
    private LocalDate createdDate;
    private Long leaderId;
    private String leaderUsername;
}
