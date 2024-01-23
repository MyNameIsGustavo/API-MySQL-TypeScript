import express, { Request, Response } from "express";
import {
    cadastrarCliente,
    obterTodosClientes,
    obterClientePorId,
    deletarCliente,
    atualizarCliente,
} from "./customer.service";
import { customer } from "@prisma/client";

const clienteRotas = express.Router();

clienteRotas.post('/cliente', async (req: Request, res: Response) => {
    const dadosCliente: customer = req.body;

    if (!dadosCliente.nome || !dadosCliente.senha || !dadosCliente.sobrenome || !dadosCliente.cpf || !dadosCliente.endereco)
        return res.status(400).send({ message: 'Os parametros [nome, senha, sobrenome, cpf, endereco] são obrigatorios.' });

    try {
        await cadastrarCliente(dadosCliente);
        return res.status(200).send(req.body);
    } catch (error) {
        console.error(error);
    }
});

clienteRotas.get('/cliente/:id?', async (req: Request, res: Response) => {
    let clienteId: number | undefined = undefined;

    if (req.params.id) {
        clienteId = Number(req.params.id);

        if (isNaN(clienteId))
            return res.status(400).send({ message: 'O ID deve ser numérico.' });
        else if (clienteId <= 0)
            return res.status(400).send({ message: 'O ID deve ser um numero inteiro positivo.' });
    }

    try {
        if (clienteId) {
            const cliente = await obterClientePorId(clienteId);
            if (cliente) {
                return res.status(200).send(cliente);
            } else {
                return res.status(204).send();
            }
        } else {
            const todosClientes = await obterTodosClientes();
            if (todosClientes)
                return res.status(200).send(todosClientes);
            else
                return res.status(204).send();
        }
    }
    catch (error) {
        console.error(error)
    }
});

clienteRotas.put('/cliente/:id', async (req: Request, res: Response) => {
    const idCliente: number = Number(req.params.id);
    const dadosCliente: customer = req.body;

    if (idCliente <= 0)
        return res.status(400).send({ message: 'O ID deve ser um numero inteiro positivo.' });

    if (isNaN(idCliente))
        return res.status(400).send({ message: 'O ID deve ser numérico.' });

    try {
        const clienteAtualizado = await atualizarCliente(idCliente, dadosCliente);
        if (clienteAtualizado)
            return res.status(200).send(clienteAtualizado);
        else
            return res.status(204).send();
    } catch (error) {
        console.error(error);
    }
});

clienteRotas.delete('/cliente/:id', async (req: Request, res: Response) => {
    const idCliente: number = Number(req.params.id);

    if (idCliente <= 0)
        return res.status(400).send({ message: 'O ID deve ser um numero inteiro positivo.' });

    if (isNaN(idCliente))
        return res.status(400).send({ message: 'O ID deve ser numérico.' });

    try {
        const clienteDeletado = await deletarCliente(idCliente);
        if (clienteDeletado)
            return res.status(200).send(clienteDeletado);
        else
            return res.status(204).send();
    } catch (error) {
        console.error(error)
    }
});

export default clienteRotas;