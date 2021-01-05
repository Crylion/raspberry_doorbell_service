import { Gpio } from 'pigpio';

const PIN_BELL_ONE_RELAIS: number = 22;
const physical_bell_one_relais = new Gpio(PIN_BELL_ONE_RELAIS, {
	mode: Gpio.OUTPUT,
	pullUpDown: Gpio.PUD_UP
});

// initially set the lock to "off", because it sometimes is
// initialized with the wrong value
physical_bell_one_relais.digitalWrite(1);

export const triggerPhysicalBellOne = (duration: number = 200) => {
	console.log('Ringing Bell One');
	physical_bell_one_relais.digitalWrite(0);
	setTimeout(() => {
		physical_bell_one_relais.digitalWrite(1);
	}, duration);
}

const PIN_BELL_TWO_RELAIS: number = 23;
const physical_bell_two_relais = new Gpio(PIN_BELL_TWO_RELAIS, {
	mode: Gpio.OUTPUT,
	pullUpDown: Gpio.PUD_UP
});

// initially set the lock to "off", because it sometimes is
// initialized with the wrong value
physical_bell_two_relais.digitalWrite(1);

export const triggerPhysicalBellTwo = (duration: number = 200) => {
	console.log('Ringing Bell Two');
	physical_bell_two_relais.digitalWrite(0);
	setTimeout(() => {
		physical_bell_two_relais.digitalWrite(1);
	}, duration);
}
