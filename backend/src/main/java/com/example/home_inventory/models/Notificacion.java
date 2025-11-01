package com.example.home_inventory.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "Notificacion")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notificacion {

    @Id
    private String id;

    private String productoId;

    private String mensaje;

    private String tipo; // "CANTIDAD_BAJA" o "EXPIRACION_PROXIMA"

    private LocalDateTime fechaCreacion;

    private boolean leida;
}
