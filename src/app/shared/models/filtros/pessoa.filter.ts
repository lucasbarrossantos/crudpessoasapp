import { ITEMS_POR_PAGINA } from '../../constants/paginacao-constant';

export class PessoaFilter {
    nome?: string;
    pagina?: number;
    itensPorPagina = ITEMS_POR_PAGINA;
}