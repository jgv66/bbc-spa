import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StockserviceService } from '../../../services/stockservice.service';
import { ComunserviceService } from '../../../services/comunservice.service';

@Component({
  selector: 'app-stockxlocal',
  templateUrl: './stockxlocal.component.html',
  styleUrls: ['./stockxlocal.component.scss']
})
export class StockxlocalComponent implements OnInit {

  // @ViewChild( CdkVirtualScrollViewport ) viewport: CdkVirtualScrollViewport;

  cargando = false;
  retrievedData$: Observable<any>;
  stock: Array<any>;
  locales: Array<any>;
  local = '';
  offset = 0;
  codigo = '';

  constructor( private stockSS: StockserviceService,
               private comunSS: ComunserviceService ) { }

  ngOnInit() {
    this.cargando = true;
    this.comunSS.retrieveLocales( 'limit=50&fields=[id,name]' )
      .subscribe( (resultado: any) => {
        // console.log( 'resultado locales->', resultado.items );
        this.locales = [];
        resultado.items.forEach(element => {
          this.locales.push( { codigo: element.id, nombre: element.name } );
        });
        this.cargando = false;
      });
  }
  cambiandoLocal() {
    // console.log('cambio !!!');
    this.stock = [];
  }

  consultaStock() {
    if (  this.codigo === '' && this.local === '' ) {
      this.comunSS.mensaje( 'Error!', 'Selección vacía. Complete los datos de Local o producto y reintente.' );
    } else {
      this.cargando = true;
      //
      const params = 'limit=50&offset=' + this.offset.toString() +
                      ((this.local !== '' ) ? '&officeid=' + this.local : '' ) +
                      ((this.codigo !== '') ? '&code=' + this.codigo : '' );
      //
      this.stockSS.retrieveStock( params )
          .subscribe( (resultado: any) => {
            // console.log(resultado.count, resultado.items);
            this.stock = [];
            resultado.items.forEach(element => {
              this.stock.push( { local: this.local,
                                 codigo: element.id,
                                 descripcion: '',
                                 saldo: element.quantity,
                                 reservas: element.quantityReserved,
                                 disponible: element.quantityAvailable } );
            });
            this.cargando = false;
          });
    }
  }

}
