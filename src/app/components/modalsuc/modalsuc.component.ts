import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ComunserviceService } from '../../../services/comunservice.service';
 
@Component({
  selector: 'modal-service',
  templateUrl: './modalsuc.component.html'
})
export class ModalsucComponent implements OnInit {
  
  modalRef: BsModalRef;

  @Input()  data: any = {};
  @Input()  locales: any = [];
  @Output() sucursalSeleccionada: EventEmitter<object>;
  
  local = '';
  nombre = '';

  constructor( private modalService: BsModalService ) {
    this.sucursalSeleccionada = new EventEmitter();
  }
 
  ngOnInit() {}

  cambiandoLocal() {
    console.log( this.local );
  }

  async actualizar() {
    if ( this.local ) {
      const resultado = await this.locales.find( loc => loc.codigo === parseInt(this.local) );
      // console.log('actualilzar !!!!', resultado, this.local  );
      this.sucursalSeleccionada.emit( { codigo: resultado.codigo,
                                        nombre: resultado.nombre,
                                        empresa: this.data.empresa,
                                        sucursal: this.data.kosu } ) ;
      this.modalRef.hide();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
