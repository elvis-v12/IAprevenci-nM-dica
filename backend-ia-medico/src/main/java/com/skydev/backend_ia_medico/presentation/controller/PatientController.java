package com.skydev.backend_ia_medico.presentation.controller;

import com.skydev.backend_ia_medico.persistence.entity.PatientEntity;
import com.skydev.backend_ia_medico.presentation.dto.request.PatientLoginRequestDTO;
import com.skydev.backend_ia_medico.presentation.dto.request.PatientRegisterRequestDTO;
import com.skydev.backend_ia_medico.presentation.dto.response.PatientAuthenticateResponseDTO;
import com.skydev.backend_ia_medico.service.interfaces.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping("/register")
    public ResponseEntity<PatientAuthenticateResponseDTO> register(@RequestBody PatientRegisterRequestDTO patientRegisterRequestDTO) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.patientService.registerUser(
                        PatientEntity.builder()
                                .firstName(patientRegisterRequestDTO.firstName())
                                .lastName(patientRegisterRequestDTO.lastName())
                                .birthDate(patientRegisterRequestDTO.birthDate())
                                .documentNumber(patientRegisterRequestDTO.documentNumber())
                                .email(patientRegisterRequestDTO.email())
                                .phone(patientRegisterRequestDTO.phone())
                                .password(patientRegisterRequestDTO.password())
                                .build()
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<PatientAuthenticateResponseDTO> login(@RequestBody PatientLoginRequestDTO patientLoginRequestDTO) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(patientService.login(patientLoginRequestDTO.email(), patientLoginRequestDTO.password()));
    }

}
