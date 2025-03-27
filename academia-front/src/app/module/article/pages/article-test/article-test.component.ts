
import { Component, OnInit } from '@angular/core';
import { ArticleControllerService } from '../../../../services/services/article-controller.service';
import { Article } from '../../../../services/models/article';

@Component({
  selector: 'app-article-test',
  templateUrl: './article-test.component.html',
  styleUrls: ['./article-test.component.scss']
})
export class ArticleTestComponent implements OnInit {
  articles: Article[] = [];

  constructor(private articleService: ArticleControllerService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getAllArticles().subscribe(
      (data: Article[]) => {
        this.articles = data;
        console.log('Articles chargés', this.articles);
      },
      (error) => {
        console.error('Erreur lors du chargement des articles', error);
      }
    );
  }
}




