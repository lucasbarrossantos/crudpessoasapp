import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Pessoa } from '../shared/models/Pessoa';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import * as moment from 'moment';
import { PessoaFilter } from '../shared/models/filtros/pessoa.filter';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {
  public resourceUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic bHVjYXNiYXJyb3M6bHVjYXNAMTIz'
    })
  };

  salvar(pessoa: Pessoa): Observable<any> {
    return this.http.post<Pessoa>(`${this.resourceUrl}/pessoas`, pessoa, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  atualizar(pessoa: Pessoa): Observable<any> {
    const codigo = pessoa.codigo;
    pessoa.codigo = undefined;

    return this.http.put<Pessoa>(`${this.resourceUrl}/pessoas/${codigo}`, pessoa, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  excluir(codigo: number) {
    return this.http.delete<any>(`${this.resourceUrl}/pessoas/${codigo}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Basic bHVjYXNiYXJyb3M6bHVjYXNAMTIz'
        }),
        observe: 'response'
      });
  }

  findByCodigo(codigo: string): Observable<any> {
    return this.http
      .get<Pessoa>(`${this.resourceUrl}/pessoas/${codigo}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Basic bHVjYXNiYXJyb3M6bHVjYXNAMTIz'
        }),
        observe: 'response'
      }).pipe(map((res: any) => this.convertDateFromServer(res)));
  }

  pesquisar(filtro: PessoaFilter): Observable<any> {
    let param = new HttpParams();
    param = this.filtros(filtro, param);

    return this.http
      .get<Pessoa[]>(`${this.resourceUrl}/pessoas?sort=nome,desc`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Basic bHVjYXNiYXJyb3M6bHVjYXNAMTIz'
        }),
        params: param,
        observe: 'response'
      }).pipe(map((res: any) => this.convertDateArrayFromServer(res)));
  }


  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  };

  protected convertDateArrayFromServer(res: any): any {
    let result = {};
    if (res.body) {
      result = {
        pessoas: res.body.content,
        total: res.body.totalElements
      };
    }
    return result;
  }

  protected convertDateFromServer(res: any): any {
    if (res.body) {
      res.body.dataNascimento = res.body.dataNascimento != null ?
        moment(res.body.dataNascimento, 'YYYY-MM-DD').toDate() : null;
    }
    return res;
  }


  /*
   * Filtros
   * Params: filtro: any, param: HttpParams
  */

  private filtros(filtro: any, param: HttpParams) {
    // Parametros de paginacao
    param = param.set('page', filtro.pagina);
    param = param.set('size', filtro.itensPorPagina);

    // Parametros de filtragens
    if (filtro.nome) {
      param = param.set('nome', filtro.nome);
    }

    return param;
  }

}
