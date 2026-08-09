package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlayerResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String username;
    private String ign;
    private Integer age;
    private String rank;
    private String country;
}
