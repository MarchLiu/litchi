import { VDomModel } from '@jupyterlab/apputils';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { LITCHI_ID } from './constants';
import { IProvider } from './commons';

export class Model extends VDomModel {
  private _showRoles: boolean;
  private _processing: boolean;
  private _idle: boolean;
  private _continuous: boolean;
  private _provider: IProvider | undefined;
  private _providers: IProvider[];

  constructor(settingsRegistry: ISettingRegistry) {
    super();
    this._showRoles = false;
    this._processing = false;
    this._idle = true;
    this._providers = [];
    settingsRegistry.load(LITCHI_ID).then(settings => {
      this.continuous = settings!.get('continuous-mode').composite as boolean;
      const ps = settings!.get('providers')
        .composite as unknown as IProvider[];
      this._providers = ps;
      return ps;
    });
    this._continuous = false;
    this._provider = undefined;
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

  get enabled() {
    return !this.processing && this.provider !== undefined;
  }

  get idle() {
    return this._idle;
  }

  get provider(): IProvider | undefined {
    return this._provider;
  }

  set provider(value: IProvider | undefined) {
    this._provider = value;
  }


  get providers(): IProvider[] {
    return this._providers;
  }

  set providers(value: IProvider[]) {
    this._providers = value;
  }

  public removeProvider(index: number) {
    return this._providers.splice(index, 1);
  }

  public addProviders(provider: IProvider) {
    this._providers = [...this.providers, provider];
  }
}
