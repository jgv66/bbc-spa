import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';

// componentes
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { StockxlocalComponent } from './components/stockxlocal/stockxlocal.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { SucursalComponent } from './components/sucursal/sucursal.component';
import { ModalsucComponent } from './components/modalsuc/modalsuc.component';

// rutas
import { APP_ROUTING } from './app.routes';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DocumentosComponent,
    StockxlocalComponent,
    PagosComponent,
    SucursalComponent,
    ModalsucComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    APP_ROUTING,
    HttpClientModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
