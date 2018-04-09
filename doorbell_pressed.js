const axios = require('axios');
const Observable = require('rxjs').Observable;
const apiKey = require('./api-key');

// Sending a push message via OneSignal
const pushRequest = Observable.fromPromise(
	axios({
		method: 'post',
		url: 'https://onesignal.com/api/v1/notifications',
		data: {
			'app_id': '45ac3327-f972-4067-85d0-ec8ac1cfbdb4',
			'template_id': 'e5de7e99-06b4-4ddf-8e87-bb36c4ed80b1',
			'included_segments': ['All']
		},
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Basic ' + apiKey
		}
	})
);

pushRequest.subscribe((result) => {
	console.log('Successfully rang the doorbell :)');
},
(error) => {
	console.log('Oh no! Something went wrong :(');
	console.log(error.status + ' ' + error.statusText);
});

// Using the API of the node backend to save the event to the database
const saveEventRequest = Observable.fromPromise(
	axios({
		method: 'post',
		url: 'http://localhost:2342/events',
		data: {
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
