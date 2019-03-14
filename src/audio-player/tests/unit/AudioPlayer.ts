import { Buffer } from '../../Buffer';
const { assert, expect } = intern.getPlugin('chai');
import { noop, stubEvent } from '../../../common/tests/support/test-helpers';
const { registerSuite } = intern.getInterface('object');
import { v, w } from '@dojo/framework/widget-core/d';
import harness, { HarnessAPI } from '@dojo/framework/testing/harness';
import AudioPlayer from '../../index';
import * as sinon from 'sinon';
import * as css from '../../../theme/audio-player.m.css';
import * as AudioContext from '../../util/shims';
import { MockAudioContext } from '../support/MockAudioContext';
import { test } from '@dojo/framework/stores/state/operations';

const mockAudioData = [
	{
		title: 'XC72499 - Musician Wren - Cyphorhinus arada salvini',
		artist: 'Andrew Spencer',
		url: 'assets/audio/XC72499-Musician-Wren-Cyphorhinus-arada-salvini.mp3'
	},
	{
		title: 'XC146793 - Horned Screamer - Anhima cornuta',
		artist: 'Andrew Spencer',
		url: 'assets/audio/XC146793-Horned-Screamer-Anhima-cornuta.mp3'
	},
	{
		title: 'XC420159 - Bells Vireo - Vireo bellii',
		artist: 'Matt Wistrand',
		url: 'assets/audio/XC420159-Bells-Vireo-Vireo-bellii-short.mp3'
	},
	{
		title: 'Wish you were here',
		artist: 'The Madpix Project',
		url: 'assets/audio/The.madpix.project_-_Wish_You_Were_Here.mp3'
	}
];

sinon.stub(Buffer.prototype, 'play').returns(Promise.resolve({ duration: 30 }));
sinon.stub(Buffer.prototype, 'stop');
sinon.stub(AudioContext, 'getAudioContext').returns(MockAudioContext);

registerSuite('AudioPlayer', {
	tests: {
		'default rendering with blank array'() {
			const h = harness(() => w(AudioPlayer, { audioData: [] }));
			h.expect(() => v('div', ['No songs available']));
		},
		'default rendering with audio data'() {
			const h = harness(() => w(AudioPlayer, { audioData: mockAudioData }));
			h.expect(() =>
				v(
					'div',
					{
						classes: css.root
					},
					[
						v(
							'div',
							{
								classes: css.audioContainer
							},
							[
								v(
									'div',
									{
										classes: css.audioHeader
									},
									['No songs playing']
								)
							]
						),
						v(
							'div',
							{
								classes: css.headerRow
							},
							[v('span'), v('span', {}, ['Artist']), v('span', {}, ['Title'])]
						),
						v(
							'div',
							{
								classes: css.audioContainer
							},
							[
								v(
									'div',
									{
										classes: css.audioRow,
										key: 'audioRow0'
									},
									[
										v(
											'button',
											{
												classes: css.audioButton,
												onclick: noop,
												disabled: false,
												key: 'playButton0'
											},
											[
												v('div', {
													classes: [css.playIcon, null]
												})
											]
										),
										v('div', {}, ['Andrew Spencer']),
										v('div', {}, [
											'XC72499 - Musician Wren - Cyphorhinus arada salvini'
										])
									]
								),
								v(
									'div',
									{
										classes: css.audioRow,
										key: 'audioRow1'
									},
									[
										v(
											'button',
											{
												classes: css.audioButton,
												onclick: noop,
												disabled: false,
												key: 'playButton1'
											},
											[
												v('div', {
													classes: [css.playIcon, null]
												})
											]
										),
										v('div', {}, ['Andrew Spencer']),
										v('div', {}, [
											'XC146793 - Horned Screamer - Anhima cornuta'
										])
									]
								),
								v(
									'div',
									{
										classes: css.audioRow,
										key: 'audioRow2'
									},
									[
										v(
											'button',
											{
												classes: css.audioButton,
												onclick: noop,
												disabled: false,
												key: 'playButton2'
											},
											[
												v('div', {
													classes: [css.playIcon, null]
												})
											]
										),
										v('div', {}, ['Matt Wistrand']),
										v('div', {}, ['XC420159 - Bells Vireo - Vireo bellii'])
									]
								),
								v(
									'div',
									{
										classes: css.audioRow,
										key: 'audioRow3'
									},
									[
										v(
											'button',
											{
												classes: css.audioButton,
												onclick: noop,
												disabled: false,
												key: 'playButton3'
											},
											[
												v('div', {
													classes: [css.playIcon, null]
												})
											]
										),
										v('div', {}, ['The Madpix Project']),
										v('div', {}, ['Wish you were here'])
									]
								)
							]
						)
					]
				)
			);
		},

		'Rendering when a track is playing': {
			async 'should update the play button with the correct classes'() {
				let onStart: any;
				const startPromise = new Promise((resolve) => (onStart = resolve));

				const h = harness(() =>
					w(AudioPlayer, {
						audioData: mockAudioData,
						onStart
					})
				);
				h.trigger('@playButton1', 'onclick');
				return startPromise.then(() => {
					h.expectPartial('@playButton1', () =>
						v(
							'button',
							{
								classes: css.audioButton,
								onclick: noop,
								disabled: false,
								key: `playButton1`
							},
							[
								v('div', {
									classes: [css.playIcon, css.paused]
								})
							]
						)
					);
				});
			},
			async 'should update header with artist and title'() {
				let onStart: any;
				const startPromise = new Promise((resolve) => (onStart = resolve));

				const h = harness(() =>
					w(AudioPlayer, {
						audioData: mockAudioData,
						onStart
					})
				);
				h.trigger('@playButton1', 'onclick');
				return startPromise.then(() => {
					h.expectPartial('@audioHeader', () =>
						v(
							'div',
							{
								classes: css.audioHeader,
								key: 'audioHeader'
							},
							[
								v(
									'span',
									{
										key: 'currentTrack'
									},
									[
										v('span', [
											'XC146793 - Horned Screamer - Anhima cornuta - '
										]),
										v('span', ['Andrew Spencer - '])
									]
								),
								v(
									'span',
									{
										key: 'duration'
									},
									['Duration 30']
								)
							]
						)
					);
				});
			}
		},

		'Rendering when track is playing'() {
			let onStart: any;
			const startPromise = new Promise((resolve) => (onStart = resolve));

			const h = harness(() =>
				w(AudioPlayer, {
					audioData: mockAudioData,
					onStart
				})
			);
			h.trigger('@playButton1', 'onclick');
			return startPromise.then(() => {
				h.expectPartial('@audioHeader', () =>
					v(
						'div',
						{
							classes: css.audioHeader,
							key: 'audioHeader'
						},
						[
							v(
								'span',
								{
									key: 'currentTrack'
								},
								[
									v('span', ['XC146793 - Horned Screamer - Anhima cornuta - ']),
									v('span', ['Andrew Spencer - '])
								]
							),
							v(
								'span',
								{
									key: 'duration'
								},
								['Duration 30']
							)
						]
					)
				);

				h.expectPartial('@playButton1', () =>
					v(
						'button',
						{
							classes: css.audioButton,
							onclick: noop,
							disabled: false,
							key: `playButton1`
						},
						[
							v('div', {
								classes: [css.playIcon, css.paused]
							})
						]
					)
				);
			});
		},

		async events() {
			let onStart: any;
			const startPromise = new Promise((resolve) => (onStart = resolve));
			let onStop: any;
			const stopPromise = new Promise((resolve) => (onStop = resolve));

			const h = harness(() =>
				w(AudioPlayer, {
					audioData: mockAudioData,
					onStart,
					onStop
				})
			);

			h.trigger('@playButton1', 'onclick');
			return startPromise.then(() => {
				h.trigger('@playButton1', 'onclick');
				return stopPromise;
			});
		}
	}
});
