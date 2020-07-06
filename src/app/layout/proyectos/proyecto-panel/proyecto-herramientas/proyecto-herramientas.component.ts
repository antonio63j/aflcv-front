import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource  } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Proyecto } from '../../../../shared/modelos/proyecto';
import { IHerramienta, Herramienta } from '../../../../shared/modelos/herramienta';
import { AccionSobreObjeto, MsgObjeto } from '../../../../shared/modelos/mensajes/msg-proyecto';
import { ModalService } from '../../../../shared/services/modal.service';
import { HerramientasService } from '../../../herramientas/herramientas.service';
import { takeUntil, tap, map } from 'rxjs/operators';

import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../usuarios/auth.service';

@Component({
  selector: 'app-proyecto-herramientas',
  templateUrl: './proyecto-herramientas.component.html',
  styleUrls: ['./proyecto-herramientas.component.css']
})
export class ProyectoHerramientasComponent implements OnInit, AfterViewInit  {

  @Input() proyecto: Proyecto;
  @Output() messageToEmit = new EventEmitter<MsgObjeto>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // displayedColumns: string[] = ['select', 'id', 'nombre', 'tipo', 'nivel', 'comentario'];
  displayedColumns: string[] = ['select', 'nombre', 'tipo', 'nivel', 'comentario'];
  public dataSource: MatTableDataSource<IHerramienta>;
  public selection: SelectionModel<IHerramienta>;

  public herramientas: Herramienta[];
  private unsubscribe$ = new Subject();

  constructor(
    private modalService: ModalService,
    private herramientasService: HerramientasService,
    public authService: AuthService
  ) {

  }

  miFiltro(fila: any) {
    const f: number = fila.id;
    const index = 1;
    // const index = this.proyecto.herramientas.findIndex(x => x.id === f);
    console.log(f);
    console.log(index);
    if (index >= 0) {
      //  return (f === this.proyecto.herramientas[index].id);
      return false;
    } else { return false; }
    // row.position === (ELEMENT_DATA_SEL.findIndex(x => x.position === row.position) )   )
  }

  ngOnInit() {
    this.herramientas = [];
    this.getHerramientasTodas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getHerramientasTodas() {
    this.herramientasService
      .getHerramientasTodas()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((response: any) => {
          // console.log(response);
        }),
        map((response: any) => {
          (response as Herramienta[]).map(herramienta => {
            herramienta.nombre = herramienta.nombre.toUpperCase();
            return herramienta;
          });
          return response;
        })
      )
      .subscribe(
        response => {
          // this.paginador = response;

          const hr2: Herramienta[] = [];

          this.herramientas = response as Herramienta[];
          this.dataSource = new MatTableDataSource<IHerramienta>(this.herramientas);

          let k = 0;
          for (let i = 0; i < this.proyecto.herramientas.length; ++i) {
            for (let j = 0; j < this.dataSource.data.length; ++j) {
              if (this.proyecto.herramientas[i].id === this.dataSource.data[j].id) {
                hr2 [k] = this.dataSource.data[j];
                k = k + 1;
              }
            }
          }
          this.selection = new SelectionModel<IHerramienta>(true, hr2);
        },
        err => {
          console.log (err);
          swal.fire('Error carga de herramientas ', 'error grave', 'error');
        }
      );
  }

  update(proyecto) {
    proyecto.herramientas = this.selection.selected;
    console.log(proyecto.herramientas);
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: IHerramienta): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"}`;
    // } row ${row.position + 1}`;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
