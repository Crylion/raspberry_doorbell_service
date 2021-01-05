import { isNullOrUndefined } from 'util';
import { DoorbellSettingsModel } from '../models/doorBellSettings';

export const listAllSettings = (req, res) => {
	DoorbellSettingsModel.find({}).lean().exec((err, settings) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {
			res.json(settings);
		}
	});
}

export const getSettingForId = (req, res) => {
	const id = req.body.id !== undefined ? req.body.id : 'Bottom';
	DoorbellSettingsModel.findOne({ id }).lean().exec((err, setting) => {
		if (!isNullOrUndefined(err)) {
			res.send(err);
		} else {
			res.json(setting);
		}
	});
}

export const changeSettingForId = (req, res) => {
	const id = req.body.id !== undefined ? req.body.id : 'Bottom';
	DoorbellSettingsModel.findOneAndUpdate(
		{ id },
		req.body,
		{ upsert: true },
		(err) => {
			if (!isNullOrUndefined(err)) {
				res.send(err);
			} else {
				res.json({ message: 'Setting successfully updated' });
			}
		});
}
