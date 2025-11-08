package com.example.home_inventory.services;

import com.example.home_inventory.models.ListaCompra;
import com.example.home_inventory.repository.GrupoFamiliarRepository;
import com.example.home_inventory.repository.ListaCompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ListaCompraService {

    @Autowired
    private ListaCompraRepository listaCompraRepository;

    @Autowired
    private GrupoFamiliarRepository grupoFamiliarRepository;

    @Autowired
    private GrupoFamiliarService grupoFamiliarService;

    public ListaCompra crearLista(ListaCompra listaCompra, String userId) {
        // Obtener automáticamente el grupo familiar del usuario
        String grupoFamiliarId = grupoFamiliarService.getGrupoFamiliarIdByUser(userId);

        listaCompra.setGrupoFamiliarId(grupoFamiliarId);
        listaCompra.setFechaCreacion(LocalDateTime.now());
        if (listaCompra.getProductosLista() == null) {
            listaCompra.setProductosLista(new ArrayList<>());
        }
        ListaCompra saved = listaCompraRepository.save(listaCompra);

        // Agregar la lista embebida al grupo familiar
        if (saved.getId() != null && grupoFamiliarId != null) {
            grupoFamiliarRepository.findById(grupoFamiliarId).ifPresent(grupo -> {
                if (grupo.getListasCompra() == null) {
                    grupo.setListasCompra(new ArrayList<>());
                }
                grupo.getListasCompra().add(saved);
                grupoFamiliarRepository.save(grupo);
            });
        }

        return saved;
    }

    public List<ListaCompra> obtenerListasPorGrupo(String grupoFamiliarId) {
        return listaCompraRepository.findByGrupoFamiliarId(grupoFamiliarId);
    }

    public Optional<ListaCompra> obtenerListaPorId(String id) {
        return listaCompraRepository.findById(id);
    }

    public void eliminarLista(String id) {
        ListaCompra lista = listaCompraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));

        String grupoFamiliarId = lista.getGrupoFamiliarId();

        // Eliminar de la colección principal
        listaCompraRepository.deleteById(id);

        // Eliminar de la lista embebida en el grupo familiar
        if (grupoFamiliarId != null) {
            grupoFamiliarRepository.findById(grupoFamiliarId).ifPresent(grupo -> {
                if (grupo.getListasCompra() != null) {
                    grupo.getListasCompra().removeIf(l -> l.getId().equals(id));
                    grupoFamiliarRepository.save(grupo);
                }
            });
        }
    }

    public ListaCompra marcarProductoComprado(String listaId, String nombreProducto, boolean comprado) {
        Optional<ListaCompra> listaOpt = listaCompraRepository.findById(listaId);
        if (listaOpt.isPresent()) {
            ListaCompra lista = listaOpt.get();
            lista.getProductosLista().stream()
                    .filter(p -> p.getNombre().equals(nombreProducto))
                    .findFirst()
                    .ifPresent(p -> p.setComprado(comprado));
            ListaCompra saved = listaCompraRepository.save(lista);

            // Actualizar en el grupo familiar
            actualizarListaEnGrupoFamiliar(listaId, saved);

            return saved;
        }
        throw new RuntimeException("Lista no encontrada");
    }

    public ListaCompra agregarProductoLista(String listaId, ListaCompra.ProductoLista producto) {
        Optional<ListaCompra> listaOpt = listaCompraRepository.findById(listaId);
        if (listaOpt.isPresent()) {
            ListaCompra lista = listaOpt.get();
            if (lista.getProductosLista() == null) {
                lista.setProductosLista(new ArrayList<>());
            }
            lista.getProductosLista().add(producto);
            ListaCompra saved = listaCompraRepository.save(lista);

            // Actualizar en el grupo familiar
            actualizarListaEnGrupoFamiliar(listaId, saved);

            return saved;
        }
        throw new RuntimeException("Lista no encontrada");
    }

    public ListaCompra eliminarProductoLista(String listaId, String nombreProducto) {
        Optional<ListaCompra> listaOpt = listaCompraRepository.findById(listaId);
        if (listaOpt.isPresent()) {
            ListaCompra lista = listaOpt.get();
            lista.getProductosLista().removeIf(p -> p.getNombre().equals(nombreProducto));
            ListaCompra saved = listaCompraRepository.save(lista);

            // Actualizar en el grupo familiar
            actualizarListaEnGrupoFamiliar(listaId, saved);

            return saved;
        }
        throw new RuntimeException("Lista no encontrada");
    }

    private void actualizarListaEnGrupoFamiliar(String listaId, ListaCompra listaActualizada) {
        String grupoFamiliarId = listaActualizada.getGrupoFamiliarId();
        if (grupoFamiliarId != null) {
            grupoFamiliarRepository.findById(grupoFamiliarId).ifPresent(grupo -> {
                if (grupo.getListasCompra() != null) {
                    for (int i = 0; i < grupo.getListasCompra().size(); i++) {
                        if (grupo.getListasCompra().get(i).getId().equals(listaId)) {
                            grupo.getListasCompra().set(i, listaActualizada);
                            grupoFamiliarRepository.save(grupo);
                            break;
                        }
                    }
                }
            });
        }
    }
}
