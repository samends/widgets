import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import { isVNode, isWNode } from '@dojo/framework/core/vdom';

interface AriaPropertyObject {
	[key: string]: string | null;
}
/* Alt values to support IE/Edge key values */
export enum Keys {
	Down = 'ArrowDown',
	DownAlt = 'Down',
	End = 'End',
	Enter = 'Enter',
	Escape = 'Escape',
	EscapeAlt = 'Esc',
	Home = 'Home',
	Left = 'ArrowLeft',
	LeftAlt = 'Left',
	PageDown = 'PageDown',
	PageUp = 'PageUp',
	Right = 'ArrowRight',
	RightAlt = 'Right',
	Space = ' ',
	SpaceAlt = 'Spacebar',
	Tab = 'Tab',
	Up = 'ArrowUp',
	UpAlt = 'Up'
}

export function formatAriaProperties(aria: AriaPropertyObject): AriaPropertyObject {
	const formattedAria = Object.keys(aria).reduce((a: AriaPropertyObject, key: string) => {
		a[`aria-${key.toLowerCase()}`] = aria[key];
		return a;
	}, {});
	return formattedAria;
}

export function isRenderResult<T extends {}>(child: RenderResult | T): child is RenderResult {
	let childIsRenderResult =
		child == null ||
		typeof child === 'string' ||
		typeof child === 'boolean' ||
		Array.isArray(child) ||
		isWNode(child);
	try {
		childIsRenderResult = childIsRenderResult || isVNode(child as DNode);
	} catch {}

	return childIsRenderResult;
}
