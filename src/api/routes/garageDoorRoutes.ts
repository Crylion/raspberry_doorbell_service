import * as express from 'express';
import { listAllEvents, addEvent, removeAllEvents } from '../controllers/doorLockEventsController';
import { openGarageDoor } from '../controllers/garageDoorController';

export const garageDoorRoutes = (app: express.Application) => {
	app.route('/garageDoor/open')
		.post(openGarageDoor);
}
