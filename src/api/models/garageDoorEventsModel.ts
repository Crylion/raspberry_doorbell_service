import { Mongoose, Schema, model, Model, Document } from 'mongoose';

const eventSchema = new Schema({
	user: {
		type: String,
		default: 'Api'
	},
	dateTime: {
		type: Date,
		default: Date.now
	}
});

// a setter
eventSchema.path('dateTime').set(function (value) {
	return new Date(value);
});

export const GarageDoorEventModel: Model<Document> = model('GarageDoorEvent', eventSchema);
