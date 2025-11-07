package com.example.home_inventory.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.home_inventory.models.GrupoFamiliar;
import com.example.home_inventory.models.Producto;
import com.example.home_inventory.repository.GrupoFamiliarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.home_inventory.models.Lugar;
import com.example.home_inventory.repository.LugarRepository;

@Service
public class LugarService {

    @Autowired
    private LugarRepository lugarRepository;

    @Autowired
    private GrupoFamiliarRepository grupoFamiliarRepository;


    public Lugar crearLugar(String nombre, String descripcion, String grupoFamiliarId, String userId) {
        Lugar lugar = new Lugar();
        lugar.setNombre(nombre);
        lugar.setDescripcion(descripcion);
        lugar.setGrupoFamiliarId(grupoFamiliarId);
        lugar.setCreadoPor(userId);
        lugar.setFechaCreacion(LocalDateTime.now());
        lugar.setProductos(new ArrayList<>());
        Lugar saved = lugarRepository.save(lugar);

        // Agregar el lugar embebido al grupo familiar
        if (saved.getId() != null && grupoFamiliarId != null) {
            grupoFamiliarRepository.findById(grupoFamiliarId).ifPresent(grupo -> {
                if (grupo.getLugares() == null) {
                    grupo.setLugares(new ArrayList<>());
                }
                grupo.getLugares().add(saved);
                grupoFamiliarRepository.save(grupo);
            });
        }

        return saved;
    }

    private void actualizarLugarEnGrupos(String lugarId, Lugar lugarActualizado) {
        List<GrupoFamiliar> grupos = grupoFamiliarRepository.findAll();
        for (GrupoFamiliar grupo : grupos) {
            if (grupo.getLugares() != null) {
                boolean actualizado = false;
                for (int i = 0; i < grupo.getLugares().size(); i++) {
                    if (grupo.getLugares().get(i).getId().equals(lugarId)) {
                        grupo.getLugares().set(i, lugarActualizado);
                        actualizado = true;
                        break;
                    }
                }
                if (actualizado) {
                    grupoFamiliarRepository.save(grupo);
                }
            }
        }
    }

    public void eliminarLugar(String lugarId) {
        // Primero obtener el lugar para saber su grupoFamiliarId
        Lugar lugar = lugarRepository.findById(lugarId)
                .orElseThrow(() -> new RuntimeException("Lugar no encontrado"));

        String grupoFamiliarId = lugar.getGrupoFamiliarId();

        // Eliminar el lugar de la colección principal
        lugarRepository.deleteById(lugarId);

        // Eliminar el lugar de la lista embebida en el grupo familiar
        if (grupoFamiliarId != null) {
            grupoFamiliarRepository.findById(grupoFamiliarId).ifPresent(grupo -> {
                if (grupo.getLugares() != null) {
                    grupo.getLugares().removeIf(l -> l.getId().equals(lugarId));
                    grupoFamiliarRepository.save(grupo);
                }
            });
        }
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
