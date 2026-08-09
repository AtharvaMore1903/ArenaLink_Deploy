package com.app.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "match-service", url = "http://localhost:8082")
public interface MatchServiceClient {
    @GetMapping("/match/stats/team/{teamId}")
    MatchStatsDTO getTeamMatchStats(@PathVariable("teamId") Long teamId);
}
