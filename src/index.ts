import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import {
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker
} from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';

class APODWidget extends Widget {
  /**
   * Construct a new APOD widget.
   */
  constructor() {
    super();

    this.addClass('litchiWidget');

    // Add an image element to the panel
    this.img = document.createElement('img');
    this.node.appendChild(this.img);

    // Add a summary element to the panel
    this.summary = document.createElement('p');
    this.node.appendChild(this.summary);
  }

  /**
   * The image element associated with the widget.
   */
  readonly img: HTMLImageElement;

  /**
   * The summary text element associated with the widget.
   */
  readonly summary: HTMLParagraphElement;

  /**
   * Handle update requests for the widget.
   */
  async updateAPODiImage(): Promise<void> {

    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${this.randomDate()}`);

    if (!response.ok) {
      const data = await response.json();
      if (data.error) {
        this.summary.innerText = data.error.message;
      } else {
        this.summary.innerText = response.statusText;
      }
      return;
    }

    const data = (await response.json()) as APODResponse;

    if (data.media_type === 'image') {
      // Populate the image
      this.img.src = data.url;
      this.img.title = data.title;
      this.summary.innerText = data.title;
      if (data.copyright) {
        this.summary.innerText += ` (Copyright ${data.copyright})`;
      }
    } else {
      this.summary.innerText = 'Random APOD fetched was not an image.';
    }
  }

  /**
   * Get a random date string in YYYY-MM-DD format.
   */
  randomDate(): string {
    const start = new Date(2010, 1, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().slice(0, 10);
  }
}

interface APODResponse {
  copyright: string;
  date: string;
  explanation: string;
  media_type: 'video' | 'image';
  title: string;
  url: string;
}

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'litchi-apod',
  autoStart: true,
  requires: [ICommandPalette],
  optional: [ILayoutRestorer, ISettingRegistry],
  activate: activate
};

/**
 * Initialization data for the litchi extension.
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  restorer: ILayoutRestorer | null,
  settingRegistry: ISettingRegistry | null
) {
  console.log('JupyterLab extension litchi is activated!');
  console.log('ICommandPalette:', palette);

  const newWidget = () => {
    const content = new APODWidget();
    const widget = new MainAreaWidget({ content });
    widget.id = 'litchi-settings';
    widget.title.label = 'Litchi Settings';
    widget.title.closable = true;
    return widget;
  };

  let widget = newWidget();
  // Add an application command
  const command: string = 'litchi:settings';
  app.commands.addCommand(command, {
    label: 'litchi:settings',
    execute: async () => {
      // Regenerate the widget if disposed
      if (widget.isDisposed) {
        widget = await newWidget();
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }
      // Refresh the picture in the widget
      widget.content.updateAPODiImage();
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });
  // Add the command to the palette.
  palette.addItem({ command, category: 'Litchi' });

  // if (settingRegistry) {
  //   settingRegistry
  //     .load(plugin.id)
  //     .then(settings => {
  //       console.log('litchi settings loaded:', settings.composite);
  //     })
  //     .catch(reason => {
  //       console.error('Failed to load settings for litchi.', reason);
  //     });
  // }

  // Track and restore the widget state
  const tracker = new WidgetTracker<MainAreaWidget<APODWidget>>({
    namespace: 'litchi'
  });
  if (restorer) {
    restorer.restore(tracker, {
      command,
      name: () => 'litchi'
    });
  }
}

export default plugin;
