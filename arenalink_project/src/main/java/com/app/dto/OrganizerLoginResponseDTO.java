package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrganizerLoginResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String organizationName;
    private String website;
    private String description;
    private String message;
    private String token;
}
