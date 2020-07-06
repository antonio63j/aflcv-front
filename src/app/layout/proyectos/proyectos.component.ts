import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { takeUntil, tap, map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { Proyecto } from '../../shared/modelos/proyecto';
import { ProyectosService } from './proyectos.service';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../shared/services/modal.service';
import { ProyectoFormComponent } from './proyecto-panel/proyecto-form/proyecto-form.component';

import Swal from 'sweetalert2';
import swal from 'sweetalert2';
import { routerTransition } from '../../router.animations';
import { ProyectoPanelComponent } from './proyecto-panel/proyecto-panel.component';
import { AuthService } from '../../usuarios/auth.service';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
  allowOutsideClick: false
});

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
  animations: [routerTransition()],

})
export class ProyectosComponent implements OnInit, OnDestroy {

  proyectos: Proyecto[];
  proyecto: Proyecto = new Proyecto();
  private page: number;
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject();
  public paginador: any;
  private subscriptionParams$: Subscription = null;
  private subscriptionEvents$: Subscription = null;
  private cliente: string;
  private tituloBody: string;
  private clienteNombre: string;
  private pagina: number;

  constructor(
    private proyectosService: ProyectosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalConModeloService: ModalConModeloService,
    private modalService: ModalService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.subscripcioneventoCerrarModalScrollable();
    this.subscripcionGestionParams();
  }

  subscripcionGestionParams() {
    this.subscriptionParams$ = this.activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(params => this.gestionParams(params));
  }

  gestionParams(params: any): void {
    console.log(params);
    this.cliente = params.idCliente; // o +params.get('tipo');
    this.clienteNombre = params.nombre;
    if (!this.cliente) {
      this.cliente = null;
      this.tituloBody = 'Todos los proyectos';
      this.nuevaPagina(0);
    } else {
      if (!this.clienteNombre) {
        this.clienteNombre = '';
      }
      this.tituloBody = 'Lista de proyectos del cliente ' + this.clienteNombre;
      this.nuevaPaginaPorCliente(0, this.cliente);
    }
  }

  subscripcionGestionParams2() {
    this.subscriptionParams$ = this.activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(params => this.gestionParams2(params));
  }

  gestionParams2(params: any): void {
    this.cliente = params.idCliente; // o +params.get('tipo');
    this.clienteNombre = params.nombre;
    if (!this.cliente) {
      this.cliente = null;
      this.tituloBody = 'Todos los proyectos';
      this.nuevaPagina(0);
    } else {
      if (!this.clienteNombre) {
        this.clienteNombre = '';
      }
      this.tituloBody = 'Lista de proyectos del cliente ' + this.clienteNombre;
      this.nuevaPaginaPorCliente(0, this.cliente);
    }
  }

  // llamado desde paginador (componente hijo)
  public getPagina(pagina: number) {
    if (!this.cliente) {
      this.nuevaPagina(pagina);
    } else {
      this.nuevaPaginaPorCliente(pagina, this.cliente);
    }
  }

  nuevaPagina(pagina: number) {
    this.pagina = pagina;
    this.nuevaPaginaContinuar(this.proyectosService.getProyectos(pagina));
  }

  nuevaPaginaPorCliente(pagina: number, cliente: string) {
    this.pagina = pagina;
    this.nuevaPaginaContinuar(this.proyectosService.getProyectosPorCliente(pagina, cliente));
  }

  nuevaPaginaContinuar(observable: Observable<any>) {
    observable.pipe(
      takeUntil(this.unsubscribe$),
      tap((response: any) => {
        // console.log(response);
      }),
      // map((response: any) => {
      //   (response.content as Proyecto[]).map(proyecto => {
      //     proyecto.nombre = proyecto.nombre.toUpperCase();
      //     return proyecto;
      //   });
      //   return response;
      // }),
    ).subscribe(
      response => {
        this.proyectos = (response.content as Proyecto[]);
        this.paginador = response;
      }
      , err => {
        console.log(err);
        swal.fire('Error carga de proyectos ', err.message, 'error');
      }
    );
  }

  public crear(): void {
    this.lanzarModal(this.proyecto);
  }

  public update(proyecto: Proyecto): void {
    this.lanzarModal(proyecto);
  }

  lanzarModal(proyecto: Proyecto) {
    this.modalConModeloService.openModalScrollable(
      ProyectoPanelComponent,
      {
        size: 'lg', backdrop: 'static',
        scrollable: true
      },
      proyecto,
      'proyecto',
      'todos los campos son obligatorios',
      'Detalle del proyecto'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      console.log({ confirmedResult: result });
      if (this.cliente) {
        this.proyectosService.getProyectosPorCliente(this.pagina, this.cliente)
          .subscribe(respon => {
            this.proyectos = respon.content as Proyecto[];
            this.paginador = respon;
          });
      } else {
        this.proyectosService.getProyectos(this.pagina)
          .subscribe(respon => {
            this.proyectos = respon.content as Proyecto[];
            this.paginador = respon;
          });

      }
    });

  }

  delete(proyecto: Proyecto): void {
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás el proyecto ${proyecto.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.proyectosService.delete(proyecto).subscribe(
          response => {
            if (this.paginador.numberOfElements === 1) {
              this.pagina = 0;
            }
            this.proyectosService.getProyectos(this.pagina)
              .subscribe(respon => {
                this.proyectos = respon.content as Proyecto[];
                this.paginador = respon;
              });
            swalWithBootstrapButtons.fire(
              `Eliminada la proyecto ${proyecto.nombre}!`,
              'uno menos',
              'success'
            );
          }
          , err => {
            console.log(err);
            swal.fire('Error al eliminar proyecto', err.error.error, 'error');
          }
        );
      }
    });
  }

  subscripcioneventoCerrarModalScrollable() {
    this.modalService.eventoCerrarModalScrollable.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      () => {
        console.log('recibido evento para cerrar modal');
        this.modalConModeloService.closeModalScrollable();
      }
    );
  }

  ngOnDestroy() {
    console.log('ngOnDestroy (), realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

  }

}
