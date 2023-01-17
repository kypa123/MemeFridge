import * as mysql from 'mysql'


const connection = mysql.createConnection({
    host : 'localhost',
    user : process.env.DB_ID,
    password: process.env.DB_PASSWORD,
    database : 'test_db'
})

connection.connect();

connection.query('SELECT * FROM Test', (err, rows, fields) =>{
    if (err) throw new Error;
    console.log('User info : ', rows)
});

connection.end();