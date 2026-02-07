import { ReadonlyPartialJSONObject } from '@lumino/coreutils';
import { IProvider, IAuthKeyOption } from './commons';
import { IMessage } from './commons';
import axios from 'axios';

export namespace deepseek {
  export function createProvider(options: IAuthKeyOption) {
    return new Provider(options);
  }

  export class Provider implements IProvider {
    private _baseUrl: string;
    private _name: string;
    private _authKey: string;

    private get listModelUrl(): string {
      return this._baseUrl + '/v1/api/models';
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this._authKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: false
        })
      };
    }

    constructor(options: IAuthKeyOption) {
      this._baseUrl = 'http://api.moonshot.cn';
      this._authKey = options.authKey;
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
        if (data.choices !== undefined) {
          const msgs = data.choices.map((c: { message: any }) => c.message);
          if (msgs.length > 0) {
            return msgs[0];
          }
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
      return axios
        .get(this.listModelUrl, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })
        .then(resp => {
          if (resp.status !== axios.HttpStatusCode.Ok) {
            throw new Error(
              `${this._name} error: list model request received error status: ${resp.statusText}`
            );
          }

          const text = resp.data.toString();
          const data = JSON.parse(text);
          return data['data'].map((m: ReadonlyPartialJSONObject) => {
            return m.id;
          });
        });
    }
  }
}
