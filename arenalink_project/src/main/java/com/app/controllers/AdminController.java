package com.app.controllers;

import com.app.dto.AdminLoginResponseDTO;
import com.app.dto.AdminRegistrationRequestDTO;
import com.app.dto.AdminResponseDTO;
import com.app.dto.ApiResponseDTO;
import com.app.dto.LoginRequestDTO;
import com.app.services.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO> registerAdmin(@Valid @RequestBody AdminRegistrationRequestDTO request) {
        String msg = adminService.registerAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO(msg, "SUCCESS"));
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponseDTO> loginAdmin(@Valid @RequestBody LoginRequestDTO request) {
        AdminLoginResponseDTO response = adminService.loginAdmin(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<AdminResponseDTO>> getAllAdmins(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllAdmins(pageable));
    }
}
