import { VDomModel } from '@jupyterlab/apputils';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { LITCHI_ID } from './constants';

export class Model extends VDomModel {
  private _showRoles: boolean;
  private _processing: boolean;
  private _idle: boolean;
  private _continuous: boolean;

  constructor(settingsRegistry: ISettingRegistry) {
    super();
    this._showRoles = false;
    this._processing = false;
    this._idle = true;
    settingsRegistry.load(LITCHI_ID).then(settings => {
      this.continuous = settings!.get('talking-mode').composite as boolean;
    });
    this._continuous = false;
  }

  get showRoles(): boolean {
    return this._showRoles;
  }
  set showRoles(v: boolean) {
    if (v !== this._showRoles) {
      this._showRoles = v;
      this.stateChanged.emit();
    }
  }

  get continuous(): boolean {
    return this._continuous;
  }

  set continuous(value: boolean) {
    this._continuous = value;
  }

  get processing(): boolean {
    return this._processing;
  }

  set processing(value: boolean) {
    this._processing = value;
    this.stateChanged.emit();
  }

  get idle() {
    return this._idle;
  }
}
