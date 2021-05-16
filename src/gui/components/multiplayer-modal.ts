import { GameObjects, Scene } from 'phaser';

export class MultiplayerModal {
  private readonly html: string = `
    <style>
      .modal {
        text-align: center;
        background-color: #404040;
        width: 1140px;
        height: 334px;
        box-shadow: 0px 0px 50px black;
        border-radius: 100px;
        padding: 50px;
      }
      .modal-text {
        color: white;
        font-size: 50px;
        font-family: Arial;
      }
      .modal-button {
        width: 400px;
        height: 125px;
        border-radius: 25px;
        background-color: #5B5B5B;
        color: white;
        border: none;
        font-size: 50px;
        font-family: Arial;
        box-shadow: 0px 0px 10px black;
        cursor: pointer;
        margin: 20px;
        margin-top:100px;
      }
      .modal-button:active {
        background-color: #303030;
      }
    </style>
    <div style="height: 100%; width: 100%"></div>
    <div class="modal">
      <span class="modal-text">Create or join a multiplayer session:</span>
        <button id="join" type="button" class="modal-button">Join</button>
        <button id="create" type="button" class="modal-button">Create</button>
    </div>
  `;
  private dom: GameObjects.DOMElement;
  private clickOutListener: (event: MouseEvent) => any;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    joinAction?: () => void,
    createAction?: () => void
  ) {
    this.dom = scene.add.dom(x, y);
    this.dom.createFromHTML(this.html);
    this.dom.visible = false;
    this.assignButtonListeners(joinAction, createAction);
  }

  show(): void {
    this.dom.visible = true;
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
    });
  }

  hide(): void {
    this.dom.visible = false;
    this.dom.parent.parentNode.removeEventListener(
      'click',
      this.clickOutListener
    );
  }

  private assignButtonListeners(
    joinAction?: () => any,
    createAction?: () => any
  ): void {
    const joinButton = this.dom.getChildByID('join') as HTMLButtonElement;
    const createButton = this.dom.getChildByID('create') as HTMLButtonElement;
    joinButton.addEventListener('click', () => {
      this.hide();
      joinAction?.();
    });
    createButton.addEventListener('click', () => {
      this.hide();
      createAction?.();
    });
  }
}
