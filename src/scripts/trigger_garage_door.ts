import { Observable } from 'rxjs/Rx';
import { Gpio } from 'pigpio';
import axios from 'axios';
import { isNullOrUndefined } from 'util';

const PIN_GARAGE_DOOR_RELAIS: number = 27;
const garage_door_relais = new Gpio(PIN_GARAGE_DOOR_RELAIS, {
	mode: Gpio.OUTPUT,
	pullUpDown: Gpio.PUD_UP
});

// initially set the lock to "off", because it sometimes is
// initialized with the wrong value
garage_door_relais.digitalWrite(1);

export const triggerGarageDoorRelais = (duration: number = 500) => {
	console.log('Opening garage door');
	garage_door_relais.digitalWrite(0);
	setTimeout(() => {
		console.log('Turning of garage door relais again');
		garage_door_relais.digitalWrite(1);
	}, duration);
}

// Using the API of the node backend to save the event to the database
export const saveGarageDoorEvent = (user?: string) => {
	const saveEventRequest = Observable.fromPromise(
		axios({
			method: 'post',
			url: 'http://localhost:2342/events/garageDoor',
			data: {
				user: !isNullOrUndefined(user) ? user : undefined,
				dateTime: new Date()
			},
			headers: {
				'Content-Type': 'application/json',
			}
		})
	);

	saveEventRequest.subscribe((result) => {
		console.log('Saved the garage door event');
	},
		(error) => {
			console.log('Oh no! I think my pen broke :(');
			console.log(error.status + ' ' + error.statusText);
	});
}


