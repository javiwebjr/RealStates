import express from 'express';
import { formularioLogin, autenticar, cerrarSesion, formularioRegistro, formularioOlvidePassword, registrar, confirmar, resetPassword, comprobarToken, nuevoPassword } from '../controllers/usuarioController.js';
const router = express.Router();


//routing

//Login
router.get('/login', formularioLogin);
router.post('/login', autenticar);

//Cerrar Sesion
router.post('/cerrar-sesion', cerrarSesion);

//Registrar
router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

//Token de confirmacion
router.get('/confirmar/:token', confirmar);

//Resetear password
router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);

//almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);





export default router;