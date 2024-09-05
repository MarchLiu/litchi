# litchi

[![Github Actions Status](https://github.com/MarchLiu/litchi/workflows/Build/badge.svg)](https://github.com/MarchLiu/litchi/actions/workflows/build.yml)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/MarchLiu/litchi/main?urlpath=lab)


Litchi is a ai client for jupyter lab

## Requirements

- JupyterLab >= 4.0.0
- Ollama at http://localhost:11434
- nodejs 20
- yarn

# Install

To install the extension, execute:

```bash
jupyter labextension install jupyter-litchi
```

## Uninstall

To remove the extension, execute:

```bash
jupyter labextension uninstall jupyter-litchi
```

### Alter

The commands `jupyter labextension install/uninstall` are deprecated. The official document 
recommend use pip. But I can' do it. Install by jupyter's labextension
command is only right way at today. I will try to build a right version install from pypi
in the future.

## How to use it

After install success. Just start `jupyter lab` in your computer and create a notebook.

You can see the toolbar in jupyterlab notebook:

![Loaded](https://github.com/MarchLiu/litchi/raw/main/doc/images/loaded.png)

Now, we can write content and choice a model from model list in toolbar.

![Loaded](https://github.com/MarchLiu/litchi/raw/main/doc/images/chat.png)

And then use command palette or click the "send activate cell" button

Wait a moment. The replay will place into a new cell below current.

![Loaded](https://github.com/MarchLiu/litchi/raw/main/doc/images/replay.png)

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the litchi directory
# Install package in development mode
pip install -e "."
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall jupyter-litchi
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `litchi` within that folder.

### Testing the extension

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev/docs/intro) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md)

## What's new

### 0.1.1

* rename project as `jupyter-litchi`

### 0.1.0

* chat with ollama in localhost:11434
* select model in list

### 0.1.3

* installer fixed 

### 0.1.4

* add settings

### 0.2.0

* Add clean command for clean session
* Settings for list model api and chat api. Litchi could connect any openai api

### 0.3.0

I remove the implicit session of chat. Now we use notebook as chat session.

- command `Litchi Chat` just send current cell content and reply into below
- command `Litchi Contextual` set current cell content, and with every message above activated cell
- command `Litchi Historical` set current cell content, and with all cells of above

Very message send or received will marked their 'role' into metadata of the cell.

As command `Litchi Contextual`, the messages only include the cells were marked.

If we want to see the cells role information, could use command `Litchi Show Roles Toggle`.


### 0.3.1

- Modify the "send activate cell" button to three: Chat, Contextual, Historical.
- Add `Litchi Chat Selected` command 

### 0.3.2

- Show message's role by prompt  

### 0.3.4

- disable toolbar when litchi is waiting response.
- bugs fixed

## About Me

My name is Liu Xin, and my English name is Mars Liu and previously used March Liu. I translated the Python
2.2/2.3/2.4/2.5/2.7 Tutorial under this pseudonym.

In recent years, I published a book titled "Construction and Implementation of Micro Lisp Interpreter", which is based
on my Jaskell Core library ([https://github.com/MarchLiu/jaskell-core](https://github.com/MarchLiu/jaskell-core)). The
book introduces some knowledge about interpreter development.

I am one of the earliest users in both the Python Chinese Community and PostgreSQL Chinese Community. At QCon, I
demonstrated a neural network algorithm implemented using SQL CTE
syntax: [SQL CTE](https://github.com/MarchLiu/qcon2019shanghai/tree/master/sql-cte).

## Donate

Your sponsorship will contribute to the healthy growth of this project.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/paypalme/marsliuzero)