import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { StockxlocalComponent } from './components/stockxlocal/stockxlocal.component';

const APP_ROUTES: Routes = [
    { path: 'home',  component: HomeComponent },
    { path: 'docs',  component: DocumentosComponent },
    // { path: 'stxl',  component: StockxlocalComponent },
    { path: '**',    pathMatch: 'full', redirectTo: 'home' },
];

export const APP_ROUTING = RouterModule.forRoot( APP_ROUTES );
