import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import renderer from '@dojo/framework/core/vdom';
import Select from './select/index';
import { v, w } from '@dojo/framework/core/vdom';
import { watch } from '@dojo/framework/core/decorators/watch';
import Outlet from '@dojo/framework/routing/Outlet';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import Registry from '@dojo/framework/core/Registry';
import Router from '@dojo/framework/routing/Router';
import dojoTheme from '../node_modules/@dojo/themes/dojo/index';
import { registerThemeInjector } from '@dojo/framework/core/mixins/Themed';
import Radio from './radio/index';
import AccordionPaneExample from './accordion-pane/example/index';
import ButtonExample from './button/example/index';
import OutlinedButtonExample from './outlined-button/example/index';
import CalendarExample from './calendar/example/index';
import CardExample from './card/example/index';
import CheckboxExample from './checkbox/index';
import ComboboxExample from './combobox/example/index';
import DialogExample from './dialog/example/index';
import GridExample from './grid/example/index';
import LabelExample from './label/example/index';
import ListboxExample from './listbox/example/index';
import ProgressExample from './progress/example/index';
import RadioExample from './radio/example/index';
import RaisedButtonExample from './raised-button/example/index';
import RangeSliderExample from './range-slider/example/index';
import SelectExample from './select/example/index';
import SlidePaneExample from './slide-pane/example/index';
import SliderExample from './slider/example/index';
import SnackbarExample from './snackbar/example/index';
import SplitPaneExample from './split-pane/example/index';
import TabControllerExample from './tab-controller/example/index';
import TextAreaExample from './text-area/example/index';
import TextInputExample from './text-input/example/index';
import TimePickerExample from './time-picker/example/index';
import TitlePaneExample from './title-pane/example/index';
import ToolbarExample from './toolbar/example/index';
import TooltipExample from './tooltip/example/index';
import { WNode, VNode } from '@dojo/framework/core/interfaces';

const modules: { [key: string]: VNode | WNode } = {
	'': v('div'),
	'accordion-pane': w(AccordionPaneExample, {}),
	button: w(ButtonExample, {}),
	'outlined-button': w(OutlinedButtonExample, {}),
	calendar: w(CalendarExample, {}),
	card: w(CardExample, {}),
	checkbox: w(CheckboxExample, {}),
	combobox: w(ComboboxExample, {}),
	dialog: w(DialogExample, {}),
	grid: w(GridExample, {}),
	label: w(LabelExample, {}),
	listbox: w(ListboxExample, {}),
	progress: w(ProgressExample, {}),
	radio: w(RadioExample, {}),
	'raised-button': w(RaisedButtonExample, {}),
	'range-slider': w(RangeSliderExample, {}),
	select: w(SelectExample, {}),
	'slide-pane': w(SlidePaneExample, {}),
	slider: w(SliderExample, {}),
	snackbar: w(SnackbarExample, {}),
	'split-pane': w(SplitPaneExample, {}),
	'tab-controller': w(TabControllerExample, {}),
	'text-area': w(TextAreaExample, {}),
	'text-input': w(TextInputExample, {}),
	'time-picker': w(TimePickerExample, {}),
	'title-pane': w(TitlePaneExample, {}),
	toolbar: w(ToolbarExample, {}),
	tooltip: w(TooltipExample, {})
};

interface ThemeOption {
	value: any;
	label: string;
}

let themes: ThemeOption[] = [
	{ label: 'none', value: undefined },
	{ label: 'dojo', value: dojoTheme }
];

const routes = [{ path: '{module}', outlet: 'module' }];

const registry = new Registry();
registerRouterInjector(routes, registry);
const themeInjector = registerThemeInjector(undefined, registry);

export class App extends WidgetBase {
	@watch()
	private _module = '';

	@watch()
	private _theme = themes[0].label;

	private _onModuleChange(module: string) {
		const router = new Router(routes);
		router.setPath(module);
	}

	private _onThemeChange(label: string) {
		const [theme] = themes.filter((theme: ThemeOption) => theme.label === label);
		if (theme) {
			themeInjector.set(theme.value);
			this._theme = theme.label;
		}
	}

	render() {
		return v('div', [
			v('fieldset', [
				v('legend', {}, ['Select Theme']),
				v(
					'div',
					themes.map((theme, index) => {
						return w(Radio, {
							key: theme.label.concat(index.toString()),
							checked: this._theme === theme.label,
							value: theme.label,
							label: theme.label,
							onValue: (checked: boolean) => {
								if (checked) {
									this._onThemeChange(theme.label);
								}
							}
						});
					})
				)
			]),
			v('div', { id: 'module-select' }, [
				v('h2', ['Select a module to view']),
				w(Select, {
					onValue: this._onModuleChange,
					useNativeElement: true,
					label: 'Select a module to view',
					options: Object.keys(modules),
					value: this._module,
					getOptionValue: (module: any) => module,
					getOptionLabel: (module: any) => module
				}),
				w(Outlet, {
					id: 'module',
					renderer: (matchDetail: any) => {
						if (this._module !== matchDetail.params.module) {
							this._module = matchDetail.params.module;
						}
						return modules[this._module];
					}
				})
			])
		]);
	}
}

const r = renderer(() => w(App, {}));
r.mount({ registry });
