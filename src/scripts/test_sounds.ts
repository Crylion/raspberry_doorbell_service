import { playDoorbellSounds } from './handle_doorbell';

playDoorbellSounds('Top');

setTimeout(() => {
	playDoorbellSounds('Bottom');
}, 2000);
