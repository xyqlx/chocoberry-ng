import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GpuComponent } from './gpu/gpu.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from './../environments/environment';
import { OverlayModule } from '@angular/cdk/overlay';
import { LoginComponent } from './login/login.component'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { TopPanelComponent } from './top-panel/top-panel.component';
import { MatTableModule } from '@angular/material/table';
import { CauComponent } from './cau/cau.component';
import { NgTerminalModule } from 'ng-terminal';
import { SshTerminalComponent } from './ssh-terminal/ssh-terminal.component';
import { TerminalWindowComponent } from './terminal-window/terminal-window.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UploadComponent } from './upload/upload.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';


@NgModule({
  declarations: [
    AppComponent,
    GpuComponent,
    HomeComponent,
    LoginComponent,
    TopPanelComponent,
    CauComponent,
    SshTerminalComponent,
    TerminalWindowComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('access_token'),
        allowedDomains: [environment.apiDomain],
        disallowedRoutes: [environment.apiDomain + '/auth/login'],
      }
    }),
    OverlayModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressBarModule,
    CdkAccordionModule,
    MatExpansionModule,
    MatTableModule,
    NgTerminalModule,
    DragDropModule,
    SocketIoModule.forRoot({ url: environment.apiUrl, options: { autoConnect: false, path: '' } })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
