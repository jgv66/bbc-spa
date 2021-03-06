import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ComunserviceService {

  // bsale
  API_TOKEN = environment.API_TOKEN;
  API_BSALE = environment.API_URL;
  API_VER   = 'v1/';
  API_HEAD  = new HttpHeaders({
                      'Content-Type' : 'application/json',
                      Access_Token   : this.API_TOKEN
                  });

  dataS: any;

  constructor(private http: HttpClient) {
    // this.API_URL = environment.API_URL;
  }

  retrieveLocales( params?: string ) {
    const xUrl = this.API_BSALE + this.API_VER + 'offices.json' + (( params ) ? '?' + params : '' ) ;
    // console.log(xUrl);
    return this.http.get( xUrl, { headers: this.API_HEAD } );
  }

  retrieveTipoDocumento( params?: string ) {
    const xUrl = this.API_BSALE + this.API_VER + 'document_types.json' + (( params ) ? '?' + params : '' ) ;
    // console.log(xUrl);
    return this.http.get( xUrl, { headers: this.API_HEAD } );
  }

  retrieveTiposPago( params?: string ) {
    const xUrl = this.API_BSALE + this.API_VER + 'payment_types.json' + (( params ) ? '?' + params : '' ) ;
    // console.log(xUrl);
    return this.http.get( xUrl, { headers: this.API_HEAD } );
  }

  fechas2UnixTime( fecha, horaDesde: boolean ) {
    if ( horaDesde ) {
      fecha = new Date(fecha + 'T00:00:00');
    } else {
      fecha = new Date(fecha + 'T23:59:00');
    }
    const unixTimestamp = Math.round( fecha.getTime() / 1000 );
    return unixTimestamp;
  }

  unixTime2Fecha( unixDate ) {
    // console.log( unixDate, new Date( unixDate * 1000 ) );
    return new Date( ( unixDate + 10900 ) * 1000 );
  }

  armaParams( aParams ) {
    let cadena  = '';
    let primero = true;
    aParams.forEach(element => {
      cadena += ( primero ? '' : '&'  ) + element.key + '=' + element.value;
      primero = false;
    });
    return cadena;
  }

  mensaje( titulo: string, texto: string ) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

  leerSucursales() {
    const xUrl = environment.SERVER_URL + environment.PORT_URL + '/actuayRescataSuc';
    return this.http.get( xUrl );
  }

  actusalizaSucursal( body ) {
    const xUrl = environment.SERVER_URL + environment.PORT_URL + '/actualizaSucursal';
    return this.http.post( xUrl, body );
  }


}
