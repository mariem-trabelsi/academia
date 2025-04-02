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

    @PostMapping
    public ResponseEntity<Domain> createDomain(@RequestParam String name) {
        Domain domain = domainService.createDomain(name);
        return ResponseEntity.ok(domain);
    }

    @GetMapping
    public ResponseEntity<List<Domain>> getAllDomains() {
        List<Domain> domains = domainService.getAllDomains();
        return ResponseEntity.ok(domains);
    }

    @GetMapping("/{domainId}/articles")
    public ResponseEntity<List<Article>> getArticlesByDomain(@PathVariable Long domainId) {
        List<Article> articles = domainService.getArticlesByDomain(domainId);
        return ResponseEntity.ok(articles);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDomainById(@PathVariable Long id) {
        domainService.deleteDomainById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Domain> updateDomainById(@PathVariable Long id, @RequestParam String name) {
        Domain updatedDomain = domainService.updateDomainById(id, name);
        return ResponseEntity.ok(updatedDomain);
    }
}
