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
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> createProducto(@RequestBody Map<String, String> payload) {
        if (payload == null || payload.get("nombre") == null || payload.get("nombre").isBlank()) {
            return new ResponseEntity<>("El nombre es obligatorio",HttpStatus.BAD_REQUEST);
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
            return new ResponseEntity<>("Formato de número inválido", HttpStatus.BAD_REQUEST);
        }

        //cantidad debe ser >= cantidadMinima
        if (cantidad < cantidadMinima) {
            return new ResponseEntity<>("La cantidad no puede ser menor a la cantidad mínima", HttpStatus.BAD_REQUEST);
        }

        // parse date with expected format dd-MM-yyyy (e.g. 10-10-2025)
        LocalDate expiracion = null;
        if (payload.get("expiracion") != null) {
            try {
                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                expiracion = LocalDate.parse(payload.get("expiracion"), fmt);
            } catch (DateTimeParseException e) {
                return new ResponseEntity<>("El formato de fecha dd-MM-yyyy es incorrecto", HttpStatus.BAD_REQUEST);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductoById(@PathVariable String id) {
        boolean deleted = productoService.deleteProductoById(id);

        if (deleted) {
            return new ResponseEntity<>("Producto eliminado correctamente",HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Producto no encontrado",HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/categoria")
    public ResponseEntity<?> asignarCategoria(@PathVariable String id, @RequestBody Map<String, String> request) {
        try {
            String categoriaNombre = request.get("categoria");
            Producto producto = productoService.asignarCategoria(id, categoriaNombre);
            return ResponseEntity.ok(producto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
