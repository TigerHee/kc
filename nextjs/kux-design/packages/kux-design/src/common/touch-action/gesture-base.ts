interface IGestureOptions {
  rootDom: HTMLElement;
}

class GestureBase extends app.EventHub {
  protected startX = 0;
  protected startY = 0;
  protected startTime = 0; // 手势开始时间
  protected lastX = 0;
  protected lastY = 0;
  protected isDragging = false;
  protected rootDom: HTMLElement;

  constructor(options: IGestureOptions) {
    super();
    this.rootDom = options.rootDom;
    this.bind();
  }

  private handleStart = (e: any) => {
    const event = e instanceof TouchEvent ? e.touches[0] : e;
    const { clientX, clientY } = event;
    this.startX = clientX;
    this.startY = clientY;
    this.lastX = clientX;
    this.lastY = clientY;
    this.startTime = Date.now();
    this.isDragging = true;
    this.emit('start');
  };

  private handleMove = (e: any) => {
    if (!this.isDragging) return;
    const event = e.touches ? e.touches[0] : e;
    const { clientX, clientY } = event;
    this.lastX = clientX;
    this.lastY = clientY;
    this.emit('move', { x: this.lastX - this.startX, y: this.lastY - this.startY });
  };

  private handleEnd = () => {
    this.isDragging = false;
    this.emit('end');
  };

  bind() {
    const target = this.rootDom;
    if (!target) return;

    if (window.PointerEvent && !window.TouchEvent) {
      target.addEventListener('pointerdown', this.handleStart, { passive: true });
      target.addEventListener('pointermove', this.handleMove, { passive: true });
      target.addEventListener('pointerup', this.handleEnd, { passive: true });
      target.addEventListener('pointercancel', this.handleEnd, { passive: true });
    } else {
      target.addEventListener('touchstart', this.handleStart, { passive: true });
      target.addEventListener('touchmove', this.handleMove, { passive: true });
      target.addEventListener('touchend', this.handleEnd, { passive: true });
      target.addEventListener('touchcancel', this.handleEnd, { passive: true });
    }
  }

  unbind() {
    const target = this.rootDom;
    if (!target) return;

    if (window.PointerEvent && !window.TouchEvent) {
      target.removeEventListener('pointerdown', this.handleStart);
      target.removeEventListener('pointermove', this.handleMove);
      target.removeEventListener('pointerup', this.handleEnd);
      target.removeEventListener('pointercancel', this.handleEnd);
    } else {
      target.removeEventListener('touchstart', this.handleStart);
      target.removeEventListener('touchmove', this.handleMove);
      target.removeEventListener('touchend', this.handleEnd);
      target.removeEventListener('touchcancel', this.handleEnd);
    }
  }
}

export default GestureBase;