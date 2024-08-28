import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { ReactWidget } from '@jupyterlab/ui-components';
import * as React from 'react';
import { IStateDB } from '@jupyterlab/statedb';
import { JupyterFrontEnd } from '@jupyterlab/application';

function ModelsComponent(props: { app: JupyterFrontEnd; state: IStateDB }) {
  // 使用useState来存储模型列表和选中的模型
  const [models, setModels] = React.useState<string[]>([]);
  const [selectedModel, setSelectedModel] = React.useState<string>('');

  // 使用useEffect来在组件加载时获取模型列表
  React.useEffect(() => {
    async function loadModels() {
      try {
        const modelList = await listModels('localhost', 11434);
        setModels(modelList);
        if (modelList.length > 0) {
          setSelectedModel(modelList[0]);
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
      {'(*☻-☻*)'}{' '}
      <label htmlFor="model-select"> Select Model:</label>
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

  protected render() {
    return <ModelsComponent app={this.app} state={this.state} />;
  }

  constructor(app: JupyterFrontEnd, state: IStateDB) {
    super();
    this.state = state;
    this.app = app;
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

interface IListModelsResponse {
  models: any[];
}

async function listModels(host: string, port: number) {
  const response = await fetch(`http://${host}:${port}/api/tags`, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' })
  });
  const data = (await response.json()) as IListModelsResponse;
  return data.models.map(m => m.name);
}
