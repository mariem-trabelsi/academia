import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedPapersComponent } from './archived-papers.component';

describe('ArchivedPapersComponent', () => {
  let component: ArchivedPapersComponent;
  let fixture: ComponentFixture<ArchivedPapersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivedPapersComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ArchivedPapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
