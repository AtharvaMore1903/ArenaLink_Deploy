package com.app.dto;

import com.app.entities.UserRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminLoginResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private UserRole role;
    private String designation;
    private String message;
    private String token;
}
