import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Curso } from '../../shared/modelos/curso';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'root'
})

export class CursosService implements OnDestroy {
    modal: any;
    constructor(private http: HttpClient,
        private ngbModal: NgbModal) {
            console.log('en constructor()');
        }
    ngOnDestroy(): void {
        console.log(' en ngOnDestroy()');
        // throw new Error('Method not implemented.');
    }

    getCursos(page: number): Observable<any> {
        const parametros = new HttpParams().set('page', page.toString()).set('size', '12');
        return this.http
            .get<Curso[]>(environment.urlEndPoint + '/api/cursos/page', { params: parametros })
            .pipe(
                tap((response: any) => {
                   // (response.content as Curso[]).forEach(curso => console.log(curso));
                })
            );
    }

    getCursosConFiltro(strBusca: string): Observable<any> {
        const parametros = new HttpParams().set('strBusca', strBusca);
        return this.http.get<Curso[]>(environment.urlEndPoint + '/api/cursos-filtro', {
            params: parametros,
        });
    }

    create(curso: Curso): Observable<any> {
        /* se añade el token con TokenInterceptor
        return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.httpHeader }); */

         return this.http.post<Curso>(environment.urlEndPoint + '/api/cursos', curso).pipe(
              catchError(err => {

                console.log(`error capturado: ${err.status} `);
                return throwError (err);
              })
          );
      }

    update(curso: Curso): Observable<any> {
        /* se añade el token con TokenInterceptor
        return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.httpHeader }); */

         return this.http.put<Curso>(environment.urlEndPoint + '/api/curso/update', curso).pipe(
              catchError(err => {

                console.log(`error capturado: ${err.status} `);
                return throwError (err);
              })
          );
      }

      delete (curso: Curso): Observable<any> {
        return this.http.delete<Curso>(`${environment.urlEndPoint}/api/curso/${curso.id}`).pipe(
            catchError(err => {
              console.log(`error al eliminar curso: ${err.status} `);
              console.log(`error al eliminar curso: ${err.message} `);
              return throwError(err);
            }));
      }



    private newMethod(err: any) {
        console.log(JSON.stringify(err));
    }
}
