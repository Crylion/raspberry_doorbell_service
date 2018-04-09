import { model } from 'mongoose';
import { DoorbellEventModel } from '../models/doorbellEventsModel';
import { isNullOrUndefined } from 'util';

export const listAllEvents = (req, res) => {
	DoorbellEventModel.find({}, (err, events) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {
			console.log(events);
			res.json(events);
		}
	});
}

export const addEvent = (req, res) => {
	var new_event = new DoorbellEventModel(req.body);
	new_event.save((err, event) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {
			res.json(event);
		}
	});
}

export const removeAllEvents = (req, res) => {
	DoorbellEventModel.deleteMany({}, (err) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {
			res.json({ message: 'List successfully cleared' });
		}
	});
}
