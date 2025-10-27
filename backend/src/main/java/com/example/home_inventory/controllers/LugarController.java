package com.example.home_inventory.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.home_inventory.models.Lugar;
import com.example.home_inventory.services.LugarService;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/lugares")
public class LugarController {
    @Autowired
    private LugarService lugarService;

    @GetMapping
    public ResponseEntity<List<Lugar>> getLugares() {
        return new ResponseEntity<List<Lugar>>(lugarService.findAllLugares(), HttpStatus.OK);
    }

    @GetMapping("/{nombre}")
    public ResponseEntity<Optional<Lugar>> getLugar(@PathVariable String nombre) {
        return new ResponseEntity<Optional<Lugar>>(lugarService.findByNombre(nombre), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Lugar> createLugar(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Lugar>(
                lugarService.createLugar(payload.get("nombre"), payload.get("descripcion")),
                HttpStatus.OK);
    }
}
