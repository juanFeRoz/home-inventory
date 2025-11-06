package com.example.home_inventory.controllers;

import java.util.List;

import com.example.home_inventory.models.Producto;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.home_inventory.models.Lugar;
import com.example.home_inventory.services.LugarService;

@RestController
@RequestMapping("/api/v1/lugares")
public class LugarController {

    @Autowired
    private LugarService lugarService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Lugar> crearLugar(@RequestBody @Valid CrearLugarRequest request) {
        Lugar lugar = lugarService.crearLugar(
                request.getNombre(),
                request.getDescripcion(),
                request.getGrupoFamiliarId(),
                request.getUserId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(lugar);
    }

    @DeleteMapping("/{lugarId}")
    public ResponseEntity<Void> eliminarLugar(@PathVariable String lugarId) {
        try {
            lugarService.eliminarLugar(lugarId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/grupo/{grupoFamiliarId}")
    public ResponseEntity<List<Lugar>> obtenerLugaresPorGrupo(@PathVariable String grupoFamiliarId) {
        List<Lugar> lugares = lugarService.obtenerLugaresPorGrupo(grupoFamiliarId);
        return ResponseEntity.ok(lugares);
    }

    @GetMapping("/{lugarId}")
    public ResponseEntity<Lugar> obtenerLugarPorId(@PathVariable String lugarId) {
        try {
            Lugar lugar = lugarService.obtenerLugarPorId(lugarId);
            return ResponseEntity.ok(lugar);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{lugarId}/productos")
    public ResponseEntity<List<Producto>> obtenerProductos(@PathVariable String lugarId) {
        try {
            List<Producto> productos = lugarService.obtenerProductos(lugarId);
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CrearLugarRequest {
        private String nombre;
        private String descripcion;
        private String grupoFamiliarId;
        private String userId;
    }
}
