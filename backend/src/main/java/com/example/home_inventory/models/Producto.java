package com.example.home_inventory.models;

import java.time.LocalDate;

import lombok.*;
import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Producto")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Producto {

    @Id
    private String id;

    private String nombre;

    private String descripcion;

    private int cantidad;

    private int cantidadMinima;

    private LocalDate expiracion;
}
