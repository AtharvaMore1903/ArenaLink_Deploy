package com.matchservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "team-service", url = "${monolith.base-url}")
public interface TeamClient {
    @GetMapping("/team/{id}")
    TeamDTO getTeamById(@PathVariable("id") Long id);
}
