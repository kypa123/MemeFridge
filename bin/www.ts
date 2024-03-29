#!/usr/bin/env node
import app from '../src/app.js';
import * as http from 'http';
import debug from 'debug';
import pg from 'pg';
import { createClient } from 'redis';

const conn = new pg.Client(process.env.POSTGRES_CONNECTION);

const dbCheck = async () => {
    //check if pg is running
    await conn.connect();
    const res = await conn.query('LISTEN foo');
    if (res) {
        console.log('pg ok');
    }
    await conn.end();

    // Check if redis is running
    const client = createClient({
        url: process.env.REDIS_CONNECTION,
    });
    await client.connect();
    if (client.isOpen) {
        console.log('redis ok');
        client.set('isOK', 1);
    }
};

dbCheck();

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    let port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
