const { response } = require("express");
const { Categoria } = require("../models");


// obtener categorias - paginado - total -populate

const obtenerCategorias = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    return res.status(200).json({ total, categorias });

}

// obtenerCategoria - populate

const obtenerCategoria = async(req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    return res.status(200).json(categoria);

}

// actualizarCategoria
const actualizarCategoria = async(req, res = response) => {

    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();

    await Categoria.findByIdAndUpdate(id, { nombre, usuario: req.usuario._id }, { new: true },
        function(err, categoria) {
            if (err) {
                return res.status(400).json({
                    msg: "Error al actualizar"
                })
            } else {
                return res.status(200).json({ categoria });
            }
        });

}

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `la categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar DB
    await categoria.save();

    return res.status(201).json(categoria);

}

// Borrar categoria - estado : false
const borrarCategoria = async(req, res = response) => {

    const { id } = req.params;

    await Categoria.findByIdAndUpdate(id, { estado: false }, function(err, categoria) {
        if (err) {
            return res.status(400).json({
                msg: "Error al eliminar"
            })
        } else {
            return res.status(200).json({ categoria });
        }
    });

}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}