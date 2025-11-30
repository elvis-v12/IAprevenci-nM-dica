package com.skydev.backend_ia_medico.service.implementation;

import com.skydev.backend_ia_medico.persistence.entity.PatientEntity;
import com.skydev.backend_ia_medico.persistence.repository.PatientRepository;
import com.skydev.backend_ia_medico.service.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements  UserDetailsService{

    private final PatientRepository patientRepository;
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        PatientEntity patientEntity = this.patientRepository
                .findByEmail(username)
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado"));

        List<SimpleGrantedAuthority> listAuthority = new ArrayList<>();

        return new User(patientEntity.getEmail(),
                patientEntity.getPassword(),
                true,
                true,
                true,
                true,
                listAuthority);
    }

}
