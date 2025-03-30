import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaperApprovalQueueComponent } from './paper-approval-queue.component';

describe('PaperApprovalQueueComponent', () => {
  let component: PaperApprovalQueueComponent;
  let fixture: ComponentFixture<PaperApprovalQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaperApprovalQueueComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(PaperApprovalQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
