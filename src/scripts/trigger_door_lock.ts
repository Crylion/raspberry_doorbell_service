import { Observable } from 'rxjs/Rx';
import { Gpio } from 'pigpio';
import axios from 'axios';
import { isNullOrUndefined } from 'util';

const PIN_DOORBELL_RELAIS: number = 17;
const lock_relais = new Gpio(PIN_DOORBELL_RELAIS, {
	mode: Gpio.OUTPUT,
	pullUpDown: Gpio.PUD_UP
});

export const triggerLockRelais = (duration: number = 2000) => {
	console.log('Opening door');
	lock_relais.digitalWrite(0);
	setTimeout(() => {
		console.log('Turning of door relais again');
		lock_relais.digitalWrite(1);
	}, duration);
}

// Using the API of the node backend to save the event to the database
export const saveDoorLockEvent = (user?: string) => {
	const saveEventRequest = Observable.fromPromise(
		axios({
			method: 'post',
			url: 'http://localhost:2342/events/doorLock',
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
		console.log('Wrote a bell event down for you');
	},
		(error) => {
			console.log('Oh no! I think my pen broke :(');
			console.log(error.status + ' ' + error.statusText);
	});
}


