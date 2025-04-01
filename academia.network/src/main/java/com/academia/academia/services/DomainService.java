package com.academia.academia.services;

import com.academia.academia.entities.Domain;
import com.academia.academia.entities.Article;
import com.academia.academia.repositories.DomainRepository;
import com.academia.academia.repositories.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DomainService {

    @Autowired
    private DomainRepository domainRepository;

    @Autowired
    private ArticleRepository articleRepository;

    // Créer un domaine
    public Domain createDomain(String name) {
        Domain domain = new Domain();
        domain.setName(name);
        return domainRepository.save(domain);
    }

    // Récupérer tous les domaines
    public List<Domain> getAllDomains() {
        return domainRepository.findAll();
    }

    // Récupérer tous les articles d'un domaine spécifique
    public List<Article> getArticlesByDomain(Long domainId) {
        Optional<Domain> domain = domainRepository.findById(domainId);
        if (domain.isPresent()) {
            return articleRepository.findByDomain(domain.get());
        } else {
            throw new RuntimeException("Domain not found");
        }
    }
}

