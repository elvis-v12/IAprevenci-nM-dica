package com.skydev.backend_ia_medico.persistence.repository;

import com.skydev.backend_ia_medico.persistence.entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<PatientEntity, Long> {

    Optional<PatientEntity> findByEmailAndPassword(String email, String password);
    Optional<PatientEntity> findByEmail(String email);

}
