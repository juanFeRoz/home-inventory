package com.example.home_inventory.models;

import java.time.LocalDateTime;
import java.util.List;

public record GrupoFamiliarDTO(
        String id,
        String nombre,
        String descripcion,
        LocalDateTime fechaCreacion,
        List<UserSimpleDTO> miembros,
        String creadorId
) {
}
