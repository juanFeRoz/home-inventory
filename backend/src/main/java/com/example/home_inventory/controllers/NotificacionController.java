package com.example.home_inventory.controllers;

import com.example.home_inventory.models.Notificacion;
import com.example.home_inventory.services.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @GetMapping
    public ResponseEntity<List<Notificacion>> obtenerNotificaciones() {
        return ResponseEntity.ok(notificacionService.obtenerNotificacionesNoLeidas());
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<String> marcarComoLeida(@PathVariable String id) {
        notificacionService.marcarComoLeida(id);
        return ResponseEntity.ok("Notificación marcada como leída");
    }

    @PutMapping("/leer-todas")
    public ResponseEntity<String> marcarTodasComoLeidas() {
        notificacionService.marcarTodasComoLeidas();
        return ResponseEntity.ok("Todas las notificaciones han sido marcadas como leídas");
    }
}
