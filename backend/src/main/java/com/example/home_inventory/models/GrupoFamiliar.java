package com.example.home_inventory.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "GrupoFamiliar")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GrupoFamiliar {

    @Id
    private String id;

    private String nombre;

    private String descripcion;

    private LocalDateTime fechaCreacion;

    private List<MiembroInfo> miembros = new ArrayList<>();

    private String creadorId;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private List<Lugar> lugares = new ArrayList<>();

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MiembroInfo {
        private String id;
        private String username;
        private String email;
    }
}
