import * as express from 'express';
import { listAllEvents, addEvent, removeAllEvents } from '../controllers/doorLockEventsController';
import { openLock } from '../controllers/doorLockController';

export const doorLockEventsRoutes​​ = (app: express.Application) => {
	app.route('/events/lock')
		.get(listAllEvents)
		.delete(removeAllEvents);
}
