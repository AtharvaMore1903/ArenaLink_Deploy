package com.app.services;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.app.dto.*;

public interface OrganizerService {
    String registerOrganizer(OrganizerRegistrationRequestDTO request);
    OrganizerLoginResponseDTO loginOrganizer(LoginRequestDTO request);
    Page<OrganizerResponseDTO> getAllOrganizers(Pageable pageable);
    OrganizerResponseDTO getOrganizerById(Long id);
    String updateOrganizer(Long id, OrganizerUpdateRequestDTO request);
    String deleteOrganizer(Long id);
}