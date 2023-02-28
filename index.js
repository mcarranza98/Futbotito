'use strict';

const admin = require("firebase-admin");
const axios = require('axios');
var fs = require('fs');

const { Client, MessageMedia, Location, List, LocalAuth} = require('whatsapp-web.js');

//const client = new Client({authStrategy: new LocalAuth(), puppeteer: {headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']}, clientId: 'example' });
 const client = new Client({authStrategy: new LocalAuth(), puppeteer: {headless: false, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']}, clientId: 'example' });
client.initialize();

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});


client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

client.on('message', async msg => {

    let { from, body } = msg;

    let nombres = body.split(',');

    const equipos = equiposAleatorios(nombres);

    let resp = 'Los equipos son: '

    let suplentes = [];

    equipos.forEach( equipo => {

        if( equipo.length  == 2 ){

            resp += `${equipo[0]} y ${equipo[1]}, `

            suplentes.push(equipo[numeroAleatorio(2)]);

        }else{

            resp += `${equipo[0]} juega con: `

            suplentes.forEach( suplente  => {
                
                console.log( suplentes );
                resp += `${ suplente }, `

            });

        }

    });

    client.sendMessage( from, resp );

});

function numeroAleatorio(max) {
    return Math.floor(Math.random() * max);
}

function equiposAleatorios(arr) {
    const pairs = [];
    while (arr.length > 1) {
        const index1 = Math.floor(Math.random() * arr.length);
        const string1 = arr.splice(index1, 1)[0];
        const index2 = Math.floor(Math.random() * arr.length);
        const string2 = arr.splice(index2, 1)[0];
        pairs.push([string1, string2]);
    }
    if (arr.length > 0) {
        pairs.push([arr[0]]);
    }
    return pairs;
}