import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Epic } from "redux-observable";
import { ajax, AjaxError } from "rxjs/ajax";
import { catchError, delay, filter, map, mergeMap } from "rxjs/operators";
import { RootState } from "./store";

type Post = { userId: number; id: number; title: string; body: string };

type State = {
  data?: Post;
  error?: {
    message: string;
    status: number;
  };
};

const initialState: State = {
  data: undefined,
  error: undefined,
};

const slice = createSlice({
  name: "example",
  initialState,
  reducers: {
    fetchPostSuccess: (state, action: PayloadAction<Post>) => {
      state.data = action.payload;
      return state;
    },
    fetchNonExistent: (state) => {
      state.error = undefined;
      return state;
    },
    fetchNonExistentError: (state, action: PayloadAction<AjaxError>) => {
      state.error = action.payload;
      return state;
    },
  },
});

const { actions, reducer } = slice;

export const exampleReducer = reducer;

export const fetchPostCreator = createAction("example/fetchPost");
export const fetchPostSuccessCreator = actions.fetchPostSuccess;
export const fetchPostErrorCreator = createAction("example/fetchPostError");

export const fetchNonExistentCreator = actions.fetchNonExistent;
export const fetchNonExistentSuccessCreator = createAction(
  "example/fetchErrorSuccess"
);
export const fetchNonExistentErrorCreator = actions.fetchNonExistentError;

export const fetchPostEpic: Epic = (action$) =>
  action$.pipe(
    filter(fetchPostCreator.match),
    delay(1000),
    mergeMap(() => {
      const id = Math.floor(Math.random() * 100);
      return ajax
        .getJSON<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .pipe(map(fetchPostSuccessCreator));
    })
  );

export const fetchNonExistentEpic: Epic = (action$) =>
  action$.pipe(
    filter(fetchNonExistentCreator.match),
    delay(1000),
    mergeMap(() => {
      return ajax
        .getJSON("https://jsonplaceholder.typicode.com/posts/123456789")
        .pipe(
          catchError((e: AjaxError) => {
            return [fetchNonExistentErrorCreator(e)];
          })
        );
    })
  );

export const getData = (state: RootState) => state.data;
