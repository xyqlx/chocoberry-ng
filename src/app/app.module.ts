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
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { TopPanelComponent } from './top-panel/top-panel.component';
import { MatTableModule } from '@angular/material/table';
import { CauComponent } from './cau/cau.component';
import { SshTerminalComponent } from './ssh-terminal/ssh-terminal.component';
import { TerminalWindowComponent } from './terminal-window/terminal-window.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UploadComponent } from './upload/upload.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmailComponent } from './email/email.component';
import { UserComponent } from './user/user.component';
import { NotifyComponent } from './notify/notify.component';
import { StatComponent } from './stat/stat.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CpuMemChartComponent } from './cpu-mem-chart/cpu-mem-chart.component';
import { GpuChartComponent } from './gpu-chart/gpu-chart.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NetTrafficComponent } from './net-traffic/net-traffic.component';
import { NetTrafficPipe } from './net-traffic/net-traffic.pipe';
import { TriggerComponent } from './notify/trigger/trigger.component';
import { AddTriggerComponent } from './notify/add-trigger/add-trigger.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MultiProgressComponent } from './multi-progress/multi-progress.component';
import { SettingsComponent } from './settings/settings.component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatGridListModule } from '@angular/material/grid-list';
import { topChartSettingsReducer } from './state/top-chart-settings.reducer';
import { StoreModule } from '@ngrx/store';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { triggerReducer } from './notify/store/trigger.reducer';

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
    UploadComponent,
    EmailComponent,
    UserComponent,
    NotifyComponent,
    StatComponent,
    CpuMemChartComponent,
    GpuChartComponent,
    NetTrafficComponent,
    NetTrafficPipe,
    TriggerComponent,
    AddTriggerComponent,
    MultiProgressComponent,
    SettingsComponent,
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
        disallowedRoutes: [
          environment.apiDomain + '/auth/login',
          environment.apiDomain + '/auth/register',
        ],
      },
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
    DragDropModule,
    MatTooltipModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to https://www.npmjs.com/package/ngx-echarts#custom-build section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
    StoreModule.forRoot({ topChartSettings: topChartSettingsReducer, trigger: triggerReducer }),
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FormsModule,
    DialogModule,
    MatSliderModule,
    MatGridListModule,
    NgxMatTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE, useValue: 'zh-CN'
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
