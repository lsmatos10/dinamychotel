const express =require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

router.post('/cadastro', (req, res, next) =>{
    mysql.getConnection((err, conn) => {
        if(err) { return res.status(500).send({ error: error}) }
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error, results) => {
            if (error) { return res.status(500);send({ error: error }) }
            if (results.length > 0) {
                res.status(409).send({ mensagem: 'Usuário já cadastrado' })
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(
                        `INSERT INTO usuarios (nome, email, documento, telefone, senha) VALUES (?, ?, ?, ?, ?)`, 
                        [req.body.nome, req.body.email, req.body.documento, req.body.telefone, hash],
                        (error, results) => {
                        conn.release();
                        if (error){ return res.status(500).send({ error: error }) }
                        response = {
                            mensagem: "Usuário criado com sucesso",
                            usuarioCriado: {
                                id_usuario: results.insertId,
                                nome:      req.body.nome,
                                email:     req.body.email,
                                documento: req.body.documento,
                                telefone:  req.body.telefone
                            }
                        }
                            return res.status(201).send(response);
                    })
                });
            }
        })
        
    });
})

module.exports = router;