package com.example.home_inventory.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "ListaCompra")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListaCompra {

    @Id
    private String id;

    private String nombre;

    private String descripcion;

    private LocalDateTime fechaCreacion;

    private String grupoFamiliarId;

    private List<ProductoLista> productosLista = new ArrayList<>();

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductoLista {
        private String nombre;
        private String cantidad;
        private String unidad;
        private boolean comprado;
    }
}
