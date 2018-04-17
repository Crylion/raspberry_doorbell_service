import { Observable } from 'rxjs/Rx';
import { Gpio } from 'onoff';
import axios from 'axios';
import { isNullOrUndefined } from 'util';

export const triggerLockRelais = (duration: number = 2000) => {
	const lock_relais = new Gpio(17, 'out');

	lock_relais.writeSync(1);
	setTimeout(() => {
		console.log('Turning of relais again');
		lock_relais.writeSync(0);
	}, duration);

	lock_relais.unexport();

	// failsafe, if process gets killed before the timeout is completed, we unexport the gpio object
	process.on('SIGINT', () => {
		console.log('SIGINT received');
		lock_relais.unexport();
	});
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
		console.log('And wrote the event down for you');
	},
		(error) => {
			console.log('Oh no! I think my pen broke :(');
			console.log(error.status + ' ' + error.statusText);
	});
}

triggerLockRelais();
