import { doorbellEventsRoutes } from './api/routes/doorbellEventsRoutes';
import * as express from 'express';
import { connect } from 'mongoose';
import * as bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 2342;

// mongoose instance connection url connection

connect('mongodb://localhost/DoorbellDb');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// registering the routes by passing the app into our function
doorbellEventsRoutes(app);

// middleware for reacting to a 404 situation
app.use(function (req, res) {
	res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);
console.log('Listening on ' + port);
