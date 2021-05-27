import { Scene } from 'phaser';
import { Modal } from './modal';

export class MultiplayerModal extends Modal {
  private static readonly html: string = `
    <style>
      .modal {
        background-color: #404040;
        border-radius: 100px;
        box-shadow: 0px 0px 50px black;
        height: 334px;
        padding: 50px;
        text-align: center;
        width: 1140px;
      }
      .modal-text {
        color: white;
        font-family: Arial;
        font-size: 50px;
      }
      .modal-button {
        background-color: #5B5B5B;
        border: none;
        border-radius: 25px;
        box-shadow: 0px 0px 10px black;
        color: white;
        cursor: pointer;
        font-family: Arial;
        font-size: 50px;
        height: 125px;
        margin: 20px;
        margin-top:25px;
        width: 400px;
      }
      .modal-button:active {
        background-color: #303030;
      }
      input {
        border: none;
        border-radius: 25px;
        font-family: Arial;
        font-size: 50px;
        height: 125px;
        margin-top: 25px;
        padding: 0px 25px;
        width: 800px;
      }
    </style>
    <div class="modal">
      <span class="modal-text">Create or join a multiplayer session:</span>
        <input id="displayName" type="text" placeholder="Your Display Name">
        <button id="join" type="button" class="modal-button">Join</button>
        <button id="create" type="button" class="modal-button">Create</button>
    </div>
  `;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    joinAction?: (displayName: string) => void,
    createAction?: (displayName: string) => void
  ) {
    super(scene, x, y);
    this.assignButtonListeners(joinAction, createAction);
  }

  protected getHTML(): string {
    return MultiplayerModal.html;
  }

  private assignButtonListeners(
    joinAction?: (displayName: string) => any,
    createAction?: (displayName: string) => any
  ): void {
    const joinButton = this.dom.getChildByID('join') as HTMLButtonElement;
    const createButton = this.dom.getChildByID('create') as HTMLButtonElement;
    const displayNameInput = this.dom.getChildByID(
      'displayName'
    ) as HTMLInputElement;
    joinButton.addEventListener('click', () => {
      this.hide();
      joinAction?.(displayNameInput.value);
    });
    createButton.addEventListener('click', () => {
      this.hide();
      createAction?.(displayNameInput.value);
    });
  }
}
