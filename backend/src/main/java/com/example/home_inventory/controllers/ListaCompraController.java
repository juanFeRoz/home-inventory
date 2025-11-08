package com.example.home_inventory.controllers;

import com.example.home_inventory.models.ListaCompra;
import com.example.home_inventory.models.User;
import com.example.home_inventory.repository.UserRepository;
import com.example.home_inventory.services.ListaCompraService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/listas-compra")
public class ListaCompraController {

    @Autowired
    private ListaCompraService listaCompraService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> crearLista(
            @RequestBody ListaCompra listaCompra,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extraer el token del header
            String token = authHeader.substring(7);

            // Parsear el token JWT para obtener los claims
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            // Extraer el username del claim
            String username = claims.getStringClaim("username");

            // Obtener el userId del usuario autenticado
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            ListaCompra lista = listaCompraService.crearLista(listaCompra, user.getId());
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/grupo/{grupoFamiliarId}")
    public ResponseEntity<List<ListaCompra>> obtenerListasPorGrupo(@PathVariable String grupoFamiliarId) {
        try {
            List<ListaCompra> listas = listaCompraService.obtenerListasPorGrupo(grupoFamiliarId);
            return ResponseEntity.ok(listas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListaCompra> obtenerListaPorId(@PathVariable String id) {
        return listaCompraService.obtenerListaPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLista(@PathVariable String id) {
        try {
            listaCompraService.eliminarLista(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{listaId}/productos")
    public ResponseEntity<ListaCompra> agregarProducto(
            @PathVariable String listaId,
            @RequestBody ListaCompra.ProductoLista producto) {
        try {
            ListaCompra lista = listaCompraService.agregarProductoLista(listaId, producto);
            return ResponseEntity.ok(lista);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{listaId}/productos/{nombreProducto}")
    public ResponseEntity<ListaCompra> eliminarProducto(
            @PathVariable String listaId,
            @PathVariable String nombreProducto) {
        try {
            ListaCompra lista = listaCompraService.eliminarProductoLista(listaId, nombreProducto);
            return ResponseEntity.ok(lista);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{listaId}/productos/{nombreProducto}/comprado")
    public ResponseEntity<ListaCompra> marcarProductoComprado(
            @PathVariable String listaId,
            @PathVariable String nombreProducto,
            @RequestBody MarcarCompradoRequest request) {
        try {
            ListaCompra lista = listaCompraService.marcarProductoComprado(
                    listaId,
                    nombreProducto,
                    request.isComprado()
            );
            return ResponseEntity.ok(lista);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrearListaRequest{
        private String nombre;
        private String descripcion;
        private String grupoFamiliarId;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MarcarCompradoRequest{
        private boolean comprado;

        public boolean isComprado() {
            return comprado;
        }
    }
}
