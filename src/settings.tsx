import { ReactWidget } from '@jupyterlab/ui-components';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import {} from 'json5'
import * as React from 'react';
import { JupyterFrontEnd } from "@jupyterlab/application";

function FormComponent(props: { appId: string; app: JupyterFrontEnd, registry: ISettingRegistry }) {
  // const host = 'localhost';
  // const port = 11434;
  const [host, setHost] = React.useState<string>('localhost');
  const [port, setPort] = React.useState<number>(11434);
  const [key, setKey] = React.useState<string>('');

  // 定义一个事件处理函数，用于在输入值改变时更新状态
  const handleHostChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const h = event.target.value;
    console.log(`set host:${h}`);
    setHost(h); // 使用事件对象更新状态
    await props.registry.set(props.appId, 'ollama:host', h);
  };

  const handlePortChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const p = Number.parseInt(event.target.value);
    setPort(p); // 使用事件对象更新状态
    await props.registry.set(props.appId, 'ollama:port', p);
  };

  const handleKeyChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const k = event.target.value;
    setKey(k); // 使用事件对象更新状态
    await props.registry.set(props.appId, 'ollama:key', k);
  };

  React.useEffect(() => {
    const app = props.app;
    const registry = props.registry;
    async function loadSettings() {
      await registry.connector
        .save(props.appId, '{}')
        .then(r => {
          console.log(r);
        })
        .catch(console.error);
      if (!(props.appId in registry.plugins)) {
        await app.serviceManager.settings
          .save(props.appId, '{}')
          .catch(console.error);
        app.serviceManager.settings
          .fetch(props.appId)
          .then(plugin => {
            console.log(`litchi in settings: ${JSON.stringify(plugin)}`);
          })
          .catch(console.error);

        props.registry
          .load(props.appId)
          .then(s => {
            console.log(`settings loaded: ${JSON.stringify(s)}`);
            s.set('ollama:host', 'localhost')
              .then(v => s.set('ollama:port', 11434))
              .then(v => s.set('ollama:key', ''));
          })
          .catch(reason => {
            console.error(reason);
          })
          .then(v => {
            console.log('litchi settings uploaded');
          });
      }
      props.registry
        .get(props.appId, 'ollama:host')
        .then(h => setHost(h!.toString()))
        .catch(reason => {
          console.error(reason);
          setHost('localhost');
        });
      props.registry
        .get(props.appId, 'ollama:port')
        .then(p => Number.parseInt(p!.toString()))
        .then(n => setPort(n))
        .catch(reason => {
          console.error(reason);
          setPort(11434);
        });
      props.registry
        .get(props.appId, 'ollama:key')
        .then(k => k!.toString())
        .then(k => setKey(k))
        .catch(reason => {
          console.error(reason);
          setKey(key);
        });
    }

    loadSettings();
  }, []);

  return (
    <div>
      Ollama:
      <br />
      <label htmlFor="hostInput">Host:</label>
      <input
        type="text"
        id="hostInput"
        value={host}
        onChange={handleHostChange}
      />
      <br />
      <label htmlFor="portInput">Port:</label>
      <input
        id="portInput"
        type="text"
        value={port}
        onChange={handlePortChange}
      />
      <br />
      <label htmlFor="keyInput">Auth Key:</label>
      <input
        id="keyInput"
        type="text"
        value={key}
        onChange={handleKeyChange}
        placeholder="optional"
      />
      <hr />
    </div>
  );
}

export class SettingWidget extends ReactWidget {
  app: JupyterFrontEnd;
  registry: ISettingRegistry;
  appId: string;

  constructor(appId: string, app: JupyterFrontEnd, registry: ISettingRegistry) {
    super();
    this.app = app;
    this.appId = appId;
    this.registry = registry;
  }

  protected render() {
    return <FormComponent appId={this.appId} app={this.app} registry={this.registry} />;
  }
}
