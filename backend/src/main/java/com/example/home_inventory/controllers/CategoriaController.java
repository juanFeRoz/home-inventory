package com.example.home_inventory.controllers;

import com.example.home_inventory.models.Categoria;
import com.example.home_inventory.services.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @PostMapping
    public ResponseEntity<?> crearCategoria(@RequestBody Map<String, String> request) {
        try {
            String nombre = request.get("nombre");
            String descripcion = request.get("descripcion");

            Categoria categoria = categoriaService.crearCategoria(nombre, descripcion);
            return ResponseEntity.status(HttpStatus.CREATED).body(categoria);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Categoria>> obtenerTodasLasCategorias() {
        List<Categoria> categorias = categoriaService.obtenerTodasLasCategorias();
        return ResponseEntity.ok(categorias);
    }

    @DeleteMapping("/{nombre}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable String nombre) {
        try {
            categoriaService.eliminarCategoriaPorNombre(nombre);
            return ResponseEntity.ok("Categoría eliminada correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
