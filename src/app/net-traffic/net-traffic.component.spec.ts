import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetTrafficComponent } from './net-traffic.component';

describe('NetTrafficComponent', () => {
  let component: NetTrafficComponent;
  let fixture: ComponentFixture<NetTrafficComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetTrafficComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetTrafficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
