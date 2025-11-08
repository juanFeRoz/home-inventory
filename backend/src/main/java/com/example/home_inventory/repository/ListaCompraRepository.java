package com.example.home_inventory.repository;

import com.example.home_inventory.models.ListaCompra;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListaCompraRepository extends MongoRepository<ListaCompra, String> {
    List<ListaCompra> findByGrupoFamiliarId(String grupoFamiliarId);
}
