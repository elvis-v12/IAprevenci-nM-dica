package com.skydev.backend_ia_medico.service.implementation;

import com.skydev.backend_ia_medico.persistence.entity.PatientEntity;
import com.skydev.backend_ia_medico.persistence.repository.PatientRepository;
import com.skydev.backend_ia_medico.presentation.dto.request.ConsultIARequestDTO;
import com.skydev.backend_ia_medico.service.exception.EntityNotFoundException;
import com.skydev.backend_ia_medico.service.interfaces.PdfReportService;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.util.JRLoader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PdfReportServiceImpl implements PdfReportService {

    private final PatientRepository patientRepository;

    @Override
    public File generatePDF(Long userId, List<ConsultIARequestDTO> lstConsultIARequestDTO) throws JRException, IOException {

        PatientEntity patientEntity = this.patientRepository
                .findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado"));

        try (InputStream companyLogo = getClass().getResourceAsStream("/reports/img/company-logo.png");
             InputStream gitHubLogo = getClass().getResourceAsStream("/reports/img/github-logo.png");
             InputStream gmailLogo = getClass().getResourceAsStream("/reports/img/gmail-logo.png");
             InputStream report = getClass().getResourceAsStream("/reports/MedicalReport.jasper")) {

            if (companyLogo == null || gitHubLogo == null || gmailLogo == null) {
                throw new FileNotFoundException("Una o más imágenes no se encuentran en el directorio /reports/img/");
            }

            JasperReport jasperReport = (JasperReport) JRLoader.loadObject(report);

            JRBeanCollectionDataSource dsConsultIA = new JRBeanCollectionDataSource(lstConsultIARequestDTO);

            Map<String, Object> parameters = new HashMap<>();

            parameters.put("dsConsultIA", dsConsultIA);
            parameters.put("companyLogo", companyLogo);
            parameters.put("fullName", patientEntity.getFirstName() + " " + patientEntity.getLastName());
            parameters.put("email", patientEntity.getEmail());
            parameters.put("phone", patientEntity.getPhone());
            Integer age = Period.between(patientEntity.getBirthDate(), LocalDate.now()).getYears();
            parameters.put("age", age);
            parameters.put("dni", patientEntity.getDocumentNumber());
            parameters.put("gitHubLogo", gitHubLogo);
            parameters.put("gmailLogo", gmailLogo);

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());

            byte[] arrayPdf = JasperExportManager.exportReportToPdf(jasperPrint);

            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH-mm-ss");
            String timestamp = now.format(formatter);

            File pdfFile = new File("Reporte Medico - "
                    + patientEntity.getFirstName()  + " " + patientEntity.getLastName()
                    + " - "
                    + timestamp
                    + ".pdf");

            try (FileOutputStream fos = new FileOutputStream(pdfFile)) {
                fos.write(arrayPdf);
            }

            return pdfFile;

        } catch (FileNotFoundException e) {
            throw new IOException("Error al generar el archivo PDF: " + e.getMessage());
        }

    }

}
