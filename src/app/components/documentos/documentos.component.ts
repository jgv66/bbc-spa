import { Component, OnInit } from '@angular/core';
import { ComunserviceService } from '../../../services/comunservice.service';
import { DocumentserviceService } from '../../../services/documentservice.service';
import { throwError, forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {

  cargando = false;
  cargando22 = false;
  fechaDesde = new Date();
  fechaHasta = new Date();
  locales: Array < any > ;
  local = '';
  offset = 0;
  documentos = [];
  tipoDoc = [];

  abriendoDetalle: string;
  detalleAbierto: string;

  constructor(public DocsSS: DocumentserviceService,
              public comunSS: ComunserviceService) {}

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
    this.comunSS.retrieveTipoDocumento('limit=50&fields=[href,id,name,codesii,iselectronicdocument]')
      .subscribe((resultado: any) => {
        // console.log( 'resultado tipos de documentos->', resultado.items );
        this.tipoDoc = [];
        resultado.items.forEach(fila => {
          this.tipoDoc.push({
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

  detalleOnOff(data) {
    // consoleconsole.log('detalleOnOff: ', data);
    const abrirDetalle = this.detalleAbierto !== data.folio;
    if (abrirDetalle) {
      this.detalleAbierto = undefined;
      this.abriendoDetalle = data.folio;
      this.DocsSS.retrieveDetail(data.detalle).subscribe(
        (deta: any) => {
          // console.log(deta);
          setTimeout(() => {
            this.detalleAbierto = data.folio;
            // console.log('detalleAbierto: ', this.detalleAbierto);
          }, 50);

          this.abriendoDetalle = undefined;
          data.abierto = true;
          if (data.itemes.length === 0) {
            deta.items.forEach(fila => {
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
          }
          this.decoItems(data);
        },
        err => {
          // console.error(err);
          this.abriendoDetalle = undefined;
          this.detalleAbierto = undefined;
        }
      );
    } else {
      this.abriendoDetalle = undefined;
      this.detalleAbierto = undefined;
    }

  }
  decoItems(data) {
    data.itemes.forEach(fila => {
      this.DocsSS.retrieveDetail('https://api.bsale.cl/v1/products/' + fila.variantID + '.json')
        .subscribe((deta: any) => {
          fila.descripcion = deta.name;
          // data.abierto = true;
        });
    });
  }

  marcarTodos() {
    this.documentos.forEach( fila => {
      fila.marcado = !fila.marcado;
    });
  }

      // this.DocsSS.test('ksp_buscarUsuario', {
    //     email: 'pamela.olguin@babycenterstore.cl ',
    //     pssw: '13687',
    //     sistema: 'traspasos'
    //   })
    //   .subscribe(datos => console.log(datos));
  trasladarMarcados() {
    let ntotal = 0;
    let traspasados = 0;
    const query = '';
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
        let query = 'id,codeSii,electronico,folio,emision,vencimiento,monto,neto,iva,informadoSII,cliente,clienteCode,clienteNomb,clienteacti,clientecity,clientemuni,clienteaddr,sucursal,sucursalnom,nombreDoc\n';
        this.documentos.forEach( fila => {
          if ( fila.marcado ) {
            //
            // tslint:disable-next-line: max-line-length
            query += `${fila.id},'${fila.codeSii}',${fila.electronico},'${fila.folio}',${fila.emision.toISOString()}','${fila.vencimiento.toISOString()}',${fila.monto},${fila.neto},${fila.iva},'${fila.informadoSII}','${fila.cliente}','${fila.clienteCode}','${fila.clienteNomb}','${fila.clienteacti}','${fila.clientecity}','${fila.clientemuni}','${fila.clienteaddr}','${fila.sucursal}','${fila.sucursalnom}','${fila.nombreDoc}'\n`;
            //
            /*
            query = `exec ksp_guardaDocumentos_bsale
            ${fila.id},'${fila.codeSii}',${fila.electronico},'${fila.folio}',
            ${fila.emision.toISOString()}','${fila.vencimiento.toISOString()}',${fila.monto},${fila.neto},${fila.iva},'${fila.informadoSII}',
            '${fila.cliente}','${fila.clienteCode}','${fila.clienteNomb}','${fila.clienteacti}','${fila.clientecity}','${fila.clientemuni}','${fila.clienteaddr}',
            '${fila.sucursal}','${fila.sucursalnom}','${fila.nombreDoc}','${fila.detalle}'`
            //
            this.DocsSS.enviarDocumento( query )
                .subscribe( (res: any) => {
                  ++traspasados;
                  this.cargando = false;
                  if ( res.resultado === 'ok'  ) {
                    //
                    fila.traspasado = true;
                    //
                    if ( traspasados === ntotal ) {
                      this.cargando = false;
                    }
                  }
                });
            */
          }
        });
        console.log( query );

        // console.table( this.documentos );
      }
    });
  }

  // Version con observables
  obsConsultaDocs() {
    this.cargando22 = true;
    // console.log(121212);
    this.obsRescataDocumentos().subscribe(
      data => {
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
          // if (doc.client) { console.log( doc.client.href ); }
          return {
            id:           doc.id,
            folio:        doc.number,
            emision:      this.comunSS.unixTime2Fecha(doc.emissionDate),
            vencimiento:  this.comunSS.unixTime2Fecha(doc.expirationDate),
            monto:        doc.totalAmount,
            neto:         doc.netAmount,
            iva:          doc.taxAmount,
            informadoSII: (doc.informedSii === 0) ? 'Correcto' :
                          (doc.informedSii === 1) ? 'Enviado' :
                          (doc.informedSii === 2) ? 'Rechazado' : '???',
            // cliente:      (doc.client) ? doc.client.href + '?fields=[company,code,activity,city,municipality,address]' : 'n/n',
            cliente:      (doc.client) ? doc.client.href : 'n/n',
            clienteCode:  '',
            clienteNomb:  'n/n',
            clienteacti:  '',
            clientecity:  '',
            clientemuni:  '',
            clienteaddr:  '',
            sucursal:     doc.office.id,
            sucursalnom:  '',
            tipoDoc:      doc.document_type.href,
            codeSii:      '',
            nombreDoc:    '',
            electronico:  false,
            detalle:      doc.details.href,
            itemes:       [],
            abierto:      false,
            marcado:      false,
            traspasado:   false,
            mensajeError: ''
          };
        });

        // ordena por fechas
        // Debiera ser una funcion que retorne un nuevo arreglo ordenado y
        // que reciba un arreglo como parametro
        docs = docs.sort((a, b) => {
          if (a.emision > b.emision) {
            return 1;
          }
          if (a.emision < b.emision) {
            return -1;
          }
          return 0;
        });

        // rescatar otros datos
        let pos = -1;
        docs.forEach(fila => {
          // clientes
          if (fila.cliente !== 'n/n') {
            //
            this.DocsSS.retrieveDetail(fila.cliente)
              .subscribe( ( resultado: any) => {
                // console.log(11111, resultado);
                fila.clienteCode = resultado.code;
                fila.clienteNomb = resultado.company;
                fila.clienteacti = resultado.activity;
                fila.clientecity = resultado.city;
                fila.clientemuni = resultado.municipality;
                fila.clienteaddr = resultado.address;
              });
          }
          // tipo de documento
          pos = this.tipoDoc.findIndex(tipos => fila.tipoDoc === tipos.href);
          if (pos > -1) {
            fila.codeSii     = this.tipoDoc[pos].codeSii;
            fila.nombreDoc   = this.tipoDoc[pos].nombre;
            fila.electronico = this.tipoDoc[pos].electronico === 1 ? true : false;
          }
          //
        });
        // Finalmente asigna los resultados
        this.documentos = docs;
        this.cargando22 = false;
      },
      err => { console.error(err); }
    );
  }
  obsRescataDocumentos() {
    // console.log('obsRescataDocumentos');
    if (!this.fechaDesde || !this.fechaHasta || this.local === '') {
      this.cargando = false;
      this.comunSS.mensaje('Error!', 'Selección vacía. Complete los datos de Local y fechas y reintente.');
      throwError('ERROR No se puede rescatar informacion si no se indican parametros.');
    } else {
      this.cargando = false;
      this.documentos = [];
      //
      const fechaDesdeUnix = this.comunSS.fechas2UnixTime(this.fechaDesde, true);
      const fechaHastaUnix = this.comunSS.fechas2UnixTime(this.fechaHasta, false);
      //
      let params = 'limit=1' + /* un dato para obtener la cantidad del rango */
                   '&offset=' + this.offset.toString() +
                   '&officeid=' + this.local +
                   '&emissiondaterange=[' + fechaDesdeUnix.toString() + ',' + fechaHastaUnix.toString() + ']';
      //
      let totalDocs = 0;

      // hace la 1era peticion para obtener el conteo de documentos
      return this.DocsSS.retrieveDocs(params)
          .pipe(
              switchMap((resultado: any) => {
              // console.log('obsRescataDocumentos', resultado);
              totalDocs = resultado.count;
              const peticiones: Array<Observable<any>> = [];
              if (totalDocs === 0) {
                this.comunSS.mensaje('SIN DATOS',
                                     'La combinación de Local y las fechas no encuentra resultados. Corrija y reintente.');
                throwError('ERROR La combinación de Local y las fechas no encuentra resultados. Corrija y reintente.');
              } else {
                const vueltas = Math.ceil(totalDocs / 25);
                for (let index = 0; index < vueltas; index++) {
                  params = 'limit=25' +
                           '&offset=' + (index === 0 ? 0 : index * 25).toString() +
                           '&officeid=' + this.local +
                           '&emissiondaterange=[' + fechaDesdeUnix.toString() + ',' + fechaHastaUnix.toString() + ']';
                  // console.log(params);
                  // Construye un arreglo con todas las peticiones que se van a realizar
                  // OJO NO SE SUSCRIBE A LAS PETICIONES
                  peticiones.push(this.DocsSS.retrieveDocs(params));
                }
              }
              // Retorna un unico observable que ejecuta todas las peticiones de manera simultanea.
              // Esto va a devolver un arreglo de respuestas, y se v aa demorar lo que se demore la mas lenta.
              return forkJoin(peticiones);
            })
          );
    }
  }

}

