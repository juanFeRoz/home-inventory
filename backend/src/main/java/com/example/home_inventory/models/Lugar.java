package com.example.home_inventory.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "Lugar")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Lugar {

    @Id
    private String id;

    private String nombre;

    private String descripcion;

    private LocalDateTime fechaCreacion;

    private String grupoFamiliarId;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private List<Producto> productos = new ArrayList<>();

    private String creadoPor;
}
