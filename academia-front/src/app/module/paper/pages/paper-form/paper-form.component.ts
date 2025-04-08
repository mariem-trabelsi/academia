import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Paper, PaperDomain } from '../../models/paper';
import { PaperService } from '../../services/paper.service';
import {ArticleControllerService} from "../../../../services/services/article-controller.service";
import {Article} from "../../../../services/models/article";
import {KeycloakService} from "../../../../services/keycloak/keycloak.service";
import { UploadArticle$Params } from 'src/app/services/fn/article-controller/upload-article';

@Component({
  selector: 'app-paper-form',
  templateUrl: './paper-form.component.html',
  styleUrls: ['./paper-form.component.scss']
})
export class PaperFormComponent implements OnInit {
  paperForm: FormGroup;
  isEditMode = false;
  paperId: number | null = null;
  loading = true;
  submitting = false;
  domains: string[] = [];
  newKeyword = '';
  name = this.keycloackService.profile?.firstName+' '+this.keycloackService.profile?.lastName;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService,
    private articleService: ArticleControllerService,
    private keycloackService : KeycloakService
  ) {
    this.paperForm = this.createForm();
  }
/*
  ngOnInit(): void {
    this.loadDomains();
    this.checkEditMode();
  }
*/
ngOnInit(): void {
  this.paperForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    isbn: ['', [Validators.required, Validators.minLength(8)]],
    authorAffiliation: [''],
    affiliation: [''],
    abstract: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]],
    //content: ['', [Validators.required, Validators.minLength(100)]],
    content: ['', [Validators.minLength(100)]],
    domain: ['', Validators.required],
    keywords: this.fb.array([]),
    coverImage: ['']
  });

  this.domains = Object.values(PaperDomain);
  this.loading = false;
}

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      abstract: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]],
      authorName: [this.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      authorAffiliation: [''],
      coverImage: [''],
      pdfUrl: [''],
      domain: ['', Validators.required],
      keywords: this.fb.array([])
    });
  }

/*
  get keywordsFormArray(): FormArray {
    return this.paperForm.get('keywords') as FormArray;
  }

  addKeyword(): void {
    if (this.newKeyword.trim() && !this.keywordsFormArray.value.includes(this.newKeyword.trim())) {
      this.keywordsFormArray.push(this.fb.control(this.newKeyword.trim()));
      this.newKeyword = '';
    }
  }
  removeKeyword(index: number): void {
    this.keywordsFormArray.removeAt(index);
  }*/

 get keywordsFormArray(): FormArray {
  return this.paperForm.get('keywords') as FormArray;
}

addKeyword() {
  const trimmedKeyword = this.newKeyword.trim();
  if (trimmedKeyword && !this.keywordsFormArray.value.includes(trimmedKeyword)) {
    this.keywordsFormArray.push(this.fb.control(trimmedKeyword));
    this.newKeyword = '';
  }
}

removeKeyword(index: number) {
  this.keywordsFormArray.removeAt(index);
}


  loadDomains(): void {
    this.paperService.getPaperDomains().subscribe(domains => {
      this.domains = domains;
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.paperId = Number(id);
      this.loadPaper(this.paperId);
    } else {
      this.loading = false;
    }
  }

  loadPaper(id: number): void {
    this.paperService.getPaperById(id).subscribe({
      next: (paper) => {
        if (paper) {
          this.populateForm(paper);
        } else {
          this.router.navigate(['/papers']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading paper:', error);
        this.router.navigate(['/papers']);
        this.loading = false;
      }
    });
  }

  populateForm(paper: Paper): void {
    // Clear existing keywords array
    while (this.keywordsFormArray.length) {
      this.keywordsFormArray.removeAt(0);
    }

    // Add each keyword
    if (paper.keywords) {
      paper.keywords.forEach(keyword => {
        this.keywordsFormArray.push(this.fb.control(keyword));
      });
    }

    // Set form values
    this.paperForm.patchValue({
      title: paper.title,
      abstract: paper.abstract,
      authorName: this.isEditMode ? paper.authorName : this.name,
      authorAffiliation: paper.authorAffiliation || '',
      coverImage: paper.coverImage || '',
      pdfUrl: paper.pdfUrl || '',
      domain: paper.domain
    });
  }

selectedFile: File | null = null;
fileError: string | null = null;

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    if (file.type !== 'application/pdf') {
      this.fileError = 'Only PDF files are allowed.';
      this.selectedFile = null;
    } else {
      this.fileError = null;
      this.selectedFile = file;
    }
  }
}

onSubmit(): void {
  if (!this.selectedFile) {
    console.error('Aucun fichier sélectionné.');
    return;
  }

  const formData = new FormData();
  formData.append('file', this.selectedFile);

  // Ajoute les autres champs du formulaire dans le FormData ou directement dans `params`
  formData.append('title', this.paperForm.value.title);
  formData.append('abstract', this.paperForm.value.abstract);
  formData.append('isbn', this.paperForm.value.isbn);
  formData.append('coverImage', this.paperForm.value.coverImage);

  // Préparer les paramètres pour l'appel API
  const params: UploadArticle$Params = {
    body: formData as any,  // Si tu veux passer un FormData, ou adapter si nécessaire
    title: this.paperForm.value.title,
    abstract_: this.paperForm.value.abstract,
    isbn: this.paperForm.value.isbn,
    coverImage: this.paperForm.value.coverImage,
    authorAffiliation:this.paperForm.value.authorAffiliation,
    affiliation:this.paperForm.value.affiliation,
    //authorName: this.name,  // Assure-toi que c'est bien ce qu'il faut
    // Ajoute d'autres propriétés nécessaires ici...
  };

  this.articleService.uploadArticle(params).subscribe({
    next: (article: Article) => {
      this.router.navigate(['/papers']);
      console.log('Article uploadé avec succès :', article);

    },
    error: (err) => {
      console.error('Erreur lors de l\'upload :', err);
    }
  });
}
successMessage = '';

onPublish() {
  this.articleService.createArticle({ body: this.paperForm.value }).subscribe({
    next: (res) => {
      console.log(' Article publié', res);
      this.successMessage = ' Article publié avec succès !';
      this.paperForm.reset();

    },
    error: (err) => {
      console.error(' Erreur lors de la publication', err);
      this.successMessage = ' Une erreur est survenue.';
    }
  });
}


/*
onSubmit() {
  if (this.paperForm.invalid) return;

  this.submitting = true;
  const formValue = this.paperForm.value;

  const article: Article = {
    title: formValue.title,
    isbn: formValue.isbn,
    authorAffiliation: formValue.authorAffiliation,
    abstract: formValue.abstract,
    content: formValue.content,
    domain: formValue.domain,
    keywords: formValue.keywords,
    authorName: this.name
  };


  this.articleService.createArticle({ body: article }).subscribe({
    next: () => {
      this.submitting = false;
      this.router.navigate(['/articles']);
    },
    error: (err) => {
      this.submitting = false;
      console.error('Failed to submit article:', err);
    }
  });
}
*/





  createArticle(article: Article): void {
    this.articleService.createArticle({ body: article }).subscribe({
      next: (newArticle) => {
        this.submitting = false;

        //this.router.navigate(['/discover', newArticle.id]);
        this.router.navigate(['/discover']);
      },
      error: (error) => {
        console.error('Error creating article:', error);
        this.submitting = false;
      }
    });
  }


  updatePaper(paper: Paper): void {
    this.paperService.updatePaper(paper).subscribe({
      next: (updatedPaper) => {
        this.submitting = false;
        this.router.navigate(['/papers', updatedPaper.id]);
      },
      error: (error) => {
        console.error('Error updating paper:', error);
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    if (this.isEditMode && this.paperId) {
      this.router.navigate(['/papers', this.paperId]);
    } else {
      this.router.navigate(['/papers']);
    }
  }

  // Helper to mark all controls as touched for validation display
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
