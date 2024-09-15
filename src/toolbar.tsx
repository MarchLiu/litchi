import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { ReactWidget } from '@jupyterlab/ui-components';
import * as React from 'react';
import { IStateDB } from '@jupyterlab/statedb';
import { JupyterFrontEnd } from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { listModels } from './api';
import { Model } from './model';

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

  const handleChatClick = async (event: React.MouseEvent) => {
    const { commands } = props.app;
    await commands.execute('litchi:chat');
  };

  const handleContextualClick = async (event: React.MouseEvent) => {
    const { commands } = props.app;
    await commands.execute('litchi:contextual');
  };

  const handleHistoricalClick = async (event: React.MouseEvent) => {
    const { commands } = props.app;
    await commands.execute('litchi:historical');
  };

  const handleSelectedClick = async (event: React.MouseEvent) => {
    const { commands } = props.app;
    await commands.execute('litchi:selected');
  };

  return (
    <span>
      {'(*☻-☻*)'} <label htmlFor="model-select"> Select Model:</label>
      <select id="model-select" value={selectedModel} onChange={handleChange}>
        {models.map(model => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>{' '}
      <button disabled={processing} onClick={handleChatClick}>
        Chat
      </button>{' '}
      <button disabled={processing} onClick={handleContextualClick}>
        Contextual
      </button>{' '}
      <button disabled={processing} onClick={handleHistoricalClick}>
        Historical
      </button>{' '}
      <button disabled={processing} onClick={handleSelectedClick}>
        Selected
      </button>
    </span>
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
    this.addClass('jp-litchi-toolbar');
    panel.contentHeader.insertWidget(0, this);
    return new DisposableDelegate(() => {
      this.dispose();
    });
  }
}
