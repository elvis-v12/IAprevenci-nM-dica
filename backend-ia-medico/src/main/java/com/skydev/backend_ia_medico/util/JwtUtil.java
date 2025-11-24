package com.skydev.backend_ia_medico.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    @Value("${security.jwt.key}")
    private String privateKey;

    @Value("${security.jwt.user}")
    private String userGenerator;

    @Value("${security.jwt.expiration_minutes}")
    private long expirationMinutes;

    public String createToken(Authentication authentication, Long idUser, String emailUser){

        Algorithm algorithm = Algorithm.HMAC256(privateKey);

        String username = authentication.getPrincipal().toString();
        String authorities = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return JWT.create()
                .withIssuer(userGenerator)
                .withSubject(username)
                .withClaim("authorities", authorities)
                .withClaim("idUser", idUser)
                .withClaim("emailUser", emailUser)
                .withIssuedAt(new Date()) // Momento actual que se creo el token
                .withExpiresAt(new Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(expirationMinutes)))
                .withJWTId(UUID.randomUUID().toString())
                .withNotBefore(new Date(System.currentTimeMillis())) // Apartir de que momento ess valido
                .sign(algorithm);

    }

    public DecodedJWT validateToken(String token) throws JWTVerificationException{
        Algorithm algorithm = Algorithm.HMAC256(privateKey);
        return JWT.require(algorithm)
                .withIssuer(userGenerator)
                .build()
                .verify(token);

    }

}