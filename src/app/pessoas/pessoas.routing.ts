import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Routes, ActivatedRouteSnapshot, Resolve, RouterModule } from '@angular/router';
import { Injectable, NgModule } from '@angular/core';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoasService } from './pessoas.service';
import { Pessoa } from '../shared/models/Pessoa';

@Injectable({ providedIn: 'root' })
export class PessoasResolve implements Resolve<any> {

    constructor(private service: PessoasService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const id = route.params.codigo ? route.params.codigo : null;
        if (id) {
            return this.service.findByCodigo(id).pipe(
                map((categoria: HttpResponse<Pessoa>) => categoria.body)
            );
        }
        return of(new Pessoa());
    }
}

export const routes: Routes = [
    {
        path: '',
        component: PessoasPesquisaComponent,
    },
    {
        path: 'nova',
        component: PessoaCadastroComponent,
        resolve: {
            pessoa: PessoasResolve
        }
    },
    {
        path: ':codigo',
        component: PessoaCadastroComponent,
        resolve: {
            pessoa: PessoasResolve
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class PessoasRoutingModule { }