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
@Table(name = "organizers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Organizer {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    private String organizationName;

    private String website;

    @Column(length = 1000)
    private String description;
    
    @CreationTimestamp 
	@Column(name="created_on")
	private LocalDateTime createdOn;
	
	@UpdateTimestamp
	@Column(name="last_updated")
	private LocalDateTime lastUpdated;
}