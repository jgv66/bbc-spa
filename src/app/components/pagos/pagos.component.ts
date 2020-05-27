import { Component, OnInit } from '@angular/core';
import { ComunserviceService } from '../../../services/comunservice.service';
import { DocumentserviceService } from '../../../services/documentservice.service';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.sass']
})
export class PagosComponent implements OnInit {

  cargando = false;
  fechaDesde = new Date();
  fechaHasta = new Date();
  locales: Array < any > ;
  local = '';
  offset = 0;
  documentos = [];
  tipoDoc = [];
  tipodDoc = [];

  abriendoDetalle: string;
  detalleAbierto: string;

  constructor(public DocsSS: DocumentserviceService,
              public comunSS: ComunserviceService) { }

  ngOnInit() {
    this.cargando = true;
    this.comunSS.retrieveLocales('limit=50&fields=[id,name]')
      .subscribe((resultado: any) => {
        // console.log( 'resultado locales->', resultado.items );
        this.locales = [];
        resultado.items.forEach(fila => {
          this.locales.push({
            codigo: fila.id,
            nombre: fila.name
          });
        });
      });
    this.comunSS.retrieveTiposPago('limit=50&fields=[href,id,name,codesii,iselectronicdocument]')
      .subscribe((resultado: any) => {
        // console.log( 'resultado tipos de documentos->', resultado.items );
        this.tipoDoc = [];
        resultado.items.forEach(fila => {
          this.tipoDoc.push({
            href: fila.href,
            id: fila.id,
            nombre: fila.name,
          });
        });
        // console.log( this.tipoDoc );
      });
    this.comunSS.retrieveTipoDocumento('limit=50&fields=[href,id,name,codesii,iselectronicdocument]')
      .subscribe((resultado: any) => {
        // console.log( 'resultado tipos de documentos->', resultado.items );
        this.tipodDoc = [];
        resultado.items.forEach(fila => {
          this.tipodDoc.push({
            href: fila.href,
            id: fila.id,
            nombre: fila.name,
            codeSii: fila.codeSii,
            electronico: fila.isElectronicDocument
          });
        });
        this.cargando = false;
      });
    }

  cambiandoLocal() {
    this.documentos = [];
  }

  marcarTodos() {
    this.documentos.forEach( fila => {
      fila.marcado = !fila.marcado;
    });
  }

  trasladarMarcados() {
    // this.cargando = true;
    // this.DocsSS.enviarPagos( this.documentos, this.fechaDesde, this.fechaHasta )
    // .subscribe( (res: any) => {
    //   this.cargando = false;
    //   });
      let ntotal = 0;
      let query = '';
      Swal.fire({
        title: 'Traspaso de datos a ERP',
        text: 'Todos los registros marcados serán traspasados al ERP',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Traspasar'
      }).then( (result) => {
        if (result.value) {
          this.cargando = true;
          this.documentos.forEach( fila => {
            if ( fila.marcado ) {
                ++ntotal;
            }
          });
          // query = 'id,sucursal,local,emision,cliente,clienteNomb,documento_id,monto,tipoDoc,nombreDoc,tipoDesc,orden\n';
          // this.documentos.forEach( fila => {
          //   if ( fila.marcado ) {
          //     //
          //     // query += fila;
          //     query += `${fila.id},'${fila.sucursal}','${fila.local}','${fila.emision.toISOString()}',
          //              '${fila.cliente}','${fila.clienteNomb}','${fila.documento_id}',
          //               ${fila.monto},'${fila.tipoDoc}','${fila.nombreDoc}','${fila.tipoDesc}','${fila.orden}'\n`;
          //     //
          //   }
          // });
          // console.log( query );
          console.table( this.documentos );
        }
      });
  }

  async sumarDias( fecha, dias ) {
    return await fecha.setDate( fecha.getDate() + dias);
    // return fecha;
  }

  // Version con observables
  obsConsultaDocs() {
    //
    this.cargando = true;
    this.documentos = [];
    //
    console.log(this.fechaDesde, this.fechaHasta);
    //
    const fecha1 = moment.utc(this.fechaDesde);
    const fecha2 = moment.utc(this.fechaHasta);
    const dias = fecha2.diff(fecha1, 'days') + 1;
    //
    for (let index = 1; index <= dias; index++) {
        //
        this.sumarDias( new Date( this.fechaDesde ), index ).then( fecha => {
          // console.log( fecha / 1000, index, moment.unix(fecha/1000).utc() );
          this.obsRescataDocumentos( moment.unix(fecha / 1000) )
              .subscribe( data => {
                  // Debe iterar por lo resultados ya que el forkjoin devuelve un arreglo con el
                  // resultado de cada peticion que fue ejecutada simultaneamente. Concatena en cada
                  // iteracion
                  let docs: Array<any> = [];
                  data.forEach(d => {
                    docs = docs.concat(d.items);
                  });
                  // Construye un nuevo arreglo con la estructura modificada de
                  // acuerdo a lo que se necesita
                  docs = docs.map(doc => {
                    return {
                      id:             doc.id,
                      tipoDoc:        doc.payment_type.id,
                      tipoDesc:       '',
                      monto:          doc.amount,
                      emision:        this.comunSS.unixTime2Fecha(doc.recordDate),
                      cliente:        (doc.client) ? doc.client.href : 'n/n',
                      clienteNomb:    'n/n',
                      sucursal:       doc.office.id,
                      local:          '',
                      // documento_id:   doc.document.id,    // id: "2226"
                      // documento_href: doc.document.href,  // href: "https://api.bsale.cl/v1/documents/2226.json"
                      // dfolio:         '',
                      // dcodeSii:       '',
                      // dnombreDoc:     '',
                      // delectronico:   false,
                      orden:          doc.payment_type.id.toString() + doc.recordDate.toString() + doc.office.id.toString(),
                      abierto:        false,
                      marcado:        false,
                      traspasado:     false,
                      mensajeError:   ''
                    };
                  });
                  // rescatar otros datos
                  let pos = -1;
                  docs.forEach(fila => {
                      // tipo de documento
                      pos = this.tipoDoc.findIndex(tipos => fila.tipoDoc === tipos.id.toString() );
                      if (pos > -1) {
                        fila.tipoDesc = this.tipoDoc[pos].nombre;
                      }
                      // locales
                      pos = this.locales.findIndex(local => fila.sucursal === local.codigo.toString() );
                      if (pos > -1) {
                        fila.local = this.locales[pos].nombre;
                      }
                      // if ( fila.dcodeSii !== '' ) {
                      //   // tipo de documento comercial
                      //   this.DocsSS.retrieveDoc( '/' + fila.documento_id + '.json' )
                      //       .subscribe( ( dox: any ) => {
                      //         pos = this.tipodDoc.findIndex(tipos => dox.items[0].document_type.href === tipos.href);
                      //         if (pos > -1) {
                      //           fila.dcodeSii     = this.tipodDoc[pos].codeSii;
                      //           fila.dnombreDoc   = this.tipodDoc[pos].nombre;
                      //           fila.delectronico = this.tipodDoc[pos].electronico === 1 ? true : false;
                      //         }
                      //         fila.dfolio = dox.items[0].number ;
                      //       });
                      // }
                  });
                  // Finalmente asigna los resultados
                  // ordena por fechas
                  // Debiera ser una funcion que retorne un nuevo arreglo ordenado y
                  // que reciba un arreglo como parametro
                  this.documentos = this.documentos.sort((a, b) => {
                    if (a.orden > b.orden ) {
                      return 1;
                    }
                    if (a.orden < b.orden) {
                      return -1;
                    }
                    return 0;
                  });
                  // console.log( bruto, this.documentos );
                  this.cargando = false;
                },
                err => { console.error(err); }
              );
        });
      }
  }

  obsRescataDocumentos( fecha ) {
      // console.log('obsRescataDocumentos');
      this.cargando = true;
      //
      const fechaDesdeUnix: number = fecha / 1000;
      //
      let totalDocs = 0;
      let params = 'limit=1' + /* un dato para obtener la cantidad del rango */
                   '&offset=' + this.offset.toString() +
                   '&recorddate=' + fechaDesdeUnix ;
      // hace la 1era peticion para obtener el conteo de documentos
      return this.DocsSS.retrievePayments(params)
          .pipe(
              switchMap((resultado: any) => {
              // console.log('obsRescataDocumentos', resultado);
              totalDocs = resultado.count;
              const peticiones: Array<Observable<any>> = [];
              if (totalDocs > 0) {
                const vueltas = Math.ceil(totalDocs / 25);
                for (let index = 0; index < vueltas; index++) {
                  params = 'limit=25' +
                           '&offset=' + (index === 0 ? 0 : index * 25).toString() +
                           '&recorddate=' + fechaDesdeUnix ;
                  // OJO NO SE SUSCRIBE A LAS PETICIONES
                  peticiones.push(this.DocsSS.retrievePayments(params));
                }
              }
              // Retorna un unico observable que ejecuta todas las peticiones de manera simultanea.
              // Esto va a devolver un arreglo de respuestas, y se va a demorar lo que se demore la mas lenta.
              return forkJoin(peticiones);
            })
          );
    // }
  }

}
