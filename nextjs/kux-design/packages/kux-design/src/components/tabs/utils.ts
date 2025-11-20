let cachedType: string | null = null;
export function detectScrollType() {
	if (cachedType) {
		return cachedType;
	}

	const dummy = document.createElement('div');
	const container = document.createElement('div');
	container.style.width = '10px';
	container.style.height = '1px';
	dummy.appendChild(container);
	dummy.dir = 'rtl';
	dummy.style.fontSize = '14px';
	dummy.style.width = '4px';
	dummy.style.height = '1px';
	dummy.style.position = 'absolute';
	dummy.style.top = '-1000px';
	dummy.style.overflow = 'scroll';

	document.body.appendChild(dummy);

	cachedType = 'reverse';

	if (dummy.scrollLeft > 0) {
		cachedType = 'default';
	} else {
		dummy.scrollLeft = 1;
		if (dummy.scrollLeft === 0) {
			cachedType = 'negative';
		}
	}

	document.body.removeChild(dummy);
	return cachedType;
}

/**
 * 超出宽度时确定滚动距离
 * @param El 
 * @param direction 
 * @returns 
 */
export function getNormalizedScrollLeft(element: HTMLElement, direction: string) {
	const { scrollLeft } = element;
	if (direction !== 'rtl') {
		return scrollLeft;
	}

	const type = detectScrollType();
	switch (type) {
		case 'negative':
			return element.scrollWidth - element.clientWidth - scrollLeft;
		case 'reverse':
			return element.scrollWidth - element.clientWidth + scrollLeft;
		default:
			return scrollLeft;
	}
};

/**
 * 过度效果
 * @param time 
 * @returns 
 */
function easeInOutSin(time: number) {
	return (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;
}

/**
 * 滚动动效
 * @returns 
 */
type IEasingFunction = (t: number) => number;

interface IAnimateOptions {
	ease?: IEasingFunction;
	duration?: number;
}

export function animate(
	property: PropertyKey,
	element: any,
	to: number,
	options: IAnimateOptions = {},
	cb: (error: Error | null) => void = () => { }
): () => void {
	const {
		ease = easeInOutSin,
		duration = 300, // standard
	} = options;

	let start: number | null = null;
	const from = Number(element[property]);
	let cancelled = false;

	const cancel = () => {
		cancelled = true;
	};

	const step = (timestamp: number) => {
		if (cancelled) {
			cb(new Error('Animation cancelled'));
			return;
		}

		if (start === null) {
			start = timestamp;
		}
		const time = Math.min(1, (timestamp - start) / duration);

		element[property] = ease(time) * (to - from) + from;

		if (time >= 1) {
			requestAnimationFrame(() => {
				cb(null);
			});
			return;
		}

		requestAnimationFrame(step);
	};

	if (from === to) {
		cb(new Error('Element already at target position'));
		return cancel;
	}

	requestAnimationFrame(step);
	return cancel;
}