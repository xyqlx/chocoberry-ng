import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SshTerminalComponent } from './ssh-terminal.component';

describe('SshTerminalComponent', () => {
  let component: SshTerminalComponent;
  let fixture: ComponentFixture<SshTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SshTerminalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SshTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
