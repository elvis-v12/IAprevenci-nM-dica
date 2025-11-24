package com.skydev.backend_ia_medico.service.interfaces;

import com.skydev.backend_ia_medico.persistence.entity.PatientEntity;
import com.skydev.backend_ia_medico.presentation.dto.response.PatientAuthenticateResponseDTO;

public interface PatientService {

    PatientAuthenticateResponseDTO registerUser(PatientEntity patientEntity);
    PatientAuthenticateResponseDTO login(String email, String password);

}
