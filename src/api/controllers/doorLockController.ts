import { addEvent } from './doorLockEventsController';
import { triggerLockRelais } from '../../scripts/trigger_door_lock';

export const openLock = (req, res) => {
	triggerLockRelais();
	// addEvent(req, res);
}
