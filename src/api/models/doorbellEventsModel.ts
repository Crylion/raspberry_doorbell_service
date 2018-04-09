import { Mongoose, Schema, model, Model, Document } from 'mongoose';

const eventSchema = new Schema({
	dateTime: {
		type: Date,
		default: Date.now
	}
});

// a setter
eventSchema.path('dateTime').set(function (value) {
	return new Date(value);
});

export const DoorbellEventModel: Model<Document> = model('DoorbellEvent', eventSchema);
