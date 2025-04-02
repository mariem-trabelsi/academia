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

    public Domain createDomain(String name) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Domain name cannot be empty");
        }
        Domain domain = new Domain();
        domain.setName(name);
        return domainRepository.save(domain);
    }


    public List<Domain> getAllDomains() {
        return domainRepository.findAll();
    }

    public List<Article> getArticlesByDomain(Long domainId) {
        Optional<Domain> domain = domainRepository.findById(domainId);
        if (domain.isPresent()) {
            return articleRepository.findByDomain(domain.get());
        } else {
            throw new RuntimeException("Domain not found");
        }
    }

    public void deleteDomainById(Long id) {
        if (!domainRepository.existsById(id)) {
            throw new RuntimeException("Domain not found");
        }
        domainRepository.deleteById(id);
    }

    public Domain updateDomainById(Long id, String newName, List<Article> articles) {
        Optional<Domain> optionalDomain = domainRepository.findById(id);
        if (optionalDomain.isPresent()) {
            Domain domain = optionalDomain.get();

            if (newName != null) {
                domain.setName(newName);
            }

            if (articles != null) {
                domain.setArticles(articles);
            }

            return domainRepository.save(domain);
        } else {
            throw new RuntimeException("Domain not found");
        }
    }

}
