import { Sequelize } from "sequelize";
import { Precio, Categoria, Propiedad } from "../models/index.js";

const inicio = async (req, res) => {
    const [ categorias, precios, casas, departamentos ] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                {
                    model: Precio, as: 'precio',
                }
            ],
            order: [
                ['publicado', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include: [
                {
                    model: Precio, as: 'precio',
                }
            ],
            order: [
                ['publicado', 'DESC']
            ]
        }),
    ]);

    const _token = req.cookies._token;

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken(),
        _token
    })
}
const categoria = async (req, res) => {
    const {id} = req.params;
    
    //comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id);
    if(!categoria){
        return res.redirect('/404')
    }

    //Obtener las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })
    res.render('categoria', {
        pagina: `${categoria.nombre} en Venta`,
        propiedades,
        csrfToken: req.csrfToken()
    })

}
const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken()
    })
}
const buscador = async (req, res) => {
    const {termino} = req.body;

    //validar que el termino no este vacio
    if(!termino.trim()){
        return res.redirect('back')
    }

    //Consultar las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })
    
    res.render('busqueda', {
        pagina: 'Resultados de la Busqueda',
        propiedades,
        csrfToken: req.csrfToken()
    })
}

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}