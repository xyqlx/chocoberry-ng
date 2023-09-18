import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { LoginComponent, LOGIN_EVENT } from './login.component';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  showLogin(event: () => void = () => {}) {
    const config = new OverlayConfig();
    config.positionStrategy = this.overlay
      .position()
      .global() // 全局显示
      .centerHorizontally() // 水平居中
      .centerVertically(); // 垂直居中
    config.hasBackdrop = true; // 设置overlay后面有一层背景, 当然你也可以设置backdropClass 来设置这层背景的class
    const overlayRef = this.overlay.create(config); // OverlayRef, overlay层
    // 创建一个ComponentPortal，attach到OverlayRef，这个时候我们这个overlay层就显示出来了。
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: LOGIN_EVENT,
          useValue: () => {
            overlayRef.dispose(); // 销毁overlay层
            event();
          },
        },
      ],
    });
    const componentPortal = new ComponentPortal(LoginComponent, null, injector);
    overlayRef.attach(componentPortal);
  }
}
