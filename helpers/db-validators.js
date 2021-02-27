const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    }
}

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error(`El correo ${ correo } ya esta registrado en la base de datos`);
    }
}

const existeUsuarioPorId = async(id) => {

    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id: ${ id } no existe`);
    }
}

const existeNombreCategoria = async(nombre = '') => {
    nombre = nombre.toLocaleUpperCase();
    const categoriaExiste = await Categoria.findOne({ nombre });

    if (!categoriaExiste) {
        throw new Error(`La categoria ${ nombre } ya esta registrada en la base de datos`);
    }
}

const noExisteNombreCategoria = async(nombre = '') => {
    nombre = nombre.toLocaleUpperCase();
    const categoriaExiste = await Categoria.findOne({ nombre });

    if (!categoriaExiste) {
        throw new Error(`La categoria ${ nombre } no existe en la base de datos`);
    }
}

const existeCategoriaPorId = async(id) => {

    const existecategoria = await Categoria.findById(id)
    if (existecategoria) {
        throw new Error(`El id: ${ id } no existe`);
    }
}

const existeProductoPorId = async(id) => {

    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id: ${ id } no existe`);
    }
}

const existeNombreProducto = async(nombre = '') => {
    nombre = nombre.toUpperCase();
    const productoExiste = await Producto.findOne({ nombre });

    if (productoExiste) {
        throw new Error(`El producto ${ nombre }, ya esta registrado en la base de datos`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeNombreCategoria,
    noExisteNombreCategoria,
    existeCategoriaPorId,
    existeProductoPorId,
    existeNombreProducto
}