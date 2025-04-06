package com.academia.academia.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Article extends BaseEntity {

    private String title;

    @Column(name = "abstract", length = 1000)
    private String abstract_;

    private String isbn;
    private String authorName;
    private String articleCover;
    private String affiliation;
    @Column(columnDefinition = "boolean default false")
    private boolean archived;

    private String filePath;

    @Column(columnDefinition = "boolean default false")
    private boolean approved;


    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Feedback> feedbacks;

    @ManyToOne
    @JoinColumn(name = "domain_id")
    @JsonManagedReference
    private Domain domain;
}