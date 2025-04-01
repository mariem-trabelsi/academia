package com.academia.academia.controllers;


import com.academia.academia.entities.Domain;
import com.academia.academia.entities.Article;
import com.academia.academia.services.DomainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/domains")
public class DomainController {

    @Autowired
    private DomainService domainService;

    // Créer un domaine
    @PostMapping
    public ResponseEntity<Domain> createDomain(@RequestParam String name) {
        Domain domain = domainService.createDomain(name);
        return ResponseEntity.ok(domain);
    }

    // Récupérer tous les domaines
    @GetMapping
    public ResponseEntity<List<Domain>> getAllDomains() {
        List<Domain> domains = domainService.getAllDomains();
        return ResponseEntity.ok(domains);
    }

    // Récupérer les articles d'un domaine spécifique
    @GetMapping("/{domainId}/articles")
    public ResponseEntity<List<Article>> getArticlesByDomain(@PathVariable Long domainId) {
        List<Article> articles = domainService.getArticlesByDomain(domainId);
        return ResponseEntity.ok(articles);
    }
}
