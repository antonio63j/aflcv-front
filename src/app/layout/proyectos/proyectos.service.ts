import { Injectable, OnDestroy } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Proyecto } from '../../shared/modelos/proyecto';

import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Herramienta } from '../../shared/modelos/herramienta';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService implements OnDestroy {

  private herramientas: Herramienta[];

  constructor(private http: HttpClient) {

  }

  getProyectos(page: number): Observable<any> {
    const parametros = new HttpParams()
      .set('page', page.toString())
      .set('size', '12');
    return this.http.get<Proyecto[]>(environment.urlEndPoint + '/api/proyectos/page', { params: parametros })
    .pipe(
      tap((response: any) => {
        // (response.content as Proyecto[]).forEach(exp => console.log(exp));
      })
    );
  }

  getProyectosPorCliente(page: number, idCliente: string): Observable<any> {
    const parametros = new HttpParams()
      .set('cliente', idCliente)
      .set('page', page.toString())
      .set('size', '12');

    return this.http.get<Proyecto[]>(environment.urlEndPoint + '/api/proyectos/cliente', { params: parametros }).pipe(
      tap((response: any) => {
        (response.content as Proyecto[]).forEach(exp => console.log(exp));
      })
      /*       ,
            map((response: any) => {
              (response.content as Curso[]).map(curso => {
                curso.nombre = curso.nombre.toUpperCase();
                return curso;
              });
              return response;
            }) */
    );
  }

  create(proyecto: Proyecto): Observable<any> {
    return this.http.post<Proyecto>(environment.urlEndPoint + '/api/proyectos', proyecto)
      .pipe(
        catchError(err => {

          console.log(`error capturado: ${err.status} `);
          return throwError(err);
        })
      );
  }

  update(proyecto: Proyecto): Observable<any> {
    return this.http.put<Proyecto>(environment.urlEndPoint + '/api/proyecto/' + proyecto.id, proyecto).pipe(
      catchError(err => {
        console.log(`error al actualizar datos del proyecto: ${err.message} `);
        return throwError(err);
      })
      , map((response: any) => response.proyecto as Proyecto)
    );
  }

  delete (proyecto: Proyecto): Observable<any> {
    return this.http.delete<Proyecto>(`${environment.urlEndPoint}/api/proyecto/${proyecto.id}`).pipe(
        catchError(err => {
          console.log(`error al eliminar proyecto: ${err.status} `);
          console.log(`error al eliminar proyecto: ${err.message} `);
          return throwError(err);
        }));
  }

  getProyectoConFiltro(strBusca: string): Observable<any> {
    const parametros = new HttpParams()
      .set('strBusca', strBusca);
    return this.http.get<Proyecto[]>(environment.urlEndPoint + '/api/proyectos/filtro', { params: parametros });
  }

  public setHerramientasDelProyecto(herramientas: Herramienta[]): void {
    this.herramientas = herramientas;
  }

  public getHerramientasDelProyecto(): Herramienta[] {
    return this.herramientas;
  }

  ngOnDestroy() {
    console.log(' en ngOnDestroy() del servicio');
  }
}
