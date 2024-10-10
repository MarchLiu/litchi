import { ISettingRegistry } from '@jupyterlab/settingregistry';
import {
  IFormRenderer,
//  FormComponent,
  IFormRendererRegistry
} from '@jupyterlab/ui-components';
import type { FieldProps } from '@rjsf/utils';
import React, { useState } from 'react';
import { LITCHI_ID } from './constants';
// import { EditorExtensionRegistry } from '@jupyterlab/codemirror';
// import { JSONExt, ReadonlyJSONValue } from '@lumino/coreutils';
import {
  ITranslator,
  // nullTranslator
} from '@jupyterlab/translation';
// import validatorAjv8 from '@rjsf/validator-ajv8';
export function renderer(
  settingRegistry: ISettingRegistry,
  formRegistry: IFormRendererRegistry,
  translator: ITranslator
) {
  const systemPromptRenderer: IFormRenderer = {
    fieldRenderer: props => {
      return renderSystemPrompt(props);
    }
  };
  formRegistry.addRenderer(`${LITCHI_ID}.system`, systemPromptRenderer);

  // const providersRenderer: IFormRenderer = {
  //   fieldRenderer: props => {
  //     return renderProviders(translator, props);
  //   }
  // };
  // formRegistry.addRenderer(`${LITCHI_ID}.providers.[*]`, providersRenderer);
}

/**
 * System Prompt renderer.
 */
export function renderSystemPrompt(props: FieldProps) {
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
        <div key="system" className="form-group large-field">
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

/**
 * Providers Settings renderer.
 */
// export function renderProviders(translator: ITranslator, props: FieldProps) {
//   const registry = new EditorExtensionRegistry();
//   const properties = React.useMemo(() => registry.settingsSchema, []) as any;
//   const defaultFormData: Record<string, any> = {};
//   console.log('init providers settings page');
//   // Only provide customizable options
//   for (const [key, value] of Object.entries(registry.defaultConfiguration)) {
//     if (typeof properties[key] !== 'undefined') {
//       console.log(`property "${key}" load as ${value}`);
//       defaultFormData[key] = value;
//     }
//   }
//
//   return (
//     <div className="jp-FormGroup-contentNormal">
//       <h3 className="jp-FormGroup-fieldLabel jp-FormGroup-contentItem">
//         {props.schema.title}
//       </h3>
//       {props.schema.description && (
//         <div className="jp-FormGroup-description">
//           This is a provider {props.schema.description}
//         </div>
//       )}
//       <FormComponent
//         schema={{
//           title: props.schema.title,
//           description: props.schema.description,
//           type: 'object',
//           properties,
//           additionalProperties: false
//         }}
//         validator={validatorAjv8}
//         formData={{ ...defaultFormData, ...props.formData }}
//         formContext={{ defaultFormData }}
//         liveValidate
//         onChange={e => {
//           // Only save non-default values
//           console.log('provider settings changed');
//           const nonDefault: Record<string, ReadonlyJSONValue> = {};
//           for (const [property, value] of Object.entries(e.formData ?? {})) {
//             console.log(`property "${property}" changed to ${value}`);
//             alert(`property "${property}" changed to ${value}`);
//             const default_ = defaultFormData[property];
//             if (default_ === undefined || !JSONExt.deepEqual(value, default_)) {
//               nonDefault[property] = value;
//             }
//           }
//           props.onChange(nonDefault);
//         }}
//         tagName="div"
//         translator={translator ?? nullTranslator} />
//     </div>
//   );
// }
