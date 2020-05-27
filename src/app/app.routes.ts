import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { SucursalComponent } from './components/sucursal/sucursal.component';

const APP_ROUTES: Routes = [
    { path: 'home',       component: HomeComponent },
    { path: 'docs',       component: DocumentosComponent },
    { path: 'pagos',      component: PagosComponent },
    { path: 'sucursales', component: SucursalComponent },
    { path: '**',         pathMatch: 'full', redirectTo: 'home' },
];

export const APP_ROUTING = RouterModule.forRoot( APP_ROUTES );
