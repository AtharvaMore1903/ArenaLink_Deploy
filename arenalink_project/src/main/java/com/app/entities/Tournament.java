package com.app.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "tournaments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tournamentId;

    @Column(nullable = false)
    private String tournamentName;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private Organizer organizer;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;

    private LocalDate registrationDeadline;

    private LocalDate startDate;

    private LocalDate endDate;

    private Double prizePool;

    private Integer maxTeams;

    @Lob
    private String rules;

    @Enumerated(EnumType.STRING)
    private TournamentStatus status;
}