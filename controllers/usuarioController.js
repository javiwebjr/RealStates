import { check, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import Usuario from "../models/Usuario.js";
import { generarJWT, generarID } from "../helpers/token.js";
import {emailRegistro, emailOlvidePassword} from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {
    //Validacion
    await check('email').isEmail().withMessage('Email obligatorio').run(req);
    await check('password').notEmpty().withMessage('Password Obligatorio').run(req);

    let resultado = validationResult(req);

    //verificar usuarios vacios
    if(!resultado.isEmpty()){
        //errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const {email, password} = req.body;

    //verificar usuario
    const usuario = await Usuario.findOne({where: {email}})
    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}]
        })
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Debes verificar tu cuenta antes de Iniciar Sesion'}]
        })
    }

    //Revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Password Incorrecto'}]
        })
    }

    //Autenticar al usuario
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre});

    //Almacenar en un cookie

    return res.cookie('_token', token, {
        httpOnly: true,
        // secure: true

    }).redirect('/mis-propiedades');
    
}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formularioRegistro = (req, res) => {

    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {
    //validacion
    await check("nombre").notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check("email").isEmail().withMessage('Escribe un email valido').run(req);
    await check("password").isLength({min: 6}).withMessage('Password minimo de 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req);

    let resultado = validationResult(req);

    //verificar usuarios vacios
    if(!resultado.isEmpty()){
        //errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
                
            }
        })
    }

    const { nombre , email, password } = req.body;

    //Verificar usuarios duplicados
    const existeUsuario = await Usuario.findOne({where: {email}});
    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya existe'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    //almacenar usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarID()
    })

    //envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    //mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un email de confirmacion para su cuenta'
    })

}
const confirmar = async (req, res) => {
    const {token} = req.params;

    //verificar si el token es valido 
    const usuario = await Usuario.findOne({where: {token}});
    if(!usuario){
        return res.render('auth/confirmarCuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error, intentalo de nuevo',
            error: true
        })
    }

    //confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;

    await usuario.save();

    res.render('auth/confirmarCuenta', {
        pagina: 'Cuenta Confirmada Correctamente',
        mensaje: 'Tu cuenta ha sido confirmada'
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Olvide mi Password',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {
    //validacion

    await check('email').isEmail().withMessage('Escribe un email valido').run(req);


    let resultado = validationResult(req);

    //verificar usuarios vacios
    if(!resultado.isEmpty()){
        //errores
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    //Buscar el usuario
    const {email} = req.body;
    const usuario = await Usuario.findOne({where: {email}});
    if(!usuario){
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no esta registrado'}]
        })
    }

    //Generar token y enviar el email
    usuario.token = generarID();
    await usuario.save();

    //Enviar email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    //mensaje
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu password',
        mensaje: 'Hemos enviado un email a tu correo con las instrucciones'
    })
}
const comprobarToken = async (req, res) => {
    const {token} = req.params;
    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        return res.render('auth/confirmarCuenta', {
            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar tu informacion, intentalo de nuevo',
            error: true
        })
    }

    //Mostrar el formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Reestablece tu Password',
        csrfToken: req.csrfToken(),
    })
}
const nuevoPassword = async (req, res) => {
    //Validar password
    await check('password').isLength({min: 6}).withMessage('Password minimo de 6 caracteres').run(req);

    
    let resultado = validationResult(req);

    //Validacion del resultado de password
    if(!resultado.isEmpty()){
        //errores
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
    
    const { token } = req.params;
    const { password } = req.body;

    //Identificar el usuario
    const usuario = await Usuario.findOne({where: {token}})

    //encriptar password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save();

    res.render('auth/confirmarCuenta', {
        pagina: 'Password Reestablecido',
        mensaje: 'El password se guardo correctamente'
    })

}
export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    
}