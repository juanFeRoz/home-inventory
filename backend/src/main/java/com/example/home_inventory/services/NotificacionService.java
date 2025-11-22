package com.example.home_inventory.services;

import com.example.home_inventory.models.Notificacion;
import com.example.home_inventory.models.Producto;
import com.example.home_inventory.repository.NotificacionRepository;
import com.example.home_inventory.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private ProductoRepository productoRepository;

    /*
    @Scheduled(cron = "")
    public void verificarProductos() {
        List<Producto> productos = productoRepository.findAll();
        LocalDate hoy = LocalDate.now();
        LocalDate limiteExpiracion = hoy.plusDays(5);

        for (Producto producto : productos) {
            // Verificar cantidad mínima
            if (producto.getCantidad() < producto.getCantidadMinima()) {
                crearNotificacion(
                        producto.getId(),
                        "El producto '" + producto.getNombre() + "' tiene cantidad baja (" +
                                producto.getCantidad() + "/" + producto.getCantidadMinima() + ")",
                        "CANTIDAD_BAJA"
                );
            }

            // Verificar expiración
            if (producto.getExpiracion() != null &&
                    !producto.getExpiracion().isAfter(limiteExpiracion)) {
                crearNotificacion(
                        producto.getId(),
                        "El producto '" + producto.getNombre() + "' expira pronto (" +
                                producto.getExpiracion() + ")",
                        "EXPIRACION_PROXIMA"
                );
            }
        }
    }*/

    private void crearNotificacion(String productoId, String mensaje, String tipo) {
        Notificacion notificacion = new Notificacion();
        notificacion.setProductoId(productoId);
        notificacion.setMensaje(mensaje);
        notificacion.setTipo(tipo);
        notificacion.setFechaCreacion(LocalDateTime.now());
        notificacion.setLeida(false);
        notificacionRepository.save(notificacion);
    }

    public List<Notificacion> obtenerNotificacionesNoLeidas() {
        return notificacionRepository.findByLeidaFalse();
    }

    public void marcarComoLeida(String id) {
        notificacionRepository.findById(id).ifPresent(notificacion -> {
            notificacion.setLeida(true);
            notificacionRepository.save(notificacion);
        });
    }

    public void marcarTodasComoLeidas() {
        List<Notificacion> notificacionesNoLeidas = notificacionRepository.findByLeidaFalse();
        notificacionesNoLeidas.forEach(notificacion -> {
            notificacion.setLeida(true);
            notificacionRepository.save(notificacion);
        });
    }
}
