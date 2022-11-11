const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PRODUTOS 
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'SELECT * FROM quartos;',
            (error, result, fields) => {
                if(error) { return res.status(500).send({ error: error}) }
                const response = {
                    quantidade: result.length,
                    quartos: result.map(prod => { // Quartos === produtos
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            descricao: prod.descricao,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todo os Quartos',
                                url: 'http://localhost:3000/quartos/' + prod.id_produto
                            }
                        }
                    })
                }
                return res.status(200).send({response});
            }
        )
    });
});

// INSERE UM PRODUTO
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'INSERT INTO quartos (nome,descricao,preco) VALUES (?,?,?)',
            [req.body.nome, req.body.descricao, req.body.preco],
            (error, result, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }
                const response = {
                    mensagem: 'Quarto Inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        descricao: req.body.descricao,
                        preco: req.body.preco,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um Quarto',
                            url: 'http://localhost:3000/quartos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    });

});

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'SELECT * FROM quartos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, result, fields) => {
                if(error) { return res.status(500).send({ error: error}) }
                 
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com este ID'
                    })
                }

                const response = {

                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        descricao: result[0].descricao,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um quarto específico',
                            url: 'http://localhost:3000/quartos'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });

});
// Altera um produto
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            `UPDATE quartos
                SET nome       = ?,
                    descricao  = ?,
                    preco      = ?
              WHERE id_produto = ?`,
            [
                req.body.nome, 
                req.body.descricao,
                req.body.preco, 
                req.body.id_produto
            ],

            (error, result, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }
                const response = {
                    mensagem: 'Quarto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        descricao: req.body.descricao,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um quarto específico',
                            url: 'http://localhost:3000/quartos/' + req.body.id_produto
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});

// EXCLUI UM PRODUTO 
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            `DELETE FROM quartos WHERE id_produto = ?`, [req.body.id_produto],
            (error, result, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }
                const response = {
                    mensagem: "Quarto removido com sucesso",
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um Quarto',
                        url: 'http://localhost:3000/produtos',
                        body: {
                            nome: 'String',
                            descricao: 'String',
                            preco: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});




module.exports = router;