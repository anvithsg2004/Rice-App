package com.example.rice_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GlobalCorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")  // Allow all origins
                        .allowedMethods("*")   // Allow all methods (GET, POST, etc.)
                        .allowedHeaders("*")   // Allow all headers
                        .exposedHeaders("*")   // Expose all headers
                        .allowCredentials(false)
                        .maxAge(3600);         // 1 hour cache
            }
        };
    }
}
