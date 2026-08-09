package com.matchservice.dto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;

@Getter @Setter @NoArgsConstructor
public class ErrorResponseDTO {
    private String message;
    private String status;
    private int statusCode;
    private LocalDateTime timestamp;
    private Map<String, String> details;

    public ErrorResponseDTO(String message, String status, int statusCode) {
        this.message = message;
        this.status = status;
        this.statusCode = statusCode;
        this.timestamp = LocalDateTime.now();
    }
}
