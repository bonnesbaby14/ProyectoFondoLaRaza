
const mysql=require('mysql');

const DB=mysql.createConnection({
    host: 'localhost',
    user: 'fondolar_mainRoot',
    password: 'fondomainRootfondo2020',
    port:3306,
    database: 'fondolar_mainFondo'
  });
 // const DB=mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   port:3306,
//   database: 'fondolaraza'
// });




  DB.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Base de datos conectada.');
	}
});
  module.exports= DB;