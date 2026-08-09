package com.app.services;

import com.app.dto.AdminLoginResponseDTO;
import com.app.dto.AdminRegistrationRequestDTO;
import com.app.dto.AdminResponseDTO;
import com.app.dto.LoginRequestDTO;
import com.app.entities.Admin;
import com.app.entities.User;
import com.app.entities.UserRole;
import com.app.exceptions.DuplicateResourceException;
import com.app.exceptions.InvalidCredentialsException;
import com.app.exceptions.ResourceNotFoundException;
import com.app.exceptions.UnauthorizedException;
import com.app.repositories.AdminRepository;
import com.app.repositories.UserRepository;
import com.app.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public String registerAdmin(AdminRegistrationRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User with email " + request.getEmail() + " already exists");
        }
        
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(UserRole.ROLE_ADMIN);
        
        userRepository.save(user);

        Admin admin = new Admin();
        admin.setUser(user);
        admin.setDesignation(request.getDesignation());
        
        adminRepository.save(admin);
        
        return "Admin registered successfully";
    }

    @Override
    public AdminLoginResponseDTO loginAdmin(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid Email or Password"));
                
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid Email or Password");
        }
        
        if (user.getRole() != UserRole.ROLE_ADMIN) {
            throw new UnauthorizedException("This email is not registered as an admin");
        }
        
        Admin admin = adminRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin profile not found"));
                
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        
        return new AdminLoginResponseDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                admin.getDesignation(),
                "Admin Logged In Successfully",
                token
        );
    }

    @Override
    public Page<AdminResponseDTO> getAllAdmins(Pageable pageable) {
        return adminRepository.findAll(pageable)
                .map(admin -> new AdminResponseDTO(
                        admin.getId(),
                        admin.getUser().getFullName(),
                        admin.getUser().getEmail(),
                        admin.getUser().getPhone(),
                        admin.getDesignation()
                ));
    }
}
