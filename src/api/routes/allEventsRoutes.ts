import * as express from 'express';
import { listAllEvents, removeAllEvents } from '../controllers/allEventsController';
import { listAllEvents as listAllDoorbellEvents, addEvent as addDoorbellEvent, removeAllEvents as removeAllDoorbellEvents } from '../controllers/doorBellEventsController';
import { listAllEvents as listAllDoorlockEvents, removeAllEvents as removeAllDoorlockEvents } from '../controllers/doorLockEventsController';
import { listAllEvents as listAllGarageDoorEvents, removeAllEvents as removeAllGarageDoorEvents } from '../controllers/garageDoorEventsController';

export const allEventsRoutes = (app: express.Application) => {
	app.route('/events')
		.get(listAllEvents)
		.delete(removeAllEvents);

	app.route('/events/doorBell')
		.get(listAllDoorbellEvents)
		.post(addDoorbellEvent)
		.delete(removeAllDoorbellEvents);

	app.route('/events/lock')
		.get(listAllDoorlockEvents)
		.delete(removeAllDoorlockEvents);

	app.route('/events/garageDoor')
		.get(listAllGarageDoorEvents)
		.delete(removeAllGarageDoorEvents);
}
