import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Herramienta } from '../../shared/modelos/herramienta';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
    providedIn: 'root'
})

export class HerramientasService implements OnDestroy {
    modal: any;
    constructor(private http: HttpClient,
        private ngbModal: NgbModal) {

    }

    ngOnDestroy(): void {
        console.log(' en ngOnDestroy()');
    }

    getHerramientasTodas(): Observable<any> {
        return this.http
            .get<Herramienta[]>(environment.urlEndPoint + '/api/herramientas')
            .pipe(
                tap((response: any) => {
                    // (response).forEach(herramienta => console.log(herramienta));
                }),
                catchError(err => {

                    console.log(err);
                    return throwError(err);
                })
            );
    }

    getHerramientas(page: number, tipo: string): Observable<any> {
        const parametros = new HttpParams()
            .set('page', page.toString())
            .set('size', '12')
            .set('tipo', tipo);
        return this.http
            .get<Herramienta[]>(environment.urlEndPoint + '/api/herramientas/page/tipo', { params: parametros })
            .pipe(
                tap((response: any) => {
                    (response.content as Herramienta[]).forEach(herramienta => console.log(herramienta));
                })
            );
    }

    getHerramientasConFiltro(strBusca: string): Observable<any> {
        const parametros = new HttpParams().set('strBusca', strBusca);
        return this.http.get<Herramienta[]>(environment.urlEndPoint + '/api/herramientas-filtro', {
            params: parametros,
        });
    }

    create(herramienta: Herramienta): Observable<any> {
        /* se añade el token con TokenInterceptor
        return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.httpHeader }); */

        return this.http.post<Herramienta>(environment.urlEndPoint + '/api/herramientas', herramienta).pipe(
            catchError(err => {
                console.log(`error capturado: ${err.status} `);
                return throwError(err);
            })
        );
    }

    update(herramienta: Herramienta): Observable<any> {
        /* se añade el token con TokenInterceptor
        return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.httpHeader }); */

        return this.http.put<Herramienta>(environment.urlEndPoint + '/api/herramienta/update', herramienta).pipe(
            catchError(err => {
                console.log(`error capturado: ${err.status} `);
                return throwError(err);
            })
        );
    }

    delete(herramienta: Herramienta): Observable<any> {
        return this.http.delete<Herramienta>(`${environment.urlEndPoint}/api/herramienta/${herramienta.id}`).pipe(
            catchError(err => {
                console.log(`error al eliminar herramienta: ${err.status} `);
                console.log(`error al eliminar herramienta: ${err.message} `);
                return throwError(err);
            }));
    }



    private newMethod(err: any) {
        console.log(JSON.stringify(err));
    }
}
