import { triggerGarageDoorRelais } from '../../scripts/trigger_garage_door';
import { addEvent } from './garageDoorEventsController';

export const openGarageDoor = (req, res) => {
	triggerGarageDoorRelais();
	addEvent(req, res);
}
