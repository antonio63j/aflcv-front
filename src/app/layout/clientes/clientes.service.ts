import { Injectable, OnDestroy } from '@angular/core';
// import { CLIENTES } from './clientes.json';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Cliente } from '../../shared/modelos/cliente';
// import { AuthService } from '../usuarios/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ClientesService implements OnDestroy {

  constructor(private http: HttpClient,
  //  public authService: AuthService
  ) { }

  getClientes(page: number): Observable<any> {
    const parametros = new HttpParams()
    .set('page', page.toString())
    .set('size', '12');

    return this.http.get<Cliente[]>(environment.urlEndPoint + '/api/clientes/page', { params: parametros }).pipe(
      tap((response: any) => {
        //  (response.content as Cliente[]).forEach (cliente => console.log(cliente));
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.empresa = cliente.empresa.toUpperCase();
          cliente.cliente = cliente.cliente.toUpperCase();
          return cliente;
        });
        return response;
      }),
      tap((response: any) => {
        /*           (response.content as Cliente[]).forEach (cliente => console.log(cliente)); */
      })
    );
  }

  create(cliente: Cliente): Observable<any> {
    /* se añade el token con TokenInterceptor
    return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.httpHeader }); */
     return this.http.post<Cliente>(environment.urlEndPoint + '/api/cliente', cliente).pipe(
          catchError(err => {
            console.log(`error capturado en create: ${err.error.error} `);
            return throwError (err);
          })
      );
  }

  // getCliente(id: number): Observable<Cliente> {
  //   return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
  //     catchError(err => {
  //       console.log(`error capturado y relanzado en getCliente y: ${err.message} `);
  //       return throwError(err);
  //     })
  //   );
  // }

  update(cliente: Cliente): Observable<any> {
    return this.http.put(environment.urlEndPoint + '/api/cliente/update', cliente).pipe(
      catchError(err => {
        console.log(`error al actualizar datos del cliente: ${err.message} `);
        return throwError(err);
      })
      // , map((response: any) => response.cliente as Cliente)
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${environment.urlEndPoint}/api/cliente/${id}`).pipe(
      catchError(err => {
        console.error(`error al eliminar cliente: ${err.status} `);
        console.error(`error al eliminar cliente: ${err.message} `);
        return throwError(err);
      }));
  }

  ngOnDestroy() {
    console.log('ClienteService.ngOnDestroy ()');
  }

}
