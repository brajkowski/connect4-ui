import { Scene } from 'phaser';

export class IFrameEvents {
  static readonly sleep = 'sleep';
  static readonly wake = 'wake';
  static readonly sceneCreated = 'scene-created';
  static readonly handlers = new Map<string, () => void>();
  static emitSceneCreated() {
    window.parent.postMessage(IFrameEvents.sceneCreated, '*');
  }
  static listenForWake(scene: Scene) {
    this.handlers.set(IFrameEvents.wake, () =>
      scene.scene.wake(scene.scene.key)
    );
  }
  static listenForSleep(scene: Scene) {
    this.handlers.set(IFrameEvents.sleep, () =>
      scene.scene.sleep(scene.scene.key)
    );
  }
}
window.addEventListener('message', (event: MessageEvent<any>) => {
  const handler = IFrameEvents.handlers.get(event.data);
  if (handler) handler();
});
