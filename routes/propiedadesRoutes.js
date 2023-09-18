import express from 'express';
import { body }  from 'express-validator';
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes } from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';
import identificarUsuario from '../middleware/identificarUsuario.js';
const router = express.Router();

router.get('/mis-propiedades', protegerRuta, admin);
router.get('/propiedades/crear', protegerRuta, crear);
router.post('/propiedades/crear', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La Descripcion del anuncio es Oblitoria')
    .isLength({max: 200}).withMessage('La Descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('La propiedad necesita un precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona cuantos cuartos tiene la propiedad'),
    body('estacionamiento').isNumeric().withMessage('Selecciona cuantos lugares de estacionamiento tiene la propiedad'),
    body('wc').isNumeric().withMessage('Selecciona cuantos wc tiene la propiedad'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar
);

router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen);

router.post('/propiedades/agregar-imagen/:id', protegerRuta, upload.single('imagen'), almacenarImagen);

router.get('/propiedades/editar/:id', protegerRuta, editar);

router.post('/propiedades/editar/:id', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La Descripcion del anuncio es Oblitoria')
    .isLength({max: 200}).withMessage('La Descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('La propiedad necesita un precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona cuantos cuartos tiene la propiedad'),
    body('estacionamiento').isNumeric().withMessage('Selecciona cuantos lugares de estacionamiento tiene la propiedad'),
    body('wc').isNumeric().withMessage('Selecciona cuantos wc tiene la propiedad'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardarCambios
);

//eliminar
router.post('/propiedades/eliminar/:id', protegerRuta, eliminar);

router.put('/propiedades/:id', protegerRuta, cambiarEstado)


//Area publica
router.get('/propiedad/:id', identificarUsuario, mostrarPropiedad);

//Almacenar mensajes
router.post('/propiedad/:id', 
    identificarUsuario, 
    body('mensaje').isLength({min: 10}).withMessage('El mensaje es muy corto y no puede ir vacio'),
    enviarMensaje
);

router.get('/mensajes/:id', protegerRuta, verMensajes)


export default router;