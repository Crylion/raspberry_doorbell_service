import { model } from 'mongoose';
import { isNullOrUndefined } from 'util';
import { DoorLockEventModel } from '../models/doorLockEventsModel';

export const listAllEvents = (req, res) => {
	DoorLockEventModel.find({}).lean().exec((err, events) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {
			console.log(events);
			res.json(events);
		}
	});
}

export const addEvent = (req, res) => {
	var new_event = new DoorLockEventModel(req.body);
	new_event.save((err, event) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {
			res.json(event);
		}
	});
}

export const removeAllEvents = (req, res) => {
	DoorLockEventModel.deleteMany({}, (err) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {
			res.json({ message: 'List successfully cleared' });
		}
	});
}
