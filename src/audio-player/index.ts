import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/widget-core/mixins/Themed';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import { v } from '@dojo/framework/widget-core/d';
import {css} from '../theme/audio-player.m.css';
import globalObject from '@dojo/framework/shim/global';

/**
 * @type AudioPlayer
 * 
 * Properties that can be set on AudioPlayer components
 * 
 */

 export interface AudioPlayerProperties extends ThemedProperties {
	onPlay?:() => void;
	onPause?: () => void;
 }

 export const ThemedBase = ThemedMixin(WidgetBase);

 @theme(css)
 @customElement<AudioPlayerProperties>({
	 tag: 'dojo-audio-player',
	 properties: ['theme', 'classes'],
	 events: ['onPlay', 'onPause']
 })
 export class AudioPlayerBase<P extends AudioPlayerProperties = AudioPlayerProperties> extends ThemedBase<P> {
	 audioContext: any;
	 constructor() {
		 super();
		 this.audioContext = new (globalObject.AudioContext || globalObject.webkitAudioContext)()
		 console.log('>>>', this.audioContext);
	 }
	protected render() {
		return v('div', {}, ['Hello']);
	}
 }

 export default class AudioPlayer extends AudioPlayerBase<AudioPlayerProperties>{}