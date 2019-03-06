import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { w, v } from '@dojo/framework/widget-core/d';
import AudioPlayer from '../../audio-player/index';

export default class App extends WidgetBase {
	render() {
		return v('div', [
			v('h2', [ 'Audio web player development' ]),
			w(AudioPlayer, {})
		])
	}
}