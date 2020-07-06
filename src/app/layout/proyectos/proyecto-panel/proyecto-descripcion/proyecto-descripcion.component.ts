import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Proyecto } from '../../../../shared/modelos/proyecto';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { AccionSobreObjeto, MsgObjeto} from '../../../../shared/modelos/mensajes/msg-proyecto';
import { ModalService } from '../../../../shared/services/modal.service';
import { AuthService } from '../../../../usuarios/auth.service';

@Component({
  selector: 'app-proyecto-descripcion',
  templateUrl: './proyecto-descripcion.component.html',
  styleUrls: ['./proyecto-descripcion.component.css']
})
export class ProyectoDescripcionComponent implements OnInit {

  modalTitle: string;
  modalPrompt: string;
  editar = this.authService.hasRole('ROLE_USER');
  accesibleToolbar = this.authService.hasRole('ROLE_USER');
  visibleToolbar = this.authService.hasRole('ROLE_USER');

  @Input() proyecto: Proyecto;
  @Output() messageToEmit = new EventEmitter<MsgObjeto>();

  private observ$: Subscription = null;
  private unsubscribe$ = new Subject();
  private subscriptionParams$: Subscription = null;

  constructor(
    private modalService: ModalService,
    public authService: AuthService
  ) {
  }

    config: AngularEditorConfig = {
      editable: this.editar,
      spellcheck: true,
      height: 'auto',
      minHeight: '110',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '110',
      translate: 'no',
      enableToolbar: this.accesibleToolbar,
      showToolbar: this.visibleToolbar,
      placeholder: 'Introducir texto aquí...',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      defaultFontSize: '3',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'modalTitleText',
        class: 'modalTitleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
    };

  ngOnInit() {

  }

  update (proyecto) {
   const msg: MsgObjeto = {
     accion: AccionSobreObjeto.ACTUALIZAR,
     objeto: proyecto
   };
     console.log(msg);
    this.messageToEmit.emit(msg);
  }

  closeModal() {
    this.modalService.eventoCerrarModalScrollable.emit();

  }
}
