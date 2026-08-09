package com.matchservice.dto;
import lombok.*;
import java.time.LocalDateTime;

@Getter @AllArgsConstructor
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
