# Thyme connect

Thin layer which allows communication between Thyme and external scripts.

## Installation

```
npm install thyme-connect
```

or

```
yarn add thyme-connect
```

## Usage in plugins

```jsx harmony
const { registerComponent } = require('thyme-connect');

// or

import { registerComponent } from 'thyme-connect';

registerComponent('timesheet.beforeTable', 'myComponent', () => <MyComponent />);
```

## Available registrations (for external scripts)

### `registerComponent(path: string, key: string. render: (...any) => React.Node)`

Provide path you want to inject your component, the key used in React, and a render prop.

A full list of injectable paths is available in the [developer's documentation of Thyme](https://usethyme.com/documentation).

- `path: string` Path to the location you want the component to be injected.
- `key: string` The value which gets passed as the `key` property of the rendered component.
- `render: (...any) => React.Node` A render prop which can receive arguments based on the location you're injecting to. It's a callback function which requires a `React.Node` to be returned. 

Example

```jsx harmony
registerComponent(
  'timesheet.beforeTable', 
  'myComponent', 
  () => <MyComponent />,
);
```

### `registerSettingsPanel(panel: SettingsPanel)`

Register an extra settings panel to be used on the settings page. Will be added to the bottom of the list.

SettingsPanel has the following shape:

```flow js
type SettingsPanel = {
  name: string;
  url: string;
  content: React.Node;
};
```

- `panel: SettingsPanel` An object containing the settings panel settings.
    - `name: string`: Name to be displayed on the settings panel.
    - `url: string`: Piece of the URL which is appended to `/settings/` when you navigate to this panel.
    - `content: React.Node`: The React Node to be rendered inside of the panel.
    
Example

```jsx harmony
registerSettingsPanel({
    url: 'secret-settings',
    name: 'Secret Settings',
    content: () => <SecretSettingsPanel />,
});
```

### `registerColumn(path: string, column: TableColumn)`

Register a table column to be injected in a table of choice. A full list of injectable paths is available in the [developer's documentation of Thyme](https://usethyme.com/documentation).

TableColumn has the following shape:

```flow js
type TableColumn = {
  name: string;
  row: (...any) => React.Node;
  header?: (...any) => React.Node;
  footer?: (...any) => React.Node;
  textAlign?: 'left' | 'right';
  width?: number;
  style?: any;
};
```

- `path: string`: Path to the location you want the table cell to be injected.
- `column: TableColumn` An object containing the settings panel settings.
    - `name: string`: Name of the column, will be added to the column filters of the table.
    - `row: (...any) => React.Node | string`: Render prop for rendering a row in the table. Gets arguments based on the table you're registering to. Returns a `React.Node` or `string`.
    - `header?: (...any) => React.Node | string`: *Optional* Render prop for rendering the header row of the registered column. Gets arguments based on the table you're registering to. Returns a `React.Node` or `string`.
    - `footer?: (...any) => React.Node | string`: *Optional* Render prop for rendering the footer row of the registered column. Gets arguments based on the table you're registering to. Returns a `React.Node` or `string`.
    - `textAlign?: 'left' | 'right'`: *Optional* Set the alignment of the content of the column, header, and footer. Default: `'left'`.
    - `width?: number`: *Optional* Set the width the column. [Read more about column width in the Semantic UI docs](https://react.semantic-ui.com/collections/table/#variations-column-width).
    - `style?: any` *Optional* Pass an object containing styles to be applied to the column, header, and footer.

Example

```jsx harmony
registerColumn('reports', {
  name: 'Total price',
  header: () => 'Total price',
  footer: (...props) => <ReportTableTotal {...props} />,
  row: (...props) => <ReportTableRow {...props} />,
  textAlign: 'right',
  width: 2,
  style: { 
    whiteSpace: 'no-wrap',
  },
});
```

### `registerReducer(path: string, reducers: Reducers, store: ?Store<any>)`

Allows you to add reducers on top of existing ones. A full list of injectable paths is available in the [developer's documentation of Thyme](https://usethyme.com/documentation).
Adds the properties of the provided `reducers` to the targeted path. All the reducers in the object will be appended to the original, so you can overwrite existing reducers.

- `path: string`: Path to the reducer you want to extend.
- `reducers: Reducers`: Object of reducers you wish to append. For instance an object returned by `combineReducers` from `redux`.
- `store: ?Store<any>`: *Optional* **Use at own risk**. By default the store of the Thyme app is automatically registered. If you wish to use your own store for some reason, you can use this argument.

Example

```jsx harmony
registerReducer(
  'projects.project', 
  { 
    rate: function (state, action) {
      // your reducer here
    } 
  },
);
```

### `injectEpic(epic: (action$: ActionsObservable, state$: StateObservable) => any)`

Register an epic asynchronously which is used by [`redux-observable`](https://redux-observable.js.org/).
Allows you to listen and act upon fired actions and orchestrate side-effects.

[Read more about epics on the redux-observable documentation](https://redux-observable.js.org/docs/basics/Epics.html).

- `epic: (action$: Observable<Action>, state$: StateObservable) => Observable<Action>` Epic you wish to inject into the `BehaviorSubject`.

Example

```jsx harmony
injectEpic((action$: ActionsObservable, state$: StateObservable) => action$.pipe(...))
```

## Adding a new registerable function in Thyme

Use `invoke` to add a new function which can be registered. Pass in the `name` and `function` to be
executed.

Will automatically execute any previously called function calls and their arguments.

## How it works internally:

This following illustrates how the `thyme-connect` layer works.

### External script's perspective

1. Import and call register function.
2. `thyme-connect` check if the Thyme function is available.
3. If it is available: call the function with the arguments.
4. If it's not available: store the call in an array with the arguments in the `window` object.

### Thyme's perspective

1. Import `thyme-connect` layer.
2. Register the register function as available.
3. Execute list of calls stored in `thyme-connect` if present in the `window` object.
