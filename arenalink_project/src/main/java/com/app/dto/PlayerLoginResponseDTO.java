package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlayerLoginResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String username;
    private String ign;
    private Integer age;
    private String rank;
    private String country;
    private String message;
    private String token;
}
