package com.app.services;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dto.*;
import com.app.entities.Organizer;
import com.app.entities.User;
import com.app.entities.UserRole;
import com.app.exceptions.DuplicateResourceException;
import com.app.exceptions.InvalidCredentialsException;
import com.app.exceptions.ResourceNotFoundException;
import com.app.exceptions.UnauthorizedException;
import com.app.repositories.OrganizerRepository;
import com.app.repositories.UserRepository;
import com.app.security.JwtUtils;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class OrganizerServiceImpl implements OrganizerService {

    private final UserRepository userRepository;
    private final OrganizerRepository organizerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public String registerOrganizer(OrganizerRegistrationRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered!");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(UserRole.ROLE_ORGANIZER);

        Organizer organizer = new Organizer();
        organizer.setUser(user);
        organizer.setOrganizationName(request.getOrganizationName());
        organizer.setWebsite(request.getWebsite());
        organizer.setDescription(request.getDescription());

        organizerRepository.save(organizer);
        return "Organizer registered successfully!";
    }

    @Override
    public OrganizerLoginResponseDTO loginOrganizer(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password!");
        }

        if (user.getRole() != UserRole.ROLE_ORGANIZER) {
            throw new UnauthorizedException("Unauthorized access: User is not an organizer!");
        }

        Organizer organizer = organizerRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Organizer details not found!"));

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return new OrganizerLoginResponseDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                organizer.getOrganizationName(),
                organizer.getWebsite(),
                organizer.getDescription(),
                "Login successful!",
                token
        );
    }

    @Override
    public Page<OrganizerResponseDTO> getAllOrganizers(Pageable pageable) {
        return organizerRepository.findAll(pageable)
                .map(this::mapToOrganizerResponseDTO);
    }

    @Override
    public OrganizerResponseDTO getOrganizerById(Long id) {
        Organizer organizer = organizerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found with id: " + id));
        return mapToOrganizerResponseDTO(organizer);
    }

    @Override
    public String updateOrganizer(Long id, OrganizerUpdateRequestDTO request) {
        Organizer organizer = organizerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found with id: " + id));
        
        User user = organizer.getUser();

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        
        if (request.getOrganizationName() != null) organizer.setOrganizationName(request.getOrganizationName());
        if (request.getWebsite() != null) organizer.setWebsite(request.getWebsite());
        if (request.getDescription() != null) organizer.setDescription(request.getDescription());

        organizerRepository.save(organizer);
        return "Organizer updated successfully!";
    }

    @Override
    public String deleteOrganizer(Long id) {
        Organizer organizer = organizerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found with id: " + id));
        organizerRepository.delete(organizer);
        userRepository.delete(organizer.getUser());
        return "Organizer deleted successfully!";
    }

    private OrganizerResponseDTO mapToOrganizerResponseDTO(Organizer organizer) {
        User user = organizer.getUser();
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
}