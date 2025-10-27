package com.example.home_inventory.models;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Lugar {
    @Id
    private String id;

    private String nombre;
    private String descripcion;

    @DocumentReference
    private List<Producto> productos;
}
