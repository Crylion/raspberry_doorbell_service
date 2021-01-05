import axios from 'axios';
import { Observable } from 'rxjs';
import { apiKey } from '../api-key';
import { isNullOrUndefined } from 'util';
import { DoorbellSettingsModel } from '../api/models/doorBellSettings';
import { triggerPhysicalBellOne, triggerPhysicalBellTwo } from './trigger_physical_bell';

// Sending a push message via OneSignal
export const sendDoorbellNotification = (bellId: string) => {
	const pushRequest: Observable<any> = Observable.fromPromise(
		axios({
			method: 'post',
			url: 'https://onesignal.com/api/v1/notifications',
			data: {
				'app_id': '45ac3327-f972-4067-85d0-ec8ac1cfbdb4',
				'template_id': 'e5de7e99-06b4-4ddf-8e87-bb36c4ed80b1',
				'included_segments': bellId ? [bellId] : ['Bottom', 'Top']
			},
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + apiKey
			}
		})
	);

	pushRequest.subscribe((result: any) => {
		console.log('Successfully rang the doorbell :)');
	}, (error) => {
		console.log('Oh no! Something went wrong :(');
		console.log(error.status + ' ' + error.statusText);
	});
};

// Using the API of the node backend to save the event to the database
export const saveDoorbellEvent = (id?: string) => {
	const saveEventRequest = Observable.fromPromise(
		axios({
			method: 'post',
			url: 'http://localhost:2342/events/doorBell',
			data: {
				id: !isNullOrUndefined(id) ? id : undefined,
				dateTime: new Date()
			},
			headers: {
				'Content-Type': 'application/json',
			}
		})
	);

	saveEventRequest.subscribe((result) => {
		console.log('And wrote the event down for you');
	},
		(error) => {
			console.log('Oh no! I think my pen broke :(');
			console.log(error.status + ' ' + error.statusText);
		});
}

export const ringPhysicalBell = (id: string = 'Bottom') => {
	DoorbellSettingsModel.findOne({id}).lean().exec((err, setting) => {
		if (setting === null || setting === undefined || err || setting.muted === false) {
			switch (id) {
				case 'Bottom':
					triggerPhysicalBellOne();
					break;
				case 'Top':
					triggerPhysicalBellTwo();
					break;
			}
		}
	});
}
