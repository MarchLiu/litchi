import { JupyterFrontEnd } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { INotebookTracker } from '@jupyterlab/notebook';
import { Model } from './model';
import { IStateDB } from '@jupyterlab/statedb';
import { alert, chat } from './api';
import { IMessage, Message } from './commons'
import { LITCHI_ID, LITCHI_MESSAGE_ROLE } from './constants';
import { MarkdownCellModel } from '@jupyterlab/cells';

function quote(text: string): string {
  return text.replace(/^('```')/g, '\\`\\`\\`');
}

export function chat_by_cell(
  jobName: string,
  template: string,
  types: string[]
) {
  return async (
    app: JupyterFrontEnd,
    tracker: INotebookTracker,
    registry: ISettingRegistry,
    model: Model,
    state: IStateDB,
    dest: string
  ) => {
    const notebook = tracker.currentWidget?.content;
    const source = notebook?.activeCell;
    if (source === null) {
      const message = 'Translate command need a markdown cell is selected';
      console.error(message);
      throw new Error(message);
    }
    if (!types.includes(source!.model.type)) {
      const message = `${jobName} command only support ${types} cell`;
      console.error(message);
      throw new Error(message);
    }

    const text = source!.model.sharedModel.source;
    const quoted = quote(text);
    const prompt = template.replace('${text}', quoted);

    const aiModel = (await state.fetch('litchi:model'))?.toString();
    if (aiModel === null || aiModel === undefined) {
      const message = 'litchi:chat exit because not any model selected';
      alert(message);
      return;
    }

    const settings = await registry.load(LITCHI_ID);
    const session: IMessage[] = [await Message.startUp(settings)];
    const request = new Message('user', prompt);

    const url = settings.get('chat')!.composite!.toString();
    const key = settings.get('key')?.composite?.toString();

    model.processing = true;
    const response = await chat(url, key, session, request, aiModel!).catch(
      alert
    );
    if (response.content !== undefined && response.content.length > 0) {
      const cellModel = new MarkdownCellModel();
      cellModel.sharedModel.setSource(response.content);
      cellModel.sharedModel.setMetadata(LITCHI_MESSAGE_ROLE, response.role);
    } else {
      console.error(`get a invalid message ${response}`);
      alert(
        'Message is invalid. Please check the settings and the model selected. Or check the explorer console if you are a developer.'
      );
      return;
    }

    const { commands } = app;
    commands.execute('notebook:insert-cell-below').then(() => {
      commands.execute('notebook:change-cell-to-markdown');
    });

    const newCell = notebook!.activeCell!;
    const newModel = newCell.model.sharedModel;
    newModel.setSource(response.content);
    newModel.setMetadata(LITCHI_MESSAGE_ROLE, response.role);
  };
}

export function translate(lang: string) {
  return chat_by_cell(
    `Translate To ${lang}`,
    `# Translate To ${lang}\n` +
      `Translate text below to ${lang}\n` +
      '```\n' +
      '${text}\n' +
      '```\n',
    ['markdown', 'raw']
  );
}

export function unitTest(lang: string) {
  return chat_by_cell(
    'Unit Test',
    '# Create Unit Test\n' +
      `Create ${lang} Unit Test for the code below to \n` +
      '```\n' +
      '${text}\n' +
      '```\n',
    ['code']
  );
}
