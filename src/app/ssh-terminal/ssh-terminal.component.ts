import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  CLOSE_EVENT,
  SSH_PASSWORD,
  TerminalWindowComponent,
} from '../terminal-window/terminal-window.component';

@Component({
  selector: 'app-ssh-terminal',
  templateUrl: './ssh-terminal.component.html',
  styleUrls: ['./ssh-terminal.component.scss'],
})
export class SshTerminalComponent implements OnInit {
  constructor(private overlay: Overlay, private injector: Injector) {}

  ngOnInit(): void {}

  form: UntypedFormGroup = new UntypedFormGroup({
    password: new UntypedFormControl(''),
  });
  hide = true;

  connect() {
    const config = new OverlayConfig();
    config.positionStrategy = this.overlay
      .position()
      .global() // 全局显示
      .centerHorizontally() // 水平居中
      .centerVertically(); // 垂直居中
    config.hasBackdrop = false; // 设置overlay后面有一层背景, 当然你也可以设置backdropClass 来设置这层背景的class
    const overlayRef = this.overlay.create(config); // OverlayRef, overlay层
    // 创建一个ComponentPortal，attach到OverlayRef，这个时候我们这个overlay层就显示出来了。
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: CLOSE_EVENT,
          useValue: () => {
            overlayRef.dispose(); // 销毁overlay层
          },
        },
        {
          provide: SSH_PASSWORD,
          useValue: this.form.value.password,
        },
      ],
    });
    const componentPortal = new ComponentPortal(
      TerminalWindowComponent,
      null,
      injector
    );
    overlayRef.attach(componentPortal);
  }
}
