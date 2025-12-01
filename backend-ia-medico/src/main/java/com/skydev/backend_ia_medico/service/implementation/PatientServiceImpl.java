package com.skydev.backend_ia_medico.service.implementation;

import com.skydev.backend_ia_medico.persistence.entity.PatientEntity;
import com.skydev.backend_ia_medico.persistence.repository.PatientRepository;
import com.skydev.backend_ia_medico.presentation.dto.response.PatientAuthenticateResponseDTO;
import com.skydev.backend_ia_medico.service.exception.EntityNotFoundException;
import com.skydev.backend_ia_medico.service.interfaces.PatientService;
import com.skydev.backend_ia_medico.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public PatientAuthenticateResponseDTO registerUser(PatientEntity patientEntity) {

        String passwordEncoded = passwordEncoder.encode(patientEntity.getPassword());

        patientEntity.setPassword(passwordEncoded);

        this.patientRepository.save(patientEntity);

        Authentication authentication = new UsernamePasswordAuthenticationToken(patientEntity.getEmail(), null, new ArrayList<>());

        String accessToken = jwtUtil.createToken(authentication, patientEntity.getNuIdPatient(), patientEntity.getEmail());

        return new PatientAuthenticateResponseDTO(
                "REGISTRO EXITOSO",
                patientEntity,
                accessToken
        );

    }

    @Override
    public PatientAuthenticateResponseDTO login(String email, String password) {

        Authentication authentication = authenticate(email, password);

        PatientEntity patientEntity = this.patientRepository
                .findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado"));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtUtil.createToken(authentication, patientEntity.getNuIdPatient(), patientEntity.getEmail());

        return new PatientAuthenticateResponseDTO(
                "LOGIN EXITOSO",
                patientEntity,
                accessToken
        );

    }

    public Authentication authenticate(String username, String password) {

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("CREDENCIALES INCORRECTAS");
        }

        return new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());

    }

}
