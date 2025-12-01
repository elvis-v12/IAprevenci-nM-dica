package com.skydev.backend_ia_medico.presentation.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.skydev.backend_ia_medico.presentation.dto.request.ConsultIARequestDTO;
import com.skydev.backend_ia_medico.service.interfaces.PdfReportService;
import com.skydev.backend_ia_medico.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/report")
public class PdfReportController {

    private final PdfReportService pdfReportService;
    private final JwtUtil jwtUtil;

    @PostMapping(produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> generarPdf(
            @RequestBody List<ConsultIARequestDTO> lstConsultIARequestDTO,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION) String authHeader
    ) throws IOException, JRException {

        String token = authHeader.substring(7);
        DecodedJWT decodedJWT = jwtUtil.validateToken(token);
        Long idUser = decodedJWT.getClaim("idUser").asLong();

        File file = pdfReportService.generatePDF(idUser, lstConsultIARequestDTO);
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte.pdf")
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}