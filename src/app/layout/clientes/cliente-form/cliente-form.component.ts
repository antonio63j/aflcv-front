import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalService } from '../../../shared/services/modal.service';
import { ClientesService } from '../clientes.service';
import { Cliente } from '../../../shared/modelos/cliente';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import swal from 'sweetalert2';
import { AuthService } from '../../../usuarios/auth.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})

export class ClienteFormComponent implements OnInit, OnDestroy {
  public titulo = 'Alta / Modificación de Clientes';
  public clienteFinal: Cliente = new Cliente();
  private subscriptionParams$: Subscription = null;
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject();
  public erroresValidacion: string[];
  private editar = this.authService.hasRole('ROLE_USER');
  private accesibleToolbar = this.authService.hasRole('ROLE_USER');
  private visibleToolbar = this.authService.hasRole('ROLE_USER');

  configActividad: AngularEditorConfig = {
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
    placeholder: 'Introducir texto para describir la actividad desempeñada',
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

  configExperiencia: AngularEditorConfig = {
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
    placeholder: 'Introducir texto para describir la experiencia adquirida',
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

  constructor(
    private clientesService: ClientesService,
    private router: Router,
    public modalService: ModalService,
    public activeModal: NgbActiveModal,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService) { }

  ngOnInit() {
  }

  /* create
- Aquí en el controlador:
   No se captura el error (catchError), pero el error se puede manejar en el segundo parametro de la subscripción
En el servicio:
   no se captura error
*/
  public create(cliente: Cliente): void {
    this.observ$ = this.clientesService.create(cliente).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          // this.router.navigate(['/clientes']);

          // this.activeModal.close(true);
          // el cierre del modal se podría hacer con:
          this.modalService.eventoCerrarModalScrollable.emit();

          // en lugar de activModal.close(true), se podría emitir evento 
          // para cerrar modal con:
          // this.modalService.eventoCerrarModalScrollable.emit();
          // podriamos emitir este evento para cerrar modal con la 
          // subscripcion que se hace con subscripcioneventoCerrarModalScrollable()
          // desde ClientesComponent

          swal.fire('Nuevo cliente', `${json.mensaje} - ${json.cliente.nombre}`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            // this.router.navigate(['/clientes']);
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error en alta de clientes', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  public update(cliente: Cliente): void {
    this.observ$ = this.clientesService.update(cliente).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          this.modalService.eventoCerrarModalScrollable.emit();
          swal.fire('Actualización ', `${json.mensaje} - (id=${json.cliente.id})`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error en actualización cliente', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  ngOnDestroy(): void {
    console.log('FormComponent.ngOnDestroy (), realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.observ$ != null && !this.observ$.closed) {
      console.log('haciendo : this.observ$.unsubscribe()');
      this.observ$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.observ$.unsubscribe()');
    }


    if (this.subscriptionParams$ != null && !this.subscriptionParams$.closed) {
      console.log('haciendo : this.subscriptionParams$.unsubscribe()');
      this.subscriptionParams$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.subscriptionParams$.unsubscribe()');
    }
  }

}

