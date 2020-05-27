import { Component, OnInit } from '@angular/core';
import { ComunserviceService } from '../../../services/comunservice.service';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.scss']
})
export class SucursalComponent implements OnInit {

  cargando = false;
  locales = [];
  sucursales = [];
  detalle = []; 
  
  closeResult: string;

  constructor( public comunSS: ComunserviceService ) { }

  ngOnInit() {
    this.cargando = true;
    this.comunSS.retrieveLocales('limit=50&fields=[id,name]')
      .subscribe((res: any) => {
          this.locales = [];
          res.items.forEach(fila => {
              this.locales.push({
                codigo: fila.id,
                nombre: fila.name
              });
          });
      });
    this.comunSS.leerSucursales()
        .subscribe( ( res: any ) => {
            // console.log(res);
            if ( res.resultado === 'ok' ) {
              this.sucursales = res.data;
            }
          });
    this.cargando = false;
  }

  actualizar( $event, data ) {
    console.log($event)
    this.comunSS.actusalizaSucursal( { codigo:   $event.codigo,
                                       nombre:   $event.nombre,
                                       empresa:  $event.empresa,
                                       sucursal: $event.sucursal } )
      .subscribe((res: any) => {
        if ( res.resultado === 'ok' ) {
          data.sucursal_bsale = $event.codigo;
          data.sucursalnom    = $event.nombre;
        } else {
          this.comunSS.mensaje('ATENCION', 'Existió un problema al actualizar. Reintente luego.')
        }
    });
  }


}

