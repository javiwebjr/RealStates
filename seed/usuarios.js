import bcrypt from 'bcrypt';

const usuarios = [
    {
        nombre: 'Javier',
        email: 'javier@correo.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios