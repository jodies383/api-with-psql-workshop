const PgPromise = require("pg-promise")
const express = require('express');
const fs = require('fs');
require('dotenv').config()

const API = require('./api');
const { default: axios } = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DATABASE_URL = process.env.DATABASE_URL;
const pgp = PgPromise({});
const db = pgp(DATABASE_URL);
app.use(express.static('public'))
API(app, db);

//configure the port number using and environment number
var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('server listening on:', portNumber);
});