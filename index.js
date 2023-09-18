import express from "express";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

import db from "./config/db.js";


//app 
const app = express();

//habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}));

//habilitar cookie parser
app.use(cookieParser());

//habilitar cross side request (CSURF)
app.use(csurf({cookie: true}))


//Conexion a la base de datos MYSQL
try {
    await db.authenticate();
    db.sync();
    console.log('Conexion correcta a la base de datos');
} catch (error) {
    console.log(error);
}

//habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

//public
app.use(express.static('public'));

//routing
app.use('/', appRoutes);
app.use('/auth' , usuarioRoutes);
app.use('/' , propiedadesRoutes);
app.use('/api', apiRoutes)


const port  = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Servidor funcionando en el puerto: ${port}`);
})