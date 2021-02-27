const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { validarJWT, esAdminRole } = require('../middlewares');
const { existeNombreCategoria, existeCategoriaPorId } = require('../helpers/db-validators')

const validarCampos = require('../middlewares/validar-campos');

const router = Router();

// Obtener todos los - publico
router.get('/', obtenerCategorias);

// Obtener un producto por id - publico
router.get('/:id', [check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCategoriaPorId)
    ],
    obtenerCategoria);

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar categoria - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(existeNombreCategoria),
    validarCampos
], actualizarCategoria);


// Borrar categoria categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);



module.exports = router;