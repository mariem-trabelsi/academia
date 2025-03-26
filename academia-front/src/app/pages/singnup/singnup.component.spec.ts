import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingnupComponent } from './singnup.component';

describe('SingnupComponent', () => {
  let component: SingnupComponent;
  let fixture: ComponentFixture<SingnupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingnupComponent]
    });
    fixture = TestBed.createComponent(SingnupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
