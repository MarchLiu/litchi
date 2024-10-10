import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, IToolbarWidgetRegistry } from '@jupyterlab/apputils';
import { IStateDB } from '@jupyterlab/statedb';
import { alert, chat, IMessage, Message } from './api';
import { MarkdownCellModel } from '@jupyterlab/cells';
import { INotebookTracker, Notebook } from '@jupyterlab/notebook';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { WidgetExtension } from './toolbar';
import { ICellModel } from '@jupyterlab/cells';
import { Model } from './model';
import { ITranslator } from '@jupyterlab/translation';

import { LITCHI_ID, CommandIDs, LITCHI_MESSAGE_ROLE } from './constants';
import { IFormRendererRegistry } from '@jupyterlab/ui-components';
import { renderer } from './settings';
import { chIcon, csIcon, caIcon, ctIcon, langIcon, unitTestIcon, litchiIcon, scIcon } from './icons';
import { translate, unitTest } from './templates';
import { ReadonlyPartialJSONArray } from '@lumino/coreutils';
import { to_segments } from './markdown';

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: LITCHI_ID,
  description: 'Add a widget to the notebook header.',
  autoStart: true,
  activate: activate,
  optional: [IFormRendererRegistry],
  requires: [
    ICommandPalette,
    INotebookTracker,
    ISettingRegistry,
    IToolbarWidgetRegistry,
    ITranslator,
    IStateDB
  ]
};

export async function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  tracker: INotebookTracker,
  settingRegistry: ISettingRegistry,
  toolbarRegistry: IToolbarWidgetRegistry,
  translator: ITranslator,
  state: IStateDB,
  formRendererRegistry: IFormRendererRegistry | null
) {
  const model = new Model(settingRegistry);

  const widget = new WidgetExtension(
    LITCHI_ID,
    app,
    settingRegistry,
    state,
    model
  );

  app.docRegistry.addWidgetExtension('Notebook', widget);

  app.commands.addCommand(CommandIDs.CHAT, {
    label: 'Litchi Chat',
    execute: async () => {
      await chatActivate(app, settingRegistry, tracker, model, state, 'chat');
    },
    icon: caIcon,
    isEnabled: () => model.idle
  });
  palette.addItem({ command: CommandIDs.CHAT, category: 'jupyter-Litchi' });

  app.commands.addCommand(CommandIDs.CONTEXTUAL, {
    label: 'Litchi Chat Contextual',
    execute: async () => {
      await chatActivate(
        app,
        settingRegistry,
        tracker,
        model,
        state,
        'contextual'
      );
    },
    icon: ctIcon,
    isEnabled: () => model.idle
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
        settingRegistry,
        tracker,
        model,
        state,
        'historical'
      );
    },
    icon: chIcon,
    isEnabled: () => model.idle
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
        settingRegistry,
        tracker,
        model,
        state,
        'selected'
      );
    },
    icon: csIcon,
    isEnabled: () => model.idle
  });
  palette.addItem({
    command: CommandIDs.SELECTED,
    category: 'jupyter-Litchi'
  });

  app.commands.addCommand(CommandIDs.CONTINUOUS, {
    label: 'Litchi Chat Continuous',
    execute: async () => {
      await chatActivate(
        app,
        settingRegistry,
        tracker,
        model,
        state,
        'historical'
      ).then(() => {
        // markup if not in continuous mode
        if (!model.continuous) {
          app.commands.execute('notebook:insert-cell-below').then(() => {
            app.commands.execute('notebook:change-cell-to-markdown');
          });
        }
      });
    },
    icon: litchiIcon,
    isEnabled: () => model.idle,
    isVisible: () => {
      const cell = tracker.activeCell;
      if (cell === null) {
        return false;
      }
      return cell.model.sharedModel.cell_type === 'markdown';
    }
  });
  palette.addItem({
    command: CommandIDs.CONTINUOUS,
    category: 'jupyter-Litchi'
  });

  app.commands.addCommand(CommandIDs.SPLIT_CELL, {
    label: 'Litchi Split Cell',
    execute: async () => {
      await splitCell(app, settingRegistry, tracker);
    },
    icon: scIcon,
    isEnabled: () => model.idle,
    isVisible: () => {
      const current = tracker.activeCell;
      return current?.model.sharedModel.cell_type === 'markdown';
    }
  });
  palette.addItem({
    command: CommandIDs.SPLIT_CELL,
    category: 'jupyter-Litchi'
  });

  const default_languages: string[] = ['Chinese', 'English'];
  const trans = async (args: any) => {
    const language = args.language.toString();
    const t = translate(language);
    await t(app, tracker, settingRegistry, model, state, language)
      .catch(alert)
      .finally(() => {
        model.processing = false;
      });
  };

  app.commands.addCommand(CommandIDs.TRANSLATE, {
    label: args => `Litchi Translate To ${args.language}`,
    icon: args => langIcon(args.language?.toString() || 'Unknown'),
    execute: async args => trans(args),
    isEnabled: () => !model.processing,
    isVisible: () => {
      const doctype = tracker.activeCell?.model.type;
      return doctype === 'markdown' || doctype === 'raw';
    }
  });

  palette.addItem({
    command: CommandIDs.TRANSLATE,
    category: 'jupyter-Litchi',
    args: { language: 'English' }
  });

  palette.addItem({
    command: CommandIDs.TRANSLATE,
    category: 'jupyter-Litchi',
    args: { language: 'Chinese' }
  });

  app.commands.addCommand(CommandIDs.UNIT_TEST, {
    label: args => 'Litchi Create Unit Test',
    icon: unitTestIcon,
    execute: async args => {
      const cell = tracker.activeCell!;
      if (cell.model.type !== 'code') {
        const message = 'Unit Test only for Code Cell';
        console.error(message);
        throw new Error(message);
      }
      let lang = 'Python';
      const mimeType = cell.editor?.model!.mimeType;
      if (mimeType) {
        lang = langInMime(mimeType);
      }
      const func = unitTest(lang);
      await func(app, tracker, settingRegistry, model, state, lang).finally(
        () => (model.processing = false)
      );
    },
    isEnabled: () => !model.processing,
    isVisible: () => {
      const doctype = tracker.activeCell?.model.type;
      return doctype === 'code';
    }
  });
  palette.addItem({
    command: CommandIDs.UNIT_TEST,
    category: 'jupyter-Litchi'
  });

  model.stateChanged.connect(w => {
    refreshPage(tracker, w.showRoles);
    settingRegistry.get(LITCHI_ID, 'continuous-mode').then(continuous => {
      if (continuous!.composite! !== model.continuous) {
        settingRegistry
          .set(LITCHI_ID, 'continuous-mode', model.continuous)
          .then(() => {
            console.log('Continuous mode changed.');
          });
      }
    });
  });
  app.commands.addCommand(CommandIDs.TOGGLE_ROLE, {
    label: 'Litchi Show Roles Toggle',
    execute: async () => {
      model.showRoles = !model.showRoles;
    },
    isToggled: () => model.showRoles,
    isEnabled: () => !model.processing
  });
  palette.addItem({
    command: CommandIDs.TOGGLE_ROLE,
    category: 'jupyter-Litchi'
  });
  app.commands.addCommand(CommandIDs.TOGGLE_CONTINUOUS, {
    label: 'Litchi Continuous Mode',
    execute: async () => {
      model.continuous = !model.continuous;
    },
    isToggled: () => model.continuous
  });
  palette.addItem({
    command: CommandIDs.TOGGLE_CONTINUOUS,
    category: 'jupyter-Litchi'
  });

  app.restored.then(() => {
    if (formRendererRegistry) {
      renderer(settingRegistry, formRendererRegistry, translator);
    }

    settingRegistry.get(LITCHI_ID, 'translators').then(trans => {
      const items = (trans.composite as ReadonlyPartialJSONArray) || [];
      for (const idx in items) {
        const lang = items[idx]!.toString();
        if (!default_languages.includes(lang)) {
          palette.addItem({
            command: CommandIDs.TRANSLATE,
            category: 'jupyter-Litchi',
            args: { language: lang }
          });
        }
      }
    });
  });
}

async function chatActivate(
  app: JupyterFrontEnd,
  registry: ISettingRegistry,
  tracker: INotebookTracker,
  model: Model,
  state: IStateDB,
  subTask: 'chat' | 'contextual' | 'historical' | 'selected'
) {
  try {
    if (model.processing) {
      console.log('an other process is running');
      return;
    }

    model.processing = true;
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
      const message = 'litchi:chat exit because the content of cell is null'
      alert(message);
      return;
    }
    const latest = cellToMessage(cell.model);

    const aiModel = (await state.fetch('litchi:model'))?.toString();
    if (aiModel === null || aiModel === undefined) {
      const message = 'litchi:chat exit because not any model selected';
      alert(message);
      return;
    }

    const settings = await registry.load(LITCHI_ID);
    const session: IMessage[] = [
      await Message.startUp(settings),
      ...createContext(subTask, notebook)
    ];

    const url = settings.get('chat')!.composite!.toString();
    const key = settings.get('key')?.composite?.toString();

    const message = await chat(url, key, session, latest, aiModel!).catch(
      alert
    );
    if (message.content !== undefined && message.content.length > 0) {
      const cellModel = new MarkdownCellModel();
      cellModel.sharedModel.setSource(message.content);
      cellModel.sharedModel.setMetadata(LITCHI_MESSAGE_ROLE, message.role);
    } else {
      if (message.content === '') {
        console.log('ignored empty message');
        return;
      }
      console.error(`get a invalid message ${message}`);
      alert(
        'Message is invalid. Please check the settings and the model selected. Or check the explorer console if you are a developer.'
      );
      return;
    }

    const { commands } = app;
    commands
      .execute('notebook:insert-cell-below')
      .then(() => {
        commands.execute('notebook:change-cell-to-markdown');
      })
      .then(() => {
        if (model.continuous) {
          commands.execute('notebook:insert-cell-below').then(() => {
            commands.execute('notebook:change-cell-to-markdown');
          });
        }
      });

    const newCell = notebook.activeCell!;
    const newModel = newCell.model.sharedModel;
    newModel.setSource(message.content);
    newModel.setMetadata(LITCHI_MESSAGE_ROLE, message.role);
  } finally {
    model.processing = false;
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

async function refreshPage(
  tracker: INotebookTracker,
  showRoles: boolean
): Promise<void> {
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

async function splitCell(
  app: JupyterFrontEnd,
  registry: ISettingRegistry,
  tracker: INotebookTracker
) {
  const origin = tracker.activeCell;
  if (origin === null) {
    console.error('litchi:split-cell exit because any cell not been selected');
    return;
  }
  const content = origin.model.sharedModel.source;
  const segments = to_segments(content);
  for (const idx in segments) {
    const segment = segments[idx];
    await app.commands.execute('notebook:insert-cell-below').then(() => {
      if (segment.category === 'markdown') {
        app.commands.execute('notebook:change-cell-to-markdown');
      }
    });
    const cell = tracker.activeCell;
    cell?.model.sharedModel.setSource(segment.content);
    if (segment.category === 'code') {
      cell?.model.sharedModel.setMetadata('language', segment.language);
    }
  }
  origin.activate();
  await app.commands.execute('notebook:delete-cell');
}

/**
 * Export the plugin as default.
 */
export default plugin;

function langInMime(mime: string) {
  const token = mime.replace('text/x-', '');
  switch (token) {
    case 'ipython':
      return 'python';
    default:
      return token;
  }
}
