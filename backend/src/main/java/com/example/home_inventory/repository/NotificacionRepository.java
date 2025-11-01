package com.example.home_inventory.repository;

import com.example.home_inventory.models.Notificacion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends MongoRepository<Notificacion,String> {
    List<Notificacion> findByLeidaFalse();
}
