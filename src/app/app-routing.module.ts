import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotifyComponent } from './notify/notify.component';
import { StatComponent } from './stat/stat.component';
import { UserComponent } from './user/user.component';
import { environment } from './../environments/environment';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'stat', component: StatComponent },
  { path: 'notify', component: NotifyComponent },
  { path: 'user', component: UserComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.demo })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
