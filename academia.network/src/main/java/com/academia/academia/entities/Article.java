package com.academia.academia.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer createdBy;
    private Integer lastModifiedBy;
    private String title;
    private String isbn;
    private String authorName;
    private String articleCover;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;
    private String content;
    @OneToMany(mappedBy = "article")
    private List<Feedback> feedbacks;
}