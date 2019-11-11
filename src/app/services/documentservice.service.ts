import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentserviceService {
  // conexion MSSQL
  NODE_URL  = environment.SERVER_URL;
  NODE_PORT = environment.PORT_URL;
  // conexion BSALE
  API_TOKEN = environment.API_TOKEN;
  API_BSALE = environment.API_URL;
  API_VER   = 'v1/';
  API_HEAD  = new HttpHeaders({
                      'Content-Type' : 'application/json',
                      Access_Token   : this.API_TOKEN
                  });

  constructor(private http: HttpClient) {
    // this.API_URL = environment.API_URL;
  }

  retrieveDocs( params?: string ) {
    const xUrl = this.API_BSALE + this.API_VER + 'documents.json' + (( params ) ? '?' + params : '' ) ;
    // console.log(xUrl);
    return this.http.get( xUrl, { headers: this.API_HEAD } );
  }

  retrieveDetail( xUrl ) {
    // console.log(xUrl);
    return this.http.get( xUrl, { headers: this.API_HEAD } );
  }

  test( cSP, parametros ) {
    const accion = '/proalma';
    const url    = this.NODE_URL + this.NODE_PORT + accion;
    const body   = { sp: cSP, datos: parametros };
    console.log(url);
    return this.http.post( url, body );
  }

}

