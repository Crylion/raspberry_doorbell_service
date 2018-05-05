import { model } from 'mongoose';
import { isNullOrUndefined } from 'util';
import { GarageDoorEventModel } from '../models/garageDoorEventsModel';

export const listAllEvents = (req, res) => {
	GarageDoorEventModel.find({}).lean().exec((err, events) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {
			res.json(events);
		}
	});
}

export const addEvent = (req, res) => {
	var new_event = new GarageDoorEventModel(req.body);
	new_event.save((err, event) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {
			console.log('Wrote new garage door event: ' + event);
			res.json(event);
		}
	});
}

export const removeAllEvents = (req, res) => {
	GarageDoorEventModel.deleteMany({}, (err) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {
			res.json({ message: 'List successfully cleared' });
		}
	});
}
