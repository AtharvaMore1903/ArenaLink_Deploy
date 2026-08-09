package com.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerRegistrationRequestDTO {

    @NotBlank
    @Size(max = 50)
    private String fullName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$", message = "Password must be at least 8 characters long, and contain a number, a lowercase letter, an uppercase letter, and a special character")
    private String password;

    private String phone;

    @NotBlank
    private String organizationName;

    private String website;

    @Size(max = 1000)
    private String description;
}