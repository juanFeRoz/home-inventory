package com.example.home_inventory.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.example.home_inventory.models.Categoria;
import com.example.home_inventory.models.Lugar;
import com.example.home_inventory.repository.CategoriaRepository;
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

    public List<Producto> findAllLugares() {
        return productoRepository.findAll();
    }
    
    public Optional<Producto> findByNombre(String nombre) {
        return productoRepository.findByNombre(nombre);
    }

    public Producto createProducto(String nombre, String descripcion, int cantidad, int cantidadMinima, LocalDate expiracion, String nombreLugar) {
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setCantidad(cantidad);
        producto.setCantidadMinima(cantidadMinima);
        producto.setExpiracion(expiracion);
        Producto saved = productoRepository.insert(producto);

        // Persist a proper reference by loading the Lugar, adding the saved Producto, and saving the Lugar.
        if (saved.getId() != null && nombreLugar != null) {
            lugarRepositorio.findByNombre(nombreLugar).ifPresent(lugar -> {
                if (lugar.getProductos() == null) {
                    lugar.setProductos(new ArrayList<>());
                }
                lugar.getProductos().add(saved);
                lugarRepositorio.save(lugar);
            });
        }

        return saved;
    }

    private void actualizarProductoEnLugares(String productoId, Producto productoActualizado) {
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
                    lugarRepositorio.save(lugar);
                }
            }
        }
    }

    private void eliminarProductoDeLugares(String productoId) {
        List<Lugar> lugares = lugarRepositorio.findAll();
        for (Lugar lugar : lugares) {
            if (lugar.getProductos() != null) {
                boolean eliminado = lugar.getProductos().removeIf(p -> p.getId().equals(productoId));
                if (eliminado) {
                    lugarRepositorio.save(lugar);
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

            // Actualizar en lugares
            actualizarProductoEnLugares(id, actualizado);
        } else {
            productoRepository.deleteById(id);

            // Eliminar de lugares
            eliminarProductoDeLugares(id);
        }
        return true;
    }

    @Transactional
    public boolean deleteProductoCompletamente(String id) {
        Optional<Producto> opt = productoRepository.findById(id);
        if (!opt.isPresent()) {
            return false;
        }

        // Eliminar de la colección Producto
        productoRepository.deleteById(id);

        // Eliminar de todos los lugares donde esté embebido
        eliminarProductoDeLugares(id);

        return true;
    }

    public Producto asignarCategoria(String productoId, String categoriaNombre) {
        // Buscar el producto
        Optional<Producto> productoOpt = productoRepository.findById(productoId);
        if (productoOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe el producto especificado");
        }

        // Buscar la categoría
        String categoriaNormalizada = categoriaNombre.toLowerCase().trim();
        Optional<Categoria> categoriaOpt = categoriaRepository.findByNombre(categoriaNormalizada);
        if (categoriaOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe la categoría especificada");
        }

        // Asignar la categoría al producto
        Producto producto = productoOpt.get();
        producto.setCategoria(categoriaOpt.get());
        Producto productoActualizado = productoRepository.save(producto);

        // Actualizar el producto embebido en todos los lugares que lo contengan
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
                    lugarRepositorio.save(lugar);
                }
            }
        }

        return productoActualizado;
    }
}
