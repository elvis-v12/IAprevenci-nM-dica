package com.skydev.backend_ia_medico.presentation.dto.response;

import com.skydev.backend_ia_medico.persistence.entity.PatientEntity;

public record PatientAuthenticateResponseDTO (
        String auth,
        PatientEntity user,
        String jwtToken
) {

}
