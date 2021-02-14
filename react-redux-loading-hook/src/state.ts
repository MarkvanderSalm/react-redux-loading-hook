import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadingModule } from "./types";

export type LoadingState = {
  registeredLoadingModules: string[];
  actionTriplets: { [actionTripletName: string]: boolean };
  startActions: string[];
  finishActions: string[];
  errorActions: string[];
};

const initialState: LoadingState = {
  registeredLoadingModules: [],
  actionTriplets: {},
  startActions: [],
  finishActions: [],
  errorActions: [],
};

const loadingModulesSlice = createSlice({
  name: "loadingState",
  initialState,
  reducers: {
    setIsLoading: (
      state,
      action: PayloadAction<{ actionNames: string[]; isLoading: boolean }>
    ) => {
      action.payload.actionNames.forEach((atn) => {
        state.actionTriplets[atn] = action.payload.isLoading;
      });
      return state;
    },
    registerLoadingModule: (state, action: PayloadAction<LoadingModule>) => {
      state.registeredLoadingModules = [
        ...new Set(state.registeredLoadingModules.concat(action.payload.name)),
      ];

      const startActions = action.payload.actionTriplets.map((at) => at[0]);
      state.startActions = [
        ...new Set(state.startActions.concat(startActions)),
      ];

      const finishActions = action.payload.actionTriplets.map((at) => at[1]);
      state.finishActions = [
        ...new Set(state.finishActions.concat(finishActions)),
      ];

      const errorActions = action.payload.actionTriplets.map((at) => at[2]);
      state.errorActions = [
        ...new Set(state.errorActions.concat(errorActions)),
      ];

      action.payload.actionTriplets.forEach((at) => {
        state.actionTriplets[`${at[0]}-${at[1]}-${at[2]}`] = false;
      });

      return state;
    },
  },
});

const { actions, reducer } = loadingModulesSlice;

export const setIsLoadingCreator = actions.setIsLoading;
export const registerLoadingModuleCreator = actions.registerLoadingModule;

export const loadingStateReducer = reducer;
