import { Moment } from 'moment';

export class Pessoa {
    codigo?: number;
    nome?: string;
    cpf?: string;
    email?: string;
    naturalidade?: string;
    nacionalidade?: string;
    dataNascimento?: Moment;
    sexo?: Sexo;
}

enum Sexo {
    MASCULINO,
    FEMININO
}