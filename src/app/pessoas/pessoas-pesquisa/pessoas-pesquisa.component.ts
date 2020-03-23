import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pessoa } from 'src/app/shared/models/Pessoa';
import { PessoaFilter } from 'src/app/shared/models/filtros/pessoa.filter';
import { PessoasService } from '../pessoas.service';
import { LazyLoadEvent, ConfirmationService  } from 'primeng/api';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  msgs: Message[] = [];
  pessoas: Pessoa[];
  filtro = new PessoaFilter();
  totalRegistros = 0; // Qtd de registro do retorno da consulta
  @ViewChild('tabela') grid; // @ViewChild('?') recupera algum dado da view
  sub: Subscription;


  constructor(
    private pessoaService: PessoasService, // Serviço
    private title: Title, // Título da página
    private confirmation: ConfirmationService,
  ) {
    
   }

  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.pessoaService.pesquisar( this.filtro ).subscribe((dados) => {
      this.totalRegistros = dados.total;
      this.pessoas = dados.pessoas;
    }, (error) => console.log(error));
  }

  confirmExclusao(codigo: string, parametro: any) {
    console.log('excluir');
    this.confirmation.confirm({
      message: `Deseja realmente excluir ${parametro} ?`,
      header: 'Confirmação de exclusão',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
          this.excluir(codigo);
      }
  });
  }

  excluir(codigo: any) {
    this.pessoaService.excluir(codigo).subscribe((response) => {
      this.mensagemFeedback('success', 'Item excluído!', 'Item excluído com sucesso');
      this.pesquisar();
    },
    (response) => this.mensagemFeedback('error', 'Erro na exclusão!', 'Não foi prossível excluir o registro. Tente novamente mais tarde'));
  }

  onMudarPagina(event: LazyLoadEvent) {
    const pagina = (event.first / event.rows);
    this.pesquisar(pagina);
  }

  limparFiltro() {
    this.filtro = new PessoaFilter();
  }

  mensagemFeedback(severity: string, summary: string, detail: string){
    this.msgs = [];
    this.msgs.push({severity: severity, summary:summary, detail:detail});
  }

}
