import globalObject from '@dojo/framework/shim/global';

export function getAudioContext(): AudioContext {
	return new (globalObject.AudioContext ||
		globalObject.webkitAudioContext)();
}
