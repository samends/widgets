const { assert } = intern.getPlugin('chai');
const { registerSuite } = intern.getInterface('object');

import { v, w } from '@dojo/framework/widget-core/d';
import * as sinon from 'sinon';
import harness from '@dojo/framework/testing/harness';

import * as css from '../../../theme/audio-player.m.css';
import AudioPlayer from '../../index';

import { noop } from '../../../common/tests/support/test-helpers';

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

registerSuite('AudioPlayer', {
	tests: {
		'default rendering with blank array'() {
			const h = harness(() =>
				w(AudioPlayer, { audioData: [] })
			);
			h.expect(() => v('div', ['No songs available']));
		},
		'default rendering with audio data'() {
			const h = harness(() =>
				w(AudioPlayer, { audioData: mockAudioData })
			);
			h.expect(() => v('div', {
				classes: css.root
			}, [
				v('div', {
					classes: css.audioContainer
				}, [
					v('div', {
						classes: css.audioHeader
					}, ['No songs playing'])
				]),
				v('div', {
					classes: css.headerRow
				}, [
					v('span'),
					v('span', {}, ['Artist']),
					v('span', {}, ['Title'])
				]),
				v('div', {
					classes: css.audioContainer
				}, [
					v('div', {
						classes: css.audioRow,
						key: 0
					}, [
						v('button', {
							classes: css.audioButton,
							onclick: noop,
							disabled: false
						}, [
							v('div', {
								classes: [css.playIcon, null]
							})
						]),
						v('div', {}, ['Andrew Spencer']),
						v('div', {}, ['XC72499 - Musician Wren - Cyphorhinus arada salvini'])
					]),
					v('div', {
						classes: css.audioRow,
						key: 1
					}, [
						v('button', {
							classes: css.audioButton,
							onclick: noop,
							disabled: false
						}, [
							v('div', {
								classes: [css.playIcon, null]
							})
						]),
						v('div', {}, ['Andrew Spencer']),
						v('div', {}, ['XC146793 - Horned Screamer - Anhima cornuta'])
					]),
					v('div', {
						classes: css.audioRow,
						key: 2
					}, [
						v('button', {
							classes: css.audioButton,
							onclick: noop,
							disabled: false
						}, [
							v('div', {
								classes: [css.playIcon, null]
							})
						]),
						v('div', {}, ['Matt Wistrand']),
						v('div', {}, ['XC420159 - Bells Vireo - Vireo bellii'])
					]),
					v('div', {
						classes: css.audioRow,
						key: 3
					}, [
						v('button', {
							classes: css.audioButton,
							onclick: noop,
							disabled: false
						}, [
							v('div', {
								classes: [css.playIcon, null]
							})
						]),
						v('div', {}, ['The Madpix Project']),
						v('div', {}, ['Wish you were here'])
					])
				])
			]
			));
		}
	}
});
