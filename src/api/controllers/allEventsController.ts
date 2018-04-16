import { model, Document } from 'mongoose';
import { DoorbellEventModel } from '../models/doorBellEventsModel';
import { isNullOrUndefined } from 'util';
import { DoorLockEventModel } from '../models/doorLockEventsModel';

export const listAllEvents = (req, res) => {
	DoorbellEventModel.find({}).lean().exec((err, doorBellEvents) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {

			doorBellEvents = doorBellEvents.map((bellEvent) => {
				bellEvent.modelName = 'DoorBellEvent';
				return bellEvent;
			})

			DoorLockEventModel.find({}).lean().exec((err, doorLockEvents) => {
				if (!isNullOrUndefined(err)) {
					res.send(err);
				} else {

					doorLockEvents = doorLockEvents.map((lockEvent) => {
						lockEvent.modelName = 'DoorLockEvent';
						return lockEvent;
					})

					const allEvents = doorBellEvents.concat(doorLockEvents);
					allEvents.sort((a, b) => {
						return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
					});
					console.log(allEvents);
					res.json(allEvents);
				}
			});
		}
	});
}

export const removeAllEvents = (req, res) => {
	DoorbellEventModel.deleteMany({}, (doorBellErr) => {
		if (!isNullOrUndefined(doorBellErr)) {
			res.send(doorBellErr);
		} else {
			DoorLockEventModel.deleteMany({}, (doorLockErr) => {
				if (!isNullOrUndefined(doorLockErr)) {
					res.send(doorLockErr);
				} else {
					res.json({ message: 'All Events successfully cleared' });
				}
			});
		}
	});
}
