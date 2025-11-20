import GestureBase from './gesture-base';

export type TDragDirection = 'left' | 'right' | 'up' | 'down';
export interface IDragPosition {
  x: number;
  y: number;
  /** 滑动方向 */
  direction: TDragDirection;
}
export type TEndCallback = (
  delta: IDragPosition,
  velocity: number,
) => void;
export type TMoveCallback = (position: IDragPosition) => void;
export type TStartCallback = () => void;

interface ISlideOptions {
  rootDom: HTMLElement;
  onStart?: TStartCallback;
  onMove?: TMoveCallback;
  onEnd?: TEndCallback;
  /** 滑动触发距离，默认为容器的50% */
  threshold?: number;
  /** 滑动方向 */
  arrowDirection?: TDragDirection[];
}

// 设置滑动距离的参考值，默认为 100
const DEFAULT_END_DISTANCE = 100;

export class Slide extends GestureBase {
  private threshold: number;
  private arrowDirection?: TDragDirection[];
  private onStart?: TStartCallback | undefined;
  private onMove?: TMoveCallback | undefined;
  private onEnd?: TEndCallback | undefined;

  constructor(options: ISlideOptions) {
    super({ rootDom: options.rootDom });
    this.threshold = options.threshold || DEFAULT_END_DISTANCE;
    this.arrowDirection = options.arrowDirection || ['down', 'left', 'right', 'up'];
    this.onStart = options.onStart;
    this.onMove = options.onMove;
    this.onEnd = options.onEnd;

    this.on('start', this.handleStartEvent);
  }

  private getCurrentDirection(): TDragDirection {
    const deltaX = this.lastX - this.startX;
    const deltaY = this.lastY - this.startY;

    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
    if (isHorizontal) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  private bindEvents() {
    this.on('move', this.handleMoveEvent);
    this.on('end', this.handleEndEvent);
  }

  private handleStartEvent = () => {
    this.bindEvents();
    if (this.onStart) {
      this.onStart();
    }
  };

  private handleMoveEvent = ({ x, y }: { x: number; y: number }) => {
    const direction = this.getCurrentDirection();
    if (this.onMove && this.arrowDirection?.includes(direction)) {
      this.onMove({ x, y, direction });
    }
  };

  private handleEndEvent = () => {
    const deltaX = this.lastX - this.startX;
    const deltaY = this.lastY - this.startY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const duration = Date.now() - this.startTime;
    const direction = this.getCurrentDirection();

    const shouldTrigger = (direction: TDragDirection, deltaX: number, deltaY: number) => {
      const axialDistance = ['left', 'right'].includes(direction)
        ? Math.abs(deltaX)
        : Math.abs(deltaY);
      return axialDistance > this.threshold;
    };

    if (shouldTrigger(direction, deltaX, deltaY) && this.onEnd) {
      const velocity = distance / duration;
      this.onEnd({ x: deltaX, y: deltaY, direction }, velocity);
    } else {
      this.startX = this.lastX;
      this.startY = this.lastY;
      this.lastX = 0;
      this.lastY = 0;
      this.startTime = Date.now();
      this.emit('move', { x: 0, y: 0, direction });
    }
  };
}