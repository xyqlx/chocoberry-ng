import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpuMemChartComponent } from './cpu-mem-chart.component';

describe('CpuMemChartComponent', () => {
  let component: CpuMemChartComponent;
  let fixture: ComponentFixture<CpuMemChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CpuMemChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpuMemChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
