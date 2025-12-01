package com.skydev.backend_ia_medico.service.implementation;

import com.skydev.backend_ia_medico.persistence.entity.PatientEntity;
import com.skydev.backend_ia_medico.persistence.repository.PatientRepository;
import com.skydev.backend_ia_medico.presentation.dto.response.PatientAuthenticateResponseDTO;
import com.skydev.backend_ia_medico.service.exception.EntityNotFoundException;
import com.skydev.backend_ia_medico.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.*;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class PatientServiceImplTest {

    private PatientRepository patientRepository;
    private UserDetailsService userDetailsService;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;

    private PatientServiceImpl service;

    @BeforeEach
    void setup() {
        patientRepository = mock(PatientRepository.class);
        userDetailsService = mock(UserDetailsService.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtUtil = mock(JwtUtil.class);

        service = new PatientServiceImpl(
                patientRepository,
                userDetailsService,
                passwordEncoder,
                jwtUtil
        );
    }

    // ----------------------------------------------------
    // REGISTER USER
    // ----------------------------------------------------

    @Test
    void registerUser_success() {

        // GIVEN
        PatientEntity patient = new PatientEntity();
        patient.setEmail("a@mail.com");
        patient.setPassword("123");
        patient.setNuIdPatient(10L);

        when(passwordEncoder.encode("123")).thenReturn("ENCODED");
        when(jwtUtil.createToken(any(), eq(10L), eq("a@mail.com"))).thenReturn("TOKEN123");

        // WHEN
        PatientAuthenticateResponseDTO response = service.registerUser(patient);

        // THEN
        assertThat(response.auth()).isEqualTo("REGISTRO EXITOSO");
        assertThat(response.user().getPassword()).isEqualTo("ENCODED");
        assertThat(response.jwtToken()).isEqualTo("TOKEN123");

        ArgumentCaptor<PatientEntity> captor = ArgumentCaptor.forClass(PatientEntity.class);
        verify(patientRepository).save(captor.capture());
        assertThat(captor.getValue().getPassword()).isEqualTo("ENCODED");
    }

    // ----------------------------------------------------
    // LOGIN
    // ----------------------------------------------------

    @Test
    void login_success() {

        // GIVEN
        String email = "test@mail.com";
        String password = "123";

        PatientEntity patient = new PatientEntity();
        patient.setEmail(email);
        patient.setNuIdPatient(99L);

        UserDetails userDetails =
                User.withUsername(email)
                        .password("ENCODED")
                        .authorities("ROLE_USER")
                        .build();

        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(passwordEncoder.matches(password, "ENCODED")).thenReturn(true);
        when(patientRepository.findByEmail(email)).thenReturn(Optional.of(patient));
        when(jwtUtil.createToken(any(Authentication.class), eq(99L), eq(email)))
                .thenReturn("TOKEN_LOGIN");

        // WHEN
        PatientAuthenticateResponseDTO response = service.login(email, password);

        // THEN
        assertThat(response.auth()).isEqualTo("LOGIN EXITOSO");
        assertThat(response.user()).isEqualTo(patient);
        assertThat(response.jwtToken()).isEqualTo("TOKEN_LOGIN");
    }

    @Test
    void login_patientNotFound_throwException() {

        // GIVEN
        String email = "no@mail.com";

        UserDetails userDetails =
                User.withUsername(email).password("ENCODED").authorities("ROLE_USER").build();

        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(passwordEncoder.matches(any(), any())).thenReturn(true);
        when(patientRepository.findByEmail(email)).thenReturn(Optional.empty());

        // WHEN + THEN
        assertThatThrownBy(() -> service.login(email, "123"))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Paciente no encontrado");
    }

    // ----------------------------------------------------
    // AUTHENTICATE
    // ----------------------------------------------------

    @Test
    void authenticate_success() {

        // GIVEN
        String email = "u@mail.com";

        UserDetails userDetails =
                User.withUsername(email)
                        .password("ENCODED_PASS")
                        .authorities("ROLE_USER")
                        .build();

        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(passwordEncoder.matches("123", "ENCODED_PASS")).thenReturn(true);

        // WHEN
        Authentication auth = service.authenticate(email, "123");

        // THEN
        assertThat(auth.getName()).isEqualTo(email);
        assertThat(auth.getAuthorities()).hasSize(1);
    }

    @Test
    void authenticate_wrongPassword_throwException() {

        // GIVEN
        String email = "wrong@mail.com";

        UserDetails userDetails =
                User.withUsername(email).password("ENCODED").authorities("ROLE_USER").build();

        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(passwordEncoder.matches("BAD", "ENCODED")).thenReturn(false);

        // WHEN + THEN
        assertThatThrownBy(() -> service.authenticate(email, "BAD"))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("CREDENCIALES INCORRECTAS");
    }

    @Test
    void login_performance_under50ms() {

        // GIVEN
        String email = "perf@mail.com";
        String password = "SPEED";

        PatientEntity patient = new PatientEntity();
        patient.setEmail(email);
        patient.setNuIdPatient(7L);

        UserDetails userDetails =
                User.withUsername(email)
                        .password("HASHED")
                        .authorities("ROLE_USER")
                        .build();

        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(passwordEncoder.matches(password, "HASHED")).thenReturn(true);
        when(patientRepository.findByEmail(email)).thenReturn(Optional.of(patient));
        when(jwtUtil.createToken(any(), eq(7L), eq(email))).thenReturn("TOKEN_FAST");

        // WHEN
        long start = System.nanoTime();

        service.login(email, password);

        long elapsedMs = (System.nanoTime() - start) / 1_000_000;

        // THEN
        assertThat(elapsedMs)
                .as("El login debe ejecutarse rápido (mockeado) — si esto falla, algo pesa más de la cuenta.")
                .isLessThan(50);
    }

    @Test
    void login_concurrente_variassolicitudes_ok() throws Exception {

        String emailBase = "user@mail.com";
        String password = "PASS";

        // MOCK CONFIG BASE
        UserDetails userDetails =
                User.withUsername(emailBase)
                        .password("HASHED")
                        .authorities("ROLE_USER")
                        .build();

        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(userDetails);
        when(passwordEncoder.matches(password, "HASHED")).thenReturn(true);
        when(jwtUtil.createToken(any(), anyLong(), anyString())).thenReturn("TOKEN_CONCURRENT");

        // Cada usuario debe existir en el repositorio
        when(patientRepository.findByEmail(anyString())).thenAnswer(inv -> {
            String email = inv.getArgument(0);
            PatientEntity p = new PatientEntity();
            p.setEmail(email);
            p.setNuIdPatient(ThreadLocalRandom.current().nextLong(1, 9999));
            return Optional.of(p);
        });

        int threads = 20;
        List<Future<PatientAuthenticateResponseDTO>> futures;
        try (ExecutorService executor = Executors.newFixedThreadPool(threads)) {

            Callable<PatientAuthenticateResponseDTO> task = () ->
                    service.login(emailBase, password);

            futures = executor.invokeAll(Collections.nCopies(threads, task));

            executor.shutdown();
        }

        for (Future<PatientAuthenticateResponseDTO> f : futures) {
            PatientAuthenticateResponseDTO resp = f.get();

            assertThat(resp.auth()).isEqualTo("LOGIN EXITOSO");
            assertThat(resp.jwtToken()).isEqualTo("TOKEN_CONCURRENT");
            assertThat(resp.user().getEmail()).isEqualTo(emailBase);
        }
    }


}
