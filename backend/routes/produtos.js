const express = require('express');
const router = express.Router();

// RETORNA TODOS OS PRODUTOS 
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna todo os Produtos'
    });
});

// INSERE UM PRODUTO
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Insere um Produto'
    })
});

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto

    if (id === 'especial'){
        res.status(200).send({
            mensagem: 'Você descobriu o ID especial',
            id: id
        });
    }else{
        res.status(200).send ({
            mensagem: 'Você passou um ID'
        });
    }

});
// Altera um produto
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto Alterado'
    })
});

// EXCLUI UM PRODUTO 
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto Excluido'
    })
});




module.exports = router;