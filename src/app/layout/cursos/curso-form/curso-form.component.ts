import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Curso } from '../../../shared/modelos/curso';
import { CursosService } from '../cursos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import swal from 'sweetalert2';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-curso-form',
  templateUrl: './curso-form.component.html',
  styleUrls: ['./curso-form.component.scss'],
  // providers: [CursosService]
})
export class CursoFormComponent implements OnInit, OnDestroy {
  public titulo = 'Alta / Modificación de Clientes';
  public curso: Curso = new Curso();
  private subscriptionParams$: Subscription = null;
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject();
  public erroresValidacion: string[];

  constructor(
    private cursosService: CursosService,
    private router: Router,
    public modalService: ModalService,
    public activeModal: NgbActiveModal,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  /* create
- Aquí en el controlador:
   No se captura el error (catchError), pero el error se puede manejar en el segundo parametro de la subscripción
En el servicio:
   no se captura error
*/
  public create(curso: Curso): void {
    this.observ$ = this.cursosService.create(curso).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          // this.router.navigate(['/cursos']);

          // this.activeModal.close(true);
          // el cierre del modal se podría hacer con:
          this.modalService.eventoCerrarModalScrollable.emit();

          // en lugar de activModal.close(true), se podría emitir evento 
          // para cerrar modal con:
          // this.modalService.eventoCerrarModalScrollable.emit();
          // podriamos emitir este evento para cerrar modal con la 
          // subscripcion que se hace con subscripcioneventoCerrarModalScrollable()
          // desde CursosComponent

          swal.fire('Nuevo curso', `${json.mensaje} - ${json.curso.nombre}`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            // this.router.navigate(['/cursos']);
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error en alta de cursos', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  public update(curso: Curso): void {
    this.observ$ = this.cursosService.update(curso).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          this.modalService.eventoCerrarModalScrollable.emit();
          swal.fire('Actualización ', `${json.mensaje} - (id=${json.curso.id})`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            // this.router.navigate(['/cursos']);
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error en actualización curso', `error.status = ${err.status.toString()}`, 'error');
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

