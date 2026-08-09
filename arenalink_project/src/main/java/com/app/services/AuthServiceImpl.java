package com.app.services;

import com.app.dto.*;
import com.app.entities.*;
import com.app.exceptions.InvalidCredentialsException;
import com.app.exceptions.ResourceNotFoundException;
import com.app.repositories.AdminRepository;
import com.app.repositories.OrganizerRepository;
import com.app.repositories.PlayerRepository;
import com.app.repositories.UserRepository;
import com.app.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;
    private final OrganizerRepository organizerRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public UnifiedLoginResponseDTO login(LoginRequestDTO request) {
        // 1. Authenticate user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // 2. Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // 3. Generate JWT token
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        // 4. Fetch role-specific profile details
        Object roleDetails = fetchRoleDetails(user);

        // 5. Build unified response
        return new UnifiedLoginResponseDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                "Login successful!",
                token,
                roleDetails
        );
    }

    private Object fetchRoleDetails(User user) {
        switch (user.getRole()) {
            case ROLE_PLAYER -> {
                Player player = playerRepository.findById(user.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Player profile not found for user: " + user.getEmail()));
                PlayerResponseDTO dto = new PlayerResponseDTO();
                dto.setId(user.getId());
                dto.setFullName(user.getFullName());
                dto.setEmail(user.getEmail());
                dto.setPhone(user.getPhone());
                dto.setUsername(player.getUsername());
                dto.setIgn(player.getIgn());
                dto.setAge(player.getAge());
                dto.setRank(player.getRank());
                dto.setCountry(player.getCountry());
                return dto;
            }
            case ROLE_ORGANIZER -> {
                Organizer organizer = organizerRepository.findById(user.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Organizer profile not found for user: " + user.getEmail()));
                OrganizerResponseDTO dto = new OrganizerResponseDTO();
                dto.setId(user.getId());
                dto.setFullName(user.getFullName());
                dto.setEmail(user.getEmail());
                dto.setPhone(user.getPhone());
                dto.setOrganizationName(organizer.getOrganizationName());
                dto.setWebsite(organizer.getWebsite());
                dto.setDescription(organizer.getDescription());
                return dto;
            }
            case ROLE_ADMIN -> {
                Admin admin = adminRepository.findByUser_Id(user.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Admin profile not found for user: " + user.getEmail()));
                AdminResponseDTO dto = new AdminResponseDTO();
                dto.setId(user.getId());
                dto.setFullName(user.getFullName());
                dto.setEmail(user.getEmail());
                dto.setPhone(user.getPhone());
                dto.setDesignation(admin.getDesignation());
                return dto;
            }
            default -> throw new InvalidCredentialsException("Unknown user role: " + user.getRole());
        }
    }
}
