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

//ok
    @GetMapping
    public ResponseEntity<List<Domain>> getAllDomains() {
        List<Domain> domains = domainService.getAllDomains();
        return ResponseEntity.ok(domains);
    }

//ok
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDomainById(@PathVariable("id") Long id) {
        domainService.deleteDomainById(id);
        return ResponseEntity.noContent().build();
    }

//ok
    @GetMapping("/{id}/articles")
    public ResponseEntity<List<Article>> getArticlesByDomain(@PathVariable("id") Long domainId) {
        List<Article> articles = domainService.getArticlesByDomain(domainId);
        return ResponseEntity.ok(articles);
    }



    @PostMapping
    public ResponseEntity<Domain> createDomain(@RequestBody Domain domain) {
        if (domain.getName() == null || domain.getName().isEmpty()) {
            throw new IllegalArgumentException("Domain name cannot be empty");
        }
        if (domain.getDescription() == null || domain.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Domain description cannot be empty");
        }
        Domain newDomain = domainService.createDomain(domain.getName(), domain.getDescription());
        return ResponseEntity.ok(newDomain);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Domain> updateDomainById(@PathVariable("id") Long id, @RequestBody Domain domain) {
        if (domain.getName() == null || domain.getName().isEmpty()) {
            throw new IllegalArgumentException("Domain name cannot be empty");
        }
        if (domain.getDescription() == null || domain.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Domain description cannot be empty");
        }
        Domain updatedDomain = domainService.updateDomainById(id, domain.getName(), domain.getDescription(), domain.getArticles());
        return ResponseEntity.ok(updatedDomain);
    }




}
