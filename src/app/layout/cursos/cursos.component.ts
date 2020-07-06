import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

import { Curso } from '../../shared/modelos/curso';

import { CursosService } from './cursos.service';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../shared/services/modal.service';
import { CursoFormComponent } from './curso-form/curso-form.component';

// ant
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../usuarios/auth.service';

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
    selector: 'app-cursos',
    templateUrl: './cursos.component.html',
    styleUrls: ['./cursos.component.scss'],
    animations: [routerTransition()],
    // providers: [CursosService]
})



export class CursosComponent implements OnInit, OnDestroy {
    cursos: Curso[];
    curso: Curso = new Curso();
    private pagina: number;

    // private observ$: Subscription;
    private unsubscribe$ = new Subject();
    public paginador: any;
    // private subscriptionParams$: Subscription = null;
    // private subscriptionEvents$: Subscription = null;

    constructor(private cursosService: CursosService,
        private modalConModeloService: ModalConModeloService,
        private modalService: ModalService,
        private translate: TranslateService,
        private authService: AuthService

    ) {
        this.cursos = [];
    }

    ngOnInit() {
        this.nuevaPagina(0);
        this.subscripcioneventoCerrarModalScrollable();
    }

    public getPagina(pagina: number) {
        this.nuevaPagina(pagina);
    }

    nuevaPagina(pagina: number) {
        this.pagina = pagina;
        this.cursosService
            .getCursos(pagina)
            .pipe(
                takeUntil(this.unsubscribe$),
                tap((response: any) => {
                    // console.log(response);
                }),
                map((response: any) => {
                    (response.content as Curso[]).map(curso => {
                        curso.nombre = curso.nombre.toUpperCase();
                        return curso;
                    });
                    return response;
                })
            )
            .subscribe(
                response => {
                    this.cursos = response.content as Curso[];
                    this.paginador = response;
                },
                err => {
                    console.log(err);
                    swal.fire('Error carga de cursos ', err.status, 'error');
                }
            );
    }

    public crear(): void {

        // this.modalConModeloService.openModalScrollable(
        //     this.curso, 'todos los campos son obligatorios',
        //     'Datos del curso'
        // ).pipe(
        //     take(1) // take() manages unsubscription for us
        // ).subscribe(result => {
        //     console.log({ confirmedResult: result });
        // });

        this.modalConModeloService.openModalScrollable(
            CursoFormComponent,
            { size: 'lg', backdrop: 'static', scrollable: true },
            this.curso,
            'curso',
            'Los campos con * son obligatorios',
            'Datos del curso'
        ).pipe(
            take(1) // take() manages unsubscription for us
        ).subscribe(result => {
            console.log({ confirmedResult: result });
            this.cursosService.getCursos(this.pagina).subscribe(respon => {
                this.cursos = respon.content as Curso[];
                this.paginador = respon;
            });
        });

    }

    public update(curso: Curso): void {
        this.modalConModeloService.openModalScrollable(
            CursoFormComponent,
            { size: 'lg', backdrop: 'static', scrollable: true },
            curso,
            'curso',
            'Los campos con * son obligatorios',
            'Datos del curso'
        ).pipe(
            take(1) // take() manages unsubscription for us
        ).subscribe(result => {
            console.log({ confirmedResult: result });
            this.cursosService.getCursos(this.pagina).subscribe(respon => {
                this.cursos = respon.content as Curso[];
                this.paginador = respon;
            });
        });
    }

    delete(curso: Curso): void {
        swalWithBootstrapButtons.fire({
            title: '¿Estás seguro?',
            text: `Eliminarás el curso ${curso.nombre}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                this.cursosService.delete(curso).subscribe(
                    response => {
                        if (this.paginador.numberOfElements === 1) {
                            this.pagina = 0;
                        }
                        this.cursosService.getCursos(this.pagina).subscribe(respon => {
                            this.cursos = respon.content as Curso[];
                            this.paginador = respon;
                        });
                        swalWithBootstrapButtons.fire(
                            `Eliminado el curso ${curso.nombre}!`,
                            'uno menos',
                            'success'
                        );
                    }
                    , err => {
                        console.log(err);
                        // swal.fire('Error al eliminar curso', err.error.error, 'error');
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

    ngOnDestroy(): void {
        console.log('realizando unsubscribes');
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}



