package com.matchservice.feign;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TournamentDTO {
    private Long tournamentId;
    private String tournamentName;
}
