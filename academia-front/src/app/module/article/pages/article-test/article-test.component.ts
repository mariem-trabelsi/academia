
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
  name = this.keycloakService.profile?.firstName+' '+this.keycloakService.profile?.lastName

  constructor(private articleService: ArticleControllerService,
              private  keycloakService : KeycloakService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
    this.keycloakService.profile;
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

  newArticle: Article = {
    title: '',
    authorName: this.name,
    content: '',
    articleCover: '',
    isbn: '',
  }

  addArticle(): void {
    if (!this.newArticle.title || !this.newArticle.authorName || !this.newArticle.content) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    this.articleService.createArticle({ body: this.newArticle }).subscribe(
      (article: Article) => {
        console.log('Article ajouté avec succès', article);
        this.articles.unshift(article); // Ajoute l'article en haut de la liste
        this.newArticle = {id:0, title: '', authorName: '', content: '' ,isbn: ''}; // Réinitialise le formulaire
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'article', error);
      }
    );
  }

}




