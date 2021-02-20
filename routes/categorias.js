const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../middlewares/validar-campos');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', (req, res) => {
    res.json({
        msg: 'get'
    });
})

// Obtener una categoria por id - publico
router.get('/:id', (req, res) => {
    res.json({
        msg: 'get by id'
    });
})

// Crear categoria - provado - cualquier persona con un token válido
router.post('/', (req, res) => {
    res.json({
        msg: 'post'
    });
})

// Actualizar categoria - privado - cualquier persona con un token válido
router.put('/:id', (req, res) => {
    res.json({
        msg: 'put'
    });
})


// Borrar categoria categoria - Admin
router.delete('/:id', (req, res) => {
    res.json({
        msg: 'put delete'
    });
})



module.exports = router;