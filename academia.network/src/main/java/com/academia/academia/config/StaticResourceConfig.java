package com.academia.academia.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Remplace ce chemin par le tien si nécessaire
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:C:/Users/User/IdeaProjects/academia/academia-front/src/assets/uploads/");
    }
}
