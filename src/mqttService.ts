import { get } from 'mongoose';
import { connect, MqttClient } from 'mqtt';
import { DoorbellSettingsModel } from './api/models/doorBellSettings';
import { triggerLockRelais } from './scripts/trigger_door_lock';

let mqttClient: MqttClient = connect('mqtt://localhost:1883');

export function getMqttClient (): Promise<MqttClient> {
	return new Promise((resolve, reject) => {
		console.log('getting mqtt client');
		if (mqttClient !== undefined && mqttClient.connected) {
			console.log('client was already ready');
			resolve(mqttClient)
		} else {
			mqttClient.on('connect', () => {
				console.log('client connected for the first time');
				resolve(mqttClient);
			});
		}
	});
}

export function startSubscriptions () {
	getMqttClient().then((client) => {

		client.subscribe([
			'door/lock/relais/command',
			'bell/bottom/muted/command',
			'bell/top/muted/command'
		], (err) => {
			if (err) {
				console.error('Subscription error', err);
			}
		});

		client.on('message', (topic, message) => {
			if (topic.startsWith('bell/')) {
				if (topic.includes('/muted/')) {
					const id = topic.includes('bottom') ? 'Bottom' : 'Top';
					DoorbellSettingsModel.findOne({ id }).lean().exec((err, setting) => {
						const toggledSetting = setting ? !setting.muted : false;
						DoorbellSettingsModel.findOneAndUpdate(
							{ id },
							{
								id,
								muted: toggledSetting
							},
							{ upsert: true },
							(err) => {
								if (err) {
									console.error('Error updating mute setting')
								} else {
									client.publish(`bell/${topic.includes('bottom') ? 'bottom' : 'top'}/muted`, toggledSetting === true ? '1' : '0', { retain: true })
								}
							});
					});
				}
			}

			if (topic === 'door/lock/relais/command') {
				client.publish('door/lock/relais', '1');
				triggerLockRelais(2000);
				setTimeout(() => {
					client.publish('door/lock/relais', '0');
				}, 2000);
			}
		});
	})
}

export function startUpdates () {
	getMqttClient().then((client) => {
		setInterval(() => {

			DoorbellSettingsModel.find({}).lean().exec((err, settings) => {
				if (err !== undefined && err !== null) {
					console.error('error finding doorbellsettings')
				} else {
					console.log('doorbellsettings', settings);

					const topSetting = settings.findIndex((s) => s.id === 'Top');
					const bottomSetting = settings.findIndex((s) => s.id === 'Bottom');
					if (topSetting !== -1) {
						client.publish('bell/top/muted', settings[topSetting].muted ? '1' : '0', { retain: true })
					} else {
						client.publish('bell/top/muted', '0', { retain: true })
					}

					if (bottomSetting !== -1) {
						client.publish('bell/bottom/muted', settings[bottomSetting].muted ? '1' : '0', { retain: true })
					} else {
						client.publish('bell/bottom/muted', '0', { retain: true })
					}

				}
			});

			client.publish('door/lock/relais', '0', { retain: true })

		}, 30000);
	});
}
