// SendRequestComponent.tsx


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

  static startUp(): Message {
    return new Message('system', 'your are a python and jupyter export');
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

interface IChatResponse {
  model: string;
  created_at: string;
  message: Message;
  done_reason: string;
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export async function chat(
  host: string,
  port: number,
  session: Message[],
  message: Message,
  model: string
): Promise<Message> {
  try {
    const messages = [...session, message];
    const request = new ChatRequest(model, messages);

    const resp = await fetch(`http://${host}:${port}/api/chat`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    const data = (await resp.json()) as IChatResponse;
    return data.message;
  } catch (error) {
    console.error('Error sending request to server:', error);
    throw error;
  }
}
