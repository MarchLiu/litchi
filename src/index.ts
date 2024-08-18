import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the lichi extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'lichi:plugin',
  description: 'Lichi is a ai client for jupyter lab',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension lichi is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('lichi settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for lichi.', reason);
        });
    }
  }
};

export default plugin;
