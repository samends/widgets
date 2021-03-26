const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { formatAriaProperties, Keys } from '../../util';

registerSuite('util', {
	keys() {
		assert.strictEqual(Keys.Down, 'ArrowDown');
		assert.strictEqual(Keys.DownAlt, 'Down');
		assert.strictEqual(Keys.End, 'End');
		assert.strictEqual(Keys.Enter, 'Enter');
		assert.strictEqual(Keys.Escape, 'Escape');
		assert.strictEqual(Keys.EscapeAlt, 'Esc');
		assert.strictEqual(Keys.Home, 'Home');
		assert.strictEqual(Keys.Left, 'ArrowLeft');
		assert.strictEqual(Keys.LeftAlt, 'Left');
		assert.strictEqual(Keys.PageDown, 'PageDown');
		assert.strictEqual(Keys.Down, 'Down');
		assert.strictEqual(Keys.PageUp, 'PageUp');
		assert.strictEqual(Keys.Up, 'Up');
		assert.strictEqual(Keys.Right, 'ArrowRight');
		assert.strictEqual(Keys.RightAlt, 'Right');
		assert.strictEqual(Keys.Space, ' ');
		assert.strictEqual(Keys.SpaceAlt, 'Spacebar');
		assert.strictEqual(Keys.Tab, 'Tab');
		assert.strictEqual(Keys.Up, 'ArrowUp');
		assert.strictEqual(Keys.UpAlt, 'Up');
	},

	formatAriaProperties() {
		assert.deepEqual(formatAriaProperties({}), {}, 'handles empty object');

		const aria = {
			describedBy: 'foo',
			controls: 'bar'
		};
		const formattedAria = formatAriaProperties(aria);
		assert.strictEqual(Object.keys(formattedAria).length, 2);
		assert.strictEqual(formattedAria['aria-describedby'], 'foo');
		assert.strictEqual(formattedAria['aria-controls'], 'bar');
	}
});
