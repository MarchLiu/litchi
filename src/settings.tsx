import { ISettingRegistry } from '@jupyterlab/settingregistry';
import {
  deleteIcon,
  IFormRenderer,
  IFormRendererRegistry
} from '@jupyterlab/ui-components';
import type { FieldProps } from '@rjsf/utils';
import React, { useState } from 'react';
import { LITCHI_ID } from './constants';
import { ITranslator } from '@jupyterlab/translation';
import { ReadonlyPartialJSONArray } from '@lumino/coreutils';
import { IAuthKeyOption, IOllamaOption, IProviderOption } from './commons';
import { Model } from './model';

export function renderer(
  settingRegistry: ISettingRegistry,
  formRegistry: IFormRendererRegistry,
  translator: ITranslator,
  model: Model
) {

  const systemPromptRenderer: IFormRenderer = {
    fieldRenderer: props => {
      return renderSystemPrompt(props);
    }
  };
  formRegistry.addRenderer(`${LITCHI_ID}.system`, systemPromptRenderer);

  const providersRenderer: IFormRenderer = {
    fieldRenderer: props => {
      return renderProvidersPanel(props, model);
    }
  };
  formRegistry.addRenderer(`${LITCHI_ID}.providers`, providersRenderer);

  const selectedRenderer: IFormRenderer = {
    fieldRenderer: props => {
      return renderSelected(props);
    }
  };
  formRegistry.addRenderer(`${LITCHI_ID}.selected`, selectedRenderer);
}

/**
 * System Prompt renderer.
 */
export function renderSystemPrompt(props: FieldProps) {
  const { schema } = props;
  const title = schema.title;
  const settings: ISettingRegistry.ISettings = props.formContext.settings;
  const settingData = settings.get('system').composite!.toString();
  const [system, setSystem] = useState<string>(settingData);

  const onSettingChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    settings.set('system', value).catch(console.error);
    setSystem(value);
  };

  return (
    <div>
      <fieldset>
        <h3>{title}</h3>
        <div key="system" className="form-group large-field">
          <div>
            <div className="inputFieldWrapper">
              <textarea
                className="form-control jp-InputArea-editor"
                value={system}
                onChange={onSettingChange}
              />
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

/**
 * Provider Selected Renderer.
 */
export function renderSelected(props: FieldProps) {
  const { schema } = props;
  const title = schema.title;
  const desc = schema.description;
  const settings: ISettingRegistry.ISettings = props.formContext.settings;
  // const settingData: IProvider | undefined = settings.get('selected')
  //   .composite as unknown as IProvider;
  const [selected, setSelected] = useState<string>('Ollama');
  const providers = settings.get('providers')
    .composite! as unknown as IProviderOption[];

  const onProviderSelected = (e: { target: { value: any } }) => {
    const value = e.target.value;

    setSelected(value);
    settings.set('selected', selected).catch(console.error);
  };

  return (
    <div>
      <fieldset>
        <legend>{title}</legend>
        <p className="field-description">{desc}</p>
        <div key="system" className="form-group large-field">
          <div>
            <div className="inputFieldWrapper">
              <select
                id="provider-select"
                value={selected}
                onChange={onProviderSelected}
                className="jp-ToolbarButtonComponent"
              >
                {providers.map((item, index) => {
                  const name = item.name;

                  return (
                    <option key={name} value={index}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

/**
 * Provider Settings Panel.
 */
export function renderProvidersPanel(props: FieldProps, model: Model) {
  const { schema } = props;
  const title = schema.title;
  const desc = schema.description;
  const settings: ISettingRegistry.ISettings = props.formContext.settings;
  const providers: ReadonlyPartialJSONArray = settings.get('providers')
    .composite! as ReadonlyPartialJSONArray;
  const [ps, setPs] = React.useState<ReadonlyPartialJSONArray>(providers);

  return (
    <div>
      <fieldset>
        <legend>{title}</legend>
        <p className="field-description">{desc}</p>
        {ps.map((provider, idx) => {
          const onDelete = (e: any) => {
            model.removeProvider(idx);
            setPs(model.providers as unknown as ReadonlyPartialJSONArray);
            console.log(`provider ${idx} deleted`);
            model.stateChanged.emit();
          };

          const onChange = (e: any) => {
            console.log(`provider ${idx} updated`);
            setPs(e.target.value);
          };
          return settingsForm(
            idx,
            provider as unknown as IProviderOption,
            onChange,
            onDelete
          );
        })}
      </fieldset>
    </div>
  );
}

function settingsForm(
  index: number,
  options: IProviderOption,
  onChange: (e: any) => void,
  onDelete: (e: any) => void
) {
  return (
    <div className="field-group">
      <legend>
        {options.name}
        <span className="outer" onClick={onDelete}>
          <span className="inner">
            <deleteIcon.react tag="span" left="7px" bottom="5px" />
          </span>
        </span>
      </legend>
      <p className="field-description">
        [{index}]-{options.category}
      </p>
      {settingsItem(index, options, onChange)}
    </div>
  );
}

function settingsItem(
  index: number,
  options: IProviderOption,
  onChange: (e: { target: { value: any } }) => void
) {
  const category = options.category;
  switch (category) {
    case 'kimi':
      return authKeySettings(index, options as IAuthKeyOption, onChange);
    case 'openai':
      return authKeySettings(index, options as IAuthKeyOption, onChange);
    case 'deepseek':
      return authKeySettings(index, options as IAuthKeyOption, onChange);
    case 'ollama':
      return ollamaSettings(index, options as IOllamaOption, onChange);
    default:
      return <p>Unsupported category</p>;
  }
}

function ollamaSettings(
  index: number,
  options: IOllamaOption,
  onChange: (e: { target: { value: any } }) => void
) {
  return (
    <fieldset>
      <div className="form-group small-field" key="name">
        <div className="jp-FormGroup-content jp-FormGroup-contentNormal">
          <label className="jp-FormGroup-fieldLabel jp-FormGroup-contentItem inputFieldWrapper jp-FormGroup-content jp-FormGroup-contentNormal">
            Name:
          </label>
          <div className="jp-inputFieldWrapper jp-FormGroup-contentItem">
            <input
              className="form-control"
              type="text"
              name="name"
              value={options.name}
              onChange={onChange}
              required
            />
          </div>
        </div>
      </div>
      <div className="form-group large-field" key="baseUrl">
        <div className="jp-FormGroup-content jp-FormGroup-contentNormal">
          <label className="jp-FormGroup-fieldLabel jp-FormGroup-contentItem inputFieldWrapper jp-FormGroup-content jp-FormGroup-contentNormal">
            Base URL:
          </label>
          <div className="jp-inputFieldWrapper jp-FormGroup-contentItem">
            <input
              className="form-control"
              type="text"
              name="baseUrl"
              onChange={onChange}
              value={options.baseUrl}
              required
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
}

function authKeySettings(
  index: number,
  options: IAuthKeyOption,
  onChange: (e: { target: { value: any } }) => void
) {
  return (
    <fieldset>
      <div className="form-group small-field" key="name">
        <div className="jp-FormGroup-content jp-FormGroup-contentNormal">
          <label className="jp-FormGroup-fieldLabel jp-FormGroup-contentItem">
            Name:
          </label>
          <div className="jp-inputFieldWrapper jp-FormGroup-contentItem">
            <input
              className="form-control"
              type="text"
              name="name"
              value={options.name}
              required
            />
          </div>
        </div>
      </div>
      <div className="form-group large-field" key="authKey">
        <div className="form-group small-field">
          <label className="jp-FormGroup-fieldLabel jp-FormGroup-contentItem inputFieldWrapper jp-FormGroup-content jp-FormGroup-contentNormal">
            {options.category} Key:
          </label>
          <div className="jp-inputFieldWrapper jp-FormGroup-contentItem">
            <input
              className="form-control"
              type="text"
              name="authorizationKey"
              onChange={onChange}
              value={options.authKey}
              required
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
}
