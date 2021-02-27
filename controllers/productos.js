const { response } = require("express");
const { Producto, Categoria } = require("../models/index");


// obtener categorias - paginado - total -populate

const obtenerProductos = async(req, res = response) => {

    const { limite = 5, desde = 0, categoria } = req.query;
    let query;

    if (categoria === undefined) {
        query = { estado: true };
    } else {
        const nombreCategoria = req.query.categoria.toUpperCase();
        const categoriaDB = await Categoria.findOne({ nombre: nombreCategoria });
        query = { estado: true, categoria: categoriaDB };
    }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    return res.status(200).json({ total, productos });

}

// obtenerCategoria - populate

const obtenerProducto = async(req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    return res.status(200).json(producto);

}

// actualizarCategoria
const actualizarProducto = async(req, res = response) => {

    const { id } = req.params;
    const {...producto } = req.body;

    if (producto.nombre) producto.nombre = producto.nombre.toUpperCase();
    if (producto.categoria) producto.categoria = producto.categoria.toUpperCase();

    const [categoriaDB, ProductoDB] = await Promise.all([
        Categoria.findOne({ nombre: producto.categoria }),
        Producto.findOne({ nombre: producto.nombre })
    ]);


    if (ProductoDB && (id != ProductoDB._id)) {
        return res.status(400).json({
            msg: `El producto ${ProductoDB.nombre}, ya existe`
        });
    }

    const data = {
        ...producto,
        categoria: categoriaDB,
        usuario: req.usuario._id
    }

    if (data == ProductoDB) {
        res.status(400).json({
            msg: 'No ha realizado ningun cambio'
        })
    }

    const updatedProduct = await Producto.findByIdAndUpdate(id, data, { new: true }).populate('categoria', 'nombre');

    res.status(200).json({ updatedProduct });

}

const crearProducto = async(req, res = response) => {

    const { estado, usuario, ...producto } = req.body;

    producto.categoria = producto.categoria.toUpperCase();
    producto.nombre = producto.nombre.toUpperCase();

    const [categoriaDB, ProductoDB] = await Promise.all([
        Categoria.findOne({ nombre: producto.categoria }),
        Producto.findOne({ nombre: producto.nombre })
    ]);

    if (ProductoDB) {
        return res.status(400).json({
            msg: `El producto ${ProductoDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre: producto.nombre,
        precio: producto.precio,
        descripcion: producto.descripcion,
        disponible: producto.disponible,
        usuario: req.usuario._id,
        categoria: categoriaDB._id
    }

    const product = new Producto(data);

    //Guardar DB
    await product.save();

    return res.status(201).json(product);

}

// Borrar categoria - estado : false
const borrarProducto = async(req, res = response) => {

    const { id } = req.params;

    await Producto.findByIdAndUpdate(id, { estado: false }, { new: true }, function(err, producto) {
        if (err) {
            return res.status(400).json({
                msg: "Error al eliminar"
            })
        } else {
            return res.status(200).json({ producto });
        }
    });

}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}