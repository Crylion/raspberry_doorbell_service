const axios = require('axios');
const Observable = require('rxjs').Observable;
const apiKey = require('./api-key');


const url = 'https://onesignal.com/api/v1/notifications';

const message = {
	'app_id': '45ac3327-f972-4067-85d0-ec8ac1cfbdb4',
	'template_id': 'e5de7e99-06b4-4ddf-8e87-bb36c4ed80b1',
	'included_segments': ['All']
};

const headers = {
	'Content-Type': 'application/json; charset=utf-8',
	'Authorization': 'Basic ' + apiKey
};

const request = Observable.fromPromise(
	axios({
		method: 'post',
		url: url,
		data: message,
		headers: headers
	})
);

request.subscribe((result) => {
	console.log('Successfully rang the doorbell :)');
},
(error) => {
	console.log('Oh no! Something went wrong :(');
	console.log(error.status + ' ' + error.statusText);
})
