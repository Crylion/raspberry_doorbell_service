import { startListening } from './scripts/detect_doorbell';
import { allEventsRoutes } from './api/routes/allEventsRoutes';
import { doorLockRoutes } from './api/routes/doorLockRoutes';
import * as express from 'express';
import { connect } from 'mongoose';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { garageDoorRoutes } from './api/routes/garageDoorRoutes';
import * as mdns from 'mdns';
import { Server } from 'aedes';
import * as http from 'http';
import * as ws from 'websocket-stream';
import { createServer } from 'net'
import { startSubscriptions, startUpdates } from './mqttService';

const packageInfo = require('../package.json');

const app = express();
const port = process.env.PORT || 2342;
const wsPort = 1884;
const httpServer = http.createServer();
const mqttPort = 1883;
const aedesHandle = Server().handle;
const mqttServer = createServer(aedesHandle)
ws.createServer({ server: httpServer }, aedesHandle as any)

// mongoose instance connection url connection
connect('mongodb://localhost/DoorbellDb', {
	useMongoClient: true
	/* other options */
}).then(() => {console.log('connected to mongo DB')})
.catch((error) => {console.log('error connecting to mongo DB', error)});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true }));

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

mqttServer.listen(mqttPort, function () {
	console.log('mqtt broker started and listening on port ' + mqttPort)
});

httpServer.listen(wsPort, function () {
	console.log('websocket broker started and listening on port ' + wsPort)
	startSubscriptions();
	startUpdates();
});

app.listen(port, () => {
	// when server is started, start listening to doorbell events
	console.log('Express server listening on ' + port);
	startListening();

	// also start advertising it via zeroconf
	var ad;
	function createAdvertisement () {
		try {
			ad = mdns.createAdvertisement(mdns.tcp('http'), port, {
				name: 'SmartHolunder'
			});
			ad.on('error', handleError);
			ad.start();
		} catch (ex) {
			handleError(ex);
		}
	}

	function handleError (error) {
		switch (error.errorCode) {
			case mdns.kDNSServiceErr_Unknown:
				console.warn(error);
				setTimeout(createAdvertisement, 5000);
				break;
			default:
				throw error;
		}
	}

	createAdvertisement();
});
