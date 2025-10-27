package com.example.home_inventory.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.home_inventory.models.Lugar;
import com.example.home_inventory.repository.LugarRepositorio;

@Service
public class LugarService {
    @Autowired
    private LugarRepositorio lugarRepositorio;

    public List<Lugar> findAllLugares() {
        return lugarRepositorio.findAll();
    }
    
    public Optional<Lugar> findByNombre(String nombre) {
        return lugarRepositorio.findByNombre(nombre);
    }
    
    public Lugar createLugar(String nombre, String descripcion) {
        Lugar lugar = new Lugar();
        lugar.setNombre(nombre);
        lugar.setDescripcion(descripcion);
        lugarRepositorio.insert(lugar);
        return lugar;
    }
}
