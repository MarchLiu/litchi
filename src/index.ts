import { WidgetExtension } from './toolbar';
// activate.tsx
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';
import { IStateDB } from '@jupyterlab/statedb';
import { chat, IMessage, Message } from './ollama';
import { MarkdownCellModel } from '@jupyterlab/cells'
import { INotebookTracker } from "@jupyterlab/notebook";

const ACTIVATE_COMMAND_ID = 'litchi:chat';

namespace CommandIDs {
  export const CHAT = ACTIVATE_COMMAND_ID;
}
const LITCHI_SESSION = 'litchi:session';
const LITCHI_LATEST = 'litchi:latest';

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'litchi',
  description: 'Add a widget to the notebook header.',
  autoStart: true,
  activate: activate,
  requires: [ICommandPalette, IStateDB, INotebookTracker]
};

export function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  state: IStateDB,
  tracker: INotebookTracker,
) {
  const widget = new WidgetExtension(app, state);
  widget.addClass('jp-litchi-toolbar');

  app.docRegistry.addWidgetExtension('Notebook', widget);
  // const tracker = new NotebookTracker({ namespace: 'litchi' });
  console.log('add command litchi:chat');

  app.commands.addCommand(CommandIDs.CHAT, {
    label: 'Litchi Chat',
    execute: async () => {
      const session: IMessage[] = await fetchState(state, LITCHI_SESSION, [
        Message.startUp()
      ]);
      const cell = tracker.activeCell;
      if (cell === null) {
        console.error('litchi:chat exit because any cell not been selected');
        return;
      }

      const notebook = tracker.currentWidget?.content;
      if (notebook === undefined) {
        console.error('litchi:chat exit because the notebook not found');
        return;
      }

      const content = cell.model.sharedModel.source;
      // eslint-disable-next-line eqeqeq
      if (content === null) {
        console.error('litchi:chat exit because the content of cell is null');
        return;
      }
      const model = (await state.fetch('litchi:model'))?.toString();
      if (model === null || model === undefined) {
        console.error('litchi:chat exit because not any model selected');
        return;
      }

      const latest = new Message('user', content);
      await state.save(LITCHI_LATEST, JSON.stringify(latest));

      const message = await chat(session, latest, model!);
      console.log(`received message ${JSON.stringify(message)}`);
      await state.save(LITCHI_SESSION, JSON.stringify([...session, message]));
      const cellModel = new MarkdownCellModel();
      cellModel.sharedModel.setSource(message.content);

      const { commands } = app;
      commands.execute('notebook:insert-cell-below').then(() => {
        commands.execute('notebook:change-cell-to-markdown');
      });

      const newCell = notebook.activeCell!;
      newCell.model.sharedModel.setSource(message.content);
    }
  });
  // Add the command to the palette.
  palette.addItem({ command: CommandIDs.CHAT, category: 'Litchi' });
}

async function fetchState<T>(
  state: IStateDB,
  key: string,
  defaultValue: T
): Promise<T> {
  const data: string | undefined = (await state.fetch(key))?.toString();
  if (data === undefined) {
    const defaultStr = JSON.stringify(defaultValue);
    await state.save(key, defaultStr);
    return defaultValue;
  } else {
    return JSON.parse(data) as T;
  }
}

/**
 * Export the plugin as default.
 */
export default plugin;
