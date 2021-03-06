const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usersGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    return res.status(200).json({ total, usuarios });
}

const usersPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    return res.json(usuario);
}

const usersPost = async(req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usersDelete = async(req, res = response) => {

    const { id } = req.params;

    //Fisicamente lo borramos
    /* const usuario = await Usuario.findByIdAndDelete(id); */

    const ususario = await Usuario.findByIdAndUpdate(id, { estado: false });


    return res.json({ ususario });
}



module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}