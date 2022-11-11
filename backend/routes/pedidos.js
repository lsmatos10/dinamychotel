const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PEDIDOS 
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(`SELECT pedidos.id_pedido,
                            pedidos.quantidade,
                            quartos.id_produto,
                            quartos.nome,
                            quartos.descricao,
                            quartos.preco
                        FROM pedidos
                INNER JOIN quartos
                        ON quartos.id_produto = pedidos.id_produto;`,
            (error, result, fields) => {
                if(error) { return res.status(500).send({ error: error}) }
                const response = {
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido:  pedido.id_pedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                descricao: pedido.descricao,
                                preco: pedido.preco
                            },
 
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pedido específico',
                                url: 'http://localhost:3000/pedidos/' + pedido.id_pedido
                            }
                        }
                    })
                }
                return res.status(200).send({response});
            }
        )
    });
});

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {
    
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({ error: error}) }
        conn.query('SELECT * FROM quartos WHERE id_produto = ?', [req.body.id_produto], (error, result, field) => {

            if(error) { return res.status(500).send({ error: error}) }
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Não foi encontrado produto com este ID'
                })
            }

            conn.query(
            'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
            [req.body.id_produto, req.body.quantidade],
            (error, result, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }
                const response = {
                    mensagem: 'Pedido inserido com sucesso',
                    pedidoCriado: {
                        id_pedido: result.id_pedido,
                        id_produto: req.body.id_produto,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )


        })
    });
});

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?;',
            [req.params.id_pedidos],
            (error, result, fields) => {
                if(error) { return res.status(500).send({ error: error}) }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado pedido com este ID'
                    })
                }

                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });

});

// EXCLUI UM PRODUTO 
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            `DELETE FROM pedidos WHERE id_pedido = ?`, [req.body.id_pedido],
            (error, result, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }
                const response = {
                    mensagem: "Pedido removido com sucesso",
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um Pedido',
                        url: 'http://localhost:3000/pedidos',
                        body: {
                            id_pedido: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});




module.exports = router;