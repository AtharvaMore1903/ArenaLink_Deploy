package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String organizationName;
    private String website;
    private String description;
}
