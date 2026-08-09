package com.app.services;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.app.dto.*;

public interface AdminService {
    String registerAdmin(AdminRegistrationRequestDTO request);
    AdminLoginResponseDTO loginAdmin(LoginRequestDTO request);
    Page<AdminResponseDTO> getAllAdmins(Pageable pageable);
}
