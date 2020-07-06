import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Herramienta } from '../../../shared/modelos/herramienta';
import { HerramientasService } from '../herramientas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import swal from 'sweetalert2';
import { ModalService } from '../../../shared/services/modal.service';
import { TipoHerramienta } from '../../../shared/modelos/tipo-herramienta';
import { FormGroupDirective, FormControl, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TiposHerramientasService } from '../../../shared/services/tipos-herramientas.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

interface Nivel {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-herramienta-form',
  templateUrl: './herramienta-form.component.html',
  styleUrls: ['./herramienta-form.component.scss'],
  // providers: [herramientasService]
})
export class HerramientaFormComponent implements OnInit, OnDestroy {
  public titulo = 'Alta / Modificación de Clientes';
  public herramienta: Herramienta = new Herramienta();
  private subscriptionParams$: Subscription = null;
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject();
  public erroresValidacion: string[];
  public tipoHerramientas: TipoHerramienta[];

  niveles: Nivel[] = [
    { value: 'experto', viewValue: 'Experto' },
    { value: 'alto', viewValue: 'Alto' },
    { value: 'medio', viewValue: 'Medio' },
    { value: 'bajo', viewValue: 'Bajo' },
  ];

  constructor(
    private herramientasService: HerramientasService,
    private router: Router,
    public modalService: ModalService,
    public activeModal: NgbActiveModal,
    private activatedRoute: ActivatedRoute,
    public tiposHerramientasService: TiposHerramientasService

  ) {
    this.tipoHerramientas = tiposHerramientasService.getTipoHerramientas();
  }

  ngOnInit() {
  }

  /* create
- Aquí en el controlador:
   No se captura el error (catchError), pero el error se puede manejar en el segundo parametro de la subscripción
En el servicio:
   no se captura error
*/
  public create(herramienta: Herramienta): void {
    console.log(herramienta);

    this.observ$ = this.herramientasService.create(herramienta).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          // this.router.navigate(['/herramientas']);

          // this.activeModal.close(true);
          // el cierre del modal se podría hacer con:
          this.modalService.eventoCerrarModalScrollable.emit();

          // en lugar de activModal.close(true), se podría emitir evento 
          // para cerrar modal con:
          // this.modalService.eventoCerrarModalScrollable.emit();
          // podriamos emitir este evento para cerrar modal con la 
          // subscripcion que se hace con subscripcioneventoCerrarModalScrollable()
          // desde herramientasComponent

          swal.fire('Nueva herramienta', `${json.mensaje} - ${json.herramienta.nombre}`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            // this.router.navigate(['/herramientas']);
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error en alta de herramientas', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  public update(herramienta: Herramienta): void {
    this.observ$ = this.herramientasService.update(herramienta).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          this.modalService.eventoCerrarModalScrollable.emit();
          swal.fire('Actualización ', `${json.mensaje} - (id=${json.herramienta.id})`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            // this.router.navigate(['/herramientas']);
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error en actualización herramienta', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  onButtonCancel(): void {
    this.router.navigate(['/herramientas']);
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

