import { PIVIDPComponent } from './component/pi-vi-dp/pi-vi-dp.component';

import { KBanditComponent } from './component/kbandit/kbandit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component:KBanditComponent },
  { path: 'pi-vi-dp', component:PIVIDPComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
