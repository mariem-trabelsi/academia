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
    private String isbn;
    private String authorName;
    private String articleCover;
    private String content;
    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference  // Marque cette relation comme le côté "parent"
    private List<Feedback> feedbacks;
}