// SendRequestComponent.tsx

import { ISettingRegistry } from "@jupyterlab/settingregistry";

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
  }
  console.error('message not success');
  return { message: '', role: 'assistant' };
}

export async function listModels(url: string, key: string | undefined) {
  const headers = requestHeaders(key);
  const response = await fetch(url, {
    method: 'GET',
    headers: headers
  });
  return response
    .json()
    .then(data => {
      if (data.models !== undefined) {
        return data.models.map((m: { name: any }) => m.name);
      } else if (data.data !== undefined) {
        return data.data.map((m: { id: any }) => m.id);
      } else {
        console.error(`except data ${JSON.stringify(data, null, 2)}`);
        return [];
      }
    })
    .catch(e => {
      console.error(e);
      return [];
    });
}

function requestHeaders(key: string | undefined) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });
  if (key !== undefined && key.length > 0) {
    headers.set('Authorization', key);
  }
  return headers;
}