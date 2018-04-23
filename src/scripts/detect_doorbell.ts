import { Observable } from 'rxjs/Rx';
import { isNullOrUndefined } from 'util';
import { Gpio } from 'pigpio';
import { sendDoorbellNotification, saveDoorbellEvent, playDoorbellSounds } from './handle_doorbell';

const PIN_DOORBELL_BOTTOM: number = 16;
const PIN_DOORBELL_TOP: number = 12;
const PIN_DOORBELL_RELAIS: number = 27;

const doorbell_bottom = new Gpio(PIN_DOORBELL_BOTTOM, {
	mode: Gpio.INPUT,
	edge: Gpio.FALLING_EDGE,
	pullUpDown: Gpio.PUD_UP
});
const doorbell_top = new Gpio(PIN_DOORBELL_TOP, {
	mode: Gpio.INPUT,
	edge: Gpio.FALLING_EDGE,
	pullUpDown: Gpio.PUD_UP
});
const doorbell_relais = new Gpio(PIN_DOORBELL_RELAIS, {
	mode: Gpio.OUTPUT
});

export const startListening = () => {

	console.log('Gonna listen to doorbell on ' + PIN_DOORBELL_BOTTOM);

	let doorbell_bottom_timeout: NodeJS.Timer;
	doorbell_bottom.on('interrupt', (value) => {
		const firstValueRead = doorbell_bottom.digitalRead();
		console.log('Detected a ' + value + ' flank on ' + PIN_DOORBELL_BOTTOM + ' current value is ' + firstValueRead);

		// we use a short timeout to verify if the button is actually pressed
		// right now. used to filter out false positives
		clearTimeout(doorbell_bottom_timeout);
		doorbell_bottom_timeout = setTimeout(() => {

			// bellCooldown is used to trigger the bell only once every second
			// at max, avoids spamming
			let bellCooldown: boolean = false;
			if (!isNullOrUndefined(value) && value === 0
				&& bellCooldown === false
				&& doorbell_bottom.digitalRead() === firstValueRead) {

				console.log('Accepted bell event from ' + PIN_DOORBELL_BOTTOM);
				doorbell_relais.digitalWrite(1);
				// sendDoorbellNotification();
				saveDoorbellEvent('Bottom');
				playDoorbellSounds('Bottom');

				bellCooldown = true;

				setTimeout(() => {
					console.log('Turning of relais again');
					doorbell_relais.digitalWrite(0);
					bellCooldown = false
				}, 1000);
			}
		}, 50);

	});

	console.log('Gonna listen to doorbell on ' + PIN_DOORBELL_TOP);
	let doorbell_top_timeout: NodeJS.Timer;
	doorbell_top.on('interrupt', (value) => {
		const firstValueRead = doorbell_top.digitalRead();
		console.log('Detected a ' + value + ' flank on ' + PIN_DOORBELL_TOP + ' current value is ' + firstValueRead);

		// we use a short timeout to verify if the button is actually pressed
		// right now. used to filter out false positives
		clearTimeout(doorbell_top_timeout);
		doorbell_top_timeout = setTimeout(() => {

			// bellCooldown is used to trigger the bell only once every second
			// at max, avoids spamming
			let bellCooldown: boolean = false;
			if (!isNullOrUndefined(value) && value === 0
				&& bellCooldown === false
				&& doorbell_top.digitalRead() === firstValueRead) {

				console.log('Accepted bell event from ' + PIN_DOORBELL_TOP);
				doorbell_relais.digitalWrite(1);
				// sendDoorbellNotification();
				saveDoorbellEvent('Top');
				playDoorbellSounds('Top');

				bellCooldown = true;

				setTimeout(() => {
					console.log('Turning of relais again');
					doorbell_relais.digitalWrite(0);
					bellCooldown = false
				}, 1000);
			}
		}, 50);

	});

}
