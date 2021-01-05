import { isNullOrUndefined } from 'util';
import { Gpio } from 'pigpio';

const PIN_DOORBELL_BOTTOM: number = 16;
const PIN_DOORBELL_TOP: number = 12;

const doorbell_bottom = new Gpio(PIN_DOORBELL_BOTTOM, {
	mode: Gpio.INPUT,
	edge: Gpio.EITHER_EDGE,
	pullUpDown: Gpio.PUD_UP
});
const doorbell_top = new Gpio(PIN_DOORBELL_TOP, {
	mode: Gpio.INPUT,
	edge: Gpio.EITHER_EDGE,
	pullUpDown: Gpio.PUD_UP
});
// const doorbell_relais = new Gpio(PIN_DOORBELL_RELAIS, 'out');
// const lock_relais = new Gpio(PIN_LOCK_RELAIS, 'out');

const value_bottom = doorbell_bottom.digitalRead();
const value_top = doorbell_top.digitalRead();

console.log('----------');
console.log('Current value of pin is ' + PIN_DOORBELL_BOTTOM + ': ' + (value_bottom === 1 ? 'high' : 'low'));
console.log('Current value of pin is ' + PIN_DOORBELL_TOP + ': ' + (value_top === 1 ? 'high' : 'low'));
// console.log('Current value of pin is ' + PIN_DOORBELL_RELAIS + ': ' + (value_bell === 1 ? 'high' : 'low'));
// console.log('Current value of pin is ' + PIN_LOCK_RELAIS + ': ' + (value_lock === 1 ? 'high' : 'low'));
console.log('----------');

console.log('Gonna listen to doorbell on ' + PIN_DOORBELL_BOTTOM);
doorbell_bottom.on('interrupt', (value) => {
	if (!isNullOrUndefined(value)) {
		console.log('Detected a ' + (value === 1 ? 'rising' : (value === 0 ? 'falling' : 'unclear')) + ' flank on ' + PIN_DOORBELL_BOTTOM);
		//console.log('value ' + value + ' on ' + PIN_DOORBELL_BOTTOM);
	}
});

console.log('Gonna listen to doorbell on ' + PIN_DOORBELL_TOP);
doorbell_top.on('interrupt', (value) => {
	if (!isNullOrUndefined(value)) {
		console.log('Detected a ' + (value === 1 ? 'rising' : (value === 0 ? 'falling' : 'unclear')) + ' flank on ' + PIN_DOORBELL_TOP);
		//console.log('value ' + value + ' on ' + PIN_DOORBELL_TOP);
	}
});
