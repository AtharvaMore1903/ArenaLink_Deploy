package com.app.services;

import com.app.dto.LoginRequestDTO;
import com.app.dto.UnifiedLoginResponseDTO;

public interface AuthService {
    UnifiedLoginResponseDTO login(LoginRequestDTO request);
}
