package com.skydev.backend_ia_medico.presentation.advice;

import com.skydev.backend_ia_medico.presentation.advice.response.ErrorResponse;
import com.skydev.backend_ia_medico.service.exception.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.List;

@ControllerAdvice
public class GlobalControllerAdvice {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException enfe) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                        "RECURSO NO ENCONTRADO",
                        HttpStatus.NOT_FOUND.value(),
                        List.of(),
                        LocalDateTime.now()
                ));
    }

}
