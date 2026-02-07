import { ISettingRegistry } from '@jupyterlab/settingregistry';

export interface IProviderOption {
  name: string;
  category: string;
  active: boolean;
}

export interface IOllamaOption extends IProviderOption {
  baseUrl: string;
  category: 'ollama';
}

export interface IAuthKeyOption extends IProviderOption {
  category: string;
  authKey: string;
}

export interface IAuthSecretOption extends IProviderOption {
  category: string;
  authKey: string;
  secretKey: string;
}

export interface IMessage {
  role: string;
  content: string;
}

export class Message implements IMessage {
  role: string;
  content: string;

  constructor(role: string, content: string) {
    this.role = role;
    this.content = content;
  }

  static async startUp(settings: ISettingRegistry.ISettings): Promise<Message> {
    const system = settings.get('system').composite!.toString();
    return new Message('system', system);
  }
}

export interface IProvider {
  listModels(): Promise<string[]>;
  chat(
    session: IMessage[],
    message: IMessage,
    model: string
  ): Promise<IMessage>;
}

export function initSetting(category: string) :IProviderOption {
  switch (category) {
    case 'ollama':
      return {
        baseUrl: 'http://localhost:11434',
        category: 'ollama',
        name: '',
        active: false
      } as IProviderOption;
    case 'kimi':
      return {
        authKey: '',
        category: 'kimit',
        name: '',
        active: false
      } as IProviderOption;
    case 'openai':
      return {
        authKey: '',
        category: 'openai',
        name: '',
        active: false
      } as IProviderOption;
    default:
      throw new Error(`category unknown: ${category}`);
  }
}
