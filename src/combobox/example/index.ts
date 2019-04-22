import { DNode } from '@dojo/framework/widget-core/interfaces';
import { v, w } from '@dojo/framework/widget-core/d';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import ComboBox from '../../combobox/index';

const data = [
	{ value: 'Maine' },
	{ value: 'New Hampshire' },
	{ value: 'Vermont' },
	{ value: 'Massachusetts' },
	{ value: 'Connecticut' },
	{ value: 'Rhode Island' },
	{ value: 'New York' },
	{ value: 'New Jersey' },
	{ value: 'Pennsylvania' },
	{ value: 'Delaware' },
	{ value: 'Maryland' },
	{ value: 'Virginia' },
	{ value: 'Florida' },
	{ value: 'Texas' },
	{ value: 'Kentucky' },
	{ value: 'Tennessee' },
	{ value: 'North Carolina' },
	{ value: 'South Carolina' },
	{ value: 'Georgia' },
	{ value: 'Alabama' },
	{ value: 'Mississippi' },
	{ value: 'Arkansas' },
	{ value: 'Louisiana' },
	{ value: 'Missouri' },
	{ value: 'Oklahoma' },
	{ value: 'Ohio' },
	{ value: 'Nebraska' },
	{ value: 'Michigan' },
	{ value: 'Indiana' },
	{ value: 'Wisconsin' },
	{ value: 'Illinois' },
	{ value: 'Minnesota' },
	{ value: 'Iowa' },
	{ value: 'North Dakota' },
	{ value: 'South Dakota' },
	{ value: 'Kansas' },
	{ value: 'Colorado' },
	{ value: 'New Mexico' },
	{ value: 'Arizona' },
	{ value: 'Nevada' },
	{ value: 'California' },
	{ value: 'Wyoming' },
	{ value: 'Montana' },
	{ value: 'Utah' },
	{ value: 'Idaho' },
	{ value: 'Washington' },
	{ value: 'Oregon' },
	{ value: 'Alaska' },
	{ value: 'Hawaii' },
	{ value: 'West Virginia' }
];

export default class App extends WidgetBase {
	private _results: any[] = [];
	private _value1 = '';
	private _value2 = '';
	private _value5 = '';
	private _value6 = '';
	private _value7 = '';
	private _value8 = '';
	private _value9 = '';
	private _valid = true;

	onChange(value: string, key?: string) {
		if (!key) {
			return;
		}

		(this as any)[`_value${key}`] = value;
		this.invalidate();
	}

	onRequestResults(key: string) {
		const value = (this as any)[`_value${key}`];
		const results = data.filter((item) => {
			const match = item.value.toLowerCase().match(new RegExp('^' + value.toLowerCase()));
			return Boolean(match && match.length > 0);
		});

		this._results = results.sort((a, b) => (a.value < b.value ? -1 : 1));
		this.invalidate();
	}

	render(): DNode {
		const { onChange, onRequestResults } = this;
		return v(
			'div',
			{
				styles: { maxWidth: '256px' }
			},
			[
				v('h1', ['ComboBox Examples']),
				v('h3', ['Clearable']),
				w(ComboBox, {
					key: '2',
					label: 'Combo:',
					clearable: true,
					onChange,
					getResultLabel: (result: any) => result.value,
					onRequestResults,
					results: this._results,
					value: this._value2,
					inputProperties: {
						placeholder: 'Enter a value'
					}
				}),
				v('h3', ['Open on focus']),
				w(ComboBox, {
					key: '1',
					label: 'Combo:',
					openOnFocus: true,
					onChange,
					getResultLabel: (result: any) => result.value,
					onRequestResults,
					results: this._results,
					value: this._value1,
					inputProperties: {
						placeholder: 'Enter a value'
					}
				}),
				v('h3', ['Disabled menu items']),
				w(ComboBox, {
					key: '5',
					label: 'Combo:',
					onChange,
					getResultLabel: (result: any) => result.value,
					onRequestResults,
					results: this._results,
					value: this._value5,
					isResultDisabled: (result: any) => result.value.length > 9,
					inputProperties: {
						placeholder: 'Enter a value'
					}
				}),
				v('h3', ['Disabled']),
				w(ComboBox, {
					key: '6',
					label: 'Combo:',
					disabled: true,
					inputProperties: {
						placeholder: 'Enter a value'
					},
					onChange,
					onRequestResults,
					value: this._value6
				}),
				v('h3', ['Read Only']),
				w(ComboBox, {
					key: '7',
					label: 'Combo:',
					readOnly: true,
					inputProperties: {
						placeholder: 'Enter a value'
					},
					onChange,
					onRequestResults,
					value: this._value7
				}),
				v('h3', ['Label']),
				w(ComboBox, {
					key: '8',
					onChange,
					getResultLabel: (result: any) => result.value,
					onRequestResults,
					results: this._results,
					value: this._value8,
					label: 'Enter a value'
				}),
				v('h3', ['Required and validated']),
				w(ComboBox, {
					key: '9',
					label: 'Combo:',
					required: true,
					onChange: (value: string) => {
						this._value9 = value;
						this._valid = value.trim().length !== 0;
						this.invalidate();
					},
					getResultLabel: (result: any) => result.value,
					onRequestResults,
					results: this._results,
					value: this._value9,
					valid: { valid: this._valid, message: 'Please enter value of state' },
					helperText: 'helper text',
					onValidate: (valid: boolean | undefined, message: string) => {
						console.log('onValidate called', valid, message);
					},
					inputProperties: {
						placeholder: 'Enter a value'
					}
				})
			]
		);
	}
}
