import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';

import { Subscription, Subject, throwError } from 'rxjs';
import { ModalService } from '../../../../shared/services/modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProyectosService } from '../../proyectos.service';
import { ClientesService } from '../../../clientes/clientes.service';
import { takeUntil, catchError, tap, map } from 'rxjs/operators';
import { Proyecto } from '../../../../shared/modelos/proyecto';
import { Cliente } from '../../../../shared/modelos/cliente';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AccionSobreObjeto, MsgObjeto} from '../../../../shared/modelos/mensajes/msg-proyecto';
import { AuthService } from '../../../../usuarios/auth.service';


interface ClientesSelect {
  idCliente: Cliente;
  idDescripcion: string;
}

@Component({
  selector: 'app-proyecto-form',
  templateUrl: './proyecto-form.component.html',
  styleUrls: ['./proyecto-form.component.css']
})
export class ProyectoFormComponent implements OnInit, OnDestroy {
  modalTitle: string;
  modalPrompt: string;
  // modalObj: Proyecto;
  clientes: Cliente[];
  clientesSelect: ClientesSelect[];

  private unsubscribe$ = new Subject();

  @Input() proyecto: Proyecto;
  @Output() messageToEmit = new EventEmitter<MsgObjeto>();

  constructor(
    private clientesService: ClientesService,
    public activeModal: NgbActiveModal,
    private router: Router,
    public authService: AuthService) {
  }

  ngOnInit() {
    this.subscripcionClientes();
  }

  subscripcionClientes() {
    this.clientesService.getClientes(0)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((response: any) => {
        })
      )
      .subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          // this.paginador = response;
          this.generarClientesSelect();
        },
        err => {
          swal.fire('Error carga de clientes ', 'error grave', 'error');
        }
      );
  }

  update (proyecto) {

    console.log(proyecto);

    const msg: MsgObjeto = {
      accion: AccionSobreObjeto.ACTUALIZAR,
      objeto: proyecto
    };
     this.messageToEmit.emit(msg);
   }

   create (proyecto: Proyecto) {
     this.messageToEmit.emit({ accion: AccionSobreObjeto.CREAR,
                               objeto: proyecto
                              });
   }

  private generarClientesSelect() {
    this.clientesSelect = this.clientes.map(item => {
      return {
        idCliente: item,
        idDescripcion: item.empresa + '.' + item.cliente + ' ' + item.inicio
      };
    });
    console.log('generarClientesSelect');
    console.log (this.proyecto);
    console.log (this.clientesSelect);
  }

  public objectComparisonFunction = function( cli, value ): boolean {
    console.log ('objectComparisonFunction');
    console.log (cli);
    console.log (value);
    if (cli === undefined || value === undefined ||
        cli === null || value === null) {
      return false;
    } else {
     return cli.id === value.id;
    // return false;

    }
  };

  // onButtonCancel(): void {
  //   this.router.navigate(['/proyecto/page', 0]);
  // }

  ngOnDestroy(): void {
    console.log('ngOnDestroy (), realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
