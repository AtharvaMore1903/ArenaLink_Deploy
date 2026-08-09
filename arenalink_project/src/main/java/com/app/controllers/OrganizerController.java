package com.app.controllers;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.dto.*;
import com.app.services.OrganizerService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/organizer")
@RequiredArgsConstructor
public class OrganizerController {

    private final OrganizerService organizerService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO> registerOrganizer(@Valid @RequestBody OrganizerRegistrationRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDTO(organizerService.registerOrganizer(request), "SUCCESS"));
    }

    @PostMapping("/login")
    public ResponseEntity<OrganizerLoginResponseDTO> loginOrganizer(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(organizerService.loginOrganizer(request));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<OrganizerResponseDTO>> getAllOrganizers(Pageable pageable) {
        return ResponseEntity.ok(organizerService.getAllOrganizers(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganizerResponseDTO> getOrganizerById(@PathVariable Long id) {
        return ResponseEntity.ok(organizerService.getOrganizerById(id));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponseDTO> updateOrganizer(@PathVariable Long id, @Valid @RequestBody OrganizerUpdateRequestDTO request) {
        return ResponseEntity.ok(new ApiResponseDTO(organizerService.updateOrganizer(id, request), "SUCCESS"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO> deleteOrganizer(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponseDTO(organizerService.deleteOrganizer(id), "SUCCESS"));
    }
}