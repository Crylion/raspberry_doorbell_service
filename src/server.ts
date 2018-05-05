import { startListening } from './scripts/detect_doorbell';
import { allEventsRoutes } from './api/routes/allEventsRoutes';
import { doorLockRoutes } from './api/routes/doorLockRoutes';
import * as express from 'express';
import { connect } from 'mongoose';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { garageDoorRoutes } from './api/routes/garageDoorRoutes';

const packageInfo = require('../package.json');

const app = express();
const port = process.env.PORT || 2342;

// mongoose instance connection url connection

connect('mongodb://localhost/DoorbellDb', {
	useMongoClient: true,
	/* other options */
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true}));

// registering the routes by passing the app into our function
garageDoorRoutes(app);
doorLockRoutes(app);
allEventsRoutes(app);

app.route('/ping').get((req, res) => {
	res.send({
		version: packageInfo.version
	});
});

// middleware for reacting to a 404 situation
app.use(function (req, res, next) {
	res.status(404).send({ url: req.originalUrl + ' not found' });
	next();
});

app.listen(port);
console.log('Listening on ' + port);

// start listening to doorbell events
startListening();
