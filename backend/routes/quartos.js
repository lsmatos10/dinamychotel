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
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            descricao: prod.descricao,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os Quartos',
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
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }
                const response = {
                    mensagem: 'Quarto Inserido com sucesso',
                    produtoCriado: {
                        id_produto: resultado.id_produto,
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
                res.status(201).send(response);
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
            (error, resultado, fields) => {
                if(error) { return res.status(500).send({ error: error}) }
                return res.status(200).send({response: resultado})
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

            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }

                res.status(202).send({
                    mensagem: 'Quarto Alterado com sucesso'
                });
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
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }

                res.status(202).send({
                    mensagem: 'Quarto Removido com sucesso'
                });
            }
        )
    });
});




module.exports = router;