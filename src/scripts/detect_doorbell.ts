import { Observable } from 'rxjs/Rx';
import { isNullOrUndefined } from 'util';
import { Gpio } from 'pigpio';
import { sendDoorbellNotification, saveDoorbellEvent, playDoorbellSounds } from './handle_doorbell';

const PIN_DOORBELL_BOTTOM: number = 16;
const PIN_DOORBELL_TOP: number = 12;

const doorbell_bottom = new Gpio(PIN_DOORBELL_BOTTOM, {
	mode: Gpio.INPUT,
	edge: Gpio.FALLING_EDGE,
	pullUpDown: Gpio.PUD_UP
});
// bellCooldown is used to trigger the bell only once every second
// at max, avoids spamming
let bellBottomCooldown: boolean = false;

const doorbell_top = new Gpio(PIN_DOORBELL_TOP, {
	mode: Gpio.INPUT,
	edge: Gpio.FALLING_EDGE,
	pullUpDown: Gpio.PUD_UP
});
// bellCooldown is used to trigger the bell only once every second
// at max, avoids spamming
let bellTopCooldown: boolean = false;


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

			if (!isNullOrUndefined(value) && value === 0
				&& bellBottomCooldown === false
				&& doorbell_bottom.digitalRead() === firstValueRead) {

				bellBottomCooldown = true;

				console.log('Accepted bell event from ' + PIN_DOORBELL_BOTTOM);
				sendDoorbellNotification('Bottom');
				saveDoorbellEvent('Bottom');
				playDoorbellSounds('Bottom');


				setTimeout(() => {
					bellBottomCooldown = false
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

			if (!isNullOrUndefined(value) && value === 0
				&& bellTopCooldown === false
				&& doorbell_top.digitalRead() === firstValueRead) {

				bellTopCooldown = true;
				console.log('Accepted bell event from ' + PIN_DOORBELL_TOP);

				sendDoorbellNotification('Top');
				saveDoorbellEvent('Top');
				playDoorbellSounds('Top');


				setTimeout(() => {
					bellTopCooldown = false
				}, 1000);
			}
		}, 50);

	});

}
