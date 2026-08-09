package com.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamCreateRequestDTO {

    @NotBlank
    @Size(min = 3, max = 50)
    private String teamName;

    private String logo;

    private String description;

    @NotNull
    private Long playerId;
}
