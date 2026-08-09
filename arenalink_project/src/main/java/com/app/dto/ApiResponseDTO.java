package com.app.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponseDTO {

    private String message;
    private String status;
    private LocalDateTime timestamp;

    public ApiResponseDTO(String message, String status) {
        this.message = message;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }
}