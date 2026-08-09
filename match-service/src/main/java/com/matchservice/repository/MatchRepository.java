package com.matchservice.repository;

import com.matchservice.entity.Match;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    Page<Match> findByTournamentId(Long tournamentId, Pageable pageable);
    List<Match> findByTournamentIdAndRoundNumber(Long tournamentId, Integer roundNumber);
    long countByTournamentIdAndRoundNumber(Long tournamentId, Integer roundNumber);
    List<Match> findByTeam1IdOrTeam2Id(Long team1Id, Long team2Id);
    Page<Match> findByTeam1IdOrTeam2Id(Long team1Id, Long team2Id, Pageable pageable);
    long countByWinnerId(Long teamId);
    long countByTournamentId(Long tournamentId);
}
