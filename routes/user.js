const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, usersPost, usersPut, usersDelete } = require('../controllers/user');


const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares/index')

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const router = Router();


router.get('/', usersGet);


router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usersPut);


router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo').custom(emailExiste),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usersPost);


router.delete('/:id', [
    validarJWT,
    /* esAdminRole, */
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usersDelete);

module.exports = router;