package com.example.home_inventory.Producto;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
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
