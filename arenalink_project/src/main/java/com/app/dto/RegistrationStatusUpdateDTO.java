package com.app.dto;

import jakarta.validation.constraints.NotNull;
import com.app.entities.RegistrationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationStatusUpdateDTO {
    @NotNull
    private RegistrationStatus status;
}
