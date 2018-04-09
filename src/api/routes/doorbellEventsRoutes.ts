import * as express from 'express';
import { listAllEvents, addEvent, removeAllEvents } from '../controllers/doorbellEventsController';

export const doorbellEventsRoutes​​ = (app: express.Application) => {
	app.route('/events')
		.get(listAllEvents)
		.post(addEvent)
		.delete(removeAllEvents);
}
