package com.app.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "players")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @Column(unique = true)
    private String username;

    private String ign;

    private Integer age;

    @Column(name="player_rank")
    private String rank;

    private String country;
    
    @CreationTimestamp 
	@Column(name="created_on")
	private LocalDateTime createdOn;
	
	@UpdateTimestamp
	@Column(name="last_updated")
	private LocalDateTime lastUpdated;
}