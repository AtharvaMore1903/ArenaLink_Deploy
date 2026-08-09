package com.matchservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "tournament-service", url = "${monolith.base-url}")
public interface TournamentClient {
    @GetMapping("/tournament/{id}")
    TournamentDTO getTournamentById(@PathVariable("id") Long id);

    @GetMapping("/tournament/{id}/approved-teams")
    List<Long> getApprovedTeamIds(@PathVariable("id") Long tournamentId);
}
