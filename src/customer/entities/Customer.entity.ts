import { User } from "../../user/entities/User.entity";

export class Client extends User {

    constructor(
        _id: number,
        _nome: string,
        _sobrenome: string,
        _cpf: string,
        private endereco: string,
        private celular?: string,
    ) {
        super(_id, _nome, _sobrenome, _cpf);
    }
}