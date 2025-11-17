package com.example.home_inventory.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.example.home_inventory.models.Categoria;
import com.example.home_inventory.models.Lugar;
import com.example.home_inventory.repository.CategoriaRepository;
import com.example.home_inventory.repository.GrupoFamiliarRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.example.home_inventory.models.Producto;
import com.example.home_inventory.repository.ProductoRepository;
import com.example.home_inventory.repository.LugarRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private LugarRepository lugarRepositorio;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private GrupoFamiliarRepository grupoFamiliarRepository;

    public List<Producto> findAllLugares() {
        return productoRepository.findAll();
    }
    
    public Optional<Producto> findByNombre(String nombre) {
        return productoRepository.findByNombre(nombre);
    }

    public Producto createProducto(String nombre, String descripcion, int cantidad, int cantidadMinima, LocalDate expiracion, String lugarId) {
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setCantidad(cantidad);
        producto.setCantidadMinima(cantidadMinima);
        producto.setExpiracion(expiracion);
        Producto saved = productoRepository.insert(producto);

        if (saved.getId() != null && lugarId != null) {
            lugarRepositorio.findById(lugarId).ifPresent(lugar -> {
                if (lugar.getProductos() == null) {
                    lugar.setProductos(new ArrayList<>());
                }
                lugar.getProductos().add(saved);
                Lugar lugarActualizado = lugarRepositorio.save(lugar);

                // Actualizar en GrupoFamiliar
                actualizarProductosEnLugarDeGrupoFamiliar(lugarActualizado);
            });
        }

        return saved;
    }

    private void actualizarProductosEnLugarDeGrupoFamiliar(Lugar lugarActualizado) {
        String grupoFamiliarId = lugarActualizado.getGrupoFamiliarId();
        if (grupoFamiliarId != null) {
            grupoFamiliarRepository.findById(grupoFamiliarId).ifPresent(grupo -> {
                if (grupo.getLugares() != null) {
                    for (int i = 0; i < grupo.getLugares().size(); i++) {
                        if (grupo.getLugares().get(i).getId().equals(lugarActualizado.getId())) {
                            grupo.getLugares().set(i, lugarActualizado);
                            grupoFamiliarRepository.save(grupo);
                            break;
                        }
                    }
                }
            });
        }
    }

    private void actualizarProductoEnLugaresYGrupos(String productoId, Producto productoActualizado) {
        List<Lugar> lugares = lugarRepositorio.findAll();
        for (Lugar lugar : lugares) {
            if (lugar.getProductos() != null) {
                boolean actualizado = false;
                for (int i = 0; i < lugar.getProductos().size(); i++) {
                    if (lugar.getProductos().get(i).getId().equals(productoId)) {
                        lugar.getProductos().set(i, productoActualizado);
                        actualizado = true;
                        break;
                    }
                }
                if (actualizado) {
                    Lugar lugarActualizado = lugarRepositorio.save(lugar);
                    actualizarProductosEnLugarDeGrupoFamiliar(lugarActualizado);
                }
            }
        }
    }

    private void eliminarProductoDeLugaresYGrupos(String productoId) {
        List<Lugar> lugares = lugarRepositorio.findAll();
        for (Lugar lugar : lugares) {
            if (lugar.getProductos() != null) {
                boolean eliminado = lugar.getProductos().removeIf(p -> p.getId().equals(productoId));
                if (eliminado) {
                    Lugar lugarActualizado = lugarRepositorio.save(lugar);
                    actualizarProductosEnLugarDeGrupoFamiliar(lugarActualizado);
                }
            }
        }
    }

    @Transactional
    public boolean deleteProductoById(String id) {
        Optional<Producto> opt = productoRepository.findById(id);
        if (!opt.isPresent()) {
            return false;
        }
        Producto producto = opt.get();
        if (producto.getCantidad() > 1) {
            producto.setCantidad(producto.getCantidad() - 1);
            Producto actualizado = productoRepository.save(producto);

            // Actualizar en lugares y sincronizar con GrupoFamiliar
            actualizarProductoEnLugaresYGrupos(id, actualizado);
        } else {
            productoRepository.deleteById(id);

            // Eliminar de lugares y sincronizar con GrupoFamiliar
            eliminarProductoDeLugaresYGrupos(id);
        }
        return true;
    }

    @Transactional
    public boolean deleteProductoCompletamente(String id) {
        Optional<Producto> opt = productoRepository.findById(id);
        if (!opt.isPresent()) {
            return false;
        }

        productoRepository.deleteById(id);
        eliminarProductoDeLugaresYGrupos(id);

        return true;
    }

    public Producto asignarCategoria(String productoId, String categoriaNombre) {
        Optional<Producto> productoOpt = productoRepository.findById(productoId);
        if (productoOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe el producto especificado");
        }

        String categoriaNormalizada = categoriaNombre.toLowerCase().trim();
        Optional<Categoria> categoriaOpt = categoriaRepository.findByNombre(categoriaNormalizada);
        if (categoriaOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe la categoría especificada");
        }

        Producto producto = productoOpt.get();
        producto.setCategoria(categoriaOpt.get());
        Producto productoActualizado = productoRepository.save(producto);

        actualizarProductoEnLugaresYGrupos(productoId, productoActualizado);

        return productoActualizado;
    }


}
