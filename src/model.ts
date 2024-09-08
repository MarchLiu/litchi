import { VDomModel } from "@jupyterlab/apputils";

export class Model extends VDomModel {
  private _showRoles: boolean;
  private _processing: boolean;

  constructor() {
    super();
    this._showRoles = false;
    this._processing = false;
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

  get processing(): boolean {
    return this._processing;
  }

  set processing(value: boolean) {
    this._processing = value;
    this.stateChanged.emit();
  }
}