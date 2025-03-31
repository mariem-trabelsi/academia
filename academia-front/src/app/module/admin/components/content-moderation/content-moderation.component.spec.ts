import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentModerationComponent } from './content-moderation.component';

describe('ContentModerationComponent', () => {
  let component: ContentModerationComponent;
  let fixture: ComponentFixture<ContentModerationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentModerationComponent]
    });
    fixture = TestBed.createComponent(ContentModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
