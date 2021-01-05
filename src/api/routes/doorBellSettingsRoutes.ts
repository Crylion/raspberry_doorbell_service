import * as express from 'express';
import { changeSettingForId } from '../controllers/doorBellSettingsController';

export const doorBellSettingsRoutes = (app: express.Application) => {
	app.route('/bell/mute')
		.post(changeSettingForId);
}
