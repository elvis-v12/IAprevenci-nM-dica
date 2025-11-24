package com.skydev.backend_ia_medico.presentation.advice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skydev.backend_ia_medico.presentation.advice.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPointHandler implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {

        String errorMessage = switch (authException) {
            case UsernameNotFoundException usernameNotFoundException -> "USUARIO NO ENCONTRADO";
            case BadCredentialsException badCredentialsException -> "CREDENCIALES INCORRECTAS";
            case null, default -> authException.getMessage();
        };

        ErrorResponse errorResponse = new ErrorResponse(
                "NO AUTORIZADO",
                HttpStatus.UNAUTHORIZED.value(),
                List.of(errorMessage),
                LocalDateTime.now()
        );

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }

}