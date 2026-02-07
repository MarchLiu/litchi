import { ReadonlyPartialJSONObject } from '@lumino/coreutils';
import { IOllamaOption, IProvider } from './commons';
import { IMessage } from './commons';
import axios from 'axios';

export namespace ollama {
  export function createProvider(options: IOllamaOption) {
    return new Provider(options);
  }

  export class Provider implements IProvider {
    private _baseUrl: string;
    private _name: string;

    private get listModelUrl(): string {
      return this._baseUrl + '/api/tags';
    }

    private get chatUrl() {
      return this._baseUrl + '/api/chat';
    }

    private chatRequest(
      model: string,
      messages: IMessage[]
    ): any {
      return {
        url: this.chatUrl,
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: false
        })
      };
    }

    constructor(options: IOllamaOption) {
      this._baseUrl = options.baseUrl;
      this._name = options.name;
    }

    public async chat(
      session: IMessage[],
      message: IMessage,
      model: string
    ): Promise<IMessage> {
      const messages = [...session, message];
      const resp = await axios.get(this.chatRequest(model, messages));
      try {
        const data = resp.data;
        console.log(data);
        if (data.message !== undefined) {
          return data.message;
        }
      } catch (error) {
        console.error('Error sending request to server:', error);
        throw new Error(
          'chat failed, maybe server gone or get a invalid response. Please check settings or explorer console if you are a developer'
        );
      }
      console.error('message not success');
      return { content: '', role: 'assistant' };
    }

    async listModels(): Promise<string[]> {
      return axios.get(this.listModelUrl).then(resp => {
        if (resp.status !== axios.HttpStatusCode.Ok) {
          throw new Error(
            `${this._name} error: list model request received error status: ${resp.statusText}`
          );
        }

        const data = resp.data;
        return data['models'].map((m: ReadonlyPartialJSONObject) => {
          return m.name;
        });
      });
    }
  }
}
