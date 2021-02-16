const { response } = require('express');


const usersGet = (req, res = response) => {

    const { page, limit } = req.query;

    res.json({
        msg: "get API - controlador",
        page,
        limit
    });
}

const usersPut = (req, res = response) => {

    const id = req.params.id;

    res.json({
        msg: "put API - controlador",
        id
    });
}

const usersPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: "post API - controlador",
        nombre,
        edad
    });
}

const usersDelete = (req, res = response) => {
    res.json({

        msg: "delete API - controlador"
    });
}



module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}