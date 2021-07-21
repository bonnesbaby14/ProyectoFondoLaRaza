const express = require("express");
const app = express();
const path = require("path");
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const routecustomer = require('./src/routes/customer');
const DB = require('./src/controllers/db');
const bcrypt = require('bcrypt');


async function getUser(username, password) {
    return new Promise((resolve) => {
        DB.query("SELECT id, contrasena FROM usuarios WHERE usuario= ?  ", [username], function (error, row) {
            
            if (row) {
                console.log(password);
                console.log(row[0].contrasena);
                bcrypt.compare(password,row[0].contrasena,(err,res)=>{
                    if(res==true){
                        console.log("aqui");
                        resolve(row);
                    }else{
                        console.log("aqui no");
                        resolve([])
                    }
                });
            }

           
        })
    })
}
async function getUserByID(id) {
    return new Promise((resolve) => {


        DB.query("SELECT id, nombre, tipo, sucursal FROM usuarios WHERE id= ?", [id], function (error, row) {

            resolve(row);
        })
    })
}


app.set("port", 81);
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "src/public")));
app.use(morgan("tiny"));
app.use(fileUpload());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));





app.use(session({

    secret: "AWSDhahahssssssjsjsakahahha",
    resave: true,
    saveUninitialized: true,
}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());



passport.use(new passportLocal(async function (user, password, done) {
    var userDB;
    user = user.trim();
    password = password.trim();

    await getUser(user, password).then((datos) => { userDB = datos })

    if (userDB.length > 0) {

        console.log("si debe entrar");
        return done(null, userDB[0]);

    } else {

        return done(null, false);
    }

}));

passport.serializeUser(function (user, done) {

    console.log("Serializer OK");

    done(null, user.id);
});


passport.deserializeUser(async function (id, done) {

    var userDB;
    await getUserByID(id).then((datos) => { userDB = datos })

    console.log("Deserializer OK");
    done(null, userDB[0]);
});


app.use('/', routecustomer);


app.listen(app.get("port"), () => { console.log("el servidor esta escuchando") });






