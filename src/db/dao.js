import pg from 'pg';

``
const connection = new pg.Client({
    user: process.env.DB_ID,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    // password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

connection.connect();

connection.query("select * from test where id = '2222'", (err, res)=>{
    if (!err) console.log(res);
    else{
        console.log(err);
    }
    connection.end();
})