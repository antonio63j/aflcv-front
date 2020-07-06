import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DownloadCvService {

  constructor(
    private httpClient: HttpClient,
    private fileSaverService: FileSaverService
  ) { }

  downloadPdf(filename: string) {
    // filename = 'Curriculum_Vitae.pdf';
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'Application/pdf');

    console.log(headers);

    this.httpClient.get(environment.urlEndPoint + '/api/download/cvpdf-alternativo', {
      headers,
      observe: 'response',
      responseType: 'blob'
    }).subscribe(res => {
      this.fileSaverService.save(res.body, filename);
    }
      , err => {
        console.error(err);

        // swal.fire('Error en descarga', err, 'error');
      }
    );

  }

  downloadPdfCv(filename: string, parametros: HttpParams): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'Application/pdf');

    console.log(headers);
    console.log(parametros);

    return this.httpClient
      .get(environment.urlEndPoint + '/api/download/aflcv-pdf',
        {
          headers,
          params: parametros,
          observe: 'response',
          responseType: 'blob'
        })
      .pipe(
        catchError(err => {
          console.log(`error capturado: ${err.status} `);
          return throwError(err);
        })
      );
  }


}
