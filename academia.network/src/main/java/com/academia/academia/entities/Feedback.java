package com.academia.academia.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Feedback {

    @Id
    private Long id;
    @Column
    private Double note;
    private String comment;
    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;


}