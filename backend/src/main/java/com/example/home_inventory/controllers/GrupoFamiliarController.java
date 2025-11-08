package com.example.home_inventory.controllers;

import com.example.home_inventory.models.GrupoFamiliarDTO;
import com.example.home_inventory.models.ListaCompra;
import com.example.home_inventory.models.User;
import com.example.home_inventory.repository.UserRepository;
import com.example.home_inventory.services.GrupoFamiliarService;
import com.example.home_inventory.services.TokenService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/grupos-familiares")
public class GrupoFamiliarController {

    @Autowired
    private GrupoFamiliarService grupoFamiliarService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> crearGrupo(
            @RequestBody CrearGrupoRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extraer el token del header
            String token = authHeader.substring(7); // Quita "Bearer "

            // Parsear el token JWT para obtener los claims
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            // Extraer el username del claim
            String username = claims.getStringClaim("username");

            GrupoFamiliarDTO grupo = grupoFamiliarService.crearGrupo(
                    request.nombre(),
                    request.descripcion(),
                    username
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(grupo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{grupoId}")
    public ResponseEntity<?> eliminarGrupo(
            @PathVariable String grupoId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            String username = claims.getStringClaim("username");

            User usuario = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            grupoFamiliarService.eliminarGrupo(grupoId, usuario.getId());
            return ResponseEntity.ok("Grupo eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{grupoId}/miembros")
    public ResponseEntity<?> agregarMiembro(
            @PathVariable String grupoId,
            @RequestBody AgregarMiembroRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            String username = claims.getStringClaim("username");

            User solicitante = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            GrupoFamiliarDTO grupo = grupoFamiliarService.agregarMiembro(
                    grupoId,
                    request.username(),
                    solicitante.getId()
            );
            return ResponseEntity.ok(grupo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{grupoId}/miembros/{username}")
    public ResponseEntity<?> eliminarMiembro(
            @PathVariable String grupoId,
            @PathVariable String username,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            String usernameToken = jwt.getClaimAsString("username");

            User solicitante = userRepository.findByUsername(usernameToken)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            GrupoFamiliarDTO grupo = grupoFamiliarService.eliminarMiembro(
                    grupoId,
                    username,
                    solicitante.getId()
            );
            return ResponseEntity.ok(grupo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/mi-grupo")
    public ResponseEntity<String> obtenerMiGrupo(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            String username = claims.getStringClaim("username");

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            String grupoId = grupoFamiliarService.getGrupoFamiliarIdByUser(user.getId());

            return ResponseEntity.ok(grupoId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    private record CrearGrupoRequest(String nombre, String descripcion) {}
    private record AgregarMiembroRequest(String username) {}
}
