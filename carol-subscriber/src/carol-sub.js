const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
var fs = require('fs');

const app = express();

const clockinRoute = require('./routes/clockin-route');

const helmet = require('helmet');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json());

const { MAIN_PORT, NODE_ENV } = process.env;

NODE_ENV !== "production" ? app.use(morgan('dev')) : app.use(morgan('combined'));

app.use(helmet());
app.use(cors());
app.use('/api/clockin', clockinRoute);

app.listen(MAIN_PORT);
if (NODE_ENV !== "production") {
    console.log(`Clockin service is running at http://localhost:${MAIN_PORT}`);
}