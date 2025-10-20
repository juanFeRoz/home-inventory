package com.example.home_inventory.services;


import com.example.home_inventory.config.JwtConfig;
import com.example.home_inventory.models.User;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

@Service
@AllArgsConstructor
public class TokenService {

    private final JwtConfig jwtConfig;


    public String generateToken(Authentication authentication) {
        // header + payload/claims + signature
        var header = new JWSHeader.Builder(jwtConfig.getAlgorithm())
                .type(JOSEObjectType.JWT)
                .build();
        Instant now = Instant.now();
        var roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        var builder = new JWTClaimsSet.Builder()
                .issuer("HomeStock")
                .issueTime(Date.from(now))
                .expirationTime(Date.from(now.plus(1, java.time.temporal.ChronoUnit.HOURS)));
        builder.claim("roles", roles);
        var user = (User) authentication.getPrincipal();
        builder.claim("username", authentication.getName());
        builder.claim("email", user.getEmail());
        builder.claim("id",user.getId().toString());
        var claims = builder.build();

        var key = jwtConfig.getSecretKey();

        var jwt = new SignedJWT(header, claims);

        try {
            var signer = new MACSigner(key);
            jwt.sign(signer);
        } catch (JOSEException e) {
            throw new RuntimeException("Error generating JWT",e);
        }
        return jwt.serialize();
    }
}
