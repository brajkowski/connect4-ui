import { GameObjects, Scene } from 'phaser';

export abstract class Modal {
  protected dom: GameObjects.DOMElement;
  protected clickOutListener: (event: MouseEvent) => any;
  protected enableClickOut: boolean;

  constructor(scene: Scene, x: number, y: number, enableClickOut = true) {
    this.dom = scene.add.dom(x, y);
    this.dom.createFromHTML(this.getHTML());
    this.dom.visible = false;
    this.enableClickOut = enableClickOut;
  }

  protected abstract getHTML(): string;

  show(): void {
    if (this.dom.visible) return;
    this.dom.visible = true;
    if (!this.enableClickOut) return;
    setTimeout(() => {
      this.clickOutListener = (event: MouseEvent) => {
        if (event.target instanceof HTMLCanvasElement) {
          this.hide();
        }
      };
      this.dom.parent.parentNode.addEventListener(
        'click',
        this.clickOutListener
      );
      this.dom.parent.parentNode.addEventListener(
        'touchend',
        this.clickOutListener
      );
    });
  }

  hide(): void {
    if (!this.dom.visible) return;
    this.dom.visible = false;
    this.dom.parent.parentNode.removeEventListener(
      'click',
      this.clickOutListener
    );
    this.dom.parent.parentNode.removeEventListener(
      'touchend',
      this.clickOutListener
    );
  }

  destroy(): void {
    this.dom.destroy();
  }
}
