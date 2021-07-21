const controller = {};
const path = require("path");
const { json } = require('express');
const DB = require('./db');
const passport = require("passport");
const { runInNewContext } = require("vm");
const { Console } = require("console");
const transporter = require('./nodemailer');
const bcrypt = require('bcrypt');

//funciones
async function getPreguntas() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM preguntas", function (error, row) {
      resolve(row);
    })
  })
}

async function getNoticiasIndex() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM noticias ORDER BY ID DESC LIMIT 6", function (error, row) {
      resolve(row);
    })
  })
}
async function getNoticias() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM noticias", function (error, row) {
      resolve(row);
    })
  })
}
async function getServicios() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM servicios", function (error, row) {
      resolve(row);
    })
  })
}
async function getUsuarios() {
  return new Promise((resolve) => {
    DB.query("SELECT id, usuario, nombre, tipo, sucursal FROM usuarios", function (error, row) {
      resolve(row);
    })
  })
}


async function getMultimedia() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM multimedia", function (error, row) {
      resolve(row);
    })
  })
}

async function getMultimediaC() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM multimedia WHERE sucursal = '0' ORDER BY ID DESC LIMIT 6", function (error, row) {
      resolve(row);
    })
  })
}
async function getMultimediaT() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM multimedia WHERE sucursal = '1' ORDER BY ID DESC LIMIT 6", function (error, row) {
      resolve(row);
    })
  })
}
async function getMultimediaA() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM multimedia WHERE sucursal = '2' ORDER BY ID DESC LIMIT 6", function (error, row) {
      resolve(row);
    })
  })
}
async function getMultimediaG() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM multimedia WHERE sucursal = '3' ORDER BY ID DESC LIMIT 6", function (error, row) {
      resolve(row);
    })
  })
}
async function getMultimediaAU() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM multimedia WHERE sucursal = '4' ORDER BY ID DESC LIMIT 6", function (error, row) {
      resolve(row);
    })
  })
}
async function getMultimediaCALL() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM multimedia WHERE sucursal = '0'", function (error, row) {
      resolve(row);
    })
  })
}
async function getMultimediaTALL() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM multimedia WHERE sucursal = '1'", function (error, row) {
      resolve(row);
    })
  })
}
async function getMultimediaAALL() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM multimedia WHERE sucursal = '2' ", function (error, row) {
      resolve(row);
    })
  })
}
async function getMultimediaGALL() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM multimedia WHERE sucursal = '3'", function (error, row) {
      resolve(row);
    })
  })
}
async function getMultimediaAUALL() {
  return new Promise((resolve) => {
    DB.query("SELECT * FROM multimedia WHERE sucursal = '4'", function (error, row) {
      resolve(row);
    })
  })
}
//controles

controller.home = async (req, res) => {
  var preguntas, noticias, multimediaC, multimediaT, multimediaA, multimediaG, multimediaAU, servicios;
  await getPreguntas().then((datos) => { preguntas = datos });
  await getNoticiasIndex().then((datos) => { noticias = datos });

  await getMultimediaC().then((datos) => { multimediaC = datos });
  await getMultimediaT().then((datos) => { multimediaT = datos });
  await getMultimediaA().then((datos) => { multimediaA = datos });
  await getMultimediaG().then((datos) => { multimediaG = datos });
  await getMultimediaAU().then((datos) => { multimediaAU = datos });
  await getServicios().then((datos) => { servicios = datos });
  console.log(multimediaC);
  res.render("index.ejs", { preguntas: preguntas, noticias: noticias, multimediaC: multimediaC, multimediaT: multimediaT, multimediaA: multimediaA, multimediaG: multimediaG, multimediaAU: multimediaAU, servicios:servicios });
}



controller.panel = async (req, res, next) => {

  if (req.isAuthenticated()) {
    await console.log("estre a este campo");
    var preguntas, noticias, usuarios, servicios;
    await getPreguntas().then((datos) => { preguntas = datos });
    await getNoticias().then((datos) => { noticias = datos });
    await getUsuarios().then((datos) => { usuarios = datos });
    await getServicios().then((datos) => { servicios = datos });



    res.render("panel.ejs", { preguntas: preguntas, noticias: noticias, usuarios: usuarios, user: req.user,servicios:servicios });


  } else {
    res.redirect('/Login');



  }

}

controller.logOut = (req, res) => {
  req.logout();
  res.redirect('/login');

}

controller.upUser = (req, res) => {

  if (req.body.tipo == 0) {
    bcrypt.hash(req.body.contrasena, 10, function (err, data) {
      DB.query("INSERT INTO usuarios (usuario, nombre, contrasena, tipo) VALUES ?", [[[req.body.usuario, req.body.nombre, data, req.body.tipo]],], (err) => {
        if (err) { console.log("Error registrando usuario"); console.log(err); res.status(200).json({ estado: "false" }); }
        console.log("usuario   registrado");
        res.status(200).json({ estado: "true" });
      });

    });



  } else {
    bcrypt.hash(req.body.contrasena, 10, function (err, data) {
      DB.query("INSERT INTO usuarios (usuario, nombre, contrasena, tipo, sucursal) VALUES ?", [[[req.body.usuario, req.body.nombre, data, req.body.tipo, req.body.sucursal]],], (err) => {
        if (err) { console.log("Error registrando pregunta"); console.log(err); res.status(200).json({ estado: "false" }); }
        console.log("pregunta  registrada ");
        res.status(200).json({ estado: "true" });
      });

    });

  }


}


controller.upNoticia = (req, res) => {


  let imgFile = req.files.file;
  let date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hora = date.getMilliseconds();
  let datetme = new Date().toLocaleString();

  let dir = path.join(__dirname, "../../src/public/img/" + day.toString() + month.toString() + year.toString() + hora.toString() + ".jpg");
  let name = "/img/" + day.toString() + month.toString() + year.toString() + hora.toString() + ".jpg";

  imgFile.mv(dir, err => {



    if (err) {
      return res.status(500).send({ message: err })
    } else {
      DB.query("INSERT INTO noticias (titulo, fecha, cuerpo, imagen, url) VALUES ?", [[[req.body.titleNew, datetme, req.body.bodyNew, name, req.body.urlNew]],], (result) => {
        if (err) { console.log(err); console.log(err); res.status(200).json({ estado: "false" }); }
        console.log("Multimedia registrada video");
        res.status(200).json({ estado: "true" });
      });
    }
  })


}

controller.deleteNew = (req, res) => {


  DB.query("DELETE FROM noticias where id= ? ", [req.body.idNew], (error) => {
    if (error) { console.log(err); res.status(200).json({ estado: "false" }); }
    res.status(200).json({ estado: "true" });
  });


}
controller.deleteService = (req, res) => {


  DB.query("DELETE FROM servicios where id= ? ", [req.body.idService], (error) => {
    if (error) { console.log(err); res.status(200).json({ estado: "false" }); }
    res.status(200).json({ estado: "true" });
  });


}
controller.deleteBlog = (req, res) => {
  DB.query("DELETE FROM preguntas where id= ? ", [req.body.idBlog], (error) => {
    if (error) { console.log(err); res.status(200).json({ estado: "false" }); };
    res.status(200).json({ estado: "true" });
  });
}
controller.deleteMedia = (req, res) => {
  DB.query("DELETE FROM multimedia where id= ? ", [req.body.idMedia], (error) => {
    if (error) { console.log(err); res.status(200).json({ estado: "false" }); };
    res.status(200).json({ estado: "true" });
  });
}

controller.updateBlog = (req, res) => {
  console.log(req);
  console.log(req.body.idpregunta);

  DB.query("UPDATE preguntas SET respuesta= ? where id= ? ", [req.body.BlogRespuesta, req.body.idpregunta], (error) => {
    if (error) { console.log(err); console.log(err); res.status(200).json({ estado: "false" }); }
    console.log("Respuesta regitrada");
    var mailOptions = {
      from: "'Fondo La Raza' <noreply@fondolaraza.com>",
      to: req.body.remitente,
      subject: 'Tu Pregunta ha sido contestada.',
      text: 'Saludos cordiales. Tu pregunta ha sido responida.: ' + req.body.BlogRespuesta,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(200).json({ estado: "false" });
      } else {
        console.log("Email sent")
        console.log(info);
        res.status(200).json({ estado: "true" });
      }
    });
  });



}

controller.upPregunta = (req, res) => {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
  let fechaNew = year + "-" + month + "-" + day;
  console.log(fechaNew);
  // fecha
  console.log(req.body.pregunta);
  console.log(req.body.mail);

  DB.query("INSERT INTO preguntas (pregunta, remitente, fecha) VALUES ?", [[[req.body.pregunta, req.body.mail, fechaNew]],], (err) => {
    if (err) { console.log("Error registrando pregunta"); console.log(err); res.status(200).json({ estado: "false" }); }
    console.log("pregunta  registrada ");
    res.status(200).json({ estado: "true" });
  });


}

controller.upService = (req, res) => {
  
  DB.query("INSERT INTO servicios (servicio) VALUES ?", [[[req.body.service]],], (err) => {
    if (err) { console.log("Error registrando servicio "); console.log(err); res.status(200).json({ estado: "false" }); }
    console.log("servicio  registrada ");
    res.status(200).json({ estado: "true" });
  });


}

controller.login = (req, res) => {
  res.render('login');
}

controller.all = (req, res) => {
  res.redirect("/");
};

controller.gatGaleria = async (req, res) => {

  var multimedia;
  console.log(req.body.sucursal);

  console.log(req.body.nivel);

  if (req.body.nivel == 0) {
    await getMultimedia().then((datos) => { multimedia = datos });
  } else {

    switch (req.body.sucursal) {
      case '0':
        console.log("esto se debe mostra");
        await getMultimediaCALL().then((datos) => { multimedia = datos });
        break;
      case '1':
        await getMultimediaTALL().then((datos) => { multimedia = datos });
        break;

      case '2':
        await getMultimediaAALL().then((datos) => { multimedia = datos });
        break;
      case '3':
        await getMultimediaGALL().then((datos) => { multimedia = datos });
        break;
      case '4':
        await getMultimediaAUALL().then((datos) => { multimedia = datos });
        break;

    }

  }



  console.log("_____________________");

  console.log("si llegue aqui");
  console.log(multimedia);
  await res.json(multimedia);

}
controller.deleteUser = (req, res) => {

  DB.query("DELETE FROM usuarios where id= ? ", [req.body.idUser], (err) => {
    if (err) { console.log("Error eliminadno user"); console.log(err); res.status(200).json({ estado: "false" }); }
    console.log("usuario eliminado ");
    res.status(200).json({ estado: "true" });
  });


}
controller.galeria = async(req, res) => {
  var multimedia;
  await getMultimedia().then((datos) => { multimedia = datos });
  res.render('galeria',{multimedia:multimedia});
}
controller.upGaleria = (req, res) => {




  let imgFile = req.files.file;
  let date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hora = date.getMilliseconds();
  let datetme = new Date().toLocaleString();

  let dir = path.join(__dirname, "../../src/public/img/" + day.toString() + month.toString() + year.toString() + hora.toString() + ".jpg");
  let name = "/img/" + day.toString() + month.toString() + year.toString() + hora.toString() + ".jpg";

  imgFile.mv(dir, err => {



    if (err) {
      console.log("ERROR Subiendo la imagen: ");
      console.log(err);
      console.log(err); res.status(200).json({ estado: "false" });
    } else {

      if (req.body.tipo == 0) {
        DB.query("INSERT INTO multimedia (titulo, tipo, url, img, sucursal) VALUES ?", [[[req.body.titulo, req.body.tipo, req.body.url, name, req.body.sucursal]],], (result) => {
          if (err) { console.log("Error registrando multimedia"); console.log(err); res.status(200).json({ estado: "false" }); }
          console.log("Multimedia registrada video");
          res.status(200).json({ estado: "true" });
        });
      } else {
        DB.query("INSERT INTO multimedia (titulo, tipo, img, sucursal) VALUES ?", [[[req.body.titulo, req.body.tipo, name, req.body.sucursal]],], (result) => {
          if (err) { console.log("Error registrando multimedia"); console.log(err); res.status(200).json({ estado: "false" }); }
          console.log("Multimedia registrada imagen");
          res.status(200).json({ estado: "true" });
        });
      }

    }
  })


}

module.exports = controller;