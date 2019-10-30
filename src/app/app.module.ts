import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KBanditComponent } from './component/kbandit/kbandit.component';
import {ChartsModule} from "ng2-charts";
import { BarraComponent } from './component/graficos/barra/barra.component';

@NgModule({
  declarations: [
    AppComponent,
    KBanditComponent,
    BarraComponent    
  ],
  imports: [  
    FormsModule,  
    BrowserModule,
    AppRoutingModule,
    ChartsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
