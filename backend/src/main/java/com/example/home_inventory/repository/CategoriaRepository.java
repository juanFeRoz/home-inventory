package com.example.home_inventory.repository;

import com.example.home_inventory.models.Categoria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriaRepository extends MongoRepository<Categoria, String> {
    Optional<Categoria> findByNombre(@Param("nombre") String nombre);
}
