package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerUpdateRequestDTO {
    private String fullName;
    private String phone;
    private String organizationName;
    private String website;
    private String description;
}
