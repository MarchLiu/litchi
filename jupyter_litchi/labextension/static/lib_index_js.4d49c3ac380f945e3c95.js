"use strict";
(self["webpackChunkjupyter_litchi"] = self["webpackChunkjupyter_litchi"] || []).push([["lib_index_js"],{

/***/ "./lib/api.js":
/*!********************!*\
  !*** ./lib/api.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alert: () => (/* binding */ alert),
/* harmony export */   chat: () => (/* binding */ chat),
/* harmony export */   listModels: () => (/* binding */ listModels),
/* harmony export */   provider: () => (/* binding */ provider)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ollama__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ollama */ "./lib/ollama.js");
/* harmony import */ var _kimi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./kimi */ "./lib/kimi.js");
/* harmony import */ var _deepseek__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deepseek */ "./lib/deepseek.js");
// SendRequestComponent.tsx




function provider(settings) {
    const providers = settings.get('providers').composite;
    const name = settings.get('selected').composite;
    if (!providers) {
        throw new Error('Not any provider in settings');
    }
    if (!name) {
        throw new Error('Not any provider has been selected');
    }
    for (const provider of providers) {
        if (provider !== null) {
            const p = provider;
            if (p.name === name) {
                return createProvider(p);
            }
        }
    }
    throw new Error(`provider not found: ${name}`);
}
function createProvider(settings) {
    const category = settings.category;
    switch (category) {
        case 'ollama':
            return _ollama__WEBPACK_IMPORTED_MODULE_1__.ollama.createProvider(settings);
        case 'kimi':
            return _kimi__WEBPACK_IMPORTED_MODULE_2__.kimi.createProvider(settings);
        case 'deepseek':
            return _deepseek__WEBPACK_IMPORTED_MODULE_3__.deepseek.createProvider(settings);
        default:
            throw new Error(`provider type unknown: ${category}`);
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
        throw new Error('chat failed, maybe server gone or get a invalid response. Please check settings or explorer console if you are a developer');
    }
    console.error('message not success');
    return { message: '', role: 'assistant' };
}
async function listModels(url, key) {
    const headers = requestHeaders(key);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        console.log(headers);
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
                throw new Error(`invalid models list from ${url}. Please check the settings or explorer console if you are the developer`);
            }
        })
            .catch(e => {
            console.error(e);
            throw new Error(`list models from ${url} failed. Please check the settings or explorer console if you are the developer`);
        });
    }
    catch (error) {
        console.error(error);
        throw new Error(`list models from ${url} failed. Please check the settings or explorer console if you are the developer`);
    }
}
function requestHeaders(key) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json'
    });
    if (key !== undefined && key.length > 0) {
        headers.set('Authorization', `Bearer ${key}`);
    }
    return headers;
}
async function alert(message) {
    return (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showErrorMessage)('Litchi', message, [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.okButton()]);
}


/***/ }),

/***/ "./lib/commons.js":
/*!************************!*\
  !*** ./lib/commons.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Message: () => (/* binding */ Message),
/* harmony export */   initSetting: () => (/* binding */ initSetting)
/* harmony export */ });
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
function initSetting(category) {
    switch (category) {
        case 'ollama':
            return {
                baseUrl: 'http://localhost:11434',
                category: 'ollama',
                name: '',
                active: false
            };
        case 'kimi':
            return {
                authKey: '',
                category: 'kimit',
                name: '',
                active: false
            };
        case 'openai':
            return {
                authKey: '',
                category: 'openai',
                name: '',
                active: false
            };
        default:
            throw new Error(`category unknown: ${category}`);
    }
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
/* harmony export */   LITCHI_MESSAGE_ROLE: () => (/* binding */ LITCHI_MESSAGE_ROLE),
/* harmony export */   LITCHI_TOOLBAR_FACTORY: () => (/* binding */ LITCHI_TOOLBAR_FACTORY)
/* harmony export */ });
const LITCHI_ID = 'jupyter-litchi:jupyter-litchi';
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.CHAT = 'litchi:chat';
    CommandIDs.CONTEXTUAL = 'litchi:contextual';
    CommandIDs.HISTORICAL = 'litchi:historical';
    CommandIDs.SELECTED = 'litchi:selected';
    CommandIDs.CONTINUOUS = 'litchi:continuous';
    CommandIDs.TOGGLE_ROLE = 'litchi:show-roles-toggle';
    CommandIDs.TOGGLE_CONTINUOUS = 'litchi:continuous-toggle';
    CommandIDs.SPLIT_CELL = 'litchi:split-cell';
    CommandIDs.TRANSLATE = 'litchi:translate';
    CommandIDs.UNIT_TEST = 'litchi:unit-test';
})(CommandIDs || (CommandIDs = {}));
const LITCHI_MESSAGE_ROLE = 'litchi:message:role';
const LITCHI_TOOLBAR_FACTORY = 'litchi:toolbar-factory';


/***/ }),

/***/ "./lib/deepseek.js":
/*!*************************!*\
  !*** ./lib/deepseek.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deepseek: () => (/* binding */ deepseek)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "webpack/sharing/consume/default/axios/axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

var deepseek;
(function (deepseek) {
    function createProvider(options) {
        return new Provider(options);
    }
    deepseek.createProvider = createProvider;
    class Provider {
        get listModelUrl() {
            return this._baseUrl + '/v1/api/models';
        }
        get chatUrl() {
            return this._baseUrl + '/api/chat';
        }
        chatRequest(model, messages) {
            return {
                url: this.chatUrl,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this._authKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    stream: false
                })
            };
        }
        constructor(options) {
            this._baseUrl = 'http://api.moonshot.cn';
            this._authKey = options.authKey;
            this._name = options.name;
        }
        async chat(session, message, model) {
            const messages = [...session, message];
            const resp = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.chatRequest(model, messages));
            try {
                const data = resp.data;
                console.log(data);
                if (data.choices !== undefined) {
                    const msgs = data.choices.map((c) => c.message);
                    if (msgs.length > 0) {
                        return msgs[0];
                    }
                }
            }
            catch (error) {
                console.error('Error sending request to server:', error);
                throw new Error('chat failed, maybe server gone or get a invalid response. Please check settings or explorer console if you are a developer');
            }
            console.error('message not success');
            return { content: '', role: 'assistant' };
        }
        async listModels() {
            return axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.listModelUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
                .then(resp => {
                if (resp.status !== (axios__WEBPACK_IMPORTED_MODULE_0___default().HttpStatusCode).Ok) {
                    throw new Error(`${this._name} error: list model request received error status: ${resp.statusText}`);
                }
                const text = resp.data.toString();
                const data = JSON.parse(text);
                return data['data'].map((m) => {
                    return m.id;
                });
            });
        }
    }
    deepseek.Provider = Provider;
})(deepseek || (deepseek = {}));


/***/ }),

/***/ "./lib/icons.js":
/*!**********************!*\
  !*** ./lib/icons.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   caIcon: () => (/* binding */ caIcon),
/* harmony export */   ccIcon: () => (/* binding */ ccIcon),
/* harmony export */   chIcon: () => (/* binding */ chIcon),
/* harmony export */   csIcon: () => (/* binding */ csIcon),
/* harmony export */   ctIcon: () => (/* binding */ ctIcon),
/* harmony export */   langIcon: () => (/* binding */ langIcon),
/* harmony export */   litchiIcon: () => (/* binding */ litchiIcon),
/* harmony export */   scIcon: () => (/* binding */ scIcon),
/* harmony export */   unitTestIcon: () => (/* binding */ unitTestIcon)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);

const litchiIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'litchi-icon',
    svgstr: '<svg width="200px" height="200px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">\n' +
        '  <ellipse cx="100" cy="100" rx="50" ry="40" fill="#FF6347" />\n' +
        '  <path d="M100,60 Q90,20 110,20 Q120,40 100,60" fill="#228B22" />\n' +
        '  <circle cx="70" cy="90" r="5" fill="#FFFFFF" />\n' +
        '  <circle cx="130" cy="90" r="5" fill="#FFFFFF" />\n' +
        '  <circle cx="90" cy="110" r="5" fill="#FFFFFF" />\n' +
        '  <circle cx="110" cy="110" r="5" fill="#FFFFFF" />\n' +
        '  <line x1="100" y1="140" x2="100" y2="160" stroke="#8B4513" stroke-width="2" />\n' +
        '</svg>'
});
const caIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'litchi-ca',
    svgstr: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
        '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">CA</text>\n' +
        '</svg>'
});
const chIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'litchi-ch',
    svgstr: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
        '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">CH</text>\n' +
        '</svg>'
});
const csIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'litchi-cs',
    svgstr: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
        '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">CS</text>\n' +
        '</svg>'
});
const ctIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'litchi-ct',
    svgstr: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
        '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">CT</text>\n' +
        '</svg>'
});
const ccIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'litchi-cc',
    svgstr: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
        '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">CC</text>\n' +
        '</svg>'
});
const scIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'litchi-sc',
    svgstr: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
        '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">SC</text>\n' +
        '</svg>'
});
function capitalizeFirstLetter(input) {
    if (input.length === 0) {
        return input;
    }
    if (input.length === 1) {
        return input.charAt(0).toUpperCase();
    }
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
function getLanguageAbbreviation(countryName) {
    const countryAbbreviations = {
        Chinese: 'Ch',
        English: 'En',
        French: 'Fr',
        German: 'De'
    };
    return (countryAbbreviations[countryName] || capitalizeFirstLetter(countryName));
}
const langIcon = (lang) => {
    const name = getLanguageAbbreviation(lang);
    return new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
        name: `litchi-${name}`,
        svgstr: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
            `    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">${name}</text>\n` +
            '</svg>'
    });
};
const unitTestIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'litchi-unit-test',
    svgstr: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
        '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">UT</text>\n' +
        '</svg>'
});


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
/* harmony import */ var _commons__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./commons */ "./lib/commons.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./api */ "./lib/api.js");
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
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./settings */ "./lib/settings.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./icons */ "./lib/icons.js");
/* harmony import */ var _templates__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./templates */ "./lib/templates.js");
/* harmony import */ var _markdown__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./markdown */ "./lib/markdown.js");
















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
    const model = new _model__WEBPACK_IMPORTED_MODULE_8__.Model(settingRegistry);
    const widget = new _toolbar__WEBPACK_IMPORTED_MODULE_9__.WidgetExtension(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_ID, app, settingRegistry, state, model);
    app.docRegistry.addWidgetExtension('Notebook', widget);
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.CHAT, {
        label: 'Litchi Chat',
        execute: async () => {
            await chatActivate(app, settingRegistry, tracker, model, state, 'chat');
        },
        icon: _icons__WEBPACK_IMPORTED_MODULE_10__.caIcon,
        isEnabled: () => model.enabled
    });
    palette.addItem({ command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.CHAT, category: 'jupyter-Litchi' });
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.CONTEXTUAL, {
        label: 'Litchi Chat Contextual',
        execute: async () => {
            await chatActivate(app, settingRegistry, tracker, model, state, 'contextual');
        },
        icon: _icons__WEBPACK_IMPORTED_MODULE_10__.ctIcon,
        isEnabled: () => model.enabled
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
        icon: _icons__WEBPACK_IMPORTED_MODULE_10__.chIcon,
        isEnabled: () => model.enabled
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
        icon: _icons__WEBPACK_IMPORTED_MODULE_10__.csIcon,
        isEnabled: () => model.enabled
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.SELECTED,
        category: 'jupyter-Litchi'
    });
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.CONTINUOUS, {
        label: 'Litchi Chat Continuous',
        execute: async () => {
            await chatActivate(app, settingRegistry, tracker, model, state, 'historical').then(() => {
                // markup if not in continuous mode
                if (!model.continuous) {
                    app.commands.execute('notebook:insert-cell-below').then(() => {
                        app.commands.execute('notebook:change-cell-to-markdown');
                    });
                }
            });
        },
        icon: _icons__WEBPACK_IMPORTED_MODULE_10__.litchiIcon,
        isEnabled: () => model.enabled,
        isVisible: () => {
            const cell = tracker.activeCell;
            if (cell === null) {
                return false;
            }
            return cell.model.sharedModel.cell_type === 'markdown';
        }
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.CONTINUOUS,
        category: 'jupyter-Litchi'
    });
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.SPLIT_CELL, {
        label: 'Litchi Split Cell',
        execute: async () => {
            await splitCell(app, settingRegistry, tracker);
        },
        icon: _icons__WEBPACK_IMPORTED_MODULE_10__.scIcon,
        isEnabled: () => model.enabled,
        isVisible: () => {
            const current = tracker.activeCell;
            return (current === null || current === void 0 ? void 0 : current.model.sharedModel.cell_type) === 'markdown';
        }
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.SPLIT_CELL,
        category: 'jupyter-Litchi'
    });
    const default_languages = ['Chinese', 'English'];
    const trans = async (args) => {
        const language = args.language.toString();
        const t = (0,_templates__WEBPACK_IMPORTED_MODULE_11__.translate)(language);
        await t(app, tracker, settingRegistry, model, state, language)
            .catch(_api__WEBPACK_IMPORTED_MODULE_12__.alert)
            .finally(() => {
            model.processing = false;
        });
    };
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.TRANSLATE, {
        label: args => `Litchi Translate To ${args.language}`,
        icon: args => { var _a; return (0,_icons__WEBPACK_IMPORTED_MODULE_10__.langIcon)(((_a = args.language) === null || _a === void 0 ? void 0 : _a.toString()) || 'Unknown'); },
        execute: async (args) => trans(args),
        isEnabled: () => !model.processing,
        isVisible: () => {
            var _a;
            const doctype = (_a = tracker.activeCell) === null || _a === void 0 ? void 0 : _a.model.type;
            return doctype === 'markdown' || doctype === 'raw';
        }
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.TRANSLATE,
        category: 'jupyter-Litchi',
        args: { language: 'English' }
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.TRANSLATE,
        category: 'jupyter-Litchi',
        args: { language: 'Chinese' }
    });
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.UNIT_TEST, {
        label: args => 'Litchi Create Unit Test',
        icon: _icons__WEBPACK_IMPORTED_MODULE_10__.unitTestIcon,
        execute: async (args) => {
            var _a;
            const cell = tracker.activeCell;
            if (cell.model.type !== 'code') {
                const message = 'Unit Test only for Code Cell';
                console.error(message);
                throw new Error(message);
            }
            let lang = 'Python';
            const mimeType = (_a = cell.editor) === null || _a === void 0 ? void 0 : _a.model.mimeType;
            if (mimeType) {
                lang = langInMime(mimeType);
            }
            const func = (0,_templates__WEBPACK_IMPORTED_MODULE_11__.unitTest)(lang);
            await func(app, tracker, settingRegistry, model, state, lang).finally(() => (model.processing = false));
        },
        isEnabled: () => !model.processing,
        isVisible: () => {
            var _a;
            const doctype = (_a = tracker.activeCell) === null || _a === void 0 ? void 0 : _a.model.type;
            return doctype === 'code';
        }
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.UNIT_TEST,
        category: 'jupyter-Litchi'
    });
    model.stateChanged.connect(m => {
        refreshPage(tracker, m.showRoles);
        settingRegistry.get(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_ID, 'continuous-mode').then(continuous => {
            if (continuous.composite !== model.continuous) {
                console.log(`continuous mode: ${continuous.composite} and model.continuous: ${model.continuous}`);
                settingRegistry
                    .set(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_ID, 'continuous-mode', model.continuous)
                    .then(() => {
                    console.log('Continuous mode changed.');
                });
            }
        });
        settingRegistry.get(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_ID, 'providers').then(providers => {
            const ps = providers.composite.map(p => p);
            const str = JSON.stringify(m.providers);
            const data = JSON.parse(str);
            if (ps !== data) {
                settingRegistry
                    .set(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_ID, 'providers', data)
                    .then(() => {
                    console.log('Providers settings changed.');
                })
                    .catch(err => {
                    console.error(err);
                });
            }
        });
    });
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.TOGGLE_ROLE, {
        label: 'Litchi Show Roles Toggle',
        execute: async () => {
            model.showRoles = !model.showRoles;
        },
        isToggled: () => model.showRoles,
        isEnabled: () => !model.processing
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.TOGGLE_ROLE,
        category: 'jupyter-Litchi'
    });
    app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.TOGGLE_CONTINUOUS, {
        label: 'Litchi Continuous Mode',
        execute: async () => {
            model.continuous = !model.continuous;
        },
        isToggled: () => model.continuous
    });
    palette.addItem({
        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.TOGGLE_CONTINUOUS,
        category: 'jupyter-Litchi'
    });
    app.restored.then(() => {
        if (formRendererRegistry) {
            (0,_settings__WEBPACK_IMPORTED_MODULE_13__.renderer)(settingRegistry, formRendererRegistry, translator, model);
        }
        else {
            console.log('form rendererResgistry not activated');
        }
        settingRegistry.get(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_ID, 'translators').then(trans => {
            const items = trans.composite || [];
            for (const idx in items) {
                const lang = items[idx].toString();
                if (!default_languages.includes(lang)) {
                    palette.addItem({
                        command: _constants__WEBPACK_IMPORTED_MODULE_7__.CommandIDs.TRANSLATE,
                        category: 'jupyter-Litchi',
                        args: { language: lang }
                    });
                }
            }
        });
    });
}
async function chatActivate(app, registry, tracker, model, state, subTask) {
    var _a, _b;
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
            const message = 'litchi:chat exit because the content of cell is null';
            (0,_api__WEBPACK_IMPORTED_MODULE_12__.alert)(message);
            return;
        }
        const latest = cellToMessage(cell.model);
        const aiModel = (_b = (await state.fetch('litchi:model'))) === null || _b === void 0 ? void 0 : _b.toString();
        if (aiModel === null || aiModel === undefined) {
            const message = 'litchi:chat exit because not any model selected';
            (0,_api__WEBPACK_IMPORTED_MODULE_12__.alert)(message);
            return;
        }
        const settings = await registry.load(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_ID);
        const session = [
            await _commons__WEBPACK_IMPORTED_MODULE_14__.Message.startUp(settings),
            ...createContext(subTask, notebook)
        ];
        const provider = model.provider;
        const reply = await provider.chat(session, latest, aiModel).catch(_api__WEBPACK_IMPORTED_MODULE_12__.alert);
        const message = reply;
        if (message.content !== undefined && message.content.length > 0) {
            const cellModel = new _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_2__.MarkdownCellModel();
            cellModel.sharedModel.setSource(message.content);
            cellModel.sharedModel.setMetadata(_constants__WEBPACK_IMPORTED_MODULE_7__.LITCHI_MESSAGE_ROLE, message.role);
        }
        else {
            if (message.content === '') {
                console.log('ignored empty message');
                return;
            }
            console.error(`get a invalid message ${message}`);
            (0,_api__WEBPACK_IMPORTED_MODULE_12__.alert)('Message is invalid. Please check the settings and the model selected. Or check the explorer console if you are a developer.');
            return;
        }
        const { commands } = app;
        commands
            .execute('notebook:insert-cell-below')
            .then(() => {
            commands.execute('notebook:change-cell-to-markdown');
        })
            .then(() => {
            if (model.continuous) {
                commands.execute('notebook:insert-cell-below').then(() => {
                    commands.execute('notebook:change-cell-to-markdown');
                });
            }
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
    return new _commons__WEBPACK_IMPORTED_MODULE_14__.Message(role, content);
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
async function splitCell(app, registry, tracker) {
    const origin = tracker.activeCell;
    if (origin === null) {
        console.error('litchi:split-cell exit because any cell not been selected');
        return;
    }
    const content = origin.model.sharedModel.source;
    const segments = (0,_markdown__WEBPACK_IMPORTED_MODULE_15__.to_segments)(content);
    for (const idx in segments) {
        const segment = segments[idx];
        await app.commands.execute('notebook:insert-cell-below').then(() => {
            if (segment.category === 'markdown') {
                app.commands.execute('notebook:change-cell-to-markdown');
            }
        });
        const cell = tracker.activeCell;
        cell === null || cell === void 0 ? void 0 : cell.model.sharedModel.setSource(segment.content);
        if (segment.category === 'code') {
            cell === null || cell === void 0 ? void 0 : cell.model.sharedModel.setMetadata('language', segment.language);
        }
    }
    origin.activate();
    await app.commands.execute('notebook:delete-cell');
}
/**
 * Export the plugin as default.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);
function langInMime(mime) {
    const token = mime.replace('text/x-', '');
    switch (token) {
        case 'ipython':
            return 'python';
        default:
            return token;
    }
}


/***/ }),

/***/ "./lib/kimi.js":
/*!*********************!*\
  !*** ./lib/kimi.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   kimi: () => (/* binding */ kimi)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "webpack/sharing/consume/default/axios/axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

var kimi;
(function (kimi) {
    function createProvider(options) {
        return new Provider(options);
    }
    kimi.createProvider = createProvider;
    class Provider {
        get listModelUrl() {
            return this._baseUrl + '/api/models';
        }
        get chatUrl() {
            return this._baseUrl + '/api/chat/completions';
        }
        chatRequest(model, messages) {
            return {
                url: this.chatUrl,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this._authKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    stream: false
                })
            };
        }
        constructor(options) {
            this._baseUrl = 'https://api.moonshot.cn/v1';
            this._authKey = options.authKey;
            this._name = options.name;
        }
        async chat(session, message, model) {
            const messages = [...session, message];
            const resp = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.chatRequest(model, messages));
            try {
                const data = resp.data;
                console.log(data);
                if (data.choices !== undefined) {
                    const msgs = data.choices.map((c) => c.message);
                    if (msgs.length > 0) {
                        return msgs[0];
                    }
                }
            }
            catch (error) {
                console.error('Error sending request to server:', error);
                throw new Error('chat failed, maybe server gone or get a invalid response. Please check settings or explorer console if you are a developer');
            }
            console.error('message not success');
            return { content: '', role: 'assistant' };
        }
        async listModels() {
            return axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.listModelUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${this._authKey}`
                }
            })
                .then(resp => {
                if (resp.status !== (axios__WEBPACK_IMPORTED_MODULE_0___default().HttpStatusCode).Ok) {
                    throw new Error(`${this._name} error: list model request received error status: ${resp.statusText}`);
                }
                const text = resp.data.toString();
                const data = JSON.parse(text);
                return data['data'].map((m) => {
                    return m.id;
                });
            });
        }
    }
    kimi.Provider = Provider;
})(kimi || (kimi = {}));


/***/ }),

/***/ "./lib/markdown.js":
/*!*************************!*\
  !*** ./lib/markdown.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   to_segments: () => (/* binding */ to_segments)
/* harmony export */ });
class Fragment {
    constructor(category, language) {
        this._lines = [];
        this._category = category;
        this._language = language;
    }
    add(line) {
        this._lines.push(line);
    }
    get category() {
        return this._category;
    }
    get language() {
        return this._language;
    }
    static createByHead(headline) {
        if (headline.trim().startsWith('```')) {
            return new Code(headline);
        }
        else {
            return new Segment(headline);
        }
    }
    get content() {
        return this._lines.join('\n');
    }
}
class Segment extends Fragment {
    constructor(head) {
        super('markdown', 'markdown');
        this.inMermaid = false;
        if (head !== undefined) {
            this.add(head);
        }
    }
    tryLine(l) {
        const line = l.trim();
        if (line.startsWith('```')) {
            // in mermaid
            if (line.startsWith('```mermaid') && !this.inMermaid) {
                this.inMermaid = true;
                this.add(line);
                return 'markdown';
            }
            // out mermaid
            if (line === '```' && this.inMermaid) {
                this.inMermaid = false;
                this.add(line);
                return 'markdown';
            }
            // else redirect to code
            return 'code';
        }
        else {
            this.add(line);
            return 'markdown';
        }
    }
}
class Code extends Fragment {
    constructor(head) {
        const language = head.substring(3);
        super('code', language);
        this.deep = 0;
    }
    tryLine(line) {
        if (line.trim() === '```') {
            // popup recursive code block stack
            if (this.deep === 0) {
                return 'end';
            }
            else {
                this.deep -= 1;
                this.add(line);
                return 'code';
            }
        }
        else {
            this.add(line);
            if (line.startsWith('```')) {
                // push recursive code block stack
                this.deep += 1;
            }
            return 'code';
        }
    }
}
class LitchiDocument {
    get segments() {
        return this._segments;
    }
    constructor() {
        this._segments = [];
    }
    add(line) {
        let latest;
        if (this._segments.length === 0) {
            latest = Fragment.createByHead(line);
            this._segments.push(latest);
        }
        else {
            latest = this._segments[this._segments.length - 1];
            const tryIt = latest.tryLine(line);
            if (tryIt !== latest.category) {
                // skip try line
                if (tryIt === 'end') {
                    latest = new Segment(undefined);
                    this._segments.push(latest);
                }
                else {
                    latest = Fragment.createByHead(line);
                    this._segments.push(latest);
                }
            }
        }
    }
}
function to_segments(markdown) {
    const doc = new LitchiDocument();
    const lines = markdown.split('\n');
    for (const idx in lines) {
        doc.add(lines[idx]);
    }
    return doc.segments;
}


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
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./lib/constants.js");


class Model extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.VDomModel {
    constructor(settingsRegistry) {
        super();
        this._showRoles = false;
        this._processing = false;
        this._idle = true;
        this._providers = [];
        settingsRegistry.load(_constants__WEBPACK_IMPORTED_MODULE_1__.LITCHI_ID).then(settings => {
            this.continuous = settings.get('continuous-mode').composite;
            const ps = settings.get('providers')
                .composite;
            this._providers = ps;
            return ps;
        });
        this._continuous = false;
        this._provider = undefined;
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
    get continuous() {
        return this._continuous;
    }
    set continuous(value) {
        this._continuous = value;
    }
    get processing() {
        return this._processing;
    }
    set processing(value) {
        this._processing = value;
        this.stateChanged.emit();
    }
    get enabled() {
        return !this.processing && this.provider !== undefined;
    }
    get idle() {
        return this._idle;
    }
    get provider() {
        return this._provider;
    }
    set provider(value) {
        this._provider = value;
    }
    get providers() {
        return this._providers;
    }
    set providers(value) {
        this._providers = value;
    }
    removeProvider(index) {
        return this._providers.splice(index, 1);
    }
    addProviders(provider) {
        this._providers = [...this.providers, provider];
    }
}


/***/ }),

/***/ "./lib/ollama.js":
/*!***********************!*\
  !*** ./lib/ollama.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ollama: () => (/* binding */ ollama)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "webpack/sharing/consume/default/axios/axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

var ollama;
(function (ollama) {
    function createProvider(options) {
        return new Provider(options);
    }
    ollama.createProvider = createProvider;
    class Provider {
        get listModelUrl() {
            return this._baseUrl + '/api/tags';
        }
        get chatUrl() {
            return this._baseUrl + '/api/chat';
        }
        chatRequest(model, messages) {
            return {
                url: this.chatUrl,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    stream: false
                })
            };
        }
        constructor(options) {
            this._baseUrl = options.baseUrl;
            this._name = options.name;
        }
        async chat(session, message, model) {
            const messages = [...session, message];
            const resp = await axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.chatRequest(model, messages));
            try {
                const data = resp.data;
                console.log(data);
                if (data.message !== undefined) {
                    return data.message;
                }
            }
            catch (error) {
                console.error('Error sending request to server:', error);
                throw new Error('chat failed, maybe server gone or get a invalid response. Please check settings or explorer console if you are a developer');
            }
            console.error('message not success');
            return { content: '', role: 'assistant' };
        }
        async listModels() {
            return axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.listModelUrl).then(resp => {
                if (resp.status !== (axios__WEBPACK_IMPORTED_MODULE_0___default().HttpStatusCode).Ok) {
                    throw new Error(`${this._name} error: list model request received error status: ${resp.statusText}`);
                }
                const data = resp.data;
                return data['models'].map((m) => {
                    return m.name;
                });
            });
        }
    }
    ollama.Provider = Provider;
})(ollama || (ollama = {}));


/***/ }),

/***/ "./lib/settings.js":
/*!*************************!*\
  !*** ./lib/settings.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderProvidersPanel: () => (/* binding */ renderProvidersPanel),
/* harmony export */   renderSelected: () => (/* binding */ renderSelected),
/* harmony export */   renderSystemPrompt: () => (/* binding */ renderSystemPrompt),
/* harmony export */   renderer: () => (/* binding */ renderer)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./lib/constants.js");



function renderer(settingRegistry, formRegistry, translator, model) {
    const systemPromptRenderer = {
        fieldRenderer: props => {
            return renderSystemPrompt(props);
        }
    };
    formRegistry.addRenderer(`${_constants__WEBPACK_IMPORTED_MODULE_2__.LITCHI_ID}.system`, systemPromptRenderer);
    const providersRenderer = {
        fieldRenderer: props => {
            return renderProvidersPanel(props, model);
        }
    };
    formRegistry.addRenderer(`${_constants__WEBPACK_IMPORTED_MODULE_2__.LITCHI_ID}.providers`, providersRenderer);
    const selectedRenderer = {
        fieldRenderer: props => {
            return renderSelected(props);
        }
    };
    formRegistry.addRenderer(`${_constants__WEBPACK_IMPORTED_MODULE_2__.LITCHI_ID}.selected`, selectedRenderer);
}
/**
 * System Prompt renderer.
 */
function renderSystemPrompt(props) {
    const { schema } = props;
    const title = schema.title;
    const settings = props.formContext.settings;
    const settingData = settings.get('system').composite.toString();
    const [system, setSystem] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(settingData);
    const onSettingChange = (e) => {
        const value = e.target.value;
        settings.set('system', value).catch(console.error);
        setSystem(value);
    };
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("fieldset", null,
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("h3", null, title),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { key: "system", className: "form-group large-field" },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "inputFieldWrapper" },
                        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("textarea", { className: "form-control jp-InputArea-editor", value: system, onChange: onSettingChange })))))));
}
/**
 * Provider Selected Renderer.
 */
function renderSelected(props) {
    const { schema } = props;
    const title = schema.title;
    const desc = schema.description;
    const settings = props.formContext.settings;
    // const settingData: IProvider | undefined = settings.get('selected')
    //   .composite as unknown as IProvider;
    const [selected, setSelected] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('Ollama');
    const providers = settings.get('providers')
        .composite;
    const onProviderSelected = (e) => {
        const value = e.target.value;
        setSelected(value);
        settings.set('selected', selected).catch(console.error);
    };
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("fieldset", null,
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("legend", null, title),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", { className: "field-description" }, desc),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { key: "system", className: "form-group large-field" },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "inputFieldWrapper" },
                        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("select", { id: "provider-select", value: selected, onChange: onProviderSelected, className: "jp-ToolbarButtonComponent" }, providers.map((item, index) => {
                            const name = item.name;
                            return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("option", { key: name, value: index }, name));
                        }))))))));
}
/**
 * Provider Settings Panel.
 */
function renderProvidersPanel(props, model) {
    const { schema } = props;
    const title = schema.title;
    const desc = schema.description;
    const settings = props.formContext.settings;
    const providers = settings.get('providers')
        .composite;
    const [ps, setPs] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(providers);
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("fieldset", null,
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("legend", null, title),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", { className: "field-description" }, desc),
            ps.map((provider, idx) => {
                const onDelete = (e) => {
                    model.removeProvider(idx);
                    setPs(model.providers);
                    console.log(`provider ${idx} deleted`);
                    model.stateChanged.emit();
                };
                const onChange = (e) => {
                    console.log(`provider ${idx} updated`);
                    setPs(e.target.value);
                };
                return settingsForm(idx, provider, onChange, onDelete);
            }))));
}
function settingsForm(index, options, onChange, onDelete) {
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "field-group" },
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("legend", null,
            options.name,
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", { className: "outer", onClick: onDelete },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", { className: "inner" },
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.deleteIcon.react, { tag: "span", left: "7px", bottom: "5px" })))),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", { className: "field-description" },
            "[",
            index,
            "]-",
            options.category),
        settingsItem(index, options, onChange)));
}
function settingsItem(index, options, onChange) {
    const category = options.category;
    switch (category) {
        case 'kimi':
            return authKeySettings(index, options, onChange);
        case 'openai':
            return authKeySettings(index, options, onChange);
        case 'deepseek':
            return authKeySettings(index, options, onChange);
        case 'ollama':
            return ollamaSettings(index, options, onChange);
        default:
            return react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", null, "Unsupported category");
    }
}
function ollamaSettings(index, options, onChange) {
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("fieldset", null,
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "form-group small-field", key: "name" },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "jp-FormGroup-content jp-FormGroup-contentNormal" },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", { className: "jp-FormGroup-fieldLabel jp-FormGroup-contentItem inputFieldWrapper jp-FormGroup-content jp-FormGroup-contentNormal" }, "Name:"),
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "jp-inputFieldWrapper jp-FormGroup-contentItem" },
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", { className: "form-control", type: "text", name: "name", value: options.name, onChange: onChange, required: true })))),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "form-group large-field", key: "baseUrl" },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "jp-FormGroup-content jp-FormGroup-contentNormal" },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", { className: "jp-FormGroup-fieldLabel jp-FormGroup-contentItem inputFieldWrapper jp-FormGroup-content jp-FormGroup-contentNormal" }, "Base URL:"),
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "jp-inputFieldWrapper jp-FormGroup-contentItem" },
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", { className: "form-control", type: "text", name: "baseUrl", onChange: onChange, value: options.baseUrl, required: true }))))));
}
function authKeySettings(index, options, onChange) {
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("fieldset", null,
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "form-group small-field", key: "name" },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "jp-FormGroup-content jp-FormGroup-contentNormal" },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", { className: "jp-FormGroup-fieldLabel jp-FormGroup-contentItem" }, "Name:"),
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "jp-inputFieldWrapper jp-FormGroup-contentItem" },
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", { className: "form-control", type: "text", name: "name", value: options.name, required: true })))),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "form-group large-field", key: "authKey" },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "form-group small-field" },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", { className: "jp-FormGroup-fieldLabel jp-FormGroup-contentItem inputFieldWrapper jp-FormGroup-content jp-FormGroup-contentNormal" },
                    options.category,
                    " Key:"),
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "jp-inputFieldWrapper jp-FormGroup-contentItem" },
                    react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", { className: "form-control", type: "text", name: "authorizationKey", onChange: onChange, value: options.authKey, required: true }))))));
}


/***/ }),

/***/ "./lib/templates.js":
/*!**************************!*\
  !*** ./lib/templates.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   chat_by_cell: () => (/* binding */ chat_by_cell),
/* harmony export */   translate: () => (/* binding */ translate),
/* harmony export */   unitTest: () => (/* binding */ unitTest)
/* harmony export */ });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ "./lib/api.js");
/* harmony import */ var _commons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./commons */ "./lib/commons.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./lib/constants.js");
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/cells */ "webpack/sharing/consume/default/@jupyterlab/cells");
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0__);




function quote(text) {
    return text.replace(/^('```')/g, '\\`\\`\\`');
}
function chat_by_cell(jobName, template, types) {
    return async (app, tracker, registry, model, state, dest) => {
        var _a, _b, _c, _d;
        const notebook = (_a = tracker.currentWidget) === null || _a === void 0 ? void 0 : _a.content;
        const source = notebook === null || notebook === void 0 ? void 0 : notebook.activeCell;
        if (source === null) {
            const message = 'Translate command need a markdown cell is selected';
            console.error(message);
            throw new Error(message);
        }
        if (!types.includes(source.model.type)) {
            const message = `${jobName} command only support ${types} cell`;
            console.error(message);
            throw new Error(message);
        }
        const text = source.model.sharedModel.source;
        const quoted = quote(text);
        const prompt = template.replace('${text}', quoted);
        const aiModel = (_b = (await state.fetch('litchi:model'))) === null || _b === void 0 ? void 0 : _b.toString();
        if (aiModel === null || aiModel === undefined) {
            const message = 'litchi:chat exit because not any model selected';
            (0,_api__WEBPACK_IMPORTED_MODULE_1__.alert)(message);
            return;
        }
        const settings = await registry.load(_constants__WEBPACK_IMPORTED_MODULE_2__.LITCHI_ID);
        const session = [await _commons__WEBPACK_IMPORTED_MODULE_3__.Message.startUp(settings)];
        const request = new _commons__WEBPACK_IMPORTED_MODULE_3__.Message('user', prompt);
        const url = settings.get('chat').composite.toString();
        const key = (_d = (_c = settings.get('key')) === null || _c === void 0 ? void 0 : _c.composite) === null || _d === void 0 ? void 0 : _d.toString();
        model.processing = true;
        const response = await (0,_api__WEBPACK_IMPORTED_MODULE_1__.chat)(url, key, session, request, aiModel).catch(_api__WEBPACK_IMPORTED_MODULE_1__.alert);
        if (response.content !== undefined && response.content.length > 0) {
            const cellModel = new _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0__.MarkdownCellModel();
            cellModel.sharedModel.setSource(response.content);
            cellModel.sharedModel.setMetadata(_constants__WEBPACK_IMPORTED_MODULE_2__.LITCHI_MESSAGE_ROLE, response.role);
        }
        else {
            console.error(`get a invalid message ${response}`);
            (0,_api__WEBPACK_IMPORTED_MODULE_1__.alert)('Message is invalid. Please check the settings and the model selected. Or check the explorer console if you are a developer.');
            return;
        }
        const { commands } = app;
        commands.execute('notebook:insert-cell-below').then(() => {
            commands.execute('notebook:change-cell-to-markdown');
        });
        const newCell = notebook.activeCell;
        const newModel = newCell.model.sharedModel;
        newModel.setSource(response.content);
        newModel.setMetadata(_constants__WEBPACK_IMPORTED_MODULE_2__.LITCHI_MESSAGE_ROLE, response.role);
    };
}
function translate(lang) {
    return chat_by_cell(`Translate To ${lang}`, `# Translate To ${lang}\n` +
        `Translate text below to ${lang}\n` +
        '```\n' +
        '${text}\n' +
        '```\n', ['markdown', 'raw']);
}
function unitTest(lang) {
    return chat_by_cell('Unit Test', '# Create Unit Test\n' +
        `Create ${lang} Unit Test for the code below to \n` +
        '```\n' +
        '${text}\n' +
        '```\n', ['code']);
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
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./icons */ "./lib/icons.js");





function ModelsComponent(props) {
    const [models, setModels] = react__WEBPACK_IMPORTED_MODULE_2__.useState([]);
    const [selectedModel, setSelectedModel] = react__WEBPACK_IMPORTED_MODULE_2__.useState('');
    const [enabled, setEnabled] = react__WEBPACK_IMPORTED_MODULE_2__.useState(props.model.processing);
    react__WEBPACK_IMPORTED_MODULE_2__.useEffect(() => {
        async function loadModels() {
            var _a;
            try {
                const settings = await props.registry.load(props.appId);
                // const pvd = provider(settings);
                // const modelList = await pvd.listModels();
                const baseUrl = settings.get('list-models').composite.toString();
                const key = (_a = settings.get('key').composite) === null || _a === void 0 ? void 0 : _a.toString();
                const modelList = await (0,_api__WEBPACK_IMPORTED_MODULE_3__.listModels)(baseUrl, key).catch(alert);
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
            setEnabled(m.enabled);
        });
    }, [props.model]);
    const handleChange = async (event) => {
        const m = event.target.value;
        await props.state.save('litchi:model', m);
        setSelectedModel(m);
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
    return (react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", null,
        react__WEBPACK_IMPORTED_MODULE_2__.createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.ToolbarButtonComponent, { icon: _icons__WEBPACK_IMPORTED_MODULE_4__.caIcon, onClick: handleChatClick, enabled: !enabled, tooltip: "Chat" }),
        react__WEBPACK_IMPORTED_MODULE_2__.createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.ToolbarButtonComponent, { icon: _icons__WEBPACK_IMPORTED_MODULE_4__.chIcon, onClick: handleHistoricalClick, enabled: !enabled, tooltip: "Chat With Historical" }),
        react__WEBPACK_IMPORTED_MODULE_2__.createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.ToolbarButtonComponent, { icon: _icons__WEBPACK_IMPORTED_MODULE_4__.ctIcon, onClick: handleContextualClick, enabled: !enabled, tooltip: "Chat With Contextual" }),
        react__WEBPACK_IMPORTED_MODULE_2__.createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.ToolbarButtonComponent, { icon: _icons__WEBPACK_IMPORTED_MODULE_4__.csIcon, onClick: handleSelectedClick, enabled: !enabled, tooltip: "Chat With Selected" }),
        react__WEBPACK_IMPORTED_MODULE_2__.createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.ToolbarButtonComponent, { icon: _icons__WEBPACK_IMPORTED_MODULE_4__.ccIcon, onClick: handleSelectedClick, enabled: !enabled, tooltip: "Chat Continuous" }),
        react__WEBPACK_IMPORTED_MODULE_2__.createElement("span", null,
            react__WEBPACK_IMPORTED_MODULE_2__.createElement("label", { htmlFor: "model-select", className: "jp-ToolbarButtonComponent" },
                "Select Model:",
                ' '),
            react__WEBPACK_IMPORTED_MODULE_2__.createElement("select", { id: "model-select", value: selectedModel, onChange: handleChange, disabled: enabled, className: "jp-ToolbarButtonComponent" }, models.map(model => (react__WEBPACK_IMPORTED_MODULE_2__.createElement("option", { key: model, value: model }, model)))))));
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
        const widget = new WidgetExtension(this.appId, this.app, this.registry, this.state, this.model);
        widget.addClass('jp-DefaultStyle');
        this.addClass('jp-litchi-toolbar');
        panel.toolbar.addItem('litchi:space', _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.Toolbar.createSpacerItem());
        panel.toolbar.addItem('litchi:model-list', widget);
        return new _lumino_disposable__WEBPACK_IMPORTED_MODULE_0__.DisposableDelegate(() => {
            this.dispose();
        });
    }
}


/***/ })

}]);
//# sourceMappingURL=lib_index_js.4d49c3ac380f945e3c95.js.map