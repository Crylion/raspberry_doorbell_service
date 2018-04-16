import * as express from 'express';
import { listAllEvents, addEvent, removeAllEvents } from '../controllers/doorBellEventsController';

export const doorBellEventsRoutes​​ = (app: express.Application) => {
	app.route('/events/doorBell')
		.get(listAllEvents)
		.post(addEvent)
		.delete(removeAllEvents);
}
