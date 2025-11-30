package com.skydev.backend_ia_medico.presentation.dto.request;

public record ConsultIARequestDTO(
        String title,
        String userMsg,
        String risk,
        String respIA,
        String recommendationIA
) {
    public String getUserMsg() {
        return userMsg;
    }

    public String getTitle() {
        return title;
    }

    public String getRisk() {
        return risk;
    }

    public String getRespIA() {
        return respIA;
    }

    public String getRecommendationIA() {
        return recommendationIA;
    }
}

