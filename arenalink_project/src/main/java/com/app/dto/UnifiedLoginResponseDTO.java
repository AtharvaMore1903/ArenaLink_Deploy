package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UnifiedLoginResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String message;
    private String token;

    /**
     * Contains role-specific profile details:
     * - For ROLE_PLAYER: PlayerResponseDTO (username, ign, age, rank, country)
     * - For ROLE_ORGANIZER: OrganizerResponseDTO (organizationName, website, description)
     * - For ROLE_ADMIN: AdminResponseDTO (designation)
     */
    private Object roleDetails;
}
