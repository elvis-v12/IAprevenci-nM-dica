package com.skydev.backend_ia_medico.presentation.dto.request;

import java.time.LocalDate;

public record PatientRegisterRequestDTO(
        String firstName,
        String lastName,
        LocalDate birthDate,
        String documentNumber,
        String email,
        String phone,
        String password
) {}
