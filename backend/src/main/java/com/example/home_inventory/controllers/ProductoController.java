package com.example.home_inventory.controllers;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.home_inventory.models.Producto;
import com.example.home_inventory.services.ProductoService;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {
    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<Producto>> getProductos() {
        return new ResponseEntity<List<Producto>>(productoService.findAllLugares(), HttpStatus.OK);
    }

    @GetMapping("/{nombre}")
    public ResponseEntity<Optional<Producto>> getProducto(@PathVariable String nombre) {
        return new ResponseEntity<Optional<Producto>>(productoService.findByNombre(nombre), HttpStatus.OK);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Producto> createProducto(@RequestBody Map<String, String> payload) {
        if (payload == null || payload.get("nombre") == null || payload.get("nombre").isBlank()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // parse integers safely
        int cantidad = 0;
        int cantidadMinima = 0;
        try {
            if (payload.get("cantidad") != null)
                cantidad = Integer.parseInt(payload.get("cantidad"));
            if (payload.get("cantidadMinima") != null)
                cantidadMinima = Integer.parseInt(payload.get("cantidadMinima"));
        } catch (NumberFormatException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // parse date with expected format dd-MM-yyyy (e.g. 10-10-2025)
        LocalDate expiracion = null;
        if (payload.get("expiracion") != null) {
            try {
                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                expiracion = LocalDate.parse(payload.get("expiracion"), fmt);
            } catch (DateTimeParseException e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }

        Producto created = productoService.createProducto(
                payload.get("nombre"),
                payload.get("descripcion"),
                cantidad,
                cantidadMinima,
                expiracion,
                payload.get("nombreLugar"));

        return new ResponseEntity<Producto>(created, HttpStatus.OK);
    }
}
