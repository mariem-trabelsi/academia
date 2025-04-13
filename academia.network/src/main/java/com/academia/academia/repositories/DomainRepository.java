package com.academia.academia.repositories;


import com.academia.academia.entities.Domain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DomainRepository extends JpaRepository<Domain, Long> {

    Domain findByName(String name);
}
