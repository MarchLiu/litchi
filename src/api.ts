// SendRequestComponent.tsx
import { showErrorMessage, Dialog } from '@jupyterlab/apputils';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import {
  ReadonlyPartialJSONArray,
  ReadonlyPartialJSONObject
} from '@lumino/coreutils';
import { IAuthKeyOption, IOllamaOption, IProvider, Message } from './commons';
import { ollama } from './ollama';
import { kimi } from './kimi';
import { deepseek } from './deepseek';

export function provider(settings: ISettingRegistry.ISettings) {
  const providers = settings.get('providers').composite;
  const name = settings.get('selected').composite;
  if (!providers) {
    throw new Error('Not any provider in settings');
  }
  if (!name) {
    throw new Error('Not any provider has been selected');
  }
  for (const provider of providers! as ReadonlyPartialJSONArray) {
    if (provider !== null) {
      const p = provider as unknown as ReadonlyPartialJSONObject;
      if (p.name === name) {
        return createProvider(p);
      }
    }
  }
  throw new Error(`provider not found: ${name}`);
}

function createProvider(settings: ReadonlyPartialJSONObject): IProvider {
  const category = settings.category! as string;
  switch (category) {
    case 'ollama':
      return ollama.createProvider(settings as unknown as IOllamaOption);
    case 'kimi':
      return kimi.createProvider(settings as unknown as IAuthKeyOption);
    case 'deepseek':
      return deepseek.createProvider(settings as unknown as IAuthKeyOption);
    default:
      throw new Error(`provider type unknown: ${category}`);
  }
}

class ChatRequest {
  model: string;
  stream: boolean;
  messages: Message[];

  constructor(model: string, messages: Message[], stream: boolean = false) {
    this.model = model;
    this.stream = stream;
    this.messages = messages;
  }
}

export async function chat(
  url: string,
  key: string | undefined,
  session: Message[],
  message: Message,
  model: string
): Promise<any> {
  try {
    const messages = [...session, message];
    const request = new ChatRequest(model, messages);
    const headers = requestHeaders(key);

    const resp = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    });
    const data = await resp.json();
    if (data.message !== undefined) {
      return data.message;
    } else if (data.choices !== undefined) {
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
  return { message: '', role: 'assistant' };
}

export async function listModels(url: string, key: string | undefined) {
  const headers = requestHeaders(key);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    console.log(headers);
    return response
      .json()
      .then(data => {
        if (data.models !== undefined) {
          return data.models.map((m: { name: any }) => m.name);
        } else if (data.data !== undefined) {
          return data.data.map((m: { id: any }) => m.id);
        } else {
          console.error(`except data ${JSON.stringify(data, null, 2)}`);
          throw new Error(
            `invalid models list from ${url}. Please check the settings or explorer console if you are the developer`
          );
        }
      })
      .catch(e => {
        console.error(e);
        throw new Error(
          `list models from ${url} failed. Please check the settings or explorer console if you are the developer`
        );
      });
  } catch (error) {
    console.error(error);
    throw new Error(
      `list models from ${url} failed. Please check the settings or explorer console if you are the developer`
    );
  }
}

function requestHeaders(key: string | undefined) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });
  if (key !== undefined && key.length > 0) {
    headers.set('Authorization', `Bearer ${key}`);
  }
  return headers;
}

export async function alert(message: string) {
  return showErrorMessage('Litchi', message, [Dialog.okButton()]);
}
