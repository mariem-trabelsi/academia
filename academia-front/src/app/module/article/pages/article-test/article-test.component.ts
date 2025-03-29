
import { Component, OnInit } from '@angular/core';
import { ArticleControllerService } from '../../../../services/services/article-controller.service';
import { Article } from '../../../../services/models/article';
import {KeycloakService} from "../../../../services/keycloak/keycloak.service";

@Component({
  selector: 'app-article-test',
  templateUrl: './article-test.component.html',
  styleUrls: ['./article-test.component.scss']
})
export class ArticleTestComponent implements OnInit {
  articles: Article[] = [];

  constructor(private articleService: ArticleControllerService,
              private  keycloakService : KeycloakService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  async logout() {
    await this.keycloakService.logout();
  }
  profile(){
    this.keycloakService.manageAccount();
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




