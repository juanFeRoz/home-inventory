package com.example.home_inventory.repository;

import com.example.home_inventory.models.GrupoFamiliar;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GrupoFamiliarRepository extends MongoRepository<GrupoFamiliar, String> {
    Optional<GrupoFamiliar> findByNombre(String nombre);
    Optional<GrupoFamiliar> findByMiembrosContaining(String usuarioId);

    @Query("{ 'miembros.id': ?0 }")
    Optional<GrupoFamiliar> findByMiembroId(String userId);

}
