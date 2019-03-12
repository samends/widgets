import { Buffer } from './Buffer';

import globalObject from '@dojo/framework/shim/global';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import { watch } from '@dojo/framework/widget-core/decorators/watch';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import {
	ThemedMixin,
	ThemedProperties,
	theme
} from '@dojo/framework/widget-core/mixins/Themed';

import * as css from '../theme/audio-player.m.css';

/**
 * @type AudioPlayer
 *
 * Properties that can be set on AudioPlayer components
 *
 */

export interface AudioPlayerProperties extends ThemedProperties {
	audioData: AudioData[];
	onStart?: () => void;
	onStop?: () => void;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<AudioPlayerProperties>({
	tag: 'dojo-audio-player',
	properties: ['theme', 'classes', 'extraClasses', 'audioData'],
	events: ['onStart', 'onStop']
})
export class AudioPlayerBase<
	P extends AudioPlayerProperties = AudioPlayerProperties
> extends ThemedBase<P> {
	private _audioContext: AudioContext = {} as AudioContext;
	private _buffer: Buffer = {} as Buffer;

	// Timer trigger to signal the end of one track and to start the next track
	private _trackTimeout: any;

	// Meta information for current audio track
	@watch() private _duration = 0;
	@watch() private _isPlaying = false;
	@watch() private _pauseTime = 0;
	@watch() private _startTime = 0;
	@watch() private _track = 0;
	@watch() private _loading = false;

	private _clearTrackTimeout() {
		clearTimeout(this._trackTimeout);
	}

	// Instantiates audio context, audio context can only be instantiated after a user interaction
	// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
	private _instantiateAudioContext() {
		if (
			Object.keys(Object.getPrototypeOf(this._audioContext)).length === 0
		) {
			this._audioContext = new (globalObject.AudioContext ||
				globalObject.webkitAudioContext)();
			this._buffer = new Buffer(this._audioContext);
		}
	}

	private _pauseTrack(index: number) {
		this._buffer.stop(index);
		this._pauseTime =
			this._audioContext.currentTime - this._startTime + this._pauseTime;
		this._isPlaying = false;
	}

	private _startTrack(
		url: string,
		index: number,
		startTime: number = 0
	): Promise<void> {
		return new Promise((res, reject) => {
			this._buffer
				.play(url, index, startTime)
				.then(({ duration }) => {
					this._track = index + 1;
					this._duration = duration;
					this._startTime = this._audioContext.currentTime;
					this._isPlaying = true;
					this._pauseTime = startTime;
					res();
				})
				.catch((error: Error) => {
					reject(error);
				});
		});
	}

	private _startTrackTimeout(audioData: AudioData[]) {
		this._trackTimeout = setTimeout(() => {
			if (audioData[this._track]) {
				this._toggleSound(this._track, audioData)();
			} else {
				this._isPlaying = false;
			}
		}, (this._duration - this._pauseTime) * 1000);
	}

	private _toggleSound(index: number, audioData: AudioData[]) {
		return () => {
			this._instantiateAudioContext();
			const url = audioData[index].url;
			if (this._track === index + 1 && this._isPlaying) {
				this._pauseTrack(index);
				this._clearTrackTimeout();
			} else {
				this._loading = true;
				// Are we re plauing the track or playing a new one?
				const startTime = (this._track === index + 1) ? this._pauseTime : 0;
				this._startTrack(url, index, startTime).then(() => {
					this._clearTrackTimeout();
					this._startTrackTimeout(audioData);
					this._loading = false;
				});
			}
		};
	}

	protected renderAudioHeader(
		audioData: {
			artist: string;
			title: string;
			url: string;
		}[]
	) {
		if (this._track !== 0) {
			const currentAudio = audioData[this._track - 1];
			return v(
				'div',
				{
					classes: this.theme(css.audioHeader)
				},
				[
					v(
						'span',
						{
							key: 'currentTrack'
						},
						[
							v('span', [`${currentAudio.title} - `]),
							v('span', [`${currentAudio.artist} - `])
						]
					),
					v(
						'span',
						{
							key: 'duration'
						},
						[`Duration ${this._duration}`]
					)
				]
			);
		} else {
			return v(
				'div',
				{
					classes: this.theme(css.audioHeader)
				},
				['No songs playing']
			);
		}
	}

	protected render() {
		const { audioData } = this.properties;

		const audioRows: VNode[] = audioData.map((audio, i, data) =>
			v(
				'div',
				{
					classes: this.theme(css.audioRow),
					key: i
				},
				[
					v(
						'button',
						{
							classes: this.theme(css.audioButton),
							onclick: this._toggleSound(i, data),
							disabled: this._loading
						},
						[
							v('div', {
								classes: [
									this.theme(css.playIcon),
									this._track === i + 1 && this._isPlaying
										? this.theme(css.paused)
										: ''
								]
							})
						]
					),
					v('div', [audio.artist]),
					v('div', [audio.title])
				]
			)
		);

		return v(
			'div',
			{
				classes: this.theme(css.root)
			},
			[
				v(
					'div',
					{
						classes: this.theme(css.audioContainer)
					},
					[this.renderAudioHeader(audioData)]
				),
				v(
					'div',
					{
						classes: this.theme(css.headerRow)
					},
					[v('span'), v('span', ['Artist']), v('span', ['Title'])]
				),
				v(
					'div',
					{
						classes: this.theme(css.audioContainer)
					},
					audioRows
				)
			]
		);
	}
}

interface AudioData {
	artist: string;
	title: string;
	url: string;
}

export default class AudioPlayer extends AudioPlayerBase<
	AudioPlayerProperties
> {}
