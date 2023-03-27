import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiProgressComponent } from './multi-progress.component';

describe('MultiProgressComponent', () => {
  let component: MultiProgressComponent;
  let fixture: ComponentFixture<MultiProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
