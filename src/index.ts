// import { WidgetExtension } from './toolbar';
// activate.tsx
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';
import { IStateDB } from '@jupyterlab/statedb';
import { chat, IMessage, Message } from './api';
import { MarkdownCellModel } from '@jupyterlab/cells';
import { INotebookTracker, Notebook } from '@jupyterlab/notebook';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { WidgetExtension } from './toolbar';
import { ICellModel } from '@jupyterlab/cells';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { Signal } from '@lumino/signaling';
import { Widget } from '@lumino/widgets';

const LITCHI_ID = 'jupyter-litchi:jupyter-litchi';

namespace CommandIDs {
  export const CHAT = 'litchi:chat';
  export const CONTEXTUAL = 'litchi:contextual';
  export const HISTORICAL = 'litchi:historical';
  export const TOGGLE_ROLE = 'litchi:show-roles-toggle';
  export const SELECTED = 'litchi:selected';
}

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: LITCHI_ID,
  description: 'Add a widget to the notebook header.',
  autoStart: true,
  activate: activate,
  requires: [ICommandPalette, IStateDB, INotebookTracker, ISettingRegistry]
};

export async function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  state: IStateDB,
  tracker: INotebookTracker,
  registry: ISettingRegistry
) {
  const widget = new WidgetExtension(LITCHI_ID, app, registry, state);
  app.docRegistry.addWidgetExtension('Notebook', widget);
  app.docRegistry.changed.connect(docRegistryChangeHandler(tracker, state));

  app.commands.addCommand(CommandIDs.CHAT, {
    label: 'Litchi Chat',
    execute: async () => {
      await chatActivate(
        app,
        registry,
        tracker,
        state,
        widget.isWaiting,
        'chat'
      );
    }
  });
  palette.addItem({ command: CommandIDs.CHAT, category: 'jupyter-Litchi' });

  app.commands.addCommand(CommandIDs.CONTEXTUAL, {
    label: 'Litchi Chat Contextual',
    execute: async () => {
      await chatActivate(
        app,
        registry,
        tracker,
        state,
        widget.isWaiting,
        'contextual'
      );
    }
  });
  palette.addItem({
    command: CommandIDs.CONTEXTUAL,
    category: 'jupyter-Litchi'
  });

  app.commands.addCommand(CommandIDs.HISTORICAL, {
    label: 'Litchi Chat Historical',
    execute: async () => {
      await chatActivate(
        app,
        registry,
        tracker,
        state,
        widget.isWaiting,
        'historical'
      );
    }
  });
  palette.addItem({
    command: CommandIDs.HISTORICAL,
    category: 'jupyter-Litchi'
  });

  app.commands.addCommand(CommandIDs.SELECTED, {
    label: 'Litchi Chat Selected',
    execute: async () => {
      await chatActivate(
        app,
        registry,
        tracker,
        state,
        widget.isWaiting,
        'selected'
      );
    }
  });
  palette.addItem({
    command: CommandIDs.SELECTED,
    category: 'jupyter-Litchi'
  });

  app.commands.addCommand(CommandIDs.TOGGLE_ROLE, {
    label: 'Litchi Show Roles Toggle',
    execute: async () => {
      const flag = await state.fetch('litchi:show-roles');
      let showRoles = false;
      if (flag !== undefined) {
        showRoles = flag as boolean;
      }
      showRoles = !showRoles;
      await state.save('litchi:show-roles', showRoles);
      await refreshPage(tracker, state);
    }
  });
  palette.addItem({
    command: CommandIDs.TOGGLE_ROLE,
    category: 'jupyter-Litchi'
  });

  state.save('litchi:show-roles', false);
}

const LITCHI_MESSAGE_ROLE = 'litchi:message:role';

async function chatActivate(
  app: JupyterFrontEnd,
  registry: ISettingRegistry,
  tracker: INotebookTracker,
  state: IStateDB,
  waiting: Signal<Widget, boolean>,
  subTask: 'chat' | 'contextual' | 'historical' | 'selected'
) {
  try {
    let processing: boolean = false;
    waiting.connect((sender, value) => {
      processing = value;
    });

    if (processing) {
      console.log('an other process is running');
      return;
    }

    waiting.emit(true);
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

    cell.model.sharedModel.setMetadata(LITCHI_MESSAGE_ROLE, 'user');
    const content = cell.model.sharedModel.source;
    // eslint-disable-next-line eqeqeq
    if (content === null) {
      console.error('litchi:chat exit because the content of cell is null');
      return;
    }
    const latest = cellToMessage(cell.model);

    const model = (await state.fetch('litchi:model'))?.toString();
    if (model === null || model === undefined) {
      console.error('litchi:chat exit because not any model selected');
      return;
    }

    const settings = await registry.load(LITCHI_ID);
    const session: IMessage[] = [
      await Message.startUp(settings),
      ...createContext(subTask, notebook)
    ];

    const url = settings.get('chat')!.composite!.toString();
    const key = settings.get('key')?.composite?.toString();

    const message = await chat(url, key, session, latest, model!);
    if (message.content && message.content.length > 0) {
      const cellModel = new MarkdownCellModel();
      cellModel.sharedModel.setSource(message.content);
      cellModel.sharedModel.setMetadata(LITCHI_MESSAGE_ROLE, message.role);
    }

    const { commands } = app;
    commands.execute('notebook:insert-cell-below').then(() => {
      commands.execute('notebook:change-cell-to-markdown');
    });

    const newCell = notebook.activeCell!;
    const newModel = newCell.model.sharedModel;
    newModel.setSource(message.content);
    newModel.setMetadata(LITCHI_MESSAGE_ROLE, message.role);
  } finally {
    waiting.emit(false);
  }
}

function createContext(command: string, notebook: Notebook): IMessage[] {
  switch (command) {
    case 'chat':
      return [];
    case 'contextual': {
      const stop = notebook.activeCellIndex;
      if (stop === undefined) {
        return [];
      }
      let messages: IMessage[] = [];
      for (let idx = 0; idx < stop; idx++) {
        const cell = notebook.model!.cells.get(idx);
        const model = cell.sharedModel;
        if (
          LITCHI_MESSAGE_ROLE in model.metadata &&
          model.metadata[LITCHI_MESSAGE_ROLE] !== undefined
        ) {
          messages = [...messages, cellToMessage(cell)];
        }
      }
      return messages;
    }
    case 'historical': {
      const stop = notebook.activeCellIndex;
      let messages: IMessage[] = [];
      for (let idx = 0; idx < stop; idx++) {
        const cell = notebook.model!.cells.get(idx);
        const model = cell.sharedModel;
        messages = [...messages, cellToMessage(cell)];
        if (
          !(LITCHI_MESSAGE_ROLE in model.metadata) ||
          model.metadata[LITCHI_MESSAGE_ROLE] === undefined
        ) {
          cell.metadata[LITCHI_MESSAGE_ROLE] = 'user';
        }
      }
      return messages;
    }
    case 'selected': {
      const cells = notebook.selectedCells;
      let messages: IMessage[] = [];
      for (let idx = 0; idx < cells.length; idx++) {
        const cell = cells[idx].model;
        const model = cell.sharedModel;
        if (
          !(LITCHI_MESSAGE_ROLE in model.metadata) ||
          cell.metadata[LITCHI_MESSAGE_ROLE] === undefined
        ) {
          cell.metadata[LITCHI_MESSAGE_ROLE] = 'user';
        }
        messages = [...messages, cellToMessage(cell)];
      }
      return messages;
    }
  }
  return [];
}

function cellToMessage(cell: ICellModel): IMessage {
  const model = cell.sharedModel;
  let role = 'user';
  if (LITCHI_MESSAGE_ROLE in cell.metadata) {
    role = cell.getMetadata(LITCHI_MESSAGE_ROLE)!.toString();
  }
  let content = model.source;
  if (model.cell_type === 'code') {
    let language = '';
    const tokens = cell.mimeType.split('-');
    if (tokens.length > 1) {
      language = tokens[tokens.length - 1];
    }
    content = `\`\`\`${language}\n${content}\n\`\`\``;
  }
  return new Message(role, content);
}

function docRegistryChangeHandler(tracker: INotebookTracker, state: IStateDB) {
  return async (
    sender: DocumentRegistry,
    args: DocumentRegistry.IChangedArgs
  ) => {
    await refreshPage(tracker, state);
  };
}

async function refreshPage(tracker: INotebookTracker, state: IStateDB) {
  const flag = await state.fetch('litchi:show-roles');
  let showRoles = false;
  if (flag !== undefined) {
    showRoles = flag as boolean;
  }
  const notebook = tracker.currentWidget;
  if (notebook === null) {
    console.log('no notebook was selected');
    return;
  }
  const cells = notebook!.model!.cells!;
  if (showRoles) {
    for (let idx = 0; idx < cells.length; idx++) {
      const cell = cells.get(idx);
      if (LITCHI_MESSAGE_ROLE in cell.sharedModel.metadata) {
        const role = cell.sharedModel
          .getMetadata(LITCHI_MESSAGE_ROLE)!
          .toString();
        notebook?.content.widgets[idx].inputArea?.addClass(
          `jp-litchi-role-${role}-Cell`
        );
      }
    }
  } else {
    for (let idx = 0; idx < cells.length; idx++) {
      const cell = cells.get(idx);
      if (LITCHI_MESSAGE_ROLE in cell.sharedModel.metadata) {
        const role = cell.sharedModel
          .getMetadata(LITCHI_MESSAGE_ROLE)!
          .toString();
        notebook?.content.widgets[idx].inputArea?.removeClass(
          `jp-litchi-role-${role}-Cell`
        );
      }
    }
  }
}

/**
 * Export the plugin as default.
 */
export default plugin;
