import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[];

  constructor() {}

  ngOnInit() {
    this.items = [
      {
        label: 'Início',
        items: [
          { label: 'Pessoas', routerLink: '/pessoas' }
        ]
      },
      {
        label: 'Cadastros',
        items: [
          { label: 'Pessoa', routerLink: '/pessoas/nova'}
         ]
      },
      {
        label: 'Ajuda',
        items: [
          { label: 'Abrir chamado' },
          { label: 'Configurações' },
          { label: 'Sobre' },
          { label: 'Suporte', url: 'http://google.com' }
        ]
      },
      /* { label: 'Login',  routerLink: '/login' } */
    ];
  }

}
