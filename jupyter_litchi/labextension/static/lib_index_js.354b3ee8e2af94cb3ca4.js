"use strict";
(self["webpackChunkjupyter_litchi"] = self["webpackChunkjupyter_litchi"] || []).push([["lib_index_js"],{

/***/ "./lib/api.js":
/*!********************!*\
  !*** ./lib/api.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Message: () => (/* binding */ Message),
/* harmony export */   chat: () => (/* binding */ chat),
/* harmony export */   listModels: () => (/* binding */ listModels)
/* harmony export */ });
// SendRequestComponent.tsx
class Message {
    constructor(role, content) {
        this.role = role;
        this.content = content;
    }
    static async startUp(settings) {
        const system = settings.get('system').composite.toString();
        return new Message('system', system);
    }
}
class ChatRequest {
    constructor(model, messages, stream = false) {
        this.model = model;
        this.stream = stream;
        this.messages = messages;
    }
}
async function chat(url, key, session, message, model) {
    try {
        const messages = [...session, message];
        const request = new ChatRequest(model, messages);
        const headers = requestHeaders(key);
        const resp = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(request)
        });
        const data = await resp.json();
        if (data.message !== undefined) {
            return data.message;
        }
        else if (data.choices !== undefined) {
            const msgs = data.choices.map((c) => c.message);
            if (msgs.length > 0) {
                return msgs[0];
            }
        }
    }
    catch (error) {
        console.error('Error sending request to server:', error);
    }
    console.error('message not success');
    return { message: '', role: 'assistant' };
}
async function listModels(url, key) {
    const headers = requestHeaders(key);
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });
    return response
        .json()
        .then(data => {
        if (data.models !== undefined) {
            return data.models.map((m) => m.name);
        }
        else if (data.data !== undefined) {
            return data.data.map((m) => m.id);
        }
        else {
            console.error(`except data ${JSON.stringify(data, null, 2)}`);
            return [];
        }
    })
        .catch(e => {
        console.error(e);
        return [];
    });
}
function requestHeaders(key) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json'
    });
    if (key !== undefined && key.length > 0) {
        headers.set('Authorization', key);
    }
    return headers;
}


/***/ }),

/***/ "./lib/constants.js":
/*!**************************!*\
  !*** ./lib/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommandIDs: () => (/* binding */ CommandIDs),
/* harmony export */   LITCHI_ID: () => (/* binding */ LITCHI_ID),
/* harmony export */   LITCHI_MESSAGE_ROLE: () => (/* binding */ LITCHI_MESSAGE_ROLE)
/* harmony export */ });
const LITCHI_ID = 'jupyter-litchi:jupyter-litchi';
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.CHAT = 'litchi:chat';
    CommandIDs.CONTEXTUAL = 'litchi:contextual';
    CommandIDs.HISTORICAL = 'litchi:historical';
    CommandIDs.SELECTED = 'litchi:selected';
    CommandIDs.TOGGLE_ROLE = 'litchi:show-roles-toggle';
})(CommandIDs || (CommandIDs = {}));
const LITCHI_MESSAGE_ROLE = 'litchi:message:role';


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activate: () => (/* binding */ activate),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/statedb */ "webpack/sharing/consume/default/@jupyterlab/statedb");
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./api */ "./lib/api.js");
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/cells */ "webpack/sharing/consume/default/@jupyterlab/cells");
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_cells__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/settingregistry */ "webpack/sharing/consume/default/@jupyterlab/settingregistry");
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _toolbar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./toolbar */ "./lib/toolbar.js");
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./model */ "./lib/model.js");
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jupyterlab/translation */ "webpack/sharing/consume/default/@jupyterlab/translation");
/* harmony import */ var _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_translation__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./constants */ "./lib/constants.js");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./settings */ "./lib/settings.js");












/**
 * The plugin registration information.
 */
const plugin = {
    id: _constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_ID,
    description: 'Add a widget to the notebook header.',
    autoStart: true,
    activate: activate,
    optional: [_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__.IFormRendererRegistry],
    requires: [
        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ICommandPalette,
        _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__.INotebookTracker,
        _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_4__.ISettingRegistry,
        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.IToolbarWidgetRegistry,
        _jupyterlab_translation__WEBPACK_IMPORTED_MODULE_5__.ITranslator,
        _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1__.IStateDB
    ]
};
async function activate(app, palette, tracker, settingRegistry, toolbarRegistry, translator, state, formRendererRegistry) {
    const model = new _model__WEBPACK_IMPORTED_MODULE_8__.Model();
    const widget = new _toolbar__WEBPACK_IMPORTED_MODULE_9__.WidgetExtension(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_ID, app, settingRegistry, state, model);
    app.docRegistry.addWidgetExtension('Notebook', widget);
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.CHAT, {
        label: 'Litchi Chat',
        execute: async () => {
            await chatActivate(app, settingRegistry, tracker, model, state, 'chat');
        },
        isEnabled: () => !model.processing
    });
    palette.addItem({ command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.CHAT, category: 'jupyter-Litchi' });
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.CONTEXTUAL, {
        label: 'Litchi Chat Contextual',
        execute: async () => {
            await chatActivate(app, settingRegistry, tracker, model, state, 'contextual');
        },
        isEnabled: () => !model.processing
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.CONTEXTUAL,
        category: 'jupyter-Litchi'
    });
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.HISTORICAL, {
        label: 'Litchi Chat Historical',
        execute: async () => {
            await chatActivate(app, settingRegistry, tracker, model, state, 'historical');
        },
        isEnabled: () => !model.processing
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.HISTORICAL,
        category: 'jupyter-Litchi'
    });
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.SELECTED, {
        label: 'Litchi Chat Selected',
        execute: async () => {
            await chatActivate(app, settingRegistry, tracker, model, state, 'selected');
        },
        isEnabled: () => !model.processing
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.SELECTED,
        category: 'jupyter-Litchi'
    });
    model.stateChanged.connect(w => {
        refreshPage(tracker, w.showRoles);
    });
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.TOGGLE_ROLE, {
        label: 'Litchi Show Roles Toggle',
        execute: async () => {
            model.showRoles = !model.showRoles;
        },
        isToggled: () => model.showRoles
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.TOGGLE_ROLE,
        category: 'jupyter-Litchi'
    });
    app.restored.then(() => {
        if (formRendererRegistry) {
            (0,_settings__WEBPACK_IMPORTED_MODULE_10__.renderer)(settingRegistry, formRendererRegistry);
        }
    });
}
async function chatActivate(app, registry, tracker, model, state, subTask) {
    var _a, _b, _c, _d;
    try {
        if (model.processing) {
            console.log('an other process is running');
            return;
        }
        model.processing = true;
        const cell = tracker.activeCell;
        if (cell === null) {
            console.error('litchi:chat exit because any cell not been selected');
            return;
        }
        const notebook = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
        if (notebook === undefined) {
            console.error('litchi:chat exit because the notebook not found');
            return;
        }
        cell.model.sharedModel.setMetadata(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE, 'user');
        const content = cell.model.sharedModel.source;
        // eslint-disable-next-line eqeqeq
        if (content === null) {
            console.error('litchi:chat exit because the content of cell is null');
            return;
        }
        const latest = cellToMessage(cell.model);
        const aiModel = (_b = (await state.fetch('litchi:model'))) === null || _b === void 0 ? void 0 : _b.toString();
        if (aiModel === null || aiModel === undefined) {
            console.error('litchi:chat exit because not any model selected');
            return;
        }
        const settings = await registry.load(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_ID);
        const session = [
            await _api__WEBPACK_IMPORTED_MODULE_11__.Message.startUp(settings),
            ...createContext(subTask, notebook)
        ];
        const url = settings.get('chat').composite.toString();
        const key = (_d = (_c = settings.get('key')) === null || _c === void 0 ? void 0 : _c.composite) === null || _d === void 0 ? void 0 : _d.toString();
        const message = await (0,_api__WEBPACK_IMPORTED_MODULE_11__.chat)(url, key, session, latest, aiModel);
        if (message.content && message.content.length > 0) {
            const cellModel = new _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_2__.MarkdownCellModel();
            cellModel.sharedModel.setSource(message.content);
            cellModel.sharedModel.setMetadata(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE, message.role);
        }
        const { commands } = app;
        commands.execute('notebook:insert-cell-below').then(() => {
            commands.execute('notebook:change-cell-to-markdown');
        });
        const newCell = notebook.activeCell;
        const newModel = newCell.model.sharedModel;
        newModel.setSource(message.content);
        newModel.setMetadata(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE, message.role);
    }
    finally {
        model.processing = false;
    }
}
function createContext(command, notebook) {
    switch (command) {
        case 'chat':
            return [];
        case 'contextual': {
            const stop = notebook.activeCellIndex;
            if (stop === undefined) {
                return [];
            }
            let messages = [];
            for (let idx = 0; idx < stop; idx++) {
                const cell = notebook.model.cells.get(idx);
                const model = cell.sharedModel;
                if (_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE in model.metadata &&
                    model.metadata[_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE] !== undefined) {
                    messages = [...messages, cellToMessage(cell)];
                }
            }
            return messages;
        }
        case 'historical': {
            const stop = notebook.activeCellIndex;
            let messages = [];
            for (let idx = 0; idx < stop; idx++) {
                const cell = notebook.model.cells.get(idx);
                const model = cell.sharedModel;
                messages = [...messages, cellToMessage(cell)];
                if (!(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE in model.metadata) ||
                    model.metadata[_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE] === undefined) {
                    cell.metadata[_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE] = 'user';
                }
            }
            return messages;
        }
        case 'selected': {
            const cells = notebook.selectedCells;
            let messages = [];
            for (let idx = 0; idx < cells.length; idx++) {
                const cell = cells[idx].model;
                const model = cell.sharedModel;
                if (!(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE in model.metadata) ||
                    cell.metadata[_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE] === undefined) {
                    cell.metadata[_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE] = 'user';
                }
                messages = [...messages, cellToMessage(cell)];
            }
            return messages;
        }
    }
    return [];
}
function cellToMessage(cell) {
    const model = cell.sharedModel;
    let role = 'user';
    if (_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE in cell.metadata) {
        role = cell.getMetadata(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE).toString();
    }
    let content = model.source;
    if (model.cell_type === 'code') {
        let language = '';
        const tokens = cell.mimeType.split('-');
        if (tokens.length > 1) {
            language = tokens[tokens.length - 1];
        }
        content = `\`\`\`${language}\n${content}\n\`\`\``;
    }
    return new _api__WEBPACK_IMPORTED_MODULE_11__.Message(role, content);
}
async function refreshPage(tracker, showRoles) {
    var _a, _b;
    const notebook = tracker.currentWidget;
    if (notebook === null) {
        console.log('no notebook was selected');
        return;
    }
    const cells = notebook.model.cells;
    if (showRoles) {
        for (let idx = 0; idx < cells.length; idx++) {
            const cell = cells.get(idx);
            if (_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE in cell.sharedModel.metadata) {
                const role = cell.sharedModel
                    .getMetadata(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE)
                    .toString();
                (_a = notebook === null || notebook === void 0 ? void 0 : notebook.content.widgets[idx].inputArea) === null || _a === void 0 ? void 0 : _a.addClass(`jp-litchi-role-${role}-Cell`);
            }
        }
    }
    else {
        for (let idx = 0; idx < cells.length; idx++) {
            const cell = cells.get(idx);
            if (_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE in cell.sharedModel.metadata) {
                const role = cell.sharedModel
                    .getMetadata(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE)
                    .toString();
                (_b = notebook === null || notebook === void 0 ? void 0 : notebook.content.widgets[idx].inputArea) === null || _b === void 0 ? void 0 : _b.removeClass(`jp-litchi-role-${role}-Cell`);
            }
        }
    }
}
/**
 * Export the plugin as default.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);


/***/ }),

/***/ "./lib/model.js":
/*!**********************!*\
  !*** ./lib/model.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Model: () => (/* binding */ Model)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);

class Model extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.VDomModel {
    constructor() {
        super();
        this._showRoles = false;
        this._processing = false;
    }
    get showRoles() {
        return this._showRoles;
    }
    set showRoles(v) {
        if (v !== this._showRoles) {
            this._showRoles = v;
            this.stateChanged.emit();
        }
    }
    get processing() {
        return this._processing;
    }
    set processing(value) {
        this._processing = value;
        this.stateChanged.emit();
    }
}


/***/ }),

/***/ "./lib/settings.js":
/*!*************************!*\
  !*** ./lib/settings.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderAvailableProviders: () => (/* binding */ renderAvailableProviders),
/* harmony export */   renderer: () => (/* binding */ renderer)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./lib/constants.js");


function renderer(settingRegistry, formRegistry) {
    const renderer = {
        fieldRenderer: props => {
            return renderAvailableProviders(props);
        }
    };
    formRegistry.addRenderer(`${_constants__WEBPACK_IMPORTED_MODULE_1__.LITCHI_ID}.system`, renderer);
}
/**
 * Custom setting renderer.
 */
function renderAvailableProviders(props) {
    const { schema } = props;
    const title = schema.title;
    const desc = schema.description;
    const settings = props.formContext.settings;
    const settingData = settings.get('system').composite.toString();
    const [system, setSystem] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(settingData);
    const onSettingChange = (e) => {
        const value = e.target.value;
        settings.set('system', value).catch(console.error);
        setSystem(value);
    };
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("fieldset", null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("legend", null, title),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", { className: "field-description" }, desc),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { key: "system", className: "form-group small-field" },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null,
                        " ",
                        desc,
                        " "),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "inputFieldWrapper" },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("textarea", { className: "form-control", value: system, onChange: onSettingChange })))))));
}


/***/ }),

/***/ "./lib/toolbar.js":
/*!************************!*\
  !*** ./lib/toolbar.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WidgetExtension: () => (/* binding */ WidgetExtension)
/* harmony export */ });
/* harmony import */ var _lumino_disposable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/disposable */ "webpack/sharing/consume/default/@lumino/disposable");
/* harmony import */ var _lumino_disposable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_disposable__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api */ "./lib/api.js");




function ModelsComponent(props) {
    const [models, setModels] = react__WEBPACK_IMPORTED_MODULE_2__.useState([]);
    const [selectedModel, setSelectedModel] = react__WEBPACK_IMPORTED_MODULE_2__.useState('');
    const [processing, setProcessing] = react__WEBPACK_IMPORTED_MODULE_2__.useState(props.model.processing);
    react__WEBPACK_IMPORTED_MODULE_2__.useEffect(() => {
        async function loadModels() {
            var _a;
            try {
                const settings = await props.registry.load(props.appId);
                const baseUrl = settings.get('list-models').composite.toString();
                const key = (_a = settings.get('key').composite) === null || _a === void 0 ? void 0 : _a.toString();
                const modelList = await (0,_api__WEBPACK_IMPORTED_MODULE_3__.listModels)(baseUrl, key).catch(console.error);
                setModels(modelList);
                if (modelList.length > 0) {
                    setSelectedModel(modelList[0]);
                    await props.state.save('litchi:model', modelList[0]);
                }
            }
            catch (error) {
                console.error('Error fetching models:', error);
            }
        }
        loadModels();
    }, []);
    react__WEBPACK_IMPORTED_MODULE_2__.useEffect(() => {
        const stateChanged = props.model.stateChanged;
        stateChanged.connect((m, args) => {
            setProcessing(m.processing);
        });
    }, [props.model]);
    const handleChange = async (event) => {
        const model = event.target.value;
        await props.state.save('litchi:model', model);
        setSelectedModel(model);
    };
    const handleChatClick = async (event) => {
        const { commands } = props.app;
        await commands.execute('litchi:chat');
    };
    const handleContextualClick = async (event) => {
        const { commands } = props.app;
        await commands.execute('litchi:contextual');
    };
    const handleHistoricalClick = async (event) => {
        const { commands } = props.app;
        await commands.execute('litchi:historical');
    };
    const handleSelectedClick = async (event) => {
        const { commands } = props.app;
        await commands.execute('litchi:selected');
    };
    return (react__WEBPACK_IMPORTED_MODULE_2__.createElement("span", null,
        '(*☻-☻*)',
        " ",
        react__WEBPACK_IMPORTED_MODULE_2__.createElement("label", { htmlFor: "model-select" }, " Select Model:"),
        react__WEBPACK_IMPORTED_MODULE_2__.createElement("select", { id: "model-select", value: selectedModel, onChange: handleChange }, models.map(model => (react__WEBPACK_IMPORTED_MODULE_2__.createElement("option", { key: model, value: model }, model)))),
        ' ',
        react__WEBPACK_IMPORTED_MODULE_2__.createElement("button", { disabled: processing, onClick: handleChatClick }, "Chat"),
        ' ',
        react__WEBPACK_IMPORTED_MODULE_2__.createElement("button", { disabled: processing, onClick: handleContextualClick }, "Contextual"),
        ' ',
        react__WEBPACK_IMPORTED_MODULE_2__.createElement("button", { disabled: processing, onClick: handleHistoricalClick }, "Historical"),
        ' ',
        react__WEBPACK_IMPORTED_MODULE_2__.createElement("button", { disabled: processing, onClick: handleSelectedClick }, "Selected")));
}
/**
 * A notebook widget extension that adds a widget in the notebook header (widget below the toolbar).
 */
class WidgetExtension extends _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.ReactWidget {
    render() {
        return (react__WEBPACK_IMPORTED_MODULE_2__.createElement(ModelsComponent, { app: this.app, state: this.state, registry: this.registry, appId: this.appId, model: this.model }));
    }
    constructor(appId, app, registry, state, model) {
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
    createNew(panel, context) {
        this.addClass('jp-litchi-toolbar');
        panel.contentHeader.insertWidget(0, this);
        return new _lumino_disposable__WEBPACK_IMPORTED_MODULE_0__.DisposableDelegate(() => {
            this.dispose();
        });
    }
}


/***/ })

}]);
//# sourceMappingURL=lib_index_js.354b3ee8e2af94cb3ca4.js.map