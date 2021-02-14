import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  createLoadingMiddleware,
  loadingStateReducer,
} from "react-redux-loading-hook";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { exampleReducer, fetchNonExistentEpic, fetchPostEpic } from "./state";

const rootEpic = combineEpics(fetchPostEpic, fetchNonExistentEpic);

const rootReducer = combineReducers({
  loadingState: loadingStateReducer,
  data: exampleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export const getLoadingState = (state: RootState) => state.loadingState;

const loadingMiddleware = createLoadingMiddleware(getLoadingState);
const epicMiddleware = createEpicMiddleware();

const createStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [epicMiddleware, loadingMiddleware],
  });

  epicMiddleware.run(rootEpic);

  return store;
};

export const store = createStore();
