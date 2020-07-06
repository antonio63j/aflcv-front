import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { takeUntil, tap, map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalService } from '../../shared/services/modal.service';
import { ClientesService } from './clientes.service';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';

import { Cliente } from '../../shared/modelos/cliente';

import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})


export class ClientesComponent implements OnInit, OnDestroy {

  clientes: Cliente[];
  cliente: Cliente = new Cliente();
  private page: number;
  private unsubscribe$ = new Subject();
  private subscriptionParams$: Subscription = null;

  private tituloBody: string;
  private clienteNombre: string;
  private pagina: number;

  constructor(
    private clientesService: ClientesService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private modalConModeloService: ModalConModeloService,
    private router: Router,
  ) {
  }

  ngOnInit() {
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
    this.tituloBody = 'Todos los clientes';
    this.tituloBody = '';
    this.nuevaPagina(0);
  }

  nuevaPagina(pagina: number) {
    this.pagina = pagina;
    this.nuevaPaginaContinuar(this.clientesService.getClientes(pagina));
  }

  nuevaPaginaContinuar(observable: Observable<any>) {
    observable.pipe(
      takeUntil(this.unsubscribe$),
      tap((response: any) => {
        // console.log(response);
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.empresa = cliente.empresa.toUpperCase();
          cliente.cliente = cliente.cliente.toUpperCase();
          return cliente;
        });
        return response;
      }),
    ).subscribe(
      response => {
        this.clientes = (response.content as Cliente[]);
        // this.paginador = response;
      }
      , err => {
        console.log(err);
        swal.fire('Error carga de clientes ', err.message, 'error');
      }
    );
  }

  public update(cliente: Cliente): void {

    this.modalConModeloService.openModalScrollable(
      ClienteFormComponent,
      { size: 'lg', backdrop: 'static', scrollable: true },
      cliente,
      'clienteFinal',
      'Los campos con * son obligatorios',
      'Datos del cliente'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      console.log({ confirmedResult: result });
      this.clientesService.getClientes(this.pagina).subscribe(respon => {
        this.clientes = respon.content as Cliente[];
        // this.paginador = respon;
      });
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
