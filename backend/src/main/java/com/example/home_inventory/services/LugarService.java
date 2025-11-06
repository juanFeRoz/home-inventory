package com.example.home_inventory.services;

import java.time.LocalDateTime;
import java.util.List;

import com.example.home_inventory.models.Producto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.home_inventory.models.Lugar;
import com.example.home_inventory.repository.LugarRepository;

@Service
public class LugarService {

    @Autowired
    private LugarRepository lugarRepository;

    public Lugar crearLugar(String nombre, String descripcion, String grupoFamiliarId, String userId) {
        Lugar lugar = new Lugar();
        lugar.setNombre(nombre);
        lugar.setDescripcion(descripcion);
        lugar.setGrupoFamiliarId(grupoFamiliarId);
        lugar.setCreadoPor(userId);
        lugar.setFechaCreacion(LocalDateTime.now());
        return lugarRepository.save(lugar);
    }

    public void eliminarLugar(String lugarId) {
        lugarRepository.deleteById(lugarId);
    }

    public List<Lugar> obtenerLugaresPorGrupo(String grupoFamiliarId) {
        return lugarRepository.findByGrupoFamiliarId(grupoFamiliarId);
    }

    public Lugar obtenerLugarPorId(String lugarId) {
        return lugarRepository.findById(lugarId)
                .orElseThrow(() -> new RuntimeException("Lugar no encontrado"));
    }

    public List<Producto> obtenerProductos(String lugarId) {
        Lugar lugar = lugarRepository.findById(lugarId)
                .orElseThrow(() -> new RuntimeException("Lugar no encontrado"));
        return lugar.getProductos();
    }
}
