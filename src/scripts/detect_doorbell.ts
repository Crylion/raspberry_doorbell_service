import { Observable } from 'rxjs/Rx';
import { isNullOrUndefined } from 'util';
import { Gpio } from 'onoff';
import { sendDoorbellNotification, saveDoorbellEvent } from './handle_doorbell';

const PIN_DOORBELL_BOTTOM: number = 16;
const PIN_DOORBELL_TOP: number = 12;
const PIN_DOORBELL_RELAIS: number = 27;

const doorbell_bottom = new Gpio(PIN_DOORBELL_BOTTOM, 'in', 'rising', { debounceTimeout: 10 });
const doorbell_top = new Gpio(PIN_DOORBELL_TOP, 'in', 'rising', { debounceTimeout: 10 });
const doorbell_relais = new Gpio(27, 'out');

console.log('Gonna listen to doorbell on ' + PIN_DOORBELL_BOTTOM);
doorbell_bottom.watch((err, value) => {
	if (!isNullOrUndefined(err)) {
		throw err;
	}

	console.log('Detected a rising flank on ' + PIN_DOORBELL_BOTTOM);
	doorbell_relais.writeSync(1);
	sendDoorbellNotification();
	saveDoorbellEvent('Bottom');

	setTimeout(() => {
		console.log('Turning of relais again');
		doorbell_relais.writeSync(0);
	}, 2000);

});

console.log('Gonna listen to doorbell on ' + PIN_DOORBELL_TOP);
doorbell_top.watch((err, value) => {
	if (!isNullOrUndefined(err)) {
		throw err;
	}

	console.log('Detected a rising flank on ' + PIN_DOORBELL_TOP);
	doorbell_relais.writeSync(1);
	sendDoorbellNotification();
	saveDoorbellEvent('Top');

	setTimeout(() => {
		console.log('Turning of relais again');
		doorbell_relais.writeSync(0);
	}, 2000);

});

process.on('SIGINT', () => {
	console.log('Stopping listening on ' + PIN_DOORBELL_BOTTOM);
	console.log('Stopping listening on ' + PIN_DOORBELL_TOP);
	doorbell_bottom.unexport();
	doorbell_top.unexport();
	doorbell_relais.unexport();
});
