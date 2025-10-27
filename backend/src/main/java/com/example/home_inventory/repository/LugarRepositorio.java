package com.example.home_inventory.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.home_inventory.models.Lugar;

@Repository
public interface LugarRepositorio extends MongoRepository<Lugar, String> {
    Optional<Lugar> findByNombre(@Param("nombre") String nombre);
}
