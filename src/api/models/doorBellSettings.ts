import { Schema, model, Model, Document } from 'mongoose';

const settingsSchema = new Schema({
	id: {
		type: String,
		default: 'Bottom'
	},
	muted: {
		type: Boolean,
		default: false
	}
});

// a setter
settingsSchema.path('id').set(function (value) {
	if (value !== 'Bottom' && value !== 'Top') return 'Bottom';
});

export const DoorbellSettingsModel: Model<Document> = model('DoorBellSettings', settingsSchema);
