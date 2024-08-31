import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { ReactWidget } from '@jupyterlab/ui-components';
import * as React from 'react';
import { IStateDB } from '@jupyterlab/statedb';
import { JupyterFrontEnd } from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { listModels } from './api';

function ModelsComponent(props: {
  appId: string;
  app: JupyterFrontEnd;
  registry: ISettingRegistry;
  state: IStateDB;
}) {
  // 使用useState来存储模型列表和选中的模型
  const [models, setModels] = React.useState<string[]>([]);
  const [selectedModel, setSelectedModel] = React.useState<string>('');

  // 使用useEffect来在组件加载时获取模型列表
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

  // 处理下拉列表选项变化的事件
  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
    await props.state.save('litchi:model', event.target.value);
  };

  const handleChatClick = async (event: React.MouseEvent) => {
    const { commands } = props.app;
    await commands.execute('litchi:chat');
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
      <button onClick={handleChatClick}>send activate cell</button>
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

  protected render() {
    return (
      <ModelsComponent
        app={this.app}
        state={this.state}
        registry={this.registry}
        appId={this.appId}
      />
    );
  }

  constructor(
    appId: string,
    app: JupyterFrontEnd,
    registry: ISettingRegistry,
    state: IStateDB
  ) {
    super();
    this.state = state;
    this.app = app;
    this.registry = registry;
    this.appId = appId;
  }

  /**
   * Create a new extension object.
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    panel.contentHeader.insertWidget(0, this);
    return new DisposableDelegate(() => {
      this.dispose();
    });
  }
}
