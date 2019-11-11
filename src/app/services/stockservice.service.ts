import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockserviceService {

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

  retrieveStock( params?: string ) {
    const xUrl = this.API_BSALE + this.API_VER + 'stocks.json' + (( params ) ? '?' + params : '' ) ;
    // console.log(xUrl);
    return this.http.get( xUrl, { headers: this.API_HEAD } );
  }

}
