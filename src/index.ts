import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import { Widget } from '@lumino/widgets';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  activate,
  id: 'my-extension-name:widgetPlugin',
  description: 'Add a widget to the notebook header.',
  autoStart: true
};

/**
 * A notebook widget extension that adds a widget in the notebook header (widget below the toolbar).
 */
export class WidgetExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  /**
   * Create a new extension object.
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const widget = new Widget({ node: Private.createNode() });
    widget.addClass('jp-myextension-myheader');

    panel.contentHeader.insertWidget(0, widget);
    return new DisposableDelegate(() => {
      widget.dispose();
    });
  }
}

/**
 * Activate the extension.
 */
function activate(app: JupyterFrontEnd): void {
  app.docRegistry.addWidgetExtension('Notebook', new WidgetExtension());
}

/**
 * Export the plugin as default.
 */
export default plugin;

/**
 * Private helpers
 */
namespace Private {
  /**
   * Generate the widget node
   */
  export function createNode(): HTMLElement {
    const span = document.createElement('span');
    span.textContent = 'My custom header';
    return span;
  }
}