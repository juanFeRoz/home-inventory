package com.example.home_inventory.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Esta clase configura CORS a nivel de Spring MVC, que a menudo funciona mejor con proxies como Cloud Run.
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Aplica la configuración de CORS a todas las rutas (/**)
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:5173",
                        "https://eighth-codex-473914-g0.web.app",
                        "https://eighth-codex-473914-g0.firebaseapp.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*") // Permitir todos los encabezados, incluyendo Authorization, Content-Type, etc.
                .allowCredentials(true) // Permitir el envío de cookies o encabezados de autenticación
                .maxAge(3600); // 1 hora de caché para la solicitud preflight
    }
}