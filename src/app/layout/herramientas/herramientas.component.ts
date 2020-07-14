
import { TranslateService } from '@ngx-translate/core';
import { HerramientasService } from './herramientas.service';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../shared/services/modal.service';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, take } from 'rxjs/operators';

import { HerramientaFormComponent } from './herramienta-form/herramienta-form.component';
import { TiposHerramientasService } from '../../shared/services/tipos-herramientas.service';

import Swal from 'sweetalert2';
import swal from 'sweetalert2';
import { Herramienta } from '../../shared/modelos/herramienta';

// import { debug } from 'util';

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
    allowOutsideClick: false
});

@Component({
    selector: 'app-herramientas',
    templateUrl: './herramientas.component.html',
    styleUrls: ['./herramientas.component.scss'],
    animations: [routerTransition()],
    // providers: [herramientasService]
})

export class HerramientasComponent implements OnInit, OnDestroy {
    herramientas: Herramienta[];
    herramienta: Herramienta = new Herramienta();
    private pagina: number;
    private unsubscribe$ = new Subject();
    public paginador: any;
    private subscriptionParams$: Subscription = null;
    // private subscriptionEvents$: Subscription = null;
    public tipoHerramienta: string = null;
    private proyectoNombre: string = null;
    private cabecera: string = null;

    constructor(
        private herramientasService: HerramientasService,
        private modalConModeloService: ModalConModeloService,
        private modalService: ModalService,
        private translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        private tiposHerramientasService: TiposHerramientasService
    ) {
        this.herramientas = [];
    }

    ngOnInit() {
       // this.nuevaPagina(0);
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
        this.tipoHerramienta = params.tipo; // o +params.get('tipo');
        this.proyectoNombre = params.proyecto;
        if (!this.tipoHerramienta) {
          this.tipoHerramienta = 'TODOS';
          // consulta generica o consulta por proyecto (que no requiere paginacion, va por servicio)
          if (!this.proyectoNombre) {
            // es consulta generica
            this.cabecera = 'todas las herramientas';
            this.nuevaPagina(0);
          } else {
            // se trata de un consulta por proyecto
            console.log('proyecto:' + this.proyectoNombre);
           // this.herramientas = this.proyectoService.getHerramientasDelProyecto();
            this.cabecera = 'proyecto ' + this.proyectoNombre;
            // this.nuevaPagina(0);
          }
        } else {
          // es consulta por Herramienta por tipo
          this.cabecera = 'tipo herramienta ' + this.tipoHerramienta;
          this.nuevaPagina(0);
        }
      }

    public getPagina(pagina: number) {
        this.nuevaPagina(pagina);
    }

    nuevaPagina(pagina: number) {
        this.pagina = pagina;
        this.herramientasService
            .getHerramientas(pagina, this.tipoHerramienta)
            .pipe(
                takeUntil(this.unsubscribe$),
                tap((response: any) => {
                    // console.log(response);
                }),
                map((response: any) => {
                    (response.content as Herramienta[]).map(herramienta => {
                        herramienta.nombre = herramienta.nombre.toUpperCase();
                        return herramienta;
                    });
                    return response;
                })
            )
            .subscribe(
                response => {
                    this.herramientas = response.content as Herramienta[];
                    this.paginador = response;
                    console.log('test');
                    console.log(this.herramientas);
                },
                err => {
                    swal.fire('Error carga de herramientas ', 'error grave', 'error');
                }
            );
    }

    public crear(): void {

        // this.modalConModeloService.openModalScrollable(
        //     this.herramienta, 'todos los campos son obligatorios',
        //     'Datos del herramienta'
        // ).pipe(
        //     take(1) // take() manages unsubscription for us
        // ).subscribe(result => {
        //     console.log({ confirmedResult: result });
        // });


        this.modalConModeloService.openModalScrollable(
            HerramientaFormComponent,
            { size: 'md', backdrop: 'static', scrollable: true},
            this.herramienta,
            'herramienta',
            'Los campos con * son obligatorios',
            'Datos de la herramienta'
        ).pipe(
            take(1) // take() manages unsubscription for us
        ).subscribe(result => {
            console.log({ confirmedResult: result });
            this.herramientasService.getHerramientas(this.pagina, this.tipoHerramienta).subscribe(respon => {
                this.herramientas = respon.content as Herramienta[];
                this.paginador = respon;
            });
        });

    }

    public update(herramienta: Herramienta): void {
        this.modalConModeloService.openModalScrollable(
            HerramientaFormComponent,
            { size: 'lg', backdrop: 'static', scrollable: true },
            herramienta,
            'herramienta',
            'todos los campos son obligatorios',
            'Datos de la herramienta'
        ).pipe(
            take(1) // take() manages unsubscription for us
        ).subscribe(result => {
            console.log({ confirmedResult: result });
            this.herramientasService.getHerramientas(this.pagina, this.tipoHerramienta).subscribe(respon => {
                this.herramientas = respon.content as Herramienta[];
                this.paginador = respon;
            });
        });
    }

    delete(herramienta: Herramienta): void {
        swalWithBootstrapButtons.fire({
            title: '¿Estás seguro?',
            text: `Eliminarás el herramienta ${herramienta.nombre}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                this.herramientasService.delete(herramienta).subscribe(
                    response => {
                        if (this.paginador.numberOfElements === 1) {
                            this.pagina = 0;
                        }
                        this.herramientasService.getHerramientas(this.pagina, this.tipoHerramienta).subscribe(respon => {
                            this.herramientas = respon.content as Herramienta[];
                            this.paginador = respon;
                        });
                        swalWithBootstrapButtons.fire(
                            `Eliminada la herramienta ${herramienta.nombre}!`,
                            'uno menos',
                            'success'
                        );
                    }
                    , err => {
                        console.log(err);
                        swal.fire('Error al eliminar herramienta', err.error.error, 'error');
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

    getKeyView(key): string {
        return this.tiposHerramientasService.getKeyView (key);
    }

    ngOnDestroy(): void {
        console.log('realizando unsubscribes');
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}



