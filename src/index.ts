import { WidgetExtension } from './toolbar';
// activate.tsx
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { IStateDB } from '@jupyterlab/statedb';
import { chat, IMessage, Message } from './ollama';
import { MarkdownCellModel } from '@jupyterlab/cells';
import { INotebookTracker } from '@jupyterlab/notebook';
import { SettingWidget } from './settings';
import { ISettingRegistry} from '@jupyterlab/settingregistry';

const LITCHI_ID = 'jupyter-litchi:jupyter-litchi';
const ACTIVATE_COMMAND_ID = 'litchi:chat';
const SETTINGS_COMMAND_ID = 'litchi:settings';

namespace CommandIDs {
  export const CHAT = ACTIVATE_COMMAND_ID;
  export const SETTINGS = SETTINGS_COMMAND_ID;
}
const LITCHI_SESSION = 'litchi:session';
const LITCHI_LATEST = 'litchi:latest';

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: LITCHI_ID,
  description: 'Add a widget to the notebook header.',
  autoStart: true,
  activate: activate,
  requires: [ICommandPalette, IStateDB, INotebookTracker, ISettingRegistry],
};

export async function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  state: IStateDB,
  tracker: INotebookTracker,
  registry: ISettingRegistry
) {
  const widget = new WidgetExtension(app, state);
  widget.addClass('jp-litchi-toolbar');
  app.docRegistry.addWidgetExtension('Notebook', widget);

  app.commands.addCommand(CommandIDs.CHAT, {
    label: 'Litchi Chat',
    execute: async () => {
      await chatActivate(app, registry, tracker, state);
    }
  });
  // Add the command to the palette.
  palette.addItem({ command: CommandIDs.CHAT, category: 'jupyter-Litchi' });

  const settingsCreator = () => {
    const content = new SettingWidget(LITCHI_ID, app, registry);
    const widget = new MainAreaWidget<SettingWidget>({ content });
    widget.id = 'litchi-settings';
    widget.title.label = 'Litchi Settings';
    widget.title.closable = true;
    return widget;
  };

  let settingsWidget = settingsCreator();
  app.commands.addCommand(CommandIDs.SETTINGS, {
    label: 'Litchi Settings',
    execute: () => {
      // Regenerate the widget if disposed
      if (settingsWidget.isDisposed) {
        settingsWidget = settingsCreator();
      }
      if (!settingsWidget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(settingsWidget, 'settings editor');
      }
      // Activate the widget
      app.shell.activateById(settingsWidget.id);
    }
  });

  // Add the command to the palette.
  // palette.addItem({ command: CommandIDs.SETTINGS, category: 'jupyter-Litchi' });
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

async function chatActivate(
  app: JupyterFrontEnd,
  registry: ISettingRegistry,
  tracker: INotebookTracker,
  state: IStateDB
) {
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

  const settings = await registry.load(LITCHI_ID);
  const host = settings.get('ollama:host')!.composite!.toString();
  const port = Number.parseInt(
    settings.get('ollama:port')!.composite!.toString()
  );

  const latest = new Message('user', content);
  await state.save(LITCHI_LATEST, JSON.stringify(latest));

  const message = await chat(host, port, session, latest, model!);
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

/**
 * Export the plugin as default.
 */
export default plugin;
