import * as express from 'express';
import { listAllEvents, removeAllEvents } from '../controllers/allEventsController';

export const allEventsRoutes​​ = (app: express.Application) => {
	app.route('/events')
		.get(listAllEvents)
		.delete(removeAllEvents);
}
