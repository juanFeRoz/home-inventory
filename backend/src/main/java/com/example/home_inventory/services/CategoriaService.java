package com.example.home_inventory.services;

import com.example.home_inventory.models.Categoria;
import com.example.home_inventory.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public Categoria crearCategoria(String nombre, String descripcion) {
        String nombreNormalizado = nombre.toLowerCase().trim();

        Optional<Categoria> existente = categoriaRepository.findByNombre(nombreNormalizado);
        if (existente.isPresent()) {
            throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(nombreNormalizado);
        categoria.setDescripcion(descripcion);

        return categoriaRepository.save(categoria);
    }

    public List<Categoria> obtenerTodasLasCategorias() {
        return categoriaRepository.findAll();
    }

    public void eliminarCategoriaPorNombre(String nombre) {
        String nombreNormalizado = nombre.toLowerCase().trim();

        Optional<Categoria> categoria = categoriaRepository.findByNombre(nombreNormalizado);
        if (categoria.isEmpty()) {
            throw new IllegalArgumentException("No existe una categoría con ese nombre");
        }

        categoriaRepository.delete(categoria.get());
    }
}
