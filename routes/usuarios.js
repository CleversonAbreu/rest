const express = require('express');
const router  = express.Router();

const UsuariosController = require('../controllers/usuarios-controller');

//cadastrar usuario
router.post('/cadastro',UsuariosController.cadastrarUsuario);    

//logar usuario
router.post('/login',UsuariosController.logar);

module.exports = router;