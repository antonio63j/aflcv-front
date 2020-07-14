import { Component, OnInit } from '@angular/core';
import { AccionSobreObjeto, MsgObjeto } from '../../../shared/modelos/mensajes/msg-proyecto';
import { Proyecto } from '../../../shared/modelos/proyecto';
import { ProyectosService } from '../proyectos.service';
import { takeUntil, catchError } from 'rxjs/operators';
import { throwError, Subscription, Subject } from 'rxjs';
import { ModalService } from '../../../shared/services/modal.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-proyecto-panel',
  templateUrl: './proyecto-panel.component.html',
  styleUrls: ['./proyecto-panel.component.css']
})
export class ProyectoPanelComponent implements OnInit {
  public proyecto: Proyecto;
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject();
  public erroresValidacion: string[];

  constructor(
    private proyectosService: ProyectosService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
  }

  public cerrarModal() {
    this.modalService.eventoCerrarModalScrollable.emit();
  }

  gestionProyecto(msgProyecto: MsgObjeto) {
    if (msgProyecto.accion === AccionSobreObjeto.ACTUALIZAR) {
      const proy: Proyecto = msgProyecto.objeto as Proyecto;
      this.update(proy);
    }

    if (msgProyecto.accion === AccionSobreObjeto.CREAR) {
      const proy: Proyecto = msgProyecto.objeto as Proyecto;
      this.create (proy);
    }
  }

  public create(proyecto: Proyecto): void {
    this.observ$ = this.proyectosService.create(proyecto).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          // this.modalService.eventoCerrarModalScrollable.emit();
          //  this.activeModal.close(true);
          this.modalService.eventoCerrarModalScrollable.emit();
          swal.fire('Nuevo proyecto', `${json.mensaje} - ${json.proyecto.nombre}`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error en alta de proyectos', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  public update(proyecto: Proyecto) {
    this.erroresValidacion = [];
    this.observ$ = this.proyectosService.update(proyecto).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        console.error('Se captura el error con catchError(err) y se vuelve a lanzar con throwError(err)', err);
        return throwError(err);
      })
    )
      .subscribe(
        proy => {
          this.modalService.eventoCerrarModalScrollable.emit();
          swal.fire(proy.nombre.substring(0, 14) + '...', 'actulizado', 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.error(this.erroresValidacion);
          } else {
            console.error(err);
            //swal.fire('Error al actualizar proyecto', err.error.error, 'error');
          }
        }
      );
  }





}
