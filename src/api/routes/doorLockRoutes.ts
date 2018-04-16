import * as express from 'express';
import { listAllEvents, addEvent, removeAllEvents } from '../controllers/doorLockEventsController';
import { openLock } from '../controllers/doorLockController';

export const doorLockRoutes​​ = (app: express.Application) => {
	app.route('/lock/open')
		.post(openLock);
}
