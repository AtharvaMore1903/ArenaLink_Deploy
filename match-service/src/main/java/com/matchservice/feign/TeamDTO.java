package com.matchservice.feign;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TeamDTO {
    private Long teamId;
    private String teamName;
}
