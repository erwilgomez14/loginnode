//1 - invocamos a express
const express = require('express');
const app = express();

//2 - seteamos urlencoded para capturar los datos
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3 - invocamos a morgan
const morgan = require('morgan');

//4 - el directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 - establecemos el motor de plantillas ejs
app.set('view engine', 'ejs');

//6 - invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//7 - var. de session
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true
}));

//8 - invocamos al módulo de conexión de la BD
const conexionDB = require('./database/db');
//const User = require('./views/user');

//9 - Middlewares
app.use(morgan('dev'));

//9 - Estableciendo las rutas
app.get('/', (req, res)=>{
    res.render('index');
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.get('/register', (req, res)=>{
    res.render('register');
})

//10 - Registración
app.post('/register', async (req, res) =>{
    const user = req.body.user;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    conexionDB.query('INSERT INTO users SET ?', {user:user, rol:rol, pass:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register',{
                alert: true,
                alertTitle: "Registration",
                alertMessage:"¡Successful Registration!",
                alertIcon: 'Success',
                showConfirmButton: false,
                time:1500,
                ruta: ''
            })
        }
    })
})

//11 - Autenticación
app.post('/auth', async (req, res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        conexionDB.query('SELECT * FROM users = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.send('USUARIO Y/O PASSWORD INCORRECTAS');
            }else{
                res.send('LOGIN CORRECTO');
            }
        });
    };
});
app.listen(5000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:5000');
});

conexionDB()