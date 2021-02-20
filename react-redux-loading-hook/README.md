# React-Redux Loading Hook

This package provides the tools for managing loading state on asynchronous operations in Redux and to retrieve that state via a React hook. This is useful for when your app is, for example, fetching data from an API and you want to indicate this to your user by showing or hiding content.

The package uses [Redux](https://redux.js.org/) for managing the loading state and works well with packages like [redux-observable](https://redux-observable.js.org/) that rely on pairs of Redux actions for starting and handling the results of asynchronous operations.

## Example

Check the example in the `example` directory, which is a basic Next.js application showcasing this package's functionality. It uses `redux-observable` for handling AJAX requests.

## Installation

```
npm install react-redux-loading-hook
```

or

```
yarn add react-redux-loading-hook
```

## Usage

First you will need to configure your Redux store by adding a reducer that stores the loading state and by adding a middleware that dispatches actions for setting the state. Both are provided by this package.

```js
import { createLoadingMiddleware, loadingStateReducer } from "react-redux-loading-hook";
import { createStore, applyMiddleware } from "redux";

// combine the loadingStateReducer with your other reducers
const rootReducer = combineReducers({
    loadingState: loadingStateReducer,
    ...
});

// create a selector function for getting the loading state from the store;
// we're exporting it because we need it elsewhere (see below)
export const getLoadingState = (state) => state.loadingState;

// create the middleware; it needs to know where the loading state is stored, so pass in
// the selector
const loadingMiddleware = createLoadingMiddleware(getLoadingState);

// create the store, passing in the root reducer and the middleware
const store = createStore(rootReducer, applyMiddleware(loadingMiddleware));
```

This package does not actually export a hook, but rather a function that creates a hook. Similar to the middleware, the hook also needs to know where the loading state is stored.

```js
// the selector function for getting the loading state from the store (see above)
import { getLoadingState } from "...";

// create the hook, passing in the selector, and export it for use in your components
export const useLoading = createUseLoading(getLoadingState);
```

Now you're ready to use the hook. The `useLoading` hook (or whatever you named it) takes one parameter: a loading module. A loading module defines an array of action triplets for which the loading state should be retrieved.

An action triplet is an array that contains three Redux action `type` names. The first is the 'start action', which, when dispatched, sets the loading state to `true`. The other two are the 'success action' and 'error action' respectively, which, when dispatched, set the loading state back to `false`.

The loading module also needs a unique name, which is used internally.

```jsx
import React from "react";
import { useLoading } from "...";

const loadingModule = new LoadingModule({
    name: "example",
    actionTriplets: [
        ["startAction", "successAction", "errorAction"],
        ...
    ]
});

const LoadingText = () => {
    const isLoading = useLoading(loadingModule);

    return isLoading ? <span>Loading...</span> : <span>Not loading!</span>;
};

```

Now when the Redux action of `type` `startAction` is dispatched, the `useLoading` hook will return `true` and the `LoadingText` component will render `Loading...`. When the asynchronous operation is finished, either successfully or with an error, and the appropriate action (either `successAction` or `errorAction`) is dispatched, the state is set back to `false` and the component will render `Not loading!`.

## Options

### Default error actions per instance

Loading modules can be created with a default error action. This is useful when you want to handle multiple error cases by dispatching the same Redux action. To do this, set the `defaultErrorAction` property on the config object passed into the loading module's constructor and omit the third element (the error action) in your action triplets:

```js
const loadingModule = new LoadingModule({
    name: "example",
    actionTriplets: [
        ["startAction", "successAction"],
        ...
    ],
    defaultErrorAction: "errorAction"
});
```

Note that it's possible to use both explicitly set error actions and a default error action in one loading module. Explicitly set error actions take precendence over the default error action, so you can, for example, use the default for all but one action triplet, should you want to.

### Global default error action

Alternatively, you can also set a default error action for all loading modules in one go. Import the `LoadingModule` object and set its `defaultErrorAction` static property. The type you set here will be used if you set neither an explicit error action or a default error action during instance creation.

```js
import { LoadingModule } from "react-redux-loading-hook";

LoadingModule.defaultErrorAction = "errorAction";
```

Note that if you wish any newly created loading module objects to use the global default error action, you must ensure that the code that sets the static property runs before the `LoadingModule` instances are created!

## Motivation

It's a lot of work to manually set and retrieve loading state all over an application, so I wanted to make this easier. I preferred having more of a reactive approach, so I decided I'd design it in such a way that you can just say "give me the loading state for this action" and have the library figure out the rest.

Because almost any web application needs to track loading state for improving the user experience, I decided to make an NPM package so I can easily reuse the system in other React + Redux applications.

## Tips

If you're calling the same end-points from multiple places in your application, export the associated loading module so you can easily re-use it.

## TypeScript

This package supports TypeScript. It was written in TypeScript and its types come bundled with it.
