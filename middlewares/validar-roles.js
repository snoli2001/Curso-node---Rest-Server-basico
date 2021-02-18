const { response } = require("express");
const role = require("../models/role");



const esAdminRole = (req, res = response, next) => {


    if (!req.usuario) {
        return res.status(500).json({
            message: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            message: `${nombre} No cuenta con los permisos necesarios`
        });
    }

    next();
}

const tieneRole = (...roles) => {
    return (req, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                message: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(500).json({
                message: `El servicio require uno de estos roles ${ roles}`
            });
        }

        next();
    }
}

module.exports = { esAdminRole, tieneRole }