import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauComponent } from './cau.component';

describe('CauComponent', () => {
  let component: CauComponent;
  let fixture: ComponentFixture<CauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CauComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
