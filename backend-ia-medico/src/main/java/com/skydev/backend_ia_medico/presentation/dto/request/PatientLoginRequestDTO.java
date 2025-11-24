package com.skydev.backend_ia_medico.presentation.dto.request;

public record PatientLoginRequestDTO(
        String email,
        String password
) {
}
