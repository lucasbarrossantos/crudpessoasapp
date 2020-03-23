import { Component, OnInit } from '@angular/core';
import { Pessoa } from 'src/app/shared/models/Pessoa';
import { PessoasService } from '../pessoas.service';
import { Title } from '@angular/platform-browser';
import { FormControl, AbstractControl } from '@angular/forms';
import { Message } from 'primeng//api';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  msgs: Message[] = [];
  pessoa = new Pessoa();
  sexo = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Feminino', value: 'FEMININO' }
  ];
  pt = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(
    private pessoaCadastro: PessoasService,
    private title: Title,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ pessoa }) => {
      this.pessoa = pessoa;
    });
    this.title.setTitle(this.pessoa.codigo ? `Edição da pessoa - ${this.pessoa.nome}` : 'Nova pessoa');
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  salvar(form) {
    if (this.editando) {
      this.atualizarCategoria(form);
    } else {
      this.adicionarCategoria(form);
    }
  }

  adicionarCategoria(form: AbstractControl) {
    this.pessoaCadastro.salvar(this.pessoa).subscribe(() => {
      this.mensagemFeedback('success', 'Cadastro realizado com sucesso!', 'Pessoa salva com sucesso!');
      form.reset();
      this.pessoa = new Pessoa();
      this.router.navigate(['/pessoas']);
    }, (error) => {
      console.log(error)
      this.mensagemFeedback('error', 'Erro no cadastro!', error.error.userMessage)

      if (error.error.objects != null) {
        this.mensagemFeedback('error', 'Erro no cadastro!', error.error.objects[0].userMessage)
      }
    });
  }

  atualizarCategoria(form: FormControl) {
    this.pessoaCadastro.atualizar(this.pessoa).subscribe(
      (pessoa) => {
        this.mensagemFeedback('success', 'Atualização!', 'Pessoa salva com sucesso!');
        form.reset();
        this.pessoa = new Pessoa();
        this.router.navigate(['/pessoas']);
      },
      error => {
        this.mensagemFeedback('error', 'Erro no cadastro!', error.error.userMessage)

        if (error.error.objects != null) {
          this.mensagemFeedback('error', 'Erro no cadastro!', error.error.objects[0].userMessage)
        }
      }
    );
  }

  mensagemFeedback(severity: string, summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: severity, summary: summary, detail: detail });
  }

}
