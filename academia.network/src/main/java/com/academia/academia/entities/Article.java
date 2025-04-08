package com.academia.academia.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    private String authorAffiliation;
    private String isbn;
    private String authorName;
    @Column(name = "article_cover", length = 100000)
    private String articleCover;
    private String affiliation;

    private String filePath;

    @Column(columnDefinition = "boolean default false")
    private boolean approved;
    @Column(columnDefinition = "boolean default false")
    private boolean archived;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Feedback> feedbacks;

    @ManyToOne
    @JoinColumn(name = "domain_id")
    @JsonBackReference
    private Domain domain;

    public Domain getDomain() {
        return domain;
    }

    public void setDomain(Domain domain) {
        this.domain = domain;
    }
}
