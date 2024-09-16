import { ISettingRegistry } from '@jupyterlab/settingregistry';
import {
  IFormRenderer,
  IFormRendererRegistry
} from '@jupyterlab/ui-components';

import type { FieldProps } from '@rjsf/utils';
import React, { useState } from 'react';
import { LITCHI_ID } from './constants';


export function renderer(
  settingRegistry: ISettingRegistry,
  formRegistry: IFormRendererRegistry
) {
  const renderer: IFormRenderer = {
    fieldRenderer: props => {
      return renderAvailableProviders(props);
    }
  };
  formRegistry.addRenderer(`${LITCHI_ID}.system`, renderer);
}

/**
 * Custom setting renderer.
 */
export function renderAvailableProviders(props: FieldProps) {
  const { schema } = props;
  const title = schema.title;
  const desc = schema.description;
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
        <legend>{title}</legend>
        <p className="field-description">{desc}</p>
        <div key="system" className="form-group small-field">
          <div>
            <h3> {desc} </h3>
            <div className="inputFieldWrapper">
              <textarea
                className="form-control"
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
