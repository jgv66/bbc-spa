import { Component, OnInit } from '@angular/core';
import { StockserviceService } from '../../services/stockservice.service';
import { ComunserviceService } from '../../services/comunservice.service';
import { DocumentserviceService } from '../../services/documentservice.service';
import { promise, element } from 'protractor';
import { resolve } from 'path';


@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
})
export class DocumentosComponent implements OnInit {

  cargando = false;
  fechaDesde = new Date();
  fechaHasta = new Date();
  locales: Array<any>;
  local = '';
  offset = 0;
  documentos = [];
  tipoDoc = [];
  TodoOk = 0;

  constructor( public DocsSS: DocumentserviceService,
               public comunSS: ComunserviceService ) { }

  ngOnInit() {
    this.cargando = true;
    this.comunSS.retrieveLocales( 'limit=50&fields=[id,name]' )
        .subscribe( (resultado: any) => {
          // console.log( 'resultado locales->', resultado.items );
          this.locales = [];
          resultado.items.forEach( fila => {
            this.locales.push( { codigo: fila.id, nombre: fila.name } );
          });
        });
    this.comunSS.retrieveTipoDocumento( 'limit=50&fields=[href,id,name,codesii,iselectronicdocument]' )
        .subscribe( (resultado: any) => {
          // console.log( 'resultado tipos de documentos->', resultado.items );
          this.tipoDoc = [];
          resultado.items.forEach( fila => {
            this.tipoDoc.push( { href: fila.href,
                                 id: fila.id,
                                 nombre: fila.name,
                                 codeSii: fila.codeSii,
                                 electronico: fila.isElectronicDocument } );
          });
          this.cargando = false;
          // console.log(this.tipoDoc);
        });
  }

  cambiandoLocal() {
    this.documentos = [];
    this.TodoOk = 0;
  }

  /* esta funcion se encarga de llamar a la promesa y clientes y luego ordenear los resultados */
  consultaDocs() {
    this.cargando = true;
    this.rescataDocumentos()
        .then( () => {
          // console.log( this.documentos.length );
          this.cargando = false;
        });
  }
  rescataDocumentos() {
      //
      return new Promise( ( resolver, reject ) => {
          // console.log('promesa -> rescataDocumentos');
          if ( !this.fechaDesde || !this.fechaHasta || this.local === '' ) {
            this.comunSS.mensaje( 'Error!', 'Selección vacía. Complete los datos de Local y fechas y reintente.' );
            reject();
          } else {
            //
            this.documentos = [];
            //
            const fechaDesdeUnix = this.comunSS.fechas2UnixTime( this.fechaDesde, true  );
            const fechaHastaUnix = this.comunSS.fechas2UnixTime( this.fechaHasta, false );
            //
            let params = 'limit=1' +    /* un dato para obtener la cantidad del rango */
                         '&offset=' + this.offset.toString() +
                         '&officeid=' + this.local  +
                         '&emissiondaterange=[' + fechaDesdeUnix.toString() + ',' + fechaHastaUnix.toString() + ']';
            //
            let totalDocs = 0;
            this.DocsSS.retrieveDocs( params )
                .subscribe( (resultado: any) => {
                  totalDocs = resultado.count;
                  if ( totalDocs === 0  ) {
                    this.comunSS.mensaje( 'SIN DATOS',
                                          'La combinación de Local y las fechas no encuentra resultados. Corrija y reintente.' );
                  } else {
                    const vueltas = Math.ceil( totalDocs / 25 ) ;
                    //
                    for (let index = 0; index < vueltas; index++ ) {
                        params = 'limit=25' +
                                 '&offset=' + ( index === 0 ? 0 : index * 25 ).toString() +
                                 '&officeid=' + this.local  +
                                 '&emissiondaterange=[' + fechaDesdeUnix.toString() + ',' + fechaHastaUnix.toString() + ']';
                        this.rescataDatos( params );
                    }
                    resolver();
                  }
                });
                //
          }
      });
  }
  rescataDatos( params ) {
      //
      this.DocsSS.retrieveDocs( params )
          .subscribe( (resultado: any) => {
              // console.log( resultado.items[0] );
              resultado.items.forEach( doc => {
                  //
                  this.documentos.push({
                      id:             doc.id,
                      folio:          doc.number,
                      emision:        this.comunSS.unixTime2Fecha( doc.emissionDate ),
                      vencimiento:    this.comunSS.unixTime2Fecha( doc.expirationDate ),
                      monto:          doc.totalAmount,
                      neto:           doc.netAmount,
                      iva:            doc.taxAmount,
                      informadoSII:   ( doc.informedSii === 0 ) ? 'Correcto' :
                                      ( doc.informedSii === 1 ) ? 'Enviado' :
                                      ( doc.informedSii === 2 ) ? 'Rechazado' : '???',
                      cliente:        ( doc.client ) ? doc.client.href + '?fields=[company]' : 'n/n' ,
                      clienteNomb:    ( doc.client ) ? '' : 'n/n',
                      sucursal:       doc.office.id,
                      sucursalnom:    '',
                      tipoDoc:        doc.document_type.href,
                      codeSii:        '',
                      nombreDoc:      '',
                      electronico:    false,
                      detalle:        doc.details.href,
                      itemes:         [],
                      abierto:        false,
                      marcado:        false
                  });
              });
              ++this.TodoOk;
          });
  }

  resuelveOtros() {
      this.cargando = true;
      // console.log('promesa -> resuelveClientes');
      let pos = -1;
      this.documentos.forEach( fila => {
        // clientes
        if ( fila.cliente !== 'n/n' ) {
          //
          this.DocsSS.retrieveDetail( fila.cliente )
              .subscribe( ( data: any ) => {
                  // console.log(element.folio, element.cliente, data);
                  fila.clienteNomb = data.company;
              });
        }
        // tipo de documento
        pos = this.tipoDoc.findIndex( tipos => fila.tipoDoc === tipos.href );
        if ( pos > -1 ) {
          fila.codeSii     = this.tipoDoc[ pos ].codeSii;
          fila.nombreDoc   = this.tipoDoc[ pos ].nombre;
          fila.electronico = ( this.tipoDoc[ pos ].electronico === 1 ? true : false );
        }
        //
      });
      this.cargando = false;
  }

  ordenaPorFechas() {
    // ordenar por contribucion
    this.documentos.sort( (a, b) => {
      if (a.emision > b.emision) {
        return 1;
      }
      if (a.emision < b.emision) {
        return -1;
      }
      return 0;
    });

  }

  detalleOnOff( data ) {
    if ( data.abierto ) {
      data.abierto = false;
    } else {
      if ( data.itemes.length > 0  ) {
        data.abierto = true;
      } else {
        this.DocsSS.retrieveDetail( data.detalle )
            .subscribe( ( deta: any ) => {
                console.log(deta);
                deta.items.forEach( fila => {
                  data.itemes.push({
                    id: fila.id,
                    cantidad: fila.quantity,
                    monto: fila.totalAmount,
                    href: fila.href,
                    variantID: fila.variant.id,
                    code: '',
                    descripcion: ''
                  });
                });
                this.decoItems( data );
            });
      }
    }
  }

  decoItems( data ) {
    data.itemes.forEach( fila => {
      this.DocsSS.retrieveDetail( 'https://api.bsale.cl/v1/products/' + fila.variantID +  '.json' )
          .subscribe( ( deta: any ) => {
            fila.descripcion = deta.name;
          });
    });
  }

  marcarTodos() {
    let i = -1;
    this.documentos.forEach( () => {
        this.documentos[++i].marcado = !this.documentos[i].marcado;
    });
  }

  trasladarMarcados() {
    this.DocsSS.test( 'ksp_buscarUsuario',
                      { email: 'pamela.olguin@babycenterstore.cl ',
                        pssw:  '13687',
                        sistema: 'traspasos' } )
        .subscribe( datos => console.log( datos ) );
  }


}
