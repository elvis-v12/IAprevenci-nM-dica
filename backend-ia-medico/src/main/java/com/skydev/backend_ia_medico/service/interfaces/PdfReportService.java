package com.skydev.backend_ia_medico.service.interfaces;

import com.skydev.backend_ia_medico.presentation.dto.request.ConsultIARequestDTO;
import net.sf.jasperreports.engine.JRException;

import java.io.File;
import java.io.IOException;
import java.util.List;

public interface PdfReportService {

    File generatePDF(Long userId, List<ConsultIARequestDTO> lstConsultIARequestDTO) throws JRException, IOException;

}
