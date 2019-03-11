import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { w, v } from '@dojo/framework/widget-core/d';
import AudioPlayer from '../../audio-player/index';

export default class App extends WidgetBase {
	private _audioData: any[] = [
		{
			title: 'XC72499 - Musician Wren - Cyphorhinus arada salvini',
			artist: 'Andrew Spencer',
			url:
				'assets/audio/XC72499-Musician-Wren-Cyphorhinus-arada-salvini.mp3'
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
	render() {
		return v('div', [
			w(AudioPlayer, {
				audioData: this._audioData
			})
		]);
	}
}
