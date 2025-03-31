import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperFilterComponent } from './paper-filter.component';

describe('PaperFilterComponent', () => {
  let component: PaperFilterComponent;
  let fixture: ComponentFixture<PaperFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaperFilterComponent]
    });
    fixture = TestBed.createComponent(PaperFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
