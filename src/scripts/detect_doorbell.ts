import { Observable } from 'rxjs/Rx';
import { isNullOrUndefined } from 'util';
import { Gpio } from 'pigpio';
import { sendDoorbellNotification, saveDoorbellEvent } from './handle_doorbell';

const PIN_DOORBELL_BOTTOM: number = 16;
const PIN_DOORBELL_TOP: number = 12;
const PIN_DOORBELL_RELAIS: number = 27;

const doorbell_bottom = new Gpio(PIN_DOORBELL_BOTTOM, {
	mode: Gpio.INPUT,
	edge: Gpio.RISING_EDGE,
	pullUpDown: Gpio.PUD_UP
});
const doorbell_top = new Gpio(PIN_DOORBELL_TOP, {
	mode: Gpio.INPUT,
	edge: Gpio.RISING_EDGE,
	pullUpDown: Gpio.PUD_UP
});
const doorbell_relais = new Gpio(PIN_DOORBELL_RELAIS, {
	mode: Gpio.OUTPUT
});

export const startListening = () => {

	console.log('Gonna listen to doorbell on ' + PIN_DOORBELL_BOTTOM);
	doorbell_bottom.on('interrupt', (value) => {
		let bellTimeout: boolean = false;
		if (!isNullOrUndefined(value) && bellTimeout === false) {
			console.log('Detected a falling flank on ' + PIN_DOORBELL_BOTTOM);
			doorbell_relais.digitalWrite(1);
			sendDoorbellNotification();
			saveDoorbellEvent('Bottom');

			bellTimeout = true;

			setTimeout(() => {
				console.log('Turning of relais again');
				doorbell_relais.digitalWrite(0);
				bellTimeout = false
			}, 1000);
		}

	});

	console.log('Gonna listen to doorbell on ' + PIN_DOORBELL_TOP);
	doorbell_top.on('interrupt', (value) => {
		let bellTimeout: boolean = false;
		if (!isNullOrUndefined(value) && bellTimeout === false) {
			console.log('Detected a falling flank on ' + PIN_DOORBELL_TOP);
			doorbell_relais.digitalWrite(1);
			sendDoorbellNotification();
			saveDoorbellEvent('Bottom');

			bellTimeout = true;

			setTimeout(() => {
				console.log('Turning of relais again');
				doorbell_relais.digitalWrite(0);
				bellTimeout = false
			}, 1000);
		}

	});

}
