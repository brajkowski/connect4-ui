import { Scene } from 'phaser';
import { Modal } from './modal';

export class SessionModal extends Modal {
  private static readonly html: string = `
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
        margin: 0;
      }
      .session-code {
        color: white;
        font-size: 80px;
        font-family: Arial;
        font-weight: bold
        margin: 50px;
      }
    </style>
    <div class="modal">
      <p id="wait-session" class="modal-text">Waiting for session to be created...</p>
      <p hidden id="wait-opponent" class="modal-text">Waiting for opponent to join session:</p>
      <p hideen id="session-code" class="session-code"></p>
    </div>
  `;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, false);
  }

  protected getHTML(): string {
    return SessionModal.html;
  }

  sessionCreated(sessionCode: string): void {
    this.dom.getChildByID('wait-session').setAttribute('hidden', '');
    this.dom.getChildByID('wait-opponent').removeAttribute('hidden');
    const sessionCodeElement = this.dom.getChildByID('session-code');
    sessionCodeElement.innerHTML = sessionCode;
    sessionCodeElement.removeAttribute('hidden');
  }
}
