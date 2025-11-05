package com.example.home_inventory.services;

import com.example.home_inventory.models.GrupoFamiliar;
import com.example.home_inventory.models.GrupoFamiliarDTO;
import com.example.home_inventory.models.User;
import com.example.home_inventory.models.UserSimpleDTO;
import com.example.home_inventory.repository.GrupoFamiliarRepository;
import com.example.home_inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GrupoFamiliarService {

    @Autowired
    private GrupoFamiliarRepository grupoFamiliarRepository;

    @Autowired
    private UserRepository userRepository;

    private GrupoFamiliarDTO convertirADTO(GrupoFamiliar grupo) {
        // Convertir MiembroInfo a UserSimpleDTO
        List<UserSimpleDTO> miembrosConInfo = grupo.getMiembros().stream()
                .map(miembro -> new UserSimpleDTO(
                        miembro.getId(),
                        miembro.getUsername(),
                        miembro.getEmail()
                ))
                .toList();

        return new GrupoFamiliarDTO(
                grupo.getId(),
                grupo.getNombre(),
                grupo.getDescripcion(),
                grupo.getFechaCreacion(),
                miembrosConInfo,
                grupo.getCreadorId()
        );
    }

    public GrupoFamiliarDTO crearGrupo(String nombre, String descripcion, String creadorUsername) {
        if (grupoFamiliarRepository.findByNombre(nombre).isPresent()) {
            throw new RuntimeException("Ya existe un grupo con ese nombre");
        }

        var creador = userRepository.findByUsername(creadorUsername)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String creadorId = creador.getId();

        // Buscar por ID del creador en los miembros
        var gruposExistentes = grupoFamiliarRepository.findAll();
        boolean yaPertenece = gruposExistentes.stream()
                .anyMatch(g -> g.getMiembros().stream().anyMatch(m -> m.getId().equals(creadorId)));

        if (yaPertenece) {
            throw new RuntimeException("El usuario ya pertenece a un grupo familiar");
        }

        GrupoFamiliar grupo = new GrupoFamiliar();
        grupo.setNombre(nombre);
        grupo.setDescripcion(descripcion);
        grupo.setFechaCreacion(LocalDateTime.now());
        grupo.setCreadorId(creadorId);

        // Crear MiembroInfo con datos completos
        GrupoFamiliar.MiembroInfo miembroCreador = new GrupoFamiliar.MiembroInfo(
                creador.getId(),
                creador.getUsername(),
                creador.getEmail()
        );

        List<GrupoFamiliar.MiembroInfo> miembros = new ArrayList<>();
        miembros.add(miembroCreador);
        grupo.setMiembros(miembros);

        GrupoFamiliar grupoGuardado = grupoFamiliarRepository.save(grupo);
        return convertirADTO(grupoGuardado);
    }

    public void eliminarGrupo(String grupoId, String usuarioId) {
        GrupoFamiliar grupo = grupoFamiliarRepository.findById(grupoId)
                .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));

        // Validar que solo el creador puede eliminar
        if (!grupo.getCreadorId().equals(usuarioId)) {
            throw new RuntimeException("Solo el creador del grupo puede eliminarlo");
        }

        grupoFamiliarRepository.deleteById(grupoId);
    }

    public GrupoFamiliarDTO agregarMiembro(String grupoId, String username, String solicitanteId) {
        GrupoFamiliar grupo = grupoFamiliarRepository.findById(grupoId)
                .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));

        // Verificar que quien solicita pertenece al grupo (comparar por ID)
        boolean perteneceAlGrupo = grupo.getMiembros().stream()
                .anyMatch(m -> m.getId().equals(solicitanteId));

        if (!perteneceAlGrupo) {
            throw new RuntimeException("No tienes permisos para agregar miembros a este grupo");
        }

        var usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String usuarioId = usuario.getId();

        // Verificar que el usuario no está ya en el grupo
        boolean yaEsMiembro = grupo.getMiembros().stream()
                .anyMatch(m -> m.getId().equals(usuarioId));

        if (yaEsMiembro) {
            throw new RuntimeException("El usuario ya es miembro de este grupo");
        }

        // Verificar que el usuario no pertenece a otro grupo
        var gruposExistentes = grupoFamiliarRepository.findAll();
        boolean perteneceAOtroGrupo = gruposExistentes.stream()
                .anyMatch(g -> !g.getId().equals(grupoId) &&
                        g.getMiembros().stream().anyMatch(m -> m.getId().equals(usuarioId)));

        if (perteneceAOtroGrupo) {
            throw new RuntimeException("El usuario ya pertenece a otro grupo familiar");
        }

        // Crear MiembroInfo y agregarlo
        GrupoFamiliar.MiembroInfo nuevoMiembro = new GrupoFamiliar.MiembroInfo(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getEmail()
        );

        grupo.getMiembros().add(nuevoMiembro);
        GrupoFamiliar grupoActualizado = grupoFamiliarRepository.save(grupo);

        return convertirADTO(grupoActualizado);
    }

    public GrupoFamiliarDTO eliminarMiembro(String grupoId, String username, String solicitanteId) {
        GrupoFamiliar grupo = grupoFamiliarRepository.findById(grupoId)
                .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));

        // Verificar que quien solicita pertenece al grupo (comparar por ID)
        boolean perteneceAlGrupo = grupo.getMiembros().stream()
                .anyMatch(m -> m.getId().equals(solicitanteId));

        if (!perteneceAlGrupo) {
            throw new RuntimeException("No tienes permisos para eliminar miembros de este grupo");
        }

        var usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String usuarioId = usuario.getId();

        // Verificar que el usuario es miembro del grupo
        boolean esMiembro = grupo.getMiembros().stream()
                .anyMatch(m -> m.getId().equals(usuarioId));

        if (!esMiembro) {
            throw new RuntimeException("El usuario no es miembro de este grupo");
        }

        // Validar que no se elimine al creador del grupo
        if (grupo.getCreadorId().equals(usuarioId)) {
            throw new RuntimeException("No se puede eliminar al creador del grupo");
        }

        // Eliminar el miembro por ID
        grupo.getMiembros().removeIf(m -> m.getId().equals(usuarioId));
        GrupoFamiliar grupoActualizado = grupoFamiliarRepository.save(grupo);

        return convertirADTO(grupoActualizado);
    }
}
