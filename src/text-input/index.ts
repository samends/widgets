import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode, PropertyChangeRecord } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v, w } from '@dojo/framework/core/vdom';
import Focus from '@dojo/framework/core/meta/Focus';
import InputValidity from '@dojo/framework/core/meta/InputValidity';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Label from '../label/index';
import { formatAriaProperties } from '../common/util';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/text-input.m.css';
import diffProperty from '@dojo/framework/core/decorators/diffProperty';
import { reference } from '@dojo/framework/core/diff';
import HelperText from '../helper-text/index';

export type TextInputType =
	| 'text'
	| 'email'
	| 'number'
	| 'password'
	| 'search'
	| 'tel'
	| 'url'
	| 'date';

interface TextInputInternalState {
	dirty?: boolean;
}

export interface TextInputProperties extends ThemedProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/**  */
	autocomplete?: boolean | string;
	/** ID of an element that this input controls */
	controls?: string;
	/**  */
	customValidator?: (value: string) => { valid?: boolean; message?: string } | void;
	/**  */
	disabled?: boolean;
	/**  */
	helperText?: string;
	/**  */
	label?: string;
	/**  */
	labelHidden?: boolean;
	/** Renderer for leading icon content */
	leading?: () => DNode;
	/** The min value a number can be */
	min?: number | string;
	/** The max value a number can be */
	max?: number | string;
	/** The step to increment the number value by */
	step?: number | string;
	/** Maximum number of characters allowed in the input */
	maxLength?: number | string;
	/** Minimum number of characters allowed in the input */
	minLength?: number | string;
	/**  */
	name?: string;
	/**  */
	onBlur?(): void;
	/**  */
	onFocus?(): void;
	/**  */
	onKeyDown?(key: number, preventDefault: () => void): void;
	/**  */
	onKeyUp?(key: number, preventDefault: () => void): void;
	/**  */
	onValidate?: (valid: boolean | undefined, message: string) => void;
	/**  */
	onValue?(value?: string): void;
	/**  */
	onClick?(): void;
	/**  */
	onOver?(): void;
	/**  */
	onOut?(): void;
	/**  */
	pattern?: string | RegExp;
	/** Placeholder text */
	placeholder?: string;
	/**  */
	readOnly?: boolean;
	/**  */
	required?: boolean;
	/** Renderer for trailing icon content */
	trailing?: () => DNode;
	/** Input type, e.g. text, email, tel, etc. */
	type?: TextInputType;
	/**  */
	valid?: { valid?: boolean; message?: string } | boolean;
	/** The current value */
	value?: string;
	/**  */
	widgetId?: string;
}

function formatAutocomplete(autocomplete: string | boolean | undefined): string | undefined {
	if (typeof autocomplete === 'boolean') {
		return autocomplete ? 'on' : 'off';
	}
	return autocomplete;
}

function patternDiffer(
	previousProperty: string | undefined,
	newProperty: string | RegExp | undefined
): PropertyChangeRecord {
	const value = newProperty instanceof RegExp ? newProperty.source : newProperty;
	return {
		changed: previousProperty !== value,
		value
	};
}

@theme(css)
@diffProperty('pattern', patternDiffer)
@diffProperty('leading', reference)
@diffProperty('trailing', reference)
export class TextInput extends ThemedMixin(FocusMixin(WidgetBase))<TextInputProperties> {
	private _onInput(event: Event) {
		event.stopPropagation();
		this.properties.onValue &&
			this.properties.onValue((event.target as HTMLInputElement).value);
	}

	private _onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyDown &&
			this.properties.onKeyDown(event.which, () => {
				event.preventDefault();
			});
	}

	private _onKeyUp(event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyUp &&
			this.properties.onKeyUp(event.which, () => {
				event.preventDefault();
			});
	}

	private _callOnValidate(valid: boolean | undefined, message: string) {
		let { valid: previousValid } = this.properties;
		let previousMessage: string | undefined;

		if (typeof previousValid === 'object') {
			previousMessage = previousValid.message;
			previousValid = previousValid.valid;
		}

		if (valid !== previousValid || message !== previousMessage) {
			this.properties.onValidate && this.properties.onValidate(valid, message);
		}
	}

	private _validate() {
		const { customValidator, value = '' } = this.properties;
		const { dirty = false } = this._state;
		if (value === '' && !dirty) {
			this._callOnValidate(undefined, '');
			return;
		}

		this._state.dirty = true;
		let { valid, message = '' } = this.meta(InputValidity).get('input', value);
		if (valid && customValidator) {
			const customValid = customValidator(value);
			if (customValid) {
				valid = customValid.valid;
				message = customValid.message || '';
			}
		}

		this._callOnValidate(valid, message);
	}

	protected get validity() {
		const { valid = { valid: undefined, message: undefined } } = this.properties;

		if (typeof valid === 'boolean') {
			return { valid, message: undefined };
		}

		return {
			valid: valid.valid,
			message: valid.message
		};
	}

	private _uuid = uuid();
	private _state: TextInputInternalState = {};

	protected getRootClasses(): (string | null)[] {
		const { disabled, readOnly, required, leading, trailing } = this.properties;
		const { valid } = this.validity;
		const focus = this.meta(Focus).get('root');
		return [
			css.root,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			valid === false ? css.invalid : null,
			valid === true ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null,
			leading ? css.hasLeading : null,
			trailing ? css.hasTrailing : null
		];
	}

	protected render(): DNode {
		const {
			aria = {},
			autocomplete,
			classes,
			disabled,
			helperText,
			label,
			labelHidden = false,
			leading,
			max,
			maxLength,
			min,
			minLength,
			name,
			onBlur,
			onClick,
			onFocus,
			onOut,
			onOver,
			onValidate,
			pattern,
			placeholder,
			readOnly,
			required,
			step,
			theme,
			trailing,
			type = 'text',
			value,
			widgetId = this._uuid
		} = this.properties;

		onValidate && this._validate();
		const { valid, message } = this.validity;

		const focus = this.meta(Focus).get('root');

		const computedHelperText = (valid === false && message) || helperText;

		return v(
			'div',
			{
				key: 'root',
				classes: this.theme(this.getRootClasses()),
				role: 'presentation'
			},
			[
				label &&
					w(
						Label,
						{
							theme,
							classes,
							disabled,
							valid,
							focused: focus.containsFocus,
							readOnly,
							required,
							hidden: labelHidden,
							forId: widgetId
						},
						[label]
					),
				v(
					'div',
					{
						key: 'inputWrapper',
						classes: this.theme(css.inputWrapper),
						role: 'presentation'
					},
					[
						leading &&
							v('span', { key: 'leading', classes: this.theme(css.leading) }, [
								leading()
							]),
						v('input', {
							...formatAriaProperties(aria),
							'aria-invalid': valid === false ? 'true' : null,
							autocomplete: formatAutocomplete(autocomplete),
							classes: this.theme(css.input),
							disabled,
							id: widgetId,
							focus: this.shouldFocus,
							key: 'input',
							max,
							maxlength: maxLength ? `${maxLength}` : null,
							min,
							minlength: minLength ? `${minLength}` : null,
							name,
							pattern,
							placeholder,
							readOnly,
							'aria-readonly': readOnly ? 'true' : null,
							required,
							step,
							type,
							value,
							onblur: () => {
								onBlur && onBlur();
							},
							onfocus: () => {
								onFocus && onFocus();
							},
							oninput: this._onInput,
							onkeydown: this._onKeyDown,
							onkeyup: this._onKeyUp,
							onclick: () => {
								onClick && onClick();
							},
							onpointerenter: () => {
								onOver && onOver();
							},
							onpointerleave: () => {
								onOut && onOut();
							}
						}),
						trailing &&
							v('span', { key: 'trailing', classes: this.theme(css.trailing) }, [
								trailing()
							])
					]
				),
				w(HelperText, { text: computedHelperText, valid })
			]
		);
	}
}

export default TextInput;
