import jwt from 'jsonwebtoken';

const generarJWT = datos => jwt.sign({ id : datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, {expiresIn: '1d'})


const generarID = () =>  Math.random().toString(32).substring(2)+Date.now().toString(32);

export {
    generarID,
    generarJWT
}