import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Paper, PaperDomain } from '../../models/paper';
import { PaperService } from '../../services/paper.service';

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
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService
  ) {
    this.paperForm = this.createForm();
  }
  
  ngOnInit(): void {
    this.loadDomains();
    this.checkEditMode();
  }
  
  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      abstract: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]],
      content: ['', [Validators.required, Validators.minLength(100)]],
      authorName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      authorAffiliation: [''],
      coverImage: [''],
      pdfUrl: [''],
      domain: ['', Validators.required],
      keywords: this.fb.array([])
    });
  }
  
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
      content: paper.content,
      authorName: paper.authorName,
      authorAffiliation: paper.authorAffiliation || '',
      coverImage: paper.coverImage || '',
      pdfUrl: paper.pdfUrl || '',
      domain: paper.domain
    });
  }
  
  onSubmit(): void {
    if (this.paperForm.invalid) {
      this.markFormGroupTouched(this.paperForm);
      return;
    }
    
    this.submitting = true;
    const formData = this.paperForm.value;
    
    const paper: Paper = {
      title: formData.title,
      abstract: formData.abstract,
      content: formData.content,
      authorName: formData.authorName,
      authorAffiliation: formData.authorAffiliation,
      coverImage: formData.coverImage,
      pdfUrl: formData.pdfUrl,
      domain: formData.domain,
      keywords: formData.keywords
    };
    
    if (this.isEditMode && this.paperId) {
      paper.id = this.paperId;
      this.updatePaper(paper);
    } else {
      this.createPaper(paper);
    }
  }
  
  createPaper(paper: Paper): void {
    this.paperService.addPaper(paper).subscribe({
      next: (newPaper) => {
        this.submitting = false;
        this.router.navigate(['/papers', newPaper.id]);
      },
      error: (error) => {
        console.error('Error creating paper:', error);
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
