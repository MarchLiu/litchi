import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { ReactWidget, ToolbarButtonComponent, Toolbar } from '@jupyterlab/ui-components';
import * as React from 'react';
import { IStateDB } from '@jupyterlab/statedb';
import { JupyterFrontEnd } from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { listModels } from './api';
import { Model } from './model';
import { caIcon, chIcon, csIcon, ctIcon } from "./icons";

function ModelsComponent(props: {
  appId: string;
  app: JupyterFrontEnd;
  registry: ISettingRegistry;
  state: IStateDB;
  model: Model;
}) {
  const [models, setModels] = React.useState<string[]>([]);
  const [selectedModel, setSelectedModel] = React.useState<string>('');
  const [processing, setProcessing] = React.useState(props.model.processing);

  React.useEffect(() => {
    async function loadModels() {
      try {
        console.log(`load settings from ${props.appId}`);
        const settings = await props.registry.load(props.appId);
        const baseUrl = settings.get('list-models').composite!.toString();
        const key = settings.get('key').composite?.toString();
        const modelList = await listModels(baseUrl, key).catch(console.error);
        setModels(modelList);
        if (modelList.length > 0) {
          setSelectedModel(modelList[0]);
          await props.state.save('litchi:model', modelList[0]);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    }

    loadModels();
  }, []);

  React.useEffect(() => {
    const stateChanged = props.model.stateChanged;
    stateChanged.connect((m, args) => {
      setProcessing(m.processing);
    });
  }, [props.model]);

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const model = event.target.value;
    await props.state.save('litchi:model', model);
    setSelectedModel(model);
  };

  const handleChatClick = () => {
    const { commands } = props.app;
    commands.execute('litchi:chat');
  };

  const handleContextualClick = () => {
    const { commands } = props.app;
    commands.execute('litchi:contextual');
  };

  const handleHistoricalClick = () => {
    const { commands } = props.app;
    commands.execute('litchi:historical');
  };

  const handleSelectedClick = () => {
    const { commands } = props.app;
    commands.execute('litchi:selected');
  };

  return (
    <div>
      <ToolbarButtonComponent
        icon={caIcon}
        onClick={handleChatClick}
        enabled={!processing}
        tooltip="Chat"
      ></ToolbarButtonComponent>
      <ToolbarButtonComponent
        icon={chIcon}
        onClick={handleHistoricalClick}
        enabled={!processing}
        tooltip="Chat With Historical"
      ></ToolbarButtonComponent>
      <ToolbarButtonComponent
        icon={ctIcon}
        onClick={handleContextualClick}
        enabled={!processing}
        tooltip="Chat With Contextual"
      ></ToolbarButtonComponent>
      <ToolbarButtonComponent
        icon={csIcon}
        onClick={handleSelectedClick}
        enabled={!processing}
        tooltip="Chat With Selected"
      ></ToolbarButtonComponent>
      <span>
        <label
          htmlFor="model-select"
          className="jp-ToolbarButtonComponent"
        >
          Select Model:{' '}
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={handleChange}
          disabled={processing}
          className="jp-ToolbarButtonComponent"
        >
          {models.map(model => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </span>
    </div>
  );
}

/**
 * A notebook widget extension that adds a widget in the notebook header (widget below the toolbar).
 */
export class WidgetExtension
  extends ReactWidget
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  private readonly state: IStateDB;
  private readonly app: JupyterFrontEnd;
  private readonly registry: ISettingRegistry;
  private readonly appId: string;
  public readonly model: Model;

  protected render() {
    return (
      <ModelsComponent
        app={this.app}
        state={this.state}
        registry={this.registry}
        appId={this.appId}
        model={this.model}
      />
    );
  }

  constructor(
    appId: string,
    app: JupyterFrontEnd,
    registry: ISettingRegistry,
    state: IStateDB,
    model: Model
  ) {
    super();
    this.state = state;
    this.app = app;
    this.registry = registry;
    this.appId = appId;
    this.model = model;
    this.id = 'litchi-toolbar';
  }

  /**
   * Create a new extension object.
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const widget = new WidgetExtension(
      this.appId,
      this.app,
      this.registry,
      this.state,
      this.model
    );
    widget.addClass('jp-DefaultStyle');
    this.addClass('jp-litchi-toolbar');
    panel.toolbar.addItem('litchi:space', Toolbar.createSpacerItem());
    panel.toolbar.addItem('litchi:model-list', widget);
    return new DisposableDelegate(() => {
      this.dispose();
    });
  }
}
