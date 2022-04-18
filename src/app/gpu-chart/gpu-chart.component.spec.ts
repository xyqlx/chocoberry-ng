import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpuChartComponent } from './gpu-chart.component';

describe('GpuChartComponent', () => {
  let component: GpuChartComponent;
  let fixture: ComponentFixture<GpuChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpuChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpuChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
